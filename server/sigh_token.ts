// 自定义密钥
const secret = "erzimen_woshinibaba"
import jwt from 'jsonwebtoken'

/**
 * @param {*} data 加密的数据，最好不要包括密码之类的
 */
const sign_Token = (data:any) => {
  const token = jwt.sign(
    data,
    secret
  )
  return token
}

const decode_Token =  (token:string) => {
  return new Promise((resolve,reject) => { 
    jwt.verify(token,secret,function(err,decode){
      if(err) reject(err)
      else resolve(decode)
    })
  })
}


export {
    sign_Token,
    decode_Token,
    secret
}