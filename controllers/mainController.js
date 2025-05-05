export default {
    showIndex: async (req, res) => {
        res.render('home');
    },
    showLogin: async (req, res) => {
        res.render('login');
    },
    showRegister: async (req, res) => {
        res.render('register');
    }
}