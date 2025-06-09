const API_GET_CHATS = '/api/chats/';
const CHAT_ID = location.pathname.split('/')[2];
const API_GET_MESSAGES = `/api/chats/${CHAT_ID}/messages/`;
const API_SEND_MESSAGE = `/api/chats/${CHAT_ID}/send/`;

const chatListElem = document.getElementById('chat-list');
const messagesElem = document.getElementById('message-container');
const msgSendButtonElem = document.getElementById('msg-send-button');
const msgTextareaElem = document.getElementById('msg-textarea');

function createChatElem(chat) {
    const root = document.createElement('div');
    root.classList.add('list-item');

    const linkElem = document.createElement('a');
    linkElem.href = `/chats/${chat.id}`;
    linkElem.innerText = chat.name;
    
    root.appendChild(linkElem);
    
    // highlight the opened chat
    if (chat.id == CHAT_ID) {
        root.classList.add('active');
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

    const body = await res.json();

    if (!body.success) {
        chatListElem.innerText = body.message;
        return;
    }

    const chats = body.chats;

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
    avatarElem.src = msg.sender.avatarUrl;
    
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
    const res = await fetch(API_GET_MESSAGES, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const body = await res.json();

    if (!body.success) {
        messagesElem.innerText = body.message;
        return;
    }

    const messages = body.messages;

    for (let msg of messages) {
        messagesElem.prepend(createMsgElem(msg));
    }
}

window.onload = () => {
    loadChatList();
    loadMessages();
};

msgSendButtonElem.onclick = async () => {
    const res = await fetch(API_SEND_MESSAGE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: msgTextareaElem.value,
        })
    });
    
    location.reload();
};