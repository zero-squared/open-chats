const REGISTER_API = '/api/auth/register';
const REDIRECT = '/';

const registerForm = document.getElementById('register-form');
const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const repeatPasswordInput = document.getElementById('repeat-password-input');
const errorElem = document.getElementById('error');

registerForm.onsubmit = async (e) => {
    e.preventDefault();
    
    errorElem.innerText = '';

    try {
        const res = await fetch(REGISTER_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value,
                repeatPassword: repeatPasswordInput.value
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
        errorElem.innerText = localizedStrings.errors.unexpectedError;
    }
}