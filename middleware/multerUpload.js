import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024
    }
});

export function uploadSingleImage(req, res, next) {
    upload.single('image')(req, res, (e) => {
        if (e instanceof multer.MulterError) {
            return res.status(400).send({
                success: false,
                message: e.message
            });
        } else if (e) {
            return res.status(500).send({
                success: false,
                message: 'Internal Server Error'
            });
        }

        return next();
    });
}

export default upload;