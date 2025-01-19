const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to turn the bulb on
app.post('/bulb/on', (req, res) => {
    console.log('Bulb is turned ON');
    res.status(200).json({ message: 'Bulb turned on successfully' });
});

// Endpoint to turn the bulb off
app.post('/bulb/off', (req, res) => {
    console.log('Bulb is turned OFF');
    res.status(200).json({ message: 'Bulb turned off successfully' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
