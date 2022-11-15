import request from "./request";
import axios from "axios";

export function register(name:string, passwd:string){
    return request({
        url:'/register',
        method:'post',
        data:{'name':name, 'password':passwd}
    })
}

//注册时的名字校验是否重复
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

//进入主界面时获取数据
export function getdata(){
    return request({
        url:'/userdata',
        method:'get',
        headers:{
            'X-token':window.localStorage.getItem('X-token'),
        },
    })
}

//上传文件
export function upload(data:FormData){
    return axios({
        method:'post',
        url:'http://127.0.0.1:3000/upload',
        headers:{
            'Content-Type':'multipart/form-data',
        },
        data
    })
}

//请求用户文件列表
export function getFileList(name:string){
    return request({
        url:'/userdata/filelist',
        method:'get',
        params:{"name":name}
    })
}

//请求下载文件
export function downLoadFile(name:string, filename:string){
    return request({
        url:'/download',
        method:'post',
        data:{
            'name':name,
            'filename':filename
        },
        responseType:'blob'
    })
}

export function previewFile(name:string, filename:string){
    return request({
        url:'/preview',
        method:'post',
        data:{
            'name':name,
            'filename':filename
        },
        responseType:'blob'
    })
}

export function removeFile(name:string, filename:string){
    return request({
        url:'/removefile',
        method:'get',
        params:{
            'name':name,
            'filename':filename
        }
    })
}

export function upload_headpic(data:FormData){
    return axios({
        method:'post',
        url:'http://127.0.0.1:3000/head_img',
        data,
        responseType:'blob'
    })
}

export function changeInfo(data:FormData){
    return axios({
        method:'post',
        url:'http://127.0.0.1:3000/changeinfo',
        data
    })
}