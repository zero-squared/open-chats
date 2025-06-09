import { DEFAULT_AVATAR } from './config.js';

export async function updateSession(req, user) {
    const role = await user.getRole();

    req.session.user = {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl || DEFAULT_AVATAR,
        role: role.name
    }
}