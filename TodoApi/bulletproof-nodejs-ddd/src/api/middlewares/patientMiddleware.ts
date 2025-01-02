import mysql from 'mysql2/promise';
import { Request, Response, NextFunction } from 'express';

// MySQL connection setup
const connection = mysql.createPool({
    host: 'vsgate-s1.dei.isep.ipp.pt',
    port: 10643,
    user: 'root',
    password: 'GpEJ3hD3koAh',
    database: 'Test'
});

// Extend the Request interface to include the `patient` property
interface CustomRequest extends Request {
    patient?: any; // Adjust the type based on the patient data structure
}

// Middleware to get patient info from MySQL database
const getPatientInfo = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void | Response> => {
    let { patientId } = req.body; // Get the patientId from the request body

    if (!patientId) {
        return res.status(400).json({ message: 'PatientId is required' });
    }

    // Convert to BigInt if necessary (MySQL BIGINT field can be handled as a string or BigInt)
    try {
        patientId = BigInt(patientId); // Convert to BigInt

        if (isNaN(Number(patientId))) {
            return res.status(400).json({ message: 'Invalid PatientId format' });
        }
    } catch (error) {
        return res.status(400).json({ message: 'Invalid PatientId format', error: error.message });
    }

    try {
        // Query the database to check if the patientId exists
        const [rows] = await connection.query('SELECT * FROM Patients WHERE id = ?', [patientId]);

        // Check if rows returned contains any data
        if ((rows as any[]).length === 0) {
            // If no patient is found with the given patientId
            return res.status(404).json({ message: 'Patient not found in database' });
        }

        // Attach the patient data to the request object
        req.patient = (rows as any[])[0]; // Assuming the patient data is in the first row
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        // Handle any database or server errors
        console.error(error);
        res.status(500).json({ message: 'Error occurred while fetching patient info', error: error.message });
    }
};

export { getPatientInfo };
