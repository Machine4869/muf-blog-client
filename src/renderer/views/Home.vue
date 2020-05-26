<template>
    <div>
        <el-row class="home-top">
            <el-button class="home-top-btn" @click="addArticleFormVisible = true" type="primary" icon="el-icon-plus">新增</el-button>
            <el-button class="home-top-btn" :type="serverStatus?'info':'primary'" icon="el-icon-switch-button" :loading="isServerLoading" @click="handleServer()">{{this.serverStatus?'关闭Server':'启动Server'}}</el-button>
            <el-button class="home-top-btn" @click="deploy()" icon="el-icon-upload" :loading="isDeployLoading">deploy部署</el-button>
            <el-button class="home-top-btn" @click="onHandleBackUp()" :loading="isBackUpLoading" icon="el-icon-copy-document">git备份</el-button>
        </el-row>

        <!-- 卡片-博客基本信息 -->
        <el-row>
            <el-col :span="16">
                <el-card class="box-card">
                    <div slot="header">
                        <span>博客基本信息</span>
                    </div>
                    <div class="cart-item">
                        <el-row>
                            <el-col :span="8">
                               博客网址
                            </el-col>
                            <el-col :span="16">
                                <!-- @click事件打开本地浏览器 -->
                                <el-button @click="openURL(blogURL)" type="text">{{this.blogURL}}</el-button>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                server状态
                            </el-col>
                            <el-col :span="16">
                                <!-- TODO 需要设置处理中 -->
                                <el-tag size="small"
                                    :type="serverStatus==true?'success':'danger'">
                                    {{serverStatus==true?'已启动':'已关闭'}}
                                </el-tag> 
                                <el-tooltip style="margin-left:10px" class="item" effect="dark" content="刷新状态" placement="right">
                                    <el-button @click="onHandleRefresh()" type="primary" size="mini" icon="el-icon-refresh" plain circle></el-button>
                                </el-tooltip>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                               server访问地址
                            </el-col>
                            <el-col :span="16">
                               <el-button @click="openURL('http://localhost:4000/')" type="text">http://localhost:4000/</el-button>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                               备份仓库
                            </el-col>
                            <el-col :span="16">
                               <el-button @click="openURL(backupRepo)" type="text">{{this.backupRepo}}</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 弹出框-添加文章 -->
        <add-article-diaLog :diaLogVisible.sync="addArticleFormVisible"></add-article-diaLog>
        
        <!-- 弹出框-用户第一次使用的初始设置 -->
        <init-settings-dialog :diaLogVisible="initSettingsVisible"></init-settings-dialog>
    </div>
</template>

<script>
import AddArticleDiaLog from '../components/AddArticleDiaLog.vue'
import InitSettingsDialog from '../components/InitSettingsDialog.vue'
var fs = require("fs")
const path = require('path');

import MulStore from '../js/mul-store'

export default {
    components: {
        AddArticleDiaLog,InitSettingsDialog
    },
    data() {
        return {
            blogURL: '',
            backupRepo: '',
            addArticleFormVisible: false,
            serverStatus: true,
            isServerLoading: MulStore.get(MulStore.key.isServerLoading),
            isDeployLoading: false,
            isBackUpLoading: false,
            initSettingsVisible: false,
            serverPID:''
        };
    },
    methods: {
        onHandleBackUp() {
            this.isBackUpLoading = true

            var hexoPath = MulStore.get(MulStore.key.hexoPath)
            var child_process=require("child_process")
            var commitStr = "commit on "+this.$common.dateFormat('YYYY-mm-dd HH:MM:SS',new Date())
            var cmdLine = 'git add . & git commit -am "' + commitStr + '" & git push -u origin master'
            
            // git status
            let gitStatusProcess = child_process.exec('git status',{cwd:hexoPath}) 
            gitStatusProcess.stdout.on('data', (data)=> {
                var isSiteChange = data.search('nothing to commit, working tree clean')==-1
                if(isSiteChange){
                    let workerProcess = child_process.exec(cmdLine,{cwd:hexoPath}) 
                    // 关闭时回调
                    workerProcess.on('close', (code)=> {
                        this.$message({
                            type: 'success',
                            message: '备份成功'
                        }); 
                    })
                }else {
                    this.$message({
                        type: 'warning',
                        message: '站点无变更'
                    });
                }
            })
            this.isBackUpLoading = false
        },
        openURL(url) {
            this.$common.runCMD('explorer '+url)
        },
        deploy(){
            this.isDeployLoading = true
            var hexoPath = MulStore.get(MulStore.key.hexoPath)
            var child_process=require("child_process")
            let workerProcess = child_process.exec('hexo g -d',{cwd:hexoPath})  
            // 关闭时回调
            workerProcess.on('close', (code)=> {
                // console.log('out code：' + code)
                this.isDeployLoading = false
                this.$message({
                    type: 'success',
                    message: '部署成功'
                }); 
            })
 
        },
        onHandleRefresh() {
            this.$message({
                message: '已刷新',
                type: 'success'
            })
            this.checkServerStatus()
        },
        handleServer() {
            
            this.isServerLoading = true
            MulStore.set(MulStore.key.isServerLoading,true)

            if(!this.serverStatus){

                // 启动中
                var hexoPath = MulStore.get(MulStore.key.hexoPath)
                var child_process=require("child_process")
                let workerProcess = child_process.exec('hexo server',{cwd:hexoPath})
                // 会一直输出信息
                workerProcess.stdout.on('data', (data) => {
                    // console.log('stdout: ' + data)
                    if(data.toString().search('Hexo is running')!=-1){
                        // console.log('启动完成')
                        this.$common.runCMD('explorer "http://localhost:4000"')
                        
                        this.isServerLoading = false
                        MulStore.set(MulStore.key.isServerLoading,false)
                        this.serverStatus=true

                        this.$notify({
                            title: '启动',
                            message: 'Server已启动',
                            type: 'success'
                        });
                        
                    }
                })
            }else {

                // 关闭中
                const path = require('path');

                var process = require('child_process')
                // 执行完后回调
                process.exec('taskkill /pid '+this.serverPID+' -f', (err, stdout, errout)=>{  
                    // console.log(err)
                    if(err != null){
                        // console.log("exec error"+error)
                        alert('执行出错')
                    }else {
                        // console.log("成功执行")
                        
                        this.serverStatus=false
                        this.$notify.info({
                            title: '关闭',
                            message: 'Server已关闭'
                        })
                    }

                    this.isServerLoading = false
                    MulStore.set(MulStore.key.isServerLoading,false)
                })

            }
        },
        // 检查server是否开启
        checkServerStatus() {
            var process = require('child_process')
            process.exec('netstat -aon|findstr "4000"', (err, stdout, errout)=>{  
                // console.log(stdout)
                var isServerOn = stdout.toString().search("0.0.0.0:4000")!=-1
                if(isServerOn){
                    var line = stdout.split('\n').filter((item)=>item.search("0.0.0.0:4000")!=-1)[0]
                    // console.log(line)
                    var pid = line.substring(line.length - 6)
                    // console.log(pid)
                    this.serverPID = pid
                }
                this.serverStatus = isServerOn
                this.isServerLoading = false
                MulStore.set(MulStore.key.isServerLoading,false)
            });  
        },
        // 加载用户设置
        initUserSettings() {
            // 第一次使用，弹出框进行设置
            if(MulStore.get(MulStore.key.hexoPath)==null){
                MulStore.initData()
                this.initSettingsVisible = true
            }
        },
        // 加载卡片信息
        initCardInfo(){
            this.backupRepo = MulStore.get(MulStore.key.backupRepo)
            this.blogURL = MulStore.get(MulStore.key.blogURL)
        }
    },
    created:function(){
        // MulStore.clear()
        // MulStore.set(MulStore.key.isServerLoading,false)
        
        this.initUserSettings()
        this.initCardInfo()
        this.checkServerStatus()

    }
}
</script>

<style>
.home-top > .home-top-btn{
    margin-bottom: 20px;
    margin-left: 0px;
    margin-right: 10px;
}
.cart-item {
    line-height: 40px;
    font-size: 14px;
}
/* .cart-item .el-row:hover{
    background-color:#363b40;
} */
/* .box-card {
    width: 600px;
} */
</style>
