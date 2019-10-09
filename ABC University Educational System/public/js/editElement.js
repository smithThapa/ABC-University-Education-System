import axios from 'axios';
import { showAlert } from './alerts';

//Get href for api
const href = `${location.protocol}//${location.host}/`;

//edit method general to edit forum, topic
export const editElement = async (data, type, id, previousPath) => {
  try {
    //get response from API after edit element
    const res = await axios({
      method: 'PATCH',
      url: `${href}api/v1/${type}s/${id}`,
      data
    });

    //successful response
    if (res.data.status === 'success') {
      //move top
      window.scrollTo(0, 0);
      showAlert('success', `${type} updated successfully!`, '');
      //return previous path
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

//edit article method
export const editArticle = async function(id, data, type, previousPath) {
  try {
    //get respond from the API of edit article
    const res = await axios({
      method: 'PATCH',
      url: `${href}api/v1/articles/${id}`,
      data
    });

    //successful response
    if (res.data.status === 'success') {
      //move top
      window.scrollTo(0, 0);
      showAlert('success', `${type} updated successfully!`, '');
      //return previous path
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
    //get response from API edit user
    const res = await axios({
      method: 'PATCH',
      url: `${href}api/v1/users/${id}`,
      data
    });

    //successful response
    if (res.data.status === 'success') {
      //move top
      window.scrollTo(0, 0);
      showAlert('success', `User updated successfully!`, '');
      //return previous path
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
      url: `${href}api/v1/users/updateMe`,
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
      //return previous path
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

//edit personal password
export const editMyPassword = async function(data) {
  try {
    //get response API from edit personal password
    const res = await axios({
      method: 'PATCH',
      url: `${href}api/v1/users/updateMyPassword`,
      data
    });

    //successful response
    if (res.data.status === 'success') {
      //move top
      window.scrollTo(0, 0);
      showAlert('success', `Your Password has been updated!`, '');
      //return to my details
      window.setTimeout(() => {
        location.assign('/my_details/me');
      }, 0);
    }
  } catch (err) {
    window.scrollTo(0, 0);
    // console.log(err);
    showAlert('danger', `Your Password cannot be updated!`, '');
  }
};

//edit maintenance Requests method
export const editMaintenanceRequest = async (id, status, resolvedMessage) => {
  try {
    //get response from API for editing maintenance request
    const res = await axios({
      method: 'PATCH',
      url: `${href}api/v1/maintenanceRequests/${id}`,
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
    showAlert(
      'danger',
      'Maintenance Request is not submitted.',
      err.response.data.message
    );
  }
};
