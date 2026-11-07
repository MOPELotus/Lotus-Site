import{_ as a,o as n,c as e,a2 as p}from"./chunks/framework.CHeM0PsO.js";const d=JSON.parse('{"title":"自动签到-多 profile","description":"","frontmatter":{},"headers":[],"relativePath":"projects/lotus-plugin/docs/features/checkin.md","filePath":"projects/lotus-plugin/docs/features/checkin.md"}'),l={name:"projects/lotus-plugin/docs/features/checkin.md"};function i(r,s,c,o,t,b){return n(),e("div",null,[...s[0]||(s[0]=[p(`<h1 id="自动签到-多-profile" tabindex="-1">自动签到-多 profile <a class="header-anchor" href="#自动签到-多-profile" aria-label="Permalink to &quot;自动签到-多 profile&quot;">​</a></h1><p>返回：<a href="./../checkin.html">上一级</a> / <a href="./../README.html">文档目录</a> / <a href="./README.html">小功能索引</a></p><h2 id="功能特性" tabindex="-1">功能特性 <a class="header-anchor" href="#功能特性" aria-label="Permalink to &quot;功能特性&quot;">​</a></h2><ul><li>签到按 profile 执行，刷新登录态、游戏签到、社区签到和通知都使用同一个 profile。</li><li>单个 profile 失败不会影响同一用户的其他 profile。</li><li>结果优先私聊通知；私聊不可用时在共同群聊 at 用户。</li><li>国际服和云游戏只在用户绑定对应 cookie/token 后参与签到。</li></ul><h2 id="指令用法" tabindex="-1">指令用法 <a class="header-anchor" href="#指令用法" aria-label="Permalink to &quot;指令用法&quot;">​</a></h2><div class="language-text vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">text</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#注册自动签到[profile]</span></span>
<span class="line"><span>#注册本群签到[profile]</span></span>
<span class="line"><span>#测试签到[profile]</span></span>
<span class="line"><span>#开始签到[profile]</span></span>
<span class="line"><span>#手动签到[profile]</span></span>
<span class="line"><span>#补签[profile]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#启用&lt;游戏&gt;签到[profile]</span></span>
<span class="line"><span>#关闭&lt;游戏&gt;签到[profile]</span></span>
<span class="line"><span>#启用全部游戏签到[profile]</span></span>
<span class="line"><span>#关闭全部游戏签到[profile]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#启用社区签到[profile]</span></span>
<span class="line"><span>#关闭社区签到[profile]</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#开启签到通知[profile]</span></span>
<span class="line"><span>#关闭签到通知[profile]</span></span>
<span class="line"><span>#绑定通知群[profile]</span></span>
<span class="line"><span>#设置通知私聊[profile]</span></span>
<span class="line"><span>#设置通知群聊[profile]</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br></div></div><h2 id="变量说明" tabindex="-1">变量说明 <a class="header-anchor" href="#变量说明" aria-label="Permalink to &quot;变量说明&quot;">​</a></h2><ul><li><code>profile</code>：可选，Lotus 内部 profile 序号，范围 <code>1..255</code>；省略时使用 profile 1。</li><li><code>游戏</code>：必填，支持 <code>原神</code>、<code>星铁</code>、<code>绝区零</code> 等已接入的游戏名。</li></ul>`,8)])])}const f=a(l,[["render",i]]);export{d as __pageData,f as default};
