const USERS_API = '/api/users/';
const LIMIT = 30;
const DEFAULT_AVATAR = '/img/defaultAvatar.png';

let offset = 0;
let isLoading = true;
let loadMore = true;

const loaderElem = document.getElementById('loader');
const usersContainer = document.getElementById('users-container');
const scrollElem = document.getElementById('users-scroll');

async function loadNewUsers() {
    isLoading = true;
    loaderElem.style.display = 'flex';

    const res = await fetch(`${USERS_API}?offset=${offset}&limit=${LIMIT}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const users = await res.json();

    if (users.length === 0) {
        loadMore = false;
    }

    for (const user of users) {
        const userElem = createUserElem(user);
        usersContainer.appendChild(userElem);
    }

    // offset += users.length;
    loaderElem.style.display = 'none';
    isLoading = false;
}

function createUserElem(user) {
    const userElem = document.createElement('div');
    const avatarElem = document.createElement('img');
    avatarElem.src = user.avatarUrl || DEFAULT_AVATAR;
    avatarElem.alt = 'Avatar';
    const usernameElem = document.createElement('p');
    usernameElem.textContent = user.username;
    const roleElem = document.createElement('p');
    if (user.role === 'admin') {
        roleElem.textContent = ADMIN_ROLE_TEXT;
    } else if (user.role === 'moderator') {
        roleElem.textContent = MODERATOR_ROLE_TEXT;
    } else {
        roleElem.textContent = USER_ROLE_TEXT;
    }
    userElem.appendChild(avatarElem);
    userElem.appendChild(usernameElem);
    userElem.appendChild(roleElem);
    userElem.classList.add('user');
    return userElem;
}

window.onload = () => {
    // for (let i = 0; i < 100; i++) {
        loadNewUsers();
    // }
    // loadMore = false;
    // loaderElem.style.display = 'flex';
};

scrollElem.onscroll = () => {
    const nearBottom = scrollElem.scrollTop + scrollElem.clientHeight >= scrollElem.scrollHeight - 10;
    if (nearBottom && loadMore && !isLoading) {
        loadNewUsers();
    }
};