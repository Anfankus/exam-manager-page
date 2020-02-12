import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/SignIn.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'signin',
    alias: '/signin',
    component: Home
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import(/* webpackChunkName: "signup" */ '../views/SignUp.vue')
  },
  {
    path: '/select',
    name: 'select',
    component: () =>import(/* webpackChunkName: "select" */ '../views/Selection.vue')
  },
  {
    path: '/paper',
    name: 'paper',
    props:true,
    component:()=>import(/* webpackChunkName: "select" */ '../views/ExamPaper.vue')
  }

]

const router = new VueRouter({
  routes
})

export default router
