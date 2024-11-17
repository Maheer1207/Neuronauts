import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { FaPlay, FaPause, FaFastForward, FaFastBackward } from "react-icons/fa";
import { MdFastForward, MdFastRewind } from "react-icons/md";
import "../colors.css";

const SoundVisualizer = ({ audioFile }) => {
    const waveSurferRef = useRef(null); // Reference to the WaveSurfer instance
    const containerRef = useRef(null); // Reference to the waveform container
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0); // Track current playback speed

    useEffect(() => {
        // Initialize WaveSurfer
        waveSurferRef.current = WaveSurfer.create({
            container: containerRef.current,
            waveColor: "orange",
            progressColor: "var(--selective-yellow)",
            cursorColor: "#ffb703",
            barWidth: 2,
            barRadius: 2,
            responsive: true,
            height: 100,
        });

        waveSurferRef.current.load(audioFile);

        return () => {
            // Cleanup WaveSurfer instance
            if (waveSurferRef.current) {
                try {
                    waveSurferRef.current.destroy();
                } catch (error) {
                    console.error("Error during WaveSurfer cleanup:", error);
                } finally {
                    waveSurferRef.current = null; // Ensure reference is cleared
                }
            }
        };
    }, [audioFile]);

    const togglePlay = () => {
        if (waveSurferRef.current?.isPlaying()) {
            waveSurferRef.current.pause();
        } else {
            waveSurferRef.current.play();
        }
        setIsPlaying((prev) => !prev);
    };

    const incrementSpeed = (step) => {
        const newSpeed = Math.min(playbackSpeed + step, 5.0); // Cap at 5.0x
        setPlaybackSpeed(newSpeed);
        if (waveSurferRef.current) {
            waveSurferRef.current.setPlaybackRate(newSpeed);
        }
    };

    const decrementSpeed = (step) => {
        const newSpeed = Math.max(playbackSpeed - step, 1); // Minimum at 0.5x
        setPlaybackSpeed(newSpeed);
        if (waveSurferRef.current) {
            waveSurferRef.current.setPlaybackRate(newSpeed);
        }
    };

    return (
        <div style={styles.container}>
            <div ref={containerRef} style={styles.waveform}></div>
            <div style={styles.infoContainer}>
                <p style={styles.speedLabel}>Speed: {playbackSpeed.toFixed(1)}x</p>
            </div>
            <div style={styles.controls}>
                <button onClick={() => decrementSpeed(1.0)} style={styles.controlButton}>
                    <FaFastBackward style={styles.icon} />
                </button>
                <button onClick={() => decrementSpeed(0.1)} style={styles.controlButton}>
                    <MdFastRewind style={{ ...styles.icon, fontSize: "28px" }} />
                </button>
                <button onClick={togglePlay} style={styles.controlButton}>
                    {isPlaying ? <FaPause style={styles.icon} /> : <FaPlay style={styles.icon} />}
                </button>
                <button onClick={() => incrementSpeed(0.1)} style={styles.controlButton}>
                    <MdFastForward style={{ ...styles.icon, fontSize: "28px" }} />
                </button>
                <button onClick={() => incrementSpeed(1.0)} style={styles.controlButton}>
                    <FaFastForward style={styles.icon} />
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        textAlign: "center",
        padding: "10px",
        background: "white",
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        height: "60%",
    },
    waveform: {
        width: "100%",
    },
    infoContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "10px",
    },
    speedLabel: {
        fontSize: "1.2rem",
        fontWeight: "bold",
        color: "gray",
    },
    controls: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
    },
    controlButton: {
        width: "60px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#fb8500",
        color: "white",
        border: "none",
        borderRadius: "50%",
        cursor: "pointer",
        fontSize: "0.9rem",
        transition: "background 0.3s",
    },
    controlButtonHover: {
        background: "darkpurple",
    },
    icon: {
        fontSize: "20px",
    },
};

export default SoundVisualizer;