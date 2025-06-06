window.onload = async (e) => {
    e.preventDefault();

    try {
        const res = await fetch(LOGIN_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value
            })
        });

        const body = await res.json();

        if (!body.success) {
            errorElem.innerText = body.message;
            return;
        }

        window.location.href = REDIRECT;
    } catch (e) {
        console.error(e);
        errorElem.innerText = UNEXPECTED_ERROR_TEXT;
    }
}