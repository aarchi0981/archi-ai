const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http'); // 🌐 Node ka built-in http package
const { Server } = require('socket.io'); // 🔌 Socket.io Server

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

const JWT_SECRET = "ARCHI_SUPER_SECURE_SECRET_KEY_2026";

// 🌐 Create HTTP Server manually (Socket.io ko Express ke upar baithane ke liye)
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Hamara frontend port
        methods: ["GET", "POST"]
    }
});

// 🛢️ MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/archi_ai_prod')
  .then(() => console.log('Database pipeline locked securely! 🛡️'))
  .catch(err => console.error('Database connection failed:', err));

// 📐 Schemas (Newsletter & Auth)
const Subscriber = mongoose.model('Subscriber', new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    subscribedAt: { type: Date, default: Date.now }
}));

const User = mongoose.model('User', new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}));

// 📬 Newsletter API
app.post('/api/v1/subscribe', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, error: "Email required!" });
        await Subscriber.create({ email });
        res.status(201).json({ success: true, message: "Subscribed into MongoDB! 🚀" });
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({ success: false, error: "Already registered!" });
        res.status(500).json({ success: false, error: "Database failure" });
    }
});

// 🔐 SIGNUP API
app.post('/api/v1/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, error: "Email & password required!" });
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, error: "User already exists!" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.create({ email, password: hashedPassword });
        res.status(201).json({ success: true, message: "User account created securely! 🔑" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Signup Error" });
    }
});

// 🔑 LOGIN API
app.post('/api/v1/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, error: "Email & password required!" });
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, error: "Invalid credentials!" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, error: "Invalid credentials!" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ success: true, message: "Login successful! Dashboard Access Granted. 🎯", token });
    } catch (error) {
        res.status(500).json({ success: false, error: "Login Error" });
    }
});

// 📡 🔌 REAL-TIME CRYPTO LOGS STREAM ENGINE (SOCKET.IO)
const attackTypes = [
    { text: "SQL Injection attempt blocked", meta: "firewall-node-4", type: "danger" },
    { text: "DDoS mitigation node activated", meta: "edge-cache-09", type: "danger" },
    { text: "Brute-force handshake terminated", meta: "auth-gateway", type: "danger" },
    { text: "Cryptographic key rotated successfully", meta: "vault-prod-001", type: "success" },
    { text: "Database record encrypted safely", meta: "user_db_batch", type: "info" },
    { text: "SSL/TLS handshake renewed", meta: "load-balancer-2", type: "info" }
];

io.on('connection', (socket) => {
    console.log('A security analyst client connected to stream... ⚡');

    // Har 4 seconds mein automatic ek random live threat alert frontend ko push karna
    const logInterval = setInterval(() => {
        const randomLog = attackTypes[Math.floor(Math.random() * attackTypes.length)];
        // Naye current timestamp ke sath alert bhejna
        const liveAlert = {
            ...randomLog,
            time: "Just now"
        };
        socket.emit('new-security-log', liveAlert);
    }, 4000);

    socket.on('disconnect', () => {
        console.log('Security analyst client disconnected.');
        clearInterval(logInterval);
    });
});

const PORT = 5000;
// 💡 CRITICAL: Ab app.listen nahi, server.listen chalega kyunki sockets HTTP server se chalte hain!
server.listen(PORT, () => console.log(`Server is firing up on port ${PORT}`));