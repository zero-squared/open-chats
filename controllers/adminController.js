import { ADMIN_TABS } from '../utils/config.js';

export default{
    showAdmin: async (req, res, next) => {
        const tabName = req.params.tab;

        if (!ADMIN_TABS.includes(tabName)) {
            return next();
        }

        return res.render('admin', { tabName: tabName });
    },
    redirectMainAdmin: async (req, res) => {
        return res.redirect(`/admin/${ADMIN_TABS[0]}`);
    }
}