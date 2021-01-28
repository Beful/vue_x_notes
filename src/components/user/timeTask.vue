<template>  
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path == '/user/timeTask'">
        <el-breadcrumb-item :to="{ path: '/homes' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>定时任务</el-breadcrumb-item>
      </el-breadcrumb><br>
      
      <!-- 表格 -->
      <el-card>
        <el-table :data="timeList" stripe style="width: 100%">
            <el-table-column type="index" prop="id" label="NO."></el-table-column>
            <el-table-column prop="jobName" label="名称"></el-table-column>
            <el-table-column prop="cron" label="表达式"></el-table-column>
            <el-table-column prop="clazzPath" label="定时任务类"></el-table-column>
            <el-table-column prop="jobDesc" label="描述"></el-table-column>
            <el-table-column prop="status" label="状态">
              <template slot-scope="scope">
              <el-switch v-model="scope.row.status" :active-value=1 :inactive-value=0
                          active-text="开启" inactive-text="关闭"></el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" sortable></el-table-column>
            <el-table-column label="操作" min-width="90">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                        <el-button type="primary" icon="el-icon-edit" @click="editTime(scope.row.userId)">编辑</el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top">
                        <el-button type="danger" icon="el-icon-delete" @click="delTime(scope.row.userId)">删除</el-button>
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

    </div>
</template>
<script>
export default{
    data() {
        return{
          timeList:[],
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
        this.getTimeList();
    },
    methods:{
        getTimeList(){
           this.getRequest("/notes/quartz/list",this.queryInfo).then((resp) => {
              if (resp.state == 2000) {
                  console.log(resp.data);
                  this.timeList = resp.data.list;
                  this.totalPage = resp.data.totalCount;
              } else {
                  this.$Message.error(resp.message);
              }
          });
        },
        // 页数选择
        handleSizeChange(newsize) {
            this.queryInfo.pageSize = newsize;
            this.getTimeList();
        },
        // 当前页
        handleCurrentChange(newnum) {
            this.queryInfo.pagenum = newnum;
            this.getTimeList();
        },
    }
}
</script>
<style>
</style>