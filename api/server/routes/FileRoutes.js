import { Router } from 'express';
import FileController from '../controllers/FileController';

const router = Router();

router.get('/', FileController.getAllFiles);
router.post('/', FileController.addFile);
router.get('/:id', FileController.getAFile);
router.delete('/:id', FileController.deleteFile);

export default router;