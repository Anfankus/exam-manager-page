<template>
  <div id="app">
    <b-navbar toggleable="md" type="dark" variant="primary" class="shadow nav_head">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand to="/" class="ml-5">考试管理系统</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" type="text" placeholder="搜索试卷"/>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">搜索</b-button>
          </b-nav-form>
          <b-button size="sm" class="ml-1 mr-1" to="/signIn" v-show="!ifLogin">登陆</b-button>
          <b-button size="sm" to="/signUp" v-show="!ifLogin">注册</b-button>
          <b-nav-item-dropdown right v-show="ifLogin">
            <template slot="button-content">我的</template>
            <b-dropdown-item href="#">我的试卷</b-dropdown-item>
            <b-dropdown-item href="#">购物车</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div class="view-wrapper">
      <router-view ></router-view>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data(){
    return{
      showCart:false
    }
  },
  computed:{
    username(){
      return Cookies.get('user');
    },
    ifLogin(){
      if(Cookies.get('user')){
        return true;
      }
      else{
        return false;
      }
    },
    
  }
}
</script>


<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-width: 512px;
  min-height: 100vh;
}
.nav_head{
  height:60px;
  position: fixed!important;
  width: 100%;
  z-index: 3;
  top: 0;
}
.view-wrapper{
  box-sizing: border-box;
  min-height: 95vh;
  padding-top: 80px!important;
  // margin-top:65px!important;
  margin-bottom: 30px;
}
.cart{
  position: fixed;
  z-index: 3;
  right:  0;
  top:5rem;
  width:40rem!important;
  border:white solid;
  border-radius: 8px!important;
}
.footer{
  // box-sizing: content-box;
  // margin: 3rem auto 0 auto;
  border-top: 1px solid #dddddd;
  height: 5vh; 
  min-height: 10px;
  background-color: #eee;
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .4s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to{
  transform: translateX(10px);
  opacity: 0;
}
</style>
