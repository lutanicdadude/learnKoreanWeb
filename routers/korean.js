const express = require('express');
const korean_controller = require('../controllers/korean_controller');
const router = express.Router();

router.post("/addWord", korean_controller.createStoredWord, korean_controller.createTTS);
router.get("/getWord", korean_controller.getAllStoredWords);

module.exports = router;
