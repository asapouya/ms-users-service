const { container } = require("../di.setup");
const express = require("express");
const router = express.Router();
const postValidUser = require("../middlewares/validation/post_user");

const usersController = container.resolve("UsersController");

router.get("/", /*************/ usersController.get_user);
router.get("/:userId", /******/ usersController.get_user_by_Id);
router.post("/", postValidUser, usersController.post_user);
router.put("/:userId", /******/ usersController.update_user);
router.delete("/", /**********/ usersController.delete_user);

module.exports = router;