import axios from 'axios';

export const axiosInstance = () => {
  return axios.create({
    baseURL: 'http://localhost:3333/',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default axiosInstance(); 

