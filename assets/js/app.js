class AppBar extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<h1>Notes App</h1>`;
  }
}

customElements.define("app-bar", AppBar);

class NoteItem extends HTMLElement {
  set note(data) {
    this.innerHTML = `
            <h2>${data.title}</h2>
            <p>${data.body}</p>
            <small>Created at: ${new Date(
              data.createdAt
            ).toLocaleDateString()}</small>
        `;
  }
}

customElements.define("note-item", NoteItem);

class NoteForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
            <form id="note-form">
                <input type="text" id="note-title" placeholder="Note Title" required>
                <textarea id="note-body" placeholder="Note Body" required></textarea>
                <button type="submit" id="submit-btn" disabled>Add Note</button>
                <span id="error-message" style="color: red; display: none;"></span>
            </form>
        `;

    this.noteTitle = this.querySelector("#note-title");
    this.noteBody = this.querySelector("#note-body");
    this.submitBtn = this.querySelector("#submit-btn");
    this.errorMessage = this.querySelector("#error-message");

    this.noteTitle.addEventListener("input", () => this.validateForm());
    this.noteBody.addEventListener("input", () => this.validateForm());

    this.querySelector("#note-form").addEventListener("submit", (event) => {
      event.preventDefault();
      this.addNote();
    });
  }

  validateForm() {
    const titleValid = this.noteTitle.value.trim() !== "";
    const bodyValid = this.noteBody.value.trim() !== "";

    if (titleValid && bodyValid) {
      this.submitBtn.disabled = false;
      this.errorMessage.style.display = "none";
    } else {
      this.submitBtn.disabled = true;
      this.errorMessage.style.display = "block";

      if (!titleValid && !bodyValid) {
        this.errorMessage.textContent = "Title dan Body tidak boleh kosong";
      } else if (!titleValid) {
        this.errorMessage.textContent = "Title tidak boleh kosong";
      } else {
        this.errorMessage.textContent = "Body tidak boleh kosong";
      }
    }
  }

  addNote() {
    const newNote = {
      id: `notes-${Date.now()}`,
      title: this.noteTitle.value.trim(),
      body: this.noteBody.value.trim(),
      createdAt: new Date().toISOString(),
      archived: false,
    };

    notesData.push(newNote);
    this.dispatchEvent(new CustomEvent("note-added", { detail: newNote }));
    this.resetForm();
  }

  resetForm() {
    this.noteTitle.value = "";
    this.noteBody.value = "";
    this.submitBtn.disabled = true;
    this.errorMessage.style.display = "none";
  }
}

customElements.define("note-form", NoteForm);

const notesContainer = document.querySelector("#notes-container");

function displayNotes(notes) {
  notesContainer.innerHTML = "";
  notes.forEach((note) => {
    const noteItem = document.createElement("note-item");
    noteItem.note = note;
    notesContainer.appendChild(noteItem);
  });
}

document.querySelector("note-form").addEventListener("note-added", (event) => {
  displayNotes(notesData);
});

displayNotes(notesData);

class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<h3>Submission: Membangun Notes App</h3>`;
  }
}

customElements.define("app-footer", AppFooter);
