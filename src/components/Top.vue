<script setup lang='ts'>
const props = defineProps(['name', 'headImg'])
</script>

<template>
    <div class="top">
        <div class="left">
            <div class="icon">
                <SvgIcon name="logo"></SvgIcon>
            </div>
            <span class="logo">NAS系统</span>
        </div>
        <div class="mid"></div>
        <div class="user">
            <img :src="props.headImg">
            <div class="mail">
                <span>{{ props.name }}</span>
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

    & .left {
        position: absolute;
        height: 8vh;
        width: 334px;
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
    }

    &.mid {
        width: 100%;
    }

    & .user {
        position: absolute;
        right: 0;
        height: 8vh;
        width: 330px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        & img {
            height: 86%;
            object-fit: contain;
            border-radius: 100%;
            user-select: none;
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