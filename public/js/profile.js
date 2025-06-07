const avatarForm = document.getElementById('avatar-form');

const fileInput = document.getElementById('file-input');

const errorElem = document.getElementById('error');
const avatarElem = document.getElementById('avatar');
const deleteAvatarBtn = document.getElementById('delete-avatar-btn');

const AVATAR_API = '/api/users/@me/avatar';

avatarForm.onsubmit = async (e) => {
    e.preventDefault();

    errorElem.innerText = '';

    const file = fileInput.files[0];
        
    const formData = new FormData();
    formData.append('image', file);

    try {
        const res = await fetch(AVATAR_API, {
            method: 'POST',
            body: formData
        });

        const body = await res.json();

        if (!body.success) {
            errorElem.innerText = body.message;
            return;
        }

        avatarElem.src = body.avatarUrl;
    } catch (e) {
        console.error(e);
        errorElem.innerText = UNEXPECTED_ERROR_TEXT;
    }
}

deleteAvatarBtn.onclick = async () => {
    try {
        const res = await fetch(AVATAR_API, {
            method: 'DELETE'
        });

        const body = await res.json();

        if (!body.success) {
            errorElem.innerText = body.message;
            return;
        }

        avatarElem.src = DEFAULT_AVATAR;
    } catch (e) {
        console.error(e);
        errorElem.innerText = UNEXPECTED_ERROR_TEXT;
    }
}