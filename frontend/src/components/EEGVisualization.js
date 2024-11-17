// src/components/EEGVisualization.js
import React from "react";
import Plot from "react-plotly.js";
import "../colors.css"; // Import the color palette

function EEGVisualization({ data }) {
  // Predefined channel names
  const channelNames = ["TP9", "AF7", "AF8", "TP10", "Right AUX"];

  const plotData =
    Array.isArray(data) && data.length > 0
      ? data.map((channel, index) => ({
          x: Array.from({ length: channel.length }, (_, i) => i), // Time (x-axis)
          y: channel, // Channel data (y-axis)
          type: "scatter",
          mode: "lines",
          name: channelNames[index] || `Channel ${index + 1}`, // Use predefined name or fallback
          line: {
            color: [
              "var(--blue-green)",
              "var(--sky-blue)",
              "var(--ut-orange)",
              "var(--selective-yellow)",
            ][index % 4], // Assign a unique color to each channel
            width: 2.5, // Slightly thicker lines for better visibility
          },
        }))
      : [];

  return (
    <div style={styles.container}>
      <div style={styles.graphWrapper}>
        {" "}
        {/* Wrapper for rounded corners */}
        <Plot
          data={plotData}
          layout={{
            title: {
              text: "Real-Time EEG Data (5 Channels)",
              font: {
                family: "'Roboto', Arial, sans-serif",
                size: 20,
                color: "black", // Title in white for contrast
              },
              xanchor: "center",
            },
            xaxis: {
              title: { text: "Time (ms)", font: { color: "white" } },
              gridcolor: "rgba(255, 255, 255, 0.2)", // Subtle white gridlines
              zerolinecolor: "rgba(255, 255, 255, 0.3)",
            },
            yaxis: {
              title: { text: "Amplitude (µV)", font: { color: "white" } },
              autorange: true, // Automatically adjust range
              gridcolor: "rgba(255, 255, 255, 0.2)", // Subtle white gridlines
              zerolinecolor: "rgba(255, 255, 255, 0.3)",
            },
            plot_bgcolor: "var(--sky-blue)", // Plot area background
            paper_bgcolor: "var(--blue-green)", // Entire chart background
            margin: { l: 50, r: 30, t: 60, b: 50 }, // Padding around the chart
            showlegend: true,
            legend: {
              font: {
                color: "black",
                size: 12,
              },
              orientation: "h",
              x: 0.5,
              xanchor: "center",
              y: -0.2,
            },
          }}
          config={{
            scrollZoom: true, // Enable scroll to zoom
            displayModeBar: true, // Show toolbar for interactions
            modeBarButtonsToAdd: ["zoom2d", "pan2d", "resetScale2d"], // Add zoom/pan options
            displaylogo: false, // Remove Plotly logo from toolbar
          }}
          style={{ width: "100%", height: "100%" }} // Fill wrapper container
        />
      </div>
    </div>
  );
}


const styles = {
  container: {
    borderRadius: "20px",
    overflow: "hidden", // Ensures inner content respects border radius
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)", // Add shadow for depth
    background: "#FFBC42", // Adjusted gradient
    padding: "20px",
    border: "1px solid rgba(255, 255, 255, 0.3)", // Subtle border for separation
  },
  graphWrapper: {
    borderRadius: "15px", // Rounds the graph
    overflow: "hidden", // Clips Plotly's graph to match the border radius
    width: "100%", // Ensures the graph scales properly
    height: "400px", // Set a specific height for the graph
  },
};

export default EEGVisualization;