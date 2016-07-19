import {Router} from 'express';
import sheetsHelper from '../middleware/google-sheets-helper';
let router = Router();

router.get('/', (req, res) => {
  res.sendFile('index.html', {root: `${__dirname}/../../../app/build`});
});
router.get('/test', sheetsHelper.getSpreadsheet, (req, res) => {
  res.sendFile('index.html', {root: `${__dirname}/../../../app/build`});
});

export default router;
