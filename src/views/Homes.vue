<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">小心笔记</div>
                <div>
                    <el-dropdown class="userInfo" @command="commandHandler">
                        <span class="el-dropdown-link"><i class="el-icon-user"></i>{{username}}<i class="el-icon-caret-bottom"/></span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="updatePwd">修改密码</el-dropdown-item>
                            <el-dropdown-item command="Install">设置</el-dropdown-item>
                            <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
        </el-container>
        <el-container>
            <el-aside width="200px">
                <el-menu :default-active="this.$route.path" :router="true" @open="handleOpen" @close="handleClose" unique-opened>
                    <el-menu-item :index="homes">
                        <template slot="title"><i class="el-icon-s-home"></i><span>主页</span></template>
                    </el-menu-item>

                    <el-submenu v-for="item in navList" :key="item.mid" :index="item.mid + ''">
                        <!-- 一级菜单 -->
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span>{{item.navname}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item v-for="subitem in item.children" :key="subitem.id" :index="subitem.path">
                            <template slot="title">
                                <i :class="subitem.icon"></i>
                                <span>{{subitem.navname}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
        
            <el-main>
                <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path=='/homes'">
                    <el-breadcrumb-item :to="{ path: '/homes' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item>控制台</el-breadcrumb-item>
                </el-breadcrumb>
                <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/homes'">
                    <el-container style="border: 1px solid #eee">
                        <el-header style="height: 360px">
                            <!--走马灯-->
                            <el-carousel :interval="5000" arrow="always" type="card" :height="bannerHeight + 'px'">
                                <el-carousel-item v-for="item in imagebox" :key="item.id">
                                    <img :src="item.img" ref="bannerHeight" :alt="item.title" @load="imgLoad" style="width: 100%"/>
                                </el-carousel-item>
                            </el-carousel>
                        </el-header>
                        <el-container>
                            <el-aside width="200px"></el-aside>
                            <el-main>

                            </el-main>
                        </el-container>
                    </el-container>
                </div>
                <router-view class="homeRouterView"></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
export default {
    name: "Homes",
        data() {
            return {
                // user: JSON.parse(window.sessionStorage.getItem("user"))
                navList:[],
                // 轮播图
                imagebox: [],
                bannerHeight: '',
                // homes路径
                homes:'/homes',
                // 右上角名字
                username:''
            }
        },
        created() {
            this.getMenuList();
            this.getUserName();
            this.getTopView();
        },
        mounted() {
            // this.getImgLoad();
        },
        methods: {
            // 左侧菜单列表
            getMenuList(){
                let username = window.sessionStorage.getItem('username');
                this.getRequest("/userLogin/menuList",{'username': username}).then((resp) => {
                    if (resp.state == 2000) {
                        this.navList = resp.data;
                    } else {
                        this.$Message.error(resp.message);
                    }
                });
            },
            // 获取右上角用户名
            getUserName(){
                this.username = window.sessionStorage.getItem('username');
            },
            // 加载顶部图
            getTopView(){
                this.getRequest("/notes/adpic/imageBox").then((resp) => {
                    if (resp.state == 2000) {
                        this.imagebox = resp.data;
                    } else {
                        this.$Message.error(resp.message);
                    }
                });
            }, 
            // 右上选项
            commandHandler(cmd) {
                if (cmd == 'logout') {
                    this.$confirm('此操作将注销登录, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        // this.getRequest("/logout");
                        window.sessionStorage.clear();
                        this.$router.replace("/login");
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消操作'
                        });
                    });
                } else if (cmd == 'updatePwd') {
                    this.$router.replace('/user/updatePwd');
                } else if (cmd == 'Install') {
                    this.$router.replace('/user/install');
                }
            },
            handleOpen(key, keyPath) {
                // console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                // console.log(key, keyPath);
            },
            imgLoad() {
                this.$nextTick(() => {
                    self.bannerHeight = this.$refs.bannerHeight != null ? this.$refs.bannerHeight[0].height / 2 : null;
                });
            },
            // getImgLoad(){
            //     var self=this;
            //     self.imgLoad();
            //     window.addEventListener(
            //         "resize",
            //         () => {
            //             self.bannerHeight = this.$refs.bannerHeight != null ? this.$refs.bannerHeight[0].height / 2 : null;
            //             self.imgLoad();
            //         },
            //         false
            //     );
            // }
        }
    }
</script>

<style>
    /* .homeRouterView {
        margin-top: 10px;
    } */

    .homeWelcome {
        text-align: center;
        font-size: 30px;
        font-family: 华文行楷;
        color: #409eff;
        padding-top: 50px;
    }

    .homeHeader {
        background-color: #409eff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0px 15px;
        box-sizing: border-box;
    }

    .homeHeader .title {
        font-size: 30px;
        font-family: 华文行楷;
        color: #ffffff
    }

    .homeHeader .userInfo {
        cursor: pointer;
    }

    .el-dropdown-link img {
        width: 48px;
        height: 48px;
        border-radius: 24px;
        margin-left: 8px;
    }

    .el-dropdown-link {
        display: flex;
        align-items: center;
        font-size:20px;
        color: white;
    }
    
</style>