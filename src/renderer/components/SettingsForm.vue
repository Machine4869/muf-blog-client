<template>
    <el-row>
      <el-col>
        <el-form :rules="rules" ref="form" :model="form" label-width="100px" style="width:500px;">
            <el-form-item label="hexo路径" prop="hexoPath">
                <el-input placeholder="请选择" v-model="form.hexoPath" class="path-input"></el-input>
                <el-button type="primary" @click="handleChoosePath()">选择</el-button>
            </el-form-item>
            <el-form-item label="备份仓库"  prop="backupRepo">
                <el-input placeholder="https://xxx/xxx.git" v-model="form.backupRepo"></el-input>
            </el-form-item>
            <el-form-item label="博客网址"  prop="blogURL">
                <el-input placeholder="https://xxx.github.io/" v-model="form.blogURL"></el-input>
            </el-form-item>
            <el-form-item label="草稿箱目录"  prop="draftDirName">
                <el-input placeholder="与_post同目录，例如_draft" v-model="form.draftDirName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">保存</el-button>
            </el-form-item>
        </el-form>
      </el-col>
    </el-row>
</template>

<script>
import MulStore from '../js/mul-store'
var fs = require("fs")
const path = require('path');

export default {
    data() {
      return {
        form: {
          hexoPath: '',
          backupRepo: '',
          blogURL: '',
          draftDirName: ''
        },
        rules: {
            hexoPath: [
              { required: true, message: '请填写hexo路径', trigger: 'blur' }
            ],
            draftDirName: [
              { required: true, message: '请填写草稿箱目录', trigger: 'blur' }
            ]
        }
      }
    },
    methods: {
      // 选择目录
      handleChoosePath(){
        const {ipcRenderer} = require('electron')
        // 请求主进程，打开本地文件管理器
        ipcRenderer.send('select-hexo-path')
        // 接受主进程返回的结果
        ipcRenderer.on('hexo-path', (event, path) => {
            // console.log(path)
            this.form.hexoPath = path
        })
      },
      onSubmit() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
              // 提交到数据库
              var hexoPath = this.form.hexoPath.replace(/\\/g, "\/")

              MulStore.set(MulStore.key.hexoPath,hexoPath)
              MulStore.set(MulStore.key.backupRepo,this.form.backupRepo)
              MulStore.set(MulStore.key.blogURL,this.form.blogURL)
              MulStore.set(MulStore.key.draftDirName,this.form.draftDirName)

              // 创建draftDir目录
              var dir = hexoPath+'/source/'+this.form.draftDirName
              // console.log(dir)
              fs.exists(dir,(exists)=>{
                if(exists){
                  // console.log("目录存在")
                }else{
                  // console.log("目录不存在")
                  fs.mkdir(dir,(err)=>{
                    if (err){
                      return alert('创建目录失败：'+err)
                    }
                    // console.log("目录创建成功。");
                    this.$message({
                        type: 'success',
                        message: '已创建'+result.draftDir+'目录'
                    });
                  })                  
                }
              })


              this.$message({
                type: 'success',
                message: '已保存'
              });
              // 子向父组传值
              this.$emit('onSubmit',true)
          } else {
              // console.log('error submit!!');
              this.$emit('onSubmit',false)
              return false;
          }
        });
      },
      // 初始化表单数据
      initFormData() {
        this.form.backupRepo = MulStore.get(MulStore.key.backupRepo)
        this.form.hexoPath = MulStore.get(MulStore.key.hexoPath)
        this.form.blogURL = MulStore.get(MulStore.key.blogURL)
        this.form.draftDirName = MulStore.get(MulStore.key.draftDirName)
      }
    },
    created:function(){
      this.initFormData()
    }   
}
</script>

<style>
.path-input {
  width: 80%!important;
}
</style>