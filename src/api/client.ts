import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Create a custom Axios instance configured for AquaLogix REST API
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Client-Platform': 'AquaLogix-Web-SPA',
    'X-Version': '1.0.0'
  }
});

// Request Interceptor: Attach authentication token, correlation ID, or log outgoing requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // In a production backend, attach JWT:
    // const token = localStorage.getItem('aqualogix_auth_token');
    // if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    
    // Log outgoing requests for audit/observability
    console.debug(`[Axios Outgoing Request] ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data || '');
    return config;
  },
  (error) => {
    console.error('[Axios Request Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Uniform error handling & status tracking
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    console.debug(`[Axios Response Received] Status ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`[Axios API Error] Status ${error.response.status}:`, error.response.data);
    } else if (error.request) {
      console.warn('[Axios Network/Timeout Error]: No response received from server.');
    } else {
      console.error('[Axios Setup Error]:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
