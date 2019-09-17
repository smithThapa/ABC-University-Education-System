const axios = require('axios');
const AppError = require('./../utils/AppError');

exports.getErrorReportsPage = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get api
    const objs = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/errorReports'
    });

    if (objs.data.status === 'success') {
      res.status(200).render('ErrorReportsView', {
        title: 'Error Reports',
        errorReports: objs.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};
