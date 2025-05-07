const registerForm = document.getElementById('register-form');

const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const repeatPasswordInput = document.getElementById('repeat-password-input');

const errorElem = document.getElementById('error');

const REGISTER_API = '/api/auth/register';

registerForm.onsubmit = async (e) => {
    e.preventDefault();

    if (passwordInput.value !== repeatPasswordInput.value) {
        errorElem.innerText = 'Passwords must be the same';
        return;
    }
    errorElem.innerText = '';

    try {
        const res = await fetch(REGISTER_API, {
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
            errorElem.innerText = body.error;
            return;
        }

        window.location.href = '/channels';

    } catch (e) {
        console.error(e);
        errorElem.innerText = 'Unexpected error';
    }
}