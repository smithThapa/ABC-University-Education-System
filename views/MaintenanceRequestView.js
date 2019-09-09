const axios = require('axios');

exports.getMaintenancePage = (req, res) => {
  res.status(200).render('MainRequestView', {
    title: 'Maintenance Request'
  });
};

exports.getManageMaintenanceRequestsList = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    //get api
    const objs = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/maintenanceRequests'
    });

    console.log(objs.data);

    if (objs.data.status === 'success') {
      res.status(200).render('MaintenanceListView', {
        title: 'Maintenance Requests List',
        maintenanceRequests: objs.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};
