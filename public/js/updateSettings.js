import axios from "axios";
import { showAlert } from './alerts';

// export const updateSettings = async (name,email) =>{
//     try {
//         const url = 'http://127.0.0.1:3000/api/v1/users/updateMe';

//         const res = await axios({
//             method:'PATCH',
//             url,
//             data:{
//                 name,email
//             }
//         });
//         // console.log(res.data.status);
//         if(res.data.status === 'success'){
//             showAlert('success',`Data Updated successfully!`)
//         }
//     } catch (error) {
//         showAlert('error',error.response.data.message);
//     }

// } 
export const updateSettings = async (data,type) =>{
    try {
        const url = type === 'password' ? 
        '/api/v1/users/updatePassword'
        :'/api/v1/users/updateMe';

        const {name,email} = data;

        const res = await axios({
            method:'PATCH',
            url,
            data
        });

        if(res.data.status === 'success'){
            showAlert('success',`${type.toUpperCase()} Updated successfully!`)
        }
    } catch (error) {
        showAlert('error',error.response.data.message);
    }

} 