<script setup lang='ts'>
import { ref } from 'vue';
import {login} from '@/apis/api'
import { useRouter } from 'vue-router';

const name = ref('')
const passwd = ref('')

const router = useRouter()

//登录
const Login = ref()
Login.value = () => { 
    login(name.value,passwd.value).then((res) => {
        if(res.data.message === '登录成功'){
            let token = res.data.token;
            window.localStorage.setItem('X-token',token)
            router.push({ 
                name:'menu',
            })
        }
        else window.alert('登录失败')
    },err => {
        console.log(err)
    })
}

const toRegister = ref()
toRegister.value = () => { 
    router.push({name:'register'})
 }

</script>

<template>
    <div class="background">
        <img src="../assets/img/NAS_logo.png">
        <div class="body">
            <div class="title">登录</div>
            <div class="input-box">
                <div class="input-row">
                    <label>用户名：</label>
                    <input type="text" class="username" v-model="name" autofocus>
                </div>
                <div class="input-row">
                    <label>密码：</label>
                    <input type="password" class="passwd" v-model="passwd" @keyup.enter="Login">
                </div>
            </div>
            <div class="btn" @click="Login">确认</div>
            <div class="bottom">
                <label class="register" @click="toRegister">注册</label>
                <!-- <label class="forget">忘记密码</label> -->
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
* {
    margin: 0;
    padding: 0;
}
html, body{
    height: 100%;
    width: 100%;
}
.background {
    position: relative;
    box-sizing: border-box;
    background: linear-gradient(to bottom right,black, cyan);
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    height: 100vh;
    width: 100vw;
}
img{
    transform: scale(1.1);
}
.body {
    transform: translate(-100px, 0);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    height: 380px;
    width: 400px;
    background-color: rgb(200, 224, 224);
    backdrop-filter: blur(1px);
    border-radius: 25px;
    user-select: none;
    .title{
        font-family: 'fontType';
        font-size: 35px;
        margin-bottom: 10px;
        margin-top: 30px;
    }
    .input-row{
        display: flex;
        margin-top: 10px;
        justify-content: space-between;
        margin-bottom: 20px;
        label{
            font-family: 'fontType';
            font-size: 20px;
            margin-top: 7px;
        }
        input{
            font-size: 14px;
            height: 35px;
            width: 200px;
            background: rgba(255,255,255,0.3);
            border:1px solid rgba(255,255,255,0.2);
            border-radius: 5px;
            transition: 0.2s;
            outline: none;
            padding: 0 10px;
            &:focus{
                    border: 1px solid rgba(255, 255, 255, 0.8)
                }
            }
    }
    .btn{
        background-color: rgb(0, 207, 207);
        width: 80px;
        height: 35px;
        transform: translate(0, -10%);
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        outline: none;
        padding: 0 5px;
        border:1px;
        font-size: 15px;
        font-family: 'fontType';
        transition: 0.2s;
        &:hover{
            background-color: rgb(0, 182, 182);
        }
    }
    .bottom{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        color: rgb(165, 164, 164);
        & label:hover{
            cursor: pointer;
            text-decoration: underline;
        }
    }
}
</style>