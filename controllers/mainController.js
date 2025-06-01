export default {
    showHome: async (req, res) => {
        res.render('home', { user: req.session.user });
    },
    showLogin: async (req, res) => {
        res.render('login', { user: req.session.user });
    },
    showRegister: async (req, res) => {
        res.render('register', { user: req.session.user });
    },
    showNotFound: async (req, res) => {
        res.render('notFound', { user: req.session.user });
    },
    showProfile: async (req, res) => {
        res.render('profile', { user: req.session.user });
    },
    logoutUser: async (req, res) => {
        req.session.destroy();
        res.redirect('/');
    }
}