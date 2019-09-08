const axios = require('axios');
const AppError = require('./../utils/AppError');

exports.getManageUsersList = async function(req, res, next) {
  try {
    //add authentitcation to axios
    axios.defaults.headers.common.Authorization = `Bearer ${req.cookies.jwt}`;

    const obj = await axios({
      method: 'GET',
      url: `http://127.0.0.1:8000/api/v1/users`
    });

    if (obj.data.status === 'success') {
      res.status(200).render('UserListView', {
        title: 'Manage Users',
        users: obj.data.data.data
      });
    }
  } catch (err) {
    console.log(err);
    next(new AppError(err.message, err.statusCode));
  }
};
