<template>  
    <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path == '/permission/menuManager'">
      <el-breadcrumb-item :to="{ path: '/homes' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb><br>
    
    <el-row :gutter="20">
        <el-col :span="4">
            <el-input placeholder="请输入菜单名称" v-model="queryInfo.query" class="input-with-select" clearable @clear="getMenuList">
                <el-button slot="append" icon="el-icon-search" @click="getMenuList"></el-button>
            </el-input>
        </el-col>
        <el-button type="success" plain  @click="insertMenuModel">新增</el-button>
    </el-row><br>
    <!-- 表格 -->
    <el-card>
        <!-- 表格 -->
        <el-table :data="menuList" stripe style="width: 100%">
            <el-table-column type="index" prop="mid" label="NO."></el-table-column>
            <el-table-column prop="navname" label="菜单名称"></el-table-column>
            <el-table-column prop="mcode" label="菜单编号" sortable></el-table-column>
            <el-table-column prop="path" label="路径" sortable></el-table-column>
            <el-table-column prop="hidden" label="是否显示">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.hidden" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="fathernode" label="父节点" sortable></el-table-column>
            <el-table-column prop="orders" label="顺序" sortable></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column prop="icon" label="标签"></el-table-column>
            <el-table-column prop="component" label="组件"></el-table-column>
            <el-table-column label="操作" min-width="90">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                        <el-button type="primary" icon="el-icon-edit" @click="editMenu(scope.row.mid)">编辑</el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                        <el-button type="danger" icon="el-icon-delete" @click="delMenu(scope.row.mid)">删除</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页栏 -->
        <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 3, 5, 10]"
                    :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
            </el-pagination>
        </div>
    </el-card>
    <!-- 新增修改表单 -->
    <el-dialog title="新增菜单" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" @close="addDialogClosed">
        <el-form :model="menuForm" status-icon :rules="rules" ref="menuForm" label-width="100px">
            <el-form-item label="菜单名称" prop="navname">
                <el-input type="text" v-model="menuForm.navname"></el-input>
            </el-form-item>
            <el-form-item label="菜单编号" prop="mcode">
                <el-input type="text" v-model="menuForm.mcode"></el-input>
            </el-form-item>
            <el-form-item label="路径" prop="path">
                <el-input v-model="menuForm.path"></el-input>
            </el-form-item>
            <el-form-item label="是否显示" prop="hidden">
                <el-switch v-model="menuForm.hidden" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item label="父节点" prop="fathernode">
                <el-input v-model.number="menuForm.fathernode"></el-input>
            </el-form-item>
            <el-form-item label="顺序" prop="orders">
                <el-input v-model.number="menuForm.orders"></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
                <el-input v-model="menuForm.remark"></el-input>
            </el-form-item>
            <el-form-item label="标签" prop="icon">
                <el-input v-model="menuForm.icon"></el-input>
            </el-form-item>
            <el-form-item label="组件" prop="component">
                <el-input v-model="menuForm.component"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="insertMenu" class="submit_save">提 交</el-button>
            <el-button type="primary" @click="updateMenu" class="update_save">修 改</el-button>
        </span>
    </el-dialog>

  </div>  
</template>
<script>
import $ from 'jquery';
export default{
    data() {
        var validateNavname = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入菜单名称'));
            } else {
                callback();
            }
        };
        var validateMcode = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入菜单编号'));
            } else {
                callback();
            }
        };
        var validatPpath = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入菜单路径'));
            } else {
                callback();
            }
        };
        var validateFatherNode = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入父节点编号'));
            } else {
                callback();
            }
        };
        return{
            menuList:[],
            menuForm: {
                navname:'',
                mcode: '',
                path: '',
                hidden: 1 ? false : true,
                fathernode: '',
                orders: '',
                remark: '',
                icon: '',
                component: '',
            },
            queryInfo:{
                query:'',
                // 当前页数
                pagenum:1,
                // 每页显示多少条
                pageSize:10
            },
            totalPage:0,
            dialogVisible: false,
            // 新增菜单验证
            rules: {
                navname: [
                    { validator: validateNavname, trigger: 'blur' }
                ],
                mcode: [
                    { validator: validateMcode, trigger: 'blur' }
                ],
                path: [
                    { validator: validatPpath, trigger: 'blur' }
                ],
                fatherNode: [
                    { validator: validateFatherNode, trigger: 'blur' }
                ]
            },
        }
    },
    created() {
        this.getMenuList();
    },
    methods:{
        // 获取菜单列表
        getMenuList(){
            this.getRequest("/notes/menu/list",this.queryInfo).then((resp) => {
                if (resp.state == 2000) {
                    this.menuList = resp.data.list;
                    this.totalPage = resp.data.totalCount;
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        // 页数选择
        handleSizeChange(newsize) {
            // console.log(`每页 ${val} 条`);
            this.queryInfo.pageSize = newsize;
            this.getMenuList();
        },
        // 当前页
        handleCurrentChange(newnum) {
            // console.log(`当前页: ${val}`);
            this.queryInfo.pagenum = newnum;
            this.getMenuList();
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
            this.$refs.menuForm.resetFields();
        },
        insertMenuModel(){
            this.dialogVisible = true;
            $(".submit_save").show();
            $(".update_save").hide();
        },
        insertMenu(){
            this.$refs["menuForm"].validate((valid) => {
                if (valid) {
                    this.postRequest("/notes/menu/insertOneMenu", this.menuForm).then((resp) => {
                        if (resp.state == 2000) {
                            this.$Message.success("添加菜单成功！");
                            this.getMenuList();
                            this.dialogVisible = false
                        } else {
                            this.$Message.error(resp.message);
                        }
                    });
                }
            });
        },
        updateMenu(){
            this.$refs["menuForm"].validate((valid) => {
                if (valid) {
                    this.postRequest("/notes/menu/editOneMenu", this.menuForm).then((resp) => {
                        if (resp.state == 2000) {
                            this.$Message.success("修改菜单成功！");
                            this.getMenuList();
                            this.dialogVisible = false
                        } else {
                            this.$Message.error(resp.message);
                        }
                    });
                }
            });
        },
        editMenu(id){
            this.dialogVisible = true;
            $(".submit_save").hide();
            $(".update_save").show();
            // 回显内容
            this.getRequest("/notes/menu/selOneMenu", {'id':id}).then((resp) => {
                if (resp.state == 2000) {
                    this.menuForm = resp.data;
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        delMenu(id){
            this.deleteRequest("/notes/menu/delOneMenu/" + id).then((resp) => {
                if (resp.state == 2000) {
                    this.$Message.success("删除菜单成功！");
                    this.getMenuList();
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