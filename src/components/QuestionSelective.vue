<template>
    <div align-h="start">
        <b-row v-if="mode==0">
            <b-col cols=12>
                <b-form-group label-cols="1" :label="`题目 ${index}`" :label-for="`Qselect${index}`" label-align="left">
                    <b-form-textarea :id="`Qselect${index}`" v-model="selective.title" placeholder="请输入题目"></b-form-textarea>
                 </b-form-group>
            </b-col>
            <b-col cols =12 class="options-wrapper">
                <b-form-group v-for="(option,i) in selective.options" :key="i" 
                            label-cols="1" :label="`选项 ${String.fromCharCode(i+65)}`" :label-for="`Qselect${index}-${i}`" label-align="left">
                    <b-input-group>
                        <b-form-input :id="`Qselect${index}-${i}`" rows="1" placeholder="请输入选项" v-model="selective.options[i]"></b-form-input>
                        <b-input-group-append>
                            <b-btn variant="danger" @click="delOption(i)"><b-icon-x-circle></b-icon-x-circle></b-btn>
                        </b-input-group-append>
                    </b-input-group>
                </b-form-group>
            </b-col>
            <b-col cols=12>
                <b-form-group label-cols="1" label="总分" :label-for="`QSelectScore${index}`" label-align="left" >
                    <b-form-input :id="`QSelectScore${index}`" v-model="selective.maxscore" type="number" number style="width:20%" />
                </b-form-group>
            </b-col>
            <b-col cols="2" >
                <b-btn block variant="success" class="confirm-btn" @click="addOption" ><b-icon icon="plus"></b-icon>添加选项</b-btn>
            </b-col>
        </b-row>
        
        <b-form-group v-else-if="mode==1" :label="`${index}. ${selective.title} (${selective.maxscore}分)`" label-size="lg" label-align="left" class="form-group-my">
            <b-form-radio-group :id="selective.title" v-model="selective.ret"  :stacked="stacked" buttons button-variant="outline-primary" 
                                :class="{'form-ratio-group-inline':!stacked}" @change="changed" >
                <b-form-radio v-for="(value,index) in optionsComputed" :key="index" 
                                class="form-ratio" :class="{'ratio-inline':!stacked,'ratio-stack':stacked}"
                                :value="value.value" >
                                {{value.text}}
                </b-form-radio>
            </b-form-radio-group>
        </b-form-group>

        <div v-if="mode==2" label-size="lg" class="form-group-my">
            <div class="col-form-label-lg">{{`${index}. ${selective.title} (${selective.maxscore}分)`}}</div>
            <b-list-group :horizontal="!stacked" class="flex-column">
                <b-list-group-item v-for="(value,index) in optionsComputed" :key="index" 
                                :class="`list-item-${value.check}`"
                                class="list-item border list-item-stack " >
                                {{value.text}}
                                <div v-if="value.check === 1" style="float:right;display:inline-block" class="text-light">
                                    <b-icon-x></b-icon-x>  已选择
                                </div>
                                <div v-else-if="value.check === 2" style="float:right;display:inline-block" class="text-light">
                                    <b-icon-circle></b-icon-circle>  正确答案
                                </div>
                                <div v-else-if="value.check === 0" style="float:right;display:inline-block" class="text-light">
                                    <b-icon-check></b-icon-check>  已选择 | 正确答案
                                </div>
              
                </b-list-group-item>
            </b-list-group>
        </div>

        <div v-if="mode==3" label-size="lg" class="form-group-my">
            <div class="col-form-label-lg">{{`${index}. ${selective.title} (${selective.maxscore}分)`}}</div>
            <b-list-group :horizontal="!stacked" class="flex-column">
                <b-list-group-item v-for="(value,index) in optionsComputed" :key="index" 
                                :class="`list-item-${value.check}`"
                                class="list-item border list-item-stack " >
                                {{value.text}}
                                <div v-if="value.check === 1" style="float:right;display:inline-block" class="text-light">
                                    <b-icon-x></b-icon-x>  我的选择
                                </div>
                                <div v-else-if="value.check === 2" style="float:right;display:inline-block" class="text-light">
                                    <b-icon-circle></b-icon-circle>  正确答案
                                </div>
                                <div v-else-if="value.check === 0" style="float:right;display:inline-block" class="text-light">
                                    <b-icon-check></b-icon-check>  我的选择 | 正确答案
                                </div>
              
                </b-list-group-item>
            </b-list-group>
        </div>
    </div>
</template>
<script>
export default {
    name:"QSelective",
    model:{
        prop:'selective',
        event: 'change',
    },
    props:{
        selective:Object,//{title,options,ret}
        index:Number,
        mode:Number,
    },
    data(){
        return{

        }
    },

    computed:{
        optionsComputed(){
            return this.selective.options.map((each,index)=>{
                let op=String.fromCharCode(index+65);
                let check = this.checkOption(index);
                return {text:`${op}. ${each}`,value:op,check}
            })
        },
        stacked(){
            return Boolean(this.selective.options.reduce((prev,curr)=>`${curr}`.length>30 | prev,false));
        }
    },
    methods:{
        changed(x){
            let tempRet={
                ...this.selective
            }
            tempRet.ret=x;
            this.$emit('change', tempRet);
        },
        delOption(index){
            this.selective.options.splice(index,1);
        },
        addOption(){
            this.selective.options.push("");
        },
        //0:此选项是答案且选了，1：此选项不是答案但选了 2：此选项是答案没选 3。不是答案也没选 
        checkOption(index){
            let optionChar = String.fromCharCode(index+65);
            if(optionChar === this.selective.ret && optionChar === this.selective.answer)
                return 0;
            else if(optionChar === this.selective.ret)
                return 1;
            else if(optionChar === this.selective.answer)
                return 2;
            else 
                return 3;
        }
    },
}
</script>
<style lang="less" scoped>
.confirm-btn{
    border-radius: 15px;
}

.form-group-my{
    text-align: left!important;
    width:100%;
}
.form-ratio-group-inline{
    width: 100%;
}
.form-ratio{
    &:not(:hover){
        color: black;
    }

    &.ratio-inline{
        margin-right: 10px;
    }
    
     &.ratio-stack{
        margin-bottom: 5px;
        text-align: left;
    }
    border-radius: 4px!important;
}
.list-item{
    line-height: 1.5;
    border-radius: 8px;
    &.list-item-stack{
        margin-bottom: 5px;
        text-align: left;
    }
    &.list-item-0{
        color: #fff;
        background-color: #007bff;
        border-color: #007bff;    
    }
    &.list-item-1{
        color: #fff;
        background-color: #dc3545;
        border-color: #dc3545;    
    }
    &.list-item-2{
        color: #fff;
        background-color: #28a745;
        border-color: #28a745;    
    }
   
}
</style>