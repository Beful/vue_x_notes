<template>
    <div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm loginContainer" align="center" >
            <span class="loginTitle">登录</span><br /><br />
            <el-form-item label="用户名" prop="username">
                <el-input v-model="ruleForm.username" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="ruleForm.password" autocomplete="off" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="submitLogin('ruleForm')">登录</el-button>
                <router-link to="/regeister">还没有账号，立即注册</router-link>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: "Login",
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入密码"));
            } else {
                callback();
            }
        };
        var validateUser = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入用户名"));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {
                password: '',
                username: '',
            },
            rules: {
                password: [{ validator: validatePass, trigger: "blur" }],
                username: [{ validator: validateUser, trigger: "blur" }],
            },
        };
    },
    mounted(){
        //绑定事件
        window.addEventListener('keydown',this.keyDown);
    },
    methods: {
        // 登录
        submitLogin(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) return;
                this.postRequest("/userLogin/submitLogin", this.ruleForm).then((resp) => {
                        if (resp.state != 2000) return this.$Message.error(resp.message);

                        console.log(resp.data);
                        this.$Message.success("登录成功！");
                        window.sessionStorage.setItem('token',resp.data.token);
                        window.sessionStorage.setItem('userId',resp.data.userId);
                        window.sessionStorage.setItem('username',this.ruleForm.username);
                        this.$router.push("/homes");
                });
            });
        },
        // Enter键登录
        keyDown(e){
            //如果是回车则执行登录方法
            if(e.keyCode == 13){
                this.submitLogin('ruleForm');
            }
        },
        // 销毁Enter登录
        destroyed(){
            window.removeEventListener('keydown',this.keyDown,false);
        }
    },
};
</script>

<style scoped>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.loginTitle {
  margin: 15px auto 20px auto;
  text-align: center;
  color: #505458;
}
</style>
