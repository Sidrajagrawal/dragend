import axios from "axios";

const BASE_API = 'http://localhost:8080/api/auth';

const api = axios.create({
    baseURL: BASE_API,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const SignUpApi = async (username, email, password, Cpassword) => {
    try {
        const response = await api.post(`${BASE_API}/register`, {
            username,
            email,
            password,
            Cpassword
        });
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Network Error" };
    }
};

export const VerifyOtpApi = async (email, otp) => {
    try {
        const response = await api.post(`${BASE_API}/verify-otp`, { email, otp });
        return response;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Network Error" };
    }
};

export const LoginUserApi = async (email, password) => {
    try {
        const response = await api.post(`${BASE_API}/login`, { email, password });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : { message: "Network Error" };
    }
};