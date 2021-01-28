<template>
    <el-container>
        <el-main>
            <el-card class="box-card">
                <div slot="header" class="clearfix">

                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>正文</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-button style="float: right; padding: 3px 0" type="text">回到正文</el-button>
                </div>
                <div>
                    <h1>{{ article.title }}</h1>

                    <el-row>
                      <span style="margin:0 0 0 5px">
                        {{ article.author }}
                      </span>
                      <span style="margin:0 0 0 5px">
                        {{ article.publishTime }}
                      </span>
                      <div class="header-browseNum">
                        浏览量：{{ article.browseNum }}
                      </div>
                    </el-row> 

                    <span v-if="article.type == 0"><el-tag type="warning" style="margin-top:10px">转载 </el-tag><span style="margin:10px 0 0 10px;">{{ article.originalLink }}</span></span>
                    <span v-else-if="article.type == 1"><el-tag type="success" style="margin-top:10px">原文</el-tag></span>
                    <span v-else><el-tag type="danger" style="margin-top:10px">翻译</el-tag><span style="margin:10px 0 0 10px">{{ article.originalLink }}</span></span>

                    <div class="ariticle-content">
                      <span v-html="article.content"></span>
                    </div>
                    
                    <!-- --------------------------------------- -->
                    <el-divider></el-divider>
                    
                    <div class="ariticle_footer">
                      <el-link class="ariticle_footer_fenxiang" type="info" icon="fa fa-thumbs-o-up" :underline="false" @click="like(article.id,0)">点赞 {{ article.likeNum }}</el-link> 
                      <el-link class="ariticle_footer_fenxiang" type="info" icon="fa fa-comment-o" :underline="false" @click="replyIndex">回复</el-link> 
                      <el-link class="ariticle_footer_fenxiang" type="info" icon="fa fa-paperclip" :underline="false">分享</el-link>

                      <el-popover class="ariticle_footer_jubao" placement="right" width="60" trigger="hover" content="举报">
                          <span slot="reference">···</span>
                      </el-popover>
                      <el-link type="info" :underline="false">
                        评论量 ： {{ article.commentNum }}
                      </el-link>
                    </div>

                    <div id="index111" style="display:none">
                      <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入你的评论..." v-model="content"></el-input>
                      <el-button type="success" plain @click="commentArticle('','')">评论</el-button>
                    </div>
                </div>
            </el-card>

            <!-- 评论区回复 -->
            <el-card class="article-pinglun" v-for="item in comment" :key="item.id + item.timeStamp">
              <div>
                <!-- top -->
                <el-row style="color:#909399;">
                    <span style="max-lenth:50px;"> {{ item.userName }} &nbsp;&nbsp; {{ item.timeStamp }}前</span>
                </el-row>
                <!-- main -->
                <el-row>
                  <el-col :span="20">
                    <div class="article-pinglun-content"> {{ item.content }} </div>  
                  </el-col>
                  <el-col :span="4">
                    <el-link class="ariticle_footer_fenxiang" type="info" icon="fa fa-thumbs-o-up" :underline="false" @click="like(item.id,1)">点赞 {{ item.praiseNum }}</el-link> 
                    <el-link class="ariticle_footer_fenxiang" type="info" icon="fa fa-comment-o" :underline="false" @click="reply(item.id)">回复</el-link> 
                  </el-col>
                  <div :id="item.id" style="display:none">
                      <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入你的评论..." v-model="content" clearable></el-input>
                      <el-button type="success" plain @click="commentArticle(item.id,item.userId)">评论</el-button>
                  </div>
                </el-row>
                
                <!-- 子评论 -->
                <div v-for="subItem in item.children" :key="subItem.id" class="article-pinglun-subItem">
                    <!-- top -->
                    <el-row style="color:#909399;">
                        <span> {{ subItem.userName }}  &nbsp;&nbsp; {{ subItem.timeStamp }}前</span>
                    </el-row>
                    <!-- main -->
                    <el-row>
                      <el-col :span="20">
                        <div class="article-pinglun-content">@ {{ subItem.userChild.username }} : {{ subItem.content }} </div>  
                      </el-col>
                      <el-col :span="4">
                        <el-link class="ariticle_footer_fenxiang" type="info" icon="fa fa-thumbs-o-up" :underline="false" @click="like(subItem.id,1)">点赞 {{ subItem.praiseNum }}</el-link> 
                        <el-link class="ariticle_footer_fenxiang" type="info" icon="fa fa-comment-o" :underline="false" @click="reply(subItem.id)">回复</el-link> 
                      </el-col>
                      <div :id="subItem.id" style="display:none">
                          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入你的评论..." v-model="content"></el-input>
                          <el-button type="success" plain @click="commentArticle(item.id,subItem.userId)">评论</el-button>
                      </div>
                    </el-row>
                </div>
              </div>
            </el-card>

        </el-main>
    </el-container>
    
</template>
<script>
export default {
    name: 'Info',
    data(){
        return {
            article:{
                title:'',
                content:'',
                author:'',
                publishTime:'',
                author: "admin",
                browseNum: 0, // 浏览
                commentNum: 0, // 评论
                likeNum: 0, // 点赞
                originalLink: '',
                sortList: [],
                sorts: [],
                summary: '',
                tagList: [],
                tags:[],
                type: '' // 文章类型
            },
            comment:[{
                content:'',
                userId:'',
                userName:'',
                articleId:'',
                articleTitle:'',
                parentCommentId:'',
                parentCommentUserId:'',
                replyCommentId:'',
                replyCommentUserId:'',
                commentLevel:'',
                status:'',
                praiseNum:'',
                topStatus:'',
                createTime:'',
                timeStamp:''
            }],
            content:''
        }
    },
    created(){
        this.getAriticle();
    },
    method(){

    },
    methods:{
        getAriticle(){
            let urlParam = this.$route.path.split('/');
            let user_id = urlParam[3];
            let article_id = urlParam[4];

            if(typeof(user_id) == 'undefined' || typeof(article_id) == 'undefined') return this.$router.push('/404');

            this.getRequest('/ariticle/details/' + user_id + '/' + article_id).then((resp) => {
              if (resp.state == 2000) {
                console.log(resp.data);
                this.article = resp.data.article;
                this.comment = resp.data.commentInfo;
              }else{
                this.$Message.error(resp.message);
              }
            });
        },
        // 回复文章
        replyIndex(){
          if(document.getElementById('index111').style.display == 'none'){
            document.getElementById('index111').style.display = 'inline';
          } else {
            document.getElementById('index111').style.display = 'none';
          }
        },
        // 提交 回复文章
        commentArticle(id,userId){
          const commentInfo = {
            userId: window.sessionStorage.getItem('userId'),// 评论人userId
            userName: window.sessionStorage.getItem('username'),//评论人名称
            articleId: this.article.id,// 评论的文章id
            articleTitle: this.article.title,
            content: this.content,
            commentLevel: id == '' ? 1 : 2,//评论等级[ 1 一级评论 默认 ，2 二级评论]
            parentCommentId: id == '' ? '0' : id,//父评论id,
            parentCommentUserId: userId == '' ? this.article.userId : userId, //父评论的用户id,
            // reply_comment_id  被回复的评论id',
            // reply_comment_user_id  被回复的评论用户id',
          } 

          this.postRequest('/ariticle/details/commentArticle',commentInfo).then((resp) => {
              if (resp.state == 2000) {
                id == '' ? document.getElementById('index111').style.display = 'none' : document.getElementById(id).style.display = 'none';
                this.content = '';

                this.$Message.success('评论成功！');
                this.getAriticle();
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
        // 点赞
        like(id,isArticleComment){
            const tt = {
              likedArticleId: id,
              likedPostId: window.sessionStorage.getItem('userId'),
              isArticleComment: isArticleComment
            } 

            this.postRequest('/ariticle/details/like',tt).then((resp) => {
                if (resp.state == 2000) {
                  this.$Message.success(resp.data);
                  this.getAriticle();
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

.header-browseNum{
  display: inline;
  margin: 10px 10px 0 650px;
}

.ariticle-content{
   margin: 20px 10px 0 0;
}
/* .ariticle_footer{
  margin: 10px 10px 0 0;
} */
.article-pinglun{
  width: 1200px;
  margin: 10px 10px 0 0;
}
.article-pinglun-subItem{
  margin: 10px 10px 0 32px;
}

.article-pinglun-content{
  margin: 10px 0 10px 0;
}

.fotter-item-1 {
  margin: 10px 10px 0 810px;
}
.fotter-item-2{
  margin: 10px 10px 0 10px;
}
.ariticle_footer_fenxiang{
    margin: 0 10px;
}
.ariticle_footer_jubao{
  margin: 0 20px 0 10px;
}
</style>