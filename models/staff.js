const mongoose = require("mongoose");

const staffListSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: { unique: true },
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    role: {
        type: Number,
        required: true,
    },
    noticePermission: {
        type: Number,
        required: true
    },
    contactNumber: {
        type: String,
        required: false,
        default: 'xxx-xxx-xxxx'
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('StaffList', staffListSchema);
