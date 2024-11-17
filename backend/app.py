from flask import Flask
from flask_socketio import SocketIO, emit
import eventlet
import os
import csv
import time
from pylsl import StreamInlet, resolve_stream
from Muse_EEG_data_extraction import add_predicted_output, gen_matrix

# Initialize Flask and Flask-SocketIO
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
socketio = SocketIO(app, cors_allowed_origins="*")

# Resolve EEG stream
print("Looking for an EEG stream...")
streams = resolve_stream('type', 'EEG')
inlet = StreamInlet(streams[0])

# Initialize output directory for storing data
output_dir = "Output"
os.makedirs(output_dir, exist_ok=True)

data_buffer = []
start_time = time.time()
file_count = 1

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
    global data_buffer, start_time, file_count

    print("Received start_stream event from frontend")

    try:
        while True:
            # Pull sample from the inlet
            sample, timestamp = inlet.pull_sample()
            data_buffer.append([timestamp] + sample)

            # Display the data
            print(f"Sample collected: {sample}, Timestamp: {timestamp}")

            # Check if 60 seconds have elapsed
            elapsed_time = time.time() - start_time
            if elapsed_time >= 60:
                # Save the data to a CSV file
                file_name = f"eeg_data_{file_count}.csv"
                file_path = os.path.join(output_dir, file_name)
                with open(file_path, mode="w", newline="") as file:
                    writer = csv.writer(file)
                    writer.writerow(["Timestamp", "TP9", "AF7", "AF8", "TP10", "Right AUX"])  # Header
                    writer.writerows(data_buffer)

                print(f"Saved 1 minute of data to {file_path}")

                # Generate expanded feature matrix
                generated_file_name = f"eeg_data_expanded_{file_count}.csv"
                generated_file_path = os.path.join(output_dir, generated_file_name)
                gen_matrix(file_path, generated_file_path, cols_to_ignore=-1, training=False)

                # Get predictions
                add_predicted_output(generated_file_path)

                # Read the updated file to extract predictions for streaming
                with open(generated_file_path, "r") as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        mood = row["Prediction"]  # Assuming "Prediction" is the column with moods
                        scaled_data = [[float(row[channel]) for channel in ["TP9", "AF7", "AF8", "TP10", "Right AUX"]]]

                        # Emit the data to frontend
                        emit('eeg_data', {'data': scaled_data, 'mood': mood}, broadcast=True)

                # Clear buffer, increment file count, and reset timer
                data_buffer.clear()
                file_count += 1
                start_time = time.time()

            socketio.sleep(0.5)  # Adjust the delay for smoother streaming
    except Exception as e:
        print(f"Error in streaming EEG data: {e}")


@app.route('/shutdown')
def shutdown():
    print("Shutting down the session...")
    return "Session stopped and resources released."

# Run the Flask app with SocketIO
if __name__ == '__main__':
    print("Starting the Flask backend...")
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
