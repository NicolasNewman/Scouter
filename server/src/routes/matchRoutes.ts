import { Router } from 'express';
import * as matchController from '../controllers/matchController';

const router: Router = Router({ mergeParams: true });

router
    .route('/')
    .get(matchController.getAllMatches)
    .post(matchController.createMatch);

router
    .route('/:id')
    .get(matchController.getMatch)
    .patch(matchController.updateMatch)
    .delete(matchController.deleteMatch);

router
    .route('/:matchNumber/:teamNumber/event')
    .post(matchController.updateMatchEvent);

router
    .route('/:matchNumber/:teamNumber/state')
    .post(matchController.updateMatchState);

export default router;
