import express from 'express';
import cors from 'cors';
import proxy from './config/proxy';
import helmet from 'helmet';

const app = express();

app.use(cors());
app.use(helmet())
app.use('/stream', proxy);

export default app;