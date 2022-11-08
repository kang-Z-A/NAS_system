import koa, { Middleware } from 'koa'
import http from 'http'
import { sign_Token, decode_Token, secret } from './sigh_token'
import fs from 'fs'
import cors from 'koa2-cors'

const app = new koa();


const server = http.createServer(app.callback()).listen(3000, () => { console.log("listening on port:3000") })

app.use(cors({
  //生产环境
  // origin:'http://127.0.0.1:5500',

  //开发环境
  origin:'http://127.0.0.1:5173',
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  // allowHeaders: ['Content-Type', 'Authorization', 'Accept','X-token'],
}))

//token负载
interface payload {
  name: string,
  startTime: number,
  timeout: number
}

//查询数据库返回合法与否和用户名
interface token_return {
  legal: boolean,
  name: string
}


//连接数据库
import mongoose from 'mongoose'
mongoose.connect('mongodb://sys_admin02:123@localhost:27017/system');

const db = mongoose.connection;
db.on('error', console.error.bind(console, '连接失败'));
db.once('open', function () {
  console.log('数据库连接成功');
});


function handleError(err: mongoose.CallbackError) {
  console.log('error, ', err)
}


//用户信息原型
const login_schema = new mongoose.Schema({
  name: { type: String, default: 'user_default', unique: true },
  password: { type: String },
  filePath:{type:String},
})

//构造用户信息模型
const user_model = db.model("customers", login_schema)


import Router from 'koa-router'
const router = new Router()

import { koaBody } from 'koa-body'
app.use(koaBody({
  multipart: true,  //设置为true才能访问得到请求头的body
}))

//检查名字是否重复
router.post('/nameCheck', async (ctx: koa.Context) => {
  console.log(ctx.request.body)
  let add_name: string = ctx.request.body.name;
  //个人理解：返回一个Promise，并在回调执行异步任务阻止ctx返回
  return new Promise((resolve) => {
    //强制转为宏任务
    setTimeout(() => user_model.find({ name: add_name }).exec((err, res) => {
      if (err) ctx.body = 'err'
      else if (res.length === 0) ctx.body = 'success'
      else ctx.body = 'existed'
      resolve(1)
    }), 10);
  })
})

//将用户信息注册到数据库
router.post('/register', async (ctx: koa.Context) => {
  let add_name = ctx.request.body.name
  let add_passwd = ctx.request.body.password
  let newUser = new user_model({ name: add_name, password: add_passwd,filePath:`D:/userStorage/${add_name}` })
  
  fs.mkdir(`D:/userStorage/${add_name}`,err => {
    if(err) console.log("用户资源文件创建失败 ",err)
    console.log("用户资源文件创建成功")
  })

  return new Promise((resolve) => {
    setTimeout(() => {
      newUser.save(function (err) {
        if (err) return handleError(err)
        else ctx.body = '注册成功'
        resolve(1)
      })
    }, 100);
  })
})

//登录
router.post('/login', async (ctx: koa.Context) => {
  // console.log(ctx.request)
  let login_name = ctx.request.body.name
  let login_passwd = ctx.request.body.password

  return new Promise((resolve) => {
    setTimeout(() => user_model.find({ name: login_name, password: login_passwd }).exec((err, res) => {
      if (err || res.length === 0) ctx.body = 'err'
      else {
        let now = new Date().getTime()
        const token = sign_Token({ name: login_name, startTime: now, timeout: 1000 * 60 * 60 * 24 })
        ctx.body = {
          message: '登录成功',
          code: 200,
          token
        }
      }
      resolve(1)
    }), 10);
  })
})

//请求用户数据
router.get('/userdata', async (ctx: koa.Context) => {
  let token: string = ctx.request.headers['x-token'] as string
  // console.log('token = ', token)
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      await checkToken(token).then(res => {
        //token不合法
        // console.log(res)
        if (res!.code === 402 || res!.code === 401) {
          ctx.body = { code: res!.code, message:res.message }
          resolve(1)
        }
        //token校验成功
        else {
          return setTimeout(async () => {
            user_model.find({ name: res.name }).select('name filePath').exec((err, res) => {
              ctx.body = {
                code: 200,
                userinfo: res[0]
              }
            resolve(1)
            })
          }, 10)
        }
        
      })
    }, 10);
  })
})


//校验token，返回对象，包含code和name两个属性
function checkToken(token: string) {
  //如果token不为''
  if (token.length != 0) {
    //解码token
    return decode_Token(token).then(async res => {
      let endTime = new Date().getTime()
      const { name, startTime, timeout } = res as payload
      // console.log(startTime, endTime,timeout)

      //检查name是否为系统用户
      let nameLegal: token_return
      //查询数据库，为nameLegal赋值,方便后面判断
      return new Promise((resolve, reject) => {
        user_model.find({ name: name }).exec((err, res) => {
          if (err) nameLegal = { legal: false, name: '' } 
          else nameLegal = { legal: true, name: res[0].name } 
          resolve(1)
        })
      }).then(res => {
        //如果时间过期
        if (endTime - startTime > timeout) {
          return { code: 402, name: '', message:'token过期' }
        }
        //如果名字不合法
        else if (!nameLegal.legal) return { code: 402, name: '', message:'名字不存在' }
        //既没过期名字也合法
        else return { code: 200, name: nameLegal.name }
      })
    }, err => {
      return { code: 402, name: '', message:'token解码错误' }
    })
  }
  //token长度为0
  else {
    return Promise.resolve({ code: 401, name: '', message:'token长度为0' })
  }
}

app.use(router.routes()).use(router.allowedMethods())










