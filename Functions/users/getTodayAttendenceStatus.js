export default function getTodayAttendence(token){
    return new Promise((resolve) => {
        fetch(`${window.location.origin}/api/users/attendence/get-today-attendence-status`, {
            method: "GET",
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`,
            }
        }).then(res => res.json()).then(res => resolve(res));
    })
}