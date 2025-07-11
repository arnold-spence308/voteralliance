const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const cors = require('cors');
require('dotenv').config();

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Enhanced Schemas
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
    createdAt: { type: Date, default: Date.now }
});

const groupSchema = new mongoose.Schema({
    name: String,
    description: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: String, enum: ['general', 'dramatic'] },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Group = mongoose.model('Group', groupSchema);
const Post = mongoose.model('Post', postSchema);

// Authentication Middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) throw new Error();
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate' });
    }
};

// User Registration
router.post('/register', [
    check('email').isEmail(),
    check('password').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 8);
        const user = new User({
            ...req.body,
            password: hashedPassword
        });
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || !await bcrypt.compare(req.body.password, user.password)) {
            throw new Error('Invalid login credentials');
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.send({ user, token });
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

// Enhanced Post Management
router.post('/posts', auth, async (req, res) => {
    try {
        const post = new Post({
            ...req.body,
            author: req.user._id
        });
        await post.save();
        res.status(201).send(post);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get('/posts', auth, async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username')
            .sort('-createdAt');
        res.send(posts);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Enhanced Follow System
router.post('/follow/:userId', auth, async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.userId);
        if (!targetUser) return res.status(404).send();

        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { following: targetUser._id }
        });

        await User.findByIdAndUpdate(targetUser._id, {
            $addToSet: { followers: req.user._id }
        });

        res.send({ message: 'Followed successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
});

// Group Management with Authentication
router.post('/groups', auth, async (req, res) => {
    try {
        const group = new Group({
            ...req.body,
            creator: req.user._id,
            members: [req.user._id]
        });

        await group.save();
        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { groups: group._id }
        });

        res.status(201).send(group);
    } catch (error) {
        res.status(400).send(error);
    }
});

// News Proxy Endpoint (to secure API key)
router.get('/news', async (req, res) => {
    try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`);
        const data = await response.json();
        res.send(data);
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch news' });
    }
});

app.use('/api', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});// JavaScript source code
