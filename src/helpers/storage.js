const multer = require("fastify-multer");
const path = require("path");
const { v4: uuidv4 } = require('uuid');


const imageStorage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, path.join(__dirname, '../images/profile-picture'));
    },
    filename: (request, file, cb) => {
        const originalFileExtension = path.extname(file.originalname);
        cb(null, uuidv4() + originalFileExtension);
    }
})

const photoFilter = (request, file, cb) => {
    if (file.mimetype === "image/jpg" || file.mimetype === "image/png") {
        return cb(null, true) // accept
    }
    return cb(new Error("Not acceptable image format"), false) // ignore
}

const photoUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1024 * 1024 * 5 // accepts less than or equals to 5 MB
    },
    fileFilter: photoFilter,
})

module.exports = { photoUpload }