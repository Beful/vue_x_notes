<template>  
    <el-container>
        <el-main>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>留言板</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-button style="float: right; padding: 3px 0" type="text">回到正文</el-button>
                </div>
                <div>
                    <div>
                        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 5}" placeholder="请输入你的留言和建议，后台会认真查看每一句..." v-model="content"></el-input>
                        <el-button :disabled="isclick" type="success" plain @click="release">发布</el-button>
                    </div>
                    <span v-for="item in items" :key=item.title>
                        <el-divider></el-divider>
                        <div>
                            <span class="username">
                                {{ item.username }} 
                            </span>
                            <span style="margin:0 10px 0 670px">
                                {{ item.createTime }} 
                            </span>
                        </div> 
                        <div style="margin-top:10px">
                            {{ item.content }} 
                        </div>
                        <el-link class="ariticle_footer_fenxiang" type="info" icon="fa fa-comment-o" :underline="false" @click="reply(item.id)">回复</el-link> 
                  
                        <div :id="item.id" style="display:none">
                            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入你的评论..." v-model="content" clearable></el-input>
                            <el-button type="success" plain @click="commentRelease(item.id,item.username)">评论</el-button>
                        </div>

                            <!-- 子评论 -->
                            <div v-for="subItem in item.children" :key="subItem.id" class="article-pinglun-subItem">
                                <!-- top -->
                                <el-row style="color:#909399;">
                                    <span class="username">
                                        {{ subItem.username }} 
                                    </span>
                                    <span style="margin:0 10px 0 700px">
                                        {{ subItem.createTime }} 
                                    </span>
                                </el-row>
                                <!-- main -->
                                <el-row>
                                <el-col :span="20">
                                    <div class="article-pinglun-content">@ {{ subItem.commentUser }} : {{ subItem.content }} </div>  
                                </el-col>
                                <el-col :span="4">
                                    <el-link class="ariticle_footer_fenxiang" type="info" icon="fa fa-comment-o" :underline="false" @click="reply(subItem.id)">回复</el-link> 
                                </el-col>
                                <div :id="subItem.id" style="display:none">
                                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入你的评论..." v-model="content"></el-input>
                                    <el-button type="success" plain @click="commentRelease(item.id,subItem.username)">评论</el-button>
                                </div>
                                </el-row>
                            </div>
                    </span>
                </div>
            </el-card>
        </el-main>
    </el-container>
</template>
<script>
import $ from 'jquery'
export default{
    data() {
        return {
            content: '',
            items: [],
            isclick: false
        }
    },
    created() {
        this.boolLogin();
    },
    methods :{
        boolLogin(){
            if(window.sessionStorage.getItem('username') == null || window.sessionStorage.getItem('userId') == null){
                alert('用户未登录');
                return;
            }

            this.getRequest('/notes/leaverboard/list').then((resp) => {
                if (resp.state == 2000) {
                    console.log(resp.data);
                    this.items = resp.data; 
                }else{
                    this.$Message.error(resp.message);
                }
            });
        },
        // 回复评论
        reply(id){
          if(document.getElementById(id).style.display == 'none'){
            document.getElementById(id).style.display = 'inline';
          } else {
            document.getElementById(id).style.display = 'none';
          }
        },
        // 留言
        release(){
            if (this.isclick == false) {
                this.isclick = true;

                const tt = {
                    userid:window.sessionStorage.getItem('userId'),
                    username:window.sessionStorage.getItem('username'),
                    content: this.content,
                    commentLevel:1
                }

                if(tt.content == '' || tt.userid == '' || tt.username == ''){
                    alert('请确认内容是否正确，是否处于登录状态！');
                    return;
                }

                if(tt.content.length < 10){
                    alert('请确认内容字数，不可以小于10个字！');
                    return;
                }

                this.postRequest('/notes/leaverboard/save',tt).then((resp) => {
                    if (resp.state == 2000) {
                        this.boolLogin();
                        this.content = '';
                        this.$Message.success('评论成功！一分钟后再次评论');
                    }else{
                        this.$Message.error(resp.message);
                    }
                });
            }

            setTimeout(function () {
                this.isclick = false;
            }, 60 * 1000);
        },
        // 评论回复
        commentRelease(reaId,username){
            const tt = {
                    userid: window.sessionStorage.getItem('userId'),
                    username: window.sessionStorage.getItem('username'),
                    content: this.content,
                    commentLevel: reaId,
                    commentUser: username
                }

            this.postRequest('/notes/leaverboard/save',tt).then((resp) => {
                if (resp.state == 2000) {
                    this.boolLogin();
                    this.content = '';
                    this.$Message.success('评论成功！一分钟后再次评论');
                }else{
                    this.$Message.error(resp.message);
                }
            });
        },
    }
}
</script>
<style scoped>
/* Container 布局容器 */
.el-main {
    background-color: #E9EEF3;
    color: #333;
    width:80%;
    margin:0 auto 0 auto;/* 上右下左 */ 
    text-align:centor;
    padding:0 24% 0 23%;
}

.username{
    width: 150px;
    overflow: hidden;
    display: inline-block;
}

.ariticle_footer_fenxiang{
    margin: 10px 10px;
}
.article-pinglun-subItem{
  margin: 10px 10px 0 32px;
}
.article-pinglun-content{
  margin: 10px 0 10px 0;
}



/* 卡片样式 */  
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.box-card {
  width: 1200px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
</style>