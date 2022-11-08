import axios from 'axios'

const request = axios.create({
    baseURL: 'http://127.0.0.1:3000', 
    timeout: 5000 ,
    headers:{
        // 'Content-type':'application/json',
        'X-token':window.localStorage.getItem('X-token'),
    },
    withCredentials: true,
})

//请求拦截器，从localstorage中拿token字段，没有则为''
request.interceptors.request.use(config => {
    return config
},(error) => { 
    return Promise.reject(error)
})
  
//响应拦截器，如果data里的code为401，表示token过期
request.interceptors.response.use((response => {
    return response
}),(error) => { 
    return Promise.reject(error) 
})

export default request