import request from "./request";

export function register(name:string, passwd:string){
    return request({
        url:'/register',
        method:'post',
        data:{'name':name, 'password':passwd}
    })
}

export function name_check(name:string){
    return request({
        url:'/nameCheck',
        method:'post',
        data:{'name':name}
    })
}

export function login(name:string, passwd:string){
    return request({
        url:'/login',
        method:'post',
        data:{
            'name':name,
            'password':passwd
        }
    })
}

export function getdata(){
    return request({
        url:'/userdata',
        method:'get',
    })
}
