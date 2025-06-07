export default {
    showHome: async (req, res) => {
        return res.render('home', { user: req.session.user });
    },
    showLogin: async (req, res) => {
        return res.render('login', { user: req.session.user });
    },
    showRegister: async (req, res) => {
        return res.render('register', { user: req.session.user });
    },
    showNotFound: async (req, res) => {
        return res.render('notFound', { user: req.session.user });
    },
    showProfile: async (req, res) => {
        return res.render('profile', { user: req.session.user });
    },
    logoutUser: async (req, res) => {
        req.session.destroy();
        return res.redirect('/');
    }
}