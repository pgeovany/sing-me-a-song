import { Router } from 'express';
import { reset, seed } from '../controllers/testsController';

const testsRouter = Router();

testsRouter.post('/reset-database', reset);
testsRouter.post('/seed-database/:amount', seed);

export default testsRouter;
