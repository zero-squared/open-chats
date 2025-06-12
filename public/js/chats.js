const CHAT_ID = Number(location.pathname.split('/')[2]);
const MSG_LOAD_LIMIT_INITIAL = 15;
const MSG_LOAD_LIMIT_SCROLL = 10;
const SCROLL_LOAD_THRESHOLD = 100;
const ANCHORED_TO_BOTTOM_THRESHOLD = 10;
const CHAT_LIMIT = 30;

// API url's
// const API_GET_CHATS = '/api/chats/';
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

let chatOffset = 0;
let loadMoreChats = true;
let isLoadingChats = false;

// chat list
function createChatElem(chat) {
    const root = document.createElement('div');
    root.classList.add('list-item');

    const linkElem = document.createElement('a');
    linkElem.href = `/chats/${chat.id}`;
    linkElem.innerText = chat.name;

    root.appendChild(linkElem);

    // highlight the opened chat
    if (chat.id === CHAT_ID) {
        root.classList.add('active');
    }
    return root;
}

async function loadNewChats() {
    // TODO: maybe handle promise reject
    isLoadingChats = true;

    const res = await fetch(`/api/chats/?limit=${CHAT_LIMIT}&offset=${chatOffset}`, {
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
    chatOffset += chats.length;

    if (chats.length === 0) {
        loadMoreChats = false;
    }

    for (let chat of chats) {
        chatListElem.appendChild(createChatElem(chat));
    }

    isLoadingChats = false;
}

chatListElem.onscroll = async () => {
    const nearBottom = chatListElem.scrollTop + chatListElem.clientHeight >= chatListElem.scrollHeight - 10;
    if (nearBottom && loadMoreChats && !isLoadingChats) {
        await loadNewChats();
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
    usernameElem.classList.add(msgData.sender.role);
    usernameElem.innerText = formatUsername(msgData.sender.username, msgData.sender.role, msgData.sender.label);

    if (currentUser && currentUser.id !== msgData.sender.id) {
        usernameElem.onclick = async () => {
            await changeLabel(msgData.sender);
        }
        usernameElem.classList.add('hover-underline');
    }

    const msgTextElem = document.createElement('p');
    msgTextElem.classList.add('msg-text');
    msgTextElem.innerText = msgData.text;

    usernameTextDivElem.appendChild(usernameElem);
    usernameTextDivElem.appendChild(msgTextElem);

    root.appendChild(avatarDivElem);
    root.appendChild(usernameTextDivElem);

    // delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    const deleteBtnImg = document.createElement('img');
    deleteBtnImg.src = '/img/delete.png';
    deleteBtn.appendChild(deleteBtnImg);
    deleteBtn.onclick = async () => {
        if (confirm(localization.actions.confirmDeletion)) await deleteMessage(msgData.id);
    }
    root.appendChild(deleteBtn);

    if (!msgData.canDelete) {
        deleteBtn.classList.add("invisible");
    }


    return root;
}

function formatUsername(username, role, label) {
    if (!label) {
        return `${username} - ${localization.roles[role]}`;
    }
    return `${label} [${username}] - ${localization.roles[role]}`;
}

async function changeLabel(targetUser) {
    let labelText = prompt(localization.label.enterText, targetUser.label || targetUser.username);
    if (labelText === null) return;

    const res = await fetch(`/api/users/${targetUser.id}/label/`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: labelText,
        })
    });

    const body = await res.json();

    if (!body.success) {
        alert(body.message);
        return;
    }

    updateUsername(targetUser, body.text);
}

function updateUsername(user, label) {
    for (const msg of msgArr) {
        if (msg.data.sender.id === id) {
            const usernameElem = msg.elem.getElementsByClassName('username')[0];

            msg.data.sender.label = label;
            usernameElem.innerText = formatUsername(user.username, user.role,  label);
        }
    }
}

// returns the parsed api body or null if !success
async function loadMessages(limit, offset) {
    const apiGetMessages = `/api/chats/${CHAT_ID}/messages?limit=${limit}&offset=${offset}`;

    const prevScrollHeight = msgContainerElem.scrollHeight;
    const prevScrollTop = msgContainerElem.scrollTop;

    const res = await fetch(apiGetMessages, {
        method: 'GET'
    });

    const body = await res.json();

    if (!body.success) {
        msgContainerElem.innerText = body.message;
        return null;
    }

    const messages = body.messages;

    for (let msgData of messages) {
        addMsg(msgData);
    }

    requestAnimationFrame(() => {
        const newScrollHeight = msgContainerElem.scrollHeight;
        msgContainerElem.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight);
    });

    return body.messages;
}

async function init() {
    loadNewChats();

    const messages = await loadMessages(MSG_LOAD_LIMIT_INITIAL, 0);
    if (messages) {
        scrollMsgOffset = messages.length;
    }
}

window.onload = async () => {
    await getLocalization();
    await getCurrentUser();
    await init();
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
}

msgContainerElem.onscroll = () => {
    const nearTop = msgContainerElem.scrollTop <= SCROLL_LOAD_THRESHOLD;
    if (nearTop) {
        scrollLoad();
    }
};

async function sendMessageFromInput() {
    if (msgTextareaElem.value.trim() === "") {
        return;
    }

    let res;
    try {
        res = await fetch(API_SEND_MESSAGE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: msgTextareaElem.value,
            })
        });
    }
    catch {
        alert(localizedStrings.errors.unexpectedError);
        return;
    }

    const body = await res.json();
    if (!body.success) {
        alert(body.message);
        return;
    }

    msgTextareaElem.value = "";
}

async function deleteMessage(messageId) {
    const res = await fetch(`/api/chats/${CHAT_ID}/messages/${messageId}`, {
        method: 'DELETE'
    });

    const body = await res.json();

    if (!body.success) {
        alert(body.message);
        return;
    }
}

function removeMessageElem(messageId) {
    for (let i = 0; i < msgArr.length; i++) {
        const msg = msgArr[i];

        if (msg.data.id === messageId) {
            msg.elem.remove();
            msgArr.splice(i, 1);
            break;
        }
    }
}

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

// sockets
const socket = io();

socket.on("connect", () => {
    socket.emit('join_chat', CHAT_ID);
});

socket.on('new_msg', (socketMsg) => {
    addMsg(socketMsg.msgData);
});

socket.on('delete_msg', (socketMsg) => {
    removeMessageElem(socketMsg.msgId);
});