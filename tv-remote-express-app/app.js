
const express = require('express');
const adb = require('adbkit');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(cors());

// Initialize ADB client
const client = adb.createClient();

const checkTVConnection = async (tvIp) => {
  const devices = await client.listDevices();
  const tvDevice = devices.find((device) => device.id === `${tvIp}:5555`);
  return !!tvDevice;
};

// Function to connect to the TV
const connectToTV = async (tvIp) => {
  const isConnected = await checkTVConnection(tvIp);
  if (!isConnected) {
    try {
      await client.connect(tvIp);
      console.log('Connected to TV successfully');
    } catch (error) {
      console.error('Error connecting to TV:', error);
      throw error; // Throw the error so it can be caught in the calling function
    }
  }
};

// Connect API
app.post('/connect', async (req, res) => {
  const { tvIp } = req.body;

  if (!tvIp) {
    return res.status(400).json({ error: 'TV IP address is required.' });
  }

  try {
    await connectToTV(tvIp);
    res.json({ message: 'Connected to TV successfully' });
  } catch (error) {
    console.error('Error connecting to TV:', error);
    res.status(500).json({ error: 'Error connecting to TV' });
  }
});


// Buttons API
app.post('/arrow', async (req, res) => {
  const { direction, tvIp } = req.body; // Get the tvIp from the request body

  if (!tvIp) {
    return res.status(400).json({ error: 'TV IP address is required.' });
  }

  try {
    await connectToTV(tvIp);
    const validDirections = ['vup', 'vdown', 'up', 'down', 'left', 'right', 'enter', 'back', 'home', 'menu','backs', 'mute'];
    if (!validDirections.includes(direction)) {
        return res.status(400).json({ error: 'Invalid direction provided.' });
    }

    const arrowCommands = {
        up: 'input keyevent KEYCODE_DPAD_UP',
        down: 'input keyevent KEYCODE_DPAD_DOWN',
        left: 'input keyevent KEYCODE_DPAD_LEFT',
        right: 'input keyevent KEYCODE_DPAD_RIGHT',
        enter: 'input keyevent KEYCODE_ENTER',
        back: 'input keyevent KEYCODE_BACK', // Back button
        home: 'input keyevent KEYCODE_HOME', // Home button
        menu: 'input keyevent KEYCODE_MENU', // Menu button
        mute: 'input keyevent KEYCODE_MUTE', // Mute button
        vdown: 'input keyevent KEYCODE_VOLUME_DOWN',
        vup: 'input keyevent KEYCODE_VOLUME_UP',
        backs: 'input keyevent KEYCODE_DEL',
    };

    const command = arrowCommands[direction];

    if (!command) {
      return res.status(400).json({ error: 'Invalid direction provided.' });
    }

    await client.shell(tvIp, command);
    res.json({ message: `Arrow '${direction}' pressed successfully` });
  } catch (error) {
    console.error('Error executing ADB command:', error);
    res.status(500).json({ error: 'Error executing ADB command' });
  }
});

// Keyboard API
app.post('/keyboard', async (req, res) => {
  const { key, tvIp } = req.body; // Get the tvIp from the request body

  if (!tvIp) {
    return res.status(400).json({ error: 'TV IP address is required.' });
  }

  try {
    await connectToTV(tvIp);
    // Rest of the code to execute keyboard command...
    const keyboardCommand = `input text ${key}`;
    await client.shell(tvIp, keyboardCommand);
    res.json({ message: `Key '${key}' pressed successfully` });
  } catch (error) {
    console.error('Error executing ADB command:', error);
    res.status(500).json({ error: 'Error executing ADB command' });
  }
});
  
  
// Open YouTube API
app.post('/open/youtube', async (req, res) => {
  const { tvIp } = req.body; // Get the tvIp from the request body

  if (!tvIp) {
    return res.status(400).json({ error: 'TV IP address is required.' });
  }

  try {
    await connectToTV(tvIp);
    // Rest of the code to open YouTube...
    const openYouTubeCommand =
      'am start -n com.google.android.youtube.tv/com.google.android.apps.youtube.tv.activity.ShellActivity';
    await client.shell(tvIp, openYouTubeCommand);
    res.json({ message: 'YouTube app opened successfully' });
  } catch (error) {
    console.error('Error opening YouTube app:', error);
    res.status(500).json({ error: 'Error opening YouTube app' });
  }
});
  

// Power Off API
app.post('/power/off', async (req, res) => {
  const { tvIp } = req.body; // Get the tvIp from the request body

  if (!tvIp) {
    return res.status(400).json({ error: 'TV IP address is required.' });
  }

  try {
    await connectToTV(tvIp);
    // Rest of the code to execute power off command...
    const powerOffCommand = 'input keyevent KEYCODE_POWER';
    await client.shell(tvIp, powerOffCommand);
    res.json({ message: 'TV turned off successfully' });
  } catch (error) {
    console.error('Error turning off the TV:', error);
    res.status(500).json({ error: 'Error turning off the TV' });
  }
});
  

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});











// // ... (rest of the code)

// // Start the server
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`Server started on http://localhost:${PORT}`);
// });
