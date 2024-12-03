import mysql, { RowDataPacket } from 'mysql2';
import { Request, Response, NextFunction } from 'express';

// Extend the Request interface to include the `patient` property
interface CustomRequest extends Request {
    patient?: any; // Define the patient property with a type (can be adjusted according to your data structure)
}

// Create the MySQL connection
const connection = mysql.createConnection({
    host: 'vsgate-s1.dei.isep.ipp.pt',
    port: 10643,
    user: 'root',
    password: 'GpEJ3hD3koAh',
    database: 'Test'
});

// Define the middleware to get patient info
const getPatientInfo = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void|Response> => {
    const { patientId } = req.body; // Patient ID from request body

    try {
        // Check if the patientId exists in the database
        const [rows] = await connection.promise().query<RowDataPacket[]>('SELECT * FROM Patients WHERE id = ?', [patientId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Patient not found in database' });
        }

        // Assign the patient data from the database to req.patient
        req.patient = rows[0]; // Use the first record from the query result
        next(); // Call next to pass control to the next middleware or route handler
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: 'Error occurred', error });
    }
};

export { getPatientInfo };
