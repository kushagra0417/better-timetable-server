const Auth = require("../models/auth");
const Staff = require('../models/staff')
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const expressJwt = require("express-jwt");
const { sendVerifyEmail } = require("../util/verifiyEmail");
const config = require('../bt.config.json');
const { sendResetEmail } = require("../util/resetEmail");

exports.signUp = async (req, res) => {
    const errors = validationResult(req);

    const { email, password } = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    if (email === process.env.ADMIN_EMAIL) {
        return res.status(400).json({
            err: "invalid email"
        });
    }

    const staff = await Staff.findOne({ email });

    if (!staff) {
        return res.status(400).json({
            error: "email not added as staff"
        });
    }


    const auth = new Auth({ email, password, isVerified: false, role: staff.role });

    auth.save(async (err, auth) => {
        if (err) {
            return res.status(400).json({
                err: "NOT able to save user in DB"
            });
        }
        // send verification email
        if (await sendVerifyEmail(staff.name, auth.email, req.protocol + '://' + req.get('host'))) {
            res.json({
                id: auth._id,
                email: auth.email,
                role: staff.role,
                emailSent: true
            });
        } else {
            res.json({
                id: auth._id,
                email: auth.email,
                role: staff.role,
                emailSent: false
            });
        }
    });
};

exports.verifyEmail = async (req, res) => {
    const token = req.params.token;
    const { email } = jwt.decode(token, process.env.JWT_SECRET)
    const staff = await Auth.updateOne({ email }, { isVerified: true });
    console.log(staff);
    res.status(200).json({
        email,
        verified: true
    })
}

exports.signIn = (req, res) => {
    const errors = validationResult(req);
    const { email, password } = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    if (email === process.env.ADMIN_EMAIL) {
        if (password == process.env.ADMIN_PASSWORD) {
            //create token
            const token = jwt.sign({ _id: 000, role: 0, email }, process.env.JWT_SECRET, { algorithm: 'HS256' });
            //put token in cookie
            res.cookie("token", token, { sameSite: "None", secure: true, expire: new Date() + 999999 });

            //send response to client
            // return res.json({ id: 000, email, role: 0 });
            return res.json({
                _id: 000, userDetails: {
                    email, role: 0, isVerified: true, name: config.appName, noticePermission: true
                }
            });
        }
        return res.status(400).json({
            err: "invalid credential"
        });
    }


    Auth.findOne({ email }, async (err, auth) => {
        if (err || !auth) {
            return res.status(400).json({
                error: "email does not exists"
            });
        }

        const matched = await bcrypt.compare(password, auth.password);

        if (!matched) {
            return res.status(401).json({
                error: "Email and password do not match"
            });
        }


        //create token
        const token = jwt.sign({ _id: auth._id, email: auth.email, role: auth.role }, process.env.JWT_SECRET, { algorithm: 'HS256' });
        //put token in cookie
        res.cookie("token", token, { sameSite: "None", secure: true, expire: new Date() + 999999 });
        // is verifies TODO:
        //send response to client
        const { _id, email, role, isVerified } = auth;
        const staff = await Staff.findOne({ email });

        return res.json({
            _id, userDetails: {
                email, role, isVerified, name: staff.name, noticePermission: staff.noticePermission
            }
        });
    });
};

exports.reset = async (req, res) => {
    const errors = validationResult(req);
    const { email, newPassword } = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    try {
        const auth = await Auth.findOne({ email });
        if (auth) {
            if (await sendResetEmail(email, newPassword, req.protocol + '://' + req.get('host'))) {
                return res.status(200).json({
                    emailSent: true
                });
            } else {
                return res.status(500).json({
                    emailSent: false
                });
            }

        } else {
            return res.status(400).json({
                err: 'email not found'
            });
        }
    } catch (e) {
        return res.status(500).json({
            err: 'server side error'
        });
    }
}

exports.resetPassword = async (req, res) => {
    const token = req.params.token;
    const { email, newPassword } = jwt.decode(token, process.env.JWT_SECRET);

    const hash = await bcrypt.hash(newPassword, 10);

    await Auth.findOneAndUpdate({ email }, { password: hash });
    res.status(200).json({
        reset: true
    })
}

exports.signOut = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "signout successfully"
    });
};

// protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth",
    getToken: function fromCookie(req) {
        var token = req.cookies.token || req.body.token || req.headers['token']; // || req.query.access_token || req.headers['x-access-token'];
        if (token) {
            return token;
        }
        return null;
    },
    algorithms: ['HS256']
});

// custom middleware
exports.isAuthenticated = (req, res, next) => {
    // console.log(req.profile, req.auth);
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: "ACCESS DENIED"
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.auth.role !== 0) {
        return res.status(403).json({
            error: "You are not ADMIN, Access denied"
        });
    }
    next();
};

exports.isAdminChecked = (req, res) => {
    return res.status(200).json({
        admin: true
    });
}