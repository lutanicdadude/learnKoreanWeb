const express = require('express');
const korean_controller = require('../controllers/korean_controller');
const router = express.Router();

router.post("/addWord", korean_controller.createStoredWord, korean_controller.createTTS);
router.get("/getWord", korean_controller.getAllStoredWords);
router.get("/quizWords", korean_controller.getQuizWord);
router.get('/categories', korean_controller.getCategories);


module.exports = router;
