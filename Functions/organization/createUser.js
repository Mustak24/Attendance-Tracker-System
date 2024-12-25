export default function createUser(token, data){
    return new Promise(resolve => {
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