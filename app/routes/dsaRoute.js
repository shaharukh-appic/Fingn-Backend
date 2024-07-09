//module.exports = app => {
  const router = require("express").Router();

  
 const dsaController =  require('../controllers/dsa/dsaController.js')
 const caseInfo = require('../controllers/dsa/caseDetails.js')


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



 router.post('/dsasignup',dsaController.dsaSignup)
 router.post('/dsalogin',dsaController.dsaLogin)
 router.post('/dsaverifyotp/:id',dsaController.dsaVerifyOtp)
 router.patch('/dsaupdate/:id',upload.fields(multerarray),dsaController.dsaUpdate)
 router.post('/casedetails',caseInfo.caseDetail)
 router.get('/getCaseApproval', caseInfo.getCaseApproval)


 //COMMUNITYCHAT








  // Create a new Tutorial
  //router.post("/", tutorials.create);

  // Retrieve all Tutorials
 // router.get("/", tutorials.findAll);

  // Retrieve all published Tutorials
 // router.get("/published", tutorials.findAllPublished);

  // Retrieve a single Tutorial with id
  //router.get("/:id", tutorials.findOne);

  // Update a Tutorial with id
  //router.put("/:id", tutorials.update);

  // Delete a Tutorial with id
 // router.delete("/:id", tutorials.delete);

  // Delete all Tutorials
 // router.delete("/", tutorials.deleteAll);

  //app.use("/api/tutorials", router);


module.exports = router

//};
