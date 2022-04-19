const express = require("express");
const router = express.Router();

const { isSignedIn, isAdmin } = require("../controllers/auth");
const { add, _delete, get } = require("../controllers/notice");


router.post(
    "/add",
    isSignedIn,
    add
);

router.delete(
    "/delete",
    isSignedIn,
    isAdmin,
    _delete
);

router.get(
    "/get",
    get
);

module.exports = router;