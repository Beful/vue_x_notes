<template>  
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path == '/ariticle/label'">
            <el-breadcrumb-item :to="{ path: '/homes' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>标签管理</el-breadcrumb-item>
        </el-breadcrumb><br>

        <el-row :gutter="20">
            <el-col :span="4">
                <el-input placeholder="请输入标签名称" v-model="queryInfo.query" class="input-with-select" clearable @clear="getLabelList">
                    <el-button slot="append" icon="el-icon-search" @click="getLabelList"></el-button>
                </el-input>
            </el-col>
            <el-button type="success" plain  @click="addLabel">新增</el-button>
        </el-row><br>
        <!-- 表格 -->
        <el-card>
            <!-- 表格 -->
            <el-table :data="labelList" stripe style="width: 100%">
                <el-table-column type="index" prop="id" label="NO."></el-table-column>
                <el-table-column prop="name" label="标签名称"></el-table-column>
                <el-table-column prop="type" label="类型" sortable></el-table-column>
                <el-table-column prop="size" label="大小"></el-table-column>
                <el-table-column prop="color" label="背景色"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column prop="isUse" label="是否使用">
                     <template slot-scope="scope">
                        {{scope.row.isUse == 1 ? '使用' : '未使用' }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="90">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <el-button type="primary" icon="el-icon-edit" @click="editLabel(scope.row.id)">编辑</el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <el-button type="danger" icon="el-icon-delete" @click="delLabel(scope.row.id)">删除</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
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
        <!-- 新增修改表单 -->
        <el-dialog title="新增标签" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" @close="addDialogClosed">
            <el-form :model="LabelForm" status-icon ref="LabelForm" label-width="100px">
                <el-form-item label="标签名称" prop="name">
                    <el-input type="text" v-model="LabelForm.name"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-select v-model="LabelForm.type" placeholder="请选择类型">
                        <el-option v-for="item in types" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="大小" prop="size">
                    <el-select v-model="LabelForm.size" placeholder="请选择大小">
                        <el-option v-for="item in sizes" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="背景色" prop="color">
                     <el-color-picker v-model="LabelForm.color"></el-color-picker>
                </el-form-item>
                <el-form-item label="是否使用" prop="isUse">
                    <el-switch v-model="LabelForm.isUse" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="insertLabel" class="submit_save">提 交</el-button>
                <el-button type="primary" @click="updateLabel" class="update_save">修 改</el-button>
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
            labelList:[],
            // 分页数据
            queryInfo:{
                query:'',
                // 当前页数
                pagenum:1,
                // 每页显示多少条
                pageSize:10
            },
            totalPage:0,
            LabelForm:{
                name:'',
                type:'',
                size:'',
                color:'',
                isUse:''
            },
            types:[
                {
                    name:'success',
                    value:'success'
                },{
                    name:'info',
                    value:'info'
                },{
                    name:'warning',
                    value:'warning'
                },{
                    name:'danger',
                    value:'danger'
                }
            ],
            sizes:[
                {
                    name:'medium',
                    value:'medium'
                },{
                    name:'small',
                    value:'small'
                },{
                    name:'mini',
                    value:'mini'
                }
            ]
        }
    },
    created() {
        this.getLabelList()
    },
    methods :{
        getLabelList(){
            this.getRequest("/notes/tag/list",this.queryInfo).then((resp) => {
                if (resp.state == 2000) {
                    this.labelList = resp.data.list;
                    this.totalPage = resp.data.totalCount;
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        // 点击新增
        addLabel(){
            this.dialogVisible = true
             $(".submit_save").show();
             $(".update_save").hide();
        },
        // 编辑
        editLabel(id){
            this.dialogVisible = true;
            $(".submit_save").hide();
            $(".update_save").show();
            // 回显内容
            this.getRequest("/notes/tag/info/" + id ).then((resp) => {
                if (resp.state == 2000) {
                    this.LabelForm = resp.data;
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        // 删除
        delLabel(id){
            this.deleteRequest("/notes/tag/delete/" + id).then((resp) => {
                if (resp.state == 2000) {
                    this.$Message.success("删除标签成功！");
                    this.getLabelList();
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        insertLabel(){
            this.postRequest("/notes/tag/save", this.LabelForm).then((resp) => {
                        if (resp.state == 2000) {
                            this.$Message.success("添加标签成功！");
                            this.getLabelList();
                            this.dialogVisible = false
                        } else {
                            this.$Message.error(resp.message);
                        }
                    });
        },
        updateLabel(){
            this.postRequest("/notes/tag/update", this.LabelForm).then((resp) => {
                        if (resp.state == 2000) {
                            this.$Message.success("添加标签成功！");
                            this.getLabelList();
                            this.dialogVisible = false
                        } else {
                            this.$Message.error(resp.message);
                        }
                    });
        },
        // 监听关闭事件
        addDialogClosed(){
             this.$refs.LabelForm.resetFields();
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
            this.getLabelList();
        },
        // 当前页
        handleCurrentChange(newnum) {
            this.queryInfo.pagenum = newnum;
            this.getLabelList();
        },
    }
}
</script>
<style scoped>

</style>