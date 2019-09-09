import axios from 'axios';
import {showAlert} from './alerts';


export const submitMaintenanceRequest = async (subject, description) => {
    try{
        console.log(subject, description, "dsfsdf");
        const res = await axios({
            method: 'POST',
            url: 'http://127.0.0.1:8000/api/v1/maintenanceRequests',
            data: {
                subject,
                description
            }
        });

        if(res.data.status === 'success'){
            showAlert(
                'success',
                'Maintenance Request is submitted',
                'Request will be processed by the maintenance staff in the next 2-3 working days' 
        );
        window.setTimeout(() => {
            location.assign('/home');
          }, 1000);
            
        }
    } catch(err){
        showAlert('danger', 'Maintenance Request is not submitted.');
    }
}