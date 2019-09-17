import axios from 'axios';
import { showAlert } from './alerts';

export const sendNotification = async function(type, data) {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:8000/api/v1/users/notifyUsers/${type}`,
      data: { data }
    });

    if (res.data.status === 'success') {
      window.scrollTo(0, 0);
      showAlert('success', 'Notifications have been successfully sent!', '');
      window.setTimeout(() => {
        location.assign('/send_notifications');
      }, 1000);
    }
  } catch (err) {
    window.scrollTo(0, 0);
    console.log(err.message);
    showAlert('danger', 'Notifications could not be sent!', err.message);
  }
};
