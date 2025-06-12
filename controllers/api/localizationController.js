import i18next from 'i18next';

import { SUPPORTED_LANGS, FALLBACK_LANG } from '../../utils/config.js';

// FIXME: does not use fallback if the language is in SUPPORTED_LANGS (translations are partially available for the language)
export default {
    getLocalization: async (req, res) => {
        if (!SUPPORTED_LANGS.includes(req.language)) {
            return res.send(i18next.getResourceBundle(FALLBACK_LANG));
        }

        return res.send(i18next.getResourceBundle(req.language));
    }
}