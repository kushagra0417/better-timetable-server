const mongoose = require("mongoose");

const programSchema = new mongoose.Schema({
    shortName: {
        type: String,
        required: true,
        trim: true,
        index: { unique: true },
    },
    longName: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Program', programSchema);
