// src/App.js
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Dashboard from "./components/Dashboard";


function App() {
    const [data, setData] = useState([]);
    const [mood, setMood] = useState("");

    useEffect(() => {
        // Connect to the WebSocket server
        const socket = io("http://localhost:5000");

        // Emit the start_stream event to trigger EEG data streaming
        socket.emit("start_stream");
        console.log("WebSocket start_stream event emitted");

        // Listen for eeg_data event from the backend
        socket.on("eeg_data", (payload) => {
            console.log("Received data from backend:", payload); // Debug log
            setData(payload.data);
            setMood(payload.mood);
        });

        // Cleanup on component unmount
        return () => socket.disconnect();
    }, []);

    const patientName = "John Doe"; // Replace with actual patient name if available

    return (
      <Dashboard patientName={patientName} />
    );
}

export default App;
