from pylsl import StreamInlet, resolve_stream

# Resolve an EEG stream on the lab network
print("Looking for a data stream...")
streams = resolve_stream('type', 'EEG')

# Create a new inlet to read from the stream
inlet = StreamInlet(streams[0])

while True:
    sample, timestamp = inlet.pull_sample()
    print(f"Sample: {sample}, Timestamp: {timestamp}")

