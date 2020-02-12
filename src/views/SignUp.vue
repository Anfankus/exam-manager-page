<template>
    <div class="container">
        <div class="top-banner"></div> 
        <b-col col class="title-line"><span>注册</span></b-col>
        <b-form-row>
            <b-col lg=6 md=10 sm=12 tag="form" class="border center rounded shadow p-3" @submit="onSubmit">
                <b-form-group label="用户名:" class="mt-2" label-for="usi">
                    <b-form-input id='usi' required v-model="form.userid" type="text" placeholder="输入用户名"/>
                </b-form-group>
                <b-form-group label="姓名:" class="mt-2" label-for="usn">
                    <b-form-input id='usn' required v-model="form.username" type="text" placeholder="输入姓名"/>
                </b-form-group>

                <b-form-group label="密码:" label-for="pwd">
                    <b-form-input id='pwd' required v-model="form.password" type="password" placeholder="请输入密码"/>
                </b-form-group>
                <b-form-group label="再次输入密码:" label-for="rpwd">
                    <b-form-input id='rpwd' 
                    required
                    v-model="form.passwordr" 
                    type="password" 
                    :state="pwdrState"
                    aria-describedby="invalid"
                    placeholder="再次输入密码">
                    </b-form-input>
                    <b-form-invalid-feedback id="invalid">
                        输入密码不相符
                    </b-form-invalid-feedback>
                </b-form-group>
                <b-form-group label="身份">
                    <b-select v-model="form.type" :options="selectOptions"></b-select>
                </b-form-group>
                <div v-if="result">
                  <b-alert style="height:2rem" :variant="result.ret?'success':'danger'" show>
                    <p style="position:relative;top:-0.3rem;font-size:0.8rem">
                      注册{{result.ret?'成功':'失败'}}:
                      <b>{{result.msg}}</b>
                    </p>
                  </b-alert>
                </div>
                <b-form-row class="mt-4 pt-2 border-top">
                    <b-col>
                    <b-button class="mt-3" block type="submit" variant="outline-primary">注册</b-button>
                    </b-col><b-col>
                    <b-button class="mt-3" block @click="$router.push('/')" variant="outline-danger">取消</b-button>
                    </b-col>
                </b-form-row>
            </b-col>
        </b-form-row>
    </div>

</template>
<script>
export default {
    data(){
        return{
            form:{
                userid:'',
                username:'',
                password:'',
                passwordr:'',
                type:''
            },
            selectOptions:[
                {value:'',text:"选择您的身份"},
                {value:0,text:"学生"},
                {value:1,text:"老师"}
            ],
            result:null
        }
    },
    computed:{
      pwdrState(){
        if(this.form.password){
          return this.form.password==this.form.passwordr?null:false;
        }
        return null;
      }
    },
    methods:{
        async onSubmit(evt){
            this.result=null;
            evt.preventDefault();
            try{
                let ret = await this.axios.post("/signup",{
                        userid:this.form.userid,
                        username:this.form.username,
                        password:this.form.password,
                        usertype:this.form.type,
                    })
                if(!ret.data.success)
                    return;
            }catch(ex){
                console.log(ex);
                return;
            }
            this.$router.push({name:"signin"})
        }
    }
}
</script>
<style lang="less" scoped>
.top-banner{
    height: 3rem;
}
.title-line{
    &>span{
        font-size: 38px;
    }
}
.center{
    text-align: left;
    margin: 1rem auto 1rem auto;
}

</style>

