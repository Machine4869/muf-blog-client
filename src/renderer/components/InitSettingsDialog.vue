<template>
  <div>
    <!-- 新增文章的弹出框 -->
    <el-dialog title="填写基本信息" 
      :visible.sync="diaLogVisible_tmp"
      width="600px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    :show-close="false">

        <settings-form @onSubmit="onSubmit($event)"></settings-form>

    </el-dialog>
  </div>
</template>

<style>
  
</style>

<script>
    import SettingsForm from '../components/SettingsForm'
    export default {
    components: {
        SettingsForm
    },
    methods: {
        // 表单提交结果
        onSubmit(result) {
            // console.log(result)
            if(result){
                this.diaLogVisible_tmp = false
                
            }
            
        }
    },
    data() {
        return {
            diaLogVisible_tmp: this.diaLogVisible
        }
    },
    // 接受父组件传值
    props: ['diaLogVisible']
  }
</script>