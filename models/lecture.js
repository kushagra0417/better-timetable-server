const mongoose = require("mongoose");

const lectureSchema = new mongoose.Schema({
    staffId: {
        type: mongoose.Types.ObjectId,
        ref: "Staff"
    },
    subjectId: {
        type: mongoose.Types.ObjectId,
        ref: "Subject"
    },
    division: {
        type: String,
        required: true,
        maxlength:1
    },
    day: {
        type: [Number],
        minlength: 1
    },
    date: {
        type: Number,
        
    },
    time: {
        to: { type: Number, required: true, max: 2400 },
        from: { type: Number, required: true, max: 2400 }
        
        
    },
    batchId: {
        type: mongoose.Types.ObjectId,
        ref: "Batch"
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Lecture', lectureSchema);
