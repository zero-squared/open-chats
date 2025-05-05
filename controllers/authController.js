export default {
    registerUser: async (req, res) => {
        // TODO
        res.send('todo');
    },
    loginUser: async (req, res) => {
        req.session.username = req.body.username;
        res.redirect('/channels');
    }
}