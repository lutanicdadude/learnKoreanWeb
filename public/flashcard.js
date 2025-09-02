document.addEventListener('DOMContentLoaded', async () => {
    const startBtn = document.getElementById('startBtn');
    const quizContainer = document.getElementById('quizContainer');
    const questionEl = document.getElementById('koreanWord');
    const optionsEl = document.getElementById('options');
    const categorySelect = document.getElementById("categorySelect");

    try {
        const res = await fetch('/korean/categories');
        const categories = await res.json();

        // Clear existing options
        categorySelect.innerHTML = '<option value="all" selected>All Categories</option>';

        // Add options dynamically
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categorySelect.appendChild(option);
        });
    } catch (err) {
        console.error("Error fetching categories:", err);
    }

    let words = [];
    let currentIndex = 0;

    // Fetch 5 words from API
    async function fetchWords() {
        try {
            const res = await fetch('/korean/quizWords'); // adjust endpoint if needed
            words = await res.json();
        } catch (err) {
            console.error("Error fetching words:", err);
        }
    }

    // Render one question at a time
    function renderQuestion() {
        if (currentIndex >= words.length) {
            questionEl.textContent = "Quiz Completed ✅";
            optionsEl.innerHTML = "";
            return;
        }

        const word = words[currentIndex];
        questionEl.textContent = `What is the meaning of: ${word.kor_word}`;

        optionsEl.innerHTML = ''; // clear old options
        const correctAnswer = word.eng_word;

        // Generate 2 random wrong answers
        const otherOptions = words
            .filter((w, idx) => idx !== currentIndex)
            .map(w => w.eng_word);

        const choices = [correctAnswer, ...otherOptions.slice(0, 2)];
        shuffleArray(choices);

        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = "optionBtn";
            btn.textContent = choice;
            btn.addEventListener('click', () => handleAnswer(choice, correctAnswer));
            optionsEl.appendChild(btn);
        });
    }

    function handleAnswer(selected, correct) {
        if (selected === correct) {
            alert("✅ Correct!");
        } else {
            alert(`❌ Wrong! Correct answer was: ${correct}`);
        }
        currentIndex++;
        renderQuestion();
    }

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    startBtn.addEventListener('click', async () => {
        const selectedCategory = categorySelect.value;

        // Build the URL with the category query
        let url = '/korean/quizWords';
        if (selectedCategory && selectedCategory !== 'all') {
            url += `?category=${encodeURIComponent(selectedCategory)}`;
        }

        try {
            const res = await fetch(url);
            words = await res.json(); // store the fetched words
            currentIndex = 0;
            renderQuestion();
        } catch (err) {
            console.error("Error fetching quiz words:", err);
        }
    });
});
