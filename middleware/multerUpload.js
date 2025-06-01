import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024
    }
});

export function uploadSingleImage(req, res, next) {
    return upload.single('image')(req, res, (e) => {
        if (e instanceof multer.MulterError) {
            return res.status(400).send({
                success: false,
                message: e.message
            });
        } else if (e) {
            console.error(e);

            return res.status(500).send({
                success: false,
                message: 'Internal Server Error'
            });
        }

        if (!req.file.originalname.endsWith('.png') && !req.file.originalname.endsWith('.jpg')) {
            return res.status(400).send({
                success: false,
                message: 'File does not have a .png or .jpg extension.'
            });
        }

        return next();
    });
}

export default upload;