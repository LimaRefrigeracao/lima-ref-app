import axios from 'axios';

export const axiosInstance = () => {
    const token = localStorage.getItem('token');
    return axios.create({
        baseURL: import.meta.env.VITE_BASE_URL_API,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
};

export default axiosInstance();
