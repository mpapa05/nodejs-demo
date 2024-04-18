const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProducsController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        // Extract file extension
        const ext = file.originalname.split('.').pop();
        // Generate a unique filename based on current timestamp
        const filename = new Date().toISOString().replace(/:/g, '-') + '.' + ext;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    // Accept a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        // Reject a file
        cb(null, false);
    }
};

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.get('/', ProducsController.products_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProducsController.products_create_product);

router.get('/:productId', ProducsController.products_get_product);

router.patch('/:productId', checkAuth, ProducsController.products_update_product);

router.delete("/:productId", checkAuth, ProducsController.products_delete_product);

module.exports = router;