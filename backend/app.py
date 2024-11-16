from flask import Flask
from flask_socketio import SocketIO, emit
from brainflow.board_shim import BoardShim, BrainFlowInputParams, BoardIds
import eventlet
import random
from dotenv import load_dotenv
import os

# Load .env file
dotenv_path = '../.env'  # Ensure the .env file is in the same directory
if not load_dotenv(dotenv_path=dotenv_path):
    print("Warning: .env file not found. Using default configuration.")

# Get environment variables with fallback defaults
ip_address = os.getenv("IP_ADDRESS")
port = int(os.getenv("PORT"))  
print(f"Loaded configuration - IP_ADDRESS: {ip_address}, PORT: {port}")

# Initialize Flask and Flask-SocketIO
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
socketio = SocketIO(app, cors_allowed_origins="*")

# Configure BrainFlow
params = BrainFlowInputParams()
board_id = BoardIds.SYNTHETIC_BOARD.value
board = BoardShim(board_id, params)

# Initialize BrainFlow board session with debugging
try:
    board.prepare_session()
    print("BrainFlow session prepared.")
    board.start_stream()
    print("BrainFlow streaming started.")
except Exception as e:
    print(f"Error initializing BrainFlow: {e}")
    board = None  # Ensure board is None if initialization fails

@app.route('/')
def index():
    return "Flask Backend is Running"

# WebSocket event for EEG data streaming
@socketio.on('connect')
def handle_connect():
    print("Client connected")
    emit('message', {'data': 'Connected to EEG backend!'})

@socketio.on('start_stream')
def stream_eeg():
    if not board:
        print("Error: BrainFlow board is not initialized.")
        emit('error', {'message': 'BrainFlow board is not initialized.'})
        return

    print("Received start_stream event from frontend")

    try:
        while True:
            data = board.get_current_board_data(32)  # Get 32 samples per call
            print(f"Data shape: {data.shape}")  # Print the shape of the data array

            if data.size == 0:
                print("No data received from BrainFlow.")
                continue

            # Select only the first 5 channels and scale
            scaled_data = (data[:5, :] / 1e6).tolist()  # Scale and convert to list format
            mood = random.choice(["Calm", "Anxious", "Focused", "Happy"])

            print(f"Streaming EEG data (5 channels): {[channel[:6] for channel in scaled_data]}, Mood: {mood}")
            emit('eeg_data', {'data': scaled_data, 'mood': mood}, broadcast=True)
            socketio.sleep(0.5)  # Adjust delay for slower updates
    except Exception as e:
        print(f"Error in streaming EEG data: {e}")
        emit('error', {'message': 'Error occurred while streaming EEG data.'})


@app.route('/shutdown')
def shutdown():
    if board:
        board.stop_stream()
        board.release_session()
        print("Session stopped and resources released.")
    return "Session stopped and resources released."

# Run the Flask app with SocketIO
if __name__ == '__main__':
    print(f"Server is running on {ip_address}:{port}")
    try:
        print("Starting the Flask backend...")
        socketio.run(app, host=ip_address, port=port, debug=True)
    except Exception as e:
        print(f"Error running server: {e}")
    finally:
        if board:
            print("Shutting down and releasing BrainFlow resources.")
            board.stop_stream()
            board.release_session()
