import axios from "axios";

// Base URL points to deployed Render API
const BASE_URL = 'https://expense-tracker-api-qcdw.onrender.com'

const api = axios.create({
    baseURL: BASE_URL,
})

// Request Interceptor - runs before every API call, reads the JWT token from localStorage
// Attaches it to the Auth Header. Hence every API call is automatically authenticated
// Without this, we'd have to manually add the header in every component
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})


// Response Interceptor - runs after every API response
// If any request gets 401 -> log user out and redirect to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status === 401){
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            window.location.href = '/login'
        }

        return Promise.reject(error)
    })

export default api