
<template>  
    <div>

        <el-form :model="notesForm" status-icon ref="notesForm" label-width="100px">
            <el-form-item label="标题" prop="title">
                <!-- 标题 -->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-input v-model="notesForm.title" placeholder="请输入标题"></el-input>
                    </el-col>
                    <el-col :span="8">
                        <el-button @click="publish">发布</el-button>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="文章内容" prop="content">
                <div id="main">
                    <mavon-editor v-model="html" ref="md" @imgAdd="$imgAdd" @imgDel="$imgDel" @change="change" style="min-height: 600px"></mavon-editor>
                </div> 
            </el-form-item>
        </el-form>

        <!-- 新增修改表单 -->
        <el-dialog title="新增文章" :visible.sync="dialogVisible" width="60%" :before-close="handleClose" @close="addDialogClosed">
            <el-form :model="notesForm" status-icon ref="notesForm" label-width="100px">
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
                <el-form-item label="作品来源" prop="type">
                    <el-select v-model="notesForm.type" placeholder="请选择类型" @change="type_change">
                        <el-option v-for="item in types" :key="item.value" :label="item.name" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="原文链接" prop="originalLink" class="type-hide" style="display:none;" >
                    <el-input v-model="notesForm.originalLink"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">发表文章</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import $ from 'jquery'
import axios from 'axios'
export default{
    data() {
        return {
            dialogVisible:false,
            html: '',
            // form表单
            notesForm:{
                id:'',
                title:'',
                content:'',
                tags:[],
                sorts:[],
                isPublish:'1',
                author: window.sessionStorage.getItem('username'),
                userId: window.sessionStorage.getItem('userId'),
                type:'',
                originalLink:'',
                summary:''
            },
            sortList:[],
            tagList:[],
            types:[{name:'转载',value:"0"},{name:'原文',value:"1"},{name:'翻译',value:"2"}]
        }
    },
    created() {
        this.getSortsTags();
    },
    methods :{
        // 将图片上传到服务器，返回地址替换到md中
        $imgAdd(pos, $file) {
            var formdata = new FormData();
            formdata.append("file", $file);
            //将下面上传接口替换为你自己的服务器接口
            axios({
                url: "/minio/upload",
                method: "post",
                data: formdata,
                headers: { "Content-Type": "multipart/form-data" }
            }).then(resp => {
                console.log(pos);
                this.$refs.md.$img2Url(pos, resp.data.url);
            });
        },
        $imgDel(pos) {
            delete this.img_file[pos];
        },
        change(value, render) {
            // render 为 markdown 解析后的结果
            this.notesForm.content= render;
        },
        publish() {
            this.dialogVisible = true;
            this.$Message.success("提交成功！");
        },
        onSubmit() {
            console.log('submit!');
            let tags = this.notesForm.tags;
            let sorts = this.notesForm.sorts;
            this.notesForm.tags = tags.join(',');
            this.notesForm.sorts = sorts.join(',');
            this.postRequest("/notes/ariticle/save", this.notesForm).then((resp) => {
                if (resp.state == 2000) {
                    this.$Message.success("发布文章成功！");
                    this.dialogVisible = false;
                    this.notesForm.title = ''
                    this.html = ''
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        type_change(val){
            if(val == 1){
                $(".type-hide").hide();
            }else{
                $(".type-hide").show();
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
    }
}
</script>
<style scoped>

</style>