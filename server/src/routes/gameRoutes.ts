import { Router } from 'express';
import * as gameController from '../controllers/gameController';

const router: Router = Router();

router
    .route('/')
    .get(gameController.getAllGames)
    .post(gameController.createGame);

router
    .route('/:matchNumber')
    .get(gameController.getGame)
    .patch(gameController.updateGame)
    .delete(gameController.deleteGame);

router
    .route('/:matchNumber/:alliance/event')
    .post(gameController.updateGameEvent);

export default router;
