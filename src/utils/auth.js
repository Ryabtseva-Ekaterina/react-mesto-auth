export const BASE_URL = 'https://auth.nomoreparties.co';
export const register = (email, password) => {
    return fetch (`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({email, password})
    })
    .then ((response) => {
            if (response.status === 201) {
                return response.json ();
            }
    })
    .then ((res) => {
        return res;
    })
}

export const authorize = (email, password) => {
    return fetch (`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({email, password})
    })
    .then ((response) => {
        if (response.status === 200) {
            return response.json ();
        }
    })
    .then ((data) => {
        localStorage.setItem ('token', data.token);
        return data;
    })
}

export const getContent = (token) => {
    return fetch (`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then ((response) => {
        if (response.status === 200) {
            return response.json ();
        }
    })
}