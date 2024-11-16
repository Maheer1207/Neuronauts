import React, { useState } from "react";
import '../colors.css';

function NotesPanel() {
    const [note, setNote] = useState("");
    const [notes, setNotes] = useState([]);

    const handleSaveNote = () => {
        const timestamp = new Date().toLocaleTimeString();
        setNotes([...notes, { text: note, time: timestamp }]);
        setNote(""); // Clear input after saving
    };

    return (
        <div style={styles.gradientWrapper}>
            <div style={styles.container}>
                <h2 style={styles.header}>Session Notes</h2>
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
                    <ul style={styles.noteItems}>
                        {notes.map((note, index) => (
                            <li key={index} style={styles.noteItem}>
                                <strong>{note.time}</strong>: {note.text}
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
        padding: "15px", // Increase padding for a thicker border
        background: "linear-gradient(135deg, rgba(112, 193, 179, 1), rgba(44, 127, 184, 1))", // Gradient background
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        borderRadius: "25px", // Maintain rounded corners
        position: "relative",
        overflow: "hidden", // Ensure rounded corners are applied to child elements
    },
    container: {
        backgroundColor: "rgba(255, 255, 255, 0.9)", // Slight transparency for inner container
        borderRadius: "20px", // Inner container radius should match gradient padding
        width: "100%",
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle inner shadow
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        alignItems: "center",
        textAlign: "center",
    },       
    header: {
        fontSize: "1.8rem",
        marginBottom: "10px",
        color: "var(--prussian-blue)", // Strong heading color
        fontWeight: "bold",
    },
    textarea: {
        width: "100%",
        maxWidth: "600px",
        padding: "12px",
        marginBottom: "12px",
        borderRadius: "10px",
        border: "2px solid var(--blue-green)", // Thicker border for modern look
        fontFamily: "'Roboto', Arial, sans-serif",
        fontSize: "1rem",
        backgroundColor: "#f9fafc", // Soft gray for readability
        color: "var(--prussian-blue)",
        outline: "none",
        boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.1)", // Inset shadow for depth
        transition: "border-color 0.3s ease",
    },
    textareaFocus: {
        borderColor: "var(--ut-orange)", // Highlight on focus
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
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)", // Elevated button shadow
    },
    buttonHover: {
        backgroundColor: "var(--ut-orange)", // Lively hover effect
        transform: "scale(1.05)", // Slight scale-up effect
    },
    notesList: {
        width: "100%",
        maxWidth: "600px",
        marginTop: "20px",
        borderTop: "2px solid var(--border-color)", // Strong separator
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
        backgroundColor: "#f1f5f9", // Subtle note background
        borderRadius: "12px",
        fontSize: "1rem",
        color: "var(--prussian-blue)",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Clean shadow for depth
        display: "flex",
        flexDirection: "column",
        gap: "5px",
    },
    noteTime: {
        fontSize: "0.9rem",
        color: "var(--text-secondary)", // Muted time color
        fontWeight: "bold",
    },
    noteText: {
        fontSize: "1rem",
        color: "var(--prussian-blue)", // Note text color
        lineHeight: "1.5",
    },
};



export default NotesPanel;
