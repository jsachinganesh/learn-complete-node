import axios from 'axios';
import { showAlert } from './alerts';
export const login = async (email,password) => {
    try {
        const res = await axios({
            method:'POST',
            url:'/api/v1/users/login',
            data:{
                email,password
            }
        });
        if(res.data.status === 'success'){
            showAlert('success','Logged in successfully!')
            window.setTimeout(()=>{
                location.assign('/');
            },1500)
        }
    } catch (error) {
        // showAlert('error',error.response.data.message);
        console.log(error.response.data);
    }

    
}

export const logout = async () =>{
    try {
        const res = await axios({
            method:'GET',
            url:'/api/v1/users/logout'
        });
        if(res.data.status === 'success'){
            showAlert('success','Logged Out successfully!')
            location.assign('/');
        }
        
    } catch (error) {
        showAlert('error','Error logging out! Try again');
    }
}