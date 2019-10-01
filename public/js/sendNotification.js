import axios from 'axios';
import { showAlert } from './alerts';

//Get href for api
const href = `${location.protocol}//${location.host}/`;

//send notification method
export const sendNotification = async function(type, data) {
  try {
    //get response from the API from send notification
    const res = await axios({
      method: 'POST',
      url: `${href}api/v1/users/notifyUsers/${type}`,
      data: { data }
    });

    //successful response
    if (res.data.status === 'success') {
      //move top
      window.scrollTo(0, 0);
      showAlert('success', 'Notifications have been successfully sent!', '');
      //return send_notification
      window.setTimeout(() => {
        //return to page
        location.assign('/send_notifications');
      }, 1000);
    }
  } catch (err) {
    window.scrollTo(0, 0);
    // console.log(err.message);
    showAlert('danger', 'Notifications could not be sent!', err.message);
  }
};
