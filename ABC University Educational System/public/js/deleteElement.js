import axios from 'axios';
import { showAlert } from './alerts';

//Get href for api
const href = `${location.protocol}//${location.host}/`;

//delete methods to all the types
export const deleteElement = async (id, type) => {
  try {
    //get response from the API after delete user
    const res = await axios({
      method: 'DELETE',
      url: `${href}api/v1/${type}s/${id}`
    });

    //if successful delete
    if (res.data.status === 'success') {
      //move top
      window.scrollTo(0, 0);
      showAlert(
        'success',
        `Deleted ${type} Successfully!`,
        `This ${type} will not be accessible in the system`
      );
      //reload page
      window.location.reload();
    }
  } catch (err) {
    // console.log(err);
    window.scrollTo(0, 0);
    showAlert('danger', `${type} was not deleted`, err.response.data.message);
  }
};
