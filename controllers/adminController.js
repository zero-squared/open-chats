const ADMIN_TABS = ['users', 'chats'];

export default{
    showAdmin: async (req, res, next) => {
        const tabName = req.params.tab;

        if (!ADMIN_TABS.includes(tabName)) {
            return next();
        }

        return res.render('admin', { user: req.session.user, tabName: tabName });
    },
    redirectMainAdmin: async (req, res) => {
        return res.redirect(`/admin/${ADMIN_TABS[0]}`);
    }
}