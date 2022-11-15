<script setup lang='ts'>
import SvgIcon from '@/components/SvgIcon.vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { upload_headpic, changeInfo } from '../apis/api'

const props = defineProps(['name', 'headImg'])
const emit = defineEmits(['reqAgain'])

const imageUrl = ref('')
const password = ref('')
const showForm = ref(false)
const passwd_illegal = ref(false)

const changeShowForm = ref()
changeShowForm.value = () => {
    showForm.value = !showForm.value
}

let time: NodeJS.Timeout | null = null

//输入框失焦后进行密码验证
const passwordSpec = ref()
passwordSpec.value = () => {
    //至少8个字符，至少一个字符和一个数字
    let p = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    if (time) clearTimeout(time)
    time = setTimeout(() => {
        if (!p.test(password.value)) passwd_illegal.value = true;
        else passwd_illegal.value = false
    }, 100)
}

const uploadSectionFile = ref()
uploadSectionFile.value = (params: any) => {
    const file = params.file,
        fileType = file.type,
        isImage = fileType.indexOf("image") != -1,
        isLt2M = file.size / 1024 / 1024 < 2;
    // 这里常规检验，看项目需求而定
    if (!isImage) {
        ElMessage.error("只能上传图片格式png、jpg、gif!");
        return;
    }
    if (!isLt2M) {
        ElMessage.error("只能上传图片大小小于2M");
        return;
    }
    // 根据后台需求数据格式
    const form = new FormData();
    // 文件对象
    form.append("file", file);
    upload_headpic(form).then(res => {
        if (res.status === 200) imageUrl.value = URL.createObjectURL(res.data)
    })
}

const savetoload = ref()
savetoload.value = () => {
    if(passwd_illegal.value || password.value === ''){
        ElMessage.error('密码不合法')
        return
    }
    let form = new FormData()
    form.append('headimg', imageUrl.value)
    form.append('name', props.name)
    form.append('password', password.value)
    changeInfo(form).then(res => {
        if (res.status === 200) {
            console.log('修改成功')
            ElMessage({
                message: '信息修改成功',
                type: 'success',
            })
            emit('reqAgain', true)
            showForm.value = false
        }
    })
}

</script>

<template>
    <div class="all">
        <div class="screen">
            <div class="top">
                <div class="headImg">
                    <img :src="props.headImg" alt="">
                </div>
                <div class="name">
                    <span>{{ props.name }}</span>
                </div>
                <div class="change">
                    <button @click="changeShowForm">修改信息</button>
                </div>
            </div>
            <div class="form" v-if="showForm">
                <span>请上传头像</span>
                <el-upload class="avatar-uploader" :http-request="uploadSectionFile" :show-file-list="false"
                    :with-credentials='false'>
                    <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
                <div class="changeName">
                    <span>请输入新的密码:</span>
                    <input type="text" v-model="password" @keyup="passwordSpec" @blur="passwordSpec">
                </div>
                <label class="checkIsLegal" v-show="passwd_illegal">
                    <svg class="warning">
                        <SvgIcon name="warning"></SvgIcon>
                    </svg>
                    请输入8个字符，并至少包含一个数字和一个字符
                </label>
                <div class="changeName">
                    <button @click="savetoload">保存</button>
                </div>
            </div>
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
        align-items: center;
        height: 86%;
        width: auto;
        margin: 2em;
        padding: 1em;
        overflow: hidden;
        background-color: rgba(78, 71, 71, 0.1);
        border-radius: 10px;
    }
}

.top {
    position: relative;
    width: 50vw;
    height: 80px;
    display: flex;
    border-radius: 10px;
    background-color: rgb(236, 238, 239);

    .headImg {
        height: 100%;
        position: absolute;
        display: flex;
        align-items: center;
        padding-left: 15px;

        img {
            user-select: none;
            object-fit: cover;
            max-height: 80%;
            border-radius: 100%;
        }
    }

    .name {
        position: absolute;
        width: 100px;
        height: 100%;
        margin-left: 120px;
        display: flex;
        align-items: center;

        span {
            font-family: 'fontType';
        }
    }

    .change {
        position: absolute;
        width: 100px;
        height: 100%;
        right: 10px;
        display: flex;
        align-items: center;

        button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 80px;
            height: 30px;
            border-radius: 5px;
            background-color: rgb(224, 224, 225);
            border: 1px;
            box-shadow: 2px 2px 1px rgb(189, 189, 189);
            user-select: none;

            &:hover {
                background-color: rgba(0, 255, 205, 0.3);
            }
        }
    }
}

.avatar {
    width: 200px;
    height: 200px;
    border-radius: 100%;
    object-fit: cover;
}

.form {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    border-radius: 5px;
    padding-top: 10px;
    padding-bottom: 15px;
    margin: 15px;
    width: 50vw;
    height: 72vh;
    background-color: rgb(236, 238, 239);

    span {
        // margin-top: 15px;
        // margin-bottom: 15px;
        width: 100%;
        height: 30px;
        font-family: 'fontType';
        display: flex;
        justify-content: center;
        align-items: center;
        // background-color: rgba(193, 198, 200, 0.847);
    }

    .changeName {
        display: flex;
        align-items: center;
        margin-top: 10px;

        span {
            margin-right: 5px;
        }

        input {
            height: 20px;
            padding: 2px;
            // border: 1px;
            outline: none;
            border-radius: 4px;
        }

        button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 80px;
            height: 30px;
            border-radius: 5px;
            background-color: rgb(224, 224, 225);
            border: 1px;
            box-shadow: 2px 2px 1px rgb(189, 189, 189);
            user-select: none;

            &:hover {
                background-color: rgba(0, 255, 205, 0.3);
            }
        }
    }

    .checkIsLegal {
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

    .checkName {
        font-size: 10px;
        font-family: none;
        margin: 0;
        color: red;
    }
}

:deep() .avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

:deep() .avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

:deep() .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>