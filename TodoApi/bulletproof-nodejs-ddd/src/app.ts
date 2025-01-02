import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './config/db';
import allergyRoutes from './api/routes/allergyRoute';
import medicalConditionsRoutes from './api/routes/medicalConditionsRoute';
import medicalHistoryRoutes from './api/routes/medicalHistoryRoute'
import roomRoots from './api/routes/roomRoute'

const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
app.use(bodyParser.json());
app.use(allergyRoutes);
app.use(medicalConditionsRoutes);
app.use(medicalHistoryRoutes);
app.use(roomRoots);
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
