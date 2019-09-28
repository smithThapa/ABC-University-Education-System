// AppError class to display an error message to the user with its status, extended Error class
class AppError extends Error {
  // class constructor to add a message to the user and the status code
  constructor(message, statusCode) {
    //import the error constructore with the added message from the Error class
    super(message);

    //set ststaus code in the object
    this.statusCode = statusCode;
    // set status of the report by checking if the statuscode starts with 4
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    //set that the error is operational
    this.isOperational = true;

    //execute the captureStackTrace methods from the Error class to track the error with the added object
    Error.captureStackTrace(this, this.constructor);
  }
}

//export the AppError classs to be used in the project
module.exports = AppError;
