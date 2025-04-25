// Frontend: /workspaces/canned-notes/app/frontend/index.js

// Function to fetch all notes from the backend
async function fetchNotes() {
    try {
        const response = await fetch('http://localhost:3000/api/notes');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const notes = await response.json();
        displayNotes(notes);
    } catch (error) {
        console.error('Error fetching notes:', error);
    }
}

// Function to create a new note
async function createNote() {
    const title = prompt('Enter note title:');
    const content = prompt('Enter note content:');
    if (!title || !content) return;

    try {
        const response = await fetch('http://localhost:3000/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const newNote = await response.json();
        console.log('Note created:', newNote);
        fetchNotes(); // Refresh notes
    } catch (error) {
        console.error('Error creating note:', error);
    }
}

// Function to update a note
async function updateNote() {
    const id = prompt('Enter note ID to update:');
    const title = prompt('Enter new note title:');
    const content = prompt('Enter new note content:');
    if (!id || !title || !content) return;

    try {
        const response = await fetch(`http://localhost:3000/api/notes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content }),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const updatedNote = await response.json();
        console.log('Note updated:', updatedNote);
        fetchNotes(); // Refresh notes
    } catch (error) {
        console.error('Error updating note:', error);
    }
}

// Function to delete a note
async function deleteNote() {
    const id = prompt('Enter note ID to delete:');
    if (!id) return;

    try {
        const response = await fetch(`http://localhost:3000/api/notes/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Note deleted');
        fetchNotes(); // Refresh notes
    } catch (error) {
        console.error('Error deleting note:', error);
    }
}

// Function to display notes on the page
function displayNotes(notes) {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = ''; // Clear previous content

    notes.forEach((note) => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note';
        noteDiv.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <small>ID: ${note.id}</small>
        `;
        appDiv.appendChild(noteDiv);
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const appDiv = document.createElement('div');
    appDiv.id = 'app';
    document.body.appendChild(appDiv);

    const fetchButton = document.createElement('button');
    fetchButton.textContent = 'Fetch Notes';
    fetchButton.onclick = fetchNotes;
    document.body.appendChild(fetchButton);

    const createButton = document.createElement('button');
    createButton.textContent = 'Create Note';
    createButton.onclick = createNote;
    document.body.appendChild(createButton);

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update Note';
    updateButton.onclick = updateNote;
    document.body.appendChild(updateButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete Note';
    deleteButton.onclick = deleteNote;
    document.body.appendChild(deleteButton);

    // Fetch notes on page load
    fetchNotes();
});