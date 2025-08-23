const express = require("express");
const router = express.Router();
const korean_controller = require("../controllers/korean_controller");

router.post("/", korean_controller.createTTS);     // Create speech
router.get("/:id", korean_controller.getTTS);      // Read speech by id
router.put("/:id", korean_controller.updateTTS);   // Update speech text/voice
router.delete("/:id", korean_controller.deleteTTS);// Delete speech

module.exports = router;
