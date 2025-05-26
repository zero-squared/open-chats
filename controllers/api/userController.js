import FormData from 'form-data';
import axios from 'axios';

import upload from '../../middleware/multerUpload.js';
import sequelize from '../../models/index.js';

export default {
    updateAvatar: async (req, res) => {
        if (!req.file) {
            return res.status(400).send({
                success: false,
            });
        }

        try {
            const formData = new FormData();
            formData.append('file', req.file.buffer, req.file.originalname);
            formData.append('fileName', req.file.originalname); // TODO Generate name
            formData.append('publicKey', process.env.IK_PUBLIC_KEY);

            // Encode "{private_key}:" string to base64 for authorization according to documentation: https://imagekit.io/docs/api-reference
            const authorization = Buffer.from(`${process.env.IK_PRIVATE_KEY}:`).toString('base64');

            const { data } = await axios.request({
                method: 'POST',
                url: 'https://upload.imagekit.io/api/v1/files/upload',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Basic ${authorization}`,
                    ...formData.getHeaders()
                },
                data: formData
            });
            
            await sequelize.models.User.update({
                avatarUrl: data.url
            }, {
                where: {
                    username: req.session.user.username
                }
            })
            req.session.user.avatarUrl = data.url;

            return res.send({
                success: true,
                avatarUrl: data.url
            });
        } catch (e) {
            console.error(e);

            return res.status(500).send({
                success: false,
                error: 'Internal Server Error'
            });
        }
    }
}