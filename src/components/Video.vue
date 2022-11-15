<script setup lang='ts'>
import { onMounted, ref, watch } from 'vue';
import { getFileList, previewFile } from '@/apis/api'
import { ElMessage } from 'element-plus'

const props = defineProps(['name'])

interface fileInfo {
    name: string,
    path: string,
}
const files = ref([] as Array<fileInfo>)
onMounted(async () => {
    await getFileList(props.name).then(res => {
        if (res.data.code === 200) {
            res.data.fileList.forEach((item: fileInfo) => files.value.push({ 'name': item.name, 'path': item.path }));
            media()
        } else {
            ElMessage.error('请求文件列表失败')
        }
    }).catch(err => console.log(err))
})

const media_file = ref([] as Array<string>)
//筛选出多媒体文件
const media = () => {
    const suffix = ['mp4', 'avi', 'mp3', 'wav', 'mov']
    files.value.forEach((file) => {
        const t = file.name.split('.').pop()
        if (t && suffix.includes(t)) media_file.value.push(file.name)
    })
}

//在线预览功能
const value = ref('')

watch(value, (value, prevalue) => {
    if (value !== prevalue && value !== '') {
        previewFile(props.name, value).then(res => {
            if (res.status === 200) {
                let href = window.URL.createObjectURL(res.data);
                let video = document.getElementById('video_0') as HTMLVideoElement
                video.src = href
                // window.URL.revokeObjectURL(href)
            }
            else {
                ElMessage.error('请求下载失败')
            }
        })
    }
})

</script>

<template>
    <div class="all">
        <div class="screen">
            <el-select v-model="value" clearable placeholder="Select">
                <el-option v-for="item in media_file" :key="item" :label="item" :value="item" />
            </el-select>
            <video src='' controls="true" id="video_0">
                当前窗口不支持video标签
            </video>
        </div>
    </div>
</template>

<style scoped lang="scss">
* {
    margin: 0;
    padding: 0;
}

video {
    position: absolute;
    width: 80%;
    height: 80%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.all {
    height: 100%;
    width: 100%;

    .screen {
        position: relative;
        display: flex;
        flex-direction: column;
        height: 86%;
        width: auto;
        margin: 2em;
        padding: 1em;
        overflow: hidden;
        background-color: rgba(78, 71, 71, 0.1);
        border-radius: 10px;
    }
}

.file-show-list {
    height: 100%;
    width: 100%;
    background-color: rgba(248, 252, 255, 0.477);
    border-radius: 5px;
    overflow-y: scroll;

    ul {
        margin: 10px;
        padding-top: 10px;
        width: auto;

        li {
            padding: 5px;
            height: 20px;
            display: flex;
            position: relative;
            align-items: center;

            &:nth-child(odd) {
                background-color: rgb(224, 224, 224);
                box-shadow: 1px 1px 1px 1px rgb(166, 162, 162);
            }

            &:hover {
                background-color: rgb(151, 145, 145);
            }

            .download {
                position: absolute;
                font-family: 'fontType';
                font-size: smaller;
                right: 50px;

                &:hover {
                    color: rgb(34, 34, 192);
                    text-decoration: underline;
                }
            }
        }
    }
}

.file-icon {
    transform: scale(0.8);
    height: 100%;
    width: 50px;
}

:deep() .el-input__wrapper {
    background-color: rgba(197, 195, 195, 0.7);
    border: 1px;
    width: 60vw
}

:deep() span {
    margin-left: 20px;
}
</style>
<style lang="scss">
.el-select-dropdown__list {
    border: 1px;
    outline: none;
    background-color: rgb(205, 204, 204);
    user-select: none;
}

.el-select-dropdown__item.hover {
    background-color: rgba(0, 255, 205, 0.3);
}
</style>
