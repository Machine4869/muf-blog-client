<template>
    <div>
        <!-- 查询条件 | 新增 -->
        <el-row >
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item>
                    <el-input style="width:170px;" v-model="formInline.id" placeholder="编号"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input style="width:170px;" v-model="formInline.title" placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select style="width:100px;" v-model="formInline.status" placeholder="状态">
                        <el-option label="全部" value="all"></el-option>
                        <el-option label="已发布" value="published"></el-option>
                        <el-option label="草稿" value="draft"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" @click="onSubmit()">查询</el-button>
                </el-form-item>
                <el-button style="display:inline-block" @click="addArticleFormVisible = true" type="primary" icon="el-icon-plus">新增</el-button>
            </el-form>
        </el-row>

        <!-- 表格数据 -->
        <el-table
            size="mini"
            class="row-m-bottom"
            :data="tableData"
            v-loading = "tableLoading">
                <el-table-column
                    prop="id"
                    label="编号">
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="标题">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态">
                    <template slot-scope="{row}">
                        <el-tag size="mini" :type="row.status=='published'?'success':'info'">
                            {{ row.status=='published'?'已发布':'草稿' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    width="180"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.row)" type="primary" size="mini" icon="el-icon-edit-outline"></el-button>
                        <el-button v-if="scope.row.status!='published'" size="mini" type="success" icon="el-icon-upload2" @click="handleModifyStatus(scope.row,'published')"></el-button>
                        <el-button v-if="scope.row.status!='draft'" size="mini" icon="el-icon-download" @click="handleModifyStatus(scope.row,'draft')"></el-button>
                        <span style="margin-left:10px;">
                            <el-popconfirm
                                title="确定删除吗？"
                                icon="el-icon-info"
                                iconColor="#F56C6C"
                                @onConfirm='del(scope.row)'
                                >
                                <el-button slot="reference" type="danger" size="mini" icon="el-icon-delete"></el-button>
                            </el-popconfirm>
                        </span>
                    </template>
                </el-table-column>
        </el-table>              

        <!-- 分页标签 -->
        <el-pagination class="row-m-top"
            @current-change="handleCurrentChange"
            :current-page.sync="pageCurrent"
            :page-size="pageSize"
            layout="total, prev, pager, next, jumper"
            :total="tatalNum">
        </el-pagination>

        <!-- 弹出框-添加文章 -->
        <add-article-diaLog @onSubmitSuccess='addSuccess()' :diaLogVisible.sync="addArticleFormVisible"></add-article-diaLog>
    </div>
</template>

<script>
import MulStore from '../js/mul-store'
var fs = require("fs")
var path = require("path")
import AddArticleDiaLog from '../components/AddArticleDiaLog.vue'
export default {
    components: {
        AddArticleDiaLog
    },
    created:function(){
        this.draftDirName = MulStore.get(MulStore.key.draftDirName)
    },
    // 渲染完成后，再加载表格数据,绑定了v-loading
    mounted:function(){
        this.loadArticle()
    },
    methods: {
        addSuccess(){
            // console.log('创建成功')
            this.loadArticle()
        },
        loadArticle(){
            // 读取文章列表到article-list.json
            this.readArticleToJsonFile()

            // 从article-list.json中读取某页数据
            this.readPageData(1,this.pageSize)
        },
        get_line (filename, line_no, callback) {
            line_no = parseInt(line_no);
            var data = fs.readFileSync(filename, 'utf8');
            var lines = data.split("\n");
            for (var l in lines) {
                if (l == line_no - 1) {
                    callback(null, lines[l].trim());
                    return;
                }
            }
            throw new Error('File end reached without finding line');
        },
        readPageData(pageCurrent, pageSize) {
            var articleList = JSON.parse(MulStore.get(MulStore.key.articleList))
            var start = (pageCurrent-1)*pageSize
            this.tableData = articleList.slice(start,start+pageSize)
            this.pageCurrent = pageCurrent
        },
        addArticleToListSync(articleStatusDirName,articleList){

            var articleStatusDir = path.join(MulStore.get(MulStore.key.hexoPath),'source/'+articleStatusDirName).replace(/\\/g, "\/")

            var pa = fs.readdirSync(articleStatusDir);

            pa.forEach((ele,index)=>{
                var info = fs.statSync(articleStatusDir+"/"+ele)	
                if(info.isDirectory()){
                    // console.log("dir: "+ele)
                    // readDirSync(root+"/"+ele);
                }else{
                    var id = ele.split('.')[0]
                    var title = ''
                    var articlePath = articleStatusDir+'/'+ele
                    var status = articleStatusDirName=='_posts'?'published':'draft'
                    var date
                    this.get_line(articlePath, 2, (err, line)=>{
                        title = line.split(':')[1];
                        // console.log('The line: ' + line.split(':')[1]);
                    })
                    this.get_line(articlePath, 3, (err, line)=>{
                        date = line.replace(/^\s+|\s+$/g,"").substring(6,25)
                        // console.log('The line: ' + date+title);
                    })
                    articleList.push({
                        id: id,
                        title: title,
                        status: status,
                        date: date
                    })
                    // console.log("file: "+ele.split('.')[0])
                }	
            })
            return articleList
        },
        readArticleToJsonFile() {
            // console.log('readArticleToJsonFile')
            var fs = require("fs")
            var path = require("path")
            
            
            var articleList = []

            // 等待获取全量数据
            this.tableLoading=true
            // console.log('tableLoading')
            articleList = this.addArticleToListSync('_posts',articleList)
            articleList = this.addArticleToListSync(this.draftDirName,articleList)
            // 数据获取完毕

            // 逆序排序
            articleList.sort((a,b)=>{
                // console.log(a.date)
                var s1 = a.date
                var s2 = b.date
                return ((new Date(s1.replace(/-/g,"\/")))>(new Date(s2.replace(/-/g,"\/"))))
            }).reverse()

            // 总文章数
            // console.log('总文章数'+articleList.length)
            this.tatalNum = articleList.length

            // 写到数据库
            var str = JSON.stringify(articleList)
            MulStore.set(MulStore.key.articleList,str)

            this.tableLoading=false
        },
        onSubmit() {
            // console.log('loadding')
            this.tableLoading=true
            // 封装查询条件
            var find = {
                id: '',
                title: '',
                status: ''
            }
            var id = this.formInline.id
            var title = this.formInline.title
            var status = this.formInline.status
            if(!(id==null || id=='')){
                find.id = id
            }
            if(!(title==null || title=='')){
                find.title = title
            }
            if(!(status=='all')){
                find.status = status
            }
            
            // 读出article-list
            let articleList = JSON.parse(MulStore.get(MulStore.key.articleList));
            
            
            // 筛选
            if(find.id!=''){
                articleList = articleList.filter(function (article) {
                    return article.id==id;
                })      
            }
            if(find.title!=''){
                articleList = articleList.filter(function (article) {
                    return article.title==title;
                })      
            }
            if(find.status!=''){
                articleList = articleList.filter(function (article) {
                    return article.status==status;
                })      
            }

            // console.log(articleList)
            this.tableData = articleList
            this.tableLoading=false
            // console.log('loadding')
        },
        edit(row) {
            var openArticleCMD = this.getArticlePath(row)
            // console.log(openArticleCMD)
            this.$common.runCMD(openArticleCMD)
        },
        getArticlePath(articleRow){
            var hexoPath = MulStore.get(MulStore.key.hexoPath)
            var statusDir = articleRow.status=='published'?'/_posts/':this.draftDirName
            var articlePath = hexoPath+'/source/'+statusDir+'/'+articleRow.id+'.md'
            return articlePath
        },
        delFile(path) {
            // console.log(path)
            var fs = require('fs')
            if (fs.existsSync(path)) {
                if (!fs.statSync(path).isDirectory()) {
                    fs.unlinkSync(path)
                }
            }else {
                alert('文件不存在！')
            }
        },
        del(row) {
            this.delFile(this.getArticlePath(row))
            // 刷新数据
            this.loadArticle()
        },
        // 移动文件
        moveFile(sourceFile, destPath){
            fs.rename(sourceFile, destPath, function (err) {
                if (err) throw err;
                fs.stat(destPath, function (err, stats) {
                    if (err) throw err;
                    console.log('stats: ' + JSON.stringify(stats));
                });
            });
        },
        handleModifyStatus(row, status) {
            var hexoPath = MulStore.get(MulStore.key.hexoPath)
            var publishDir = hexoPath+'/source/_posts/'+row.id+'.md'
            var draftDir = hexoPath+'/source/'+this.draftDirName+'/'+row.id+'.md'
            
            // 是已发布的文章
            if(status=='draft'){
                // console.log('move')

                // 移动文件
                fs.rename(publishDir, draftDir,  (err)=> {
                    if (err) throw err;
                    fs.stat(draftDir, (err, stats) => {
                        if (err) throw err;
                        // console.log('stats: ' + JSON.stringify(stats));
                        this.$message({
                            message: '已设置为草稿',
                            type: 'info'
                        })
                    });
                });
            }else {
                // 是草稿


                // 移动文件
                fs.rename(draftDir, publishDir,  (err)=>{
                    if (err) throw err;
                    fs.stat(publishDir, (err, stats)=> {
                        if (err) throw err;
                        // console.log('stats: ' + JSON.stringify(stats));
                        this.$message({
                            message: '已发布',
                            type: 'success'
                        })
                    });
                });
            }
            row.status = status
        },
        handleCurrentChange(val) {
            this.readPageData(val,this.pageSize)
        }
    },
    data() {
        return {
            addArticleFormVisible: false,
            tableLoading: true,
            draftDirName: '',
            formInline: {
                id: '',
                title: '',
                status: 'all',
            },
            tableData: [
                // {
                //     id: '20191231112532671',
                //     title: 'Electron-跨平台桌面开发',
                //     status: 'published',
                //     date: '' 
                // }
            ],
            pageCurrent: 1,
            pageSize: 8,
            tatalNum: 0
        }
    }
}
</script>

<style>
.row-m-bottom {
    margin-bottom: 20px;
}
</style>
