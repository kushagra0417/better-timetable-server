const mongoose = require("mongoose");

const noticeListSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('notice', noticeListSchema);
