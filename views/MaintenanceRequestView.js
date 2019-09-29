// Node.js modules to use
const axios = require('axios');
// utilities to use
const AppError = require('./../utils/AppError');

//get maintenance page to all user to submit a request
exports.getMaintenancePage = (req, res) => {
  res.status(200).render('MaintenanceRequestView', {
    title: 'Maintenance Request'
  });
};

// get the maintenance request list to manage the requests by the team-maintenance members
exports.getManageMaintenanceRequestsList = async function(req, res, next) {
  try {
    //add authentication to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get maintenance requests from the API
    const maintenanceRequests = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/maintenanceRequests'
    });

    //check if the response was successful
    if (maintenanceRequests.data.status === 'success') {
      //render page with the maintenance requests data
      res.status(200).render('MaintenanceRequestListView', {
        title: 'Maintenance Requests List',
        maintenanceRequests: maintenanceRequests.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};
