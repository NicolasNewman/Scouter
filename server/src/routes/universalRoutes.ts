import { Router } from 'express';
import * as universalController from '../controllers/universalController';

const router: Router = Router();

router
    .route('/:matchNumber/:alliance/:seed/:teamNumber/match')
    .post(universalController.postMatch);

router
    .route('/:matchNumber/:alliance/event')
    .post(universalController.postTeamEvent);

export default router;
