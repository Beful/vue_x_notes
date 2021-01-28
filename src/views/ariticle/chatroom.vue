<template>  
    <el-container>
        <el-main>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>聊天室</el-breadcrumb-item>
                    </el-breadcrumb>
                    <el-button style="float: right; padding: 3px 0" type="text">回到正文</el-button>
                </div>

                <el-container style="height: 500px; border: 1px solid #eee">
                    <el-aside width="400px" style="background-color: rgb(238, 241, 246)">
                        <el-input v-model="search" placeholder="请输入内容" prefix-icon="el-icon-search"></el-input>
                        在线人数：{{ userCount }}<br>
                    </el-aside>
                    
                    <el-container>
                        <el-header style="text-align: right; font-size: 12px">
                            <span>{{ tt.name }}</span>
                        </el-header>
                        
                        <el-main  id="dialogue_box">
 
                            <div v-for="item in items" :key="item.id">
                                <el-row v-if="item.name != tt.name">
                                    <el-avatar icon="el-icon-user-solid" size="small"  style="float: left; padding: 3px 0"></el-avatar>
                                    <div style="float: left; padding: 3px 0;margin:0 0 10px 10px">
                                        <span>{{ item.name }}</span><span style="margin-left:10px">{{ item.createTime }}</span>
                                        <el-card shadow="hover" body-style="size:small">
                                           {{ item.content }}
                                        </el-card>
                                    </div>
                                </el-row>

                                <el-row v-else>
                                    <el-avatar icon="el-icon-user-solid" size="small" style="float: right; padding: 3px 0;margin:0 0 10px 10px"></el-avatar>
                                    <div style="float: right; padding: 3px 0;margin:0 0 10px 10px">
                                        <el-card shadow="hover" body-style="size:small">
                                           {{ item.content }}
                                        </el-card>
                                    </div>
                                </el-row>
                            </div>
                        </el-main>

                        <el-input type="textarea"  :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"  v-model="tt.content"></el-input>
                        <el-button type="primary" plain style="text-align: right;" @click="fasong">发送(alt + s)</el-button>
                    </el-container>
                </el-container>


                
            </el-card>
        </el-main>
    </el-container>
</template>
<script>
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import $ from 'jquery';
export default{
    data() {
        return {
            search:'',
            tt:{
                content:'',
                name: window.sessionStorage.getItem('username') == null ? "匿名用户" : window.sessionStorage.getItem('username'),
            },
            // stomp
            stompClient:'',
            timer:'',
            // 
            items:[],
            // 
            userCount:'',
            userIds:[]
        }
    },
    created() {
        this.getChat();
        window.addEventListener('beforeunload', this.updateHandler)
    },
    destroyed() {
        window.removeEventListener('beforeunload', this.updateHandler)
    },
    methods :{
        // 获取当前的年月日,时分秒
        getDateTime() {
            var dt = new Date();
            var Year = dt.getFullYear();
            var Month = dt.getMonth() + 1;
            var Day = dt.getDate();
            var Hours = dt.getHours();
            var Minutes = dt.getMinutes();
            var Second = dt.getSeconds();
            return (Year + "-" + Month + "-" + Day + " " + Hours + ":" + Minutes + ":" + Second);
        },
        // 初始化聊天
        getChat(){
            this.getRequest('/chatRoom/list').then((resp) => {
                if (resp.state == 2000) {
                    this.items = resp.data.list;
                    this.userCount = resp.data.userCount;
                    this.userIds = resp.data.userIds;
                }else{
                    this.$Message.error(resp.message);
                }
            });
        },
        fasong(){
            if (this.tt.content != "") {
                this.postRequest('/chatRoom/create',this.tt).then((resp) => {
                    if (resp.state == 2000) {
                        this.getChat();
                        this.tt.content = "";
                    }else{
                        this.$Message.error(resp.message);
                    }
                });
            }else{
                alert("请输入内容")
            }
        },
        // 初始化
        initWebSocket() {
            this.connection();
            let that= this;
            //断开重连机制,尝试发送消息,捕获异常发生时重连
            this.timer = setInterval(() => {
                try {
                    that.stompClient.send("test");
                } catch (err) {
                    console.log("断线了: " + err);
                    that.connection();
                }
            }, 5000);
        },  
        connection() {
            // 建立连接对象
            let socket = new SockJS('/ws/endpointChat');
            
            // 获取STOMP子协议的客户端对象
            this.stompClient = Stomp.over(socket);

            // 定义客户端的认证信息,按需求配置
            let headers = {
                Authorization:"Bearer" + window.sessionStorage.getItem('token')
            }

            // 向服务器发起websocket连接   client.connect(headers, connectCallback, errorCallback);
            this.stompClient.connect(headers,(data) => {

                this.stompClient.subscribe("/server/sendMessageByServer", (msg) => { // 订阅服务端提供的某个topic
                    console.log('广播成功');
                    this.getChat();
                },headers); // 接收广播消息
                
                this.stompClient.send("/app/hello",
                    headers,
                    JSON.stringify({username: window.sessionStorage.getItem('username') ,userId : window.sessionStorage.getItem('userId')}),
                )   //用户加入接口
                
            }, (err) => {
                // 连接发生错误时的处理函数
                console.log('失败')
                console.log(err);
            });
        },    //连接 后台
        disconnect() {
            if (this.stompClient) {
                this.stompClient.disconnect();
                let id = window.sessionStorage.getItem('userId')
                this.deleteRequest('/chatRoom/disUserCount/' + id ).then((resp) => {
                    if (resp.state == 2000) {
                        this.getChat();
                    }else{
                        this.$Message.error(resp.message);
                    }
                });
            }
        },  // 断开连接
        
    },
    //每次页面渲染完之后滚动条在最底部
    updated() {
      this.$nextTick(() => {
      var div = document.getElementById('dialogue_box');
        div.scrollTop = div.scrollHeight;
      })
    },
    mounted(){
        this.initWebSocket();
        this.$nextTick(() => {
            var div = document.getElementById('dialogue_box');
            div.scrollTop = div.scrollHeight;
        })
    },
    beforeDestroy() {
        console.log('beforeDestroy执行');
        let self = this;
        // 页面离开时断开连接,清除定时器
        self.disconnect();
        clearInterval(self.timer);
    }

}
</script>
<style scoped>
/* Container 布局容器 */
.el-main {
    background-color: #E9EEF3;
    color: #333;
}

 .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
</style>