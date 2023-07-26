// adbConnection.js
const adb = require('adbkit');

// Function to establish ADB connection to the TV
const connectToTV = async () => {
  const client = adb.createClient();
  const tvIp = "192.168.0.103" ;
  try {
    const devices = await client.listDevices();
    const tvDevice = devices.find(device => device.id === '192.168.0.103:5555');
    
    if (!tvDevice) {
      throw new Error('TV device not found.');
    }
    
    return client;
  } catch (error) {
    throw new Error('Error connecting to TV via ADB.');
  }
};

module.exports = connectToTV;
