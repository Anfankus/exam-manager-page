<template>
  <b-container class="select-wrapper">
    <b-col class="select-title">{{title}}</b-col>
    <b-col cols="2" class="function-block">
      <b-btn block variant="outline-success">新增考试</b-btn>
    </b-col>
    <b-col class="table-wrapper">
      <b-table hover :items="items" :fields="fields" @row-clicked="clickRow">
        <template v-slot:cell(index)="row">{{row.index+1}}</template>
        <template v-slot:cell(date)="row">{{row.value.toLocaleString('chinese', { hour12: false })}}</template>
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
class SelectionItem {
  constructor(name, date, status, count, tip) {
    this.name = name;
    this.date = date;
    this.status = status;
    this.count = count;
    this.tip = tip;
  }
}
export default {
  name: "Selection",
  created() {},
  data() {
    return {
        role:"student",

      title: "我的考试",
      fields: [
        { key: "index", label: "序号" },
        { key: "name", label: "考试名称" },
        { key: "date", label: "开始时间", sortable: true },
        { key: "status", label: "状态", sortable: true },
        { key: "count", label: "参加人数", sortable: true },
        { key: "tip", label: "备注" },
        { key: "operation", label: "操作" }
      ],
      items: [
        {
          ...new SelectionItem("第三次统考", new Date(), 2, 25, "需要补考")
        },
        {
          ...new SelectionItem("第二次统考", new Date(), 0, 25, "需要补考")
        },
        {
          ...new SelectionItem("第一次统考", new Date(), 1, 25, "需要补考")
        },
        {
          ...new SelectionItem("第一次统考", new Date(), 3, 25, "需要补考")
        }
      ],

      statusEnums: {
        student:{
            0: { label: "未开始", class: "status-ready", operations: [] },
            1: { label: "正在进行", class: "status-pending", operations: [] },
            2: { label: "已提交", class: "status-finished", operations: [0] },
            3: { label: "已评分", class: "status-ended", operations: [0] }
        },
        teacher:{
            0: { label: "未开始", class: "status-ready", operations: [0, 1] },
            1: { label: "正在进行", class: "status-pending", operations: [] },
            2: { label: "已结束", class: "status-finished", operations: [0, 2] },
            3: { label: "已阅卷", class: "status-ended", operations: [0] }
        }
      },
      operationEnums: {
        student:[
            { label: "查看", func: this.deleteItem },
        ],
        teacher:[
            { label: "删除", func: this.deleteItem },
            { label: "修改", func: this.modifyItem },
            { label: "阅卷", func: this.reviewItem }
            ]
      }
    };
  },
  computed:{
      statusEnum(){
          return this.statusEnums[this.role];
      },
      operationEnum(){
          return this.operationEnums[this.role];
      }
  },
  methods: {
    clickRow(item) {
      console.log(item.name);
    },
    deleteItem(index) {
      console.log(index);
      this.items.splice(index, 1);
    },
    modifyItem(index) {
      console.log(index);
    },
    reviewItem(index) {
      console.log(index);
    },
    checkItem(index){
        console.log(`check ${index}`);
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