// src/components/EEGVisualization.js
import React from "react";
import Plot from "react-plotly.js";

function EEGVisualization({ data }) {
    const plotData = Array.isArray(data) && data.length > 0
        ? data.map((channel, index) => ({
            x: Array.from({ length: channel.length }, (_, i) => i), // Time (x-axis)
            y: channel, // Channel data (y-axis)
            type: "scatter",
            mode: "lines",
            name: `Channel ${index + 1}`, // Label each channel
        }))
        : [];

    return (
        <Plot
            data={plotData}
            layout={{
                title: "Real-Time EEG Data (5 Channels)",
                xaxis: { title: "Time (ms)" },
                yaxis: {
                    title: "Amplitude (µV)",
                    range: [-0.0001, 0.0001],  // Set a zoomed-in default range for better visibility
                    autorange: true,           // Allow auto-scaling when zooming
                },
                height: 400,
                showlegend: true,
                autosize: true,
            }}
            config={{
                scrollZoom: true,  // Enable scroll to zoom
                displayModeBar: true,  // Show the toolbar with zoom options
                modeBarButtonsToAdd: ['zoom2d', 'pan2d', 'resetScale2d'],  // Add specific zoom/pan/reset options
            }}
        />
    );
}

export default EEGVisualization;
