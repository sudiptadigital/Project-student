const express = require('express');
const db = require('./db.js');
const ApiError = require('./utils/ApiError.js');
const cors = require('cors');


const globalErrorHandler = require('./controllers/error.controller.js')

const studentRouter = require('./routes/student.routes.js')
const subjectRouter = require('./routes/subject.routes.js')

const app = express();

app.use(express.json());
app.use(cors({
  origin: "*",
  credentials: true
}))


//routes declaration
app.use("/api/v1/student", studentRouter)
app.use("/api/v1/subject", subjectRouter)

// http://localhost:8000/api/v1/users/register




app.use(globalErrorHandler);
module.exports = app;