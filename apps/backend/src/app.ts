import express from 'express';
import itemRoutes from './routes/firebaseRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());

// Routes
app.use('/api', itemRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
