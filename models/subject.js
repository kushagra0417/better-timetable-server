const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
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
    },
    type: {
        type: Number,
        required: true,
    },
    programId: {
        type: mongoose.Types.ObjectId,
        ref: "Program"
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Subject', subjectSchema);
