import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024
    }
});

export function uploadSingleImage(req, res, next) {
    return upload.single('image')(req, res, (e) => {
        if (e instanceof multer.MulterError && e.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).send({
                success: false,
                message: req.t('errors.fileTooLarge')
            });
        } else if (e) {
            console.error(e);

            return res.status(500).send({
                success: false,
                message: req.t('errors.internalServerError')
            });
        }

        if (!req.file.originalname.endsWith('.png') && !req.file.originalname.endsWith('.jpg')) {
            return res.status(400).send({
                success: false,
                message: req.t('errors.incorrectImageExtension')
            });
        }

        return next();
    });
}

export default upload;