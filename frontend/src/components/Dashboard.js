// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import EEGVisualization from "./EEGVisualization";
import NotesPanel from "./NotesPanel";
import { io } from "socket.io-client";

const ipAddress = process.env.REACT_APP_IP_ADDRESS;
const port = process.env.REACT_APP_PORT;

function Dashboard({ patientName }) {
    const [data, setData] = useState([[], [], [], []]); // Placeholder for EEG data (4 channels)
    const [mood, setMood] = useState("");

    useEffect(() => {
        const socket = io(`http://${ipAddress}:${port}`);
        socket.emit("start_stream");

        socket.on("eeg_data", (payload) => {
            setData(payload.data);
            setMood(payload.mood);
        });

        return () => socket.disconnect();
    }, []);

    return (
        <div style={styles.dashboardContainer}>
            <div style={styles.header}>
                <h1>Patient Dashboard</h1>
                <h2>Patient: {patientName}</h2>
            </div>
            <div style={styles.content}>
                <div style={styles.leftPanel}>
                    <EEGVisualization data={data} />
                    <h3>Current Mood: {mood}</h3>
                </div>
                <div style={styles.rightPanel}>
                    <NotesPanel />
                </div>
            </div>
        </div>
    );
}

const styles = {
    dashboardContainer: {
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        color: "#333",
    },
    header: {
        textAlign: "center",
        paddingBottom: "20px",
        borderBottom: "1px solid #ddd",
    },
    content: {
        display: "flex",
        marginTop: "20px",
    },
    leftPanel: {
        flex: 2,
        marginRight: "20px",
    },
    rightPanel: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    },
};

export default Dashboard;
