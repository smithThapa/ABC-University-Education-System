// Node.js modules
const axios = require('axios');
// utilities to use
const AppError = require('./../utils/AppError');

//get error report page for the team-maintenance members
exports.getErrorReportsPage = async function(req, res, next) {
  try {
    //add authentication to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get href for axios
    const href = `${req.protocol}://${req.get('host')}/`;

    //get error report object from the API
    const errorReports = await axios({
      method: 'GET',
      url: `${href}api/v1/errorReports`
    });

    //check if the response is successful
    if (errorReports.data.status === 'success') {
      //send all error reports to the pug template
      res.status(200).render('ErrorReportsView', {
        title: 'Error Reports',
        errorReports: errorReports.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};
