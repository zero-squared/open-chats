export default {
    registerUser: async (req, res) => {
        // TODO
        console.log(req.body);
    },
    loginUser: async (req, res) => {
        req.session.username = req.body.username;
        res.redirect('/channels');
    }
}