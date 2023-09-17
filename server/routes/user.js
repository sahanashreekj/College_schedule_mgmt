const express=require('express');
const router=express.Router();
const userController=require('../controller/userController')
const unController=require('../controller/unController')

router.get('/',userController.view);
router.get('/pinboard',userController.pinboardlog);
router.post('/pinboard',userController.pinboardcall);
router.get('/schedule',userController.schedulecall);
router.get('/contact',userController.contactcall);
router.post('/schedule',userController.schedulespecific);
router.get('/editmon',userController.editm);
router.post('/editmon',userController.editedm);
router.get('/edittue',userController.edittu);
router.post('/edittue',userController.editedtu);
router.get('/editwed',userController.editw);
router.post('/editwed',userController.editedw);
router.get('/editthu',userController.editth);
router.post('/editthu',userController.editedth);
router.get('/editfri',userController.editf);
router.post('/editfri',userController.editedf);


router.get('/adminhome',unController.view);
router.post('/adminhome',unController.view);
router.get('/addstudent',unController.form);
router.post('/addstudent',unController.submitstu);

router.get('/logcontrols',unController.logins);
router.get('/addlogins',unController.logadd);
router.post('/addlogins',unController.logsubmit);

router.get('/adminlogin',unController.adminLog);
router.get('/faclogin',unController.faclog);
router.post('/faclogin',unController.facsched);


 module.exports=router;