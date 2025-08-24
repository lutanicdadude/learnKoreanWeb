document.addEventListener('DOMContentLoaded', async () => {
    const wordTableBody = document.getElementById('wordTableBody');
    const searchInput = document.getElementById('searchInput');

    let words = [];

    // Fetch words from server
    try {
        const res = await fetch('/korean/getWord', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        words = await res.json();
        renderTable(words); // Initial render
    } catch (err) {
        console.error("Error fetching words:", err);
    }

    // Function to render table rows
    function renderTable(data) {
        wordTableBody.innerHTML = "";
        data.forEach(wordObj => {
            const row = `
                <tr>
                    <td>${wordObj.kor_word}</td>
                    <td>${wordObj.eng_word}</td>
                    <td>${wordObj.category}</td>
                </tr>
            `;
            wordTableBody.innerHTML += row;
        });
    }

    // Filter logic
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();

        const filteredWords = words.filter(wordObj =>
            wordObj.kor_word.toLowerCase().includes(query) ||
            wordObj.eng_word.toLowerCase().includes(query) ||
            wordObj.category.toLowerCase().includes(query)
        );

        renderTable(filteredWords);
    });
});
