import Vue from "vue";
import VueRouter from "vue-router";
import { getToken } from "@/utils/auth";
import { userInfo } from "@/api/user.js";

Vue.use(VueRouter);

let routes = [
    {
      path:'/',
      redirect:'/home'
    },
    {
        path: "/home",
        name: "home",
        component: () => import("@/views/home"),
        meta: {
          title: "主页",
          requireAuth: true,
        },
      },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/login"),
      meta: {
        title: "登录",
        requireAuth: false,
      },
    },
];
  
const router = new VueRouter({
  mode:'hash',
  routes,
});

router.beforeEach((to, from, next) => {
  // 设置标签页title
  window.document.title =
    to.meta.title == undefined
      ? "微北洋消息推送管理后台"
       : `${to.meta.title} - 微北洋消息推送管理后台`;
   // 访问权限设置
  if (to.meta.requireAuth) {
      let token = getToken();
    if (!token) {
        next({
          path: "/login",
          query: {
            from: to.fullPath,
          },
        });
      }
  }
  //更新basicInfo
  if (!/login/.test(from.path) && !/login/.test(to.path)) {
    userInfo().then(res => {
      sessionStorage.setItem("basicInfo", JSON.stringify(res.result));
    })
  }
  next();
});


export default router;