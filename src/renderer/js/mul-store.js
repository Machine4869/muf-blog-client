const Store = require('electron-store')
const store = new Store()

const key = {
    hexoPath:'user.hexoPath',
    backupRepo:'user.backupRepo',
    blogURL:'user.blogURL',
    draftDirName:'user.draftDirName',
    isServerLoading: 'blog.isServerLoading',
    articleList: 'blog.articleList'
}

export default{
    key,
    // 清空数据库
    clear: function(){
        store.clear()
    },
    // 初始化数据库
    initData: function(){
        this.set(this.key.draftDirName,'_draft')
        this.set(this.key.isServerLoading,false)
    },
    // 删除
    delete: function(key){
        // console.log(param)
        store.delete(key)
    },
    set: function(key,value){
        if(value==null){
            store.delete(key)
        }else{
            store.set(key,value)
        }
    },
    get: function(key){
        return store.get(key)
    }
}