<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path == '/user/userManager'">
      <el-breadcrumb-item :to="{ path: '/homes' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb><br>
    
    <el-row>
        <el-button type="success" plain  @click="insertUserModel">新增</el-button>
    </el-row><br>
    <!-- 表格 -->
    <el-card>
      <!-- 表格 -->
      <el-table :data="userList" stripe style="width: 100%">
          <el-table-column type="index" prop="userId" label="NO."></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="手机号"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0"
                        active-text="开启" inactive-text="关闭"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" sortable></el-table-column>
          <el-table-column prop="age" label="年龄" min-width="40" sortable></el-table-column>
          <el-table-column prop="gender" label="性别" min-width="40" sortable>
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.gender == 1">男</el-tag>
              <el-tag type="danger" v-else-if="scope.row.gender == 0">女</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="120">
              <template slot-scope="scope">
                  <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                      <el-button type="primary" icon="el-icon-edit" @click="editUser(scope.row.userId)">编辑</el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="删除" placement="top">
                      <el-button type="danger" icon="el-icon-delete" @click="delUser(scope.row.userId)">删除</el-button>
                  </el-tooltip>
                  <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
                      <el-button type="success" icon="el-icon-share" @click="matchRole(scope.row.userId)">分配角色</el-button>
                  </el-tooltip>
              </template>
          </el-table-column>
      </el-table>
    </el-card>
    <!-- 新增修改表单 -->
    <el-dialog title="新增用户" :visible.sync="dialogVisible" width="30%" :before-close="handleClose" @close="addDialogClosed">
        <el-form :model="userForm" status-icon :rules="rules" ref="userForm" label-width="100px">
            <el-form-item label="用户名" prop="username">
                <el-input type="text" v-model="userForm.username"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email" 
                :rules="[
                    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
                ]">
                <el-input type="text" v-model.number="userForm.email"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="userForm.mobile"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-switch v-model="userForm.status" :active-value="1" :inactive-value="0" active-text="开启" inactive-text="关闭"></el-switch>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
                <el-input v-model.number="userForm.age"></el-input>
            </el-form-item>
            <el-form-item label="性别" prop="gender">
                <el-switch v-model="userForm.gender" :active-value="1" :inactive-value="0" active-text="男" inactive-text="女"></el-switch>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="insertUser" class="submit_save">提 交</el-button>
            <el-button type="primary" @click="updateUser" class="update_save">修 改</el-button>
        </span>
    </el-dialog>
    <!-- 用户分配角色表单 -->
    <el-dialog title="分配角色" :visible.sync="assignDialogVisible" width="30%" :before-close="assignHandleClose" @close="assignDialogClosed">
        <el-tree :data="roleList" :props="treeProps" show-checkbox node-key="roleid"
                 :default-checked-keys="defKeys" ref="roleList"></el-tree>

        <span slot="footer" class="dialog-footer">
            <el-button @click="assignDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="insertUserRole">提 交</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>

import $ from 'jquery'
export default{
    data() {
      var validateUsername = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请输入用户名'));
        } else {
            callback();
        }
      };
      var validatemobile = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      };
      var validateAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 18) {
              callback(new Error('必须年满18岁'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      return{
        userList:[],
        userForm: {
          username:'',
          email: '',
          mobile: '',
          status: 1 ? false : true,
          age: '',
          gender: ''
        },
        dialogVisible: false,
        // 新增菜单验证
        rules: {
            username: [
                { validator: validateUsername, trigger: 'blur' }
            ],
            mobile: [
                { validator: validatemobile, trigger: 'blur' }
            ],
            age: [
                { validator: validateAge, trigger: 'blur' }
            ],
        },
        assignDialogVisible :false,
        // 权限列表
        roleList: [],
        // 树形控件
        treeProps: {
          children: 'children',
          label: 'rname'
        },
        // 默认点击的选项
        defKeys:[],
        user_id:''
      }
    },
    created() {
        this.getUserList();
    },
    methods:{
      getUserList(){
        this.getRequest("/notes/user/list").then((resp) => {
          if (resp.state == 2000) {
              this.userList = resp.data;
          } else {
              this.$Message.success(resp.message);
          }
        });
      },
      insertUserModel(){
        this.dialogVisible = true;
        $(".submit_save").show();
        $(".update_save").hide();
      },
      insertUser(){
        this.$refs["userForm"].validate((valid) => {
            if (valid) {
                this.postRequest("/notes/user/insertOneUser", this.userForm).then((resp) => {
                    if (resp.state == 2000) {
                        this.$Message.success("添加用户成功！");
                        this.getUserList();
                        this.dialogVisible = false
                    } else {
                        this.$Message.error(resp.message);
                    }
                });
            }
        });
      },
      editUser(id){
        this.dialogVisible = true;
        $(".submit_save").hide();
        $(".update_save").show();
        // 回显内容
        this.getRequest("/notes/user/selOneUser", {'id':id}).then((resp) => {
            if (resp.state == 2000) {
                this.userForm = resp.data;
            } else {
                this.$Message.error(resp.message);
            }
        });
      },
      updateUser(){
        this.$refs["userForm"].validate((valid) => {
            if (valid) {
                this.postRequest("/notes/user/editOneUser", this.userForm).then((resp) => {
                    if (resp.state == 2000) {
                        this.$Message.success("修改用户成功！");
                        this.getUserList();
                        this.dialogVisible = false
                    } else {
                        this.$Message.error(resp.message);
                    }
                });
            }
        });
      },
      delUser(id){
        this.deleteRequest("/notes/user/delOneUser/" + id).then((resp) => {
            if (resp.state == 2000) {
                this.$Message.success("删除用户成功！");
                this.getUserList();
            } else {
                this.$Message.error(resp.message);
            }
        });
      },
      matchRole(id){
        this.assignDialogVisible = true
        this.getRequest("/notes/user/getUserRoleList").then((resp) => {
            if (resp.state == 2000) {
                this.roleList = resp.data;
                // 获取用户对应角色信息
                this.getTreeDefKeys(id);
                this.user_id = id;
            } else {
                this.$Message.error(resp.message);
            }
        });
      },
      getTreeDefKeys(id){
        this.getRequest("/notes/user/selRoleByUserId",{'id':id}).then((resp) => {
            if (resp.state == 2000) {
                this.defKeys = resp.data;
            } else {
                this.$Message.error(resp.message);
            }
        });
      },
      // 添加用户角色
      insertUserRole(){
        const keys = [
          ...this.$refs.roleList.getCheckedKeys(),
          ...this.$refs.roleList.getHalfCheckedKeys()
        ]
        const idStr = keys.join(',')
        const data = {'rids':idStr,'userId':this.user_id}
        this.postKeyValueRequest('/notes/user/insertUserRole',data).then((resp) => {
            if (resp.state == 2000) {
                this.$Message.success("修改用户角色成功！");
                this.assignDialogVisible=false,
                this.getUserList();
            } else {
                this.$Message.error(resp.message);
            }
        });
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
          this.$refs.userForm.resetFields();
      },
      assignHandleClose(done){
          this.$confirm('确认关闭？')
          .then(_ => {
              done();
          })
          .catch(_ => {});
      },
      // 监听用户角色关闭
      assignDialogClosed(){
        this.defKeys = [];
      },
      
    }
}
</script>
<style>
</style>