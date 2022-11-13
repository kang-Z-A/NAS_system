<script setup lang='ts'>
import { getdata } from '@/apis/api'
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { defineAsyncComponent } from 'vue';
const Top = defineAsyncComponent(() => import ('@/components/Top.vue'))
const DownUp = defineAsyncComponent(() => import ('@/components/DownUp.vue'))
const Mine = defineAsyncComponent(() => import ('@/components/Mine.vue'))
const Video = defineAsyncComponent(() => import ('@/components/Video.vue'))

const router = useRouter()

const userinfo = reactive({
    name: ''
})

const selected = ref(0)
const onSelect = ref()
onSelect.value = (e: PointerEvent) => {
    if (e.target instanceof HTMLDivElement) {
        let ch = e.target.parentNode!.children;
        if (e.target.id === '0') {
            selected.value = 0
            for (let i = 0; i < ch.length; i++) {
                ch[i].className = ''
            }
            e.target.className = 'active';
        }
        else if (e.target.id === '1') {
            selected.value = 1
            for (let i = 0; i < ch.length; i++) {
                ch[i].className = ''
            }
            e.target.className = 'active';
        }
        else if (e.target.id === '2') {
            selected.value = 2
            for (let i = 0; i < ch.length; i++) {
                ch[i].className = ''
            }
            e.target.className = 'active';
        }
        else return
    }
}

onMounted(async () => {
    //请求数据
    // console.log('修改后的token',window.localStorage.getItem('X-token'))
    await getdata().then(res => {
        if (res.data.code === 200) {
            // console.log(res.data)
            userinfo.name = res.data.userinfo.name
        } else {
            router.push({ name: 'login' })
        }
    })



})

</script>

<template>
    <div class="screen">
        <Top :name="userinfo.name"></Top>
        <div class="mid">
            <div class="navlist" @click="onSelect">
                <div id="0" class="active">音视频播放</div>
                <div id="1">上传下载</div>
                <div id="2">我的</div>
            </div>
            <div class="show">
                <keep-alive>
                    <component :is="selected === 0 ? Video : (selected === 1 ? DownUp : Mine)" :name="userinfo.name"></component>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
* {
    margin: 0;
    padding: 0;
}

.screen {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;

    & .mid {
        height: 92%;
        display: flex;
        flex-direction: row;

        & .navlist {
            width: 20vw;
            background-color: rgb(52, 58, 64);
            z-index: 1;
            color: rgba(236, 233, 233, 0.781);

            & div {
                height: 3em;
                width: 100%;
                text-align: center;
                line-height: 3em;
                user-select: none;
                // font-family: 'fontType';
            }
        }

        & .show {
            width: 100%;
            background-color: rgb(241, 242, 243);
            overflow: hidden;
        }
    }
}

.active {
    background-color: rgb(35, 38, 42);
}
</style>