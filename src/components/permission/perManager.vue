<template>  
    <div>
        <!-- 标签页 -->
        <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path == '/permission/PerManager'">
            <el-breadcrumb-item :to="{ path: '/homes' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        </el-breadcrumb><br>
    
        <el-row>
            <el-button type="success" plain  @click="insertPreModel">新增</el-button>
        </el-row><br>
        <!-- 表格 -->
        <el-card>
            <!-- 表格 -->
            <el-table :data="preList" stripe style="width: 100%">
                <el-table-column type="index" prop="pid" label="NO."></el-table-column>
                <el-table-column prop="pname" label="权限名称"></el-table-column>
                <el-table-column prop="value" label="权限值"></el-table-column>
                <el-table-column prop="type" label="权限类型"></el-table-column>
                <el-table-column prop="url" label="权限路径"></el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column label="操作" min-width="90">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <el-button type="primary" icon="el-icon-edit" @click="editPre(scope.row.pid)">编辑</el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <el-button type="danger" icon="el-icon-delete" @click="delPre(scope.row.pid)">删除</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页栏 -->
            <div class="block">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 10,20]"
                        :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
                </el-pagination>
            </div>
        </el-card>
        <!-- 新增修改表单 -->
        <el-dialog title="新增权限" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" @close="addDialogClosed">
            <el-form :model="preForm" status-icon :rules="rules" ref="preForm" label-width="100px" class="demo-preForm">
                <el-form-item label="权限名称" prop="pname">
                    <el-input type="text" v-model="preForm.pname"></el-input>
                </el-form-item>
                <el-form-item label="权限路径" prop="url">
                    <el-input type="text" v-model="preForm.url"></el-input>
                </el-form-item>
                <el-form-item label="分类" prop="fid">
                    <el-select v-model="preForm.fid" placeholder="请选择">
                        <el-option v-for="item in fids" :key="item.value" :label="item.pname" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="insertPre" class="submit_save">提 交</el-button>
                <el-button type="primary" @click="updatePre" class="update_save">修 改</el-button>
            </span>
        </el-dialog>
    </div>  
</template>
<script>
import $ from 'jquery'
export default{
    data() {
         var validatePname = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入权限名称'));
            } else {
                callback();
            }
        };
         var validateDescription = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入权限描述'));
            } else {
                callback();
            }
        };
        return{
            // 权限列表
            preList:[],
            // 权限列表参数
            preForm: {
                id:'',
                pname: '',
                keyword: '',
                description: ''
            },
            queryInfo:{
                query:'',
                // 当前页数
                pagenum:1,
                // 每页显示多少条
                pageSize:5
            },
            totalPage:0,
            dialogVisible: false,
            // 新增权限验证
            rules: {
                pname: [
                    { validator: validatePname, trigger: 'blur' }
                ],
                description: [
                    { validator: validateDescription, trigger: 'blur' }
                ]
            },
            fids:[]
        }
    },
    created() {
        this.getPreList();
    },
    methods:{
        // 获取权限列表
        getPreList(){
            this.getRequest("/notes/permission/list",this.queryInfo).then((resp) => {
                if (resp.state == 2000) {
                    this.preList = resp.data.list;
                    this.totalPage = resp.data.totalCount;
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        // 页数选择
        handleSizeChange(newsize) {
            this.queryInfo.pageSize = newsize;
            this.getPreList();
        },
        // 当前页
        handleCurrentChange(newnum) {
            this.queryInfo.pagenum = newnum;
            this.getPreList();
        },
        // dialog 关闭提醒
        handleClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        // 监听关闭
        addDialogClosed(){
            this.$refs.preForm.resetFields();
        },
        // 插入权限内容
        insertPreModel(){
             this.dialogVisible = true;
             this.getSelFids();
             $(".submit_save").show();
             $(".update_save").hide();
        },
        insertPre(){
            this.$refs["preForm"].validate((valid) => {
                if (valid) {
                    this.postRequest("/notes/permission/insertOnePer", this.preForm).then((resp) => {
                        if (resp.state == 2000) {
                            this.$Message.success("添加权限成功！");
                            this.getPreList();
                            this.dialogVisible = false
                        } else {
                            this.$Message.error(resp.message);
                        }
                    });
                }
            });
        },
        // 编辑
        editPre(id){
            this.dialogVisible = true;
            $(".submit_save").hide();
            $(".update_save").show();
            // 回显内容
            this.getRequest("/notes/permission/selOnePer", {'id':id}).then((resp) => {
                if (resp.state == 2000) {
                    this.preForm = resp.data;
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        updatePre(){
            this.$refs["preForm"].validate((valid) => {
                if (valid) {
                    this.postRequest("/notes/permission/editOnePer", this.preForm).then((resp) => {
                        if (resp.state == 2000) {
                            this.$Message.success("修改权限成功！");
                            this.getPreList();
                            this.dialogVisible = false
                        } else {
                            this.$Message.error(resp.message);
                        }
                    });
                }
            });
        },
        // 删除
        delPre(id){
            this.deleteRequest("/notes/permission/delOnePer/" + id).then((resp) => {
                if (resp.state == 2000) {
                    this.$Message.success("删除权限成功！");
                    this.getPreList();
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        getSelFids(){
            this.getRequest("/notes/permission/getSelFids").then((resp) => {
                if (resp.state == 2000) {
                    this.fids = resp.data;
                } else {
                    this.$Message.error(resp.message);
                }
            });
        }
    }
}
</script>
<style>
</style>