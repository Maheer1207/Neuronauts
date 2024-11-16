## Team Name: Neuronauts
## Project Title: EMDR Therapy

## Prerequisites

Ensure you have the following installed on your machine:

- **Python** (3.8 or later)
- **Node.js** (LTS version recommended)
- **npm** (comes with Node.js)
- **pip** (Python package installer)
- **Virtual Environment Module** (`venv`)

---

## Cloning the Repository

To get started, clone the repository using:

```bash
git clone git@github.com:Maheer1207/Neuronauts.git
```
---

## Setting up the Virtual Environment
1. Ensure you are in the root directory

2. Create a virtual environment:
   ```bash
   python3 -m venv venv
   ```
   
3. Activate the virtual environment:

   - **On macOS/Linux**:
     ```bash
     source venv/bin/activate
     ```
   - **On Windows**:
     ```bash
     venv\Scripts\activate
     ```
     
4. Install required Python dependencies:
   ```bash
   pip install flask flask-socketio brainflow eventlet
   ```

## Setting Up the Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
   
2. Run the backend server:
   ```bash
   python3 app.py
   ```

---

## Setting Up the Frontend

1. Open a new terminal window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

---

## Running the Application

1. Open **two terminal windows**:
   - One for the **frontend**: Follow the steps in [Setting Up the Frontend](#setting-up-the-frontend).
   - One for the **backend**: Follow the steps in [Setting Up the Backend](#setting-up-the-backend).

2. Once both servers are running:
   - Access the application via the URL provided by the frontend server (usually `http://localhost:3000`).

## Running the python code to view the real time data from Muse S

1. Run the following command to install the required libraries: `pip install pylsl` and `pip install muselsl`
2. Open one terminal window and run the following command: `muselsl stream --name MuseS-799A`
3. Open another terminal window and run the following command: `python3 Muse_EEG_data_extraction.py`

Notes: 

1. If you run into an error on MacOS related to muselsl, please try running the following command: 
`brew install labstreaminglayer/tap/lsl`

2. Make sure you have your bluetooth settings on if you are running on Visual Studio Code or on any other platforms. This is required to let our program to connect to the Muse S. 