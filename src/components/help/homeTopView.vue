<template>  
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path == '/help/homeTopView'">
            <el-breadcrumb-item :to="{ path: '/homes' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>顶部图管理</el-breadcrumb-item>
        </el-breadcrumb><br>

        <el-row>
            <el-button type="success" plain  @click="insertAdpic">新增</el-button>
        </el-row><br>

        <!-- 表格 -->
        <el-card>
            <el-table :data="picList" stripe style="width: 100%">
                <el-table-column type="index" prop="id" label="NO."></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="img" label="地址"></el-table-column>
                <el-table-column prop="model" label="模块"></el-table-column>
                <el-table-column prop="ordernum" label="排序"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip class="item">
                            <el-button type="primary" icon="el-icon-edit" @click="editPic(scope.row.id)">编辑</el-button>
                        </el-tooltip>
                        <el-tooltip class="item">
                            <el-button type="danger" icon="el-icon-delete" @click="delPic(scope.row.id)">删除</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!--  分页   -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
                :current-page.sync="queryInfo.pagenum" 
                :page-sizes="[1,10,15,20]" 
                :page-size="queryInfo.pageSize" 
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalPage">
            </el-pagination>
        </el-card>

        <!-- 新增编辑表单 -->
        <el-dialog :visible.sync="picDialogVis" width="30%" :before-close="handleClose" @close="addDialogClosed">
            <el-form :model="picForm" status-icon ref="picForm" label-width="100px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="picForm.title"></el-input>
                </el-form-item>
                <el-form-item label="地址" prop="img">
                    <el-input v-model="picForm.img"></el-input>
                </el-form-item>
                <el-form-item label="模块" prop="model">
                    <el-input type="text" v-model="picForm.model"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="ordernum">
                    <el-input v-model.number="picForm.ordernum"></el-input>
                </el-form-item>
                <el-form-item label="开始时间" prop="uptime">
                    <el-date-picker v-model="picForm.uptime" type="datetime" placeholder="请选择开始时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="downtime">
                    <el-date-picker v-model="picForm.downtime" type="datetime" placeholder="请选择结束时间"></el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="picDialogVis = false">取 消</el-button>
                <el-button type="primary" @click="insertPic" class="submit_save">提 交</el-button>
                <el-button type="primary" @click="updatePic" class="update_save">修 改</el-button>
            </span>
        </el-dialog>

    </div>  
</template>
<script>
import $ from 'jquery'
export default{
    data() {
        return {
            picList:[],
            // 分页数据
            queryInfo:{
                // 当前页数
                pagenum:1,
                // 每页显示多少条
                pageSize:10
            },
            totalPage:0,
            picDialogVis: false,
            picForm:{
                model:'',
                img:'',
                title:'',
                uptime:'',
                downtime:'',
                ordernum:0
            },
            // 编辑时id
            update_id:'',
        }  
    },
    created() {
        this.getPicList();
    },
    methods:{
        // 加载表格
        getPicList(){
            this.getRequest("/notes/adpic/list",this.queryInfo).then((resp) => {
                if (resp.state == 2000) {
                    this.picList = resp.data.list;
                    this.totalPage = resp.data.totalCount;
                    this.photo = resp.data.list.phot;
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
         // 页数选择
        handleSizeChange(newsize) {
            this.queryInfo.pageSize = newsize;
            this.getPicList();
        },
        // 当前页
        handleCurrentChange(newnum) {
            this.queryInfo.pagenum = newnum;
            this.getPicList();
        },
        // 新增
        insertAdpic(){
            this.picDialogVis = true;
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
        // 监听关闭
        addDialogClosed(){
            this.$refs.picForm.resetFields();
        },
        // 保存
        insertPic(){
            console.log(this.picForm);
            this.postRequest("/notes/adpic/save", this.picForm).then((resp) => {
                        if (resp.state == 2000) {
                            this.$Message.success("添加成功！");
                            this.getPicList();
                            this.picDialogVis = false
                        } else {
                            this.$Message.error(resp.message);
                        }
                    });
        },
        // 编辑提交
        updatePic(){
            this.picForm.id = this.update_id;
            this.postRequest("/notes/adpic/update", this.picForm).then((resp) => {
                        if (resp.state == 2000) {
                            this.$Message.success("修改成功！");
                            this.getPicList();
                            this.picDialogVis = false
                        } else {
                            this.$Message.error(resp.message);
                        }
                    });
        },
        // 编辑
        editPic(id){
            this.picDialogVis = true;
            $(".submit_save").hide();
            $(".update_save").show();
            // 回显内容
            this.getRequest("/notes/adpic/selOnePic/" + id).then((resp) => {
                if (resp.state == 2000) {
                    this.picForm = resp.data;
                    this.update_id = id;
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        // 删除一条记录
        delPic(id){
            this.deleteRequest("/notes/adpic/delete/" + id).then((resp) => {
                if (resp.state == 2000) {
                    this.$Message.success("删除成功！");
                    this.getPicList();
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        // 删除
        handleRemove(file) {
            console.log(this.update_id);
            let id = this.update_id;
            this.deleteRequest("/minio/delete/" + id).then((resp) => {
                if (resp.state == 2000) {
                    this.$Message.success("删除成功！");
                    this.getPicList();
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
    }
}
</script>
<style>
</style>