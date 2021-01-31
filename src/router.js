import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Regeister from './views/Regeister.vue'
import Homes from './views/Homes.vue'
import Index from './views/Index.vue'

import UserManager from './components/user/userManager.vue'
import PersonHub from './components/user/personHub.vue'
import Install from './components/user/install.vue'
import Notes from './components/user/notes.vue'
import UpdatePwd from './components/user/updatePwd.vue'
import TimeTask from './components/user/timeTask.vue'

import MenuManager from './components/permission/menuManager.vue'
import PerManager from './components/permission/perManager.vue'
import RoleManager from './components/permission/roleManager.vue'

import Loginlog from './components/info/loginlog.vue'
import Echarts from './components/info/echarts.vue'

import HomeTopView from './components/help/homeTopView.vue'
import SystemUpdateLog from './components/help/systemUpdateLog.vue'

import Label from './components/ariticle/label.vue'
import Sort from './components/ariticle/sort.vue'
import Comment from './components/ariticle/comment.vue'

import Info from './views/ariticle/info.vue'
import Board from './views/ariticle/board.vue'
import Upload from './views/ariticle/upload.vue'
import Publish from './views/ariticle/publish.vue'
import Chatroom from './views/ariticle/chatroom.vue'



Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Index',
            component: Index,
            hidden: true,
        },{
            path: '/ariticle/details/:user_id/:ariticle_id',
            name: 'Info',
            component: Info,
            hidden: true,
        },{
            path: '/header/board',
            name: 'Board',
            component: Board,
            hidden: true,
        },{
            path: '/header/upload',
            name: 'Upload',
            component: Upload,
            hidden: true,
        },{
            path: '/header/chatroom',
            name: 'Chatroom',
            component: Chatroom,
            hidden: true,
        },{
            path: '/header/publish',
            name: 'Publish',
            component: Publish,
            hidden: true,
        },{
            path: '/login',
            name: 'Login',
            component: Login,
            hidden: true
        }, {
            path: '/regeister',
            name: 'Regeister',
            component: Regeister,
            hidden: true
        }, {
            path: '/homes',
            name: 'Homes',
            component: Homes,
            children:[{
                path: '/permission/PerManager',
                component: PerManager
            },{
                path: '/permission/roleManager',
                component: RoleManager
            },{
                path: '/permission/menuManager',
                component: MenuManager
            },{
                path: '/user/userManager',
                component: UserManager
            },{
                path: '/user/personHub',
                component: PersonHub
            },{
                path: '/user/install',
                component: Install
            },{
                path: '/user/notes',
                component: Notes
            },{
                path: '/user/timeTask',
                component: TimeTask
            }, {
                path: '/user/updatePwd',
                component: UpdatePwd
            },{
                path: '/info/loginlog',
                component: Loginlog
            },{
                path: '/info/echarts',
                component: Echarts
            },{
                path: '/help/homeTopView',
                component: HomeTopView
            },{
                path: '/help/systemUpdateLog',
                component: SystemUpdateLog
            },{
                path: '/ariticle/label',
                component: Label
            },{
                path: '/ariticle/sort',
                component: Sort
            },{
                path: '/ariticle/comment',
                component: Comment
            }]
        }, {
            path: '*',
            component: Homes
        }
    ]
})
