<template>  
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path == '/user/notes'">
            <el-breadcrumb-item :to="{ path: '/homes' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人笔记</el-breadcrumb-item>
        </el-breadcrumb><br>

        <el-row :gutter="20">
            <el-col :span="4">
                <el-input placeholder="请输入文章标题" v-model="queryInfo.query" class="input-with-select" clearable @clear="getNotesList">
                    <el-button slot="append" icon="el-icon-search" @click="getNotesList"></el-button>
                </el-input>
            </el-col>
            <el-button type="success" plain  @click="insertNotesModel">新增</el-button>
        </el-row><br>
        <!-- 表格 -->
        <el-card>
            <!-- 表格 -->
            <el-table :data="notesList" stripe style="width: 100%">
                <el-table-column type="index" prop="id" label="NO."></el-table-column>
                <el-table-column prop="title" label="文章标题"></el-table-column>
                <el-table-column prop="browseNum" label="浏览数" sortable></el-table-column>
                <el-table-column prop="likeNum" label="点赞数" sortable></el-table-column>
                <el-table-column prop="commentNum" label="评论数" sortable></el-table-column>
                <el-table-column prop="createTime" label="创建/发布时间">
                    <template slot-scope="scope">
                        {{scope.row.publishTime == null ? scope.row.createTime : scope.row.publishTime}}
                    </template>
                </el-table-column>
                <el-table-column prop="isPublish" label="发布状态"> 
                    <template slot-scope="scope">
                        {{scope.row.isPublish == 1 ? '已发布' : '未发布' }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="90">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                            <el-button type="primary" icon="el-icon-edit" @click="editNotes(scope.row.id)">编辑</el-button>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="删除" placement="top">
                            <el-button type="danger" icon="el-icon-delete" @click="delPre(scope.row.roleid)">删除</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页栏 -->
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" background
                :current-page.sync="queryInfo.pagenum" 
                :page-sizes="[10,20,50]" 
                :page-size="queryInfo.pageSize" 
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalPage">
                </el-pagination>
        </el-card>
        <!-- 新增修改表单 -->
        <el-dialog title="新增文章" :visible.sync="dialogVisible" width="60%" :before-close="handleClose" @close="addDialogClosed">
            <el-form :model="notesForm" status-icon ref="notesForm" label-width="100px">
                <el-form-item label="标题" prop="title">
                    <!-- 标题 -->
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-input v-model="notesForm.title" placeholder="请输入标题"></el-input>
                        </el-col>
                        <el-col :span="8">
                            <el-button @click="publish(1)">发布</el-button>
                            <el-button @click="publish(0)">暂存</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="分类" prop="sorts">
                    <el-checkbox-group v-model="notesForm.sorts" :min="0" :max="1">
                        <el-checkbox :label="item.id" :key="item.id" v-for="item in sortList">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="标签" prop="tags">
                    <el-checkbox-group v-model="notesForm.tags" :min="0" :max="3">
                        <el-checkbox :label="item.id" :key="item.id" v-for="item in tagList">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="文章摘要" prop="summary">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入文章摘要" v-model="notesForm.summary"></el-input>
                </el-form-item>
                <el-form-item label="文章内容" prop="content">
                    <editor-bar v-model="notesForm.content" @change="change"></editor-bar>
                </el-form-item>
                <el-form-item label="作品来源" prop="type">
                    <el-select v-model="notesForm.type" placeholder="请选择类型" @change="type_change">
                        <el-option v-for="item in types" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="原文链接" prop="originalLink" class="type-hide" style="display:none;" >
                    <el-input v-model="notesForm.originalLink"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import $ from 'jquery'
import EditorBar from '../components/wangEnduit'
export default{
    components: { EditorBar },
    data() {
        return {
            dialogVisible:false,
            // 文章table
            notesList:[],
            // form表单
            notesForm:{
                id:'',
                title:'',
                content:'',
                tags:[],
                sorts:[],
                isPublish:'',
                author: window.sessionStorage.getItem('username'),
                userId: window.sessionStorage.getItem('userId'),
                type:'',
                originalLink:'',
                summary:''
            },
            // 分页数据
            queryInfo:{
                query:'',
                pagenum:1,
                pageSize:10
            },
            totalPage:0,
            tagList:[],
            sortList:[],
            types:[{name:'转载',value:"0"},{name:'原文',value:"1"},{name:'翻译',value:"2"}]
        };
    },
    created() {
        this.getNotesList();
        this.getSortsTags();
    },
    methods :{
        // 加载列表
        getNotesList(){
            this.getRequest("/notes/ariticle/list",this.queryInfo).then((resp) => {
                if (resp.state == 2000) {
                    console.log(resp.data);
                    this.notesList= resp.data.list;
                    this.totalPage = resp.data.totalCount;
                    this.picDialogVis = false
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        change(val) {
            // console.log(val)
        },
        // 新增文章
        insertNotesModel(){
           this.dialogVisible = true;
           this.notesForm.id = '';
        },
        // 编辑文章
        editNotes(id){
            this.dialogVisible = true;
            this.notesForm.id = id;

            this.getRequest("/notes/ariticle/info/" + id).then((resp) => {
                if (resp.state == 2000) {
                    this.notesForm= resp.data;
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        type_change(val){
            console.log(val);
            if(val == 1){
                $(".type-hide").hide();
            }else{
                $(".type-hide").show();
            }
        },
        // 发布文章
        publish(isPublish){
            let tags = this.notesForm.tags;
            let sorts = this.notesForm.sorts;
            this.notesForm.tags = tags.join(',');
            this.notesForm.sorts = sorts.join(',');
            this.notesForm.isPublish = isPublish;
            
            if(this.notesForm.id == ''){
                this.postRequest("/notes/ariticle/save", this.notesForm).then((resp) => {
                    if (resp.state == 2000) {
                        this.$Message.success("发布文章成功！");
                        this.getNotesList();
                        this.dialogVisible = false;
                    } else {
                        this.$Message.error(resp.message);
                    }
                });
            } else {
                 this.postRequest("/notes/ariticle/update", this.notesForm).then((resp) => {
                    if (resp.state == 2000) {
                        this.$Message.success("发布文章成功！");
                        this.getNotesList();
                        this.dialogVisible = false;
                    } else {
                        this.$Message.error(resp.message);
                    }
                });
            }
        },
        // 加载全部分类、标签
        getSortsTags(){
            this.getRequest("/notes/ariticle/sortTagList").then((resp) => {
                if (resp.state == 2000) {
                    this.sortList = resp.data.sortList;
                    this.tagList = resp.data.tagList;
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        // 监听关闭
        addDialogClosed(){
            this.$refs.notesForm.resetFields();
        },
        // dialog 关闭提醒
        handleClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        // 页数选择
        handleSizeChange(newsize) {
            this.queryInfo.pageSize = newsize;
            this.getNotesList();
        },
        // 当前页
        handleCurrentChange(newnum) {
            this.queryInfo.pagenum = newnum;
            this.getNotesList();
        },
    }
}
</script>
<style>
.el-dialog{
    top:-10vh
}
</style>