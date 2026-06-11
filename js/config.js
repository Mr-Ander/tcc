const API_URL = "http://localhost:3000/api";

function getAuthHeader() {
    const token = localStorage.getItem("userToken");
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

async function authenticatedFetch(url, options = {}) {
    const headers = getAuthHeader();
    const config = {
        ...options,
        headers: {
            ...headers,
            ...options.headers
        }
    };

    const response = await fetch(url, config);
    
    if (response.status === 401) {
        // Token expirado ou inválido
        localStorage.clear();
        window.location.href = "/login";
        return;
    }
    
    return response;
}
