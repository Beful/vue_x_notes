<template>  
    <el-container>
        <el-main>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>下载</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-button style="float: right; padding: 3px 0" type="text">回到正文</el-button>
                </div>
                

                <el-link href="https://element.eleme.io" target="_blank">默认链接</el-link><br>
                <el-link v-for="up in upload" :key="up.id" :href="up" target="_blank" type="success"></el-link><br>

                <div id="main">
                    <mavon-editor v-model="value"/>
                </div>
                
            </el-card>
        </el-main>
    </el-container>
</template>
<script>

export default{
    data() {
        return {

        }
    },
    created() {

    },
    methods :{
        
    }
}
</script>
<style scoped>
/* Container 布局容器 */
.el-main {
    background-color: #E9EEF3;
    color: #333;
    width:80%;
    margin:0 auto 0 auto;/* 上右下左 */ 
    text-align:centor;
    padding:0 24% 0 23%;
}



/* 卡片样式 */  
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.box-card {
  width: 1200px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
</style>