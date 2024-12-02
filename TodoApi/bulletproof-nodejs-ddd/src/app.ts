import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import connectDB from './config/db';
import allergyRoutes from './api/routes/allergyRoute';

dotenv.config();
connectDB();

const app = express();

app.use(bodyParser.json());
app.use(allergyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
