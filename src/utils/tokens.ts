export function setToken(tokenKey:string, token:string) { // 将token存入localStorage
  return window.localStorage.setItem(tokenKey, token)
}

export function getToken(tokenKey:string) {	//拿到localStorage中的token
  return window.localStorage.getItem(tokenKey) || ''
}

export function removeToken(tokenKey:string) {  //退出登录时调用销毁token
  return window.localStorage.removeItem(tokenKey)
}

