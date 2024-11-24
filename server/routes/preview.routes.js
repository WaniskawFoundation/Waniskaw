import { Router } from 'express';
import renderPreviewIndex from '../views/previewIndex';
import embedRoutes from './embed.routes';
import assetRoutes from './asset.routes';

const router = Router();

// Preview index route
router.get('/', (req, res) => {
  res.send(renderPreviewIndex());
});

// Embed and asset routes
router.use('/', embedRoutes);
router.use('/', assetRoutes);

export default router;
