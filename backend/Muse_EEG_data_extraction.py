import os
from pylsl import StreamInlet, resolve_stream
import time
import csv
from EEG_generate_training_matrix import gen_matrix
import pandas as pd
import numpy as np
from tensorflow.keras.models import load_model


def add_predicted_output(full_data_csv_file) -> str:
    """
    Reads a CSV file, applies a pre-trained model to predict output for each row,
    and saves the DataFrame with a new Prediction column to a new CSV file.
    """
    # Step 1: Read the CSV file
    df = pd.read_csv(full_data_csv_file)

    # Step 2: Apply predictions for the entire DataFrame
    predictions = predict(df)  # Process the entire DataFrame at once

    # Step 3: Add predictions to the DataFrame
    df["Prediction"] = predictions

    # Step 4: Save the updated DataFrame
    df.to_csv(full_data_csv_file, index=False)

    print("Updated DataFrame with Prediction column:")
    print(df)


def predict(input_df):
    """
    Uses a pre-trained model to predict outputs for the entire DataFrame.
    """
    model = load_model('emotion_model.keras')  # Load the model

    # Convert the input DataFrame to a NumPy array (or preprocess as required by your model)
    input_array = input_df.to_numpy()

    # Get predictions from the model
    predictions_raw = model.predict(input_array)

    # Convert raw predictions to class labels (assuming classification task)
    y_pred = np.array([np.argmax(pred) for pred in predictions_raw])

    print("Predictions:")
    print(y_pred)

    return y_pred

# Define the EEG channel names for your Muse S (5 channels)
eeg_channel_names = [
    "TP9", "AF7", "AF8", "TP10", "Right AUX"
]

# Resolve an EEG stream on the lab network
print("Looking for a data stream...")
streams = resolve_stream('type', 'EEG')

# Create a new inlet to read from the stream
inlet = StreamInlet(streams[0])

# Define the base output directory
base_output_directory = "Output"
base_output_training_directory = "Output_training"

# Determine the next available session folder
session_number = 1
while True:
    session_directory = os.path.join(base_output_directory, str(session_number))
    if not os.path.exists(session_directory):
        os.makedirs(session_directory, exist_ok=True)
        break

    session_number += 1

print(f"Data will be saved in {session_directory}...")

# Start the stream reading loop
file_count = 1
data_buffer = []
start_time = time.time()  # Record the starting time of the session

try:
    while True:
        # Collect data
        sample, timestamp = inlet.pull_sample()
        data_buffer.append([timestamp] + sample)
        
        # Display the data
        print(f"Sample collected: {sample}, Timestamp: {timestamp}")

        # Check if 60 seconds have elapsed
        elapsed_time = time.time() - start_time
        if elapsed_time >= 60:
            # Create a filename with the file count
            file_name = f"eeg_data_{file_count}.csv"
            file_path = os.path.join(session_directory, file_name)
            
            # Write the data buffer to the file
            with open(file_path, mode="w", newline="") as file:
                writer = csv.writer(file)
                writer.writerow(["Timestamp"] + eeg_channel_names)  # Write header
                writer.writerows(data_buffer)  # Write buffered data
            
            print(f"Saved 1 minute of data to {file_path}")
            
            # Generate expanded feature matrix
            generated_file_name = f"eeg_data_expanded_{file_count}.csv"
            generated_file_path = os.path.join(session_directory, generated_file_name)
            gen_matrix(file_path, generated_file_path, cols_to_ignore=-1, training=False)
            
            predictions = add_predicted_output(generated_file_path)

            # breakpoint()
            # Clear the data buffer, increment the file counter, and reset the timer
            data_buffer.clear()
            file_count += 1
            start_time = time.time()  # Reset the starting time for the next minute
        
        # Small delay to prevent excessive CPU usage (adjust as needed)
        time.sleep(0.01)

except KeyboardInterrupt:
    print("\nData collection stopped.")
    # Save any remaining data if the script is interrupted
    if data_buffer:
        file_name = f"eeg_data_{file_count}.csv"
        file_path = os.path.join(session_directory, file_name)
        with open(file_path, mode="w", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(["Timestamp"] + eeg_channel_names)  # Write header
            writer.writerows(data_buffer)  # Write buffered data
        print(f"Saved remaining data to {file_path}")
