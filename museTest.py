from pylsl import StreamInlet, resolve_stream
import time
import csv

# Define the EEG channel names for your Muse S (5 channels)
eeg_channel_names = [
    "TP9", "FP1", "F7", "FP2", "TP10"
]

# Resolve an EEG stream on the lab network
print("Looking for a data stream...")
streams = resolve_stream('type', 'EEG')

# Create a new inlet to read from the stream
inlet = StreamInlet(streams[0])

# Define the CSV file to store data
output_file = "eeg_data.csv"

# Open the CSV file for writing
with open(output_file, mode="w", newline="") as file:
    writer = csv.writer(file)
    
    # Write the header row with real EEG channel names
    sample, _ = inlet.pull_sample()
    num_channels = len(sample)
    
    # Ensure that the number of channels matches the Muse S setup
    if num_channels != len(eeg_channel_names):
        raise ValueError(f"Expected {len(eeg_channel_names)} channels, but got {num_channels} channels.")

    # Write the header with timestamps and channel names
    writer.writerow(["Timestamp"] + eeg_channel_names)
    
    print(f"Saving data to {output_file}...")
    
    # Run the stream reading loop
    try:
        while True:
            # Collect data
            sample, timestamp = inlet.pull_sample()
            
            # Write the data to the CSV file
            writer.writerow([timestamp] + sample)
            
            # Display the data
            print(f"Sample: {sample}, Timestamp: {timestamp}")
            
            # Wait for 1.5 seconds
            time.sleep(1.5)
    except KeyboardInterrupt:
        print("\nData collection stopped.")
