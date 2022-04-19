const express = require("express");
const router = express.Router();

const { isSignedIn, isAdmin } = require("../controllers/auth");
const { add, get, _delete, update, getById, getDetails } = require("../controllers/program");


router.post(
    "/add",
    isSignedIn,
    isAdmin,
    add
);
router.get(
    "/get",
    // isSignedIn,
    // isAdmin,
    get
);
router.delete(
    "/delete",
    isSignedIn,
    isAdmin,
    _delete
);
router.put(
    "/update",
    isSignedIn,
    isAdmin,
    update
);

router.get(
    "/getById",
    // isSignedIn,
    // isAdmin,
    getById
);

router.get(
    "/getDetails",
    // isSignedIn,
    // isAdmin,
    getDetails
);


module.exports = router;