<template>  
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path == '/user/poiExcel'">
        <el-breadcrumb-item :to="{ path: '/homes' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>poiExcel</el-breadcrumb-item>
      </el-breadcrumb><br>
      

    </div>
</template>
<script>
export default{
    data() {
        return{

        }
    },
    created() {
        // this.getRoleList();
    },
    methods:{
    }
}
</script>
<style>
</style>