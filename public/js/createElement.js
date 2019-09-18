import axios from 'axios';
import { showAlert } from './alerts';

export const createUser = async data => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/createUser',
      data
    });

    if (res.data.status === 'success') {
      window.scrollTo(0, 0);
      showAlert(
        'success',
        'Created User Sucessfully!',
        'An activation email has been send to the new user to active its account within 24 hours.'
      );
      window.setTimeout(() => {
        location.assign('/manage_users');
      }, 0);
    }
  } catch (err) {
    // console.log(err.response.data);
    window.scrollTo(0, 0);
    showAlert('danger', 'User was not created', err.response.data.message);
  }
};

export const createForum = async (title, type, previousPath) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/forums',
      data: {
        title,
        type
      }
    });

    if (res.data.status === 'success') {
      window.scrollTo(0, 0);
      showAlert(
        'success',
        'Created Forum Sucessfully!',
        'This forum new is visible to all users'
      );
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

export const createTopic = async (
  title,
  description,
  forumId,
  previousPath
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:8000/api/v1/forums/${forumId}/topics`,
      data: {
        title,
        description
      }
    });

    if (res.data.status == 'success') {
      if (res.data.status === 'success') {
        window.setTimeout(() => {
          location.assign(previousPath);
        }, 0);
        window.scrollTo(0, 0);
        showAlert(
          'success',
          'Created Topic Sucessfully!',
          'This topic new is visible to all users'
        );
      }
    }
  } catch (err) {
    // console.log(err.response.data);
    window.scrollTo(0, 0);
    console.log(err);
    showAlert('danger', 'Topic was not created', err.response.data.message);
  }
};

export const createComment = async (
  title,
  description,
  topicId,
  previousPath
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/comments',
      data: {
        title,
        description,
        topic: topicId
      }
    });

    if (res.data.status === 'success') {
      window.scrollTo(0, 0);
      showAlert(
        'success',
        'Created commnet Sucessfully!',
        'Thank you for comment into this topic'
      );
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

export const createArticle = async function(
  data,
  previousPath,
  arrayRoleEmails
) {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/articles',
      data: { data, arrayRoleEmails }
    });

    if (res.data.status === 'success') {
      // site
      window.scrollTo(0, 0);
      showAlert(
        'success',
        `Created ${data.type} Sucessfully!`,
        `${data.type} is accessible to all users`
      );
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

export const createMaintenanceRequest = async (subject, description) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/maintenanceRequests',
      data: {
        subject,
        description
      }
    });

    if (res.data.status === 'success') {
      window.scrollTo(0, 0);
      showAlert(
        'success',
        'Maintenance Request is submitted',
        'Request will be processed by the maintenance staff in the next 2-3 working days'
      );
      window.setTimeout(() => {
        location.assign('/home');
      }, 1000);
    }
  } catch (err) {
    showAlert('danger', 'Maintenance Request is not submitted!', err.message);
  }
};

export const createErrorReport = async data => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/errorReports',
      data
    });

    if (res.data.status === 'success') {
      window.scrollTo(0, 0);
      showAlert(
        'success',
        'Error Report is submitted!',
        'This Error report will be processed by the system development team soon.'
      );
      window.setTimeout(() => {
        location.assign('/error_reports');
      }, 1000);
    }
  } catch (err) {
    showAlert('danger', 'Error Report is not submitted!', err.message);
  }
};
