const express = require('express')
const app = express();
const cors = require('cors');



// middleware
app.use(express.json())
app.use(cors())



app.get('/', (req, res) => {
 try {
    throw new Error('custom error')
 } catch (error) {
    next(error)
 }
})


//Global Middleware
app.use((err, req, res, next) => {
    const errorObj = {
      message: err?.message || 'Something went wrong',
      status: err?.status || 500
    }
  
    res.status(errorObj.status).json(errorObj);
  })


module.exports = app;