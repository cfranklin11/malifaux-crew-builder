import {Router} from 'express';
import sheetsHelper from '../lib/google-sheets-helper';
let router = Router();

router.param('faction', (req, res, next, faction) => {
  req.faction = faction;
  next();
});
router.get('/', (req, res) => {
  res.sendFile('index.html', {root: `${__dirname}/../../../app/build`});
});
router.get(
  '/api/:faction/characters',
  sheetsHelper.getSpreadsheet,
  (req, res) => {
    res.json(req.data);
  }
);

export default router;
