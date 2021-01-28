import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {
    Button,
    Input,
    Table,
    TableColumn,
    Dialog,
    Card,
    Container,
    Icon,
    Select,
    Form,
    Tag,
    Tree,
    Pagination,
    Badge,
    Loading,
    Message,
    MessageBox,
    Menu,
    Tabs,
    TabPane,
    Breadcrumb,
    BreadcrumbItem,
    Dropdown,
    Steps,
    Step,
    Tooltip,
    Popover,
    Collapse,
    FormItem,
    Checkbox,
    CheckboxGroup,
    Header,
    DropdownMenu,
    DropdownItem,
    Aside,
    Main,
    MenuItemGroup,
    MenuItem,
    Submenu,
    Option,
    Col,
    Row,
    Upload,
    Radio,
    DatePicker,
    RadioGroup,
    CollapseItem,
    Switch,
    Link,
    Carousel,
    CarouselItem,
    Timeline,
    TimelineItem,
    ColorPicker,
    Calendar,
    Divider,
    Avatar
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import infiniteScroll from "vue-infinite-scroll";

Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };

Vue.use(Switch);
Vue.use(CollapseItem);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(DatePicker);
Vue.use(Upload);
Vue.use(Row);
Vue.use(Col);
Vue.use(Option);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Header);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(FormItem);
Vue.use(Collapse);
Vue.use(Popover);
Vue.use(Menu);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Dropdown);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Tooltip);
Vue.use(Tree);
Vue.use(Link);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Pagination);
Vue.use(Badge);
Vue.use(Loading);
Vue.use(Button);
Vue.use(Input);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);
Vue.use(Card);
Vue.use(Container);
Vue.use(Icon);
Vue.use(Select);
Vue.use(Form);
Vue.use(Tag);
Vue.use(Timeline);
Vue.use(TimelineItem);
Vue.use(ColorPicker);
Vue.use(Calendar);
Vue.use(Divider);
Vue.use(Avatar);
Vue.use(infiniteScroll);


Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$Message = Message
import { postRequest } from "./utils/api";
import { postKeyValueRequest } from "./utils/api";
import { putRequest } from "./utils/api";
import { deleteRequest } from "./utils/api";
import { getRequest } from "./utils/api";

Vue.prototype.postRequest = postRequest;
Vue.prototype.postKeyValueRequest = postKeyValueRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.getRequest = getRequest;
Vue.config.productionTip = false

// 图标库
import 'font-awesome/css/font-awesome.min.css';
import 'font-awesome/scss/font-awesome.scss';

// echarts图表
var echarts = require('echarts'); 
Vue.prototype.$echarts = echarts;

// v-viewer
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer)
Viewer.setDefaults({
  Options: { 'inline': true, 'button': true, 'navbar': true, 'title': true, 'toolbar': true, 'tooltip': true, 'movable': true, 'zoomable': true, 'rotatable': true, 'scalable': true, 'transition': true, 'fullscreen': true, 'keyboard': true, 'url': 'data-source' }
})

// mavonEditor MD文档编辑器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)

router.beforeEach((to,form,next)=>{
    if(to.path === '/login' || to.path === '/regeister' || to.path === '/' || to.path.substr('/',18) == '/ariticle/details/') return next();
    // 获取token
    let tokenStr = window.sessionStorage.getItem('token');
    if(!tokenStr) return next('/login');
    next();
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
