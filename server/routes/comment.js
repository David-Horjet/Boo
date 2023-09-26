'use strict';

const express = require('express');
const Profile = require('../models/Profile');
const Comment = require('../models/Comment');
const router = express.Router();

const profiles = [
    {
        "id": 1,
        "name": "A Martinez",
        "description": "Adolph Larrue Martinez III.",
        "mbti": "ISFJ",
        "enneagram": "9w3",
        "variant": "sp/so",
        "tritype": 725,
        "socionics": "SEE",
        "sloan": "RCOEN",
        "psyche": "FEVL",
        "image": "https://soulverse.boo.world/images/1.png",
    }
];

module.exports = function () {

    // Create a comment
    router.post('/comments', async (req, res) => {
        const { text, userId } = req.body;
        try {
            const user = await Profile.findById(userId);
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            const comment = new Comment({ text, user });
            await comment.save();
            res.status(201).json(comment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    });

    // Get comments (can add sorting/filtering logic here)
    router.get('/comments', async (req, res) => {
        try {
            const comments = await Comment.find().populate('user', 'name');
            res.json(comments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    });

    // Like a comment
    router.post('/comments/:commentId/like', async (req, res) => {
        const { userId } = req.body;
        const { commentId } = req.params;
        try {
            const comment = await Comment.findById(commentId);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }
            const user = await Profile.findById(userId);
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }
            comment.likes.push(user);
            await comment.save();
            res.json(comment);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error' });
        }
    });


    return router;
}

