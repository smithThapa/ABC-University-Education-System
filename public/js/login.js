import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    //get response from the login API
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    console.log(res.data.status);
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

//log out method to exit the app
export const logout = async () => {
  try {
    //get reponse from API to log out
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/users/logout'
    });

    //successful response
    if (res.data.status === 'success') {
      //move topic
      window.scrollTo(0, 0);
      showAlert(
        'info',
        'Sucessfully log out!',
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
      'Error loggin out! Try again!',
      err.response.data.message
    );
  }
};

//log out method to exit the app
export const logoutAs = async () => {
  try {
    //get reponse from API to log out
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/users/logoutas'
    });

    //successful response
    if (res.data.status === 'success') {
      //move topic
      window.scrollTo(0, 0);
      showAlert(
        'info',
        'Sucessfully log out!',
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
      'Error loggin out! Try again!',
      err.response.data.message
    );
  }
};
