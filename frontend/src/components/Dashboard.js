// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import EEGVisualization from "./EEGVisualization";
import NotesPanel from "./NotesPanel";
import SoundVisualizer from "./SoundVisualizer";
import { io } from "socket.io-client";
import "../colors.css";
import windEMDR from "../audio/windEMDR.mp3";

function Dashboard({ patientName }) {
    const [data, setData] = useState([[], [], [], [], []]); // Placeholder for EEG data (5 channels)
    const [mood, setMood] = useState("");

    useEffect(() => {
        const socket = io("http://localhost:5000");
        socket.emit("start_stream");

        socket.on("eeg_data", (payload) => {
            setData(payload.data);
            setMood(payload.mood);
        });

        return () => socket.disconnect();
    }, []);

    return (
        <div style={styles.dashboardContainer}>
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>Patient Dashboard</h1>
                <h2 style={styles.subtitle}>Patient: {patientName}</h2>
            </div>

            {/* Content */}
            <div style={styles.content}>
                {/* Left Panel (EEG Visualization and Sound) */}
                <div style={styles.leftPanel}>
                    <div style={styles.graphCard}>
                        <h3 style={styles.mood}>Current Mood: {mood}</h3>
                        <EEGVisualization data={data} />
                    </div>

                    <div style={styles.soundCard}>
                        <h3 style={styles.mood}>Audio Visualization</h3>
                        <SoundVisualizer audioFile={windEMDR} mood={mood} />
                    </div>
                </div>

                {/* Right Panel (Notes) */}
                <div style={styles.rightPanel}>
                    <div style={styles.notesCard}>
                        <NotesPanel />
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    dashboardContainer: {
        fontFamily: "'Roboto', Arial, sans-serif",
        padding: "20px",
        backgroundColor: "white",
        minHeight: "100vh",
    },
    header: {
        textAlign: "center",
        marginBottom: "20px",
        color: "var(--text-primary)",
    },
    title: {
        fontSize: "2.5rem",
        fontWeight: "bold",
        margin: 0,
        color: "var(--blue-green)",
    },
    subtitle: {
        fontSize: "1.5rem",
        fontWeight: "300",
        color: "var(--text-secondary)",
    },
    content: {
        display: "flex",
        gap: "20px",
    },
    leftPanel: {
        flex: 2,
    },
    rightPanel: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    graphCard: {
        borderRadius: "20px",
        padding: "20px",
        background: "white",
        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
        border: "none",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
    },
    soundCard: {
        marginTop: "20px",
        borderRadius: "20px",
        padding: "20px",
        background: "white",
        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
        border: "none",
        position: "relative",
        textAlign: "center",
    },
    notesCard: {
        borderRadius: "20px",
        width: "100%",
        height: "93%",
        padding: "20px",
        background: "linear-gradient(135deg, rgba(112, 193, 179, 1), rgba(44, 127, 184, 1))",
        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
        border: "none",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        overflow: "hidden",
    },
    mood: {
        marginTop: "20px",
        textAlign: "center",
        fontSize: "1.1rem",
        color: "var(--prussian-blue)",
    },
};

export default Dashboard;
