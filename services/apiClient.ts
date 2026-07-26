import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Your Mac's local network IP address
export const LOCAL_MAC_IP = '10.239.75.122';
export const PORT = '5001';

// Auto-detect IP address for Expo Go, Mobile Devices, Android Emulator & Web
const getBaseUrl = () => {
  const hostUri = Constants.expoConfig?.hostUri || (Constants as any).experienceUrl;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
      return `http://${ip}:${PORT}/api/v1`;
    }
  }
  return `http://${LOCAL_MAC_IP}:${PORT}/api/v1`;
};

export const API_BASE_URL = getBaseUrl();

// ANSI Color Codes for terminal logging
const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',     // Request Cyan
  green: '\x1b[32m',    // 2xx Success Green
  yellow: '\x1b[33m',   // 4xx Warning Yellow
  red: '\x1b[31m',      // 5xx / Network Error Red
  magenta: '\x1b[35m',  // Token / Accent Magenta
};

interface RequestOptions extends RequestInit {
  token?: string;
  params?: Record<string, string>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    console.log(`${COLORS.bold}${COLORS.magenta}[API CLIENT] Initialized with Base URL: ${this.baseUrl}${COLORS.reset}`);
  }

  private formatUrl(endpoint: string, params?: Record<string, string>): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    let url = `${this.baseUrl}${cleanEndpoint}`;
    if (params) {
      const queryString = new URLSearchParams(params).toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    return url;
  }

  public async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    const method = (options.method || 'GET').toUpperCase();
    const fullUrl = this.formatUrl(endpoint, options.params);
    const startTime = Date.now();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (options.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }

    // 🚀 COLORFUL TERMINAL REQUEST LOG
    console.log(
      `${COLORS.bold}${COLORS.cyan}🚀 [API REQ] ${method}${COLORS.reset} ${COLORS.cyan}${fullUrl}${COLORS.reset}`
    );
    if (options.body) {
      try {
        const bodyObj = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
        console.log(
          `${COLORS.dim}${COLORS.cyan}   Payload: ${JSON.stringify(bodyObj, null, 2)}${COLORS.reset}`
        );
      } catch (e) {
        console.log(`${COLORS.dim}${COLORS.cyan}   Payload: ${options.body}${COLORS.reset}`);
      }
    }

    try {
      const response = await fetch(fullUrl, {
        ...options,
        method,
        headers,
      });

      const duration = Date.now() - startTime;
      const status = response.status;
      const responseData: ApiResponse<T> = await response.json();

      if (response.ok) {
        // ✅ COLORFUL TERMINAL SUCCESS RESPONSE LOG (2xx)
        console.log(
          `${COLORS.bold}${COLORS.green}✅ [API RES ${status}] ${method}${COLORS.reset} ${COLORS.green}${fullUrl}${COLORS.reset} ${COLORS.dim}(${duration}ms)${COLORS.reset}`
        );
        console.log(
          `${COLORS.dim}${COLORS.green}   Response: ${JSON.stringify(responseData, null, 2)}${COLORS.reset}`
        );
      } else if (status >= 400 && status < 500) {
        // ⚠️ COLORFUL TERMINAL CLIENT ERROR LOG (4xx)
        console.log(
          `${COLORS.bold}${COLORS.yellow}⚠️ [API WARN ${status}] ${method}${COLORS.reset} ${COLORS.yellow}${fullUrl}${COLORS.reset} ${COLORS.dim}(${duration}ms)${COLORS.reset}`
        );
        console.log(
          `${COLORS.bold}${COLORS.yellow}   Message: ${responseData.message || responseData.error}${COLORS.reset}`
        );
      } else {
        // ❌ COLORFUL TERMINAL SERVER ERROR LOG (5xx)
        console.log(
          `${COLORS.bold}${COLORS.red}❌ [API SERVER ERR ${status}] ${method}${COLORS.reset} ${COLORS.red}${fullUrl}${COLORS.reset} ${COLORS.dim}(${duration}ms)${COLORS.reset}`
        );
        console.log(
          `${COLORS.bold}${COLORS.red}   Error Details: ${JSON.stringify(responseData)}${COLORS.reset}`
        );
      }

      return responseData;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      // ❌ COLORFUL TERMINAL NETWORK / CONNECTION FAILURE LOG
      console.log(
        `${COLORS.bold}${COLORS.red}❌ [API NETWORK FAIL] ${method}${COLORS.reset} ${COLORS.red}${fullUrl}${COLORS.reset} ${COLORS.dim}(${duration}ms)${COLORS.reset}`
      );
      console.log(
        `${COLORS.bold}${COLORS.red}   Exception: ${error.message || 'Connection refused/timeout'}${COLORS.reset}`
      );

      return {
        success: false,
        message: `Unable to connect to backend server at ${fullUrl}. ${error.message || ''}`,
      };
    }
  }

  public get<T = any>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public post<T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T = any>(endpoint: string, body?: any, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T = any>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
