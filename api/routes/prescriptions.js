// Prescriptions routing
const express = require('express');
const router = express.Router();
//const multer = require('multer');
const PrescriptionsController = require('../controllers/prescriptions');
const checkAuth = require('../middleware/check-auth');

/*
  Following lines are for file uploading with multer:
  storage for the path on the disk, fileFilter for
  accepting specific file types
*/
/*
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/prescriptions');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }     
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    }
    else {
        cb(new Error('Not valid filetype'), false);
    }
};

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024*1024*5
    },
    fileFilter: fileFilter
});
*/

/* 
  Supported routes are get @ / that brings the list of all
  prescriptions, post @ / that creates a new prescription,
  get @ /:prescriptionId that brings a single prescription,
  patch @ /:prescriptionId that updates a single prescription
  and delete @ /:prescriptionId that deletes a single prescription
  all routes need authorization
*/
router.get('/', checkAuth, PrescriptionsController.prescriptions_get_all);

router.post('/', checkAuth, PrescriptionsController.prescriptions_create_prescription);

router.get('/:prescriptionId', checkAuth, PrescriptionsController.prescriptions_get_one);

router.patch('/:prescriptionId', checkAuth, PrescriptionsController.prescriptions_update_prescription);

router.delete('/:prescriptionId', checkAuth, PrescriptionsController.prescriptions_delete_prescription);

module.exports = router;