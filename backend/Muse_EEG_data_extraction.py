# import os
# from pylsl import StreamInlet, resolve_stream
# import time
# import csv
# from EEG_generate_training_matrix import gen_matrix

# # Define the EEG channel names for your Muse S (5 channels)
# eeg_channel_names = [
#     "TP9", "AF7", "AF8", "TP10", "Right AUX"
# ]

# # Resolve an EEG stream on the lab network
# print("Looking for a data stream...")
# streams = resolve_stream('type', 'EEG')

# # Create a new inlet to read from the stream
# inlet = StreamInlet(streams[0])

# # Define the base output directory
# base_output_directory = "Output"
# base_output_training_directory = "Output_training"

# # Determine the next available session folder
# session_number = 1
# while True:
#     session_directory = os.path.join(base_output_directory, str(session_number))
#     if not os.path.exists(session_directory):
#         os.makedirs(session_directory, exist_ok=True)
#         break
   
#     # session_training_directory = os.path.join(base_output_training_directory, str(session_number))
#     # if not os.path.exists(session_training_directory):
#     #     os.makedirs(session_training_directory, exist_ok=True)
#     #     break

#     session_number += 1

# print(f"Data will be saved in {session_directory}...")

# # Start the stream reading loop
# iteration_count = 0
# file_count = 1
# data_buffer = []

# try:
#     while True:
#         # Collect data
#         sample, timestamp = inlet.pull_sample()
#         data_buffer.append([timestamp] + sample)
        
#         # Increment the iteration count
#         iteration_count += 1
        
#         # Display the data
#         print(f"Iteration {iteration_count}: Sample: {sample}, Timestamp: {timestamp}")
        
#         # Save to a new file every 10 iterations
#         if iteration_count % 10 == 0:
#             # Create a filename with the file count
#             file_name = f"eeg_data_{file_count}.csv"
#             file_path = os.path.join(session_directory, file_name)
            
#             # Write the data buffer to the file
#             with open(file_path, mode="w", newline="") as file:
#                 writer = csv.writer(file)
#                 writer.writerow(["timestamps"] + eeg_channel_names)  # Write header
#                 writer.writerows(data_buffer)  # Write buffered data
            
#             print(f"Saved data to {file_path}")
            
#             generated_file_name = f"eeg_data_expanded_{file_count}.csv"
#             generated_file_path = os.path.join(session_directory, generated_file_name)
#             gen_matrix(file_path, generated_file_path, cols_to_ignore=-1, training=False)

#             # Clear the data buffer and increment the file counter
#             data_buffer.clear()
#             file_count += 1
        
#         # Wait for 1 second
#         time.sleep(1)

# except KeyboardInterrupt:
#     print("\nData collection stopped.")
#     # Save any remaining data if the script is interrupted
#     if data_buffer:
#         file_name = f"eeg_data_{file_count}.csv"
#         file_path = os.path.join(session_directory, file_name)
#         with open(file_path, mode="w", newline="") as file:
#             writer = csv.writer(file)
#             writer.writerow(["Timestamp"] + eeg_channel_names)  # Write header
#             writer.writerows(data_buffer)  # Write buffered data
#         print(f"Saved remaining data to {file_path}")

import os
from pylsl import StreamInlet, resolve_stream
import time
import csv
from EEG_generate_training_matrix import gen_matrix

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
