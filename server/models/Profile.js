const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        default: "/public/static/profile"
    },
});

module.exports = mongoose.model('Profile', profileSchema);
