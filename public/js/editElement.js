import axios from 'axios';
import { showAlert } from './alerts';

//edit method general to edit forum, topic
export const editElement = async (data, type, id, previousPath) => {
  try {
    //get response from API after edit element
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:8000/api/v1/${type}s/${id}`,
      data
    });

    //successful response
    if (res.data.status === 'success') {
      //move top
      window.scrollTo(0, 0);
      showAlert('success', `${type} updated successfully!`, '');
      //retunr previos path
      window.setTimeout(() => {
        location.assign(previousPath);
      }, 0);
    }
  } catch (err) {
    window.scrollTo(0, 0);
    // console.log(err);
    showAlert('error', err.response.data.message);
  }
};

//edit article mthod
export const editArticle = async function(id, data, type, previousPath) {
  try {
    //get respond from the API of edit article
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:8000/api/v1/articles/${id}`,
      data
    });

    //successful response
    if (res.data.status === 'success') {
      //move top
      window.scrollTo(0, 0);
      showAlert('success', `${type} updated successfully!`, '');
      //return previos path
      window.setTimeout(() => {
        location.assign(previousPath);
      }, 0);
    }
  } catch (err) {
    window.scrollTo(0, 0);
    // console.log(err);
    showAlert('error', err.response.data.message);
  }
};

//edit user method by admin
export const editUser = async function(data, id) {
  try {
    //get respon from API edit user
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:8000/api/v1/users/${id}`,
      data
    });

    //successful response
    if (res.data.status === 'success') {
      //move top
      window.scrollTo(0, 0);
      showAlert('success', `User updated successfully!`, '');
      //return previos path
      window.setTimeout(() => {
        location.assign('/manage_users');
      }, 0);
    }
  } catch (err) {
    window.scrollTo(0, 0);
    // console.log(err);
    showAlert('error', err.response.data.message);
  }
};

//edit personal detail user (no password)
export const editMe = async function(data) {
  try {
    //get response from API after edit account
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:8000/api/v1/users/updateMe`,
      data
    });

    //successful response
    if (res.data.status === 'success') {
      //move top
      window.scrollTo(0, 0);
      showAlert(
        'success',
        `Your User Details has been successfully Updated!`,
        'Thank you for sharing your details with us'
      );
      //return previos path
      window.setTimeout(() => {
        location.assign('/my_details/me');
      }, 0);
    }
  } catch (err) {
    window.scrollTo(0, 0);
    // console.log(err);
    showAlert('error', err.response.data.message);
  }
};

//edit personal passowrd
export const editMyPassword = async function(data) {
  try {
    //get response API from edit personal password
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:8000/api/v1/users/updateMyPassword`,
      data
    });

    //successful response
    if (res.data.status === 'success') {
      //move top
      window.scrollTo(0, 0);
      showAlert('success', `Your Password has been updated!`, '');
      //retun to my details
      window.setTimeout(() => {
        location.assign('/my_details/me');
      }, 0);
    }
  } catch (err) {
    window.scrollTo(0, 0);
    // console.log(err);
    showAlert('error', err.response.data.message);
  }
};

//edit maintenance Requests method
export const editMaintenanceRequest = async (id, status, resolvedMessage) => {
  try {
    //get response from API for editing maintenance request
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:8000/api/v1/maintenanceRequests/${id}`,
      data: {
        status,
        resolvedAt: Date.now(),
        resolvedMessage
      }
    });

    //successfully response
    if (res.data.status === 'success') {
      //move top
      window.scrollTo(0, 0);
      showAlert('success', `Maintenance Request has been ${status}`, '');
      //move precious page
      window.setTimeout(() => {
        location.assign('/manage_maintenance_requests');
      }, 1000);
    }
  } catch (err) {
    window.scrollTo(0, 0);
    showAlert('danger', 'Maintenance Request is not submitted.');
  }
};
