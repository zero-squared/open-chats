const API_GET_CHATS = '/api/chats/';

// only valid if chatId !== null
const apiGetMessages = `/api/chats/${chatId}/messages/`;

const chatListElem = document.getElementById('chat-list');
const messagesElem = document.getElementById('message-container');

function createChatElem(chat) {
    const root = document.createElement('div');
    root.classList.add('list-item');

    const linkElem = document.createElement('a');
    linkElem.href = `/chats/${chat.id}`;
    linkElem.innerText = chat.name;
    
    
    root.appendChild(linkElem);
    
    // highlight the opened chat
    if (chat.id == chatId) {
        root.classList.add('current-chat')
    }
    return root;
}

async function loadChatList() {
    const res = await fetch(API_GET_CHATS, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const chats = await res.json();

    for (let chat of chats) {
        chatListElem.appendChild(createChatElem(chat));
    }
}

function createMsgElem(msg) {
    const root = document.createElement('div');
    root.classList.add('message');
    
    // avatar div
    const avatarDivElem = document.createElement('div');
    avatarDivElem.classList.add('avatar-container');
    
    const avatarElem = document.createElement('img');
    // TODO: maybe add a default avatar url constant somewhere?
    avatarElem.src = msg.sender.avatarUrl || '/img/defaultAvatar.png';
    
    avatarDivElem.appendChild(avatarElem);
    
    // username/text div
    const usernameTextDivElem = document.createElement('div');
    usernameTextDivElem.classList.add('username-text-container');
    
    const usernameElem = document.createElement('h4');
    usernameElem.classList.add('username');
    usernameElem.innerText = msg.sender.username;
    
    const msgTextElem = document.createElement('p');
    msgTextElem.classList.add('msg-text');
    msgTextElem.innerText = msg.text;

    usernameTextDivElem.appendChild(usernameElem);
    usernameTextDivElem.appendChild(msgTextElem);

    root.appendChild(avatarDivElem);
    root.appendChild(usernameTextDivElem);

    return root;
}

async function loadMessages() {
    const res = await fetch(apiGetMessages, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const messages = await res.json();

    for (let msg of messages) {
        messagesElem.prepend(createMsgElem(msg));
    }

    mainContentElem.prepend(messagesElem);
}

window.onload = () => {
    loadChatList();
    loadMessages();
};