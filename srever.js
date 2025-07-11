// let express = require('express');
// let sql = require('mssql');
// let app = express();

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // SQL Server Configuration
// const config = {
//     user: '',       // SQL Server username
//     password: '',   // SQL Server password
//     server: 'localhost',       // SQL Server host
//     database: 'ScholarshipDB',   // SQL Server database name
//     options: {
//         encrypt: true,           // Use encryption (mandatory for Azure)
//         trustServerCertificate: true // Set this to true if using self-signed certificates
//     },
//     port: 1433                   // Default port for SQL Server
// };

// // Connect to SQL Server
// sql.connect(config)
//     .then(() => {
//         console.log('Connected to SQL Server...');
//     })
//     .catch(err => {
//         console.error('Database connection failed:', err.message);
//     });

// // SQL Query Helper
// const executeQuery = async (query, inputs = []) => {
//     try {
//         const pool = await sql.connect(config);
//         const request = pool.request();

//         // Add inputs dynamically
//         inputs.forEach(({ name, type, value }) => {
//             request.input(name, type, value);
//         });

//         const result = await request.query(query);
//         return result.recordset;
//     } catch (err) {
//         throw err;
//     }
// };

// // Route to Serve HTML Form
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html');
// });

// // Route to Insert Data
// app.post('/submit', async (req, res) => {
//     try {
//         const { fname } = req.body; // Assuming `fname` is being sent in the POST request

//         // Insert query
//         const query = "INSERT INTO Users (fname) OUTPUT INSERTED.* VALUES (@fname)";
//         const inputs = [{ name: 'fname', type: sql.VarChar, value: fname }];

//         const result = await executeQuery(query, inputs);
//         res.status(201).send(result);
//     } catch (err) {
//         res.status(500).send({ error: err.message });
//     }
// });

// // Route to Fetch Data
// app.get('/users', async (req, res) => {
//     try {
//         const query = "SELECT * FROM Users";
//         const result = await executeQuery(query);
//         res.status(200).json(result);
//     } catch (err) {
//         res.status(500).send({ error: err.message });
//     }
// });

// // Start the Server
// app.listen(4000, () => {
//     console.log("Server running on http://127.0.0.1:4000");
// });

//==========================================================================================

let express = require('express');
let sql = require('mssql');
let app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// SQL Server Configuration
const config = {
    user: '',       // SQL Server username
    password: '',   // SQL Server password
    server: 'localhost',       // SQL Server host
    database: 'ScholarshipDB',   // SQL Server database name
    options: {
        encrypt: true,           // Use encryption (mandatory for Azure)
        trustServerCertificate: true // Set this to true if using self-signed certificates
    },
    port: 1433                   // Default port for SQL Server
};

// Connect to SQL Server
sql.connect(config)
    .then(() => {
        console.log('Connected to SQL Server...');
    })
    .catch(err => {
        console.error('Database connection failed:', err.message);
    });

// SQL Query Helper
const executeQuery = async (query, inputs = []) => {
    try {
        const pool = await sql.connect(config);
        const request = pool.request();

        // Add inputs dynamically
        inputs.forEach(({ name, type, value }) => {
            request.input(name, type, value);
        });

        const result = await request.query(query);
        return result.recordset;
    } catch (err) {
        throw err;
    }
};

// Route to Serve HTML Form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Route to Insert Data
app.post('/submit', async (req, res) => {
    try {
        const { fname } = req.body; // Assuming `fname` is being sent in the POST request

        // Insert query
        const query = "INSERT INTO Users (fname) OUTPUT INSERTED.* VALUES (@fname)";
        const inputs = [{ name: 'fname', type: sql.VarChar, value: fname }];

        const result = await executeQuery(query, inputs);
        res.status(201).send(result);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Route to Fetch All Data
app.get('/users', async (req, res) => {
    try {
        const query = "SELECT * FROM Scholarships";
        const result = await executeQuery(query);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Route to Retrieve Specific User Data Based on User ID
app.get('/users/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        const query = "SELECT * FROM Users WHERE id = @id";  // Assuming you have an `id` column in the `Users` table
        const inputs = [{ name: 'id', type: sql.Int, value: userId }];
        const result = await executeQuery(query, inputs);

        if (result.length > 0) {
            res.status(200).json(result[0]);  // Return the first matching record
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Start the Server
app.listen(4000, () => {
    console.log("Server running on http://127.0.0.1:4000");
});



