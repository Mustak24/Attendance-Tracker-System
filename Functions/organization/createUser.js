export default function createUser(token, data){
    return new Promise(resolve => {
        if(!token) return resolve({miss: false, alert: {type: 'error', msg: 'No token found.'}});
        fetch(`${window.location.origin}/api/organization/users/create-user`, {
            method: "POST",
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        }).then(res => res.json()).then(res => resolve(res));
    })
}