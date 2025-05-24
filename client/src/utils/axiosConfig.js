import axios from "axios";
import { config } from "dotenv";

const token=localStorage.getItem('token');

axios.interceptors.request.use(
    config=>{
        if(token)
        {
            config.headers['Authorization']=`Bearer ${token}`
        }
        return config;
    },
    error =>{
        return Promise.reject(error);
    }
);

export default axios;