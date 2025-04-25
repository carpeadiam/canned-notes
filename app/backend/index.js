const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data
let notes = [
    { id: 1, title: 'First Note', content: 'This is the first note.' },
    { id: 2, title: 'Second Note', content: 'This is the second note.' },
];

// Routes
app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    const newNote = {
        id: notes.length + 1,
        title: req.body.title,
        content: req.body.content,
    };
    notes.push(newNote);
    res.status(201).json(newNote);
});

app.put('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id, 10);
    const noteIndex = notes.findIndex((note) => note.id === noteId);

    if (noteIndex !== -1) {
        notes[noteIndex] = { id: noteId, ...req.body };
        res.json(notes[noteIndex]);
    } else {
        res.status(404).json({ message: 'Note not found' });
    }
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id, 10);
    const noteIndex = notes.findIndex((note) => note.id === noteId);

    if (noteIndex !== -1) {
        notes.splice(noteIndex, 1);
        res.status(204).send();
    } else {
        res.status(404).json({ message: 'Note not found' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});