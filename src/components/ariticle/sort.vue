<template>  
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path == '/ariticle/sort'">
            <el-breadcrumb-item :to="{ path: '/homes' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>分类管理</el-breadcrumb-item>
        </el-breadcrumb><br>

        <el-row :gutter="20">
            <el-col :span="4">
                <el-input placeholder="请输入分类名称" v-model="queryInfo.query" class="input-with-select" clearable @clear="getSortList">
                    <el-button slot="append" icon="el-icon-search" @click="getSortList"></el-button>
                </el-input>
            </el-col>
            <el-button type="success" plain  @click="addSort">新增</el-button>
        </el-row><br>
        <!-- 表格 -->
        <el-card>
            <el-table :data="sortList" stripe style="width: 100%">
                <el-table-column type="index" prop="id" label="NO."></el-table-column>
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column prop="description" label="描述" sortable></el-table-column>
                <el-table-column prop="keywords" label="关键词"></el-table-column>
                <el-table-column prop="type" label="类型"></el-table-column>
                <el-table-column label="操作" min-width="90">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <el-button type="primary" icon="el-icon-edit" @click="editSort(scope.row.id)">编辑</el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <el-button type="danger" icon="el-icon-delete" @click="delSort(scope.row.id)">删除</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
            :current-page.sync="queryInfo.pagenum" 
            :page-sizes="[5,10,20]" 
            :page-size="queryInfo.pageSize" 
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalPage">
            </el-pagination>
        </el-card>

        <!-- 新增修改表单 -->
        <el-dialog title="新增分类" :visible.sync="dialogVisible" width="60%" :before-close="handleClose" @close="addDialogClosed">
            <el-form :model="sortForm" status-icon ref="sortForm" label-width="100px">
                <el-form-item label="分类名称" prop="name">
                    <el-input type="text" v-model="sortForm.name"></el-input>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                    <el-input type="text" v-model="sortForm.description"></el-input>
                </el-form-item>
                <el-form-item label="关键词" prop="keywords">
                    <el-input v-model="sortForm.keywords"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-input v-model="sortForm.type"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="insertSort" class="submit_save">提 交</el-button>
                <el-button type="primary" @click="updateSort" class="update_save">修 改</el-button>
            </span>
        </el-dialog>

    </div>  
</template>
<script>
import $ from 'jquery'
export default{
    data() {
        return {
            dialogVisible:false,
            sortList:[],
            // 分页数据
            queryInfo:{
                query:'',
                // 当前页数
                pagenum:1,
                // 每页显示多少条
                pageSize:5
            },
            totalPage:0,
            sortForm:{
                keywords:'',
                description:'',
                name:'',
                type:''
            },
        }
    },
    created() {
        this.getSortList()
    },
    methods :{
        getSortList(){
            this.getRequest("/notes/sort/list",this.queryInfo).then((resp) => {
                if (resp.state == 2000) {
                    this.sortList = resp.data.list;
                    this.totalPage = resp.data.totalCount;
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        // 点击新增
        addSort(){
            this.dialogVisible = true
            $(".submit_save").show();
            $(".update_save").hide();
        },
        // 编辑
        editSort(id){
            this.dialogVisible = true;
            $(".submit_save").hide();
            $(".update_save").show();
            // 回显内容
            this.getRequest("/notes/sort/info/" + id).then((resp) => {
                if (resp.state == 2000) {
                    this.sortForm = resp.data;
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        // 删除
        delSort(id){
            this.deleteRequest("/notes/sort/delete/" + id).then((resp) => {
                if (resp.state == 2000) {
                    this.$Message.success("删除分类成功！");
                    this.getSortList();
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        insertSort(){
            console.log(this.sortForm);
            this.postRequest("/notes/sort/save", this.sortForm).then((resp) => {
                        if (resp.state == 2000) {
                            this.$Message.success("添加分类成功！");
                            this.getSortList();
                            this.dialogVisible = false
                        } else {
                            this.$Message.error(resp.message);
                        }
                    });
        },
        updateSort(){
            this.postRequest("/notes/sort/update", this.sortForm).then((resp) => {
                        if (resp.state == 2000) {
                            this.$Message.success("添加分类成功！");
                            this.getSortList();
                            this.dialogVisible = false
                        } else {
                            this.$Message.error(resp.message);
                        }
                    });
        },
        // 监听关闭事件
        addDialogClosed(){
             this.$refs.sortForm.resetFields();
        },
        // dialog 关闭提醒
        handleClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        // 页数选择
        handleSizeChange(newsize) {
            this.queryInfo.pageSize = newsize;
            this.getSortList();
        },
        // 当前页
        handleCurrentChange(newnum) {
            this.queryInfo.pagenum = newnum;
            this.getSortList();
        },
    }
}
</script>
<style scoped>

</style>