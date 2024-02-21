import VueRouter from 'vue-router';
import Vue from 'vue'

Vue.use(VueRouter)

//路由
const routers = [
    {
        path: '/',
        name: 'login',
        component: () => import('@/pages/login/Login.vue')
    },
    {
        path: '/home/home',
        name: 'home',
        component: () => import('@/pages/home/Home.vue'),
        children: [
            {
                path: '/home/index',
                name: 'index',
                component: () => import('@/pages/home/Index.vue')
            },
            {
                path: '/admin/adminList',
                name: 'adminList',
                component: () => import('@/pages/admin/AdminList.vue')
            },
            {
                path: '/admin/adminUpdate',
                name: 'adminUpdate',
                component: () => import('@/pages/admin/AdminUpdate.vue'),
            },
            {
                path: '/admin/adminDetail',
                name: 'adminDetail',
                component: () => import('@/pages/admin/AdminDetail.vue'),
            },
            {
                path: '/guidanceType/guidanceTypeList',
                name: 'guidanceTypeList',
                component: () => import('@/pages/guidancetype/GuidanceTypeList.vue'),
            },
            {
                path: '/guidanceType/guidanceTypeDetail',
                name: 'guidanceTypeDetail',
                component: () => import('@/pages/guidancetype/GuidanceTypeDetail.vue'),
            },
            {
                path: '/guidanceType/guidanceTypeUpdate',
                name: 'guidanceTypeUpdate',
                component: () => import('@/pages/guidancetype/GuidanceTypeUpdate.vue'),
            },
            {
                path: '/guidance/guidanceList',
                name: 'guidanceList',
                component: () => import('@/pages/guidance/GuidanceList.vue'),
            },
            {
                path: '/guidance/guidanceDetail',
                name: 'guidanceDetail',
                component: () => import('@/pages/guidance/GuidanceDetail.vue'),
            },
            {
                path: '/guidance/guidanceUpdate',
                name: 'guidanceUpdate',
                component: () => import('@/pages/guidance/GuidanceUpdate.vue'),
            },
            {
                path: '/link/submitLinkList',
                name: 'submitLinkList',
                component: () => import('@/pages/link/SubmitLinkList.vue'),
            },
            {
                path: '/user/userList',
                name: 'userList',
                component: () => import('@/pages/user/UserList.vue'),
            },
            {
                path: '/user/userUpdate',
                name: 'userUpdate',
                component: () => import('@/pages/user/UserUpdate.vue'),
            },
            {
                path: '/user/userUpdatePwd',
                name: 'userUpdatePwd',
                component: () => import('@/pages/user/UserUpdatePwd.vue'),
            }
        ]
    },
];

const createRouter = () =>
    new VueRouter({
        mode: 'history',
        routes: routers,
        scrollBehavior() {
            return {x: 0, y: 0};
        },
    });

const router = createRouter();

export function resetRouter() {
    const newRouter = createRouter();
    router.matcher = newRouter.matcher; // reset router
}

const VueRouterPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(to) {
    return VueRouterPush.call(this, to).catch(err => err)
}

export default router;
