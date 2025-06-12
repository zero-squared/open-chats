const USERS_API = '/api/users/';
const USER_API = '/api/users/@me/';
const LIMIT = 20;

let offset = 0;
let isLoading = true;
let loadMore = true;
let curUser;

const loaderElem = document.getElementById('loader');
const usersContainer = document.getElementById('users-container');
const scrollElem = document.getElementById('users-scroll');

async function loadNewUsers() {
    isLoading = true;
    loaderElem.style.display = 'flex';

    const res = await fetch(`${USERS_API}?offset=${offset}&limit=${LIMIT}`, {
        method: 'GET'
    });

    const body = await res.json();

    if (!body.success) {
        loadMore = false;
        loaderElem.innerText = body.message;
        return;
    }

    const users = body.users;

    if (users.length === 0) {
        loadMore = false;
    }

    for (const user of users) {
        const userElem = createUserElem(user, body.localization);
        usersContainer.appendChild(userElem);
    }

    offset += users.length;
    loaderElem.style.display = 'none';
    isLoading = false;
}

async function deleteAvatar(userId, avatarElem) {
    const res = await fetch(`/api/users/${userId}/avatar`, {
        method: 'DELETE'
    });

    const body = await res.json();

    if (!body.success) {
        alert(body.message);
        return;
    }

    avatarElem.src = body.avatarUrl;
}

async function updateRole(userId, roleId) {
    const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            roleId: roleId
        })
    });

    const body = await res.json();

    if (!body.success) {
        alert(body.message);
        return;
    }
}

function createUserElem(user, localization) {
    const userElem = document.createElement('div');

    const avatarElem = document.createElement('img');
    avatarElem.src = user.avatarUrl;
    avatarElem.alt = 'Avatar';
    userElem.appendChild(avatarElem);

    const usernameElem = document.createElement('p');
    usernameElem.innerText = user.username;
    userElem.appendChild(usernameElem);

    const createAtElem = document.createElement('p');
    const createdAt = new Date(user.createdAt);
    createAtElem.innerText = localDateString(createdAt, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    userElem.appendChild(createAtElem);

    if (user.id === curUser.id) {
        const roleElem = document.createElement('p');
        roleElem.innerText = localization.roles[user.role];

        userElem.appendChild(roleElem);
    } else {
        const changeRoleSelect = document.createElement('select');
        changeRoleSelect.classList.add('primary-select');

        const userRoleOption = document.createElement('option');
        userRoleOption.innerText = localization.roles.user;
        userRoleOption.value = 1;
        const moderatorRoleOption = document.createElement('option');
        moderatorRoleOption.innerText = localization.roles.moderator;
        moderatorRoleOption.value = 2;
        const adminRoleOption = document.createElement('option');
        adminRoleOption.innerText = localization.roles.admin;
        adminRoleOption.value = 3;

        if (user.role === 'user') {
            changeRoleSelect.selected = true;
        } else if (user.role === 'moderator') {
            moderatorRoleOption.selected = true;
        } else if (user.role === 'admin') {
            adminRoleOption.selected = true;
        }

        changeRoleSelect.appendChild(userRoleOption);
        changeRoleSelect.appendChild(moderatorRoleOption);
        changeRoleSelect.appendChild(adminRoleOption);

        changeRoleSelect.onchange = async () => {
            await updateRole(user.id, changeRoleSelect.value);
        }

        userElem.appendChild(changeRoleSelect);
    }

    const deleteAvatarBtn = document.createElement('button');
    deleteAvatarBtn.classList.add('primary-btn');
    deleteAvatarBtn.innerText = localization.actions.deleteAvatar;

    deleteAvatarBtn.onclick = async () => {
        await deleteAvatar(user.id, avatarElem);
    }

    userElem.appendChild(deleteAvatarBtn);
    
    userElem.classList.add('user');

    return userElem;
}

window.onload = async () => {
    const res = await fetch(USER_API, {
        method: 'GET'
    });

    const body = await res.json();

    if (!body.success) {
        alert(body.message);
        return;
    }

    curUser = body.user;

    await loadNewUsers();
}

scrollElem.onscroll = async () => {
    const nearBottom = scrollElem.scrollTop + scrollElem.clientHeight >= scrollElem.scrollHeight - 10;
    if (nearBottom && loadMore && !isLoading) {
        await loadNewUsers();
    }
}