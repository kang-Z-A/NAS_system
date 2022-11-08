<script setup lang='ts'>

</script>

<template>
    <div class="all">
        <div class="screen">
            这是Mine页面
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
        height: 86%;
        width: auto;
        margin: 2em;
        padding: 1em;
        overflow: hidden;
        background-color: rgba(78, 71, 71, 0.1);
        border-radius: 10px;
    }
}
</style>