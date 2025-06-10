const AVATAR_API = '/api/users/@me/avatar';

const avatarFileInput = document.getElementById('avatar-file-input');
const uploadAvatarLabel = document.getElementById('upload-avatar-label');
const deleteAvatarBtn = document.getElementById('delete-avatar-btn');
const avatarErrorElem = document.getElementById('avatar-error');
const avatarElem = document.getElementById('avatar');

let avatarButtonsDisabled = false;

// TODO Fix avatar uploading with space in filename

avatarFileInput.onchange = async (e) => {
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
        showAvatarError(UNEXPECTED_ERROR_TEXT);
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
        showAvatarError(UNEXPECTED_ERROR_TEXT);
    }
    toggleAvatarBtns(false);
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