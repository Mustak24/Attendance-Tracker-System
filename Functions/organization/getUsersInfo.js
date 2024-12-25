export default function getUsersInfo(token){
    return new Promise(resolve => {
        fetch(`${window.location.origin}/api/organization/users/get-all-info`, {
            method: "GET",
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        }).then(res => res.json()).then(res => resolve(res));
    })
}