import { ADMIN_TABS } from '../utils/config.js';

export default{
    showAdmin: async (req, res, next) => {
        const tabName = req.params.tab;

        if (!ADMIN_TABS.includes(tabName)) {
            return next();
        }

        req.session.lastAdminTab = tabName;

        return res.render('admin', { tabName: tabName });
    },
    redirectAdmin: async (req, res) => {
        if (req.session.lastAdminTab) {
            return res.redirect(`/admin/${req.session.lastAdminTab}`);
        }

        return res.redirect(`/admin/${ADMIN_TABS[0]}`);
    }
}