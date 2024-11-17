import React from "react";
import YouTube from "react-youtube";

const VideoVisualizer = () => {
    const opts = {
        playerVars: {
            autoplay: 0, // Do not autoplay the video
        },
    };

    const onPlayerReady = (event) => {
        console.log("Player is ready");
    };

    return (
        <div style={styles.videoContainer}>
            <YouTube videoId="Xt4pzFTC070" opts={opts} style={styles.youtube} />
        </div>
    );
};

const styles = {
    videoContainer: {
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden", // Ensures the rounded edges are applied
        borderRadius: "10px", // Makes the video edges rounded
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    youtube: {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        borderRadius: "inherit", // Inherit the rounded edges from the parent container
    },
};

export default VideoVisualizer;
