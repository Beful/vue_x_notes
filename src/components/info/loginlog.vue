<template>  
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path == '/info/loginlog'">
            <el-breadcrumb-item :to="{ path: '/homes' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>登录日志</el-breadcrumb-item>
        </el-breadcrumb><br>

        <el-card>
            <!-- 表格 -->
            <el-table :data="logList" stripe style="width: 100%">
                <el-table-column type="index" prop="id" label="NO."></el-table-column>
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="ip" label="ip"></el-table-column>
                <el-table-column prop="createTime" label="时间"></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                 <el-table-column prop="content" label="内容"></el-table-column>
            </el-table>
            <!--  分页   -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
                :current-page.sync="queryInfo.pagenum" 
                :page-sizes="[10,20,100]" 
                :page-size="queryInfo.pageSize" 
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalPage">
            </el-pagination>
        </el-card>

    </div>  
</template>
<script>
import $ from 'jquery'
export default{
    data() {
        return {
            logList:[],
            // 分页数据
            queryInfo:{
                // 当前页数
                pagenum:1,
                // 每页显示多少条
                pageSize:10
            },
            totalPage:0
        }  
    },
    created() {
        this.getLogList();
    },
    methods:{
        getLogList(){
            this.getRequest("/notes/log/list",this.queryInfo).then((resp) => {
                if (resp.state == 2000) {
                    this.logList = resp.data.list;
                    this.totalPage = resp.data.totalCount;
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
         // 页数选择
        handleSizeChange(newsize) {
            this.queryInfo.pageSize = newsize;
            this.getLogList();
        },
        // 当前页
        handleCurrentChange(newnum) {
            this.queryInfo.pagenum = newnum;
            this.getLogList();
        },
    }
}
</script>
<style>
</style>