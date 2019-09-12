import axios from 'axios';
import { showAlert } from './alerts';

//type is either password or data
export const editElement = async (data, type, id, previousPath) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:8000/api/v1/${type}s/${id}`,
      data
    });
    // console.log(data);

    if (res.data.status === 'success') {
      window.scrollTo(0, 0);
      showAlert('success', `${type} updated successfully!`, '');
      window.setTimeout(() => {
        location.assign(previousPath);
      }, 0);
    }
  } catch (err) {
    window.scrollTo(0, 0);
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export const editArticle = async function(id, data, type, previousPath) {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:8000/api/v1/articles/${id}`,
      data
    });
    // console.log(data);

    if (res.data.status === 'success') {
      console.log(res.data.data);
      window.scrollTo(0, 0);
      showAlert('success', `${type} updated successfully!`, '');
      window.setTimeout(() => {
        location.assign(previousPath);
      }, 0);
    }
  } catch (err) {
    window.scrollTo(0, 0);
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export const editUser = async function(data, id) {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:8000/api/v1/users/${id}`,
      data
    });
    // console.log(data);

    if (res.data.status === 'success') {
      window.scrollTo(0, 0);
      showAlert('success', `User updated successfully!`, '');
      window.setTimeout(() => {
        location.assign('/manage_users');
      }, 0);
    }
  } catch (err) {
    window.scrollTo(0, 0);
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export const editMe = async function(data) {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:8000/api/v1/users/updateMe`,
      data
    });
    // console.log(data);

    if (res.data.status === 'success') {
      window.scrollTo(0, 0);
      showAlert(
        'success',
        `Your User Details has been successfully Updated!`,
        'Thank you for sharing your details with us'
      );
      window.setTimeout(() => {
        location.assign('/my_details/me');
      }, 0);
    }
  } catch (err) {
    window.scrollTo(0, 0);
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};

export const editMyPassword = async function(data) {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:8000/api/v1/users/updateMyPassword`,
      data
    });
    // console.log(data);

    if (res.data.status === 'success') {
      window.scrollTo(0, 0);
      showAlert('success', `Your Password has been updated!`, '');
      window.setTimeout(() => {
        location.assign('/my_details/me');
      }, 0);
    }
  } catch (err) {
    window.scrollTo(0, 0);
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
