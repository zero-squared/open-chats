import { getUserDataObj } from './users.js';

export async function updateSession(req, user) {
    req.session.user = await getUserDataObj(user);
}