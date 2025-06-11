const CHAT_ID = location.pathname.split('/')[2];
const MSG_LOAD_LIMIT_INITIAL = 15;
const MSG_LOAD_LIMIT_SCROLL = 10;
const SCROLL_LOAD_THRESHOLD = 100;
const ANCHORED_TO_BOTTOM_THRESHOLD = 10;

// API url's
const API_GET_CHATS = '/api/chats/';
// const API_GET_MESSAGES = `/api/chats/${CHAT_ID}/messages/`;
const API_SEND_MESSAGE = `/api/chats/${CHAT_ID}/send/`;

// DOM elements
const chatListElem = document.getElementById('chat-list');
const msgContainerElem = document.getElementById('message-container');
const msgSendButtonElem = document.getElementById('msg-send-button');
const msgTextareaElem = document.getElementById('msg-textarea');

// scroll
let scrollMsgOffset = 0;
let scrollIsLoading = false;
let scrollLoadMore = true;

// chat list
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

// messages

// {data, elem} oldest first
const msgArr = [];

// adds the message to both the array and the DOM
function addMsg(newMsgData) {
    let index = 0;
    for (const msg of msgArr) {
        if (msg.data.createdAt > newMsgData.createdAt)
            break;
        index++;
    }

    // TODO: check corner cases

    const nextChildElem = index === msgArr.length ? null : msgArr[index].elem;
    const newMsg = { data: newMsgData, elem: createMsgElem(newMsgData) };
    msgArr.splice(index, 0, newMsg);

    const anchoredToBottom = msgContainerElem.scrollTop + msgContainerElem.clientHeight >= msgContainerElem.scrollHeight - ANCHORED_TO_BOTTOM_THRESHOLD;

    // DOM
    if (nextChildElem === null) {
        msgContainerElem.appendChild(newMsg.elem);
    }
    else {
        msgContainerElem.insertBefore(newMsg.elem, nextChildElem);
    }

    if (anchoredToBottom) {
        // scrolling to bottom if already at bottom
        requestAnimationFrame(() => {
            msgContainerElem.scrollTo(0, msgContainerElem.scrollHeight);
        });
    }
}

function createMsgElem(msgData) {
    const root = document.createElement('div');
    root.classList.add('message');

    // avatar div
    const avatarDivElem = document.createElement('div');
    avatarDivElem.classList.add('avatar-container');

    const avatarElem = document.createElement('img');
    avatarElem.src = msgData.sender.avatarUrl;

    avatarDivElem.appendChild(avatarElem);

    // username/text div
    const usernameTextDivElem = document.createElement('div');
    usernameTextDivElem.classList.add('username-text-container');

    const usernameElem = document.createElement('h4');
    usernameElem.classList.add('username');
    usernameElem.innerText = msgData.sender.username;

    const msgTextElem = document.createElement('p');
    msgTextElem.classList.add('msg-text');
    msgTextElem.innerText = msgData.text;

    usernameTextDivElem.appendChild(usernameElem);
    usernameTextDivElem.appendChild(msgTextElem);

    root.appendChild(avatarDivElem);
    root.appendChild(usernameTextDivElem);

    return root;
}

// returns the parsed api body or null if !success
async function loadMessages(limit, offset) {
    const apiGetMessages = `/api/chats/${CHAT_ID}/messages?limit=${limit}&offset=${offset}`;

    const res = await fetch(apiGetMessages, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const body = await res.json();

    if (!body.success) {
        messagesElem.innerText = body.message;
        return null;
    }

    const messages = body.messages;

    for (let msgData of messages) {
        addMsg(msgData);
    }

    return body.messages;
}

async function init() {
    loadChatList();

    const messages = await loadMessages(MSG_LOAD_LIMIT_INITIAL, 0);
    if (messages) {
        scrollMsgOffset = messages.length;
    }
}

window.onload = () => {
    init();
};

async function scrollLoad() {
    if (!scrollLoadMore || scrollIsLoading) return;

    scrollIsLoading = true;

    const messages = await loadMessages(MSG_LOAD_LIMIT_SCROLL, scrollMsgOffset);

    if (!messages || messages.length === 0) {
        scrollLoadMore = false;
    } else {
        scrollMsgOffset += messages.length;
    }

    scrollIsLoading = false;

    // crutch to fix a scrolling issue    
    requestAnimationFrame(() => {
        console.log(msgContainerElem.scrollTop);
        msgContainerElem.scrollTo(0, msgContainerElem.scrollTop + 1);
        msgContainerElem.scrollTo(0, msgContainerElem.scrollTop - 1);
    });
}

msgContainerElem.onscroll = () => {
    const nearTop = msgContainerElem.scrollTop <= SCROLL_LOAD_THRESHOLD;
    if (nearTop) {
        scrollLoad();
    }
};

async function sendMessageFromInput() {
    const res = await fetch(API_SEND_MESSAGE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: msgTextareaElem.value,
        })
    });

    // TODO: handle error

    msgTextareaElem.value = "";
};

//sending messages
if (msgSendButtonElem) {
    msgSendButtonElem.onclick = () => {
        sendMessageFromInput();
    }

    document.onkeydown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();

            sendMessageFromInput();
        }
    }
}

// TODO: handle invalid messages (too big, empty (if leading/trailing whitespace is removed))

// sockets
const socket = io();

socket.on("connect", () => {
    socket.emit('join_chat', Number(CHAT_ID));
});

socket.on('new_msg', (socketMsg) => {
    if (socketMsg.chatId != CHAT_ID)
        return;

    // TODO: validate?
    console.log(socketMsg);
    console.log(socketMsg.msgData);
    addMsg(socketMsg.msgData);
});