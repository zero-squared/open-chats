const UPDATE_USER_API = '/api/users/@me/';

const editUsernameBtn = document.getElementById('edit-username-btn');
const usernameModal = document.getElementById('username-modal');
const usernameModalClose = document.getElementById('username-modal-close');
const usernameInput = document.getElementById('username-input');
const usernameElem = document.getElementById('username');
const editUsernameForm = document.getElementById('edit-username-form');
const usernameErrorElem = document.getElementById('username-error');

editUsernameBtn.onclick = () => {
    usernameInput.value = usernameElem.innerText;
    usernameModal.style.display = 'flex';
    usernameInput.focus();
    document.onkeydown = (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            usernameModal.style.display = 'none';
            usernameErrorElem.style.display = 'none';
            document.onkeydown = null;
        }
    }
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