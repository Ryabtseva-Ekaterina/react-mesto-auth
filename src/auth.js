export const Base_Url = 'https://auth.nomoreparties.co';
export const register = (email, password) => {
    return fetch (`${Base_Url}/signup`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({email, password})
    })
    .then ((response) => {
        try {
            if (response.status === 201) {
                return response.json ();
            }
        } catch (e) {
            return (e)
        }
    })
    .then ((res) => {
        return res;
        console.log(res);
    })
    .catch ((err) => console.log(err));
}

export const authorize = (email, password) => {
    return fetch (`${Base_Url}/signin`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({email, password})
    })
    .then ((response) => response.json ())
    .then ((data) => {
        localStorage.setItem ('token', data.token);
        return data;
    })
    .catch ((err) => console.log(err));
}

export const getContent = (token) => {
    return fetch (`${Base_Url}/users/me`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then (response => response.json ())
    .then (data =>  data)
    .catch ((err) => console.log(err));
}