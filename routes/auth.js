const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { signOut, signUp, signIn, verifyEmail, isAdmin, reset, resetPassword, isSignedIn, isAdminChecked } = require("../controllers/auth");

router.post(
    "/signup",
    [
        check("email", "email is required").isEmail(),
        check("password", "password should be at least 8 char").isLength({ min: 8 })
    ],
    signUp
);

router.post(
    "/signin",
    [
        check("email", "email is required").isEmail(),
        check("password", "password field is required").isLength({ min: 8 })
    ],
    signIn
);

router.get(
    "/verifyEmail/:token",
    verifyEmail
);

router.get(
    "/isAdmin",
    isSignedIn,
    isAdmin,
    isAdminChecked
);

router.get("/signout", signOut);

// recovery
router.post("/reset",
    [
        check("email", "email is required").isEmail(),
        check("newPassword", "password should be at least 8 char").isLength({ min: 8 })
    ],
    reset
);
router.get("/reset/:token", resetPassword);

module.exports = router;