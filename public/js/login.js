const loginForm = document.getElementById('login-form');

const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');

const errorElem = document.getElementById('error');

const LOGIN_API = '/api/auth/login';
const REDIRECT = '/';

loginForm.onsubmit = async (e) => {
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
            errorElem.innerText = body.error;
            return;
        }

        window.location.href = REDIRECT;

    } catch (e) {
        console.error(e);
        errorElem.innerText = 'Unexpected error';
    }
}