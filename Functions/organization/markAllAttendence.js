export default function markAllAttendence(token){
    return new Promise(resolve => {
        fetch(`${window.location.origin}/api/organization/attendences/mark-today-all-attendence`, {
            method: "GET",
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`,
            }
        }).then(res => res.json()).then(res => resolve(res));
    })
}