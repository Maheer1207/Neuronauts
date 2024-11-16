// src/components/NotesPanel.js
import React, { useState } from "react";

function NotesPanel() {
    const [note, setNote] = useState("");
    const [notes, setNotes] = useState([]);

    const handleSaveNote = () => {
        const timestamp = new Date().toLocaleTimeString();
        setNotes([...notes, { text: note, time: timestamp }]);
        setNote(""); // Clear input after saving
    };

    return (
        <div>
            <h2>Session Notes</h2>
            <textarea
                rows="4"
                style={styles.textarea}
                placeholder="Type your note here..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />
            <button style={styles.button} onClick={handleSaveNote}>
                Save Note
            </button>
            <div style={styles.notesList}>
                <h3>Saved Notes</h3>
                <ul>
                    {notes.map((note, index) => (
                        <li key={index} style={styles.noteItem}>
                            <strong>{note.time}</strong>: {note.text}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

const styles = {
    textarea: {
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "4px",
        border: "1px solid #ddd",
    },
    button: {
        padding: "8px 16px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
    notesList: {
        marginTop: "20px",
        maxHeight: "200px",
        overflowY: "auto",
        borderTop: "1px solid #ddd",
        paddingTop: "10px",
    },
    noteItem: {
        marginBottom: "8px",
    },
};

export default NotesPanel;
