export default {
    showHome: async (req, res) => {
        return res.render('home');
    },
    showLogin: async (req, res) => {
        return res.render('login');
    },
    showRegister: async (req, res) => {
        return res.render('register');
    },
    showNotFound: async (req, res) => {
        return res.status(404).render('error', { title: '404', message: req.t('errors.notFound'), image: '/img/astolfo404.gif' });
    },
    showProfile: async (req, res) => {
        return res.render('profile');
    },
    logoutUser: async (req, res) => {
        req.session.destroy();
        return res.redirect('/');
    }
}