const router = require('express').Router()
const multer = require('multer')

const storage = multer.memoryStorage(); // Use memory storage to keep files in memory as buffers

const upload = multer({ storage: storage });

const {authorization_user, authorization_chat, authorization_lender} = require('../../services/jwt')
const lenderController = require('../controllers/lender/lenderController')
const userController = require('../controllers/user')
const profileController = require('../controllers/lender/profile')
const communityChatController = require('../controllers/dsa/communityChat')

const lenderApproval = require('../controllers/lender/caseApproval')

router.post('/lendersignup',lenderController.lenderSignup)
router.post('/signUpWithVisitingCard', upload.single('visitingCardImage'), lenderController.signUpWithVisitingCard);
router.post('/lenderlogin',lenderController.lenderLogin)
router.post('/lenderverifyotp/:id',lenderController.lenderVerifyOtp)
router.post('/lenderApproval',lenderApproval)

// router.post('/createprofile',upload.single('visitingCard'),profileController.createProfile)
// Update lender profile (fields requiring admin verification)
router.post('/update-profile/:id', upload.single('visitingCardImage'),profileController.updateLenderProfile);

// Update basic lender information (fields not requiring admin verification)
router.patch('/update-personal-info/:id', profileController.updatePersonalInfo);


router.get('/caseDetail',lenderController.getCaseDetail)

//user
router.post('/usersignup',userController.userSignUp)
router.post('/otpverify',userController.otpVerify)
router.post('/userlogin',userController.userLogin)
router.post('/search',userController.search)
router.post('/resendotp',userController.resendOtp)
router.post('/changepassword/:id',userController.changepassword)
router.post('/Forgotpassword',userController.Forgotpassword)

// contactus 
router.post('/contactus', userController.contactUs)


//COMMUNITYCHAT
router.post('/askquestion',communityChatController.askQuestion)
router.post('/addreply/:id',authorization_user,communityChatController.addReply)
router.get('/getcommunities',communityChatController.getcommunities)



module.exports = router