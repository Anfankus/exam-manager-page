<template>
  <b-container class="select-wrapper">
    <b-col class="select-title">{{title}}</b-col>
    <b-col v-if="role==1" cols="2" class="function-block">
      <b-btn block variant="outline-success" @click="addExam">新增考试</b-btn>
    </b-col>
    <b-col class="table-wrapper">
      <b-table hover :items="items" :fields="fields" @row-clicked="clickRow">
        <template v-slot:cell(index)="row">{{row.index+1}}</template>
        <template v-slot:cell(date)="row">{{row.value}}</template>
        <template v-slot:cell(status)="row">
          <div class="status-block" :class="statusEnum[row.value].class">{{statusEnum[row.value].label}}</div>
        </template>
        <template v-slot:cell(operation)="row" mt>
          <div v-if="statusEnum[row.item.status].operations.length==0">/</div>
          <div
            v-else
            v-for="(op,index) in statusEnum[row.item.status].operations"
            :key="index"
            @click="operationEnum[op].func(row.index)"
            class="operation-block"
          >
            <b-btn size="sm" variant="outline-primary">{{operationEnum[op].label}}</b-btn>
          </div>
        </template>
      </b-table>
    </b-col>
  </b-container>
</template>
<script>
import Cookies from 'js-cookie'
import moment from 'moment'
import hash from 'hash.js'
export default {
  name: "Selection",
  async created() {
    let usertype = Cookies.get('usertype');
    this.role=usertype;
    this.examMeta = await this.axios.get("/exam-meta-list").then(ret=>ret.data).catch(e=>{
      console.log("exam-meta-list error",e);
      return {
        'examid' :"",    
        'examno' :"",    
        'examname' :"",  
        'starttime' :0, 
        'examtime' :"",  
        'description':"",
        'totalscore' :"",
        'sq' :"",        
        'saq' :"",       
        'userid' :"",    
      }
    });
  },
  data() {
    return {
      role:"student",
      examMeta:[],

      title: "我的考试",
      fields: [
        { key: "index", label: "序号" },
        { key: "name", label: "考试名称" },
        { key: "date", label: "开始时间", sortable: true },
        { key: "time", label: "考试时长(分钟)", sortable: true },
        { key: "status", label: "状态", sortable: true },
        { key: "tip", label: "备注" },
        { key: "operation", label: "操作" }
      ],
      statusEnums: {
        0:{
            0: { label: "未开始", class: "status-ready", operations: [] },
            1: { label: "正在进行", class: "status-pending", operations: [1] },
            2: { label: "已结束", class: "status-finished", operations: [0] },
            3: { label: "已评分", class: "status-ended", operations: [0] }
        },
        1:{
            0: { label: "未开始", class: "status-ready", operations: [0, 1 ,2] },
            1: { label: "正在进行", class: "status-pending", operations: [0] },
            2: { label: "已结束", class: "status-finished", operations: [0,2, 3] },
            3: { label: "已阅卷", class: "status-ended", operations: [0,2] }
        }
      },
      operationEnums: {
        0:[
            { label: "查看", func: this.checkItem },
            { label: "开始作答", func: this.doItem }
        ],
        1:[
            { label: "查看", func: this.peekItem },
            { label: "修改", func: this.modifyItem },
            { label: "删除", func: this.deleteItem },
            { label: "阅卷", func: this.reviewItem }
        ]
      }
    };
  },
  computed:{
      items(){
        return this.examMeta.map(each=>{
          return {
            name:each.examname,
            date:moment.unix(each.starttime).format("YYYY/MM/DD HH:mm:ss"),
            time:each.examtime,
            status:this.itemStatus(each),
            tip:each.description,
          }
        })
      },
      statusEnum(){
          return this.statusEnums[this.role];
      },
      operationEnum(){
          return this.operationEnums[this.role];
      }
  },
  methods: {
    itemStatus(examMeta){
      let now = moment();
      let starttime = moment.unix(examMeta.starttime);
      let endtime = moment(starttime).add(examMeta.examtime,"m");
      if(now < starttime){
        return 0
      }else if(now < endtime){
        return 1
      }else{
        if(examMeta.flag)
          return 3
        else
          return 2
      }
      
    },
    clickRow(item) {
      console.log(item.name);
    },
    addExam(){
      let userid = Cookies.get('userid');
      let hashed_id=hash.sha256().update(`${moment().unix()}`).update(userid).digest('hex');
      console.log(hashed_id)
      this.$router.push({
        name:"paper",
        params:{
          id:hashed_id,
          mode:0,
          new:true
          }
        });
    },
    async deleteItem(index) {
      let target = this.examMeta[index];
      try{
        let ret = await this.axios.delete("/delete-exam",{
          params:{
            examid:target.examid
          }
        });
        if(ret.data.success){
           this.examMeta.splice(index,1);
        }else{
          console.log(ret.data.msg);
        }
      }catch(e){
        console.log(e);
      }
    },
    modifyItem(index) {
      this.$router.push({
        name:"paper",
        params:{
          id:this.examMeta[index].examid,
          mode:0,
          new:false
        }
      })
    },
    reviewItem(index) {
      this.$router.push({
        name:"paper",
        params:{
          id:this.examMeta[index].examid,
          mode:2,
          new:false
        }
      })
    },
    checkItem(index){
      this.$router.push({
        name:"paper",
        params:{
          id:this.examMeta[index].examid,
          mode:3,
          new:false
        }
      });
    },
    doItem(index){
      this.$router.push({
        name:"paper",
        params:{
          id:this.examMeta[index].examid,
          mode:1,
          new:false
        }
      })
    },
    peekItem(index){
      this.$router.push({
        name:"paper",
        params:{
          id:this.examMeta[index].examid,
          mode:4,
          new:false
        }
      })
    }
  }
};
</script>
<style lang="less" scoped>
.select-wrapper {
}
.select-title {
  font-size: 35px;
  text-align: left;
  // border-bottom: 1px solid #aaaaaa;
}
.table-wrapper {
  padding: 2px;
  //   border: 2px solid #1221;
  border-radius: 5px;
}
.function-block {
  margin-bottom: 10px;
}
.operation-block {
  display: inline-block;
  margin-left: 1px;
  margin-right: 1px;
}
.status-block {
  border: 2px solid white;
  color: white;
  border-radius: 5px;

  &.status-ready {
    background-color: #28a745;
  }
  &.status-pending {
    background-color: #ffc107;
  }
  &.status-ended {
    background-color: #dc3545;
  }
  &.status-finished {
    background-color: #219cd4;
  }
}
</style>