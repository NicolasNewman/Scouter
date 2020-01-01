import { Router } from 'express';
import * as teamController from '../controllers/teamController';
import matchRouter from '../routes/matchRoutes';

const router: Router = Router();

router
    .route('/')
    .get(teamController.getAllTeams)
    // .post(teamController.middlewareExample, teamController.createTeam);
    .post(teamController.createTeam);

router
    .route('/:teamNumber')
    .get(teamController.getTeam)
    .patch(teamController.updateTeam)
    .delete(teamController.deleteTeam);

router.use('/:teamNumber/matches', matchRouter);

export default router;
