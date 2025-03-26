import express from 'express';
import {registerUser, loginUser} from '../controllers/authController.js';


const register = registerUser
const router = express.Router();

router.post('/register', register );
router.post('/login', loginUser );

export default router;