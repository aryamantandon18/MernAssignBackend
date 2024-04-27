import express from 'express'
import { Login, Logout, SignUp, getMyProfile, uploadImage } from '../Controllers/user.js';
import { isAuthenticated } from '../middlewares/auth.js';
import multer from 'multer'
const upload = multer();


const router = express.Router();

router.post('/signup',SignUp);
router.post('/login',Login);
router.get('/logout',Logout);
router.get('/me',isAuthenticated,getMyProfile);
router.post('/uploadImage',isAuthenticated,upload.single('image'),uploadImage);


export default router;
