import axios from "axios";

const apiInstance = axios.create({
    baseURL: 'https://training.bks.center/'
})

const token = localStorage.getItem('token');
export const apiLoggedInInstance = axios.create({
    baseURL: 'https://training.bks.center/',
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
 
export default apiInstance;