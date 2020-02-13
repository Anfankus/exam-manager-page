<template>
    <b-container>
        <div v-if="ready">
        <b-row v-if="mode ===0" class="meta-wrapper">
            <b-col cols="12" class="mb-2">
                <h2>新建试卷</h2>
            </b-col>
            <b-col cols="12" class="border rounded-lg pt-3">
                 <b-form-group label="考试名称" label-cols="1">
                    <b-input-group>
                        <b-input v-model="exam.examname" placeholder="输入考试名称"></b-input>
                    </b-input-group>
                </b-form-group>
               <b-form-group label="考试时间" label-cols="1">
                    <b-input-group class="w-50">
                        <b-input v-model="examtimeString" type="datetime-local"></b-input>
                    </b-input-group>
                </b-form-group>
               <b-form-group label="考试时长" label-cols="1">
                    <b-input-group class="w-25" append="分钟">
                        <b-input v-model.number="exam.examtime" type="number"></b-input>
                    </b-input-group>
                </b-form-group>
               <b-form-group label="考试总分" label-cols="1">
                    <b-input-group class="w-25">
                        <b-input v-model.number="exam.totalscore" type="number"></b-input>
                    </b-input-group>
                </b-form-group>
            </b-col>
        </b-row>

        <b-row v-else class="meta-wrapper">
            <b-col cols="12" class="mt-2 mb-1 border-bottom">
                <div style="font-size:2rem" class="mb-1">{{exam.examname}}</div>
                <div style="font-size:1.25rem" class="py-1">考试时长:{{exam.examtime}}分 考试总分:{{exam.totalscore}}分</div>
                <div style="font-size:1.25rem" class="py-1">考试时间:{{exam_starttime}}</div>
           </b-col>
            <b-col cols v-if="mode!==4">考生姓名:{{examer.username}}</b-col>
            <b-col cols v-if="mode!==4">考生学号:{{examer.userid}}</b-col>
            <b-col cols v-if="mode!==1 && mode!==4">考试成绩:{{totalScore}}</b-col>
        </b-row>

        <b-row class="ques-wrapper">
            <b-col cols=12 class="ques-type">选择题</b-col>
            <b-col cols=12 v-for="(ques,index) in exam.sq" :key="index" class="ques">
                <div v-if="mode==0" class="ques-delete" @click="delSelectQ(index)">
                    <b-icon-x-circle></b-icon-x-circle>
                </div>
                <q-selective :index="index" :mode="mode" v-model="exam.sq[index]" class="pl-2"></q-selective>
            </b-col>
            <b-col v-if="mode==0" cols=2 class="mt-3">
                <b-btn block variant="warning text-white shadow" @click="addSelectQ" >添加题目</b-btn>
            </b-col>
        </b-row>

        <b-row class="ques-wrapper">
            <b-col cols=12 class="ques-type">简答题</b-col>
            <b-col cols=12 v-for="(ques,index) in exam.saq" :key="index" class="ques">
                <div v-if="mode==0" class="ques-delete" @click="delAppQ(index)"><b-icon-x-circle></b-icon-x-circle></div>
                <q-application :index="index"  :mode="mode" v-model="exam.saq[index]" class="pl-2"></q-application>
            </b-col>
            <b-col v-if="mode==0" cols=2 class="mt-3">
                <b-btn block variant="warning text-white shadow" @click="addAppQ" >添加题目</b-btn>
            </b-col>
        </b-row>

        <b-row >
            <b-col cols=4 offset=4>
                <b-btn v-if="mode==0" class="confirm-btn" variant="outline-info" @click="onPublish" block>确认并发布</b-btn>
                <b-btn v-else-if="mode==1" class="confirm-btn" variant="outline-info" @click="onSubmit" block>确认提交</b-btn>
                <b-btn v-else-if="mode==2" class="confirm-btn" variant="outline-info" @click="onScore" block>
                    {{endOfList?"完成该试卷阅卷":"提交评分并下一个"}}
                </b-btn>
                <b-btn v-else-if="mode==3" class="confirm-btn" variant="outline-info" @click="onClose" block>关闭</b-btn>
            </b-col>
        </b-row>

        <div v-if="mode==1" class="alarm">
            <div class="alarm-text bg-info text-white">
                时间 {{currentDate?currentDate.format("H:mm:ss"):0}} / {{ endDate?endDate.format("H:mm:ss"):0 }}
            </div>
            <div class="alarm-progress-wrapper">
                <b-progress :max="exam.examtime*60"  animated class="alarm-progress">
                    <b-progress-bar :value="passedSecond" variant="warning" >
                        <strong><b-icon-clock variant="light" ></b-icon-clock></strong>
                    </b-progress-bar>
                </b-progress>
            </div>
        </div>
        </div>
        <div v-else>
            未就绪
        </div>
    </b-container>
</template>
<script>
import QSelective from "../components/QuestionSelective"
import QApplication from "../components/QuestionApplication"
import moment from "moment"
import Cookies from "js-cookie"
import hash from "hash.js"
export default {
    name:"paper",
    props:["id","mode","new"],
    async created(){
        if(!this.new){
            await this.axios.get("/exam",{
                params:{
                    examid:this.id
                }
            }).then(ret=>{
                if(ret.data){
                    this.exam=ret.data;
                    this.examtimeString=moment.unix(this.exam.starttime).format("YYYY-MM-DDTHH:mm")
                }else{
                    this.$bvToast.toast('请求错误', {
                        title: '提示',
                        autoHideDelay: 5000,
                        toaster: 'b-toaster-top-center',
                        appendToast: true,
                        variant:'warning'
                    })
                }
            }).catch(e=>{
                this.$bvToast.toast('请求错误', {
                title: '提示',
                autoHideDelay: 5000,
                toaster: 'b-toaster-top-center',
                appendToast: true,
                variant:'warning'
                })
                console.log(e)
            })
        }else{
            this.exam={
                examid:this.id,
                examno:this.id,
                examname:"",
                examtime:0,
                starttime:"",
                totalscore:"",
                sq:[],
                saq:[],
                userid:Cookies.get("userid"),
                description:"没有描述"
            }
        }
        if(this.mode == 0){
            this.ready=true;
        }else if(this.mode == 1){
            this.examer={
                username:Cookies.get("username"),
                userid:Cookies.get("userid")
            }

            this.exam.sq.forEach(element => {
                this.$set(element,'ret','');
            });
            this.exam.saq.forEach(element => {
                this.$set(element,'ret','');
            });

            this.endDate = moment().add(this.exam.examtime,'m');
            this.currentDate = moment();

            let beginDate = this.currentDate;
            this.intervalHandle = setInterval(()=>{
                this.currentDate = moment();
                this.passedSecond = moment.duration(this.currentDate.diff(beginDate)).asSeconds();
                
                if(this.currentDate >=this.endDate){
                    console.log("interval end");
                    clearInterval(this.intervalHandle);
                    this.intervalHandle = null;
                }
            },100)
            this.ready=true;
        }else if(this.mode == 2){
            await this.axios.get("/solution-list",{
                params:{examid:this.exam.examid}
            }).then(e=>{
                this.solutionList=e.data;
            }).catch(err=>{
                this.$bvToast.toast('列表请求错误', {
                    title: '提示',
                    autoHideDelay: 5000,
                    toaster: 'b-toaster-top-center',
                    appendToast: true,
                    variant:'warning'
                })
                console.log(err)
            })
            await Promise.all(this.solutionList.map(e=>{
                return this.axios.get("/user",{
                    params:{userid:e.userid}
                }).then(({data})=>data)
            })).then(ret=>{
                this.examerList=ret;
            }).catch(err=>{
                console.log("err",err)
                this.$bvToast.toast('请求错误', {
                    title: '提示',
                    autoHideDelay: 5000,
                    toaster: 'b-toaster-top-center',
                    appendToast: true,
                    variant:'warning'
                })
            })
            if(this.examerList.length){
                this.ready=true;
                this.solutionIndex=0;
            }
        }else if(this.mode == 3){
            this.examer={
                username:Cookies.get("username"),
                userid:Cookies.get("userid")
            }

            let solutionid = await this.axios.get("/solution",{
                params:{
                    userid:this.examer.userid,
                    examid:this.exam.examid
                }
            }).then(({data})=>{
                if(data){
                    this.exam.sq.forEach((v,i)=>{
                        this.$set(v,'ret',data.answer.sq[i])
                    })
                    this.exam.saq.forEach((v,i)=>{
                        this.$set(v,'ret',data.answer.saq[i])
                    })
                    return data.solutionid
                }else{
                    throw new Error("未找到数据")
                }
            }).catch(err=>{
                this.$bvToast.toast('请求错误', {
                    title: '提示',
                    autoHideDelay: 5000,
                    toaster: 'b-toaster-top-center',
                    appendToast: true,
                    variant:'warning'
                })
                console.log(err)
            });
            await this.axios.get("/score",{params:{solutionid}}).then(({data})=>{
                this.exam.saq.forEach((v,i)=>{
                    this.$set(v,'score',data.value.saq[i])
                })
                this.score = data;
                this.ready=true;
            }).catch(err=>{
                this.$bvToast.toast('请求错误', {
                    title: '提示',
                    autoHideDelay: 5000,
                    toaster: 'b-toaster-top-center',
                    appendToast: true,
                    variant:'warning'
                })
                console.log(err)
            })
        }else if(this.mode ==4){
            this.ready=true;
        }
    },
    data(){
        return{
            // mode:null,  //0:编辑试卷 1:考试 2:查看试卷(判卷) 3:查看试卷(已作答)

            //试卷数据
            exam:{
                examid:"",
                examno:"",
                examname:"",
                examtime:0,
                starttime:"",
                totalscore:"",
                sq:[],
                saq:[],
                userid:"",
                description:""
            },
            //考试者信息
            examer:{},
            //判卷列表
            solutionList:[],
            examerList:[],

            //临时变量
            ready:false,
            //mode 1
            examtimeString:"", 
            intervalHandle:null,
            endDate:null,
            currentDate:null,
            passedSecond:0,
            //mode 2
            solutionIndex:-1,

            //mode 3
            score:{}


        }
    },
    computed:{
        totalScore(){
            if(!this.ready)
                return 0;
            if(this.mode ===2){
                return this.exam.saq.reduce((p,c)=>{
                    return p+(c.score?c.score:0)
                },0) + this.exam.sq.reduce((p,c,i)=>{
                    if(this.solutionList[this.solutionIndex].answer.sq[i] === c.answer){
                        return p+c.maxscore
                    }else{
                        return p;
                    }

                },0);
            }else if(this.mode ===3 ){
                return this.score.value.sq.reduce((p,c)=>p+c,0)+this.score.value.saq.reduce((p,c)=>p+c,0)
            }
            else    
                return 0;
        },
        examerAnswer(){
            return {
                sq:this.exam.solution[this.solutionIndex].answer.sq,
                saq:this.exam.solution[this.solutionIndex].answer.saq
            }
        },
        endOfList(){
            return this.solutionList.length-1 ===this.solutionIndex;
        },
        exam_starttime(){
            return moment.unix(this.exam.starttime).format("YYYY/MM/DD HH:mm:ss")
        }
    },
    methods:{
        nextPaper(){
            this.solutionIndex++;
            if(this.solutionIndex >= this.solutionList.length){
                this.$router.push({name:"select"})
            }
        },
        delSelectQ(index){
            this.exam.sq.splice(index,1);

        },
        addSelectQ(){
            this.exam.sq.push({
                title:null,options:[],ret:null
            })
        },
        addAppQ(){
            this.exam.saq.push({
                title:null,ret:null
            })
        },
        delAppQ(index){
            this.exam.saq.splice(index,1);
        },
        async onPublish(){
            let param={
                   ...this.exam
                };
            console.log(this.examtimeString);
            param.starttime=moment(this.examtimeString).unix();
            console.log(moment(this.examtimeString))
            await this.axios.post("/new-exam",param).then(e=>{
                if(e.data.success){
                    this.$router.push({name:"select"});
                }else{
                    this.$bvToast.toast('创建失败', {
                        title: '提示',
                        autoHideDelay: 5000,
                        toaster: 'b-toaster-top-center',
                        appendToast: true,
                        variant:'warning'
                    })
                }
            }).catch(e=>{
                console.log(e);
                this.$bvToast.toast('发布失败', {
                    title: '提示',
                    autoHideDelay: 5000,
                    toaster: 'b-toaster-top-center',
                    appendToast: true,
                    variant:'warning'
                })
            });
        },
        async onSubmit(){
            let solution = {
                examid:this.id,
                userid:this.examer.userid,
                submittime:moment().unix(),
                solutionid:hash.sha256().update(this.id).update(this.examer.userid).digest("hex"),
                answer:{
                    sq:this.exam.sq.map(e=>e.ret),
                    saq:this.exam.saq.map(e=>e.ret)
                },
                totalscore:-1
            }
            await this.axios.post("/submit-solution",solution).then(e=>{
                if(e.data.success){
                    this.$router.push({name:"select"});
                }else{
                    this.$bvToast.toast('发布失败', {
                        title: '提示',
                        autoHideDelay: 5000,
                        toaster: 'b-toaster-top-center',
                        appendToast: true,
                        variant:'warning'
                    })
                }
            }).catch(e=>{
                console.log(e);
                this.$bvToast.toast('提交失败', {
                    title: '提示',
                    autoHideDelay: 5000,
                    toaster: 'b-toaster-top-center',
                    appendToast: true,
                    variant:'warning'
                })
            })
        },
        async onScore(){
            let score = {
                scoreid:hash.sha256().update(this.solutionList[this.solutionIndex].solutionid).update(this.id).update(this.examer.userid).digest('hex'),
                solutionid:this.solutionList[this.solutionIndex].solutionid,
                value:{
                    sq:this.exam.sq.map(each=>{
                        if(each.ret === each.answer){
                            return each.maxscore
                        }else{
                            return 0;
                        }
                    }),
                    saq:this.exam.saq.map(each=>each.score?each.score:0)
                }
            }
            await this.axios.post("/new-score",score).then(({data})=>{
                if(data.success){
                    this.nextPaper();
                }else{
                    this.$bvToast.toast(`提交失败：${data.msg}`, {
                        title: '提示',
                        autoHideDelay: 5000,
                        toaster: 'b-toaster-top-center',
                        appendToast: true,
                        variant:'warning'
                    })
                }
            }).catch(err=>{
                this.$bvToast.toast('发布失败', {
                    title: '提示',
                    autoHideDelay: 5000,
                    toaster: 'b-toaster-top-center',
                    appendToast: true,
                    variant:'warning'
                })
                console.log(err)
            })
        },
        onClose(){
            this.$router.push({name:"select"})
        }
    },
    watch:{
        solutionIndex(value){
            if(!this.ready)
                return;
            console.log(this.solutionList,value)
            this.exam.sq.forEach((ele,index) => {
                this.$set(ele,'ret',this.solutionList[value].answer.sq[index])
            });
            this.exam.saq.forEach((ele,index)=>{
                this.$set(ele,'ret',this.solutionList[value].answer.saq[index])
            })
            this.examer=this.examerList[value];
        }

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
