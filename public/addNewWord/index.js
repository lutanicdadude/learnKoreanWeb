const form = document.getElementById('addWordForm');
// const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        kor_word: document.getElementById("newWord").value,
        eng_word: document.getElementById("definition").value,
        category: document.getElementById("category").value
    }

    try {
        const res = await fetch('/korean/addWord', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok) {
            // formMessage.textContent = "Promo code added successfully!";
            // formMessage.classList.remove('error-message');
            // formMessage.classList.add('success-message');
            console.log("success");
            form.reset();
        } else {
            // formMessage.textContent = `Error: ${result.error}`;
            // formMessage.classList.remove('success-message');
            // formMessage.classList.add('error-message');
            console.log("fail");
        }


    } catch (err) {
        formMessage.textContent = `Error: ${err.message}`;
        formMessage.classList.remove('success-message');
        formMessage.classList.add('error-message');
    }

});
