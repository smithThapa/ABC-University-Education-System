import axios from 'axios';
import { showAlert } from './alerts';
// import Email from './../../utils/Email';

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
      data
    });

    if (res.data.status === 'success') {
      //roles to send email
      if (arrayRoleEmails.length > 0) {
        let queryRoleString;
        //is user select allocate all roles
        if (arrayRoleEmails.includes('all')) {
          queryRoleString = 'role=student&role=staff&role=admin';
        } else {
          queryRoleString = arrayRoleEmails.join('&role=');
          queryRoleString = 'role=' + queryRoleString;
        }

        //get all stundet with the roles
        const users = await axios({
          method: 'GET',
          url: `http://127.0.0.1:8000/api/v1/users?${queryRoleString}`
        });

        if (users.data.status === 'success') {
          const announcementURL = `http://127.0.0.1:8000/announcements`;

          users.data.data.data.forEach(async elementUser => {
            console.log(elementUser);
            await new Email(elementUser, announcementURL).sendAnnouncement(
              data
            );
          });
        }
      }

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
