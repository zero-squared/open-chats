import axios from 'axios';

const instance = axios.create();

// Encode "{private_key}:" string to base64 for authorization according to documentation: https://imagekit.io/docs/api-reference
const authorization = Buffer.from(`${process.env.IK_PRIVATE_KEY}:`).toString('base64');

instance.defaults.headers.common['Authorization'] = `Basic ${authorization}`;


export async function uploadFile(formData) {
    return await instance.request({
        method: 'POST',
        url: 'https://upload.imagekit.io/api/v1/files/upload',
        headers: {
            Accept: 'application/json',
            ...formData.getHeaders()
        },
        data: formData
    });
}

export async function deleteFile(fileId) {
    return await instance.request({
        method: 'DELETE',
        url: `https://api.imagekit.io/v1/files/${fileId}`,
        headers: {
            Accept: 'application/json'
        }
    });
}