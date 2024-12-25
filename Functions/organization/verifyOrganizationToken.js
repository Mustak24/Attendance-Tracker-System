export default function verifyOrganizationToken(token){
    return new Promise((resolve) => {
        fetch(`${window.location.origin}/api/organization/verify-token`, {
            method: "GET",
            headers: {
                'authorization': `Bearer ${token}`,
                'content-type': 'application/json'
            }
        }).then(res => res.json()).then(res => resolve(res))
    })
}