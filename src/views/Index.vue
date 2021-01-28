<template>
    <div class="index-container">
        <el-container>
            <el-header class="index-header">
                <el-row>
                    <el-col :span="12"><div class="grid-content bg-purple">
                        <!-- 标签 -->
                        <span v-for="(item,index) in headers" :key="item.id + index">
                            <router-link type="primary" :underline="false" target="_blank" :to="{path: item.url}">
                                <el-link :underline="false">
                                    <i :class="item.icon" /> {{ item.title }} &nbsp;&nbsp;
                                </el-link>
                            </router-link>
                        </span>
                        </div>
                    </el-col>
                    <el-col :span="8"><div class="grid-content bg-purple">
                        <div style="width:60px;display:inline">
                            <!-- 标签 -->
                            <el-tag size="medium" effect="plain" style="margin-right:10px;font-size:14px">
                                <i icon="el-icon-mobile-phone"></i>下载app
                            </el-tag> 

                            <!-- 搜索框 -->
                            <el-input placeholder="请输入要查找的内容" v-model="search" style="width:350px">
                                <el-button slot="append" icon="el-icon-search"></el-button>
                            </el-input>
                        </div>

                        <!-- 未注册登录 -->
                        <div class="nologin" style="display:none;margin-left:30px">
                            <el-button type="primary" icon="el-icon-user-solid" @click="login">登录</el-button>
                            <el-button type="primary" icon="el-icon-user-solid" @click="regeister">注册</el-button>
                        </div>
                        <!-- 已登录 -->
                        <div class="login" style="display:none;margin-left:30px">
                            <el-dropdown @command="commandHandler">
                                    <el-avatar icon="el-icon-user-solid"></el-avatar>{{username}}
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="updatePwd">修改密码</el-dropdown-item>
                                    <el-dropdown-item command="logout" divided>注销登录</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                    </div>
                    </el-col>
                    <el-col :span="4"></el-col>
                </el-row>
            </el-header>
            <el-container>
                <el-main>
                        <!--走马灯-->
                        <el-carousel  trigger="click"  :height="bannerHeight + 'px'">
                            <el-carousel-item v-for="item in imagebox" :key="item.id">
                                <img :src="item.img" ref="bannerHeight" :alt="item.title" @load="imgLoad" style="width: 100%"/>
                            </el-carousel-item>
                        </el-carousel>
                        <!-- 1部分 -->
                        <el-row>
                            <!-- // 个人、网站、面试题介绍 -->
                            <el-col :span="6">
                                <el-card class="main-header-1">
                                    <div >
                                        <h4 style="color:green">个人介绍 </h4> <br>
                                        <span style="display:block;margin-top:-8px"><i class="fa fa-weixin fa-fw"></i>微信公众号：大玉小鑫</span><br>
                                        <span style="display:block;margin-top:-8px"><i class="fa fa-wechat fa-fw"></i>微信：xin_zai_zai</span><br>
                                        <span style="display:block;margin-top:-8px"><i class="fa fa-bookmark-o fa-fw"></i>CSDN：小心仔</span><br>
                                        <span style="display:block;margin-top:-8px"><i class="fa fa-git fa-fw"></i>Gitee：小心仔</span><br>
                                        <span style="display:block;margin-top:-8px"><i class="fa fa-github fa-fw"></i>Github：Beful</span>
                                    </div>
                                </el-card>
                            </el-col>
                            <el-col :span="12" >
                                <el-card class="main-header-3">
                                    <div>
                                        <h4 style="color:green">网站技术点介绍 </h4><br>
                                        <span style="display:block;margin-top:-8px;color:green"><i class="fa fa-stack-overflow fa-fw"></i>后端技术：Redis Nosql缓存数据库、Mysql 数据库、Minio 对象存储服务</span><br>
                                        <span style="display:block;margin-top:-8px;color:orange"><i class="fa fa-stack-overflow fa-fw"></i>后端框架：SpringBoot、SpringMVC、Mybatis-Plus、Hutool工具类、</span><br>
                                        <span style="display:block;margin-top:-8px"><i class="fa fa-stack-overflow fa-fw"></i>前端技术及框架：Vue、Vuex脚手架、Webpack打包、element-ui、echars图形、wangEditor富文本、axios、v-viewer 图片展示等</span>
                                       <br><span style="color:red">待完成：mail 邮箱回填，JustAuth实现第三方登录，聊天室</span>
                                    </div>
                                </el-card>
                            </el-col>
                            <!-- 轮播图 -->
                            <el-col :span="6">
                                <el-card class="main-header-2">
                                    <el-carousel height="200px">
                                        <el-carousel-item v-for="(item,index) in adpicList" :key="item.id + index">
                                            <img :src="item.img" ref="bannerHeight" :alt="item.title" style="width: 100%"/>
                                        </el-carousel-item>
                                    </el-carousel>
                                </el-card>
                            </el-col>
                        </el-row>
                        <!-- 2部分 -->
                        <el-row>
                            <!--     **********************  文章区 Start  *****************      -->
                            <el-card class="main-main">
                                <div slot="header" class="clearfix">
                                    <span>文章列表</span>
                                    <el-button style="float: right; padding: 3px 0" type="text">更多></el-button>
                                </div>

                                <div v-infinite-scroll="load" infinite-scroll-disabled="disabled">
                                    <div v-for="(item,index) in ariticleList" :key="item.id + item.userId + item.createTime + index">
                                        <router-link type="primary" :underline="false" target="_blank" :to="{path:'/ariticle/details/' + item.userId  + '/' + item.id}">
                                            <el-row :gutter="20">
                                                <el-col :span="20">
                                                    <div class="grid-content bg-purple">
                                                        <el-link :href="item.href" :underline="false" type="success" target="_blank">
                                                            {{ item.author }}
                                                        </el-link>
                                                        
                                                        <span style="margin:0 10px 0 10px" v-if="item.type == 0"><el-tag type="warning" style="margin-top:10px">转载 </el-tag><span style="margin:10px 0 0 10px;"></span></span>
                                                        <span style="margin:0 10px 0 10px" v-else-if="item.type == 1"><el-tag type="success" style="margin-top:10px">原文</el-tag></span>
                                                        <span style="margin:0 10px 0 10px" v-else><el-tag type="danger" style="margin-top:10px">翻译</el-tag><span style="margin:10px 0 0 10px"></span></span>

                                                        <el-link class="main-main-title" :href="item.href" :underline="false" target="_blank">
                                                            {{ item.title }}
                                                        </el-link>
                                                    </div>
                                                </el-col>
                                                <el-col :span="4">
                                                    <div class="grid-content bg-purple">
                                                        <div class="main-main-datetime">
                                                            {{ item.publishTime }}
                                                        </div>
                                                    </div>
                                                </el-col>
                                            </el-row>
                                            <div class="main-main-content">
                                                <span v-html="item.summary"></span>
                                            </div>
                                            <div>
                                                <el-button :type="subItem.type" plain round icon="el-icon-message" :key="subItem.id + subItem.createTime" v-for="subItem in item.sortList">
                                                    {{ subItem.name }}
                                                </el-button>
                                                <el-tag :key="subItem.id + item.id" :type='subItem.type' :size="subItem.size" v-for="subItem in item.tagList" :disable-transitions="false" class="main-main-tag">
                                                    {{ subItem.name }}
                                                </el-tag>
                                            </div>
                                        </router-link>
                                        <el-divider></el-divider>
                                    </div>
                                    <p v-if="loading">加载中...</p>
                                    <p v-if="noMore">没有更多了</p>
                                </div>
                            </el-card>
                            <!--     **********************  文章区 End  *****************      -->
                            <div>
                                <el-card class="main-right">
                                    <div slot="header" class="clearfix">
                                        <span>热门文章排行</span>
                                        <el-button style="float: right; padding: 3px 0" type="text">查看更多></el-button>
                                    </div>
                                    <div style="padding: 14px;" v-for="(item,index) in popularArticleList" :key="item.id">
                                        <router-link type="primary" :underline="false" target="_blank" :to="{path:'/ariticle/details/' + item.userId  + '/' + item.id}">
                                            <el-link :href="item.href" :underline="false" target="_blank">
                                                <span style="font-size:15px"><i style="color:red" class="fa fa-fire fa-fw"/> {{ index + 1 }} 、 {{item.title}}</span>
                                            </el-link>
                                        </router-link>
                                    </div>
                                </el-card>
                                <el-card class="main-right">
                                    <div slot="header" class="clearfix">
                                        <span>知识点真讲</span>
                                        <el-button style="float: right; padding: 3px 0" type="text">查看更多></el-button>
                                    </div>
                                    <div style="padding: 14px;" v-for="(item,index) in knowLeageList" :key="item.id">
                                        <router-link type="primary" :underline="false" target="_blank" :to="{path:'/ariticle/details/' + item.userId  + '/' + item.id}">
                                            <el-link :href="item.href" :underline="false" target="_blank">
                                                <span style="font-size:15px;"> {{ index + 1 }} 、 {{item.title}}</span>
                                            </el-link>
                                        </router-link>
                                    </div>
                                </el-card>
                            </div>
                        </el-row>
                </el-main>
             </el-container>
        </el-container>
    </div>
</template>
<script>
import $ from 'jquery';
export default {
    name: "Index",
    data() {
        return {
            // 文章下拉循环列表
            ariticleList:[],
            // 热点文章列表
            popularArticleList:[],
            // 知识点列表
            knowLeageList:[],
            // 轮播图列表
            adpicList:[],
            // 用户名
            username:'',
            // 搜索内容
            search:'',
            // 是否加载
            loading: false,
            // 分页数据
            queryInfo: {
                pagenum:1,
                pageSize:10
            },
            totalPage:'',
            // 轮播图
            imagebox:[],
            bannerHeight: '',
            // 顶层标签
            headers:[
                {
                    id:'1',
                    title:'发表文章',
                    icon:'el-icon-s-platform',
                    url:'/header/publish'
                },{
                    id:'4',
                    title:'聊天室',
                    icon:'fa fa-ioxhost fa-fw',
                    url:'/header/chatroom'
                },{
                    id:'5',
                    title:'商店',
                    icon:'fa fa-shopping-basket fa-fw',
                    url:'/'
                },{
                    id:'6',
                    title:'下载',
                    icon:'el-icon-download',
                    url:'/header/upload'
                },{
                    id:'8',
                    title:'留言板',
                    icon:'el-icon-notebook-2',
                    url:'/header/board'
                }
            ]
            
        }
    },
    computed: {
      noMore () {
        //当起始页数大于总页数时停止加载
        return this.queryInfo.pagenum > this.totalPage - 1;
      },
      disabled () {
        return this.loading || this.noMore
      }
    },
    created() {
        let self = this;
        self.getAriticleList();
        window.onscroll = function(){
                var scrollTop = document.documentElement.scrollTop||document.body.scrollTop;
                var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                var scrollHeight = document.documentElement.scrollHeight||document.body.scrollHeight;
                if(scrollTop + windowHeight + 1 >= scrollHeight){
                    self.queryInfo.pagenum ++;
                    self.getAriticleList();
                }   
            }
    },
    mounted() {
        this.loginUser();
        this.getTopView();
    },
    methods: {
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
        imgLoad() {
                this.$nextTick(() => {
                    self.bannerHeight = this.$refs.bannerHeight != null ? this.$refs.bannerHeight[0].height / 2 : null;
                });
        },
        load () {
            if(this.loading){
                getAriticleList()
            }
        },
        // 头像
        loginUser(){
            $('.login').hide();
            $('.nologin').hide();
            this.username = window.sessionStorage.getItem('username');
            let userId = window.sessionStorage.getItem('userId');
            console.log(this.username,userId);
            if (userId == null || this.username == null){ 
                $('.nologin').css('display','inline')
            } else {
                $('.login').css('display','inline');
            }
        },
        getAriticleList(){
            // 加载文章列表
            this.getRequest("/notes/ariticle/list",this.queryInfo).then((resp) => {
                if (resp.state == 2000) {
                    console.log(resp.data);
                    this.loading = true;
                    this.totalPage = resp.data.totalPage;
                    this.ariticleList = this.ariticleList.concat(resp.data.list);
                    this.loading = false;
                } else {
                    this.$Message.error(resp.message);
                }
            });

            // 加载热门文章
            this.getRequest("/ariticle/details/popularArticle").then((resp) => {
                if (resp.state == 2000) {
                    this.popularArticleList = resp.data;
                } else {
                    this.$Message.error(resp.message);
                }
            });

             // 加载知识点讲解列表
            this.getRequest("/ariticle/details/knowLearn").then((resp) => {
                if (resp.state == 2000) {
                    this.knowLeageList = resp.data;
                } else {
                    this.$Message.error(resp.message);
                }
            });

            // 轮播图
            this.getRequest("/notes/adpic/adpicBox").then((resp) => {
                if (resp.state == 2000) {
                    this.adpicList = resp.data;
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
                    window.sessionStorage.clear();
                    this.loginUser();
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消操作'
                    });
                });
            } else if (cmd == 'updatePwd') {
                this.$router.replace('/user/updatePwd');
            }
        },
        login(){
            this.$router.push('/login')
        },
        regeister(){
           this.$router.push('/regeister')
        }

    }
}
</script>
<style scoped>

.el-main {
    background-color: #E9EEF3;
    color: #333;
    width:80%;
    margin:0 auto 0 auto;/* 上右下左 */ 
    text-align:centor;
    padding:0 19% 0 18%;
    
}
.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
}

  
.index-container{
    background-color: #ebedf1;
}
.index-header{
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

.main-header-3{
    width:98%;
    height:230px;
    border-radius: 15px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin:10px 0 0 0;    
}
.main-header-2{
    height:230px;
    border-radius: 15px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin:10px 0 0 0px;    
}
.main-header-1{
    border-radius: 15px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin:10px 20px 0 0;    
}
.main-main{
        margin-right: 10px;
    width: 74%;
    border-radius: 15px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    background-color: #fff;
    margin-top: 10px;
    float: left;
}
.main-main-title{
    margin-left:20px;
    font-size: 16px;
}
.main-main-content{
    overflow: hidden;
    margin: 16px 30px 18px 0;
    font-size: 14px;
    color: #000000;
    text-decoration: none;
}
.main-main-datetime{
    font-size: 12px;
    line-height: 18px;
    color: rgba(var(--dsw-base-grey-4-rgb), 1);
    flex: 0 0 auto;
}
.main-main-tag{
    height: 24px;
    line-height: 20px;
    padding: 2px 8px;
    margin: 0 10px 0 10px;
}

.main-right{
    margin-left: 10px;
    border-radius: 15px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    margin: 10px 0 0 15px;
}

*{
    margin:0;
    padding:0;
}

body{
    font:1em Arial, Helvetica, sans-serif;
    background:#e7e7e7;
    text-align:center;
}
/* 走马灯 */
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }

/* 去掉a标签下划线 */
a:link {
font-size: 12px;
color: #000000;
text-decoration: none;
}
/* a:visited {
font-size: 12px;
color: #000000;
text-decoration: none;
}
a:hover {
font-size: 12px;
color: #999999;
text-decoration: underline;
} */

</style>