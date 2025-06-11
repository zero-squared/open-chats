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
const chatModal = document.getElementById('chat-modal');
const chatModalClose = document.getElementById('chat-modal-close');
const nameInput = document.getElementById('name-input');
const chatIdInput = document.getElementById('chat-id-input');
const editUsernameForm = document.getElementById('edit-chat-form');
const chatErrorElem = document.getElementById('chat-error');

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
        nameInput.value = nameElem.innerText;
        chatErrorElem.style.display = 'none';
        chatModal.style.display = 'flex';
        curChatNameElem = nameElem;
    }
    chatElem.appendChild(editChatBtn);

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

chatModalClose.onclick = () => {
    chatModal.style.display = 'none';
    chatErrorElem.style.display = 'none';
}

editUsernameForm.onsubmit = async (e) => {
    e.preventDefault();
    chatErrorElem.style.display = 'none';

    const res = await fetch(`/api/chats/${curChatId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: nameInput.value
        })
    });

    const body = await res.json();

    if (!body.success) {
        chatErrorElem.style.display = 'block';
        chatErrorElem.innerText = body.message;
        return;
    }

    curChatNameElem.innerText = body.name;
    chatModal.style.display = 'none';
}