<script setup lang='ts'>
import { onMounted, Ref, ref, watch } from 'vue';
import SvgIcon from '@/components/SvgIcon.vue'
import { upload, getFileList, downLoadFile, removeFile, previewFile } from '@/apis/api'
import { ElMessage, ElLoading } from 'element-plus'

//遮罩层1，上传文件重名，是否替换
const centerDialogVisible = ref(false)
//遮罩层2，预览pdf和img
const centerDialogVisible_2 = ref(false)

const props = defineProps(['name'])


const input_file = ref();
const fileName = ref('')

//按首字母排序插入文件
const pushFile = (files: Ref<{ name: string, path: string, }[]>, obj: fileInfo) => {
    if (files.value.length === 0) files.value.push(obj)
    for (let t = 0; t < files.value.length; t++) {
        if (files.value[t].name.charAt(0) > obj.name.charAt(0)) {
            files.value.splice(t, 0, obj)
            return
        }
    }
}

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
    pushFile(files, { 'name': input_file_name, 'path': `D:/userStorage/${props.name}/${input_file_name}` })
    // pushFile(files, { 'name': input_file_name, 'path': `D:/userStorage/${props.name}/${input_file_name}` })
}

//确认上传
const toUpload = () => {
    const input_file_name = input_file.value.value.split('\\').pop()
    let formData = new FormData()
    formData.append('file', input_file.value.files[0])
    formData.append('name', props.name)
    const loadingInstance = ElLoading.service({ target: '.file-show-list' })
    upload(formData).then(res => {
        loadingInstance.close()
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

//下载文件
const downLoad = ref()
downLoad.value = (e: PointerEvent) => {
    if (e) {
        const fileName = ((e.target as HTMLSpanElement).parentNode as HTMLLIElement).outerText.split('\n').shift()
        downLoadFile(props.name, fileName as string).then(res => {
            if (res.status === 200) {
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(res.data);
                link.download = fileName as string;
                link.click();
                window.URL.revokeObjectURL(link.href)
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

//删除文件
const remove = ref()
remove.value = (e: PointerEvent) => {
    if (e) {
        const fileName = ((e.target as HTMLSpanElement).parentNode as HTMLLIElement).outerText.split('\n').shift()
        const loadingInstance = ElLoading.service({ target: '.file-show-list' })
        removeFile(props.name, fileName as string).then(res => {
            loadingInstance.close()
            if (res.data === '文件删除成功') {
                let id
                for (id = 0; id < files.value.length; id++) {
                    if (files.value[id].name === fileName) break
                }
                files.value.splice(id, 1)
                ElMessage({
                    message: '文件删除成功',
                    type: 'success',
                })
            }
            else {
                ElMessage.error('文件删除失败')
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

watch(files.value, (files, prefiles) => {
    previwFix()
}, { deep: true })

//多媒体后缀
const pdfFix = ['pdf']
const imgFix = ['jpg', 'png']
const previewFiles = ref([] as Array<string>)
const previwFix = () => {
    const sumFix = imgFix.concat(...pdfFix)
    files.value.forEach((file) => {
        const t = file.name.split('.').pop()
        if (t && sumFix.includes(t)) previewFiles.value.push(file.name)
    })
}

const showPdf = ref(false)
const showImg = ref(false)
// watch([showImg.value,showPdf.value], (value,oldvalue) => {
//     if(value.includes(true))    centerDialogVisible_2.value = true
// })
const pdfUrl = ref('')
const imgUrl = ref('')

const toPreview = ref()
toPreview.value = (e: PointerEvent) => {
    const fileName = ((e.target as HTMLSpanElement).parentNode as HTMLLIElement).outerText.split('\n').shift() as string
    // console.log(fileName)
    previewFile(props.name, fileName).then(res => {
        if (res.status === 200) {
            const href = window.URL.createObjectURL(res.data);
            const filetype = fileName.split('.').pop() as string
            // console.log(filetype)
            if (pdfFix.includes(filetype)) {
                showPdf.value = true
                pdfUrl.value = href
                centerDialogVisible_2.value = true
                // console.log('pdf')
            } else if (imgFix.includes(filetype)) {
                showImg.value = true
                imgUrl.value = href
                centerDialogVisible_2.value = true
                // console.log('img')
            } else {
                ElMessage.error('当前文件暂不支持预览')
            }
        } else {
            ElMessage.error('请求错误')
        }
    })
}

const closePreviewClick = ref()
closePreviewClick.value = () => {
    if (showPdf.value === true) {
        showPdf.value = false
        centerDialogVisible_2.value = false
    } else if (showImg.value === true) {
        showImg.value = false
        centerDialogVisible_2.value = false
    }
}

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
                        <span class="filename" :title="item.name">{{ item.name }}</span>
                        <span class="showonline" v-if="previewFiles.includes(item.name)" @click="toPreview">在线预览</span>
                        <span class="download" @click="downLoad">下载</span>
                        <span class="remove" @click="remove">删除</span>
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
            <el-dialog v-model="centerDialogVisible_2" show-close="true"
                :before-close="closePreviewClick" width="1000px" align-center class="dialog2">
                <div v-if="showPdf === true" style="justify-content: center; align-items: center">
                    <iframe frameborder="0" :src="pdfUrl" width="100%" height="600px" />
                </div>
                <div v-else-if="showImg === true" class="dialog-body-content-base-style">
                    <img :src="imgUrl" alt="picture" class="show-img-box">
                </div>
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
    overflow-y: auto;

    ul {
        margin: 10px;
        padding-top: 10px;
        width: auto;

        li {
            padding: 5px;
            height: 22px;
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

            .filename {
                display: inline-block;
                overflow: hidden;
                width: 500px;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .showonline {
                position: absolute;
                font-family: 'fontType';
                font-size: smaller;
                right: 130px;

                &:hover {
                    color: rgb(34, 34, 192);
                    text-decoration: underline;
                }
            }

            .download {
                position: absolute;
                font-family: 'fontType';
                font-size: smaller;
                right: 80px;

                &:hover {
                    color: rgb(34, 34, 192);
                    text-decoration: underline;
                }
            }

            .remove {
                position: absolute;
                font-family: 'fontType';
                font-size: smaller;
                right: 30px;

                &:hover {
                    color: rgb(34, 34, 192);
                    text-decoration: underline;
                }
            }
        }
    }
}

.medio {
    position: absolute;
    display: flex;
    width: auto;
    height: auto;
}

.dialog-body-content-base-style{
    display: flex;
    justify-content: center;
    align-items: center;
    width: 60vw;
    height: 80vh;
    // overflow: hidden;
}
.show-img-box{
    // display: block;
    max-width: 600px;
    max-height: 600px;
    object-fit: cover;
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