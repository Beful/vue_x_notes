<template>  
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path == '/info/echarts'">
            <el-breadcrumb-item :to="{ path: '/homes' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>echarts图形库</el-breadcrumb-item>
        </el-breadcrumb><br>

        <el-row>
            <el-col :span="12">
                <div id="histogram" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="12">
                <div id="pieChart" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div id="dashBoard" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
            <el-col :span="12">
                <div id="lineChart" :style="{width: '500px', height: '500px'}"></div>
            </el-col>
        </el-row>
    </div>  
</template>
<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
export default{
    data() {
        return {}  
    },
    created() {},
    mounted() {
        this.getHistogramEcharts();
        this.getPieChart();
        this.getDashBoard();
        this.getLineChart();
    },
    methods:{
        // 柱状图
        getHistogramEcharts(){
            let myChart = this.$echarts.init(document.getElementById('histogram'));
            myChart.setOption({
                title: { text: '柱状图' },
                tooltip: {},
                xAxis: {
                    data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
                },
                yAxis: {},
                series: [{
                    name: '销量',
                    type: 'bar',
                    data: [5, 20, 36, 10, 10, 20]
                }]
            });
        },
        // 饼图
        getPieChart(){
            let myChart = this.$echarts.init(document.getElementById('pieChart'));
            myChart.setOption({
                title: {
                    text: '某站点用户访问来源',
                    subtext: '纯属虚构',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                },
                series: [{
                    name: '访问来源',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        {value: 335, name: '直接访问'},
                        {value: 310, name: '邮件营销'},
                        {value: 234, name: '联盟广告'},
                        {value: 135, name: '视频广告'},
                        {value: 1548, name: '搜索引擎'}
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }]
            });
        },
        // 仪表盘
        getDashBoard(){
            let myChart = this.$echarts.init(document.getElementById('dashBoard'));
            myChart.setOption({
                tooltip: {
                    formatter: '{a} <br/>{b} : {c}%'
                },
                toolbox: {
                    feature: {
                        restore: {},
                        saveAsImage: {}
                    }
                },
                series: [{
                    name: '业务指标',
                    type: 'gauge',
                    detail: {formatter: '{value}%'},
                    data: [{value: 50, name: '完成率'}]
                }]
            })
        },
        // 折线图
        getLineChart(){
            let myChart = this.$echarts.init(document.getElementById('lineChart'));
            myChart.setOption({
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line'
                }]
            })
        }
    },
}
</script>
<style>
</style>