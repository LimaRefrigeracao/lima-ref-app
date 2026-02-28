import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL_API,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const dataUser = JSON.parse(localStorage.getItem('user') || '{}');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (!config.data) {
            config.data = {};
        }

        config.data = {
            tenant_id: dataUser.tenant_id,
            ...config.data
        };

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
