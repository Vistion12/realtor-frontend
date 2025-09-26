export const getAuthToken = (): string | null => {
    return sessionStorage.getItem('authToken');
};

export const authHeaders = (): HeadersInit => {
    const token = getAuthToken();
    return token ? { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    } : {
        'Content-Type': 'application/json'
    };
};

export const authHeadersFormData = (): HeadersInit => {
    const token = getAuthToken();
    return token ? {
        'Authorization' : `Bearer ${token}`        
    } : {};
};