export interface FimkApiConfig {
    baseURL: string;
}
export declare class FimkApi {
    private baseURL;
    constructor(defaults: FimkApiConfig);
    get<T>(path: string): Promise<T>;
    post<T, Y>(path: string, params: Y): Promise<T>;
    private searchParams;
}
export declare class FimkApiError {
    errorDescription: string;
    errorCode: number;
    path: string;
    params?: {
        [key: string]: any;
    };
    constructor(errorDescription: string, errorCode: number, path: string, params?: {
        [key: string]: any;
    });
}
