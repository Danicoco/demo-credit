import v1 from './modules/v1';
import { Router } from 'express';

const router = Router();

// Controllers
router.use('/v1', v1);

router.use('/', (_req, res, _next) =>
  res.send('Welcome to Demo Credit Application!!! Get start with the documentation here'),
);

router.use('*', (_req, res, _next) =>
  res.send('I can\'t find the resource you\'re looking for'),
);

export default router;
