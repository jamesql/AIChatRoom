import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { Answer, Prompt } from '../../TYPES/lobbyTypes';

class ApiClient {
    private static instance: ApiClient;
    private axiosInstance: AxiosInstance;
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.REACT_API_URL || 'http://localhost:80';
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

    private addAuthHeader(token: string) {
        this.axiosInstance.defaults.headers['Authorization'] = token;
    }

    public async login(username: string, password: string): Promise<AxiosResponse<any>> {
        return this.axiosInstance.post('/auth/login', { username, password });
    }
    public async register(username: string, password: string, email: string, avatar: string): Promise<AxiosResponse<any>> {
        return this.axiosInstance.post('/auth/register', { username, password, email, avatar });
    }

    public async getUserData(token: string): Promise<AxiosResponse<any>> {
        await this.addAuthHeader(token);
        return this.axiosInstance.get('/api/getUserData');
    }

    public async joinPublicLobby(token: string): Promise<AxiosResponse<any>> {
        await this.addAuthHeader(token);
        return this.axiosInstance.post('/api/join-matchmaking');
    }

    public async startGame(token: string, lobbyId: string): Promise<AxiosResponse<any>> {
        await this.addAuthHeader(token);
        return this.axiosInstance.post('/api/start-lobby', { lobbyId });
    }


    public async addAnswer(token: string, prompt: Prompt, answer: string, lobbyId: string): Promise<AxiosResponse<any>> {
        await this.addAuthHeader(token);
        return this.axiosInstance.post('/api/add-answer', { prompt, answer, lobbyId });
    }

    public async startVoting(token: string, lobbyId: string): Promise<AxiosResponse<any>> {
        await this.addAuthHeader(token);
        return this.axiosInstance.post('/api/start-voting', { lobbyId });
    }

    public async submitVote(token: string, answerId: string, lobbyId: string): Promise<AxiosResponse<any>> {
        await this.addAuthHeader(token);
        return this.axiosInstance.post('/api/submit-vote', { answerId, lobbyId });
    }

    public async endVoting(token: string, lobbyId: string): Promise<AxiosResponse<any>> {
        await this.addAuthHeader(token);
        return this.axiosInstance.post('/api/end-voting', { lobbyId });
    }

    public async startNextRound(token: string, lobbyId: string): Promise<AxiosResponse<any>> {
        await this.addAuthHeader(token);
        return this.axiosInstance.post('/api/start-new-round', { lobbyId });
    }








    

}

export default ApiClient;