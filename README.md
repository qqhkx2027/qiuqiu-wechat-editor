# qiuqiu-wechat-editor

秋秋公众号编辑器 · Qiuqiu WeChat Editor

一个面向微信公众号写作的 Markdown 实时排版工具：左侧编辑，右侧预览，顶部选择主题，最后复制为公众号兼容 HTML。

在线体验：<https://qqhkx2027.github.io/qiuqiu-wechat-editor/>

## 使用

1. 双击 `启动编辑器.command`。
2. 在左侧粘贴或编写 Markdown。
3. 点击「恢复示例」载入完整语法示例，或点击「导入 Markdown」打开本地文件。
4. 确认右侧预览后，点击「复制到公众号」，再粘贴到公众号后台。

内容会自动保存在当前浏览器中。

## 支持的 Markdown

- 一级、二级标题与自动章节序号
- 段落、链接、加粗、斜体、删除线、行内代码
- 无序列表、有序列表和任务清单
- 引用、分割线、图片
- 表格和 fenced 代码块

## 开发

需要 Node.js 22 或更高版本：

```bash
npm install
npm run dev
```

打开 <http://localhost:3000>。

验证构建和渲染测试：

```bash
npm test
```

## 目录说明

- `app/page.tsx`：编辑器交互与 Markdown 渲染
- `app/qiuqiu.css`：公众号主题样式
- `app/layout.css`：编辑器界面布局
- `Markdown草稿示例.md`：可导入的示例文章
- `worker/`、`vite.config.ts`、`.openai/`：Vinext/Sites 运行与部署配置
