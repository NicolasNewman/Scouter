import { Router } from 'express';
import * as universalController from '../controllers/universalController';

const router: Router = Router();

router
    .route('/:matchNumber/:alliance/:seed/:teamNumber/match')
    .post(universalController.postMatch);

export default router;
