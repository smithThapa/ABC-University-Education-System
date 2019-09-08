import axios from 'axios';
import { showAlert } from './alerts';

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

    console.log(res.data);

    if (res.data.status == 'success') {
      if (res.data.status === 'success') {
        showAlert(
          'success',
          'Created commnet Sucessfully!',
          'Thank you for comment into this topic'
        );
        window.setTimeout(() => {
          location.assign(previousPath);
        }, 1000);
      }

      // window.setTimeout(() => {
      //   location.assign('/home');
      // }, 1500);
    }
  } catch (err) {
    // console.log(err.response.data);
    showAlert('danger', 'Comment was not created', err.response.data.message);
  }
};
