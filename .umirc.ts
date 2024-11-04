import { defineConfig } from "umi";

//配置文件，包含 Umi 所有非运行时配置
export default defineConfig({
  esbuildMinifyIIFE: true,
  title: "东东单词卡",
  npmClient: 'pnpm',
  outputPath: 'indonesia.bahasaindo.cn',
  history: { type: 'hash' },
  hash: true,  //让 build 之后的产物包含 hash 后缀, 避免浏览器加载缓存
  mock: false, //关闭 Mock 功能
  clientLoader: {}, //路由数据预加载
  theme: {
    '@primary-color': '#1DA57A'
  },
  proxy: {
    //备用环境
    '/prod-api': {
      'target': 'http://bahasaindo.cn/prod-api/',
      'changeOrigin': true,
      'pathRewrite': { '^/prod-api' : '' },
    },
    //通义千问
    '/compatible-mode': {
      'target': 'https://dashscope.aliyuncs.com/compatible-mode/',
      'changeOrigin': true,
      'pathRewrite': { '^/compatible-mode' : '' },
    },
  },
  routes: [
    { path: "/", component: "home" },
    { path: "/home", component: "home", name: "Selamat datang 欢迎" },
    { path: "/login", component: "login", name: "Selamat datang 欢迎" },
    { path: "/courseCatalog", component: "courseCatalog", name: "单词类别" },
    { path: "/courseDetail", component: "courseDetail", name: "单词列表" },
    { path: "/collectWord", component: "collectWord", name: "收藏" },
    { path: "/wordSearch", component: "wordSearch", name: "单词搜索" },
    { path: "/aiDialogue", component: "aiDialogue", name: "AI查词" },
    { path: "/dataAnalysis", component: "dataAnalysis", name: "数据面板" },
    { path: "/setting", component: "setting", name: "设置" },
  ],
  alias: {},
  plugins: ['@umijs/plugins/dist/dva'],
  dva: {}
});
