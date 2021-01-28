<template>  
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path == '/ariticle/comment'">
            <el-breadcrumb-item :to="{ path: '/homes' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb><br>

        <el-row :gutter="20">
            <el-col :span="4">
                <el-input placeholder="请输入文章标题" v-model="queryInfo.query" class="input-with-select" clearable @clear="getCommentList">
                    <el-button slot="append" icon="el-icon-search" @click="getCommentList"></el-button>
                </el-input>
            </el-col>
        </el-row><br>
        <!-- 表格 -->
        <el-card>
            <!-- 表格 -->
            <el-table :data="commentList" stripe style="width: 100%">
                <el-table-column type="index" prop="id" label="NO."></el-table-column>
                <el-table-column prop="articleTitle" label="文章标题" sortable></el-table-column>
                <el-table-column prop="userName" label="评论人"></el-table-column>
                <el-table-column prop="content" label="评论内容"></el-table-column>
                <el-table-column prop="praiseNum" label="点赞数"></el-table-column>
                <!-- <el-table-column label="操作" min-width="90">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <el-button type="primary" icon="el-icon-edit" @click="editComment(scope.row.roleid)">编辑</el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <el-button type="danger" icon="el-icon-delete" @click="delComment(scope.row.roleid)">删除</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column> -->
            </el-table>
            <!-- 分页栏 -->
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
export default{
    data() {
        return {
            commentList:[],
            // 分页数据
            queryInfo:{
                query:'',
                // 当前页数
                pagenum:1,
                // 每页显示多少条
                pageSize:10
            },
            totalPage:0
        }
    },
    created() {
        this.getCommentList()
    },
    methods :{
        getCommentList(){
            this.getRequest("/notes/comment/list",this.queryInfo).then((resp) => {
                if (resp.state == 2000) {
                    this.commentList = resp.data.list;
                    this.totalPage = resp.data.totalCount;
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        // 页数选择
        handleSizeChange(newsize) {
            this.queryInfo.pageSize = newsize;
            this.getCommentList();
        },
        // 当前页
        handleCurrentChange(newnum) {
            this.queryInfo.pagenum = newnum;
            this.getCommentList();
        },
    }
}
</script>
<style scoped>

</style>