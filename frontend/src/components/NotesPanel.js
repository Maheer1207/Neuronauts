import React, { useState, useEffect } from "react";
import '../colors.css';

function NotesPanel() {
    const [note, setNote] = useState("");
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        // Simulate fetching historical notes from a server on component mount
        const historicalData = [
            { text: "Patient feels better after medication adjustment.", time: "10:00 AM, Oct 10, 2023" },
            { text: "Follow-up required in one week.", time: "11:30 AM, Oct 3, 2023" },
            // More historical notes can be added here
        ];
        setNotes(historicalData);
    }, []);

    const handleSaveNote = () => {
        const timestamp = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        // Add the new note at the beginning of the list
        setNotes(prevNotes => [{ text: note, time: timestamp }, ...prevNotes]);
        setNote(""); // Clear input after saving
    };

    return (
        <div style={styles.gradientWrapper}>
            <div style={styles.container}>
                <h2 style={styles.header}>Patient Notes</h2>
                <textarea
                    rows="10"
                    style={styles.textareaLarge}
                    placeholder="Type your note here..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
                <button style={styles.button} onClick={handleSaveNote}>
                    Save Note
                </button>
                <div style={styles.notesList}>
                    <h3>Session History</h3>
                    <ul style={styles.noteItems}>
                        {notes.map((note, index) => (
                            <li key={index} style={styles.noteItem}>
                                <strong>{note.time}</strong>
                                <div style={styles.noteText}>{note.text}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

const styles = {
    gradientWrapper: {
        padding: "15px",
        background: "linear-gradient(135deg, rgba(112, 193, 179, 1), rgba(44, 127, 184, 1))",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        borderRadius: "25px",
        position: "relative",
        overflow: "hidden",
    },
    container: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: "20px",
        width: "100%",
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "center",
        textAlign: "center",
    },
    header: {
        fontSize: "1.8rem",
        marginBottom: "10px",
        color: "var(--prussian-blue)",
        fontWeight: "bold",
    },
    textareaLarge: {
        width: "100%",
        maxWidth: "800px",
        height: "300px",
        padding: "12px",
        marginBottom: "12px",
        borderRadius: "10px",
        border: "2px solid var(--blue-green)",
        fontFamily: "'Roboto', Arial, sans-serif",
        fontSize: "1.2rem",
        backgroundColor: "#f9fafc",
        color: "var(--prussian-blue)",
        outline: "none",
        boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)",
        resize: "none",
    },
    button: {
        marginTop: "10px",
        padding: "12px 20px",
        backgroundColor: "var(--blue-green)",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "1.1rem",
        fontWeight: "bold",
        transition: "background-color 0.3s ease, transform 0.2s ease",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
    },
    notesList: {
        width: "100%",
        maxWidth: "800px",
        marginTop: "20px",
        borderTop: "2px solid var(--border-color)",
        paddingTop: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    noteItems: {
        listStyleType: "none",
        padding: 0,
        margin: 0,
    },
    noteItem: {
        padding: "15px 20px",
        backgroundColor: "#f1f5f9",
        borderRadius: "12px",
        fontSize: "1rem",
        color: "var(--prussian-blue)",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        marginTop: "10px",
        textAlign: "left",
    },
    noteText: {
        fontSize: "1rem",
        color: "var(--prussian-blue)",
        lineHeight: "1.5",
        textAlign: "left",
    },
};

export default NotesPanel;