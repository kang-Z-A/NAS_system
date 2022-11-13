import koa from 'koa'
import http from 'http'
import { sign_Token, decode_Token } from './sigh_token'
import fs from 'fs'
import cors from 'koa2-cors'
import { koaBody } from 'koa-body'

const app = new koa();

const server = http.createServer(app.callback()).listen(3000, () => { console.log("listening on port:3000") })

app.use(koaBody({
  multipart: true,  //设置为true才能访问得到请求头的body
  formidable: {
    maxFileSize: 200 * 1024 * 1024,	// 设置上传文件大小最大限制，默认200M
    uploadDir: 'D:/userStorage/cache',
  }
}))

interface BodyFile {
  filepath: string,
  newFilename: string,
  originalFilename: string,
}

app.use(cors({
  //生产环境
  // origin:'http://127.0.0.1:5500',

  //开发环境
  origin: 'http://127.0.0.1:5173',
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

//mongoose返回错误
interface mongooseError {
  code: number
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
  filePath: { type: String },
})

const file_schema = new mongoose.Schema({
  name: { type: String, unique: true },
  path: { type: String }
})

//构造用户信息模型
const user_model = db.model("customers", login_schema)


import Router from 'koa-router'
const router = new Router()



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

//将用户信息注册到数据库,开辟文件管理数据库，开辟存储文件夹
router.post('/register', async (ctx: koa.Context) => {
  let add_name = ctx.request.body.name
  let add_passwd = ctx.request.body.password
  let newUser = new user_model({ name: add_name, password: add_passwd, filePath: `D:/userStorage/${add_name}` })

  //添加该用户的存储文件夹
  fs.mkdir(`D:/userStorage/${add_name}`, err => {
    if (err) console.log("用户资源文件创建失败 ", err)
    console.log("用户资源文件创建成功")
  })

  //在数据库创建该用户的文件信息集合
  const file_db = db.model(add_name, file_schema)

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
        if (res!.code === 402 || res!.code === 401) {
          ctx.body = { code: res!.code, message: res.message }
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

//上传文件
router.post('/upload', async (ctx: koa.Context) => {
  const name = ctx.request.body.name
  const files = ctx.request.files;	// 获取上传文件
  const file_model = db.model(name, file_schema) //用户个人文件管理系统集合

  return new Promise((resolve) => {
    setTimeout(() => {
      Object.keys(files!).forEach((item) => {
        const reader = fs.createReadStream((files![item] as BodyFile).filepath);	// 创建可读流
        // const ext = (files![item] as BodyFile).originalFilename.split('.').pop();		// 获取上传文件扩展名
        const originalFilename = (files![item] as BodyFile).originalFilename
        const upStream = fs.createWriteStream(`D:/userStorage/${name}/${originalFilename}`);		// 创建可写流
        reader.pipe(upStream);	// 可读流通过管道写入可写流

        const upload_file = new file_model({ name: originalFilename, path: `D:/userStorage/${name}/${originalFilename}` })
        upload_file.save(function (err) {
          if (err && !err.message.includes('E11000')) return handleError(err)
          else ctx.body = '上传成功'
          resolve(1)
        })
      })
    }, 100);
  })
})

//返回指定用户的文件列表
router.get('/userdata/filelist', async (ctx: koa.Context) => {
  const name = ctx.request.query.name as string;
  const file_model = db.model(name, file_schema)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      file_model.find().exec((err, res) => {
        if (err) return handleError(err)
        ctx.body = {
          code: 200,
          fileList: res
        }
        resolve(1)
      })
    }, 100)
  })
})

import send from 'koa-send'
router.post('/download', async (ctx: koa.Context) => {
  const name = ctx.request.body.name
  const filename = ctx.request.body.filename
  const path = `/${name}/${filename}`
  ctx.attachment(path)
  await send(ctx, path, { root: 'D:/userStorage' })
  ctx.body = '下载完成'
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
          return { code: 402, name: '', message: 'token过期' }
        }
        //如果名字不合法
        else if (!nameLegal.legal) return { code: 402, name: '', message: '名字不存在' }
        //既没过期名字也合法
        else return { code: 200, name: nameLegal.name }
      })
    }, err => {
      return { code: 402, name: '', message: 'token解码错误' }
    })
  }
  //token长度为0
  else {
    return Promise.resolve({ code: 401, name: '', message: 'token长度为0' })
  }
}

app.use(router.routes()).use(router.allowedMethods())










