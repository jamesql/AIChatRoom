import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

class ApiClient {
    private static instance: ApiClient;
    private axiosInstance: AxiosInstance;
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:80';
        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    public static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    public async login(username: string, password: string): Promise<AxiosResponse<any>> {
        return this.axiosInstance.post('/auth/login', { username, password });
    }
    public async register(username: string, password: string, email: string, avatar: string): Promise<AxiosResponse<any>> {
        return this.axiosInstance.post('/auth/register', { username, password, email, avatar });
    }


    

}

export default ApiClient;