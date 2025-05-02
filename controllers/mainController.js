export default {
    showIndex: async (req, res) => {
        res.render('index');
    },
    showLogin: async (req, res) => {
        res.render('login');
    },
    showRegister: async (req, res) => {
        res.render('register');
    }
}