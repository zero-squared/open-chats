const CHATS_API = '/api/chats/';
const LIMIT = 20;

let offset = 0;
let isLoading = true;
let loadMore = true;

let curChatId;
let curChatNameElem;

const loaderElem = document.getElementById('loader');
const chatsContainer = document.getElementById('chats-container');
const scrollElem = document.getElementById('chats-scroll');
const editChatModal = document.getElementById('edit-chat-modal');
const editChatModalClose = document.getElementById('edit-chat-modal-close');
const editNameInput = document.getElementById('edit-name-input');
const editUsernameForm = document.getElementById('edit-chat-form');
const editChatErrorElem = document.getElementById('edit-chat-error');
const createChatBtn = document.getElementById('create-chat');

const createChatModalElems = {
    modal: document.getElementById('create-chat-modal'),
    closeBtn: document.getElementById('create-chat-modal-close'),
    form: document.getElementById('create-chat-form'),
    nameInput: document.getElementById('create-name-input'),
    error: document.getElementById('create-chat-error')
}

async function loadNewChats() {
    isLoading = true;
    loaderElem.style.display = 'flex';

    const res = await fetch(`${CHATS_API}?offset=${offset}&limit=${LIMIT}`, {
        method: 'GET'
    });

    const body = await res.json();

    if (!body.success) {
        loadMore = false;
        loaderElem.innerText = body.message;
        return;
    }

    const chats = body.chats;

    if (chats.length === 0) {
        loadMore = false;
    }

    for (const chat of chats) {
        const chatElem = createChatElem(chat, body.localization);
        chatsContainer.appendChild(chatElem);
    }

    offset += chats.length;
    loaderElem.style.display = 'none';
    isLoading = false;
}

function createChatElem(chat, localization) {
    const chatElem = document.createElement('div');

    const nameElem = document.createElement('p');
    nameElem.innerText = chat.name;
    chatElem.appendChild(nameElem);

    const createAtElem = document.createElement('p');
    const createdAt = new Date(chat.createdAt);
    createAtElem.innerText = localDateString(createdAt, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    chatElem.appendChild(createAtElem);

    const editChatBtn = document.createElement('button');
    editChatBtn.classList.add('primary-btn');
    editChatBtn.innerText = localization.actions.editChat;

    editChatBtn.onclick = async () => {
        curChatId = chat.id;
        editNameInput.value = nameElem.innerText;
        editChatErrorElem.style.display = 'none';
        editChatModal.style.display = 'flex';
        curChatNameElem = nameElem;
    }
    chatElem.appendChild(editChatBtn);

    const deleteChatBtn = document.createElement('button');
    deleteChatBtn.classList.add('primary-btn');
    deleteChatBtn.innerText = localization.actions.deleteChat;

    deleteChatBtn.onclick = async () => {
        const res = await fetch(`/api/chats/${chat.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: editNameInput.value
            })
        });

        const body = await res.json();

        if (!body.success) {
            alert(body.message);
            return;
        }

        chatElem.remove();
    }
    chatElem.appendChild(deleteChatBtn);

    chatElem.classList.add('chat');

    return chatElem;
}

window.onload = async () => {
    await loadNewChats();
}

scrollElem.onscroll = async () => {
    const nearBottom = scrollElem.scrollTop + scrollElem.clientHeight >= scrollElem.scrollHeight - 10;
    if (nearBottom && loadMore && !isLoading) {
        await loadNewChats();
    }
}

editChatModalClose.onclick = () => {
    editChatModal.style.display = 'none';
    editChatErrorElem.style.display = 'none';
}

editUsernameForm.onsubmit = async (e) => {
    e.preventDefault();
    editChatErrorElem.style.display = 'none';

    const res = await fetch(`/api/chats/${curChatId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: editNameInput.value
        })
    });

    const body = await res.json();

    if (!body.success) {
        editChatErrorElem.style.display = 'block';
        editChatErrorElem.innerText = body.message;
        return;
    }

    curChatNameElem.innerText = body.name;
    editChatModal.style.display = 'none';
}

createChatBtn.onclick = () => {
    createChatModalElems.nameInput.value = '';
    createChatModalElems.error.style.display = 'none';
    createChatModalElems.modal.style.display = 'flex';
}

createChatModalElems.closeBtn.onclick = () => {
    createChatModalElems.modal.style.display = 'none';
}

createChatModalElems.form.onsubmit = async (e) => {
    e.preventDefault();
    createChatModalElems.error.style.display = 'none';

    const res = await fetch('/api/chats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: createChatModalElems.nameInput.value
        })
    });

    const body = await res.json();

    if (!body.success) {
        createChatModalElems.error.style.display = 'block';
        createChatModalElems.error.innerText = body.message;
        return;
    }

    const chatElem = createChatElem(body.chat, body.localization);
    chatsContainer.appendChild(chatElem);
    createChatModalElems.modal.style.display = 'none';
}