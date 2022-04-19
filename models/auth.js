const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

const authSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: { unique: true }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8
    },
    role: {
        type: Number,
        required: true,
        default: 0,
        validate: {
            // 1 -> admin, 2 -> teacher, 3 -> student 
            validator: (type) => type === 0 || type === 1 || type === 2,
            message: () => 'invalid auth role!'
        }
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true,
});


authSchema.pre('save', async function preSave(next) {
    const user = this;
    if (!user.isModified('password')) return next();

    try {
        const hash = await bcrypt.hash(user.password, SALT_ROUNDS);
        user.password = hash;
        return next();
    } catch {
        return next(err);
    }
});


authSchema.methods.comparePassword = async function comparePassword(candidate) {
    return bcrypt.compare(candidate, this.password);
}

module.exports = mongoose.model('Auth', authSchema);
