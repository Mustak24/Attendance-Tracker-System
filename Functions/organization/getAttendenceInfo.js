export default function getAttendenceInfo(token, attendenceId, mounth='', year='') {
    return new Promise(resolve => {
        fetch(`${window.location.origin}/api/organization/attendences/get-info?id=${attendenceId}&mounth=${mounth}&year=${year}`, {
            method: 'GET',
            headers: {
                'content-type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        }).then(res => res.json()).then(res => resolve(res))
    });
}