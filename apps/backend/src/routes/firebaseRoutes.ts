import { Router } from 'express';
import {
    registerUser,
    signinUser
} from '../controllers/firebaseController';

const router = Router();

router.post('/auth/register', registerUser);
router.post('/auth/signin', signinUser);

export default router;