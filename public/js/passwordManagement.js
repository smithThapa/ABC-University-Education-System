import axios from 'axios';
import { showAlert } from './alerts';

export const resetPassword = async function(password, confirmPassword, token) {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:8000/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        confirmPassword
      }
    });

    console.log('hello');

    if (res.data.status === 'success') {
      window.scrollTo(0, 0);
      showAlert(
        'success',
        'Your have successfully reset your password!',
        'Now you can access all features of ABC University'
      );
      window.setTimeout(() => {
        location.assign('/home');
      }, 0);
    }
  } catch (err) {
    // console.log(err.response.data);
    window.scrollTo(0, 0);
    showAlert('danger', 'User was not created', err.response.data.message);
  }
};
