const express = require("express");
const router = express.Router();

const { isSignedIn, isAdmin } = require("../controllers/auth");
const { add, get, _delete, update ,getElectives } = require("../controllers/subject");

router.post(
    "/add",
    isSignedIn,
    isAdmin,
    add
);

router.get(
    "/get",
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
    "/getElectives",
    getElectives
);

module.exports = router;