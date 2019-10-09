import axios from 'axios';
import { showAlert } from './alerts';

//Get href for api
const href = `${location.protocol}//${location.host}/`;

export const login = async (email, password) => {
  try {
    //get response from the login API
    const res = await axios({
      method: 'POST',
      url: `${href}api/v1/users/login`,
      data: {
        email,
        password
      }
    });

    //successful response
    if (res.data.status === 'success') {
      //move top
      window.scrollTo(0, 0);
      showAlert(
        'success',
        'Logged in successfully!',
        'Now you can access to all available features of ABC University'
      );
      //move to home
      window.setTimeout(() => {
        location.assign('/home');
      }, 1000);
    }
  } catch (err) {
    // console.log(err.response.data);
    window.scrollTo(0, 0);
    showAlert('danger', 'Logged in failed!', err.response.data.message);
  }
};

//log out method to exit the application
export const logout = async () => {
  try {
    //get response from API to log out
    const res = await axios({
      method: 'GET',
      url: `${href}api/v1/users/logout`
    });

    //successful response
    if (res.data.status === 'success') {
      //move topic
      window.scrollTo(0, 0);
      showAlert(
        'info',
        'Successfully log out!',
        'Thank you for using ABC University Education System'
      );
      //return login page
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    window.scrollTo(0, 0);
    showAlert(
      'error',
      'Error logging out! Try again!',
      err.response.data.message
    );
  }
};

//log out method to exit the application
export const logoutAs = async () => {
  try {
    //get response from API to log out
    const res = await axios({
      method: 'GET',
      url: `${href}api/v1/users/logoutAs`
    });

    //successful response
    if (res.data.status === 'success') {
      //move topic
      window.scrollTo(0, 0);
      showAlert(
        'info',
        'Successfully log out!',
        'Thank you for using ABC University Education System'
      );
      //return login page
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    window.scrollTo(0, 0);
    showAlert(
      'error',
      'Error logging out! Try again!',
      err.response.data.message
    );
  }
};
