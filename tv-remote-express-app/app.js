const express = require('express');
const adb = require('adbkit');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const tvIp = '192.168.0.103';

app.use(bodyParser.json());
app.use(cors());

// Function to establish ADB connection to the TV
const connectToTV = async (tvIp) => {
    const client = adb.createClient();
    const tvDevice = await client.listDevices()
        .then(devices => devices.find(device => device.id === `${tvIp}:5555`));

    if (!tvDevice) {
        throw new Error('TV device not found.');
    }

    return client;
};

// Volume Decrease API
app.post('/volume/decrease', async (req, res) => {
    const decreaseVolumeCommand = 'input keyevent KEYCODE_VOLUME_DOWN';
    try {
        const client = await connectToTV(tvIp);
        await client.shell(tvIp, decreaseVolumeCommand);
        console.log('Volume decreased successfully');
        res.json({ message: 'Volume decreased successfully' });
    } catch (error) {
        console.error('Error executing ADB command:', error);
        res.status(500).json({ error: 'Error executing ADB command' });
    }
});

// Volume Increase API
app.post('/volume/increase', async (req, res) => {
    const increaseVolumeCommand = 'input keyevent KEYCODE_VOLUME_UP';
    // Replace with the actual IP address of your TV

    try {
        const client = await connectToTV(tvIp);
        await client.shell(tvIp, increaseVolumeCommand);
        console.log('Volume increased successfully');
        res.json({ message: 'Volume increased successfully' });
    } catch (error) {
        console.error('Error executing ADB command:', error);
        res.status(500).json({ error: 'Error executing ADB command' });
    }
});

// Arrow API
app.post('/arrow', async (req, res) => {
    const { direction } = req.body;
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

    try {
        const client = await connectToTV(tvIp);
        await client.shell(tvIp, command);
        res.json({ message: `Arrow '${direction}' pressed successfully` });
    } catch (error) {
        console.error('Error executing ADB command:', error);
        res.status(500).json({ error: 'Error executing ADB command' });
    }
});

app.post('/keyboard', async (req, res) => {
    const { key } = req.body;

    // Validate the key input (alphabets A-Z, numbers 0-9, or other necessary keys)
    // if (!/^([A-Za-z0-9]+)$/.test(key)) {
    //     return res.status(400).json({ error: 'Invalid key provided.' });
    // }

    const keyboardCommand = `input text ${key}`;

    try {
        const client = await connectToTV(tvIp);
        await client.shell(tvIp, keyboardCommand);
        console.log(`Key '${key}' pressed successfully`);
        res.json({ message: `Key '${key}' pressed successfully` });
    } catch (error) {
        console.error('Error executing ADB command:', error);
        res.status(500).json({ error: 'Error executing ADB command' });
    }
});

app.post('/power/off', async (req, res) => {
    const turnOffCommand = 'input keyevent KEYCODE_POWER';
  
    try {
      const client = await connectToTV(tvIp);
      await client.shell(tvIp, turnOffCommand);
      console.log('TV turned off successfully');
      res.json({ message: 'TV turned off successfully' });
    } catch (error) {
      console.error('Error turning off the TV:', error);
      res.status(500).json({ error: 'Error turning off the TV' });
    }
  });
  
  
  app.post('/open/youtube', async (req, res) => {
    const openYouTubeCommand = 'am start -n com.google.android.youtube.tv/com.google.android.apps.youtube.tv.activity.ShellActivity';
    
    try {
        const client = await connectToTV(tvIp);
        await client.shell(tvIp, openYouTubeCommand);
        console.log('Volume increased successfully');
        res.json({ message: 'YouTube app opened successfully' });
    } catch (error) {
        console.error('Error executing ADB command:', error);
        res.status(500).json({ error: 'Error opening YouTube app' });
    }
  });
  
  

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
