const express = require("express");
const router = express.Router();
const { get_user, get_user_by_Id, post_user, update_user, delete_user } = require("../controllers/users.controllers");

router.get("/", get_user);
router.get("/:userId", get_user_by_Id);
router.post("/", post_user);
router.put("/:userId", update_user);
router.delete("/", delete_user);

module.exports = router;
