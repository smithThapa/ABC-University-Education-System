import axios from 'axios';
import { showAlert } from './alerts';

//Get href for api
const href = `${location.protocol}//${location.host}/`;

//method to reset password
export const resetPassword = async function(password, confirmPassword, token) {
  try {
    //get response from API to reset password
    const res = await axios({
      method: 'PATCH',
      url: `${href}api/v1/users/resetPassword/${token}`,
      data: {
        password,
        confirmPassword
      }
    });

    //successfully response
    if (res.data.status === 'success') {
      //move top
      window.scrollTo(0, 0);
      showAlert(
        'success',
        'Your have successfully reset your password!',
        'Now you can access all features of ABC University'
      );
      //go to home
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

//forgot password method
export const forgotPassword = async function(email, resetURL) {
  try {
    //get response from API to forget password
    const res = await axios({
      method: 'POST',
      url: `${href}api/v1/users/forgotPassword`,
      data: {
        email,
        resetURL
      }
    });

    //successful response
    if (res.data.status === 'success') {
      //move top
      window.scrollTo(0, 0);
      showAlert(
        'success',
        'Your request to your new password is success!',
        'An email has been send you to reset your password within 24 hours.'
      );
      //return login
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
