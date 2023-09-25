import axios from 'axios';

export const axiosInstance = () => {
    const token = localStorage.getItem('token');
    return axios.create({
        baseURL: 'http://localhost:3333/',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export default axiosInstance();
