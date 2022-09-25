import { Request, Response } from 'express';
import * as testsService from '../services/testsService';

async function reset(req: Request, res: Response) {
  await testsService.reset();

  res.sendStatus(200);
}

async function seed(req: Request, res: Response) {
  await testsService.seed();

  res.sendStatus(200);
}

export { reset, seed };
