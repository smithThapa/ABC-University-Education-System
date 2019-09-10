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

export const forgotPassword = async function(email, resetURL) {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/forgotPassword',
      data: {
        email,
        resetURL
      }
    });

    if (res.data.status === 'success') {
      window.scrollTo(0, 0);
      showAlert(
        'success',
        'Your request to your new password is success!',
        'An email has been send you to reset your password within 24 hours.'
      );
      window.setTimeout(() => {
        location.assign('/');
      }, 0);
    }
  } catch (err) {
    // console.log(err.response.data);
    window.scrollTo(0, 0);
    showAlert('danger', 'Your request was decline!', err.response.data.message);
  }
};
