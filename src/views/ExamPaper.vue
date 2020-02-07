<template>
    <b-container>
        <b-row v-if="mode ===0" class="meta-wrapper">
            <b-col cols="12" class="mb-2">
                <h2>新建试卷</h2>
            </b-col>
            <b-col cols="12" class="border rounded-lg pt-3">
                 <b-form-group label="考试名称" label-cols="1">
                    <b-input-group>
                        <b-input v-model="meta.examName" placeholder="输入考试名称"></b-input>
                    </b-input-group>
                </b-form-group>
               <b-form-group label="考试时间" label-cols="1">
                    <b-input-group class="w-50">
                        <b-input v-model="meta.examStartTime" type="datetime-local"></b-input>
                    </b-input-group>
                </b-form-group>
               <b-form-group label="考试时长" label-cols="1">
                    <b-input-group class="w-25" append="分钟">
                        <b-input v-model="meta.examTime" type="number"></b-input>
                    </b-input-group>
                </b-form-group>
               <b-form-group label="考试总分" label-cols="1">
                    <b-input-group class="w-25">
                        <b-input v-model="meta.examTotalScore" type="number"></b-input>
                    </b-input-group>
                </b-form-group>
            </b-col>
        </b-row>

        <b-row v-else class="meta-wrapper">
            <b-col cols="12" class="mt-2 mb-1 border-bottom">
                <div style="font-size:2rem" class="mb-1">{{meta.examName}}</div>
                <div style="font-size:1.25rem" class="py-1">考试时长:{{meta.examTime}}分 考试总分:{{meta.examTotalScore}}分</div>
                <div style="font-size:1.25rem" class="py-1">考试时间:{{meta.examStartTime}}</div>
           </b-col>
            <b-col cols>考生姓名:{{examer.name}}</b-col>
            <b-col cols>考生学号:{{examer.id}}</b-col>
            <b-col cols>考试成绩:{{totalScore}}</b-col>
        </b-row>

        <b-row class="ques-wrapper">
            <b-col cols=12 class="ques-type">选择题</b-col>
            <b-col cols=12 v-for="(ques,index) in selective" :key="index" class="ques">
                <div v-if="mode==0" class="ques-delete" @click="delSelectQ(index)">
                    <b-icon-x-circle></b-icon-x-circle>
                </div>
                <q-selective :index="index" :mode="mode" v-model="selective[index]" class="pl-2" ></q-selective>
            </b-col>
            <b-col v-if="mode==0" cols=2 class="mt-3">
                <b-btn block variant="warning text-white shadow" @click="addSelectQ" >添加题目</b-btn>
            </b-col>
        </b-row>

        <b-row class="ques-wrapper">
            <b-col cols=12 class="ques-type">简答题</b-col>
            <b-col cols=12 v-for="(ques,index) in application" :key="index" class="ques">
                <div v-if="mode==0" class="ques-delete" @click="delAppQ(index)"><b-icon-x-circle></b-icon-x-circle></div>
                <q-application :index="index"  :mode="mode" v-model="application[index]" class="pl-2"></q-application>
            </b-col>
            <b-col v-if="mode==0" cols=2 class="mt-3">
                <b-btn block variant="warning text-white shadow" @click="addAppQ" >添加题目</b-btn>
            </b-col>
        </b-row>

        <b-row >
            <b-col cols=4 offset=4>
                <b-btn v-if="mode==0" class="confirm-btn" variant="outline-info" @click="onConfirm" block>确认并发布</b-btn>
                <b-btn v-else-if="mode==1" class="confirm-btn" variant="outline-info" @click="onSubmit" block>确认提交</b-btn>
                <b-btn v-else-if="mode==2" class="confirm-btn" variant="outline-info" @click="onClose" block>提交评分</b-btn>
                <b-btn v-else-if="mode==3" class="confirm-btn" variant="outline-info" @click="onClose" block>关闭</b-btn>
            </b-col>
        </b-row>

        <div v-if="mode==1" class="alarm">
            <div class="alarm-text bg-info text-white">
                时间 {{currentDate.format("H:mm:ss")}} / {{ endDate.format("H:mm:ss") }}
            </div>
            <div class="alarm-progress-wrapper">
                <b-progress :max="maxTime"  animated class="alarm-progress">
                    <b-progress-bar :value="passedSecond" variant="warning" >
                        <strong><b-icon-clock variant="light" ></b-icon-clock></strong>
                    </b-progress-bar>
                </b-progress>
            </div>
        </div>

    </b-container>
</template>
<script>
import QSelective from "../components/QuestionSelective"
import QApplication from "../components/QuestionApplication"
import moment from "moment"

export default {
    name:"paper",
    props:["id"],
    created(){
        this.mode=2;
        this.meta={
            examName:"第三次模考",
            examTime:10,
            examStartTime:"2011-02-21T01:01",
            examTotalScore:100
        }
        this.examer={
            name:'张可',
            id:'71116414'
        }
        this.selective=[
                {
                    title:'这题选什么',
                    options:[
                        "23499999999","234999999999999999999999999999999999999999999999999999999","345","456"
                    ],
                    ret:"A",
                    maxscore:0x10,
                    answer:'D'
                    
                },
                {
                    title:'这题又选什么',
                    options:[
                        "23499999999","2349999999","345","456"
                    ],
                    ret:"B",
                    maxscore:120,
                    answer:"C"
                },
                {
                    title:'这题双选什么',
                    options:[
                        "23499999999","2349999999","345","456456456456456456456456456456456"
                    ],
                    ret:"C",
                    maxscore:104,
                    answer:'C'
                }

            ]
        this.application=[
                {
                    title:"这题答什么",
                    answer:"ppp",
                    maxscore:10,
                    score:5
                },
                {
                    title:"这题答什么?",
                    answer:"pppxxxxxx",
                    maxscore:10,
                    score:5,
                },{
                    title:"这题答什么??",
                    answer:"ppprrrrrr",
                    maxscore:10,
                    score:5,
                },
            ]
        this.beginDate = moment();
        this.maxTime=this.meta.examTime;


        this.endDate = moment().add(this.maxTime,'s');
        this.currentDate = moment();
        this.intervalHandle = setInterval(()=>{
            this.currentDate = moment();
            this.passedSecond = moment.duration(this.currentDate.diff(this.beginDate)).asSeconds();
            
            if(this.currentDate >=this.endDate){
                clearInterval(this.intervalHandle);
                this.intervalHandle = null;
            }
        },100)
    },
    data(){
        return{
            mode:null,  //0:编辑试卷 1:考试 2:查看试卷(判卷) 3:查看试卷(已作答)

            //试卷数据
            meta:{},
            selective:[],
            application:[],
            beginDate:null,

            examer:{},

            //临时变量 
            maxTime:0,
            intervalHandle:null,
            endDate:null,
            currentDate:null,
            passedSecond:0,

        }
    },
    computed:{
        totalScore(){
            return this.selective.reduce((p,c)=>{
                if(c.ret === c.answer){
                    return p+c.maxscore
                }else{
                    return p
                }
            },0)+this.application.reduce((p,c)=>{
                return p+c.score
            },0)
        }
    },
    methods:{
        delSelectQ(index){
            this.selective.splice(index,1);

        },
        addSelectQ(){
            this.selective.push({
                title:null,options:[],ret:null
            })
        },
        addAppQ(){
            this.application.push({
                title:null,ret:null
            })
        },
        delAppQ(index){
            this.application.splice(index,1);
        },
        onConfirm(){

        },
        onSubmit(){

        },
        onClose(){

        }
    },
    watch:{

    },
    components:{
        "q-selective":QSelective,
        "q-application":QApplication,
    }
}
</script>
<style lang="less" scoped>
.ques-wrapper{
    box-sizing: content-box;
    border:1px solid #e0e0e0;
    background-color: #007bff;
    box-shadow: 0.5rem 1rem 1rem rgba(0,0,0,.15);
    border-radius: 20px;
    padding: 20px 20px 20px 20px;
    margin-top: 1rem;
    margin-bottom: 2rem;

}
.ques{
    &:not(:first-child){
        margin-top: 20px;
    }
    box-shadow: 0.25rem 0.5rem 0.5rem rgba(0,0,0,.25);
    background-color: white;
    border-radius: 10px;
    padding-top: 10px;
    padding-bottom: 10px;

    .ques-delete{
        width: fit-content;
        height: fit-content;
        margin-left: auto;
        font-size: 1.3rem;
        cursor: pointer;
        transition: all ease 0.3s;
        &:hover{
            color: #dc3545;
        }
    }
}
.ques-type{
    margin: 0.5rem 0 0.5rem 0;
    font-size: 2rem;
    color: white;
}
.alarm{
    position:fixed;
    top: 60px;
    left: 0;
    width: 100%;
    z-index: 5;
    display: flex;
    .alarm-text{
        border-bottom-left-radius: 100px; 
        padding: 0 10px 0 15px;
        box-sizing: border-box;
    }
    .alarm-progress-wrapper{
        flex-grow: 1;
        .alarm-progress{
            border-radius: 0;
            height: 1.5rem;
            font-size: 0.9rem;
            border-bottom-right-radius: 100px; 
        }
    }
}
.confirm-btn{
    height: 3rem;
    border-radius: 1.5rem;
}
</style>
