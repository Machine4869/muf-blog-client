<template>
  <el-main style="padding: 0px;">
    <div class="about-content">
      <div>
        <h4>Muf Blog Client</h4>
        <ul>
          <li>Hexo桌面管理</li>
          <li>作者：Machine</li>
          <li>
            项目地址：
            <a
              @click="openUrl('https://github.com/machine4869/muf-blog-client')"
              href="#"
              >https://github.com/machine4869/muf-blog-client</a
            >
          </li>
          <li>
            博客：
            <a @click="openUrl('https://machine4869.gitee.io/')" href="#"
              >https://machine4869.gitee.io/</a
            >
          </li>
        </ul>
      </div>
      <div>
        <h4>技术支持：</h4>
        <ul>
          <li>
            <a @click="openUrl('https://github.com/electron/electron')" href="#"
              >electron</a
            >
          </li>
          <li>
            <a @click="openUrl('https://cn.vuejs.org')" href="#">Vue.js</a>
          </li>
          <li>
            <a @click="openUrl('http://element-cn.eleme.io')" href="#"
              >element-ui</a
            >
          </li>
        </ul>
      </div>
    </div>

  </el-main>
</template>

<script>
export default {
  data() {
    return {
      qrcodeVisible: false
    };
  },
  created() {},
  methods: {
    openUrl(url) {
      require("electron").shell.openExternal(url);
    },
    openQrcode() {
      this.qrcodeVisible = true;
    }
  }
};
</script>

<style scoped>
.about-content a{
  color: #1591AA;
}
.about-content {
  font-size: 16px;
}

.about-content ul li {
  padding: 6px;
}
</style>
