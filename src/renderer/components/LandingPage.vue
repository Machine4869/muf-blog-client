<template>
    <div id="window">
      <el-container>

        <!-- 左侧-- LOGO | 导航菜单 -->
        <div style="background-color:#2e3033">
          
          <!-- LOGO -->
          <el-row class="menu-head">
            <router-link to="/home" class="logo">
              <span  class="logo-icon iconfont iconlogo-cat"></span><span class="logo-text" v-if="showLogoText">Muf</span>
            </router-link>
          </el-row>

          <!-- 导航菜单 -->
          <el-scrollbar style="height:100%;">
            <el-menu 
              class="el-menu-vertical"
              style="border:none"
              :collapse="isCollapse" 
              :default-active="$route.path"
              :collapse-transition="true"
              background-color="#2e3033"
              :router="true">
              <el-menu-item index="/home" class="menu-item">
                <i class="el-icon-s-home"></i>
                <span slot="title">主页</span>
              </el-menu-item>
              <el-menu-item index="/article" class="menu-item">
                <i class="el-icon-s-order"></i>
                <span slot="title">管理文章</span>
              </el-menu-item>
              <el-menu-item index="/settings" class="menu-item">
                <i class="el-icon-s-tools"></i>
                <span slot="title">配置</span>
              </el-menu-item>
              <el-menu-item index="/about" class="menu-item">
                <i class="el-icon-info"></i>
                <span slot="title">关于</span>
              </el-menu-item>
            </el-menu>
          </el-scrollbar>
        </div>

        <!-- 右侧-- 窗口控制 | 内容区-->
        <el-container>
          
          <!-- 窗口控制 -->
          <el-header height='26px;' class="main-header">
            <a class="fold-btn" @click="menuControl()" href="#">
                <i :class="foldIcon"></i>
            </a>

            <a @click="onHandleControllWindow('close')" class="window-menu-btn window-menu-btn-close el-icon-close"></a>
            <a @click="onHandleControllWindow('plus')" class="window-menu-btn iconfont iconplus"></a>
            <a @click="onHandleControllWindow('minus')" class="window-menu-btn  el-icon-minus"></a>
          </el-header>

          <!-- 内容区 -->
          <el-scrollbar class="main-content">
              <router-view></router-view>
          </el-scrollbar>

        </el-container>
      </el-container>
    </div>

</template>

<script>
  import { ipcRenderer} from 'electron'
  export default {
    data() {
      return {
        showLogoText: false,
        isCollapse: false,
        asideWidth: '150px',
        menuControlClass: 'menu-control-open',
        menuControlIcon: 'el-icon-d-arrow-left',
        foldIcon: 'el-icon-s-fold'
      };
    },
    methods: {
      onHandleControllWindow(action){
        // 向主进程请求
        if(action=='close') {
          ipcRenderer.send('window-close')
        }else if(action=='plus') {
          ipcRenderer.send('window-plus')
        }else if(action=='minus') {
          ipcRenderer.send('window-minus')
        }
        
        console.log(action)
      },
      menuControl() {
        this.isCollapse = !this.isCollapse

        // this.showLogoText = !this.showLogoText

        this.foldIcon = this.isCollapse?'el-icon-s-unfold':'el-icon-s-fold'
      }
    },
    created:function(){
    }
  }
</script>

<style lang="scss">
  .el-scrollbar .el-scrollbar__wrap{
    overflow-x: hidden;
  }
  .main-content {
    height: 100%;
    padding: 20px;
  }


  #window {
    height: 100%;
  }
  .window-menu-btn {
    -webkit-app-region: no-drag;
    font-size: 16px;
    font-weight: bold;
    line-height: 26px;
    width: 40px;
    text-align: center;
    float: right;
  }
  .window-menu-btn:hover {
    background-color: #dedede;
    color: #363b40;
  }
  .window-menu-btn-close:hover {
    background-color: red;
    color: #dedede;
  }
  
  /* 解决折叠动画的BUG */
  .el-menu-vertical:not(.el-menu--collapse) {
    width: 150px;
  }
  .aside{

    /* background-color:#545c64; */
  }
  /* 修改图表颜色，和文字保持一致 */
  .el-menu-item i {
      color: #dedede;
  }

  // 窗口菜单
  .main-header {
    // 可拖动窗口
    -webkit-app-region: drag;

    padding-left: 10px;
    padding-right: 0;
    /* background-color: bisque; */
    height: 26px;
    line-height: 26px;
    font-size: 20px;
    overflow: hidden;
  }
  .main-header .fold-btn {
    // 折叠图标拖动需要失效
    -webkit-app-region: no-drag;
    display: inline-block;
    height: 26px;
    width: 26px;
    /* background-color: blueviolet; */
    text-align:center;
    color: #dedede;
  }


  // 导航
  .menu-head {
    height: 56px;
    line-height: 56px;
    text-align:center;
  }
  .menu-head .logo{
    display: inline-block;
    width: 100%;
    height: 56px;
    color: #1591AA;
    font-size: 35px;
    
  }
  .menu-head .logo-icon {
    font-size: 35px;
  }

  .menu-item:hover {
    background-color: #363b40!important;
  }
  /* .menu-head .logo-text {
    font-size: 35px;
  } */
</style>
