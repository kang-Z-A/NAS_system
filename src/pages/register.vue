<script setup lang='ts'>
import SvgIcon from '@/components/SvgIcon.vue'
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register, name_check } from '../apis/api'

const router = useRouter()
const name = ref('')
const password = ref('')
const passwordAgain = ref('')
const nameExist = ref(false)
const illegal = ref(false)
const nameEmpty = ref(false)
const passwdIsSame = ref(true)

//输入框失焦后进行用户名验证与非空判断
const nameCheck = ref()
nameCheck.value = async () => {
    if (!name.value) {
        nameEmpty.value = true
        nameExist.value = false
    }
    else {
        nameEmpty.value = false
        name_check(name.value).then((res) => {
            if (res.data == 'err') console.log('服务器出错')
            else if (res.data == 'existed') nameExist.value = true
            else if (res.data == 'success') nameExist.value = false
        })
    }
}


//输入框失焦后进行密码验证
const passwordSpec = ref()
passwordSpec.value = () => {
    //至少8个字符，至少一个字符和一个数字
    let p = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    if (!p.test(password.value)) illegal.value = true;
    else illegal.value = false
}


//检验第二次输入密码是否与第一次相同
let time: NodeJS.Timeout|null = null
const passwdAgain_check = ref()
passwdAgain_check.value = () => {
    if (time) clearTimeout(time)
    time = setTimeout(() => {
        console.log(1)
        if (passwordAgain.value !== password.value) passwdIsSame.value = false
        else passwdIsSame.value = true
    }, 500)
}

//注册用户信息
const registerUser = ref()
registerUser.value = () => {
    register(name.value, password.value).then((response) => {
        if(response.data === '注册成功')
            router.push({ 
                name:'login',
            })
    })
}


</script>

<template>
    <div class="video_background">
        <video src="https://qq-web.cdn-go.cn/zc.qq.com/f59c7d00/v3/img/bg-video.mp4" autoplay muted></video>
    </div>
    <div class="main">
        <label class="label-reg">注册</label>
        <div class="input-row">
            <input type="text" placeholder="用户名" v-model="name" @blur="nameCheck" autofocus>
            <label class="checkName" v-show="nameExist">
                <svg class="warning">
                    <SvgIcon name="warning"></SvgIcon>
                </svg>
                用户名已存在
            </label>
            <label class="checkName" v-show="nameEmpty">
                <svg class="warning">
                    <SvgIcon name="warning"></SvgIcon>
                </svg>
                用户名不能为空
            </label>
        </div>
        <div class="input-row">
            <input type="password" placeholder="密码" v-model="password" @blur="passwordSpec">
            <label class="checkIsLegal" v-show="illegal">
                <svg class="warning">
                    <SvgIcon name="warning"></SvgIcon>
                </svg>
                请输入8个字符，并至少包含一个数字和一个字符
            </label>
        </div>
        <div class="input-row">
            <input type="password" placeholder="确认密码" v-model="passwordAgain" @keyup="passwdAgain_check">
            <label class="checkName" v-show="!passwdIsSame">
                <svg class="warning">
                    <SvgIcon name="warning"></SvgIcon>
                </svg>
                两次密码输入不一致
            </label>
        </div>
        <button @click="registerUser">注册</button>
    </div>
</template>

<style scoped lang="scss">
* {
    margin: 0;
    padding: 0;
    // font-family: 'fontType';
}

.video_background {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;

    video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.main {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: normal;
    justify-content: center;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 410px;
    height: 512px;
    z-index: 1;

    .label-reg {
        font-size: 35px;
        margin-bottom: 40px;
        font-family: 'fontType';
        user-select: none;
        padding-left: 43%;
    }

    .input-row {
        display: flex;
        flex-direction: column;
        align-items: normal;
        margin-top: 10px;
        justify-content: space-between;
        margin-bottom: 8px;
        padding-left: 14%;
        width: 60%;
        transform: translate(10%);

        input {
            font-size: 14px;
            height: 35px;
            width: 240px;
            margin-bottom: 10px;
            background: rgba(255, 255, 255, 0.3);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 5px;
            transition: 0.2s;
            outline: none;
            padding: 0 10px;
            user-select: none;

            &:focus {
                border: 1px solid rgba(255, 255, 255, 0.8)
            }

            &::-webkit-input-placeholder {
                color: rgba(143, 145, 146, 0.4)
            }
        }

        .checkIsLegal {
            font-size: 10px;
            font-family: none;
            margin: 0;
            color: red;
        }

        .checkName {
            font-size: 10px;
            font-family: none;
            margin: 0;
            color: red;
        }

        .warning {
            width: 16px;
            height: 16px;
            transform: translate(0, 3px);
        }
    }

    button {
        width: 100px;
        height: 40px;
        background-color: rgb(169, 218, 245);
        outline: none;
        border: 1px;
        margin-top: 20px;
        border-radius: 5px;
        transition: 0.2s;
        margin-left: 40%;

        &:hover {
            background-color: rgb(96, 180, 224);
        }
    }
}
</style>