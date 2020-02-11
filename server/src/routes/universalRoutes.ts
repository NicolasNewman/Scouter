import { Router } from 'express';
import * as universalController from '../controllers/universalController';

const router: Router = Router();

router
    .route('/:matchNumber/:alliance/:seed/:teamNumber/match')
    .post(universalController.postMatch);

router
    .route('/:matchNumber/:alliance/event')
    .post(universalController.postTeamEvent);

router.route('/download').get(universalController.download);

export default router;
