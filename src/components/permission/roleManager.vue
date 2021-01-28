<template>  
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path == '/permission/roleManager'">
        <el-breadcrumb-item :to="{ path: '/homes' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      </el-breadcrumb><br>

      <el-row :gutter="20">
        <el-col :span="4">
            <el-input placeholder="请输入角色名称" v-model="queryInfo.query" class="input-with-select" clearable @clear="getRoleList">
                <el-button slot="append" icon="el-icon-search" @click="getRoleList"></el-button>
            </el-input>
        </el-col>
        <el-button type="success" plain  @click="insertRoleModel">新增</el-button>
      </el-row><br>
      <!-- 表格 -->
      <el-card>
        <!-- 表格 -->
        <el-table :data="RoleList" stripe style="width: 100%">
            <el-table-column type="index" prop="roleid" label="NO."></el-table-column>
            <el-table-column prop="rname" label="角色名称"></el-table-column>
            <el-table-column prop="rolecode" label="角色编号" sortable></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
            <el-table-column label="操作" min-width="90">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                        <el-button type="primary" icon="el-icon-edit" @click="editRole(scope.row.roleid)">编辑</el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                        <el-button type="danger" icon="el-icon-delete" @click="delPre(scope.row.roleid)">删除</el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
                        <el-button type="success" icon="el-icon-share" @click="matchPer(scope.row.roleid)">分配权限</el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="分配菜单" placement="top">
                        <el-button type="success" icon="el-icon-share" @click="matchMenu(scope.row.roleid)">分配菜单</el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页栏 -->
            <!--  current-page 当前页数  
                  page-size    每页显示条目个数 
                  total        总条目数 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
            :current-page.sync="queryInfo.pagenum" 
            :page-sizes="[5,10,20]" 
            :page-size="queryInfo.pageSize" 
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalPage">
            </el-pagination>
      </el-card>
      <!-- 新增修改表单 -->
      <el-dialog title="新增权限" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" @close="addDialogClosed">
            <el-form :model="RoleForm" status-icon :rules="rules" ref="RoleForm" label-width="100px">
                <el-form-item label="角色名称" prop="rname">
                    <el-input type="text" v-model="RoleForm.rname"></el-input>
                </el-form-item>
                <el-form-item label="角色编号" prop="rolecode">
                    <el-input type="text" v-model="RoleForm.rolecode"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model.number="RoleForm.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="insertRole" class="submit_save">提 交</el-button>
                <el-button type="primary" @click="updateRole" class="update_save">修 改</el-button>
            </span>
        </el-dialog>
        <!-- 角色分配权限表单 -->
        <el-dialog title="分配权限" :visible.sync="assignDialogVisible" width="30%" :before-close="assignHandleClose" @close="perDialogClosed">
            <el-tree :data="preList" show-checkbox node-key="pid" :props="RolePerProps"
                    :default-checked-keys="perDefKeys" ref="preList"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="assignDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="insertRolePre">提 交</el-button>
            </span>
        </el-dialog>
        <!-- 角色分配菜单表单 -->
        <el-dialog title="分配菜单" :visible.sync="menuDialogVisible" width="30%" :before-close="menuHandleClose" @close="menuDialogClosed">
            <el-tree default-expand-all :data="menuList" show-checkbox node-key="mid" :props="RoleMenuProps"
                    :default-checked-keys="menuDefKeys" ref="menuList"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="menuDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="insertRoleMenu">提 交</el-button>
            </span>
        </el-dialog>
    </div>  
</template>
<script>
import $ from 'jquery'
export default{
    data() {
        var validateRname = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入角色名称'));
            } else {
                callback();
            }
        };
        var validateRoleCode = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入角色编号'));
            } else {
                callback();
            }
        };
        return{
            RoleList:[],
            RoleForm: {
            rname: '',
            rolecode: '',
            remark: ''
            },
            dialogVisible: false,
            // 新增权限验证
            rules: {
                rname: [
                    { validator: validateRname, trigger: 'blur' }
                ],
                rolecode: [
                    { validator: validateRoleCode, trigger: 'blur' }
                ]
            },
            assignDialogVisible :false,
            preList: [],
            RolePerProps: {
                children: 'children',
                label: 'pname'
            },
            // 默认点击的选项
            perDefKeys:[],
            // 角色id
            role_id:'',
            menuDialogVisible:false,
            // 菜单list
            menuList:[],
            // 角色菜单
            RoleMenuProps: {
                children: 'children',
                label: 'navname'
            },
            // 菜单回显key
            menuDefKeys:[],
            // 权限id
            per_id:'',
            // 分页数据
            queryInfo:{
                query:'',
                // 当前页数
                pagenum:1,
                // 每页显示多少条
                pageSize:5
            },
            totalPage:0
        }
    },
    created() {
        this.getRoleList();
    },
    methods:{
        getRoleList(){
            this.getRequest("/notes/role/list",this.queryInfo).then((resp) => {
                if (resp.state == 2000) {
                    this.RoleList = resp.data.list;
                    this.totalPage = resp.data.totalCount;
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        // 点击新增
        insertRoleModel(){
            this.dialogVisible = true;
            $(".submit_save").show();
            $(".update_save").hide();
        },
        // dialog 关闭提醒
        handleClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        editRole(id){
            this.dialogVisible = true;
            $(".submit_save").hide();
            $(".update_save").show();
            // 回显内容
            this.getRequest("/notes/role/selOneRole", {'id':id}).then((resp) => {
                if (resp.state == 2000) {
                    this.RoleForm = resp.data;
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        delPre(id){
            this.deleteRequest("/notes/role/delOneRole/" + id).then((resp) => {
                if (resp.state == 2000) {
                    this.$Message.success("删除角色成功！");
                    this.getRoleList();
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        insertRole(){
            this.$refs["RoleForm"].validate((valid) => {
                if (valid) {
                    this.postRequest("/notes/role/insertOneRole", this.RoleForm).then((resp) => {
                        if (resp.state == 2000) {
                            this.$Message.success("添加角色成功！");
                            this.getRoleList();
                            this.dialogVisible = false
                        } else {
                            this.$Message.error(resp.message);
                        }
                    });
                }
            });
        },
        updateRole(){
            this.$refs["RoleForm"].validate((valid) => {
            if (valid) {
                this.postRequest("/notes/role/editOneRole", this.RoleForm).then((resp) => {
                    if (resp.state == 2000) {
                        this.$Message.success("修改角色成功！");
                        this.getRoleList();
                        this.dialogVisible = false
                    } else {
                        this.$Message.error(resp.message);
                    }
                });
            }
            });
        },
        // 分配权限
        matchPer(id){
            this.assignDialogVisible = true
            this.getRequest("/notes/permission/getPreList").then((resp) => {
                if (resp.state == 2000) {
                    this.preList = resp.data;
                    // 获取角色对应权限信息
                    this.getTreeDefKeys(id);
                    this.role_id = id;
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        getTreeDefKeys(id){
            this.getRequest("/notes/role/selPerByRoleId",{'id':id}).then((resp) => {
                if (resp.state == 2000) {
                    this.perDefKeys = resp.data;
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        insertRolePre(){
            const keys = [
                ...this.$refs.preList.getCheckedKeys(),
                ...this.$refs.preList.getHalfCheckedKeys()
            ]
            const idStr = keys.join(',')
            const data = {'pids':idStr,'roleId':this.role_id}
            this.postKeyValueRequest('/notes/role/insertRolePre',data).then((resp) => {
                if (resp.state == 2000) {
                    this.$Message.success("修改角色权限成功！");
                    this.assignDialogVisible=false;
                    this.getRoleList();
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        // 页数选择
        handleSizeChange(newsize) {
            this.queryInfo.pageSize = newsize;
            this.getRoleList();
        },
        // 当前页
        handleCurrentChange(newnum) {
            this.queryInfo.pagenum = newnum;
            this.getRoleList();
        },
        // 分配菜单
        matchMenu(id){
            this.getRequest("/notes/menu/getMenuList").then((resp) => {
                if (resp.state == 2000) {
                    this.menuList = resp.data;
                    // 获取用户对应角色信息
                    this.getMenuTreeDefKeys(id);
                    this.role_id = id;
                    this.menuDialogVisible = true
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        getMenuTreeDefKeys(id){
            this.getRequest("/notes/role/selMenuByRoleId",{'id':id}).then((resp) => {
                if (resp.state == 2000) {
                    this.menuDefKeys = resp.data;
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        insertRoleMenu(){
            const keys = [
                ...this.$refs.menuList.getCheckedKeys(),
                ...this.$refs.menuList.getHalfCheckedKeys()
            ]
            const idStr = keys.join(',')
            const data = {'mids':idStr,'roleId':this.role_id}
            this.postKeyValueRequest('/notes/role/insertRoleMenu',data).then((resp) => {
                if (resp.state == 2000) {
                    this.$Message.success("修改角色菜单成功！");
                    this.menuDialogVisible=false,
                    this.getRoleList();
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        assignHandleClose(done){
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        menuHandleClose(done){
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        // 监听关闭
        addDialogClosed(){
            this.$refs.RoleForm.resetFields();
        },
        perDialogClosed(){
            this.perDefKeys = [];
        },
        // 监听用户角色关闭
        menuDialogClosed(){
            this.menuDefKeys = [];
        }
    }
}
</script>
<style>
</style>