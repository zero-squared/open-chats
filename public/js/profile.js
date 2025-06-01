const avatarForm = document.getElementById('avatar-form');

const fileInput = document.getElementById('file-input');

const errorElem = document.getElementById('error');
const avatarElem = document.getElementById('avatar');

const UPDATE_AVATAR_API = '/api/users/@me/avatar';

avatarForm.onsubmit = async (e) => {
    e.preventDefault();

    errorElem.innerText = '';

    const file = fileInput.files[0];
        
    const formData = new FormData();
    formData.append('image', file);

    try {
        const res = await fetch(UPDATE_AVATAR_API, {
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
        errorElem.innerText = 'Unexpected error';
    }
}