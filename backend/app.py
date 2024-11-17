from flask import Flask
from flask_socketio import SocketIO, emit
from brainflow.board_shim import BoardShim, BrainFlowInputParams, BoardIds
import eventlet
import random
import threading
import time
import numpy as np
from scipy.signal import butter, filtfilt

# Initialize Flask and Flask-SocketIO
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
socketio = SocketIO(app, cors_allowed_origins="*")

# Configure BrainFlow
params = BrainFlowInputParams()
board_id = BoardIds.SYNTHETIC_BOARD.value
board = BoardShim(board_id, params)

# Global variable to store the current mood
current_mood = "Calm"

# Function to create bandpass filters
def bandpass_filter(data, lowcut, highcut, fs, order=5):
    nyquist = 0.5 * fs
    low = lowcut / nyquist
    high = highcut / nyquist
    b, a = butter(order, [low, high], btype='band')
    return filtfilt(b, a, data)

# Function to generate EEG-like signals for specific moods
def generate_mood_eeg(mood, n_samples=32, n_channels=5, fs=256):
    """Generate simulated EEG data for a specific mood with realistic frequency bands."""
    # Define frequency bands for different moods
    mood_bands = {
        "Calm": (8, 13),  # Alpha band
        "Anxious": (30, 50),  # High beta/gamma
        "Focused": (13, 30),  # Beta band
        "Happy": (8, 30),  # Mixed alpha and beta
    }
    lowcut, highcut = mood_bands.get(mood, (1, 50))  # Default to wideband
    eeg_data = []
    
    for _ in range(n_channels):
        # Generate random noise
        noise = np.random.normal(0, 0.1, n_samples * 2)  # Extra samples to avoid filter edge effects
        # Bandpass filter to simulate specific brainwave activity
        filtered_signal = bandpass_filter(noise, lowcut, highcut, fs)
        # Trim to desired number of samples and normalize
        filtered_signal = filtered_signal[:n_samples]
        filtered_signal = filtered_signal / max(abs(filtered_signal))  # Normalize to [-1, 1]
        eeg_data.append(filtered_signal)
    
    return np.array(eeg_data)

# Initialize BrainFlow board session with debugging
try:
    board.prepare_session()
    print("BrainFlow session prepared.")
    board.start_stream()
    print("BrainFlow streaming started.")
except Exception as e:
    print(f"Error in initializing BrainFlow: {e}")

@app.route('/')
def index():
    return "Flask Backend is Running"

# Function to update the mood every 10 seconds
def update_mood():
    global current_mood
    moods = ["Calm", "Anxious", "Focused", "Happy"]
    while True:
        current_mood = random.choice(moods)
        print(f"Updated mood: {current_mood}")
        time.sleep(10)

# Start the mood update function in a separate thread
threading.Thread(target=update_mood, daemon=True).start()

# WebSocket event for EEG data streaming
@socketio.on('connect')
def handle_connect():
    print("Client connected")
    emit('message', {'data': 'Connected to EEG backend!'})

@socketio.on('start_stream')
def stream_eeg():
    global current_mood
    print("Received start_stream event from frontend")

    try:
        while True:
            # Generate simulated EEG data based on current mood
            simulated_data = generate_mood_eeg(current_mood, n_samples=32, n_channels=5)
            print(f"Simulated EEG data (5 channels): {simulated_data[:, :6]}, Mood: {current_mood}")

            # Scale data to match expected range
            scaled_data = (simulated_data / 1e6).tolist()

            emit('eeg_data', {'data': scaled_data, 'mood': current_mood}, broadcast=True)
            socketio.sleep(1)  # Adjust delay for slower updates
    except Exception as e:
        print(f"Error in streaming EEG data: {e}")

@app.route('/shutdown')
def shutdown():
    board.stop_stream()
    board.release_session()
    print("Session stopped and resources released.")
    return "Session stopped and resources released."

# Run the Flask app with SocketIO
if __name__ == '__main__':
    try:
        print("Starting the Flask backend...")
        socketio.run(app, host='0.0.0.0', port=5000, debug=True)
    finally:
        print("Shutting down and releasing BrainFlow resources.")
        board.stop_stream()
        board.release_session()
