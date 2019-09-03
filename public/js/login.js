import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/login',
      data: {
        email,
        password
      }
    });

    if (res.data.status == 'success') {
      if (res.data.status === 'success') {
        showAlert(
          'success',
          'Logged in successfully!',
          'Now you can access to all available features of ABC University'
        );
        window.setTimeout(() => {
          location.assign('/home');
        }, 1000);
      }

      // window.setTimeout(() => {
      //   location.assign('/home');
      // }, 1500);
    }
  } catch (err) {
    showAlert('danger', 'Logged in failed!', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:8000/api/v1/users/logout'
    });
    if (res.data.status === 'success') {
      showAlert(
        'info',
        'Sucessfully log out!',
        'Thank you for using ABC University Education System'
      );
      window.setTimeout(() => {
        location.assign('/');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', 'Error loggin out! Try again!');
  }
};
