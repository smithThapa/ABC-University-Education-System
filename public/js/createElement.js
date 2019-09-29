import axios from 'axios';
import { showAlert } from './alerts';

//methods to create user
export const createUser = async data => {
  try {
    //response from the API fro create user
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/createUser',
      data
    });

    //successful response
    if (res.data.status === 'success') {
      //mode window to top
      window.scrollTo(0, 0);
      //show alert
      showAlert(
        'success',
        'Created User Sucessfully!',
        'An activation email has been send to the new user to active its account within 24 hours.'
      );
      //return to the previous page
      window.setTimeout(() => {
        location.assign('/manage_users');
      }, 0);
    }
  } catch (err) {
    //error
    window.scrollTo(0, 0);
    showAlert('danger', 'User was not created', err.response.data.message);
  }
};

//create forum
export const createForum = async (title, type, previousPath) => {
  try {
    //get response from API to create forum
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/forums',
      data: {
        title,
        type
      }
    });

    //successful response
    if (res.data.status === 'success') {
      //move to top
      window.scrollTo(0, 0);
      showAlert(
        'success',
        'Created Forum Sucessfully!',
        'This forum new is visible to all users'
      );
      //return previous page
      window.setTimeout(() => {
        location.assign(previousPath);
      }, 0);
    }
  } catch (err) {
    // console.log(err.response.data);
    window.scrollTo(0, 0);
    showAlert('danger', 'Forum was not created', err.response.data.message);
  }
};

//create topic function
export const createTopic = async (
  title,
  description,
  forumId,
  previousPath
) => {
  try {
    //get response from API to create topic
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:8000/api/v1/forums/${forumId}/topics`,
      data: {
        title,
        description
      }
    });

    //successful response
    if (res.data.status == 'success') {
      //move top
      window.scrollTo(0, 0);
      showAlert(
        'success',
        'Created Topic Sucessfully!',
        'This topic new is visible to all users'
      );
      //return previous path
      window.setTimeout(() => {
        location.assign(previousPath);
      }, 0);
    }
  } catch (err) {
    window.scrollTo(0, 0);
    // console.log(err);
    showAlert('danger', 'Topic was not created', err.response.data.message);
  }
};

//create comment
export const createComment = async (
  title,
  description,
  topicId,
  previousPath
) => {
  try {
    //get response from the API by creating comment
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/comments',
      data: {
        title,
        description,
        topic: topicId
      }
    });

    //successful response
    if (res.data.status === 'success') {
      //go top
      window.scrollTo(0, 0);
      showAlert(
        'success',
        'Created commnet Sucessfully!',
        'Thank you for comment into this topic'
      );
      //return previous path
      window.setTimeout(() => {
        location.assign(previousPath);
      }, 0);
    }
  } catch (err) {
    // console.log(err.response.data);
    window.scrollTo(0, 0);
    showAlert('danger', 'Comment was not created', err.response.data.message);
  }
};

//create article
export const createArticle = async function(
  data,
  previousPath,
  arrayRoleEmails
) {
  try {
    //get response from user
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/articles',
      data: { data, arrayRoleEmails }
    });

    //successful response
    if (res.data.status === 'success') {
      //move top site
      window.scrollTo(0, 0);
      showAlert(
        'success',
        `Created ${data.type} Sucessfully!`,
        `${data.type} is accessible to all users`
      );
      //return previous path
      window.setTimeout(() => {
        location.assign(previousPath);
      }, 0);
    }
  } catch (err) {
    // console.log(err.response.data);
    window.scrollTo(0, 0);
    showAlert('danger', 'Article was not created', err.response.data.message);
  }
};

//create maintenanceRequests
export const createMaintenanceRequest = async (subject, description) => {
  try {
    //get response from the API by creating maintenance request
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/maintenanceRequests',
      data: {
        subject,
        description
      }
    });

    //successful response
    if (res.data.status === 'success') {
      //move top
      window.scrollTo(0, 0);
      showAlert(
        'success',
        'Maintenance Request is submitted',
        'Request will be processed by the maintenance staff in the next 2-3 working days'
      );
      //return previous path
      window.setTimeout(() => {
        location.assign('/home');
      }, 1000);
    }
  } catch (err) {
    window.scrollTo(0, 0);
    showAlert('danger', 'Maintenance Request is not submitted!', err.message);
  }
};

//method to create error report
export const createErrorReport = async data => {
  try {
    //get response from API after creating error report
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/errorReports',
      data
    });

    //if successful response
    if (res.data.status === 'success') {
      //move top
      window.scrollTo(0, 0);
      showAlert(
        'success',
        'Error Report is submitted!',
        'This Error report will be processed by the system development team soon.'
      );
      //return previous page
      window.setTimeout(() => {
        location.assign('/error_reports');
      }, 1000);
    }
  } catch (err) {
    window.scrollTo(0, 0);
    showAlert('danger', 'Error Report is not submitted!', err.message);
  }
};
