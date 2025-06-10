const AVATAR_API = '/api/users/@me/avatar/';

const UPDATE_USER_API = '/api/users/@me/';

const avatarFileInput = document.getElementById('avatar-file-input');
const uploadAvatarLabel = document.getElementById('upload-avatar-label');
const deleteAvatarBtn = document.getElementById('delete-avatar-btn');
const avatarErrorElem = document.getElementById('avatar-error');
const avatarElem = document.getElementById('avatar');
const editUsernameBtn = document.getElementById('edit-username-btn');
const changePasswordBtn = document.getElementById('change-password-btn');
const usernameModal = document.getElementById('username-modal');
const usernameModalClose = document.getElementById('username-modal-close');
const usernameInput = document.getElementById('username-input');
const usernameElem = document.getElementById('username');
const editUsernameForm = document.getElementById('edit-username-form');
const usernameErrorElem = document.getElementById('username-error');

let avatarButtonsDisabled = false;

avatarFileInput.onchange = async () => {
    avatarErrorElem.style.display = 'none';
    toggleAvatarBtns(true);

    const file = avatarFileInput.files[0];

    const formData = new FormData();
    formData.append('image', file);

    try {
        const res = await fetch(AVATAR_API, {
            method: 'POST',
            body: formData
        });

        const body = await res.json();

        if (!body.success) {
            showAvatarError(body.message);
            toggleAvatarBtns(false);
            return;
        }

        avatarElem.src = body.avatarUrl;
    } catch (e) {
        console.error(e);
        showAvatarError(localizedStrings.errors.unexpectedError);
    }
    toggleAvatarBtns(false);
}

deleteAvatarBtn.onclick = async () => {
    avatarErrorElem.style.display = 'none';
    toggleAvatarBtns(true);

    try {
        const res = await fetch(AVATAR_API, {
            method: 'DELETE'
        });

        const body = await res.json();

        if (!body.success) {
            showAvatarError(body.message);
            toggleAvatarBtns(false);
            return;
        }

        avatarElem.src = body.avatarUrl;
    } catch (e) {
        console.error(e);
        showAvatarError(localizedStrings.errors.unexpectedError);
    }
    toggleAvatarBtns(false);
}

editUsernameBtn.onclick = () => {
    usernameInput.value = usernameElem.innerText;
    usernameModal.style.display = 'flex';
}

usernameModalClose.onclick = () => {
    usernameModal.style.display = 'none';
    usernameErrorElem.style.display = 'none';
}

editUsernameForm.onsubmit = async (e) => {
    e.preventDefault();
    usernameErrorElem.style.display = 'none';

    const res = await fetch(UPDATE_USER_API, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: usernameInput.value
        })
    });

    const body = await res.json();

    if (!body.success) {
        usernameErrorElem.style.display = 'block';
        usernameErrorElem.innerText = body.message;
        return;
    }

    usernameElem.innerText = body.username;
    usernameModal.style.display = 'none';
}

function showAvatarError(errorText) {
    avatarErrorElem.style.display = 'block';
    avatarErrorElem.innerText = errorText;
}

function toggleAvatarBtns(disabled) {
    avatarButtonsDisabled = disabled;

    if (disabled) {
        uploadAvatarLabel.classList.add('disabled');
        deleteAvatarBtn.classList.add('disabled');
    } else {
        uploadAvatarLabel.classList.remove('disabled');
        deleteAvatarBtn.classList.remove('disabled');
    }
}