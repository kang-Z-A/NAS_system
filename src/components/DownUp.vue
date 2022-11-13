<script setup lang='ts'>
import { onMounted, onUpdated, ref } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue'
import { upload, getFileList, downLoadFile } from '@/apis/api'
import { ElMessage } from 'element-plus'

const centerDialogVisible = ref(false)

const props = defineProps(['name'])


const input_file = ref();
const fileName = ref('')

//点击上传按钮
const clickUpLoad = ref()
clickUpLoad.value = () => {
    const input_file_name = input_file.value.value.split('\\').pop()
    //没有要上传的文件
    if (!input_file.value.files.length) return
    //上传文件已经有同名文件了
    if (files.value.find((file) => { return file.name === input_file_name })) {
        centerDialogVisible.value = true
        return
    }
    toUpload()
    files.value.push({ 'name': input_file_name, 'path': `D:/userStorage/${props.name}/${input_file_name}` })
}

//确认上传
const toUpload = () => {
    const input_file_name = input_file.value.value.split('\\').pop()
    let formData = new FormData()
    formData.append('file', input_file.value.files[0])
    formData.append('name', props.name)
    upload(formData).then(res => {
        if (res.data === '上传成功') {
            ElMessage({
                message: '文件上传成功',
                type: 'success',
            })
        } else return
        //让上传文件名消失
        input_file.value.value = null
        showMes.value = false
    })
}

//input选择文件改变后触发事件showFileName，改变fileName，再根据文件名是否为空决定是否显示已选择文件名
const showMes = ref(false)
const showFileName = ref()
showFileName.value = () => {
    fileName.value = input_file.value.value.split('\\').pop()
    if (fileName.value !== '') showMes.value = true
    else showMes.value = false
}

const downLoad = ref()
downLoad.value = (e: PointerEvent) => {
    if (e) {
        const fileName = ((e.target as HTMLSpanElement).parentNode as HTMLLIElement).outerText.split('\n').shift()
        downLoadFile(props.name, fileName as string).then(res => {
            if (res.status === 200) {
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(res.data);
                link.download = fileName as string;
                link.click();
                window.URL.revokeObjectURL(link.href)
                document.body.removeChild(link)
                ElMessage({
                    message: '文件开始下载',
                    type: 'success',
                })
            }
            else {
                ElMessage.error('请求下载失败')
            }
        })
    }
}


//单个文件项存储信息
interface fileInfo {
    name: string,
    path: string,
}

//请求文件列表
const files = ref([] as Array<fileInfo>)
onMounted(async () => {
    await getFileList(props.name).then(res => {
        if (res.data.code === 200) {
            res.data.fileList.forEach((item: fileInfo) => files.value.push({ 'name': item.name, 'path': item.path }));
        } else {
            ElMessage.error('请求文件列表失败')
        }
    }).catch(err => console.log(err))
})

onUpdated(() => {

})

</script>

<template>
    <div class="all">
        <div class="screen">
            <div class="upload">
                <span class="select">
                    <span>选择文件</span>
                    <input type="file" name="upload_file" ref="input_file" @input="showFileName">
                </span>
                <div class="show-file" v-show="showMes">
                    <svg class="file-icon">
                        <SvgIcon name="fileIcon"></SvgIcon>
                    </svg>
                    <span>{{ fileName }}</span>
                </div>
                <button id="btn-upload" @click="clickUpLoad">上传</button>
            </div>
            <div class="file-show-list">
                <ul>
                    <li v-for="item in files" :key="item.name">
                        <svg class="file-icon">
                            <SvgIcon name="fileIcon"></SvgIcon>
                        </svg>
                        <span>{{ item.name }}</span>
                        <span class="download" @click="downLoad">下载</span>
                    </li>
                </ul>
            </div>
            <el-dialog v-model="centerDialogVisible" title="注意" width="30%" align-center>
                <span>已有同名文件，是否进行替换</span>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="centerDialogVisible = false; input_file.value = null; showMes = false">取消
                        </el-button>
                        <el-button type="primary" @click="centerDialogVisible = false ; toUpload()">
                            确认
                        </el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<style scoped lang="scss">
* {
    margin: 0;
    padding: 0;
}

.all {
    height: 100%;
    width: 100%;

    .screen {
        display: flex;
        flex-direction: column;
        height: 86%;
        width: auto;
        margin: 2em;
        padding: 1em;
        overflow: hidden;
        background-color: rgba(78, 71, 71, 0.1);
        border-radius: 10px;

        .upload {
            height: 10%;
            width: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding-bottom: 10px;
            border-bottom: 2px solid rgba(27, 167, 90, 0.4);
        }
    }
}

.file-icon {
    transform: scale(0.8);
    height: 100%;
    width: 50px;
}

span {
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    user-select: none;
}

.select {
    position: relative;
    display: inline-block;
    overflow: hidden;
    background-color: rgb(127, 255, 212);
    width: 90px;
    height: 36px;
    text-align: center;
    border-radius: 5px;
    box-shadow: 2px 2px 1px rgb(189, 189, 189);
    border: 1px solid rgb(36, 236, 170);

    &:hover {
        background-color: rgba(14, 155, 108, 0.5);
        border: 1px solid rgba(14, 155, 108, 0.5);
        box-shadow: 2px 2px 1px rgb(189, 189, 189);
    }
}

input {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 100px;
    // opacity: 0;
}

#btn-upload {
    background-color: rgb(127, 255, 212);
    width: 90px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border-radius: 5px;
    box-shadow: 2px 2px 1px rgb(189, 189, 189);
    border: 1px solid rgb(36, 236, 170);
    user-select: none;
    font-size: 16px;

    &:hover {
        background-color: rgba(14, 155, 108, 0.5);
        border: 1px solid rgba(14, 155, 108, 0.5);
        box-shadow: 2px 2px 1px rgb(189, 189, 189);
    }
}

.show-file {
    height: 50%;
    width: 400px;
    display: flex;
    border: 1px solid rgba(255, 255, 255, 0.288);
    border-radius: 5px;
    box-shadow: 1px 2px 1px rgb(189, 189, 189);
}

.file-show-list {
    height: 100%;
    width: 100%;
    margin-top: 20px;
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
</style>

<style lang="scss">
.el-message__content {
    user-select: none;
}

.el-button,
.el-button--primary {
    width: 25%;
}
</style>