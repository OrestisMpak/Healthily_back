// Diagnoses routing
const express = require('express');
const router = express.Router();
//const multer = require('multer');
const DiagnosesController = require('../controllers/diagnoses');
const checkAuth = require('../middleware/check-auth');

/*
  Following lines are for file uploading with multer:
  storage for the path on the disk, fileFilter for
  accepting specific file types
*/
/*
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/diagnoses');
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
  diagnoses, post @ / that creates a new diagnosis,
  get @ /:diagnosisId that brings a single diagnosis,
  patch @ /:diagnosisId that updates a single diagnosis
  and delete @ /:diagnosisId that deletes a single diagnosis
  all routes need authorization
*/
router.get('/', checkAuth, DiagnosesController.diagnoses_get_all);

router.post('/', checkAuth, DiagnosesController.diagnoses_create_diagnosis);

router.get('/:diagnosisId', checkAuth, DiagnosesController.diagnoses_get_one);

router.patch('/:diagnosisId', checkAuth, DiagnosesController.diagnoses_update_diagnosis);

router.delete('/:diagnosisId', checkAuth, DiagnosesController.diagnoses_delete_diagnosis);

module.exports = router;