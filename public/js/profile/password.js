const changePasswordBtn = document.getElementById('change-password-btn');
const passwordModal = document.getElementById('password-modal');
const passwordModalClose = document.getElementById('password-modal-close');

changePasswordBtn.onclick = () => {
    passwordModal.style.display = 'flex';
}

passwordModalClose.onclick = () => {
    passwordModal.style.display = 'none';
}