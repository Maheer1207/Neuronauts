// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import EEGVisualization from "./EEGVisualization";
import NotesPanel from "./NotesPanel";
import SoundVisualizer from "./SoundVisualizer";
import VideoVisualizer from "./VideoVisualizer";
import { io } from "socket.io-client";
import "../colors.css";
import windEMDR from "../audio/windEMDR.mp3";
import ticktockEMDR from "../audio/ticktockEMDR.mp3";

function Dashboard({ patientName }) {
    const [data, setData] = useState([[], [], [], [], []]); // Placeholder for EEG data (5 channels)
    const [mood, setMood] = useState("");
    const [audioFile, setAudioFile] = useState(windEMDR); // Default audio file

    useEffect(() => {
        const socket = io("http://localhost:5000");
        socket.emit("start_stream");

        socket.on("eeg_data", (payload) => {
            setData(payload.data);
            setMood(payload.mood);
        });

        return () => socket.disconnect();
    }, []);

    const handleAudioChange = (event) => {
        setAudioFile(event.target.value); // Update the selected audio file
    };

    return (
        <div style={styles.dashboardContainer}>
            {/* Header */}
            
            <div style={styles.firstLayer}>

            <div style={styles.header}>
                <h2 style={styles.title}>Therapist Dashboard</h2>
                {/* Content */}
            <div style={styles.content}>
                {/* Right Panel (Notes) */}
                <div style={styles.rightPanel}>
                    <div style={styles.notesCard}>
                        <NotesPanel />
                    </div>
                </div>                
            </div>
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
                            {/* Pass selected audio file to SoundVisualizer */}
                            <SoundVisualizer audioFile={audioFile} mood={mood} />
                            <select
                                    style={styles.dropdown}
                                    value={audioFile}
                                    onChange={handleAudioChange}
                                >
                                    <option value={windEMDR}>Wind EMDR</option>
                                    <option value={ticktockEMDR}>Tick Tock EMDR</option>
                                </select>
                        </div>


                    <div style={styles.videoCard}>
                        <h3 style={styles.mood}>Therapy Video</h3>
                        <VideoVisualizer/>
                        </div>;
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
        fontSize: "2.0rem",
        fontWeight: "bold",
        margin: 0,
        color: "var(--blue-green)",
        marginBottom: "50px",
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
        gap: "10px",    },
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
        height:500
    },
    dropdown: {
        marginTop: "15px", // Add some top margin
        padding: "8px 12px", // Adjust padding for better alignment
        fontSize: "1rem", // Keep the font size consistent
        borderRadius: "8px", // Round the corners more
        border: "1px solid #ddd", // Light border for a clean look
        background: "white", // Set a clean background color
        color: "#333", // Slightly darker text for readability
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Add a subtle shadow for depth
        transition: "box-shadow 0.3s, border-color 0.3s", // Smooth transitions
        lineHeight: "1.5", // Ensure consistent line height
    },
    videoCard: {
        borderRadius: "20px",
        padding: "30px", // Remove padding to ensure the video fully fills
        background: "#D81159",
        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
        border: "none",
        flex: 0.5,
        position: "relative", // Required for absolute positioning inside
        overflow: "hidden", // Prevent content from overflowing
        height: "500", // Ensure the video fills the container
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
        marginBottom: "15cpx", // Remove any extra bottom margin
        textAlign: "center",
        fontSize: "1.2rem",
        fontWeight: "bold",
        color: "var(--prussian-blue)",
        lineHeight: "1.5", // Match line height with the dropdown
    },
};

export default Dashboard;
