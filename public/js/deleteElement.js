import axios from 'axios';
import { showAlert } from './alerts';

export const deleteElement = async (id, type) => {
  try {
    const modal = document.getElementById(`deleteModal${id}`);

    const res = await axios({
      method: 'DELETE',
      url: `http://127.0.0.1:8000/api/v1/${type}s/${id}`
    });

    window.scrollTo(0, 0);

    showAlert(
      'success',
      `Deleted ${type} Sucessfully!`,
      `This ${type} will not be accessible in the system`
    );

    window.location.reload();
  } catch (err) {
    console.log(err);
    window.scrollTo(0, 0);
    showAlert('danger', `${type} was not deleted`, err.response.data.message);
  }
};
