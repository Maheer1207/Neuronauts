from pylsl import StreamInlet, resolve_stream
import time

# Resolve an EEG stream on the lab network
print("Looking for a data stream...")
streams = resolve_stream('type', 'EEG')

# Create a new inlet to read from the stream
inlet = StreamInlet(streams[0])

# Run the stream reading loop
while True:
    # Collect data
    sample, timestamp = inlet.pull_sample()
    
    # Display the data
    print(f"Sample: {sample}, Timestamp: {timestamp}")
    
    # Wait for 1.5 seconds
    time.sleep(1.5)
