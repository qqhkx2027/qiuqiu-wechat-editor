import test from "node:test";
import assert from "node:assert/strict";
import { renderWechat } from "../lib/wechat.ts";

test("微信导出：h1 生成章节数字 p + 标题，h2 生成 1.1｜ 前缀", () => {
  const html = renderWechat("# 认识工作台\n\n## 插入图片\n");
  assert.match(html, /<p style="[^"]*font-size:60px[^"]*">1<\/p>/);
  assert.match(html, /font-size:19px[^"]*color:#D9898E/);
  assert.match(html, /1\.1｜/);
});

test("微信导出：不使用 class，每个元素内联样式", () => {
  const html = renderWechat("正文 **重点**\n\n- 列表\n");
  assert.doesNotMatch(html, /\bclass=/);
  assert.match(html, /<p style="/);
  assert.match(html, /<strong/);
});

test("微信导出：章节数字不用 div/h1，用 p 包裹", () => {
  const html = renderWechat("# 第一章\n");
  assert.doesNotMatch(html, /<h1/);
  assert.match(html, /<p style="[^"]*">第一章<\/p>/);
});

test("微信导出：小节使用 p+span 前缀，不加 h2", () => {
  const html = renderWechat("# a\n## b\n");
  assert.doesNotMatch(html, /<h2/);
  assert.match(html, /<span[^>]*>1\.1｜<\/span>/);
});

test("微信导出：列表不使用 ::marker，蓝色前缀 span", () => {
  const html = renderWechat("- 甲\n- 乙\n");
  assert.match(html, /<ul style="[^"]*list-style:none/);
  assert.match(html, /<span style="color:#3A8BE8[^"]*">• <\/span>甲/);
  assert.match(html, /<span style="color:#3A8BE8[^"]*">• <\/span>乙/);
});

test("微信导出：危险链接/图片被净化", () => {
  const html = renderWechat("[x](javascript:alert(1))\n");
  assert.doesNotMatch(html, /javascript:/i);
});

test("微信导出：代码块、引用、分割线、表格", () => {
  const md = "> 引用\n\n---\n\n```js\nconst x=1;\n```\n\n| a | b |\n| --- | --- |\n| 1 | 2 |\n";
  const html = renderWechat(md);
  assert.match(html, /<section style="[^"]*border-left:3px solid #74AEEF/);
  assert.match(html, /<pre style="/);
  assert.match(html, /<table style="/);
  assert.match(html, /width:46px/);
});


test("微信导出：连续引用行合并为一个引用块", () => {
  const html = renderWechat("> 第一行\n> 第二行\n");
  assert.equal((html.match(/<section style="[^"]*border-left:3px solid #74AEEF/g) || []).length, 1);
  assert.match(html, /第一行<\/p><p style='margin:0 0 6px;'>第二行/);
});

test("微信导出：嵌套列表保留层级（ul>li>ul）", () => {
  const html = renderWechat("- 一级 A\n  - 二级 A1\n- 一级 B\n");
  assert.match(html, /<ul[^>]*>.*一级 A.*<ul[^>]*>.*二级 A1.*<\/ul>.*一级 B/s);
});

test("微信导出：首图无描边，正文图有描边", () => {
  const html = renderWechat("![首图](https://a.com/cover.jpg)\n\n![正文图](https://a.com/x.jpg)\n");
  const first = html.indexOf("cover.jpg");
  // 首图在前，不应带 border
  const firstImgTag = html.slice(first, first + 300);
  assert.doesNotMatch(firstImgTag, /border:1px solid #3A8BE8/);
  const secondImgTag = html.slice(html.indexOf("x.jpg"), html.indexOf("x.jpg") + 250);
  assert.match(secondImgTag, /border:1px solid #3A8BE8/);
});

test("微信导出：图片带 width:100% 且 src 转义", () => {
  const html = renderWechat("![图](https://a.com/x?a=1&b=2)\n");
  assert.match(html, /style="[^"]*width:100%/);
  assert.match(html, /src="https:\/\/a\.com\/x\?a=1&amp;b=2"/);
});

test("微信导出：行内代码/加粗/斜体/删除线都带内联样式", () => {
  const html = renderWechat("正文 `code` **重点** *斜体* ~~删线~~ [链接](https://example.com)\n");
  assert.match(html, /<code style="color:#12A98D[^"]*">code<\/code>/);
  assert.match(html, /<strong style="color:#3A8BE8;font-weight:700;">重点<\/strong>/);
  assert.match(html, /<em style="color:#3A8BE8;font-style:italic;">斜体<\/em>/);
  assert.match(html, /<span style="color:#3A8BE8;text-decoration:line-through;">删线<\/span>/);
  assert.match(html, /<a href="https:\/\/example\.com" style="color:#16B99A[^"]*">链接<\/a>/);
});

test("微信导出：章节标题内加粗继承粉红色", () => {
  const html = renderWechat("# 认识 **AI** 工作台\n");
  assert.match(html, /<strong style="color:#D9898E;font-weight:700;">AI<\/strong>/);
});

test("微信导出：手写编号的 h1/h2 不再叠加自动前缀", () => {
  const html = renderWechat("# 1、认识工作台\n\n## 1.1 小节\n");
  assert.doesNotMatch(html, /font-size:60px/);
  assert.doesNotMatch(html, /1\.1｜/);
});
