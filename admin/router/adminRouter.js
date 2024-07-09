const router = require('express').Router()
const {authorization_admin} = require('../../services/jwt')
const multer = require('multer')


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
 });
 
 const upload = multer({ storage: storage });
 
 const multerarray = [
  { name: 'uploadpan', maxCount: 1 },
  { name: 'aadharfront', maxCount: 1 },
  { name: 'aadharback', maxCount: 1 }
 ]
 


const adminOnbording = require('../controller/adminOnbording')
const dsaController = require('../../app/controllers/dsa/dsaController')
const lenderController = require('../../app/controllers/lender/lenderController')
const communityChat = require('../../admin/controller/communityChat')
const dsauploadController = require('../../admin/controller/adminBulkUpload')

const caseApprovel = require('../controller/caseApproval')

router.post('/adminsignup',adminOnbording.adminSignup)
router.post('/adminlogin',adminOnbording.adminLogin)
router.post('/forgotpassword',authorization_admin,adminOnbording.forgotPassword)
router.get('/getdsa',authorization_admin,adminOnbording.getDsa)
router.get('/getuser',authorization_admin,adminOnbording.getUser)
router.get('/getlender',authorization_admin,adminOnbording.getLender)
router.post('/createdsa',authorization_admin,upload.fields(multerarray),adminOnbording.dsaSignup)
router.post('/createlender',authorization_admin,lenderController.lenderSignup)
router.post('/deletedsa/:id',authorization_admin,adminOnbording.deleteDsa)
router.post('/deleteuser/:id',authorization_admin,adminOnbording.deleteUser)
router.post('/deletelender/:id',authorization_admin,adminOnbording.deleteLender)
router.patch('/updatedsa/:id',authorization_admin,adminOnbording.updateDsa)
router.post('/updateuser/:id',authorization_admin,adminOnbording.updateUser)
router.patch('/verify-lender-update/:id',authorization_admin,adminOnbording.verifyLenderUpdate);

router.get('/case-approval', caseApprovel.getLenderInterests);
router.get('/getReply',communityChat.getReply)
//COMMUNITYCHAT
  router.get('/getchat',communityChat.getChat)
  router.patch('/updateChat/:id',communityChat.updateChat)
  router.get('/getAllContactus',communityChat.getAllContactus)
  router.post('/deletechat/:id',communityChat.deleteChat)
  router.post('/adminupload',upload.single('attachment'),dsauploadController.adminbulkUpload)
  router.get('/getadminbulk/:id',dsauploadController.getadminbulk)



  module.exports = router