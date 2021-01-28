<template>  
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path == '/user/fileUpload'">
            <el-breadcrumb-item :to="{ path: '/homes' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>文件上传</el-breadcrumb-item>
        </el-breadcrumb><br>

  </div>
</template>
<script>
export default {
    data() {
        return {
           
        };
    },
    methods: {
      
    }
}
</script>

<style>
 
</style>