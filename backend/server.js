const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const upload = multer();

const dbConfig = {
  host: 'db.wabapi.com',
  user: 'prajesh',
  password: 'Elixir#002',
  database: 'salon'
};

const connection = mysql.createConnection(dbConfig);

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:4200', // replace with your client's origin
  credentials: true,
}));

const secret = 'inthesummertime';

const port = 3002; // Specify the desired port number
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// Login route
app.post('/login', (req, res) => {

  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  connection.query(query, [email, password], (error, results) => {

    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: `Invalid email or password` });
    }

    // successful login
    const user = results[0];
    const token = jwt.sign({ email: email }, secret, { expiresIn: '24h' });
    return res.status(200).json({ message: 'Login successful', token: token, userId: user.id });

  });
});


//Signup route
app.post('/signup', (req, res) => {
  const { email, password, name, mobile, gstNo } = req.body;

  // Check if the email is already registered
  const checkEmailQuery = `SELECT * FROM users WHERE email = ?`;
  connection.query(checkEmailQuery, [email], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    // If email is not registered, perform the signup
    const insertQuery = `INSERT INTO users (email, password, name, mobile, gstNo) VALUES (?, ?, ?, ?, ? )`;
    connection.query(insertQuery, [email, password, name, mobile, gstNo], (error, results) => {
      if (error) {
        console.error(error.sqlMessage);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      // Successful signup
      return res.status(201).json({ message: 'Signup successful' });
    });
  });
});




//get user data
app.get('/api/user/:userId', (req, res) => {
  const userId = req.params.userId;

  const query = 'SELECT * FROM users WHERE id = ?';
  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    if (user.shopLogo) {
      // Convert logo bytes to base64
      const logoBase64 = user.shopLogo.toString('base64');
      user.logoBase64 = logoBase64;
      return res.status(200).json(user);
    }else{
      return res.status(200).json(user);
    }

  });
});


app.get('/logo', (req, res) => {

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  console.log("token --", token);
  console.log("secret --", secret);


  // Verify token
  jwt.verify(token, secret, (err, user) => {

    if (err) {
      return res.sendStatus(403);
    }

    // Token is valid, you can access the email through the user object
    const email = user.email;
    console.log("email --", email);
    // Perform your query
    // 
    const query = `
    SELECT h.logo
    FROM hospitals h
    INNER JOIN users u ON h.userId = u.id
    WHERE u.email = ?`;

    connection.query(query, [email], (error, results) => {

      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (results.length === 0 || !results[0].logo) {
        return res.status(404).json({ message: 'Logo not found' });
      }

      res.setHeader('Content-Type', 'image/png');
      res.send(results[0].logo);

    });

  });

});

app.get('/hospitalinfo', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const email = user.email;

    const query = `
    SELECT h.hospitalName, h.hospitalTagLine
    FROM hospitals h
    INNER JOIN users u ON h.userId = u.id
    WHERE u.email = ?`;

    connection.query(query, [email], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Hospital information not found' });
      }

      res.status(200).json({ hospitalName: results[0].hospitalName, hospitalTagLine: results[0].hospitalTagLine });
    });
  });
});

app.get('/patients', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    // Token is valid, you can access the email through the user object
    const email = user.email;

    const query = 'SELECT name, age, mobile, sex, email, area, test, referedBy, remarks FROM patients WHERE userEMail = ?';

    //const query = 'SELECT name, age, mobile, sex, email, area, test, referedBy, remarks FROM patients';

    connection.query(query, [email], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'No patients found' });
      }
      console.log(results);

      return res.json(results);
    });
  });
});

app.post('/patients', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  jwt.verify(token, secret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const email = user.email;
    const { name, dob, age, mobile, sex, email: patientEmail, area, test, referedBy, remarks } = req.body;

    const query = `INSERT INTO patients (name,dob, age, mobile, sex, email, area, test, referedBy, remarks, userEmail) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    connection.query(query, [name, dob, age, mobile, sex, patientEmail, area, test, referedBy, remarks, email], (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }

      // patient added successfully
      return res.status(201).json({ message: 'Patient added successfully' });
    });
  });
});
