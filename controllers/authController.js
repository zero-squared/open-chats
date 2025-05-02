export default {
    registerUser: async (req, res) => {
        
    },
    loginUser: async (req, res) => {
        req.session.username = req.body.username;
        res.redirect('/chat');
    }
}