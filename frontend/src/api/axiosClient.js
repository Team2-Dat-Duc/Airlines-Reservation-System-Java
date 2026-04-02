import axios from 'axios';
const axiosClient = axios.create({
    baseURL: 'http://localhost:3000/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data; 
        }
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;