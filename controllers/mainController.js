export default {
    showHome: async (req, res) => {
        res.render('home', { username: req.session.username });
    },
    showLogin: async (req, res) => {
        res.render('login', { username: req.session.username });
    },
    showRegister: async (req, res) => {
        res.render('register', { username: req.session.username });
    }

}