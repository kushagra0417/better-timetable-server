const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
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
    programId: {
        type: mongoose.Types.ObjectId,
        ref: "Program"
    },
    divisions: {
        type: [String],
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Batch', batchSchema);
