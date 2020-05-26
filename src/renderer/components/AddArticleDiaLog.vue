<template>
  <div>
    <!-- 新增文章的弹出框 -->
    <el-dialog title="新增文章" 
      :visible.sync="diaLogVisible"
      width="400px"
      :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false">
        <el-form :model="addArticleForm">
            <el-form-item label="文章标题" label-width="70px">
                <el-input placeholder="请输入(可选)" v-model="addArticleForm.title"></el-input>
            </el-form-item>
            <el-form-item label="文章类型" label-width="70px">
                <el-radio v-model="addArticleForm.type" label="published">发布</el-radio>
                <el-radio v-model="addArticleForm.type" label="draft">草稿</el-radio>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setDiaLogVisible(false)">取 消</el-button>
            <el-button type="primary" @click="submitAddArticleForm()">创建</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<style>
  
</style>

<script>
var fs = require("fs")
const path = require('path')
import MulStore from '../js/mul-store'

  export default {
    methods: {
        submitAddArticleForm(){
            // 创建文章
            var now = new Date()            
            var fileName = this.$common.dateFormat("YYYYmmddHHMMSS",now)+".md"
            var timeTag = this.$common.dateFormat("YYYY-mm-dd HH:MM:SS", now)

            var typeDir=''
            if(this.addArticleForm.type=='published'){
                typeDir = "/_posts/"
            }else {
                
                
                typeDir = "/"+MulStore.get(MulStore.key.draftDirName)+"/"
            }

            var path=MulStore.get(MulStore.key.hexoPath)+'/source'+typeDir
            var title = this.addArticleForm.title
            var text = 
                "---\n" + 
                "title: "+title+"\n" + 
                "date: " + timeTag + "\n" + 
                "tags:\n" + 
                "- XXX\n" + 
                "- XXX\n" + 
                "categories:\n" + 
                "---\n"
            
            if (!fs.existsSync(path)) {
                alert('不存在路径：'+path+", 请核查")
            }else if(fs.existsSync(path+fileName)){
                alert('该文件已存在!')
            }else{
                fs.writeFileSync(path+fileName, text)

                // 提示
                this.$confirm('文章创建成功, 是否打开?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(() => {
                    let cmdStr = path+fileName
                    // console.log(cmdStr)
                    this.$common.runCMD(cmdStr)
                    this.setDiaLogVisible(false)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已创建'
                    }); 
                    this.setDiaLogVisible(false)
                });

                // 触发通知父组件（刷新数据
                this.$emit('onSubmitSuccess')
            }
            
        },
        setDiaLogVisible(iSvisible){
          this.$emit('update:diaLogVisible', iSvisible);
        }
    },
    data() {
        return {
          addArticleForm: {
              title: '',
              type: 'published'
          },
        }
    },
    // 接受父组件传值
    props: ['diaLogVisible'],
  }
</script>