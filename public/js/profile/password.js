const CHANGE_PASSWORD_API = '/api/auth/password';

const changePasswordBtn = document.getElementById('change-password-btn');
const passwordModal = document.getElementById('password-modal');
const passwordModalClose = document.getElementById('password-modal-close');
const changePasswordForm = document.getElementById('change-password-form');
const curPasswordInput = document.getElementById('cur-password-input');
const newPasswordInput = document.getElementById('new-password-input');
const repeatPasswordInput = document.getElementById('repeat-password-input');
const passwordErrorElem = document.getElementById('password-error');

changePasswordBtn.onclick = () => {
    passwordModal.style.display = 'flex';
}

passwordModalClose.onclick = () => {
    passwordModal.style.display = 'none';
    passwordErrorElem.style.display = 'none';
}

changePasswordForm.onsubmit = async (e) => {
    e.preventDefault();
    passwordErrorElem.style.display = 'none';

    const res = await fetch(CHANGE_PASSWORD_API, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            currentPassword: curPasswordInput.value,
            newPassword: newPasswordInput.value,
            repeatNewPassword: repeatPasswordInput.value
        })
    });

    const body = await res.json();

    if (!body.success) {
        passwordErrorElem.style.display = 'block';
        passwordErrorElem.innerText = body.message;
        return;
    }

    passwordModal.style.display = 'none';
}