import axios from 'axios';
import { showAlert } from './alerts';

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

    if (res.data.status == 'success') {
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
    }
  } catch (err) {
    // console.log(err.response.data);
    window.scrollTo(0, 0);
    showAlert('danger', 'Comment was not created', err.response.data.message);
  }
};
