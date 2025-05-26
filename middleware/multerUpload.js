import multer from 'multer';

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024,
    }
});

export default upload;