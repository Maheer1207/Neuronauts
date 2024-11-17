import socketio
import random
import time

# Initialize the SocketIO client
sio = socketio.Client()

# Define the WebSocket endpoint
WEBSOCKET_URL = "http://localhost:5000"  # Replace with the backend's URL if deployed

# Generate random EEG data for testing
def generate_random_eeg_data():
    return [[random.uniform(-50, 50) for _ in range(5)] for _ in range(5)]  # 5 channels, 5 samples

# Handle connection event
@sio.event
def connect():
    print("Connected to the Flask backend!")
    # Emit a start_stream event to simulate starting data streaming
    sio.emit('start_stream')

# Handle disconnection event
@sio.event
def disconnect():
    print("Disconnected from the backend!")

# Handle eeg_data event to print received data
@sio.on('eeg_data')
def handle_eeg_data(data):
    print("Received EEG Data:")
    print(data)

# Main script logic
if __name__ == "__main__":
    try:
        print("Connecting to the backend...")
        sio.connect(WEBSOCKET_URL)

        while True:
            # Generate and send random data to the backend
            random_data = generate_random_eeg_data()
            mood = random.choice(["Calm", "Anxious", "Focused", "Happy"])
            print(f"Sending random data: {random_data}, Mood: {mood}")
            
            # Emit data to the server (if testing custom events, adapt the event name)
            sio.emit('eeg_data', {'data': random_data, 'mood': mood})

            # Wait before sending the next batch
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopped by user.")
    finally:
        sio.disconnect()
