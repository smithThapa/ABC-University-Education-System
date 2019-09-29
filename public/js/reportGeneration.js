import axios from 'axios';
import { showAlert } from './alerts';

//report generation method
export const reportGeneration = async function(text, html) {
  try {
    //get response from API to report generation
    const res = await axios({
      method: 'POST',
      url: `http://127.0.0.1:8000/report_generation/sendHtml`,
      data: {
        html
      }
    });

    //response successful
    if (res.data.status == 'success') {
      //open report PDF
      window.open(`/report_generation/${text}`);
    }
  } catch (err) {
    // console.log(err.response.data);
    window.scrollTo(0, 0);
    showAlert('danger', 'Report was not generated', err.response.data.message);
  }
};
