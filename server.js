const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Dummy user data for authentication (replace this with actual user data from your database)
const users = [
    { id: 1, username: 'user1', password: 'password1', bulbId: 1 },
    { id: 2, username: 'user2', password: 'password2', bulbId: 2 }
];

// Secret key for JWT signing
const SECRET_KEY = '12345';

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = user;
        next();
    });
};

// Endpoint to log in and get a JWT token
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ token });
});

// Endpoint to turn the bulb on (only for authenticated users)
app.post('/bulb/on', authenticateJWT, (req, res) => {
    // Check if the user has a bulb associated
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    console.log(`Bulb ${user.bulbId} is turned ON`);
    res.status(200).json({ message: `Bulb ${user.bulbId} turned on successfully` });
});

// Endpoint to turn the bulb off (only for authenticated users)
app.post('/bulb/off', authenticateJWT, (req, res) => {
    // Check if the user has a bulb associated
    const user = users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    console.log(`Bulb ${user.bulbId} is turned OFF`);
    res.status(200).json({ message: `Bulb ${user.bulbId} turned off successfully` });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
