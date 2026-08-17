"use client";
import "./qiuqiu.css";
import "./layout.css";
import { useEffect, useMemo, useRef, useState } from "react";
const themes=[["qiuqiu","秋秋同款","#d9898e","#f8f1f2"]];
const sample=`![工作台示例图](https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80)

# 1、认识你的 AI 工作台

这是文章导语。Markdown 适合用来快速组织文章结构，再通过主题统一转换成公众号排版。

正文支持 **重点加粗**、*斜体文字*、~~删除线~~、\`行内代码\`，也支持链接：[秋秋编辑器](https://example.com)。

---

## 1.1 插入图片

![工作台示例图](https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80)

图片会自动使用主题中的蓝色描边。

---

## 1.2 数据对比

| 功能 | 使用方式 | 状态 |
| --- | --- | --- |
| Markdown 编辑 | 左侧输入内容 | 已支持 |
| 实时预览 | 中间自动更新 | 已支持 |
| 主题切换 | 右侧选择主题 | 已支持 |
| 复制公众号 | 点击右上角按钮 | 已支持 |

---

## 1.3 为什么需要工作台

一个好的工作台，应该具备：

- 清晰的内容结构
- 稳定的排版风格
- 快速的编辑体验
- 一键复制到公众号

有序列表也可以这样写：

1. 明确文章主题
2. 整理文章结构
3. 添加图片和案例
4. 检查最终排版

---

## 1.4 一段引用

> 好的工具，不是功能越多越好，
> 而是刚好适合你的工作方式。

---

## 1.5 代码示例

行内代码示例：\`npm run dev\`

\`\`\`javascript
const editor = {
  name: "秋秋公众号编辑器",
  theme: "秋秋粉蓝",
  autoSave: true,
};

console.log(editor.name);
\`\`\`

---

# 2、认识你的 AI 工作台`;
const esc=(s:string)=>s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const inl=(s:string)=>esc(s).replace(/!\[([^\]]*)\]\(([^)]+)\)/g,'<img src="$2" alt="$1"/>').replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\[([ xX])\]/g,(_,state)=>'<span class="task-check '+(state.toLowerCase()==="x"?"done":"")+'">['+state+']</span>').replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/~~([^~]+)~~/g,"<del>$1</del>").replace(/\*([^*]+)\*/g,"<em>$1</em>").replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2">$1</a>');
function render(md:string){
  let html="", paragraph:string[]=[], listOpen=false, listTag="ul", code:string[]|null=null;
  const closeList=()=>{if(listOpen){html+="</"+listTag+">";listOpen=false}};
  const flush=()=>{if(paragraph.length){html+="<p>"+inl(paragraph.join(" "))+"</p>";paragraph=[]}};
  const table=(rows:string[])=>{const cells=(row:string[])=>row.map((c)=>"<td>"+inl(c.trim())+"</td>").join("");const head=rows[0].split("|").slice(1,-1);const body=rows.slice(2).map((r)=>"<tr>"+cells(r.split("|").slice(1,-1))+"</tr>").join("");return "<table><thead><tr>"+head.map((c)=>"<th>"+inl(c.trim())+"</th>").join("")+"</tr></thead><tbody>"+body+"</tbody></table>"};
  const lines=md.split(/\r?\n/);
  for(let i=0;i<lines.length;i++){const line=lines[i];const fence=line.match(/^\s*```(.*)$/);if(code){if(fence){html+="<pre><code>"+esc(code.join("\n"))+"</code></pre>";code=null}else code.push(line);continue}if(fence){closeList();flush();code=[];continue}
    const image=line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/),num=line.match(/^#{6}\s+(\d+)$/),h=line.match(/^(#{1,6})\s+(.*)$/),b=line.match(/^\s*[-*+]\s+(.*)$/),o=line.match(/^\s*\d+[.)、]\s+(.*)$/),isTable=line.includes("|")&&i+1<lines.length&&/^\s*\|?\s*:?-{3,}/.test(lines[i+1]);
    if(/^\s*(---+|___+|\*\s*\*\s*\*+)\s*$/.test(line)){closeList();flush();html+="<hr/>"}
    else if(isTable){closeList();flush();const rows=[line];i+=1;while(i<lines.length&&lines[i].includes("|")){rows.push(lines[i]);i++}i--;html+=table(rows)}
    else if(image){closeList();flush();html+="<img src=\""+esc(image[2])+"\" alt=\""+esc(image[1])+"\"/>"}
    else if(num){closeList();flush();html+="<div class=\"article-num\" style=\"display:block;margin:20px auto 10px;color:#D9898E;font-family:'Times New Roman',Times,serif;font-size:68px;font-weight:900;line-height:1;letter-spacing:-3px;text-align:center;\">"+num[1]+"</div>"}
    else if(h){closeList();flush();const level=h[1].length;const numbered=level===1?h[2].match(/^(\d+)\s*[、.．)）:]\s*(.+)$/):null;if(numbered)html+="<div class=\"article-num\" style=\"display:block;margin:20px auto 10px;color:#D9898E;font-family:'Times New Roman',Times,serif;font-size:68px;font-weight:900;line-height:1;letter-spacing:-3px;text-align:center;\">"+numbered[1]+"</div><h1 style=\"display:table;margin:8px auto 22px;padding:0 0 10px;color:#D9898E;font-size:19px;font-weight:900;line-height:1.45;text-align:center;border-bottom:1px solid #D9898E;\">"+inl(numbered[2])+"</h1>";else html+="<h"+level+">"+inl(h[2])+"</h"+level+">"}
    else if(b||o){flush();const tag=b?"ul":"ol";if(!listOpen||listTag!==tag){closeList();listTag=tag;html+="<"+tag+" style=\"list-style:none;padding-left:0;margin:12px 0 18px;\">";listOpen=true}html+="<li style=\"list-style:none;padding-left:1.55em;margin:6px 0;text-align:left;\">"+inl((b||o)![1])+"</li>"}
    else if(line.startsWith(">")){closeList();flush();html+="<blockquote>"+inl(line.replace(/^>\s?/,""))+"</blockquote>"}
    else if(!line.trim()){closeList();flush()}else{closeList();paragraph.push(line.trim())}
  }
  if(code)html+="<pre><code>"+esc(code.join("\n"))+"</code></pre>";closeList();flush();return html;
}
export default function Home(){const[md,setMd]=useState(sample),[tid,setTid]=useState("qiuqiu"),[copied,setCopied]=useState(false),ref=useRef<HTMLTextAreaElement>(null),file=useRef<HTMLInputElement>(null);const t=themes.find(x=>x[0]===tid)||themes[0],html=useMemo(()=>render(md),[md]);useEffect(()=>{const x=localStorage.getItem("qiuqiu-draft-v2");if(x)setMd(x)},[]);useEffect(()=>localStorage.setItem("qiuqiu-draft-v2",md),[md]);const add=(s:string)=>{const e=ref.current;if(!e)return;const a=e.selectionStart,b=e.selectionEnd;setMd(md.slice(0,a)+s+md.slice(b))};const copy=async()=>{const source=document.querySelector(".article-paper") as HTMLElement|null;if(source){const clone=source.cloneNode(true) as HTMLElement;const props=["color","font-family","font-size","font-weight","line-height","letter-spacing","text-align","margin","padding","background-color","border","border-left","border-bottom","display","width"];const paint=(node:HTMLElement,original:HTMLElement)=>{const cs=getComputedStyle(original);props.forEach(p=>node.style.setProperty(p,cs.getPropertyValue(p)));Array.from(node.children).forEach((child,i)=>{const originalChild=original.children[i] as HTMLElement|undefined;if(originalChild)paint(child as HTMLElement,originalChild)})};paint(clone,source);clone.querySelectorAll("ul li").forEach(li=>{const marker=document.createElement("span");marker.textContent="• ";marker.style.cssText="color:#3A8BE8;font-weight:700;";li.prepend(marker)});clone.querySelectorAll("ol li").forEach((li,i)=>{const marker=document.createElement("span");marker.textContent=(i+1)+". ";marker.style.cssText="color:#3A8BE8;font-weight:700;";li.prepend(marker)});try{await navigator.clipboard.write([new ClipboardItem({"text/html":new Blob([clone.outerHTML],{type:"text/html"}),"text/plain":new Blob([md],{type:"text/plain"})})])}catch{await navigator.clipboard.writeText(md)}setCopied(true);setTimeout(()=>setCopied(false),1500)}};return <main className="editor-shell"><header className="topbar"><div className="brand-lockup"><div className="brand-mark">秋</div><div><div className="brand-name">秋秋编辑器</div><div className="brand-subtitle">公众号 Markdown 排版工作台</div></div></div><div className="top-actions"><button className="quiet-button" onClick={()=>setMd(sample)}>恢复示例</button><button className="quiet-button" onClick={()=>file.current?.click()}>导入 Markdown</button><input ref={file} hidden type="file" accept=".md,.markdown,.txt" onChange={async e=>{const f=e.target.files?.[0];if(f)setMd(await f.text())}}/><button className="copy-button" onClick={copy}>{copied?"已复制 ✓":"复制到公众号"}</button></div></header><section className="workspace"><aside className="editor-panel"><div className="panel-heading"><div><span className="eyebrow">WRITE</span><h1>Markdown 草稿</h1></div><span className="save-dot">已自动保存</span></div><div className="toolbar"><button onClick={()=>add("**重点文字**")}>B</button><button onClick={()=>add("# 一级标题\n\n")}>H1</button><button onClick={()=>add("> 引用\n")}>❞</button><button onClick={()=>add("- 列表项\n")}>☷</button></div><textarea ref={ref} className="markdown-editor" value={md} onChange={e=>setMd(e.target.value)} spellCheck={false}/><div className="editor-footer"><span>{md.length} 字符</span><span>实时预览</span></div></aside><section className="preview-panel"><div className="preview-heading"><div><span className="eyebrow">PREVIEW</span><h2>公众号预览</h2></div><span className="preview-status"><i/>实时同步</span></div><div className="preview-stage"><article className="article-paper" style={{"--accent":t[2],"--soft":t[3]} as React.CSSProperties} dangerouslySetInnerHTML={{__html:html}}/></div></section><aside className="theme-panel"><div className="panel-heading compact"><div><span className="eyebrow">STYLE LAB</span><h2>主题</h2></div></div>{themes.map(x=><button key={x[0]} className={"theme-card "+(x[0]===tid?"selected":"")} onClick={()=>setTid(x[0])}><span className="theme-swatch" style={{background:x[2]}}/><span><strong>{x[1]}</strong><small>{x[0]==="qiuqiu"?"秋秋同款":""}</small></span><b>{x[0]===tid?"✓":""}</b></button>)}<div className="theme-note">✦ 主题可扩展<br/><small>后续可添加 AI、读书和生活方式主题。</small></div></aside></section></main>}
