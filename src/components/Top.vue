<script setup lang='ts'>
const props = defineProps(['name'])
</script>

<template>
    <div class="top">
        <div class="icon">
            <SvgIcon name="logo"></SvgIcon>
        </div>
        <span class="logo">NAS系统</span>
        <div class="user">
            <img src="@/assets/img/head_portrait.jpg">
            <div class="mail">
                <span>{{props.name}}</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
* {
    margin: 0;
    padding: 0;
}
.top {
        width: 100%;
        height: 8vh;
        background-color: white;
        box-shadow: 0 1px 2px 1px rgb(216, 223, 228);
        z-index: 1;
        display: flex;
        flex-direction: row;
        align-items: center;
        user-select: none;
        & .icon {
            margin-left: -80px;
        }

        & .logo {
            font-family: 'fontType';
            font-size: 22px;
            margin-left: -100px;
            user-select: none;
        }

        & .user {
            position: relative;
            left: 72vw;
            height: 80%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            & img {
                height: 100%;
                object-fit: contain;
                border-radius: 100%;
            }

            & .mail {
                & span {
                    padding-left: 20px;
                    font-family: 'fontType';
                    font-size: 15px;
                    user-select: none;
                }
            }
        }
    }
</style>