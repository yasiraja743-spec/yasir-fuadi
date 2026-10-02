import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { marked } from "marked";
import DOMPurify from "dompurify";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import xml from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import powershell from "highlight.js/lib/languages/powershell";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import java from "highlight.js/lib/languages/java";
import kotlin from "highlight.js/lib/languages/kotlin";
import go from "highlight.js/lib/languages/go";
import rust from "highlight.js/lib/languages/rust";
import php from "highlight.js/lib/languages/php";
import ruby from "highlight.js/lib/languages/ruby";
import sql from "highlight.js/lib/languages/sql";
import yaml from "highlight.js/lib/languages/yaml";
import markdown from "highlight.js/lib/languages/markdown";
Object.entries({javascript,typescript,python,xml,css,json,bash,powershell,c,cpp,csharp,java,kotlin,go,rust,php,ruby,sql,yaml,markdown}).forEach(([n,l])=>hljs.registerLanguage(n,l));
hljs.registerAliases(["jsx","js","mjs"],{languageName:"javascript"});
hljs.registerAliases(["tsx","ts"],{languageName:"typescript"});
hljs.registerAliases(["html","svg"],{languageName:"xml"});
hljs.registerAliases(["sh","shell","zsh","console"],{languageName:"bash"});
hljs.registerAliases(["ps1","pwsh"],{languageName:"powershell"});
hljs.registerAliases(["py"],{languageName:"python"});
hljs.registerAliases(["yml"],{languageName:"yaml"});
hljs.registerAliases(["md"],{languageName:"markdown"});

const escHtml=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
marked.use({renderer:{code({text,lang}){
  const l=String(lang||"").trim().split(/\s+/)[0].toLowerCase();
  const known=l&&hljs.getLanguage(l);
  const body=known?hljs.highlight(text,{language:l,ignoreIllegals:true}).value:escHtml(text);
  return `<div class="code-block"><div class="code-head"><span>${escHtml(l||"text")}</span><button type="button" class="copy-btn">Copy</button></div><pre><code class="hljs">${body}</code></pre></div>`;
}}});
async function copyText(t){
  try{await navigator.clipboard.writeText(t)}catch{
    const a=document.createElement("textarea");a.value=t;a.style.cssText="position:fixed;opacity:0";document.body.append(a);a.select();document.execCommand("copy");a.remove();
  }
}

const blocks = [
  ["HELLO", "01"], ["CODE", "02"], ["BUILD", "03"], ["PLAY", "04"]
];

function Intro({done}) {
  return <div className={"intro " + (done ? "intro-out" : "")}>
    <div className="intro-grid"></div>
    <div className="intro-copy">
      <span>YASIR / 2026</span>
      <h1>WELCOME TO<br/><b>YASIR<br/>PORTFOLIO.</b></h1>
      <div className="intro-line"><i></i><span>LOADING CREATIVITY</span></div>
    </div>
  </div>
}

function Icon({name, size=20}) {
  const paths = {
    home: <><path d="M3 10.5 10 4l7 6.5"/><path d="M5 9.5V17h10V9.5"/><path d="M8 17v-4h4v4"/></>,
    chat: <><path d="M4 5.5h12v8H9l-4 3v-3H4z"/><path d="M7 9.5h6"/></>,
    game: <><rect x="3" y="6" width="14" height="9" rx="4"/><path d="M7 10v3M5.5 11.5h3M12.5 10.5h.01M14.5 12.5h.01"/></>,
    tool: <><path d="m6 4 4 4-6 6 2 2 6-6 4 4"/><path d="m13 4 3 3"/></>,
    project: <><rect x="3" y="4" width="14" height="13" rx="1"/><path d="M3 8h14M7 4v4"/></>,
    arrow: <><path d="M5 12h8"/><path d="m10 7 5 5-5 5"/></>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

function Header({openMenu, setOpenMenu}) {
  return <header className="topbar">
    <button className="menu-btn" onClick={()=>setOpenMenu(v=>!v)} aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
    <div className="brand">YASIR<span>.</span></div>
    <div className="top-tools"><span className="status-dot"></span><span className="top-code">FS.DEV / 001</span></div>
  </header>
}

function SideMenu({open, close}) {
  const go = p => { history.pushState({}, "", p); window.dispatchEvent(new Event("popstate")); close(); };
  return <aside className={"drawer "+(open?"drawer-open":"")}>
    <div className="drawer-head"><b>INDEX</b><button onClick={close}>×</button></div>
    {[
      ["/","HOME"],["/chat","CHAT AI"],["/games","GAMES"],["/games/block-blast","BLOCK BLAST"],["/games/space-shooter","SPACE SHOOTER"],
      ["/tools","TOOLS"],["/tools/tiktok","TIKTOK TOOL"],["/projects","PROJECTS"]
    ].map(([p,n])=><button key={p} onClick={()=>go(p)}>{n}<span>↗</span></button>)}
    <div className="drawer-foot">MADE FROM SCRATCH / NO STOCK ASSETS</div>
  </aside>
}

function Home({navigate}) {
  return <main>
    <section className="hero section-pad">
      <div className="hero-meta"><span>INDONESIA / WEB DEVELOPER</span><span>AVAILABLE FOR BUILDING</span></div>
      <div className="hero-title">
        <div className="stamp">YF<br/><small>2026</small></div>
        <h1>FULL-STACK<br/><em>DEVELOPER</em></h1>
      </div>
      <div className="hero-bottom">
        <p>HALO GUYS. SELAMAT DATANG DI<br/><strong>PORTFOLIO YASIR.</strong></p>
        <button className="arrow-btn" onClick={()=>navigate("/projects")}>EXPLORE <b>↓</b></button>
      </div>
    </section>

    <section className="ticker"><div>{Array(7).fill("CODE / CREATE / REPEAT / ").join("")}</div></section>

    <section className="about section-pad">
      <div className="section-kicker">01 / ABOUT</div>
      <div className="about-grid">
        <h2>I TURN<br/><span>IDEAS</span><br/>INTO THINGS.</h2>
        <div className="about-copy">
          <p>I'm Yasir, a full-stack developer who likes turning weird ideas into useful interfaces, tools and games.</p>
          <div className="fact-grid">
            <div><b>NAME</b><span>YASIR</span></div><div><b>ROLE</b><span>FULL-STACK DEV</span></div>
            <div><b>HOBBY</b><span>CODING</span></div><div><b>STYLE</b><span>BUILD / BREAK / FIX</span></div>
          </div>
        </div>
      </div>
    </section>

    <section className="cards section-pad">
      <div className="section-kicker">02 / WHAT I BUILD</div>
      <div className="feature-grid">
        {blocks.map(([a,n],i)=><button className={"feature f"+i} key={a} onClick={()=>navigate(i===3?"/games":"/projects")}>
          <span>{n}</span><h3>{a}</h3><small>EXPLORE →</small>
        </button>)}
      </div>
    </section>

    <section className="cta section-pad">
      <div><span>READY?</span><h2>LET'S BUILD<br/><i>SOMETHING.</i></h2></div>
      <button onClick={()=>navigate("/projects")}>VIEW PROJECTS ↗</button>
    </section>
  </main>
}

function Games({navigate}) {
  return <main className="page section-pad">
    <div className="page-head"><span>04 / GAMES</span><h1>PLAY<br/><i>MODE.</i></h1></div>
    <p className="lead">Two original browser games. No copyrighted sprites, no external game engine, just code.</p>
    <div className="game-list">
      <button onClick={()=>navigate("/games/block-blast")}><span>01</span><div><h2>BLOCK BLAST</h2><p>Original falling-block puzzle.</p></div><b>↗</b></button>
      <button onClick={()=>navigate("/games/space-shooter")}><span>02</span><div><h2>SPACE SHOOTER</h2><p>Original canvas arcade shooter.</p></div><b>↗</b></button>
    </div>
  </main>
}

const BLOCK_SHAPES = [
  [[1]], [[1,1]], [[1,1,1]], [[1,1,1,1]], [[1,1,1,1,1]],
  [[1],[1]], [[1],[1],[1]], [[1],[1],[1],[1]],
  [[1,1],[1,1]], [[1,1,1],[1,1,1]], [[1,1,1],[1,1,1],[1,1,1]],
  [[1,0],[1,1]], [[0,1],[1,1]], [[1,1],[1,0]], [[1,1],[0,1]],
  [[1,0],[1,1],[1,0]], [[0,1],[1,1],[0,1]],
  [[1,1,0],[0,1,1]], [[0,1,1],[1,1,0]],
  [[1,1,1],[0,1,0]], [[0,1,0],[1,1,1]]
];
const BLOCK_COLORS = ["lime","pink","blue","orange","violet"];

function randomPiece(){
  return BLOCK_SHAPES[Math.floor(Math.random()*BLOCK_SHAPES.length)];
}
function makePiece(){
  return {shape: randomPiece(), color: BLOCK_COLORS[Math.floor(Math.random()*BLOCK_COLORS.length)]};
}
function canPlace(board, shape, row, col){
  for(let y=0;y<shape.length;y++) for(let x=0;x<shape[y].length;x++) if(shape[y][x]){
    const gy=row+y,gx=col+x;
    if(gy<0||gy>=10||gx<0||gx>=10||board[gy][gx]) return false;
  }
  return true;
}
function BlockBlast(){
  const empty=()=>Array.from({length:10},()=>Array(10).fill(null));
  const [board,setBoard]=useState(empty);
  const [pieces,setPieces]=useState(()=>[makePiece(),makePiece(),makePiece()]);
  const [selected,setSelected]=useState(null);
  const [hover,setHover]=useState(null);
  const [score,setScore]=useState(0);
  const [best,setBest]=useState(()=>Number(localStorage.getItem('yasir-block-best')||0));
  const [over,setOver]=useState(false);

  const place=(pieceIndex,row,col)=>{
    if(over) return;
    const piece=pieces[pieceIndex];
    if(!piece || !canPlace(board,piece.shape,row,col)) return;
    const next=board.map(r=>r.slice());
    let cells=0;
    piece.shape.forEach((r,y)=>r.forEach((v,x)=>{if(v){next[row+y][col+x]={color:piece.color};cells++;}}));
    const fullRows=[];
    const fullCols=[];
    for(let y=0;y<10;y++) if(next[y].every(Boolean)) fullRows.push(y);
    for(let x=0;x<10;x++) if(next.every(r=>r[x])) fullCols.push(x);
    const clearCount=new Set([...fullRows,...fullCols]).size;
    const cleared=new Set([...fullRows.map(y=>`r${y}`),...fullCols.map(x=>`c${x}`)]);
    if(fullRows.length||fullCols.length){
      for(const y of fullRows) for(let x=0;x<10;x++) next[y][x]=null;
      for(const x of fullCols) for(let y=0;y<10;y++) next[y][x]=null;
    }
    const gained=cells*2+(clearCount?clearCount*clearCount*25:0);
    const nextScore=score+gained;
    setBoard(next);setScore(nextScore);setSelected(null);setHover(null);
    if(nextScore>best){setBest(nextScore);localStorage.setItem('yasir-block-best',String(nextScore));}
    const remaining=pieces.filter((_,i)=>i!==pieceIndex);
    const nextPieces=remaining.length?remaining:[makePiece(),makePiece(),makePiece()];
    setPieces(nextPieces);
    requestAnimationFrame(()=>{
      if(!nextPieces.some(p=>{for(let y=0;y<10;y++)for(let x=0;x<10;x++)if(canPlace(next,p.shape,y,x))return true;return false;})) setOver(true);
    });
  };
  const reset=()=>{setBoard(empty());setPieces([makePiece(),makePiece(),makePiece()]);setSelected(null);setHover(null);setScore(0);setOver(false)};
  const preview=(row,col)=>{
    if(selected===null)return;
    const p=pieces[selected];
    if(!p)return;
    if(!canPlace(board,p.shape,row,col)){setHover({row,col,valid:false});return;}
    setHover({row,col,valid:true});
  };
  return <main className="page game-page block-page">
    <div className="game-top"><div><span>ORIGINAL GAME / 01</span><h1>BLOCK<br/><i>BLAST.</i></h1></div><div className="score-pair"><div className="score"><small>SCORE</small><strong>{score}</strong></div><div className="score"><small>BEST</small><strong>{best}</strong></div></div></div>
    <p className="game-sub">Pick a block, tap a spot, clear rows and columns. No falling pieces.</p>
    <div className="block-wrap">
      <div className="block-board-new" aria-label="Block Blast board">
        {board.map((row,y)=>row.map((cell,x)=>{
          let previewOn=false, previewValid=false;
          if(hover&&selected!==null){const sh=pieces[selected]?.shape;previewOn=!!(sh&&y>=hover.row&&x>=hover.col&&y-hover.row<sh.length&&x-hover.col<sh[0].length&&sh[y-hover.row][x-hover.col]);previewValid=hover.valid;}
          return <button key={`${x}-${y}`} className={`blast-cell ${cell?'occupied '+cell.color:''} ${previewOn?'preview '+(previewValid?'good':'bad'):''}`} onMouseEnter={()=>preview(y,x)} onMouseLeave={()=>setHover(null)} onClick={()=>selected!==null&&place(selected,y,x)} aria-label={`row ${y+1} column ${x+1}`}></button>
        }))}
      </div>
      {over&&<div className="blast-overlay"><div><Icon name="game" size={32}/><b>NO MORE MOVES</b><span>SCORE {score}</span><button onClick={reset}>PLAY AGAIN</button></div></div>}
    </div>
    <div className="piece-tray">
      {pieces.map((p,i)=><button key={i} className={`piece-card ${selected===i?'selected':''}`} onClick={()=>setSelected(selected===i?null:i)} aria-label={`Select block ${i+1}`}>
        <div className="mini-shape" style={{'--piece-size': `${Math.max(24,Math.min(34,120/Math.max(p.shape.length,p.shape[0].length)))}px`}}>{p.shape.map((r,y)=>r.map((v,x)=><span key={`${x}-${y}`} className={v?p.color:''}></span>))}</div>
      </button>)}
    </div>
    <div className="blast-actions"><span>{selected===null?'SELECT A BLOCK':'TAP A BOARD CELL'}</span><button onClick={reset}>RESTART</button></div>
    <p className="game-note">10 × 10 BOARD · CLEAR FULL ROWS OR COLUMNS · SCORE + COMBO</p>
  </main>
}

function SpaceShooter(){
  const canvasRef=useRef(null), keys=useRef({}), raf=useRef(0), state=useRef(null), pointer=useRef(false);
  const [score,setScore]=useState(0),[dead,setDead]=useState(false);
  const reset=()=>{
    const c=canvasRef.current;
    state.current={x:c.width/2,y:c.height-70,bullets:[],enemies:[],particles:[],score:0,last:0,spawn:0,cool:0,dead:false};
    setScore(0);setDead(false);
  };
  useEffect(()=>{
    reset();
    const down=e=>{keys.current[e.key.toLowerCase()]=true;if(e.key===' ')e.preventDefault()};
    const up=e=>{keys.current[e.key.toLowerCase()]=false};
    addEventListener('keydown',down);addEventListener('keyup',up);
    return()=>{cancelAnimationFrame(raf.current);removeEventListener('keydown',down);removeEventListener('keyup',up)};
  },[]);
  useEffect(()=>{
    const c=canvasRef.current,ctx=c.getContext('2d');
    const loop=t=>{
      const s=state.current;
      if(!s){raf.current=requestAnimationFrame(loop);return;}
      const dt=Math.min((t-(s.last||t))/16.67,2);s.last=t;
      ctx.clearRect(0,0,c.width,c.height);
      const bg=ctx.createLinearGradient(0,0,0,c.height);bg.addColorStop(0,'#0b1020');bg.addColorStop(1,'#171b2d');ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);
      ctx.fillStyle='rgba(255,255,255,.65)';
      for(let i=0;i<55;i++){const sx=(i*73)%c.width, sy=(i*97+t*0.018*(1+i%3))%c.height;ctx.fillRect(sx,sy,1+(i%2),1+(i%2));}
      if(!s.dead){
        if(keys.current.arrowleft||keys.current.a)s.x-=7*dt;
        if(keys.current.arrowright||keys.current.d)s.x+=7*dt;
        s.x=Math.max(22,Math.min(c.width-22,s.x));
        if(keys.current[' ']||keys.current.space){if(s.cool<=0){s.bullets.push({x:s.x,y:s.y-24});s.cool=8;}} else s.cool=Math.max(0,s.cool-1);
        s.cool=Math.max(0,s.cool-1);
        s.bullets.forEach(b=>b.y-=11*dt);s.bullets=s.bullets.filter(b=>b.y>-30);
        s.spawn-=dt;if(s.spawn<=0){s.enemies.push({x:28+Math.random()*(c.width-56),y:-30,v:1.1+Math.random()*1.8,size:13,phase:Math.random()*6.28});s.spawn=Math.max(10,30-s.score/80);}
        s.enemies.forEach(e=>{e.y+=e.v*dt;e.x+=Math.sin((e.y/35)+e.phase)*0.7*dt;});
        for(const b of s.bullets){for(const e of s.enemies){if(Math.abs(b.x-e.x)<e.size+4&&Math.abs(b.y-e.y)<e.size+5){b.y=-999;e.y=c.height+999;s.score+=10;setScore(s.score);for(let i=0;i<8;i++)s.particles.push({x:e.x,y:e.y,vx:(Math.random()-.5)*4,vy:(Math.random()-.5)*4,life:18});}}}
        s.enemies=s.enemies.filter(e=>e.y<c.height+40);
        for(const e of s.enemies)if(e.y>c.height-95&&Math.abs(e.x-s.x)<25){s.dead=true;setDead(true);}
        s.particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.life--;});s.particles=s.particles.filter(p=>p.life>0);
      }
      // player ship
      ctx.save();ctx.translate(s.x,s.y);ctx.fillStyle='#c8ff00';ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,-23);ctx.lineTo(-20,16);ctx.lineTo(0,9);ctx.lineTo(20,16);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#ff4aa2';ctx.fillRect(-5,8,10,9);ctx.restore();
      ctx.fillStyle='#f7f4eb';s.bullets.forEach(b=>ctx.fillRect(b.x-2,b.y-10,4,12));
      s.enemies.forEach(e=>{ctx.save();ctx.translate(e.x,e.y);ctx.fillStyle='#ff4aa2';ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-13,-7);ctx.lineTo(-5,-13);ctx.lineTo(0,-7);ctx.lineTo(5,-13);ctx.lineTo(13,-7);ctx.lineTo(9,10);ctx.lineTo(-9,10);ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();});
      s.particles.forEach(p=>{ctx.fillStyle='#fff';ctx.fillRect(p.x,p.y,3,3)});
      if(s.dead){ctx.fillStyle='rgba(5,8,18,.78)';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='900 34px Arial';ctx.fillText('GAME OVER',c.width/2,c.height/2-10);ctx.font='700 14px monospace';ctx.fillText(`SCORE ${s.score}`,c.width/2,c.height/2+22);}
      raf.current=requestAnimationFrame(loop);
    };
    raf.current=requestAnimationFrame(loop);return()=>cancelAnimationFrame(raf.current);
  },[]);
  const hold=(key,on)=>e=>{e.preventDefault();keys.current[key]=on};
  const fire=()=>{keys.current[' ']=true;setTimeout(()=>keys.current[' ']=false,120)};
  const moveCanvas=e=>{const rect=canvasRef.current.getBoundingClientRect();const x=(e.clientX-rect.left)*(canvasRef.current.width/rect.width);if(state.current)state.current.x=Math.max(22,Math.min(canvasRef.current.width-22,x));};
  return <main className="page game-page shooter-page"><div className="game-top"><div><span>ORIGINAL GAME / 02</span><h1>SPACE<br/><i>SHOOTER.</i></h1></div><div className="score"><small>SCORE</small><strong>{score}</strong></div></div>
    <div className="shooter-frame"><canvas ref={canvasRef} className="shooter" width="420" height="620" onPointerMove={e=>pointer.current&&moveCanvas(e)} onPointerDown={e=>{pointer.current=true;moveCanvas(e);fire()}} onPointerUp={()=>pointer.current=false} onPointerLeave={()=>pointer.current=false}/></div>
    <div className="shooter-controls"><button onPointerDown={hold('arrowleft',true)} onPointerUp={hold('arrowleft',false)} onPointerLeave={hold('arrowleft',false)}>◀</button><button onPointerDown={fire}>FIRE</button><button onPointerDown={hold('arrowright',true)} onPointerUp={hold('arrowright',false)} onPointerLeave={hold('arrowright',false)}>▶</button><button onClick={reset}>RESTART</button></div>
    <p className="game-note">DRAG ON CANVAS · A/D OR ARROWS · FIRE TO SHOOT</p>
  </main>
}

const CHAT_STORE = "yasir-ai-chats-v5";
const DEFAULT_ASSISTANT = "Hey. I'm Yasir's portfolio assistant. Ask me anything about the projects, games, tools, or code.";

function makeChat(){
  const now=Date.now();
  return {id:crypto.randomUUID(),name:"New chat",createdAt:now,updatedAt:now,messages:[]};
}
function loadChats(){
  try{
    const raw=JSON.parse(localStorage.getItem(CHAT_STORE)||"[]");
    if(Array.isArray(raw)&&raw.length) return raw;
  }catch{}
  const first=makeChat();
  localStorage.setItem(CHAT_STORE,JSON.stringify([first]));
  return [first];
}
function saveChats(chats){localStorage.setItem(CHAT_STORE,JSON.stringify(chats));}

function escapeText(s){return String(s||"");}
function RichText({text}){
  const source=String(text||"");
  const html=DOMPurify.sanitize(marked.parse(source,{gfm:true,breaks:true}));
  const onClick=e=>{
    const b=e.target.closest?.(".copy-btn"); if(!b)return;
    const code=b.closest(".code-block")?.querySelector("code"); if(!code)return;
    copyText(code.textContent||"").then(()=>{b.textContent="Copied ✓";setTimeout(()=>{b.textContent="Copy"},1500)});
  };
  return <div className="rich-text" onClick={onClick} dangerouslySetInnerHTML={{__html:html}}/>;
}

function FolderIcon(){return <svg className="folder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7.5h7l2 2h9v9.5H3z"/><path d="M3 7.5V5h7l2 2"/></svg>}

function FolderIcon(){return <svg className="folder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7.5h7l2 2h9v9.5H3z"/><path d="M3 7.5V5h7l2 2"/></svg>}

function stripFolderMarker(text){
  const match=String(text||"").match(/<name\s+folder>\s*([\s\S]*?)\s*<\/name\s+folder>/i);
  return {name:match?.[1]?.trim()||"", text:String(text||"").replace(match?.[0]||"","").trim()};
}

function ChatMedia({item}){
  if(!item?.type)return null;
  if(item.type==="image") return <img className="msg-media" src={item.data} alt={item.name||"Uploaded image"}/>;
  if(item.type==="video") return <div className="generated-video"><video src={item.url} controls playsInline preload="metadata"/><a className="media-download" href={item.url} download="yasir-ai-video.mp4">↓ DOWNLOAD VIDEO</a></div>;
  return null;
}

function Chat(){
  const [chats,setChats]=useState(loadChats);
  const [activeId,setActiveId]=useState(()=>loadChats()[0]?.id);
  const [input,setInput]=useState("");
  const [attachment,setAttachment]=useState(null);
  const [loading,setLoading]=useState(false);
  const fileRef=useRef(null);
  const active=chats.find(c=>c.id===activeId)||chats[0];

  useEffect(()=>saveChats(chats),[chats]);

  const updateActive=fn=>setChats(prev=>prev.map(c=>c.id===activeId?fn(c):c));

  const newChat=()=>{
    const c=makeChat();
    setChats(prev=>[c,...prev]);
    setActiveId(c.id);
    setInput("");setAttachment(null);
  };

  const deleteChat=id=>{
    setChats(prev=>{
      const next=prev.filter(c=>c.id!==id);
      const safe=next.length?next:[makeChat()];
      if(id===activeId)setActiveId(safe[0].id);
      return safe;
    });
  };

  const pickFile=e=>{
    const f=e.target.files?.[0];
    if(!f)return;
    if(!f.type.startsWith("image/")){
      alert("Pilih file gambar: JPG, PNG, GIF atau WebP.");
      e.target.value="";return;
    }
    if(f.size>3*1024*1024){
      alert("Ukuran foto maksimal 3 MB (batas request Vercel).");
      e.target.value="";return;
    }
    const reader=new FileReader();
    reader.onload=()=>setAttachment({name:f.name,type:f.type,data:reader.result});
    reader.readAsDataURL(f);
    e.target.value="";
  };

  const send=async()=>{
    const q=input.trim();
    if((!q&&!attachment)||loading||!active)return;

    const content=[];
    if(q)content.push({type:"text",text:q});
    if(attachment)content.push({type:"image_url",image_url:{url:attachment.data}});

    const userMessage={
      role:"user",
      content:content.length===1&&content[0].type==="text"?q:content,
      media:attachment?{type:"image",name:attachment.name,data:attachment.data}:null
    };
    const nextMessages=[...active.messages,userMessage];
    updateActive(c=>({...c,messages:nextMessages,updatedAt:Date.now()}));
    setInput("");setAttachment(null);setLoading(true);

    try{
      const payload=nextMessages.map(m=>({role:m.role,content:m.content}));
      const r=await fetch("/chat",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({messages:payload})
      });
      const d=await r.json();
      if(!r.ok)throw new Error(d.error||"Request failed");

      const parsed=stripFolderMarker(d.reply||"");
      updateActive(c=>({
        ...c,
        messages:[...c.messages,{role:"assistant",content:parsed.text}],
        name:c.name==="New chat"&&parsed.name?parsed.name.slice(0,70):c.name,
        updatedAt:Date.now()
      }));
    }catch(error){
      updateActive(c=>({...c,messages:[...c.messages,{role:"assistant",content:`**AI error:** ${error.message}`}],updatedAt:Date.now()}));
    }finally{setLoading(false)}
  };

  const renderMedia=m=>m.media?<ChatMedia item={m.media}/>:null;

  return <main className="page chat-page chat-full">
    <div className="chat-layout">
      <aside className="chat-folders">
        <div className="folder-head"><div><span>CHAT AI</span><b>CONVERSATIONS</b></div><button onClick={newChat} aria-label="New chat">＋</button></div>
        <div className="folder-list">{chats.map(c=><div className={`folder-row ${c.id===activeId?"active":""}`} key={c.id}>
          <button className="folder-open" onClick={()=>setActiveId(c.id)}><FolderIcon/><span>{c.name}</span></button>
          <button className="folder-delete" onClick={()=>deleteChat(c.id)} aria-label="Delete chat">×</button>
        </div>)}</div>
        <div className="folder-note">EVERY CHAT HAS ITS OWN FOLDER.<br/>HISTORY IS SAVED IN THIS BROWSER.</div>
      </aside>

      <section className="chat-main">
        <div className="canvas-heading compact">
          <div><span>YASIR AI / CHAT WORKSPACE</span><h1>CHAT<br/><i>ROOM.</i></h1></div>
          <div className="chat-heading-actions"><button className="canvas-icon chat-folder-toggle" onClick={()=>document.querySelector(".chat-folders")?.classList.toggle("mobile-open")} aria-label="Open conversations">☰</button><div className="canvas-icon"><Icon name="chat" size={34}/></div></div>
        </div>

        <div className="chat-canvas">
          <div className="canvas-label">
            <span><button className="chat-folder-toggle canvas-icon" onClick={()=>document.querySelector(".chat-folders")?.classList.toggle("mobile-open")} aria-label="Open conversations">☰</button><FolderIcon/> {active?.name||"NEW CHAT"}</span>
            <span>{loading?"THINKING":"READY"}</span>
          </div>

          <div className="chatbox">
            {active?.messages.length===0&&
              <div className="chat-welcome">
                <Icon name="chat" size={25}/>
                <div><b>{DEFAULT_ASSISTANT}</b><span>Tanya apa saja atau kirim foto. Enter = kirim, Shift+Enter = baris baru.</span></div>
              </div>
            }

            {active?.messages.map((m,i)=>
              <div className={`msg ${m.role}`} key={i}>
                <div className="msg-head">
                  <span className="msg-icon"><Icon name={m.role==="user"?"home":"chat"} size={15}/></span>
                  <small>{m.role==="user"?"YOU":"YASIR AI"}</small>
                </div>
                {m.media?.type==="image"&&renderMedia(m)}
                {typeof m.content==="string"
                  ?<RichText text={m.content}/>
                  :<RichText text={(m.content||[]).filter(x=>x.type==="text").map(x=>x.text).join("\n")}/>}
                {m.media?.type==="video"&&renderMedia(m)}
              </div>
            )}

            {loading&&
              <div className="msg assistant">
                <div className="msg-head"><span className="msg-icon"><Icon name="chat" size={15}/></span><small>YASIR AI</small></div>
                <p className="typing"><b></b><b></b><b></b></p>
              </div>
            }
          </div>
        </div>

        {attachment&&
          <div className="attachment-preview">
            <img src={attachment.data} alt="Preview"/>
            <span>{attachment.name}</span>
            <button onClick={()=>setAttachment(null)}>×</button>
          </div>
        }

        <div className="chat-input chat-input-rich">
          <div className="composer">
            <button className="attach-btn" onClick={()=>fileRef.current?.click()} aria-label="Attach image">＋</button>
            <textarea
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}}
              placeholder="Ask Yasir AI or attach a photo..."
              disabled={loading}
            />
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" hidden onChange={pickFile}/>
          </div>
          <button onClick={send} disabled={loading||(!input.trim()&&!attachment)}>
            <Icon name="arrow" size={19}/>{loading?"WAIT":"SEND"}
          </button>
        </div>

      </section>
    </div>
  </main>
}
function Projects({navigate}) {
  return <main className="page section-pad"><div className="page-head"><span>03 / PROJECTS</span><h1>THINGS<br/><i>I BUILT.</i></h1></div><div className="project-grid">
    <article><div className="project-no">01</div><h2>AM PREMIUM</h2><p>Premium web experience and utility project.</p><a href="https://lucifer-am.us.ci" target="_blank">OPEN ↗</a></article>
    <article><div className="project-no">02</div><h2>TELEGRAM BOT</h2><p>Bot systems, RichMessage workflows and automation.</p><a href="https://t.me/olinnmdbot" target="_blank">OPEN ↗</a></article>
    <article className="project-dark"><div className="project-no">03</div><h2>ORIGINAL<br/>GAMES</h2><button onClick={()=>navigate("/games")}>PLAY ↗</button></article>
  </div></main>
}

function Tools({navigate}) {
  return <main className="page section-pad"><div className="page-head"><span>06 / TOOLS</span><h1>USEFUL<br/><i>STUFF.</i></h1></div><div className="tool-card"><span>01 / TIKTOK</span><h2>TIKTOK<br/>DOWNLOADER</h2><p>Downloader interface ready for a secure server-side provider integration.</p><button onClick={()=>navigate("/tools/tiktok")}>OPEN TOOL ↗</button></div></main>
}
function TikTok(){return <main className="page section-pad"><div className="page-head"><span>06.01 / TOOL</span><h1>TIKTOK<br/><i>DOWNLOADER.</i></h1></div><div className="tool-form"><input placeholder="Paste TikTok URL..." /><button>PROCESS ↗</button><small>Provider integration must run server-side. No credentials are stored in the browser.</small></div></main>}

function App(){
  const [intro,setIntro]=useState(true),[menu,setMenu]=useState(false),[path,setPath]=useState(location.pathname);
  useEffect(()=>{const f=()=>setPath(location.pathname);addEventListener("popstate",f);const t=setTimeout(()=>setIntro(false),2100);return()=>{removeEventListener("popstate",f);clearTimeout(t)}},[]);
  const navigate=p=>{history.pushState({}, "", p);setPath(p);scrollTo(0,0)};
  let content= path==="/chat"?<Chat/>:path==="/games"?<Games navigate={navigate}/>:path==="/games/block-blast"?<BlockBlast/>:path==="/games/space-shooter"?<SpaceShooter/>:path==="/tools"?<Tools navigate={navigate}/>:path==="/tools/tiktok"?<TikTok/>:path==="/projects"?<Projects navigate={navigate}/>:<Home navigate={navigate}/>;
  return <><Intro done={!intro}/><Header openMenu={menu} setOpenMenu={setMenu}/><SideMenu open={menu} close={()=>setMenu(false)}/>{content}{path!=="/chat"&&<footer><span>YASIR / FULL-STACK DEVELOPER</span><span>BUILT FROM SCRATCH / 2026</span></footer>}</>
}
createRoot(document.getElementById("root")).render(<App/>);