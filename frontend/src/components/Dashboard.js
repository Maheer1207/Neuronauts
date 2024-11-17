import React, { useState, useEffect } from "react";
import EEGVisualization from "./EEGVisualization";
import NotesPanel from "./NotesPanel";
import SoundVisualizer from "./SoundVisualizer";
import { io } from "socket.io-client";
import "../colors.css";
import windEMDR from "../audio/windEMDR.mp3";

function Dashboard({ patientName }) {
    const [data, setData] = useState([[], [], [], [], []]); // Placeholder for EEG data (5 channels)
    const [mood, setMood] = useState("Unknown");

    useEffect(() => {
        const socket = io("http://localhost:5000");
        socket.emit("start_stream");

        socket.on("eeg_data", (payload) => {
            if (payload?.data && Array.isArray(payload.data) && payload.data.length === 5) {
                setData(payload.data);
            } else {
                console.warn("Invalid data format received from backend:", payload.data);
            }

            setMood(payload?.mood || "Unknown");
        });

        return () => socket.disconnect();
    }, []);

    return (
        <div style={styles.dashboardContainer}>
            {/* Header */}
            <div style={styles.firstLayer}>
                <div style={styles.header}>
                    <h1 style={styles.title}>Patient Dashboard</h1>
                </div>

                {/* Left Panel (EEG Visualization and Sound) */}
                <div style={styles.leftPanel}>
                    <div style={styles.graphCard}>
                        <h3 style={styles.mood}>Current Mood: {mood}</h3>
                        <EEGVisualization data={data} />
                    </div>
                    <div style={styles.visualContainer}>
                        <div style={styles.soundCard}>
                            <h3 style={styles.mood}>Audio Visualization</h3>
                            <SoundVisualizer audioFile={windEMDR} mood={mood} />
                        </div>
                        <div style={styles.videoCard}></div>
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
        textAlign: "left",
        marginBottom: "20px",
        color: "var(--text-primary)",
    },
    firstLayer: {
        display: "flex",
        gap: "20px",
    },
    title: {
        fontSize: "2.5rem",
        fontWeight: "bold",
        margin: 0,
        color: "var(--blue-green)",
        marginBottom: "25px",
    },
    subtitle: {
        fontSize: "1.5rem",
        fontWeight: "300",
        color: "var(--text-secondary)",
    },
    leftPanel: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    rightPanel: {
        flex: 0.8, // Reduced width for the right panel
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    visualContainer: {
        display: "flex",
        gap: "20px",
    },
    graphCard: {
        borderRadius: "20px",
        padding: "20px",
        background: "white",
        border: "none",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        textAlign: "center",

    },
    soundCard: {
        borderRadius: "20px",
        padding: "20px",
        background: "#fb8500", // Gradient background
        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
        border: "none",
        textAlign: "center",
        flex: 0.5,
    },
    videoCard: {
        borderRadius: "20px",
        padding: "20px",
        background: "#D81159", //linear-gradient(135deg, , rgba(255, 105, 180, 1))", // Gradient background
        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
        border: "none",
        textAlign: "center",
        flex: 0.5,
    },
    notesCard: {
        borderRadius: "10px", // Smaller border radius
        width: "90%", // Reduced width to fit better
        padding: "0px",
        background: "#006BA6",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)", // Reduced shadow intensity
        border: "none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        height: "auto", // Allow the height to adapt to content
        gap: "10px", // Add spacing between elements
    },
    mood: {
        marginBottom: "10px",
        textAlign: "center",
        fontSize: "1.2rem",
        fontWeight: "bold",
        color: "var(--prussian-blue)",
    },
};

export default Dashboard;