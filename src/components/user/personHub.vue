<template>  
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path == '/user/personHub'">
            <el-breadcrumb-item :to="{ path: '/homes' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人中心</el-breadcrumb-item>
        </el-breadcrumb><br>
        <!-- 新增摁扭 -->
        <el-button type="success" plain @click="insertPersonHistory">新增</el-button><br><br>
        <!-- 时间线 -->
        <div class="block">
            <el-timeline>
                <el-timeline-item :timestamp="item.timestamp" placement="top" v-for="(item,index) in notes" :key="index" 
                    :icon="item.icon" :color="item.color" :size="item.size" :type="item.type">
                    <el-card shadow="hover">
                        <h4>{{item.title}}</h4>
                        <p v-html="item.content"></p>
                    </el-card>
                </el-timeline-item>
            </el-timeline>
        </div>

        <!-- 个人记录表单 -->
        <el-dialog title="新增个人记录" :visible.sync="phDialogVisible" width="60%" :before-close="phHandleClose" :center="true" @close="phDialogClosed">
            <el-form :model="personHubForm" status-icon ref="personHubForm" label-width="100px">
                <el-form-item label="标题" prop="title">
                    <el-input type="text" v-model="personHubForm.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <!-- 富文本 -->
                    <editor-bar v-model="personHubForm.content" @change="change"></editor-bar>
                </el-form-item>
                <el-form-item label="时间" prop="timestamp">
                    <el-date-picker v-model="personHubForm.timestamp" align="right" type="datetime" placeholder="选择日期" 
                            :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                </el-form-item>
                <el-form-item label="字体样式" prop="size">
                    <el-select v-model="personHubForm.size" placeholder="请选择字体样式">
                        <el-option v-for="item in sizeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="颜色" prop="color">
                    <el-color-picker v-model="personHubForm.color"></el-color-picker>
                </el-form-item>
                <el-form-item label="标题标签" prop="icon">
                    <el-input v-model="personHubForm.icon" placeholder="请输入标题标签"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-input v-model="personHubForm.type" placeholder="请输入类型"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="phDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="insertPHub" class="submit_save">提 交</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import EditorBar from '../components/wangEnduit';
export default{
    components: { EditorBar },
    data() {
        return{
            notes:[],
            phDialogVisible: false,
            personHubForm: {
                title:'',
                content:'',
                timestamp:'',
                size:'',
                color:'',
                icon:'',
                type:''
            },
            // 日期时间选择器
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date());
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                    }
                }]
            },
            // 字体select选择器
            sizeOptions: [{
                value: '12px Extra Small',
                label: '12px Extra Small'
            }, {
                value: '13px Small',
                label: '13px Small'
            }, {
                value: '14px Base',
                label: '14px Base'
            }, {
                value: '16px Medium',
                label: '16px Medium'
            }, {
                value: '18px large',
                label: '18px large'
            }, {
                value: '20px Extra large',
                label: '20px Extra large'
            }]

        }
    },
    created() {
        this.getPersonHubList();
    },
    methods:{
        // 加载当前时间计划线
        getPersonHubList(){
            this.getRequest("/notes/user/getPersonHubList").then((resp) => {
                if (resp.state == 2000) {
                    this.notes = resp.data;
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        // 新增个人记录
        insertPersonHistory(){
            this.phDialogVisible = true;
        },
        // 提交个人记录
        insertPHub(){
            this.postRequest("/notes/user/savePersonHub",this.personHubForm).then((resp) => {
                if (resp.state == 2000) {
                    this.phDialogVisible = false;
                    this.getPersonHubList();
                } else {
                    this.$Message.error(resp.message);
                }
            });
        },
        // 关闭之前
        phHandleClose(done){
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        // 监听关闭
        phDialogClosed(){
            this.$refs.personHubForm.resetFields();
        },
        change(val) {
            // console.log(val)
        },
    }
}
</script>
<style>

</style>