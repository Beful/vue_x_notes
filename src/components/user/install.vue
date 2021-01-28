<template>  
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path == '/user/install'">
        <el-breadcrumb-item :to="{ path: '/homes' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>设置</el-breadcrumb-item>
      </el-breadcrumb>
      
      
      
      <div>
        <span>主题颜色：</span>
        <themePicker></themePicker>
      </div>
    </div>
</template>
<script>
import themePicker from '../../views/ariticle/ThemePicker';
export default{
    data() {
        return{
            value1: true,
            value2: true,
            value3: true
        }
    },
    components:{
        themePicker
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