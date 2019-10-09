// Node.js modules
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Error opening the connection
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  console.log(err.stack);

  process.exit(1);
});

//Get the environment variable from the file
dotenv.config({ path: './config.env' });

// get application file
const app = require('./app');

//Database variable parse within the password
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

//Database connection
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('DB connection successful');
  });

//Server with a define port
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// error connecting to the server and DB
process.on('unhandledRejection', err => {
  console.log('UNHANDLE REJECTION! Shutting down...');
  console.log(err.name, err.message);
  console.log(err.stack);

  server.close(() => {
    process.exit(1);
  });
});

// any error that is not expected to be notified
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
