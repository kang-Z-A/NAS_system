<script setup lang='ts'>

</script>

<template>
    <div class="background">
        <img src="../assets/img/NAS_logo.png">
        <div class="body">
            <div class="title">登录</div>
            <div class="input-box">
                <div class="input-row">
                    <label>用户名：</label>
                    <input type="text" class="username">
                </div>
                <div class="input-row">
                    <label>密码：</label>
                    <input type="text" class="passwd">
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '../assets/font/font.css';
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
    justify-content: center;
    align-items: center;
    height: 380px;
    width: 400px;
    background-color: rgb(200, 224, 224);
    backdrop-filter: blur(1px);
    border-radius: 25px;
    .title{
        transform:translate(0, -30px);
        font-family: 'fontType';
        font-size: 35px;
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
}
</style>