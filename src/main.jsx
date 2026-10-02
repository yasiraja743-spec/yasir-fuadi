import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

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

function Header({openMenu, setOpenMenu}) {
  return <header className="topbar">
    <button className="menu-btn" onClick={()=>setOpenMenu(v=>!v)} aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
    <div className="brand">YASIR<span>.</span></div>
    <div className="top-code">FS.DEV / 001</div>
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

const SHAPES = [
  [[1,1],[1,1]], [[1,1,1]], [[1,0],[1,1]], [[0,1],[1,1]], [[1,1,1,1]], [[1],[1],[1]], [[1,1,0],[0,1,1]]
];
function BlockBlast() {
  const W=8,H=12;
  const empty=()=>Array.from({length:H},()=>Array(W).fill(0));
  const [grid,setGrid]=useState(empty), [piece,setPiece]=useState(0), [x,setX]=useState(2), [y,setY]=useState(0), [score,setScore]=useState(0), [over,setOver]=useState(false);
  const shape=SHAPES[piece];
  const valid=(nx=x,ny=y,s=shape,g=grid)=>{
    return s.every((r,dy)=>r.every((v,dx)=>!v || (nx+dx>=0&&nx+dx<W&&ny+dy<H&&ny+dy>=0&&!g[ny+dy][nx+dx])));
  };
  const spawn=()=>{
    const p=Math.floor(Math.random()*SHAPES.length), s=SHAPES[p], sx=Math.floor((W-s[0].length)/2);
    setPiece(p);setX(sx);setY(0);
    if(!valid(sx,0,s,grid)) setOver(true);
  };
  useEffect(()=>{ if(over)return; const t=setInterval(()=>{
    if(valid(x,y+1)) setY(v=>v+1);
    else {
      const ng=grid.map(r=>r.slice()); shape.forEach((r,dy)=>r.forEach((v,dx)=>{if(v)ng[y+dy][x+dx]=1;}));
      const cleared=ng.filter(r=>r.every(Boolean)).length;
      const kept=ng.filter(r=>!r.every(Boolean)); while(kept.length<H) kept.unshift(Array(W).fill(0));
      setGrid(kept); setScore(s=>s+(cleared?cleared*100:10)); spawn();
    }
  },520); return()=>clearInterval(t)},[x,y,grid,piece,over]);
  useEffect(()=>{ const k=e=>{if(over)return;if(e.key==="ArrowLeft"&&valid(x-1,y))setX(v=>v-1);if(e.key==="ArrowRight"&&valid(x+1,y))setX(v=>v+1);if(e.key==="ArrowDown"&&valid(x,y+1))setY(v=>v+1);if(e.key===" "){e.preventDefault();let yy=y;while(valid(x,yy+1))yy++;setY(yy)}};addEventListener("keydown",k);return()=>removeEventListener("keydown",k)},[x,y,over]);
  const reset=()=>{setGrid(empty());setScore(0);setOver(false);setPiece(Math.floor(Math.random()*SHAPES.length));setX(2);setY(0)};
  return <main className="page game-page"><div className="game-top"><div><span>ORIGINAL GAME / 01</span><h1>BLOCK<br/><i>BLAST.</i></h1></div><div className="score">SCORE<strong>{score.toString().padStart(5,"0")}</strong></div></div>
    <div className="board-wrap"><div className="block-board">{grid.map((r,yy)=>r.map((v,xx)=>{
      let active=false; shape.forEach((rr,dy)=>rr.forEach((vv,dx)=>{if(vv&&xx===x+dx&&yy===y+dy)active=true}));
      return <div key={xx+"-"+yy} className={(v||active)?"cell filled":"cell"}></div>
    }))}</div>{over&&<div className="game-over"><b>GAME OVER</b><button onClick={reset}>RESTART</button></div>}</div>
    <div className="controls"><button onClick={()=>valid(x-1,y)&&setX(v=>v-1)}>←</button><button onClick={()=>valid(x,y+1)&&setY(v=>v+1)}>↓</button><button onClick={()=>valid(x+1,y)&&setX(v=>v+1)}>→</button><button onClick={()=>{let yy=y;while(valid(x,yy+1))yy++;setY(yy)}}>DROP</button></div>
    <p className="game-note">ARROWS / SPACE TO CONTROL · CLEAR FULL LINES</p>
  </main>
}

function SpaceShooter() {
  const ref=useRef(null), keys=useRef({}), raf=useRef(0), state=useRef(null);
  const [score,setScore]=useState(0),[running,setRunning]=useState(true);
  const reset=()=>{const c=ref.current;state.current={x:c.width/2,y:c.height-55,bullets:[],enemies:[],score:0,last:0,spawn:0,dead:false};setScore(0);setRunning(true)};
  useEffect(()=>{reset();const down=e=>keys.current[e.key.toLowerCase()]=true,up=e=>keys.current[e.key.toLowerCase()]=false;addEventListener("keydown",down);addEventListener("keyup",up);return()=>{cancelAnimationFrame(raf.current);removeEventListener("keydown",down);removeEventListener("keyup",up)}},[]);
  useEffect(()=>{const loop=t=>{const c=ref.current,s=state.current;if(!s||s.dead){raf.current=requestAnimationFrame(loop);return}const ctx=c.getContext("2d");if(!s.last)s.last=t;const dt=Math.min((t-s.last)/16.7,2);s.last=t;ctx.clearRect(0,0,c.width,c.height);
    ctx.fillStyle="#f5f1e8";ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle="#111";ctx.lineWidth=2;
    for(let i=0;i<30;i++){const yy=(i*37+t/18)%c.height;ctx.beginPath();ctx.moveTo((i*83)%c.width,yy);ctx.lineTo((i*83)%c.width,yy+2);ctx.stroke()}
    if(keys.current["arrowleft"]||keys.current["a"])s.x-=5*dt;if(keys.current["arrowright"]||keys.current["d"])s.x+=5*dt;s.x=Math.max(18,Math.min(c.width-18,s.x));
    if(keys.current[" "]||keys.current["space"]) {if(!s.cool)s.bullets.push({x:s.x,y:s.y});s.cool=9}else s.cool=Math.max(0,(s.cool||0)-1);
    s.bullets.forEach(b=>b.y-=8*dt);s.bullets=s.bullets.filter(b=>b.y>-20);s.spawn-=dt;if(s.spawn<=0){s.enemies.push({x:20+Math.random()*(c.width-40),y:-20,v:1.2+Math.random()*1.8});s.spawn=28}
    s.enemies.forEach(e=>e.y+=e.v*dt);for(const b of s.bullets)for(const e of s.enemies)if(Math.abs(b.x-e.x)<16&&Math.abs(b.y-e.y)<16){b.y=-100;e.y=c.height+100;s.score+=10;setScore(s.score)}
    for(const e of s.enemies)if(e.y>c.height-70&&Math.abs(e.x-s.x)<22)s.dead=true;s.enemies=s.enemies.filter(e=>e.y<c.height+30);
    ctx.fillStyle="#111";ctx.beginPath();ctx.moveTo(s.x,s.y-18);ctx.lineTo(s.x-17,s.y+14);ctx.lineTo(s.x,s.y+7);ctx.lineTo(s.x+17,s.y+14);ctx.closePath();ctx.fill();
    ctx.fillStyle="#111";s.bullets.forEach(b=>ctx.fillRect(b.x-2,b.y-8,4,12));s.enemies.forEach(e=>{ctx.strokeRect(e.x-11,e.y-11,22,22);ctx.fillRect(e.x-3,e.y-3,6,6)});
    if(s.dead){ctx.font="800 28px Arial";ctx.textAlign="center";ctx.fillText("SYSTEM DOWN",c.width/2,c.height/2);setRunning(false)} raf.current=requestAnimationFrame(loop)};raf.current=requestAnimationFrame(loop);return()=>cancelAnimationFrame(raf.current)},[]);
  return <main className="page game-page"><div className="game-top"><div><span>ORIGINAL GAME / 02</span><h1>SPACE<br/><i>SHOOTER.</i></h1></div><div className="score">SCORE<strong>{score.toString().padStart(5,"0")}</strong></div></div><canvas ref={ref} className="shooter" width="760" height="460"></canvas><div className="shooter-controls"><button onClick={()=>keys.current["arrowleft"]=true}>←</button><button onClick={()=>keys.current[" "]=true}>FIRE</button><button onClick={()=>keys.current["arrowright"]=true}>→</button><button onClick={()=>{if(!running){state.current.dead=false;setRunning(true)}}}>RESTART</button></div><p className="game-note">A/D OR ARROWS TO MOVE · SPACE TO FIRE</p></main>
}

function Chat() {
  const [messages,setMessages]=useState([{role:"assistant",content:"Hey. I'm Yasir's portfolio assistant. Ask me anything about the projects."}]),[input,setInput]=useState(""),[loading,setLoading]=useState(false);
  const send=async()=>{if(!input.trim()||loading)return;const q=input.trim();setInput("");setMessages(m=>[...m,{role:"user",content:q}]);setLoading(true);
    try { const r=await fetch("/chat", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q})}); const d=await r.json(); setMessages(m=>[...m,{role:"assistant",content:d.reply||"No server-side AI route is configured yet."}]); } catch { setMessages(m=>[...m,{role:"assistant",content:"AI backend isn't connected yet. Add your server-side integration before deploying."}]); } finally{setLoading(false)}
  };
  return <main className="page chat-page"><div className="page-head"><span>05 / CHAT</span><h1>TALK<br/><i>TO AI.</i></h1></div><div className="chatbox">{messages.map((m,i)=><div className={"msg "+m.role} key={i}><small>{m.role==="user"?"YOU":"YASIR AI"}</small><p>{m.content}</p></div>)}{loading&&<div className="msg assistant"><small>YASIR AI</small><p>THINKING...</p></div>}</div><div className="chat-input"><textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send()}}} placeholder="Type something..." /><button onClick={send}>SEND ↗</button></div></main>
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
  return <><Intro done={!intro}/><Header openMenu={menu} setOpenMenu={setMenu}/><SideMenu open={menu} close={()=>setMenu(false)}/>{content}<footer><span>YASIR / FULL-STACK DEVELOPER</span><span>BUILT FROM SCRATCH / 2026</span></footer></>
}
createRoot(document.getElementById("root")).render(<App/>);