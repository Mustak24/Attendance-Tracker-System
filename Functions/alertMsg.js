export default function(msg){

    const msgs = {
        'invalid-token': {type: 'error', msg: 'Given token is Invalid.'},
        'no-token': {type: 'error', msg: 'Token can\'t be found.'},
        'invalid-req-method': {type: 'error', msg: 'Invalid method to call api.'},
        'internal-server-error': {type: 'error', msg: 'Requste fail due to internal server error.'},
        'invalid-token': {type: 'error', msg: 'Give token is Unauthorized.'},
        'incomplite-info': {type: 'error', msg: 'Given infomation is incomplite.'},
        'invalid-info': {type: 'error', msg: 'Given infomation is invalid.'}
    }

    return msgs[msg];
}