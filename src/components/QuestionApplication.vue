<template>
    <div>
        <b-row v-if="mode==0" >
            <b-col cols=12>
                <b-form-group :label="`题目${index}`"  :label-for="`ques${index}`" label-cols="1" class="form-group">
                    <b-form-textarea :id="`ques${index}`" placeholder="请输入题目" v-model="application.title"></b-form-textarea>
                </b-form-group>
            </b-col>
            <b-col cols=12>
                <b-form-group label-cols="1" label="总分" :label-for="`QAppScore${index}`" label-align="left" >
                    <b-form-input :id="`QAppScore${index}`" v-model="application.maxscore" type="number" number style="width:20%" />
                </b-form-group>
            </b-col>
        </b-row>

   
        <b-row v-else-if="mode==1" >
            <b-col cols=12>
                <b-form-group :label="`${index}. ${application.title} : ${application.answer} (${application.maxscore}分)`" label-size="lg" class="form-group">
                    <b-form-textarea :id="`ques${index}`" v-model="application.answer" @change="onChanged" placeholder="请输出答案" 
                                    rows="4" max-rows="8"></b-form-textarea>
                </b-form-group>
            </b-col>
        </b-row>

        <b-row v-else-if="mode==2" >
            <b-col cols=12>
                <b-form-group :label="`${index}. ${application.title} : ${application.answer} (${application.maxscore}分)`" label-size="lg" class="form-group">
                    <b-form-textarea :id="`ques${index}`" v-model="application.answer" @change="onChanged" placeholder="请输出答案" 
                                    rows="4" max-rows="8" readonly></b-form-textarea>
                </b-form-group>
            </b-col>
            <b-col cols="12">
                <b-form-group label-cols="1" label="设置得分:" :label-for="`QAppScore${index}`" label-align="center" >
                    <b-form-input :id="`QAppScore${index}`" v-model="application.score" type="number" number style="width:10%" class="text-center" />
                </b-form-group>
            </b-col>
        </b-row>

        <b-row v-else-if="mode==3" >
            <b-col cols=12>
                <b-form-group :label="`${index}. ${application.title} : ${application.answer} (${application.maxscore}分)`" label-size="lg" class="form-group">
                    <b-form-textarea :id="`ques${index}`" v-model="application.answer" @change="onChanged" placeholder="请输出答案" 
                                    rows="4" max-rows="8" readonly></b-form-textarea>
                </b-form-group>
            </b-col>
            <b-col cols="2" class="text-center ml-2 py-1" style="font-size:1.1rem">我的得分</b-col>
            <b-col cols="2" class="bg-success py-1 rounded text-light" style="font-size:1.1rem">10</b-col>
                <!-- <b-form-group label-cols="1" label="我的得分:" :label-for="`QAppScore${index}`" label-align="center" >
                    <b-form-input :id="`QAppScore${index}`" :value="application.score" type="number" number readonly style="width:10%" class="bg-success text-light text-center" />
                </b-form-group>
            </b-col> -->
        </b-row>
    </div>
</template>
<script>
export default {
    name:'QApplication',
    model:{
        prop:"application",
        event:"change"
    },
    props:{
        application:Object, //{title,answer}
        index:Number,
        mode:Number,
    },
    methods:{
        onChanged(x){
            let ret={
                ...this.application
            }
            ret.answer=x;
            this.$emit('change',ret);
        },
    }

}
</script>
<style lang="less" scoped>
.form-group{
    width:100%;
    text-align: left;
}
</style>