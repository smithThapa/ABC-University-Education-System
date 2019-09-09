import axios from 'axios';
import { showAlert } from './alerts';

//type is either password or data
export const editElement = async (data, type, id, previousPath) => {
  try {
    console.log(data, type, id, previousPath);
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:8000/api/v1/${type}s/${id}`,
      data
    });
    // console.log(data);

    if (res.data.status === 'success') {
      window.scrollTo(0, 0);
      showAlert('success', `${type} updated successfully!`, '');
      window.setTimeout(() => {
        location.assign(previousPath);
      }, 0);
    }
  } catch (err) {
    window.scrollTo(0, 0);
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
