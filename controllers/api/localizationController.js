import i18next from 'i18next';

import { SUPPORTED_LANGS, FALLBACK_LANG } from '../../utils/config.js';

export default {
    getLocalization: async (req, res) => {
        if (!SUPPORTED_LANGS.includes(req.language)) {
            return res.send(i18next.getResourceBundle(FALLBACK_LANG));
        }

        return res.send(i18next.getResourceBundle(req.language));
    }
}