import axios from 'axios';
import { showAlert } from './alerts';

export const reportGeneration = async function(html) {
  try {
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:8000/report_generation/html`,
      data: {
        html
      }
    });

    console.log(res);
  } catch (err) {
    // console.log(err.response.data);
    window.scrollTo(0, 0);
    showAlert('danger', 'Report was not generated', err.response.data.message);
  }
};
