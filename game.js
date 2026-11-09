/* TURBO KICK – kompaktes Browser-Fussballspiel (5 gegen 5).
   Koordinaten: Meter. Feld 105 x 68, Ursprung links oben. Team 0 greift nach rechts an. */
(() => {
'use strict';
const FW = 105, FH = 68, GW = 7.32, MY = FH / 2;
const TEAMS = [
  { n: 'FC Nordwind', a: '#e63946', b: '#ffffff' }, { n: 'Aurora United', a: '#2f6df6', b: '#ffd23f' },
  { n: 'Sporting Delta', a: '#1fbf6a', b: '#10331f' }, { n: 'Blitz Rovers', a: '#f4a300', b: '#222222' }];
[[82, 76, 70], [74, 84, 78], [70, 72, 88], [88, 70, 66]].forEach((v, i) => { [TEAMS[i].at, TEAMS[i].mi, TEAMS[i].de] = v; }); // Stärkewerte
const HOME = [[0.04, 0.5], [0.25, 0.28], [0.25, 0.72], [0.5, 0.35], [0.5, 0.65]]; // GK + 4 Feldspieler
const DIFF = [{ n: 'Anfänger', sp: 0.8, ac: 0.35, rt: 0.5 }, { n: 'Profi', sp: 0.92, ac: 0.18, rt: 0.25 }, { n: 'Weltklasse', sp: 1.05, ac: 0.06, rt: 0.1 }];
/* Styles werden zusätzlich hier eingebettet, damit das Spiel auch ohne geladene style.css funktioniert */
(function(){const st=document.createElement('style');st.textContent=`html,body{margin:0;height:100%;overflow:hidden;background:#06101a;font-family:'Segoe UI',Arial,sans-serif;color:#fff}
:root{--gr:#5dff8f;--gr2:#18b84d;--go:#ffb300;--go2:#ff9a00}
#c{position:fixed;inset:0;width:100%;height:100%;display:block}
#ui{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none;font-size:2.2vmin}
#ui .box{pointer-events:auto;background:linear-gradient(160deg,rgba(22,44,76,.9),rgba(6,14,26,.94));border:.2vmin solid rgba(120,220,255,.35);border-radius:3vmin;padding:4vmin 6vmin;text-align:center;min-width:44vmin;max-width:92vw;box-shadow:0 2vmin 8vmin rgba(0,0,0,.6);animation:pop .4s ease-out}
@keyframes pop{from{transform:scale(.92);opacity:0}to{transform:none;opacity:1}}
h2{font-size:4.5vmin;margin:0 0 2vmin;text-transform:uppercase;letter-spacing:.4vmin}
button{font-size:2.6vmin;padding:1.2vmin 4vmin;border-radius:5vmin;border:0;background:linear-gradient(180deg,#5dff8f,#18b84d);color:#032210;font-weight:800;cursor:pointer;margin:1.2vmin .5vmin;box-shadow:0 .6vmin 0 #0c6b2b,0 1.4vmin 3vmin rgba(0,0,0,.4)}
button:hover{filter:brightness(1.1)}
.small{font-size:1.7vmin;opacity:.75;margin-top:2vmin;line-height:1.6}
/* ===== Menüsystem ===== */
.scr{position:fixed;inset:0;pointer-events:auto;display:flex;flex-direction:column;box-sizing:border-box;animation:slide .45s cubic-bezier(.2,.8,.2,1);user-select:none}
@keyframes slide{from{opacity:0;transform:translateX(-4vmin)}to{opacity:1;transform:none}}
@keyframes rise{from{opacity:0;transform:skewX(-10deg) translateX(-6vmin)}to{opacity:1;transform:skewX(-10deg)}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes inL{from{opacity:0;transform:translateX(-8vmin)}to{opacity:1;transform:none}}
@keyframes inR{from{opacity:0;transform:translateX(8vmin)}to{opacity:1;transform:none}}
@keyframes inU{from{opacity:0;transform:translateY(3vmin)}to{opacity:1;transform:none}}
@keyframes shine{from{background-position:130% 0,0 0}to{background-position:-130% 0,0 0}}
@keyframes fall{to{transform:translateY(112vh) rotate(720deg)}}
.still,.still *{animation:none!important}
.mb{position:relative;display:flex;align-items:center;gap:2vmin;margin:1.3vmin 0;padding:1.6vmin 4vmin 1.6vmin 2.4vmin;font-size:3vmin;font-weight:800;font-style:italic;letter-spacing:.3vmin;text-transform:uppercase;color:#fff;cursor:pointer;background:linear-gradient(90deg,rgba(255,255,255,.17),rgba(255,255,255,.03));border-left:1vmin solid var(--gr);white-space:nowrap;transform:skewX(-10deg);transition:transform .16s,background .16s,box-shadow .16s;animation:rise .55s backwards cubic-bezier(.2,.8,.2,1)}
.mb>*{transform:skewX(10deg)}
.mb svg{width:3.4vmin;height:3.4vmin;flex:none;fill:currentColor}
.mb small{display:block;font-size:1.6vmin;font-weight:600;letter-spacing:.3vmin;opacity:.7}
.mb:hover{background:linear-gradient(90deg,var(--gr),var(--gr2));color:#032210;transform:skewX(-10deg) translateX(1.6vmin);box-shadow:0 0 3vmin rgba(93,255,143,.35)}
.mb:active{transform:skewX(-10deg) translateX(1.6vmin) scale(.97)}
.mb.big{font-size:3.4vmin;border-left-color:var(--go);background:linear-gradient(90deg,rgba(255,179,0,.45),rgba(255,179,0,.08))}
.mb.big:hover{background:linear-gradient(90deg,#ffd23f,var(--go2));color:#2a1500;box-shadow:0 0 3.5vmin rgba(255,170,0,.45)}
.main{justify-content:center}
.side{position:relative;width:70vmin;height:100%;padding:0 15vmin 0 7vmin;box-sizing:border-box;display:flex;flex-direction:column;justify-content:center;background:linear-gradient(90deg,rgba(3,8,18,.95) 0,rgba(3,8,18,.84) 78%,rgba(3,8,18,.62));clip-path:polygon(0 0,100% 0,84% 100%,0 100%)}
.slant{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.slant line{stroke:var(--go);stroke-width:4;vector-effect:non-scaling-stroke;opacity:.9}
.logo span{display:block;width:max-content;font-size:14vmin;line-height:.86;font-weight:900;font-style:italic;letter-spacing:-.4vmin;background:linear-gradient(105deg,transparent 42%,rgba(255,255,255,.95) 50%,transparent 58%) 130% 0/260% 100% no-repeat,linear-gradient(180deg,#fff,#9fb4d0);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 .6vmin 0 rgba(0,0,0,.5));animation:shine 5s 1s infinite}
.logo span+span{background:linear-gradient(105deg,transparent 42%,rgba(255,255,255,.95) 50%,transparent 58%) 130% 0/260% 100% no-repeat,linear-gradient(180deg,#fff7b0,#ffb300 55%,#ff5e1a);-webkit-background-clip:text;background-clip:text;margin-bottom:1.5vmin;filter:drop-shadow(0 .6vmin 0 #7a1f0a) drop-shadow(0 0 3vmin rgba(255,150,0,.45))}
.tag{display:flex;align-items:center;gap:1.4vmin;font-size:1.7vmin;letter-spacing:.7vmin;white-space:nowrap;opacity:.85;margin:0 0 5vmin}
.tag::before{content:'';width:5vmin;height:.4vmin;background:var(--go)}
.ver{position:absolute;left:7vmin;bottom:3vmin;font-size:1.5vmin;opacity:.55}
.nx{position:absolute;right:5vmin;top:4.5vmin;padding:1.8vmin 2.6vmin 2vmin;background:linear-gradient(160deg,rgba(14,28,50,.86),rgba(4,9,18,.9));border:.2vmin solid rgba(120,220,255,.3);border-top:.5vmin solid var(--go);border-radius:1.6vmin;box-shadow:0 1.4vmin 5vmin rgba(0,0,0,.55);backdrop-filter:blur(.8vmin);pointer-events:none;animation:inU .7s .4s backwards cubic-bezier(.2,.8,.2,1)}
.nx .t{font-size:1.4vmin;letter-spacing:.6vmin;opacity:.7;margin-bottom:1.1vmin}
.nx .m{display:flex;align-items:center;gap:1.4vmin;font-size:2.1vmin;font-weight:800;font-style:italic;text-transform:uppercase}
.nx .m b{color:var(--go);font-size:1.8vmin}
.nx .p{display:flex;gap:.8vmin;margin-top:1.3vmin}
.nx .p i{font-style:normal;font-size:1.4vmin;letter-spacing:.25vmin;padding:.5vmin 1.3vmin;border-radius:5vmin;background:rgba(255,255,255,.13)}
.cr{position:relative;isolation:isolate;display:inline-grid;place-items:center;flex:none;width:var(--s,6vmin);height:var(--s,6vmin);border-radius:50%;background:var(--b);color:var(--b);font-style:italic;font-weight:900;font-size:calc(var(--s,6vmin)*.52);box-shadow:0 .4vmin 1.2vmin rgba(0,0,0,.5)}
.cr::before{content:'';position:absolute;inset:10%;border-radius:50%;background:var(--a);z-index:-1}
.setup,.ctl{padding:3vmin 5vmin;background:linear-gradient(180deg,rgba(3,8,18,.92),rgba(3,8,18,.55) 55%,rgba(3,8,18,.92))}
.hd{position:relative;display:flex;align-items:baseline;gap:3vmin;border-bottom:.3vmin solid rgba(255,255,255,.18);padding-bottom:1.5vmin}
.hd::after{content:'';position:absolute;left:0;bottom:-.3vmin;width:18vmin;height:.3vmin;background:var(--go)}
.hd h2{font-size:5.5vmin;font-style:italic;margin:0}
.crumb{color:var(--go);letter-spacing:.6vmin;font-size:2vmin}
.arena{flex:1;display:flex;align-items:center;justify-content:center;gap:3vmin;min-height:0}
.tp{position:relative;width:36vmin;height:56vmin;padding:2.2vmin 3vmin 2.4vmin;box-sizing:border-box;clip-path:polygon(0 0,100% 0,100% 95%,94% 100%,0 100%);border-top:.6vmin solid var(--a);box-shadow:inset 0 0 6vmin rgba(0,0,0,.35)}
.tp.l{animation:inL .55s backwards cubic-bezier(.2,.8,.2,1)}
.tp.r{animation:inR .55s backwards cubic-bezier(.2,.8,.2,1)}
.tp .top{display:flex;align-items:center;justify-content:space-between}
.lbl{font-size:1.6vmin;letter-spacing:.6vmin;opacity:.8}
.kitw{position:relative;width:19vmin;height:19vmin;margin:.6vmin auto 1.2vmin}
.kitw::before{content:'';position:absolute;inset:-14%;background:radial-gradient(circle,rgba(255,255,255,.26),rgba(255,255,255,0) 66%)}
.kitw svg{position:relative;width:100%;height:100%;filter:drop-shadow(0 1vmin 1.2vmin rgba(0,0,0,.6))}
.nm{display:flex;align-items:center;justify-content:space-between;gap:.8vmin;white-space:nowrap;font-size:2.2vmin;font-weight:900;font-style:italic;text-transform:uppercase}
.nm span{flex:1;text-align:center}
.nm u{text-decoration:none;cursor:pointer;padding:.6vmin 1.1vmin;background:rgba(255,255,255,.14);transform:skewX(-10deg);transition:background .12s,transform .12s}
.nm u:hover{background:var(--gr);color:#032210;transform:skewX(-10deg) scale(1.1)}
.ovr{display:flex;align-items:center;gap:2vmin;margin:1.4vmin 0 1.2vmin}
.ring{position:relative;flex:none;width:10vmin;height:10vmin;border-radius:50%;display:grid;place-items:center;background:conic-gradient(#fff calc(var(--v)*1%),rgba(255,255,255,.14) 0)}
.ring::before{content:'';position:absolute;inset:1vmin;border-radius:50%;background:#0b1526}
.ring b{position:relative;font-size:4.4vmin;font-style:italic;font-weight:900;color:var(--go)}
.ovt .ol2{font-size:1.5vmin;letter-spacing:.5vmin;opacity:.7;margin-bottom:.6vmin}
.ovt .bst{font-size:1.3vmin;letter-spacing:.3vmin;opacity:.8;line-height:1.5}
.ovt .bst strong{font-size:1.9vmin;letter-spacing:.2vmin;color:#fff;opacity:1}
.st{display:flex;align-items:center;gap:1vmin;font-size:1.5vmin;margin:.8vmin 0}
.st em{font-style:normal;width:11vmin;text-align:left;opacity:.8;letter-spacing:.2vmin}
.st div{flex:1;height:1.1vmin;background:rgba(0,0,0,.5);border-radius:1vmin;overflow:hidden}
.st s{display:block;height:100%;border-radius:1vmin}
.st b{width:3.2vmin;text-align:right}
.mid{width:34vmin;display:flex;flex-direction:column;gap:2.2vmin;animation:inU .55s .1s backwards}
.vsb{font-size:9vmin;font-weight:900;font-style:italic;text-align:center;color:var(--go);text-shadow:0 0 3vmin rgba(255,150,0,.7);line-height:1}
.ol{font-size:1.5vmin;letter-spacing:.5vmin;opacity:.75;margin-bottom:.6vmin}
.dsc{font-size:1.4vmin;letter-spacing:.2vmin;opacity:.65;margin-top:.7vmin;min-height:1.8vmin}
.seg{display:flex;gap:.5vmin}
.seg b{flex:1;padding:1.1vmin .5vmin;font-size:1.9vmin;font-weight:800;text-align:center;cursor:pointer;background:rgba(255,255,255,.1);transform:skewX(-10deg);transition:background .12s,transform .12s}
.seg b:hover{background:rgba(255,255,255,.25)}
.seg b.on{background:linear-gradient(180deg,#5dff8f,#18b84d);color:#032210;box-shadow:0 0 2vmin rgba(93,255,143,.4)}
.ft{display:flex;justify-content:space-between;align-items:center;gap:3vmin}
.ft .mb{margin:0}
.sum{flex:1;text-align:center;font-size:1.7vmin;letter-spacing:.4vmin;opacity:.7;text-transform:uppercase}
.ctl .cols{flex:0 1 auto;display:flex;gap:3vmin;justify-content:center;align-items:stretch;padding-top:3vmin;min-height:0}
.ctl .ft{margin-top:auto}
.cc{background:rgba(6,14,28,.84);border-top:.5vmin solid var(--c,#5dff8f);padding:2.4vmin 3vmin;min-width:34vmin;animation:inU .5s backwards}
.cc:nth-child(2){animation-delay:.08s}.cc:nth-child(3){animation-delay:.16s}
.cc h3{margin:0 0 1.5vmin;font-size:2.6vmin;font-style:italic;letter-spacing:.3vmin;color:var(--c,#ffb300)}
.pad{display:grid;grid-template-columns:repeat(3,auto);gap:.7vmin;justify-content:center;margin:.6vmin 0 .6vmin}
.pad kbd:nth-child(1){grid-area:1/2}.pad kbd:nth-child(2){grid-area:2/1}.pad kbd:nth-child(3){grid-area:2/2}.pad kbd:nth-child(4){grid-area:2/3}
.pad kbd{min-width:5vmin;padding:1.2vmin 1.2vmin;font-size:2.4vmin}
.padl{text-align:center;font-size:1.7vmin;letter-spacing:.4vmin;opacity:.75;margin-bottom:1.4vmin;padding-bottom:1.4vmin;border-bottom:.2vmin solid rgba(255,255,255,.12)}
.kr{display:flex;justify-content:space-between;align-items:center;gap:3vmin;margin:1vmin 0;font-size:2vmin}
.kr>span:first-child{display:flex;align-items:center;gap:1.2vmin}
.kr .d{display:block;width:.9vmin;height:2.4vmin;border-radius:.4vmin;transform:skewX(-10deg);flex:none}
.tip{--c:#ffb300}
.tip li{margin:0 0 1.4vmin;font-size:1.8vmin;line-height:1.45;opacity:.9;list-style:none;position:relative;padding-left:2.4vmin}
.tip li::before{content:'';position:absolute;left:0;top:.8vmin;width:1vmin;height:1vmin;background:var(--go);transform:rotate(45deg)}
.tip ul{margin:0;padding:0;max-width:30vmin}
kbd{display:inline-block;min-width:3vmin;padding:.6vmin 1.2vmin;margin:.2vmin;border-radius:.8vmin;background:linear-gradient(180deg,#fff,#c9d2de);color:#0b1220;font:800 1.9vmin Arial;box-shadow:0 .4vmin 0 #7c8798;text-align:center}
.pov{position:fixed;inset:0;pointer-events:auto;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse at center,rgba(3,8,18,.5),rgba(3,8,18,.88));backdrop-filter:blur(.7vmin);animation:fade .35s ease-out;user-select:none;overflow:hidden}
.pan{position:relative;width:76vmin;max-width:94vw;box-sizing:border-box;padding:3vmin 4vmin 2.6vmin;background:linear-gradient(160deg,rgba(20,40,72,.95),rgba(5,11,22,.97));border:.2vmin solid rgba(120,220,255,.3);border-top:.7vmin solid var(--go);border-radius:2vmin;box-shadow:0 2vmin 8vmin rgba(0,0,0,.65);animation:pop .4s cubic-bezier(.2,.8,.2,1);text-align:center}
.eb{font-size:1.5vmin;letter-spacing:.8vmin;opacity:.7;margin-bottom:.8vmin}
.pan h2{font-size:5.4vmin;font-style:italic;margin:0 0 .6vmin}
.hl{font-size:7vmin;font-weight:900;font-style:italic;text-transform:uppercase;letter-spacing:.5vmin;line-height:1.05;background:linear-gradient(180deg,#fff7b0,#ffb300 55%,#ff5e1a);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 .5vmin 0 #7a1f0a) drop-shadow(0 0 2.4vmin rgba(255,150,0,.4))}
.hl.lose{background:linear-gradient(180deg,#eef3fa,#8fa3bd);-webkit-background-clip:text;background-clip:text;filter:drop-shadow(0 .5vmin 0 #26324a)}
.hl.draw{background:linear-gradient(180deg,#e2f6ff,#4dd2ff);-webkit-background-clip:text;background-clip:text;filter:drop-shadow(0 .5vmin 0 #0d3b52)}
.rs{font-size:2.1vmin;letter-spacing:.3vmin;opacity:.85;margin-bottom:.4vmin}
.sb{display:flex;align-items:center;justify-content:center;gap:2.6vmin;margin:1.8vmin 0 1vmin}
.sb .tm{display:flex;flex-direction:column;align-items:center;gap:.9vmin;width:20vmin}
.sb .tn{font-size:1.9vmin;font-weight:800;font-style:italic;text-transform:uppercase;line-height:1.15}
.sb .sc{font-size:8vmin;font-weight:900;font-style:italic;color:var(--go);line-height:1;text-shadow:0 .5vmin 0 rgba(0,0,0,.5);letter-spacing:.6vmin;white-space:nowrap}
.clk{font-size:2vmin;letter-spacing:.5vmin;color:#ffe14d;font-weight:700;margin-bottom:1.4vmin}
.cmp{margin:1.2vmin 0 1vmin}
.cmp .r{display:grid;grid-template-columns:7vmin 1fr 7vmin;align-items:center;gap:1.2vmin;margin:1.1vmin 0;font-size:2.1vmin;font-weight:800}
.cmp .r em{display:block;font-style:normal;font-size:1.4vmin;letter-spacing:.4vmin;opacity:.7;margin-bottom:.5vmin;font-weight:600}
.cmp .bars{display:flex;gap:.4vmin}
.cmp .bars i{flex:1;height:1vmin;background:rgba(255,255,255,.1);display:flex;border-radius:1vmin;overflow:hidden}
.cmp .bars i:first-child{justify-content:flex-end}
.cmp .bars s{display:block;height:100%}
.cmp .r b:first-child{text-align:right}.cmp .r b:last-child{text-align:left}
.pan .bt{margin-top:1.8vmin}
.pan .mb{justify-content:center;margin:1.1vmin 0;padding-right:2.4vmin}
.pan .bt.row{display:flex;gap:2vmin}.pan .bt.row .mb{flex:1;font-size:2.6vmin;padding:1.5vmin 1.4vmin}.pan .bt.row .mb.big{font-size:2.8vmin}
.cf{position:absolute;inset:0;pointer-events:none}
.cf i{position:absolute;top:-4vmin;width:1.1vmin;height:1.9vmin;opacity:.92;animation:fall linear infinite}
`;document.head.appendChild(st);})();
const cv = document.getElementById('c'), g = cv.getContext('2d'), ui = document.getElementById('ui');
let W, H;
const rs = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; };
addEventListener('resize', rs); rs();
const $ = id => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), rnd = Math.random, dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/* ---------- Audio (synthetisch) ---------- */
const Audio_ = {
  ctx: null, on: true,
  beep(f, d, type = 'sine', v = 0.15, f2) {
    if (!this.on) return;
    try {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      const c = this.ctx, o = c.createOscillator(), gn = c.createGain();
      o.type = type; o.frequency.setValueAtTime(f, c.currentTime);
      if (f2) o.frequency.linearRampToValueAtTime(f2, c.currentTime + d);
      gn.gain.setValueAtTime(v, c.currentTime); gn.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d);
      o.connect(gn); gn.connect(c.destination); o.start(); o.stop(c.currentTime + d);
    } catch (e) { /* Audio nicht verfügbar */ }
  },
  kick() { this.beep(160, 0.08, 'square', 0.2, 60); }, click() { this.beep(600, 0.05, 'triangle'); },
  whistle() { this.beep(2600, 0.5, 'sine', 0.12, 2400); }, post() { this.beep(900, 0.25, 'triangle', 0.25, 700); },
  goal() { [0, 1, 2, 3, 4].forEach(i => setTimeout(() => this.beep(300 + i * 90, 0.35, 'sawtooth', 0.08), i * 120)); }
};

/* ---------- Eingabe ---------- */
const keys = {};
addEventListener('keydown', e => { keys[e.code] = true; if (e.code === 'Escape' && S.phase === 'play') pause(); if (e.code === 'Space') e.preventDefault(); });
addEventListener('keyup', e => { keys[e.code] = false; });
const P1 = { u: 'KeyW', d: 'KeyS', l: 'KeyA', r: 'KeyD', sp: 'Space', pass: 'KeyJ', lob: 'KeyK', shot: 'KeyL', thr: 'KeyI', sw: 'ShiftLeft' };

/* ---------- Spielzustand ---------- */
const cfg = { t0: 0, t1: 1, diff: 1, mins: 3, sound: true };
let S = {}, players = [], ball = {}, cam = { x: MY, y: MY, z: 1 }, parts = [];

function mkTeam(t, ti) {
  return HOME.map((h, i) => ({ team: ti, gk: i === 0, hx: ti ? 1 - h[0] : h[0], hy: h[1], x: 0, y: 0, vx: 0, vy: 0, f: ti ? Math.PI : 0, num: [1, 4, 7, 8, 10][i], stam: 1, lock: 0, anim: 0, act: 0, hold: 0 }));
}
function kickoff(side) {
  players.forEach(p => { p.x = p.hx * FW * (p.gk ? 1 : 0.9 + (p.team ? -0.0 : 0)); p.x = p.team ? FW - (1 - p.hx) * FW * 0.95 + 0 : p.hx * FW * 0.95; p.y = p.hy * FH; if (!p.gk) p.x = clamp(p.x, p.team ? MY + 52.5 - 52.5 + 2 : 2, p.team ? FW - 2 : FW / 2 - 2); p.vx = p.vy = 0; p.lock = 0; });
  // Team 0 links der Mitte, Team 1 rechts der Mitte
  players.forEach(p => { if (!p.gk) { const m = p.hx; p.x = p.team ? FW / 2 + 4 + (m - 0.5 > 0 ? 0 : 0) : FW / 2 - 4; p.x = p.team ? FW - (1 - p.hx) * FW * 0.9 : p.hx * FW * 0.9; p.x = p.team ? Math.max(p.x, FW / 2 + 2) : Math.min(p.x, FW / 2 - 2); } });
  const k = players.filter(p => p.team === side && !p.gk)[3]; k.x = FW / 2 - (side ? -1 : 1) * 1.2; k.y = MY;
  ball = { x: FW / 2, y: MY, z: 0, vx: 0, vy: 0, vz: 0, rot: 0, owner: null, last: side };
  ball.owner = k; k.f = side ? Math.PI : 0;
  S.ctl = [players.find(p => p.team === 0 && !p.gk && p !== undefined), players.find(p => p.team === 1 && !p.gk)];
  S.ctl[0] = side === 0 ? k : players[3];
}
function newMatch() {
  players = [...mkTeam(TEAMS[cfg.t0], 0), ...mkTeam(TEAMS[cfg.t1], 1)];
  S = { phase: 'play', score: [0, 0], time: 0, total: cfg.mins * 60, half: 1, msg: '', msgT: 0, stats: [{ sh: 0, ps: 0, pos: 0, fl: 0, co: 0 }, { sh: 0, ps: 0, pos: 0, fl: 0, co: 0 }], charge: 0, charge2: 0, pauseT: 0, ctl: [] };
  parts = []; kickoff(0); ui.innerHTML = ''; say('ANSTOSS', 1.5); Audio_.whistle();
}
function say(m, t) { S.msg = m; S.msgT = t; }

/* ---------- Aktionen ---------- */
function kick(p, dx, dy, pow, lift) {
  const l = Math.hypot(dx, dy) || 1;
  const err = p.team === 1 && !p.human ? DIFF[cfg.diff].ac : 0.03;
  const a = Math.atan2(dy, dx) + (rnd() - 0.5) * err * 2;
  ball.vx = Math.cos(a) * pow; ball.vy = Math.sin(a) * pow; ball.vz = lift; ball.owner = null; ball.last = p.team;
  p.lock = 0.35; p.act = 0.25; Audio_.kick(); if (pow > 24) S.shake = Math.max(S.shake || 0, .25);
  for (let i = 0; i < 10; i++) parts.push({ x: p.x, y: p.y, z: 0.2, vx: (rnd() - .5) * 4, vy: (rnd() - .5) * 4, vz: rnd() * 3, life: .6, c: i % 3 ? '#6bbf59' : '#7a5632' });
}
function passTarget(p) {
  let best = null, bs = -1e9;
  players.forEach(q => {
    if (q.team !== p.team || q === p) return;
    const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy) || 1, dot = (dx * Math.cos(p.f) + dy * Math.sin(p.f)) / d;
    if (dot < 0.4 || d < 4) return;
    const s = dot * 3 - d * 0.04 + (q.team ? -q.x : q.x) * 0.01;
    if (s > bs) { bs = s; best = q; }
  });
  return best;
}
function doPass(p, lob, m = 1) {
  const q = passTarget(p); S.stats[p.team].ps++;
  if (q) { const d = Math.hypot(q.x - p.x, q.y - p.y), t = d / (lob ? 18 : 20); kick(p, q.x + q.vx * t - p.x, q.y + q.vy * t - p.y, clamp(d * (lob ? 1.0 : 1.35), 9, 26) * m, (lob ? 6 : 0) * m); }
  else kick(p, Math.cos(p.f), Math.sin(p.f), 15 * m, (lob ? 5 : 0) * m);
}
function doShot(p, power) {
  const gx = p.team ? 0 : FW, keeper = players.find(q => q.team !== p.team && q.gk);
  // Ecke waehlen: meist die Seite, auf der der Torwart nicht steht
  let side = keeper && Math.abs(keeper.y - MY) > 0.4 ? (keeper.y > MY ? -1 : 1) : (rnd() < 0.5 ? -1 : 1);
  if (rnd() < 0.2) side = -side;
  const ty = MY + side * (GW / 2 - 0.55 - rnd() * 0.35);
  S.stats[p.team].sh++;
  p.f = Math.atan2(ty - p.y, gx - p.x);
  kick(p, gx - p.x, ty - p.y, 14 + power * 20, 0.8 + power * 1.6);
}
/* Torwart-Abstoss / Abschlag: hoher, weiter Ball auf einen freien Mitspieler in Richtung gegnerisches Tor */
function gkKick(p) {
  const atk = p.team ? -1 : 1; let best = null, bs = -1e9;
  players.forEach(q => {
    if (q.team !== p.team || q.gk) return;
    const d = Math.hypot(q.x - p.x, q.y - p.y); if (d < 20) return;
    let od = 12; players.forEach(o => { if (o.team !== p.team) od = Math.min(od, Math.hypot(o.x - q.x, o.y - q.y)); });
    const s = (q.x - p.x) * atk * 0.06 + od * 0.5 - Math.abs(q.y - MY) * 0.03;
    if (s > bs) { bs = s; best = q; }
  });
  const tx = best ? best.x + best.vx * 0.8 : FW / 2 + atk * 8, ty = best ? best.y + best.vy * 0.8 : MY + (rnd() - 0.5) * 20;
  const dx = tx - p.x, dy = ty - p.y, d = Math.hypot(dx, dy), lift = 8, T = 2 * lift / 9.8;
  p.f = Math.atan2(dy, dx); S.stats[p.team].ps++;
  kick(p, dx, dy, clamp(d / T * 1.2, 20, 32), lift);
}
function nearestToBall(team) {
  let b = null, bd = 1e9;
  players.forEach(p => { if (p.team !== team || p.gk) return; const d = dist(p, ball); if (d < bd) { bd = d; b = p; } });
  return b;
}
function setPiece(team, x, y, gkTake) {
  players.forEach(p => { p.vx = p.vy = 0; });
  let p = gkTake ? players.find(q => q.team === team && q.gk) : null;
  if (!p) { let bd = 1e9; players.forEach(q => { if (q.team === team && !q.gk) { const d = Math.hypot(q.x - x, q.y - y); if (d < bd) { bd = d; p = q; } } }); }
  p.x = x; p.y = y; ball = { x, y, z: 0, vx: 0, vy: 0, vz: 0, rot: 0, owner: p, last: team };
  p.f = team ? Math.PI : 0; p.hold = 0.8; p.lock = 0;
  S.ctl[team] = gkTake ? S.ctl[team] : p;
  if (team === 0) S.ctl[team] = gkTake ? nearestToBall(team) : p;
}

/* ---------- KI ---------- */
function ai(p, dt) {
  const D = DIFF[cfg.diff], atk = p.team ? -1 : 1, gx = p.team ? 0 : FW, own = ball.owner;
  let tx = p.x, ty = p.y, sp = 1, wantSprint = false;
  if (p.gk) {
    const gl = p.team ? FW - 1.5 : 1.5;
    tx = gl; ty = clamp(ball.y, MY - 5, MY + 5);
    const inBox = Math.abs(ball.x - (p.team ? FW : 0)) < 14 && Math.abs(ball.y - MY) < 18;
    if (own === p) { p.hold -= dt; tx = p.x; ty = p.y; if (p.hold <= 0) gkKick(p); }
    else if (inBox && !own) { tx = ball.x; ty = ball.y; wantSprint = true; }
    else if (inBox) { tx = gl + atk * 4; }
  } else if (own === p) {
    tx = gx; ty = MY + (p.y - MY) * 0.5;
    const dg = Math.abs(gx - p.x);
    p.hold += dt;
    if (p.hold > D.rt && (dg < 22 && rnd() < dt * 3)) { p.f = Math.atan2(MY - p.y, gx - p.x); doShot(p, 0.5 + rnd() * 0.5); p.hold = 0; }
    else if (p.hold > D.rt + 0.3 && rnd() < dt * 1.5) { const near = players.some(q => q.team !== p.team && dist(p, q) < 5); if (near || rnd() < 0.3) { doPass(p, rnd() < 0.2); p.hold = 0; } }
    wantSprint = p.stam > 0.4;
  } else {
    const ch = nearestToBall(p.team), mine = own && own.team === p.team;
    if (!mine && p === ch && !(own && own.gk)) { tx = ball.x + ball.vx * 0.2; ty = ball.y + ball.vy * 0.2; wantSprint = true; }
    else {
      const shift = (ball.x - FW / 2) * 0.35 + (mine ? atk * 12 : 0);
      tx = clamp(p.hx * FW + shift, 3, FW - 3); ty = p.hy * FH + (ball.y - MY) * 0.25;
      if (mine && p !== own) wantSprint = false;
    }
  }
  p.human = false;
  move(p, tx - p.x, ty - p.y, dt, wantSprint, (p.team ? D.sp : 1) * (p.gk ? 0.9 : 1), Math.hypot(tx - p.x, ty - p.y) < 0.6);
}
function move(p, dx, dy, dt, sprint, mult, still) {
  const l = Math.hypot(dx, dy); let sp = 0;
  if (l > 0.01 && !still) { dx /= l; dy /= l; sp = 6.2 * mult * (sprint && p.stam > 0.02 ? 1.45 : 1); if (sprint && p.stam > 0.02) p.stam -= dt * 0.18; }
  if (!sprint) p.stam = Math.min(1, p.stam + dt * 0.07);
  p.vx += (dx * sp - p.vx) * Math.min(1, dt * 8); p.vy += (dy * sp - p.vy) * Math.min(1, dt * 8);
  if (sp > 0) p.f = Math.atan2(dy, dx);
  p.x = clamp(p.x + p.vx * dt, 0.5, FW - 0.5); p.y = clamp(p.y + p.vy * dt, 0.5, FH - 0.5);
  p.anim += Math.hypot(p.vx, p.vy) * dt * 1.6; if (Math.hypot(p.vx, p.vy) > 8 && rnd() < dt * 16) parts.push({ x: p.x, y: p.y, z: .1, vx: -p.vx * .2 + (rnd() - .5), vy: -p.vy * .2 + (rnd() - .5), vz: 1 + rnd(), life: .5, c: '#9ac985' });
}
function human(p, K, dt, idx) {
  p.human = true;
  const dx = (keys[K.r] ? 1 : 0) - (keys[K.l] ? 1 : 0), dy = (keys[K.d] ? 1 : 0) - (keys[K.u] ? 1 : 0);
  move(p, dx, dy, dt, keys[K.sp], 1.05, false);
  const own = ball.owner === p;
  if (own && p.lock <= 0) {
    if (keys[K.thr] && !K.t) { K.t = 1; const g2 = p.team ? 0 : FW; kick(p, Math.cos(p.f) * 10 + (g2 - p.x) * .0, Math.sin(p.f) * 10, 24, 0.5); S.stats[p.team].ps++; }
  }
  // J / K gedrückt halten lädt den Pass auf, beim Loslassen wird gespielt (Tippen = normal, voll = sehr hart)
  [['pass', false, 'pc'], ['lob', true, 'lc']].forEach(([key, lob, id]) => { const f = id + (idx + 1); if (keys[K[key]]) S[f] = Math.min(1, (S[f] || 0) + dt * 1.4); else if (S[f] > 0) { if (own && p.lock <= 0) doPass(p, lob, .85 + S[f] * 1.0); S[f] = 0; } });
  if (!keys[K.pass]) K.p = 0; if (!keys[K.lob]) K.q = 0; if (!keys[K.thr]) K.t = 0;
  // Schuss mit Aufladebalken (auch ohne Ball laden, Auslösen beim Loslassen)
  const ck = idx ? 'charge2' : 'charge';
  if (keys[K.shot]) S[ck] = Math.min(1, S[ck] + dt * 1.1);
  else if (S[ck] > 0) { if (own) doShot(p, S[ck]); S[ck] = 0; }
  if (keys[K.sw] && !K.s) { K.s = 1; S.ctl[idx] = nearestToBall(p.team) === p ? players.filter(q => q.team === p.team && !q.gk && q !== p).sort((a, b) => dist(a, ball) - dist(b, ball))[0] : nearestToBall(p.team); }
  if (!keys[K.sw]) K.s = 0;
}

/* ---------- Update ---------- */
function update(dt) {
  if (S.phase !== 'play') return;
  S.msgT -= dt;
  if (S.freeze > 0) { S.freeze -= dt; if (S.msg === 'TOR!') { const k = Math.min(1, dt * 2); cam.z += (1.25 - cam.z) * k; cam.x += (ball.x - cam.x) * k; cam.y += (ball.y - cam.y) * k; } updateParts(dt); if (S.freeze <= 0) { kickoff(S.next); say('ANSTOSS', 1); Audio_.whistle(); } return; }
  S.time += dt;
  if (S.half === 1 && S.time >= S.total / 2) { S.half = 2; S.freeze = 2.5; S.next = 1; say('HALBZEIT', 2.5); Audio_.whistle(); }
  if (S.time >= S.total) return endMatch();
  // Auto-Wechsel für Spieler ohne Ball in Reichweite
  [0].forEach(t => { const c = S.ctl[t]; if (!c || (ball.owner !== c && nearestToBall(t) !== c && (!ball.owner || ball.owner.team !== t) && dist(c, ball) > 9)) S.ctl[t] = nearestToBall(t); if (ball.owner && ball.owner.team === t && !ball.owner.gk) S.ctl[t] = ball.owner; });
  players.forEach(p => {
    p.lock -= dt; p.act -= dt;
    if (S.ctl[0] === p) human(p, P1, dt, 0);
    else ai(p, dt);
  });
  // Spieler-Kollision (weich)
  for (let i = 0; i < players.length; i++) for (let j = i + 1; j < players.length; j++) {
    const a = players[i], b = players[j], d = dist(a, b);
    if (d < 1 && d > 0.001) { const n = (1 - d) / 2; a.x += (a.x - b.x) / d * n; a.y += (a.y - b.y) / d * n; b.x -= (a.x - b.x) / d * n; b.y -= (a.y - b.y) / d * n; }
  }
  // Ball
  const o = ball.owner;
  if (o) {
    ball.x = o.x + Math.cos(o.f) * 0.8; ball.y = o.y + Math.sin(o.f) * 0.8; ball.z = 0; ball.vx = o.vx; ball.vy = o.vy; ball.rot += Math.hypot(o.vx, o.vy) * dt;
    S.stats[o.team].pos += dt; ball.last = o.team;
    if (rnd() < dt * 8 && Math.hypot(o.vx, o.vy) > 5) parts.push({ x: o.x, y: o.y, z: 0.1, vx: (rnd() - .5) * 2, vy: (rnd() - .5) * 2, vz: 1 + rnd(), life: .4, c: '#7ac96a' });
  } else {
    ball.x += ball.vx * dt; ball.y += ball.vy * dt; ball.z += ball.vz * dt; ball.vz -= 9.8 * dt;
    if (ball.z <= 0) { ball.z = 0; if (ball.vz < -1.5) { ball.vz *= -0.55; } else ball.vz = 0; }
    const fr = Math.pow(ball.z > 0 ? 0.995 : 0.97, dt * 60); ball.vx *= fr; ball.vy *= fr; ball.rot += Math.hypot(ball.vx, ball.vy) * dt;
  }
  // Ballübernahme / Zweikampf
  if (!ball.owner || true) players.forEach(p => {
    if (p.lock > 0 || ball.z > 1.3 || p === ball.owner) return;
    const d = dist(p, ball), reach = p.gk ? 1.8 : 1.0;
    if (d > reach) return;
    if (ball.owner) {
      if (ball.owner.team !== p.team && !p.gk && rnd() < dt * (cfg.diff + 1.5) * 1.8 && ball.owner.lock <= 0) { ball.owner.lock = 0.5; ball.owner = p; p.hold = 0; S.ctl[p.team] = p; }
    } else {
      const sp = Math.hypot(ball.vx, ball.vy);
      if (p.gk && sp > 12) { if (rnd() < 0.7 - cfg.diff * 0.1 && ball.z < 2.4) { ball.owner = p; p.hold = 1; Audio_.beep(300, .1, 'square', .2); say('PARADE!', 1); } else { ball.vx *= -0.5; ball.vy += (rnd() - .5) * 8; ball.last = p.team; p.lock = 0.4; } }
      else if (sp < 22 || p.gk) { ball.owner = p; p.hold = 0; if (p.team === 0) S.ctl[p.team] = p; }
    }
  });
  // Tor / Aus
  const bx = ball.x, by = ball.y;
  if ((bx < 0 || bx > FW) && Math.abs(by - MY) < GW / 2) {
    if (ball.z < 2.44) goal(bx > FW ? 0 : 1); else outEnd();
  } else if ((bx < 0 || bx > FW) && !ball.owner) outEnd();
  else if ((by < 0 || by > FH) && !ball.owner) {
    const t = ball.last ^ 1; setPiece(t, clamp(bx, 2, FW - 2), by < 0 ? 0.6 : FH - 0.6); say('EINWURF', 1); Audio_.whistle();
  }
  // Pfosten
  [0, FW].forEach(x => [MY - GW / 2, MY + GW / 2].forEach(y => { if (Math.hypot(ball.x - x, ball.y - y) < 0.5 && !ball.owner) { ball.vx *= -0.6; ball.vy *= -0.6; Audio_.post(); ball.x += ball.vx * dt * 2; ball.y += ball.vy * dt * 2; } }));
  // Kamera
  const sp = Math.hypot(ball.vx, ball.vy);
  cam.x += (ball.x - cam.x) * Math.min(1, dt * 4); cam.y += (ball.y - cam.y) * Math.min(1, dt * 4);
  cam.z += ((sp > 18 ? 0.9 : 1) - cam.z) * Math.min(1, dt * 2);
  updateParts(dt);
}
function outEnd() {
  const right = ball.x > FW; const defTeam = right ? 1 : 0;
  if (ball.last === defTeam) { setPiece(defTeam ^ 1, right ? FW - 0.6 : 0.6, ball.y < MY ? 0.6 : FH - 0.6); S.stats[defTeam ^ 1].co++; say('ECKE', 1.2); }
  else { setPiece(defTeam, right ? FW - 5.5 : 5.5, MY, true); say('ABSTOSS', 1.2); }
  Audio_.whistle();
}
function goal(t) {
  S.score[t]++; S.shake = 1; say('TOR!', 3); S.freeze = 3.2; S.next = t ^ 1; Audio_.goal(); ball.owner = null;
  for (let i = 0; i < 160; i++) parts.push({ x: ball.x < FW / 2 ? 3 : FW - 3, y: MY + (rnd() - .5) * 20, z: 2 + rnd() * 4, vx: (rnd() - .5) * 12, vy: (rnd() - .5) * 12, vz: rnd() * 10, life: 3, c: ['#ffe14d', '#ff4d6d', '#4dd2ff', '#fff'][i & 3] });
  ball.vx *= 0.2; ball.vy *= 0.2;
}
function updateParts(dt) { if (S.shake > 0) S.shake = Math.max(0, S.shake - dt * 1.8); parts.forEach(q => { q.x += q.vx * dt; q.y += q.vy * dt; q.z = Math.max(0, q.z + q.vz * dt); q.vz -= 9 * dt; q.life -= dt; }); parts = parts.filter(q => q.life > 0); if (S.freeze > 0) { ball.x += ball.vx * dt; ball.y += ball.vy * dt; ball.vx *= .95; ball.vy *= .95; } }

/* ---------- Rendering ---------- */
let sc = 1;
function pr(x, y, z = 0) { return [W / 2 + (x - cam.x) * sc, H / 2 + (y - cam.y) * sc * 0.78 - z * sc * 0.78]; }
let trail = [];
const hash = n => { const v = Math.sin(n * 127.1) * 43758.5; return v - Math.floor(v); };
function rg(x, y, r, c0, c1) { const q = g.createRadialGradient(x, y, 0, x, y, r); q.addColorStop(0, c0); q.addColorStop(1, c1); return q; }
function seg(a, b) { g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
function boards(yy) { const names = ['TURBO', 'NORDSTROM', 'AURORA COLA', 'KICKBOOST']; g.font = 'bold ' + sc * 1.1 + 'px Arial'; g.textAlign = 'center'; for (let i = -1; i < 8; i++) { const [px] = pr(i * 18, 0), k = ((i % 4) + 4) % 4; g.fillStyle = ['#c1121f', '#1d3557', '#e09f3e', '#2a9d8f'][k]; g.fillRect(px, yy, 18 * sc - 2, sc * 1.4); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(px, yy, 18 * sc - 2, sc * .3); g.fillStyle = '#fff'; g.fillText(names[k], px + 9 * sc, yy + sc * 1.05); } }
function draw(now) {
  tnow = now;
  let gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#16335a'); gr.addColorStop(.4, '#1c4577'); gr.addColorStop(1, '#1d6a30'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  if (!S.phase) { drawMenuBg(now); return; }
  sc = H / 34 * cam.z; g.save(); if (S.shake > 0) g.translate((rnd() - .5) * S.shake * sc * .6, (rnd() - .5) * S.shake * sc * .6);
  drawPitch(now);
  // Obere Tribüne: Stufen, Publikum mit Köpfen, Jubelwelle
  const [, ty] = pr(0, 0), topY = ty - 1.6 * sc * .78;
  gr = g.createLinearGradient(0, topY - 13 * sc, 0, topY); gr.addColorStop(0, '#26344d'); gr.addColorStop(1, '#4a5d7c'); g.fillStyle = gr; g.fillRect(0, topY - 13 * sc, W, 13 * sc);
  const jump = S.msgT > 0 && S.msg === 'TOR!' ? 1 : 0, cols = ['#e63946', '#f4d35e', '#6ec3ff', '#ffffff', '#8bd17c', '#c77dff', '#ff9f43'];
  for (let r = 7; r >= 0; r--) for (let i = 0; i < 70; i++) { const n = r * 100 + i, cx = (i + hash(n) * .6) / 70 * W - cam.x * sc * .03, cy = topY - (1.3 + r * 1.4) * sc - Math.max(0, Math.sin(now / 170 + n * .7)) * sc * (.12 + jump * .8); g.fillStyle = cols[Math.floor(hash(n + 3) * 7)]; g.fillRect(cx - sc * .32, cy, sc * .64, sc * .75); g.fillStyle = '#e8b98a'; g.beginPath(); g.arc(cx, cy - sc * .22, sc * .26, 0, 7); g.fill(); if (hash(n + Math.floor(now / 140)) > .988) { g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.arc(cx, cy, sc * .7, 0, 7); g.fill(); } if (jump && i % 5 === 0) { g.fillStyle = 'rgba(255,255,255,.9)'; g.fillRect(cx - sc * .05, cy - sc * 1.1, sc * .1, sc * .5); } }
  boards(topY);
  g.fillStyle = '#04060a'; g.fillRect(0, topY - sc * 1.7, W, sc * 1.3); g.font = 'bold ' + sc * .9 + 'px Arial'; g.textAlign = 'left'; g.shadowColor = '#ffb300'; g.shadowBlur = 8; g.fillStyle = '#ffcc33';
  for (let k = -1; k < 5; k++) g.fillText('TURBO KICK  ★  SPIELTAG  ★  ' + TEAMS[cfg.t0].n.toUpperCase() + ' vs ' + TEAMS[cfg.t1].n.toUpperCase() + '  ★', k * sc * 60 - (now * .05) % (sc * 60), topY - sc * .8);
  g.shadowBlur = 0;
  for (let i = 0; i < 9; i++) { const fx = W * (.06 + i * .11) - cam.x * sc * .03, fy = topY - 5 * sc, wv = Math.sin(now / 250 + i) * sc * .5, T = TEAMS[i % 2 ? cfg.t1 : cfg.t0]; g.strokeStyle = '#ccc'; g.lineWidth = Math.max(1.5, sc * .1); seg([fx, fy], [fx, fy - 4 * sc]); g.fillStyle = T.a; g.beginPath(); g.moveTo(fx, fy - 4 * sc); g.quadraticCurveTo(fx + 1.4 * sc, fy - 4 * sc + wv, fx + 2.8 * sc, fy - 4 * sc + wv * .4); g.lineTo(fx + 2.8 * sc, fy - 2.6 * sc + wv * .4); g.quadraticCurveTo(fx + 1.4 * sc, fy - 2.6 * sc + wv, fx, fy - 2.6 * sc); g.fill(); g.fillStyle = T.b; g.beginPath(); g.arc(fx + 1.3 * sc, fy - 3.3 * sc + wv * .6, sc * .3, 0, 7); g.fill(); }
  // Untere Seite: Banden und dunkle Tribüne
  const [, by2] = pr(0, FH + 1.2); gr = g.createLinearGradient(0, by2, 0, by2 + 9 * sc); gr.addColorStop(0, '#2d4a3a'); gr.addColorStop(1, '#1d3a2b'); g.fillStyle = gr; g.fillRect(0, by2, W, H - by2); boards(by2 - sc * .2);
  // Flutlichtmasten-Glanz oben
  g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 4; i++) { const x = W * (.12 + i * .25), y = topY - 13 * sc; g.fillStyle = rg(x, y, sc * 9, 'rgba(255,250,220,.55)', 'rgba(255,250,220,0)'); g.fillRect(x - sc * 9, y - sc * 9, sc * 18, sc * 18); } g.globalCompositeOperation = 'source-over';
  // Volumetrische Lichtstrahlen und Staub im Flutlicht
  g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 4; i++) { const x = W * (.12 + i * .25), y = topY - 13 * sc, tx2 = W * (.1 + i * .27) + Math.sin(now / 2500 + i) * sc * 2, ty2 = H * .85, q = g.createLinearGradient(0, y, 0, ty2); q.addColorStop(0, 'rgba(255,245,200,.16)'); q.addColorStop(1, 'rgba(255,245,200,0)'); g.fillStyle = q; g.beginPath(); g.moveTo(x - sc, y); g.lineTo(x + sc, y); g.lineTo(tx2 + sc * 9, ty2); g.lineTo(tx2 - sc * 9, ty2); g.fill(); }
  for (let i = 0; i < 50; i++) { const px = (hash(i) * W + now * .01 * (1 + hash(i + 5))) % W, py = (hash(i + 60) * H * .8 + Math.sin(now / 900 + i) * 12 + now * .004 * hash(i + 9)) % (H * .9); g.fillStyle = 'rgba(255,250,220,' + (.1 + .2 * hash(i + 9)) + ')'; g.fillRect(px, py, 2, 2); }
  g.globalCompositeOperation = 'source-over';
  [0, 1].forEach(goalBack);
  const objs = players.map(p => ({ y: p.y, d: () => drawPlayer(p, now) })); objs.push({ y: ball.y, d: drawBall });
  objs.sort((a, b) => a.y - b.y).forEach(o => o.d());
  [0, 1].forEach(goalFront);
  [0].forEach(t => { const c = S.ctl[t]; if (!c || ball.owner !== c) return; const q = passTarget(c); if (!q) return; const a = pr(c.x, c.y), b = pr(q.x, q.y); g.setLineDash([sc * .5, sc * .4]); g.strokeStyle = t ? 'rgba(77,210,255,.75)' : 'rgba(255,225,77,.75)'; g.lineWidth = Math.max(1.5, sc * .12); g.lineDashOffset = -now / 40; seg(a, b); g.setLineDash([]); g.beginPath(); g.ellipse(b[0], b[1], sc * 1.1, sc * .55, 0, 0, 7); g.stroke(); });
  // Partikel mit Glanz
  g.globalCompositeOperation = 'lighter';
  parts.forEach(q => { const [x, y] = pr(q.x, q.y, q.z); g.fillStyle = q.c; g.globalAlpha = clamp(q.life, 0, 1) * .85; g.beginPath(); g.arc(x, y, sc * .16, 0, 7); g.fill(); });
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  if (S.freeze > 0 && S.msg === 'TOR!') { g.fillStyle = 'rgba(255,225,77,' + (.08 + .06 * Math.sin(now / 80)) + ')'; g.fillRect(0, 0, W, H); }
  g.fillStyle = rg(W / 2, H / 2, Math.max(W, H) * .75, 'rgba(0,0,0,0)', 'rgba(0,0,0,.22)'); g.fillRect(0, 0, W, H);
  g.restore();
  post(now);
  drawHUD(now);
}
const bl = document.createElement('canvas'), bg2 = bl.getContext('2d');
/* Nachbearbeitung: Tilt-Shift-Unschärfe, Bloom, Farbkorrektur, Kino-Balken beim Tor */
function post(now) {
  const w = Math.max(1, W >> 2), h = Math.max(1, H >> 2); if (bl.width !== w || bl.height !== h) { bl.width = w; bl.height = h; }
  bg2.drawImage(cv, 0, 0, w, h);
  for (let k = 0; k < 6; k++) { const bh = H * .035, a = (1 - k / 6) * .6; g.globalAlpha = a; g.drawImage(bl, 0, k * bh / 4, w, bh / 4, 0, k * bh, W, bh); g.drawImage(bl, 0, h - (k + 1) * bh / 4, w, bh / 4, 0, H - (k + 1) * bh, W, bh); }
  g.globalAlpha = .22; g.globalCompositeOperation = 'lighter'; g.drawImage(bl, 0, 0, W, H);
  g.globalAlpha = 1; g.globalCompositeOperation = 'soft-light'; const q = g.createLinearGradient(0, 0, 0, H); q.addColorStop(0, 'rgba(60,100,200,.35)'); q.addColorStop(.5, 'rgba(255,255,255,0)'); q.addColorStop(1, 'rgba(255,190,110,.3)'); g.fillStyle = q; g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = 'source-over';
}
function lim(x1, y1, x2, y2, w, c, s) { g.lineCap = 'round'; g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = w + s * .09; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.strokeStyle = c; g.lineWidth = w; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); }
function pent(cx, cy, r, rot) { g.beginPath(); for (let i = 0; i < 5; i++) { const a = rot + i * 1.2566; i ? g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r) : g.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } g.closePath(); g.fill(); }
/* ---------- Spieler-Rendering (überarbeitet) ---------- */
// [Hautton, Haarfarbe, Frisur 0=kurz 1=Stoppeln 2=lang/Zopf 3=Afro 4=Irokese] – 10 verschiedene Gesichter (5 pro Team)
const LOOK = [['#f6d2b0', '#2b1b0e', 0], ['#c68a5c', '#101010', 1], ['#e9b98f', '#7a4a22', 4], ['#6e4224', '#101010', 3], ['#f6d2b0', '#d4a72c', 2],
  ['#e9b98f', '#101010', 0], ['#9a6238', '#2b1b0e', 4], ['#f6d2b0', '#5a2d12', 1], ['#c68a5c', '#101010', 2], ['#6e4224', '#101010', 0]];
const _shc = {};
function shade(c, a) { // a > 0 heller, a < 0 dunkler
  const k = c + a; if (_shc[k]) return _shc[k];
  const n = parseInt(c.slice(1), 16), r = n >> 16, gg = (n >> 8) & 255, b = n & 255, t = a < 0 ? 0 : 255, f = Math.abs(a);
  return (_shc[k] = 'rgb(' + Math.round(r + (t - r) * f) + ',' + Math.round(gg + (t - gg) * f) + ',' + Math.round(b + (t - b) * f) + ')');
}
function drawPlayer(p, now) {
  const [x, y] = pr(p.x, p.y), ti = p.team ? cfg.t1 : cfg.t0, T = TEAMS[ti];
  const s = sc * 1.06 * (.88 + .24 * p.y / FH), run = Math.hypot(p.vx, p.vy), ph = p.anim * 2.2, sw = run > .5 ? Math.sin(ph) : 0;
  const id = Math.max(0, [1, 4, 7, 8, 10].indexOf(p.num)) + p.team * 5, [skin, hairC, hairS] = LOOK[id];
  const bob = run > .5 ? Math.abs(Math.cos(ph)) * s * .1 : Math.sin(now / 420 + id) * s * .012;
  const fd = Math.cos(p.f), fv = Math.sin(p.f), af = Math.abs(fd), av = Math.abs(fv), dir = fd >= 0 ? 1 : -1, back = fv < -.3;
  const lean = fd * s * .14 * Math.min(1, run / 5), bx = x + lean;
  const GKC = p.team ? '#8e5cf0' : '#f4c20d';
  const jc = p.gk ? GKC : T.a, tr = p.gk ? '#1b1b22' : T.b, sockC = p.gk ? '#1b1b22' : T.a, sockB = p.gk ? GKC : T.b;
  const hipY = y - s * 1.08 - bob, shY = y - s * 2.12 - bob, kick = p.act > 0 ? Math.sin(Math.min(1, p.act / .25) * 3.1) : 0;
  const hwT = s * (.34 + .2 * av), hwW = hwT * .8; // halbe Schulter- / Taillenbreite
  g.lineJoin = 'round';
  // Schatten
  g.fillStyle = rg(x + s * .45, y, s * 1.5, 'rgba(0,0,0,.55)', 'rgba(0,0,0,0)'); g.beginPath(); g.ellipse(x + s * .45, y, s * 1.5, s * .5, 0, 0, 7); g.fill();
  g.fillStyle = rg(x - s * .5, y, s * 1.2, 'rgba(0,0,0,.28)', 'rgba(0,0,0,0)'); g.beginPath(); g.ellipse(x - s * .5, y, s * 1.2, s * .45, 0, 0, 7); g.fill();
  if (run > 7) { g.strokeStyle = 'rgba(255,255,255,.2)'; g.lineWidth = Math.max(1, s * .05); for (let i = 0; i < 3; i++) { const oy = y - s * (.5 + i * .6), dx = p.vx / run, dy = p.vy / run * .6; seg([bx - dx * s * 1.6, oy - dy * s * 1.6], [bx - dx * s * 3.4, oy - dy * s * 3.4]); } }
  const isCtl = S.ctl && S.ctl[0] === p, cc = isCtl ? '#ffe14d' : null;
  if (cc) { g.strokeStyle = cc; g.lineWidth = s * .14; g.shadowColor = cc; g.shadowBlur = 12; g.beginPath(); g.ellipse(x, y, s * 1.0, s * .46, 0, 0, 7); g.stroke(); g.shadowBlur = 0; }

  // ---- Beine: das nach vorn schwingende Bein wird zuletzt gezeichnet ----
  const legs = [-1, 1].map(sd => {
    const sg = sd * sw, k = sd > 0 ? kick : 0, hx = bx + sd * s * (.13 + .05 * av), lift = Math.max(0, sg) * s * .3;
    return { sd, hx, k, fx: hx + sg * s * .5 * (.35 + .65 * af) + k * fd * s * 1.0, fy: y - lift - k * s * .3 + sg * s * .18 * av, z: sg * dir + k * 2 };
  }).sort((a, b) => a.z - b.z);
  const knee = L => [(L.hx + L.fx) / 2 + fd * s * .08 + L.k * fd * s * .1, (hipY + L.fy) / 2 - s * .05];
  legs.forEach(L => {
    const [kx, ky] = knee(L), ay = L.fy - s * .1, sx = kx + (L.fx - kx) * .3, sy = ky + (ay - ky) * .3;
    lim(L.hx, hipY, kx, ky, s * .27, skin, s); lim(kx, ky, L.fx, ay, s * .23, skin, s);         // Oberschenkel, Wade
    lim(sx, sy, L.fx, ay, s * .27, sockC, s); lim(sx, sy, sx + (L.fx - sx) * .2, sy + (ay - sy) * .2, s * .285, sockB, s); // Stutzen + Band
    const bxx = L.fx + fd * s * .13, rx = s * (.19 + .15 * af), ry = s * .12;                      // Fussballschuh
    g.fillStyle = '#0e0f13'; g.beginPath(); g.ellipse(bxx, L.fy, rx, ry, 0, 0, 7); g.fill();
    g.fillStyle = p.gk ? '#2ecc71' : T.b; g.beginPath(); g.ellipse(bxx - fd * s * .02, L.fy - ry * .35, rx * .7, ry * .35, 0, 0, 7); g.fill();
    g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(bxx - rx * .85, L.fy + ry * .7, rx * 1.7, Math.max(1, s * .03));
  });
  legs.forEach(L => { const [kx, ky] = knee(L); lim(L.hx, hipY, L.hx + (kx - L.hx) * .36, hipY + (ky - hipY) * .36, s * .31, tr, s); }); // Hosenbeine
  // Hose
  g.fillStyle = tr; rr(bx - hwW - s * .05, hipY - s * .3, hwW * 2 + s * .1, s * .5, s * .12); g.fill(); g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = s * .045; g.stroke();
  g.fillStyle = jc; g.fillRect(bx - hwW - s * .05, hipY - s * .2, s * .06, s * .34); g.fillRect(bx + hwW - s * .01, hipY - s * .2, s * .06, s * .34);
  g.fillStyle = shade(tr, -.3); g.fillRect(bx - s * .015, hipY - s * .04, s * .03, s * .24); g.fillRect(bx - hwW - s * .03, hipY - s * .3, hwW * 2 + s * .06, s * .06);

  // ---- Arme ----
  const up = p.gk && !ball.owner && dist(p, ball) < 13;
  const arm = sd => {
    const ax = bx + sd * hwT * .94, ay = shY + s * .2, as = run > .5 ? -sd * sw : 0, A = .35 + .65 * af, fast = run > 6;
    let ex = ax + sd * s * .07 + as * s * .17 * A + fd * s * .05, ey = ay + s * .4 - Math.abs(as) * s * .05, hx2 = ex + sd * s * .02 + as * s * .2 * A + fd * s * (fast ? .14 : .03), hy2 = ey + s * .36 - Math.abs(as) * s * .12 - (fast ? s * .1 : 0);
    if (up) { ex = ax + sd * s * .3; ey = ay - s * .02; hx2 = ax + sd * s * .42; hy2 = ay - s * .5; }
    lim(ax, ay, ex, ey, s * .2, skin, s); lim(ex, ey, hx2, hy2, s * .19, p.gk ? jc : skin, s);
    const mx = ax + (ex - ax) * .55, my = ay + (ey - ay) * .55;
    lim(ax, ay, mx, my, s * .28, jc, s); g.lineCap = 'butt'; g.strokeStyle = tr; g.lineWidth = s * .285; g.beginPath(); g.moveTo(ax + (ex - ax) * .5, ay + (ey - ay) * .5); g.lineTo(ax + (ex - ax) * .6, ay + (ey - ay) * .6); g.stroke(); g.lineCap = 'round';
    g.fillStyle = p.gk ? '#2ecc71' : skin; g.beginPath(); g.arc(hx2, hy2 + s * .03, s * (p.gk ? .16 : .1), 0, 7); g.fill();
    if (p.gk) { g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = Math.max(1, s * .03); g.beginPath(); g.moveTo(hx2 - s * .08, hy2); g.lineTo(hx2 + s * .08, hy2); g.stroke(); }
  };
  arm(dir > 0 ? -1 : 1);

  // ---- Rumpf: Trikot mit Muster pro Team, Schattierung, Kragen, Rückennummer ----
  const torso = () => {
    g.beginPath(); g.moveTo(bx - hwT + s * .1, shY); g.quadraticCurveTo(bx - hwT - s * .04, shY, bx - hwT, shY + s * .12); g.lineTo(bx - hwW, hipY - s * .1);
    g.quadraticCurveTo(bx - hwW, hipY - s * .02, bx - hwW + s * .08, hipY - s * .02); g.lineTo(bx + hwW - s * .08, hipY - s * .02); g.quadraticCurveTo(bx + hwW, hipY - s * .02, bx + hwW, hipY - s * .1);
    g.lineTo(bx + hwT, shY + s * .12); g.quadraticCurveTo(bx + hwT + s * .04, shY, bx + hwT - s * .1, shY); g.quadraticCurveTo(bx, shY - s * .06, bx - hwT + s * .1, shY); g.closePath();
  };
  const L0 = bx - hwT - s * .1, W0 = hwT * 2 + s * .2;
  torso(); g.fillStyle = jc; g.fill(); g.save(); torso(); g.clip();
  if (p.gk) { g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(L0, shY, W0, s * .25); }
  else {
    g.fillStyle = T.b;
    if (ti === 0) for (let i = -1; i <= 1; i++) g.fillRect(bx + i * s * .26 - s * .045, shY, s * .09, hipY - shY);
    else if (ti === 1) g.fillRect(L0, shY + s * .5, W0, s * .16);
    else if (ti === 2) { g.strokeStyle = T.b; g.lineWidth = s * .3; g.beginPath(); g.moveTo(L0, shY + s * .05); g.lineTo(L0 + W0, hipY - s * .1); g.stroke(); }
    else for (let i = 0; i < 3; i++) g.fillRect(L0, shY + s * .18 + i * s * .3, W0, s * .13);
  }
  let q = g.createLinearGradient(bx - hwT, 0, bx + hwT, 0); q.addColorStop(0, 'rgba(255,255,255,.32)'); q.addColorStop(.4, 'rgba(255,255,255,0)'); q.addColorStop(1, 'rgba(0,0,0,.45)'); g.fillStyle = q; g.fillRect(L0, shY - s * .1, W0, hipY - shY + s * .2);
  q = g.createLinearGradient(0, shY, 0, hipY); q.addColorStop(0, 'rgba(255,255,255,.14)'); q.addColorStop(1, 'rgba(0,0,0,.22)'); g.fillStyle = q; g.fillRect(L0, shY - s * .1, W0, hipY - shY + s * .2);
  g.strokeStyle = 'rgba(0,0,0,.16)'; g.lineWidth = s * .05; g.beginPath(); g.moveTo(bx - hwT * .6, shY + s * .75); g.quadraticCurveTo(bx, shY + s * .9, bx + hwT * .6, shY + s * .72); g.stroke();
  g.restore(); torso(); g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = s * .05; g.stroke();
  // Kragen
  if (!back) { g.fillStyle = shade(skin, -.12); g.beginPath(); g.moveTo(bx - s * .17, shY); g.lineTo(bx, shY + s * .24); g.lineTo(bx + s * .17, shY); g.closePath(); g.fill(); g.strokeStyle = tr; g.lineWidth = s * .06; g.beginPath(); g.moveTo(bx - s * .18, shY - s * .01); g.lineTo(bx, shY + s * .25); g.lineTo(bx + s * .18, shY - s * .01); g.stroke(); }
  else { g.fillStyle = tr; rr(bx - s * .18, shY - s * .02, s * .36, s * .08, s * .03); g.fill(); }
  // Nummer (vorn klein auf der Brust, hinten gross auf dem Rücken)
  g.save(); g.translate(bx, shY + s * (back ? .82 : .8)); g.scale(1 - .45 * af, 1); g.textAlign = 'center'; g.font = '900 ' + (back ? s * .7 : s * .5) + 'px Arial'; g.lineWidth = s * .09;
  const gk0 = p.gk && !p.team; g.strokeStyle = gk0 ? 'rgba(255,255,255,.6)' : 'rgba(0,0,0,.65)'; g.strokeText(p.num, 0, 0); g.fillStyle = gk0 ? '#111' : '#fff'; g.fillText(p.num, 0, 0); g.restore();
  arm(dir > 0 ? 1 : -1);

  // ---- Kopf ----
  const hx = bx + fd * s * .07 + lean * .3, hy = shY - s * .43, rx = s * .3, ry = s * .345;
  g.fillStyle = shade(skin, -.14); rr(hx - s * .1, shY - s * .2, s * .2, s * .26, s * .05); g.fill();
  if (hairS === 2) { g.fillStyle = hairC; g.beginPath(); g.ellipse(hx - dir * af * s * .1, hy + s * .1, rx * 1.04, ry * .95, 0, 0, 7); g.fill(); if (af > .3 || back) { g.beginPath(); g.ellipse(hx - dir * s * .34 * (af + .2), hy + s * .22, s * .09, s * .22, dir * .25, 0, 7); g.fill(); } }
  if (hairS === 3) { g.fillStyle = hairC; g.beginPath(); g.ellipse(hx, hy - s * .05, rx * 1.2, ry * 1.05, 0, 0, 7); g.fill(); for (let i = 0; i < 7; i++) { const a = Math.PI * (1 + i / 6); g.beginPath(); g.arc(hx + Math.cos(a) * rx * 1.05, hy - s * .02 + Math.sin(a) * ry * 1.0, s * .15, 0, 7); g.fill(); } }
  if (af <= .7) { g.fillStyle = shade(skin, -.1); [-1, 1].forEach(e => { g.beginPath(); g.arc(hx + e * rx * .97, hy + s * .05, s * .08, 0, 7); g.fill(); }); }
  g.fillStyle = rg(hx - rx * .35, hy - ry * .4, ry * 1.5, shade(skin, .3), skin); g.beginPath(); g.ellipse(hx, hy, rx, ry, 0, 0, 7); g.fill();
  q = g.createLinearGradient(hx - rx, 0, hx + rx, 0); q.addColorStop(0, 'rgba(255,255,255,.12)'); q.addColorStop(.5, 'rgba(0,0,0,0)'); q.addColorStop(1, 'rgba(0,0,0,.28)'); g.fillStyle = q; g.beginPath(); g.ellipse(hx, hy, rx, ry, 0, 0, 7); g.fill();
  // Haarkappe (innerhalb der Kopfform)
  g.save(); g.beginPath(); g.ellipse(hx, hy, rx * 1.02, ry * 1.02, 0, 0, 7); g.clip(); g.fillStyle = hairC;
  if (hairS === 4) { g.globalAlpha = .35; g.fillRect(hx - rx * 1.1, hy - ry * 1.1, rx * 2.2, ry * .9); g.globalAlpha = 1; g.fillRect(hx - rx * .28, hy - ry * 1.1, rx * .56, ry * 1.0); }
  else {
    const side = back ? .62 : hairS === 1 ? -.25 : -.02, ctl = back ? .75 : hairS === 1 ? -.35 : -.58;
    if (hairS === 1) g.globalAlpha = .75;
    g.beginPath(); g.moveTo(hx - rx * 1.1, hy - ry * 1.1); g.lineTo(hx + rx * 1.1, hy - ry * 1.1); g.lineTo(hx + rx * 1.1, hy + ry * side); g.quadraticCurveTo(hx + fd * rx * .1, hy + ry * ctl, hx - rx * 1.1, hy + ry * side); g.closePath(); g.fill(); g.globalAlpha = 1;
  }
  g.restore();
  if (hairS === 4) { g.fillStyle = hairC; rr(hx - s * .07 + fd * s * .02, hy - ry - s * .14, s * .14, s * .26, s * .05); g.fill(); }
  g.strokeStyle = 'rgba(0,0,0,.4)'; g.lineWidth = s * .04; g.beginPath(); g.ellipse(hx, hy, rx, ry, 0, 0, 7); g.stroke();
  if (af > .7) { const ex = hx - dir * rx * .12; g.fillStyle = shade(skin, -.12); g.beginPath(); g.ellipse(ex, hy + s * .06, s * .075, s * .095, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = s * .025; g.stroke(); }
  // Gesicht (nur wenn der Spieler zur Kamera schaut)
  if (!back) {
    const ex0 = hx + fd * s * .13, sp = s * .11 * (1 - .55 * af), bc = shade(hairC, -.25);
    [-1, 1].forEach(e => {
      if (af > .75 && e * dir < 0) return; const ex = ex0 + e * sp;
      g.fillStyle = '#fff'; g.beginPath(); g.ellipse(ex, hy + s * .02, s * .062, s * .05, 0, 0, 7); g.fill();
      g.fillStyle = '#1a1a1a'; g.beginPath(); g.arc(ex + fd * s * .02, hy + s * .03 + fv * s * .01, s * .032, 0, 7); g.fill();
      g.strokeStyle = bc; g.lineWidth = s * .035; g.beginPath(); g.moveTo(ex - s * .06, hy - s * .06); g.lineTo(ex + s * .06, hy - s * .08); g.stroke();
    });
    g.strokeStyle = shade(skin, -.28); g.lineWidth = s * .03; g.beginPath(); g.moveTo(ex0 + fd * s * .03, hy + s * .04); g.lineTo(ex0 + fd * s * .05, hy + s * .12); g.lineTo(ex0 + fd * s * .01, hy + s * .13); g.stroke();
    if (af > .8) { g.fillStyle = skin; g.beginPath(); g.arc(hx + dir * rx * .98, hy + s * .09, s * .055, 0, 7); g.fill(); g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = s * .025; g.stroke(); }
    const mw = s * .07 * (1 - .5 * af); g.strokeStyle = '#7a2e2e'; g.lineWidth = s * .03;
    if (run > 7) { g.fillStyle = '#5a1a1a'; g.beginPath(); g.ellipse(ex0, hy + s * .21, mw, s * .035, 0, 0, 7); g.fill(); }
    else { g.beginPath(); g.moveTo(ex0 - mw, hy + s * .2); g.quadraticCurveTo(ex0, hy + s * .235, ex0 + mw, hy + s * .2); g.stroke(); }
  }
  if (cc) { g.fillStyle = cc; const b2 = Math.sin(now / 160) * s * .15; g.shadowColor = cc; g.shadowBlur = 8; g.beginPath(); g.moveTo(hx, hy - s * 1.0 + b2); g.lineTo(hx - s * .38, hy - s * 1.65 + b2); g.lineTo(hx + s * .38, hy - s * 1.65 + b2); g.fill(); g.shadowBlur = 0; }
}
/* ---------- Spielfeld, Tore, Ball (überarbeitet) ---------- */
let tnow = 0, grassTex = null, grassPat = null;
function mkGrassTex() {
  const c = document.createElement('canvas'); c.width = c.height = 512; const k = c.getContext('2d');
  k.fillStyle = '#808080'; k.fillRect(0, 0, 512, 512); k.lineCap = 'round';
  for (let i = 0; i < 9000; i++) {
    const x = hash(i * 3.1) * 512, y = hash(i * 7.7 + 1) * 512, l = 3 + hash(i + 4) * 7, a = -Math.PI / 2 + (hash(i + 9) - .5) * .7;
    k.strokeStyle = hash(i + 13) > .5 ? 'rgba(255,255,255,' + (.05 + hash(i + 2) * .1) + ')' : 'rgba(0,0,0,' + (.06 + hash(i + 6) * .12) + ')';
    k.lineWidth = 1 + hash(i + 21); k.beginPath(); k.moveTo(x, y); k.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); k.stroke();
  }
  return c;
}
function drawPitch(now) {
  const [fx0, fy0] = pr(-9, -4), [fx1, fy1] = pr(FW + 9, FH + 4);
  let gr = g.createLinearGradient(0, fy0, 0, fy1); gr.addColorStop(0, '#154c1d'); gr.addColorStop(.5, '#2b7c36'); gr.addColorStop(1, '#1d6629'); g.fillStyle = gr; g.fillRect(fx0, fy0, fx1 - fx0, fy1 - fy0);
  // Mähstreifen mit Walzen-Glanz und Rautenmuster
  for (let i = 0; i < 15; i++) {
    const [x1, y1] = pr(i * 7, 0), [x2, y2] = pr(i * 7 + 7, FH), lt = i % 2;
    g.fillStyle = lt ? 'rgba(160,245,140,.2)' : 'rgba(0,30,0,.2)'; g.fillRect(x1, y1, x2 - x1 + 1, y2 - y1);
    const sg = g.createLinearGradient(x1, 0, x2, 0); sg.addColorStop(0, lt ? 'rgba(255,255,220,.08)' : 'rgba(255,255,220,0)'); sg.addColorStop(1, lt ? 'rgba(255,255,220,0)' : 'rgba(255,255,220,.06)'); g.fillStyle = sg; g.fillRect(x1, y1, x2 - x1 + 1, y2 - y1);
    for (let j = 0; j < 6; j++) if ((i + j) % 2) { const [a, b] = pr(i * 7, j * FH / 6), [c, d] = pr(i * 7 + 7, (j + 1) * FH / 6); g.fillStyle = 'rgba(255,255,255,.04)'; g.fillRect(a, b, c - a + 1, d - b + 1); }
  }
  // Abnutzung im Strafraum, Mittelkreis und an den Elfmeterpunkten
  [[4, MY, 8], [FW - 4, MY, 8], [FW / 2, MY, 5], [11, MY, 3], [FW - 11, MY, 3]].forEach(([wx, wy, wr]) => { const [x, y] = pr(wx, wy), R = wr * sc; g.save(); g.translate(x, y); g.scale(1, .78); g.fillStyle = rg(0, 0, R, 'rgba(120,95,40,.42)', 'rgba(120,95,40,0)'); g.fillRect(-R, -R, R * 2, R * 2); g.restore(); });
  // Halm-Textur (an die Welt gebunden, skaliert mit dem Zoom)
  if (!grassTex) { grassTex = mkGrassTex(); grassPat = g.createPattern(grassTex, 'repeat'); }
  const [ox, oy] = pr(0, 0); g.save(); g.translate(ox, oy); g.scale(sc / 26, sc * .78 / 26); g.globalCompositeOperation = 'soft-light'; g.globalAlpha = .6; g.fillStyle = grassPat; g.fillRect(-9 * 26, -4 * 26, (FW + 18) * 26, (FH + 8) * 26); g.restore();
  // Auslauf ausserhalb der Linien dunkler
  const [ia, ib] = pr(-1.2, -1.2), [ic, id] = pr(FW + 1.2, FH + 1.2); g.fillStyle = 'rgba(0,25,0,.26)'; g.beginPath(); g.rect(fx0, fy0, fx1 - fx0, fy1 - fy0); g.rect(ia, ib, ic - ia, id - ib); g.fill('evenodd');
  for (let i = 0; i < 40; i++) { const [x, y] = pr(hash(i + 70) * FW, hash(i + 170) * FH); g.fillStyle = 'rgba(255,255,255,' + (.15 + .3 * Math.max(0, Math.sin(now / 300 + i * 2))) + ')'; g.fillRect(x, y, sc * .12, sc * .12); }
  // Linien mit Schlagschatten und Glanz
  const L = (x1, y1, x2, y2) => { const a = pr(x1, y1), b = pr(x2, y2); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); };
  const arc = (x, y, r, a0, a1) => { const [cx, cy] = pr(x, y); g.beginPath(); g.ellipse(cx, cy, r * sc, r * sc * .78, 0, a0, a1); g.stroke(); };
  const strokeAll = () => {
    g.beginPath();
    L(0, 0, FW, 0); L(FW, 0, FW, FH); L(FW, FH, 0, FH); L(0, FH, 0, 0); L(FW / 2, 0, FW / 2, FH);
    [0, 1].forEach(s => { const x = s ? FW : 0, d = s ? -1 : 1; L(x, MY - 20, x + d * 16.5, MY - 20); L(x + d * 16.5, MY - 20, x + d * 16.5, MY + 20); L(x + d * 16.5, MY + 20, x, MY + 20); L(x, MY - 9, x + d * 5.5, MY - 9); L(x + d * 5.5, MY - 9, x + d * 5.5, MY + 9); L(x + d * 5.5, MY + 9, x, MY + 9); });
    g.stroke();
    arc(FW / 2, MY, 9.15, 0, 7); arc(11, MY, 9.15, -.927, .927); arc(FW - 11, MY, 9.15, Math.PI - .927, Math.PI + .927);
    arc(0, 0, 1.2, 0, Math.PI / 2); arc(FW, 0, 1.2, Math.PI / 2, Math.PI); arc(FW, FH, 1.2, Math.PI, Math.PI * 1.5); arc(0, FH, 1.2, Math.PI * 1.5, Math.PI * 2);
  };
  g.save(); g.translate(0, Math.max(1, sc * .08)); g.strokeStyle = 'rgba(0,25,0,.38)'; g.lineWidth = Math.max(1.5, sc * .16); strokeAll(); g.restore();
  g.strokeStyle = 'rgba(255,255,255,.94)'; g.lineWidth = Math.max(1.5, sc * .14); g.shadowColor = '#fff'; g.shadowBlur = 5; strokeAll();
  [FW / 2, 11, FW - 11].forEach(x => { const [cx, cy] = pr(x, MY); g.fillStyle = '#fff'; g.beginPath(); g.ellipse(cx, cy, sc * .26, sc * .2, 0, 0, 7); g.fill(); });
  g.shadowBlur = 0;
  // Eckfahnen mit Schaft-Schattierung
  [[0, 0], [FW, 0], [FW, FH], [0, FH]].forEach(([fx, fy], i) => {
    const a = pr(fx, fy, 0), b = pr(fx, fy, 1.7), w = Math.sin(now / 200 + i) * sc * .08, dr = fx ? -1 : 1;
    g.lineCap = 'round'; g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = Math.max(2.5, sc * .11); seg(a, b); g.strokeStyle = '#f2f2f2'; g.lineWidth = Math.max(1.5, sc * .07); seg(a, b);
    g.fillStyle = '#ff2d3d'; g.beginPath(); g.moveTo(b[0], b[1]); g.quadraticCurveTo(b[0] + dr * sc * .4, b[1] + sc * .05 + w, b[0] + dr * sc * .75 + w, b[1] + sc * .2); g.lineTo(b[0], b[1] + sc * .5); g.closePath(); g.fill();
    g.fillStyle = 'rgba(0,0,0,.2)'; g.beginPath(); g.moveTo(b[0], b[1] + sc * .25); g.lineTo(b[0] + dr * sc * .75 + w, b[1] + sc * .2); g.lineTo(b[0], b[1] + sc * .5); g.fill();
    g.fillStyle = '#ffd23f'; g.beginPath(); g.arc(b[0], b[1], Math.max(1.5, sc * .06), 0, 7); g.fill();
  });
  // Flutlicht-Lichtkegel auf dem Rasen
  g.globalCompositeOperation = 'lighter';
  [[10, 0], [FW - 10, 0], [10, FH], [FW - 10, FH], [FW / 2, MY]].forEach(([lx, ly]) => { const [x, y] = pr(lx, ly); const R = sc * 32; g.fillStyle = rg(x, y, R, 'rgba(255,248,215,.17)', 'rgba(255,248,215,0)'); g.fillRect(x - R, y - R, R * 2, R * 2); });
  g.globalCompositeOperation = 'source-over';
  endStands();
}
// Hintertor-Tribünen mit Bande, Publikum und Schattenwurf aufs Feld
function endStands() {
  const [, ty] = pr(0, 0), topY = ty - 1.6 * sc * .78, [, by2] = pr(0, FH + 1.2), jump = S.msgT > 0 && S.msg === 'TOR!' ? 1 : 0, cols = ['#e63946', '#f4d35e', '#6ec3ff', '#ffffff', '#8bd17c', '#c77dff', '#ff9f43'];
  [0, 1].forEach(side => {
    const [px] = pr(side ? FW + 9 : -9, 0), x0 = side ? px : 0, w = side ? W - px : px, dr = side ? 1 : -1; if (w <= 1) return;
    let q = g.createLinearGradient(0, topY, 0, by2); q.addColorStop(0, '#0d1524'); q.addColorStop(.5, '#1a263c'); q.addColorStop(1, '#0b111d'); g.fillStyle = q; g.fillRect(x0, topY - 2 * sc, w, by2 - topY + 4 * sc);
    const gx = Math.min(w, 22 * sc), step = sc * 1.55, nr = Math.ceil((by2 - topY) / step) + 1, nc = Math.ceil(gx / step);
    for (let r = 0; r < nr; r++) for (let c = 0; c < nc; c++) {
      const n = r * 97 + c + side * 1000, hx = px + dr * (c + .5 + hash(n) * .5) * step, hy = topY + r * step - Math.max(0, Math.sin(now_() / 170 + n * .7)) * sc * (.1 + jump * .6);
      g.fillStyle = cols[Math.floor(hash(n + 3) * 7)]; g.fillRect(hx - sc * .3, hy, sc * .6, sc * .7); g.fillStyle = '#e8b98f'; g.beginPath(); g.arc(hx, hy - sc * .2, sc * .24, 0, 7); g.fill();
    }
    q = g.createLinearGradient(px, 0, px + dr * gx, 0); q.addColorStop(0, 'rgba(5,10,20,0)'); q.addColorStop(1, 'rgba(5,10,20,.55)'); g.fillStyle = q; g.fillRect(Math.min(px, px + dr * gx), topY - 2 * sc, gx, by2 - topY + 4 * sc);
    // Bande am Spielfeldrand (Draufsicht) mit LED-Leiste
    const bw = sc * 1.3, bx = side ? px : px - bw; g.fillStyle = '#1b2840'; g.fillRect(bx, topY, bw, by2 - topY);
    const segH = sc * 7; for (let y = topY, k = 0; y < by2; y += segH, k++) { g.fillStyle = ['#c1121f', '#1d3557', '#e09f3e', '#2a9d8f'][k % 4]; g.fillRect(bx, y, bw, Math.min(segH, by2 - y) - 2); g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(bx + (side ? 0 : bw - sc * .25), y, sc * .25, Math.min(segH, by2 - y) - 2); }
    g.globalCompositeOperation = 'lighter'; q = g.createLinearGradient(px, 0, px - dr * 9 * sc, 0); q.addColorStop(0, 'rgba(0,0,0,0)'); q.addColorStop(1, 'rgba(0,0,0,0)'); g.globalCompositeOperation = 'source-over';
    q = g.createLinearGradient(px, 0, px - dr * 8 * sc, 0); q.addColorStop(0, 'rgba(0,10,0,.4)'); q.addColorStop(1, 'rgba(0,10,0,0)'); g.fillStyle = q; g.fillRect(Math.min(px, px - dr * 8 * sc), topY, 8 * sc, by2 - topY);
  });
}
const now_ = () => tnow;
/* Tore: 3D-Rahmen mit Netz (Rückwand, Seiten, Dach), Schatten, Pfosten mit Schattierung */
function bil(A, B, C, D, u, v) { const t = 1 - u, w = 1 - v; return [t * w * A[0] + u * w * B[0] + u * v * C[0] + t * v * D[0], t * w * A[1] + u * w * B[1] + u * v * C[1] + t * v * D[1]]; }
function netQuad(A, B, C, D, n, fill, line) {
  g.fillStyle = fill; g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1]); g.lineTo(C[0], C[1]); g.lineTo(D[0], D[1]); g.closePath(); g.fill();
  g.strokeStyle = line; g.lineWidth = Math.max(1, sc * .028); g.lineCap = 'butt'; g.beginPath();
  const sg = (u1, v1, u2, v2) => { const a = bil(A, B, C, D, u1, v1), b = bil(A, B, C, D, u2, v2); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); };
  for (let i = 0; i <= 2 * n; i++) { const c = i / n; if (c <= 1) sg(c, 0, 0, c); else sg(1, c - 1, c - 1, 1); const e = c - 1; if (e >= 0) sg(e, 0, 1, 1 - e); else sg(0, -e, 1 + e, 1); }
  g.stroke();
}
function goalGeo(s) {
  const x = s ? FW : 0, d = s ? 1 : -1, wob = S.freeze > 0 && S.msg === 'TOR!' ? Math.sin(tnow / 50) * .3 * d : 0, dep = 2.4;
  return { x, y0: MY - GW / 2, y1: MY + GW / 2, xb: x + d * dep + wob, hF: 2.44, hB: 1.9 };
}
function goalBack(s) {
  const { x, y0, y1, xb, hF, hB } = goalGeo(s), P = (a, b, c) => pr(a, b, c), net = 'rgba(235,245,255,.36)';
  const sh = [P(x, y0, 0), P(xb, y0, 0), P(xb, y1, 0), P(x, y1, 0)]; g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); sh.forEach((q, i) => i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1])); g.closePath(); g.fill();
  netQuad(P(xb, y0, 0), P(xb, y1, 0), P(xb, y1, hB), P(xb, y0, hB), 12, 'rgba(4,12,20,.42)', net);
  netQuad(P(x, y0, 0), P(xb, y0, 0), P(xb, y0, hB), P(x, y0, hF), 6, 'rgba(4,12,20,.22)', net);
  netQuad(P(x, y0, hF), P(xb, y0, hB), P(xb, y1, hB), P(x, y1, hF), 6, 'rgba(255,255,255,.07)', net);
  g.lineCap = 'round'; g.strokeStyle = 'rgba(205,215,228,.85)'; g.lineWidth = Math.max(1.5, sc * .09);
  [[P(xb, y0, 0), P(xb, y0, hB)], [P(xb, y1, 0), P(xb, y1, hB)], [P(xb, y0, hB), P(xb, y1, hB)], [P(xb, y0, 0), P(xb, y1, 0)], [P(x, y0, hF), P(xb, y0, hB)], [P(x, y1, hF), P(xb, y1, hB)], [P(x, y0, 0), P(xb, y0, 0)], [P(x, y1, 0), P(xb, y1, 0)]].forEach(([a, b]) => seg(a, b));
}
function goalFront(s) {
  const { x, y0, y1, xb, hF, hB } = goalGeo(s), P = (a, b, c) => pr(a, b, c), w = Math.max(3, sc * .24), tor = S.freeze > 0 && S.msg === 'TOR!';
  netQuad(P(x, y1, 0), P(xb, y1, 0), P(xb, y1, hB), P(x, y1, hF), 6, 'rgba(255,255,255,.05)', 'rgba(235,245,255,.3)');
  const post = (a, b) => {
    g.lineCap = 'round'; g.strokeStyle = 'rgba(0,0,0,.5)'; g.lineWidth = w + sc * .07; seg(a, b);
    if (tor) { g.shadowColor = '#ffd23f'; g.shadowBlur = 14; } g.strokeStyle = '#f4f6f8'; g.lineWidth = w; seg(a, b); g.shadowBlur = 0;
    const o = w * .2; g.strokeStyle = 'rgba(110,125,145,.6)'; g.lineWidth = w * .3; seg([a[0] + o, a[1] + o], [b[0] + o, b[1] + o]);
    g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = w * .26; seg([a[0] - o, a[1] - o], [b[0] - o, b[1] - o]);
  };
  post(P(x, y0, 0), P(x, y0, hF)); post(P(x, y1, 0), P(x, y1, hF)); post(P(x, y0, hF), P(x, y1, hF));
}
/* Ball: echte 3D-Kugel (Ikosaeder-Muster aus 12 Fünfecken), rollt in Laufrichtung */
const PHI = (1 + Math.sqrt(5)) / 2;
const v3 = { n: v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }, d: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], x: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]] };
const ICO = (() => {
  const V = [[0, 1, PHI], [0, -1, PHI], [0, 1, -PHI], [0, -1, -PHI], [1, PHI, 0], [-1, PHI, 0], [1, -PHI, 0], [-1, -PHI, 0], [PHI, 0, 1], [-PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, -1]].map(v3.n), R = .35, cR = Math.cos(R), sR = Math.sin(R);
  const P = V.map((v, i) => {
    const e1 = v3.n(v3.x(v, Math.abs(v[0]) < .9 ? [1, 0, 0] : [0, 1, 0])), e2 = v3.x(v, e1), to = {};
    V.forEach((w, j) => { if (j === i || v3.d(v, w) < .4) return; const t = v3.n(w.map((c, k) => c - v[k] * v3.d(v, w))); to[j] = { c: v3.n(v.map((c, k) => c * cR + t[k] * sR)), a: Math.atan2(v3.d(t, e2), v3.d(t, e1)) }; });
    return { v, to, c: Object.values(to).sort((a, b) => a.a - b.a).map(o => o.c) };
  });
  const seams = []; P.forEach((p, i) => Object.keys(p.to).forEach(j => { j = +j; if (j > i) seams.push([p.to[j].c, P[j].to[i].c]); }));
  return { P, seams };
})();
const mmul = (A, B) => [0, 1, 2].flatMap(r => [0, 1, 2].map(c => A[r * 3] * B[c] + A[r * 3 + 1] * B[3 + c] + A[r * 3 + 2] * B[6 + c]));
function rotAxis(ax, ay, az, a) { const n = v3.n([ax, ay, az]), [x, y, z] = n, c = Math.cos(a), s = Math.sin(a), t = 1 - c; return [t * x * x + c, t * x * y - s * z, t * x * z + s * y, t * x * y + s * z, t * y * y + c, t * y * z - s * x, t * x * z - s * y, t * y * z + s * x, t * z * z + c]; }
function orth(m) { const a = v3.n([m[0], m[1], m[2]]), b = v3.n(((u, w) => u.map((c, k) => c - w[k] * v3.d(u, w)))([m[3], m[4], m[5]], a)), c = v3.x(a, b); return [...a, ...b, ...c]; }
function paintBall(x, cy, r, m) {
  const ap = v => [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];
  const pt = c => { const p = ap(c); if (p[2] < 0) { const l = Math.hypot(p[0], p[1]) || 1; return [x + p[0] / l * r, cy + p[1] / l * r]; } return [x + p[0] * r, cy + p[1] * r]; };
  g.save(); g.beginPath(); g.arc(x, cy, r, 0, 7); g.clip();
  g.fillStyle = rg(x - r * .35, cy - r * .4, r * 1.9, '#ffffff', '#aeb8c4'); g.fillRect(x - r, cy - r, r * 2, r * 2);
  g.strokeStyle = 'rgba(40,48,62,.6)'; g.lineWidth = Math.max(.8, r * .055); g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath();
  ICO.seams.forEach(([a, b]) => { const A = ap(a), B = ap(b); if (A[2] < -.05 && B[2] < -.05) return; let pen = false; for (let k = 0; k <= 5; k++) { const t = k / 5, p = v3.n([A[0] * (1 - t) + B[0] * t, A[1] * (1 - t) + B[1] * t, A[2] * (1 - t) + B[2] * t]); if (p[2] < 0) { pen = false; continue; } const X = x + p[0] * r, Y = cy + p[1] * r; pen ? g.lineTo(X, Y) : g.moveTo(X, Y); pen = true; } });
  g.stroke();
  ICO.P.forEach(P => { if (ap(P.v)[2] < -.4) return; const q = P.c.map(pt); g.fillStyle = '#12151a'; g.beginPath(); q.forEach((p, k) => k ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.closePath(); g.fill(); g.strokeStyle = 'rgba(0,0,0,.7)'; g.lineWidth = Math.max(.8, r * .04); g.stroke(); });
  g.fillStyle = rg(x - r * .4, cy - r * .45, r * 1.9, 'rgba(255,255,255,0)', 'rgba(8,14,48,.62)'); g.fillRect(x - r, cy - r, r * 2, r * 2);
  g.fillStyle = rg(x + r * .1, cy + r * 1.0, r * 1.1, 'rgba(110,230,120,.3)', 'rgba(110,230,120,0)'); g.fillRect(x - r, cy - r, r * 2, r * 2);
  g.restore();
  g.strokeStyle = 'rgba(0,0,0,.5)'; g.lineWidth = Math.max(1, r * .08); g.beginPath(); g.arc(x, cy, r, 0, 7); g.stroke();
  g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.ellipse(x - r * .4, cy - r * .48, r * .2, r * .11, -.65, 0, 7); g.fill(); g.fillStyle = 'rgba(255,255,255,.7)'; g.beginPath(); g.arc(x - r * .2, cy - r * .64, r * .06, 0, 7); g.fill();
}
function drawBall() {
  const [sx, sy] = pr(ball.x, ball.y), [x, y] = pr(ball.x, ball.y, ball.z), r = sc * .56 * (.88 + .24 * ball.y / FH), sp = Math.hypot(ball.vx, ball.vy), cy = y - r;
  if (!ball.rm) { ball.rm = [1, 0, 0, 0, 1, 0, 0, 0, 1]; ball._px = ball.x; ball._py = ball.y; }
  const mdx = ball.x - ball._px, mdy = (ball.y - ball._py) * .78, md = Math.hypot(mdx, mdy);
  if (md > .0005 && md < 6) ball.rm = orth(mmul(rotAxis(-mdy / md, mdx / md, 0, md / .5), ball.rm));
  ball._px = ball.x; ball._py = ball.y;
  if (sp > 9 || ball.z > .3) trail.push({ x: ball.x, y: ball.y, z: ball.z, t: 1 });
  trail.forEach(t => t.t -= .09); trail = trail.filter(t => t.t > 0);
  g.lineCap = 'round'; for (let i = 1; i < trail.length; i++) { const A = trail[i - 1], B = trail[i]; if (Math.hypot(A.x - B.x, A.y - B.y) > 8) continue; const a = pr(A.x, A.y, A.z), b = pr(B.x, B.y, B.z); g.strokeStyle = 'rgba(255,255,255,' + B.t * .3 + ')'; g.lineWidth = r * 1.5 * B.t; g.beginPath(); g.moveTo(a[0], a[1] - r); g.lineTo(b[0], b[1] - r); g.stroke(); }
  if (sp > 16) { g.globalCompositeOperation = 'lighter'; g.fillStyle = rg(x, cy, r * 3, 'rgba(255,230,150,.35)', 'rgba(255,230,150,0)'); g.fillRect(x - r * 3, cy - r * 3, r * 6, r * 6); g.globalCompositeOperation = 'source-over'; }
  const k = 1 / (1 + ball.z * .25);
  g.fillStyle = rg(sx, sy, r * 1.5 * k, 'rgba(0,0,0,' + .55 * k + ')', 'rgba(0,0,0,0)'); g.beginPath(); g.ellipse(sx, sy, r * 1.5 * k, r * .65 * k, 0, 0, 7); g.fill();
  g.fillStyle = 'rgba(0,0,0,' + .5 * k + ')'; g.beginPath(); g.ellipse(sx, sy, r * .75 * k, r * .28 * k, 0, 0, 7); g.fill();
  paintBall(x, cy, r, ball.rm);
}
function rr(x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function bar(x, y, w, h, v, c0, c1, lab, u) {
  g.fillStyle = 'rgba(0,0,0,.6)'; rr(x, y, w, h, h / 2); g.fill();
  if (v > .01) { const q = g.createLinearGradient(x, 0, x + w, 0); q.addColorStop(0, c0); q.addColorStop(1, c1); g.fillStyle = q; const hh = h - .5 * u; rr(x + .25 * u, y + .25 * u, Math.max(hh, (w - .5 * u) * v), hh, hh / 2); g.fill(); }
  g.fillStyle = '#fff'; g.font = 'bold ' + 1.3 * u + 'px Arial'; g.textAlign = 'left'; g.fillText(lab, x + 1.2 * u, y + h * .72);
}
function crest(x, y, r, T, u) { g.fillStyle = T.b; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.fillStyle = T.a; g.beginPath(); g.arc(x, y, r * .8, 0, 7); g.fill(); g.fillStyle = T.b; g.font = 'bold ' + r * 1.1 + 'px Arial'; g.textAlign = 'center'; g.fillText(T.n[0], x, y + r * .38); }
function drawHUD(now) {
  const u = Math.min(W, H) / 100, A = TEAMS[cfg.t0], B = TEAMS[cfg.t1], cx = W / 2, bw = 66 * u, bh = 6.6 * u, x0 = cx - bw / 2, y0 = 1.6 * u;
  // Übertragungs-Scoreboard
  g.shadowColor = 'rgba(0,0,0,.6)'; g.shadowBlur = 2 * u;
  let q = g.createLinearGradient(0, y0, 0, y0 + bh); q.addColorStop(0, 'rgba(26,38,58,.96)'); q.addColorStop(1, 'rgba(6,10,18,.96)'); g.fillStyle = q; rr(x0, y0, bw, bh, bh / 2); g.fill(); g.shadowBlur = 0;
  g.fillStyle = A.a; rr(x0 + 1.2 * u, y0 + bh - .8 * u, bw / 2 - 9 * u, .5 * u, .25 * u); g.fill(); g.fillStyle = B.a; rr(cx + 8 * u, y0 + bh - .8 * u, bw / 2 - 9 * u, .5 * u, .25 * u); g.fill();
  crest(x0 + bh / 2, y0 + bh / 2, bh * .36, A, u); crest(x0 + bw - bh / 2, y0 + bh / 2, bh * .36, B, u);
  g.fillStyle = '#fff'; g.font = 'bold ' + 2.3 * u + 'px Arial'; g.textAlign = 'right'; g.fillText(A.n.toUpperCase(), cx - 9.5 * u, y0 + bh * .64); g.textAlign = 'left'; g.fillText(B.n.toUpperCase(), cx + 9.5 * u, y0 + bh * .64);
  q = g.createLinearGradient(0, y0, 0, y0 + bh); q.addColorStop(0, '#ffffff'); q.addColorStop(1, '#cfd8e3'); g.fillStyle = q; rr(cx - 8 * u, y0 + .9 * u, 16 * u, bh - 1.8 * u, 1.2 * u); g.fill();
  g.fillStyle = '#0b1220'; g.font = '900 ' + 4 * u + 'px Arial'; g.textAlign = 'center'; g.fillText(S.score[0] + ' – ' + S.score[1], cx, y0 + bh * .7);
  const m = Math.floor(S.time / S.total * 90), sec = Math.floor((S.time / S.total * 5400) % 60);
  g.fillStyle = 'rgba(6,10,18,.85)'; rr(cx - 10 * u, y0 + bh + .6 * u, 20 * u, 3.4 * u, 1.7 * u); g.fill();
  g.fillStyle = '#ffe14d'; g.font = 'bold ' + 2 * u + 'px Arial'; g.fillText(String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0') + '  ·  ' + S.half + '. HZ', cx, y0 + bh + 2.95 * u);
  // Spieleranzeigen mit Verlaufsbalken
  const pan = (c, x, ch, pcv, col, lab) => { if (!c) return; g.fillStyle = 'rgba(6,12,22,.72)'; rr(x, H - 16 * u, 26 * u, 14 * u, 2 * u); g.fill(); g.fillStyle = col; g.font = 'bold ' + 1.8 * u + 'px Arial'; g.textAlign = 'left'; g.fillText(lab + ' · #' + c.num, x + 1.5 * u, H - 13.1 * u); bar(x + 1.5 * u, H - 11.5 * u, 23 * u, 2.4 * u, ch, '#ffd23f', '#ff3d00', 'SCHUSS', u); bar(x + 1.5 * u, H - 8 * u, 23 * u, 2.4 * u, pcv, '#7fe3ff', '#3d7bff', 'PASS', u); bar(x + 1.5 * u, H - 4.6 * u, 23 * u, 2.4 * u, c.stam, '#ff4d4d', '#3dff7a', 'AUSDAUER', u); };
  pan(S.ctl[0], 2 * u, S.charge, Math.max(S.pc1 || 0, S.lc1 || 0), '#ffe14d', 'SPIELER 1');
  // Minimap mit Linien und Sichtfeld
  const mw = 22 * u, mh = mw * FH / FW, mx = W - mw - 3 * u, my = 2.5 * u, sx = v => mx + v / FW * mw, sy = v => my + v / FH * mh;
  g.fillStyle = 'rgba(6,12,22,.72)'; rr(mx - u, my - u, mw + 2 * u, mh + 2 * u, 1.6 * u); g.fill();
  for (let i = 0; i < 10; i++) { g.fillStyle = i % 2 ? '#2f8a40' : '#277a37'; g.fillRect(mx + i * mw / 10, my, mw / 10 + .5, mh); }
  g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = Math.max(1, u * .15); g.strokeRect(mx, my, mw, mh); g.beginPath(); g.moveTo(sx(FW / 2), my); g.lineTo(sx(FW / 2), my + mh); g.stroke(); g.beginPath(); g.arc(sx(FW / 2), sy(MY), 9.15 / FW * mw, 0, 7); g.stroke(); g.strokeRect(mx, sy(MY - 20), 16.5 / FW * mw, 40 / FH * mh); g.strokeRect(mx + mw - 16.5 / FW * mw, sy(MY - 20), 16.5 / FW * mw, 40 / FH * mh);
  g.strokeStyle = 'rgba(255,225,77,.9)'; g.strokeRect(sx(cam.x - W / sc / 2), sy(cam.y - H / (sc * .78) / 2), W / sc / FW * mw, H / (sc * .78) / FH * mh);
  players.forEach(p => { g.fillStyle = '#000'; g.beginPath(); g.arc(sx(p.x), sy(p.y), u * .6, 0, 7); g.fill(); g.fillStyle = p.team ? B.a : A.a; g.beginPath(); g.arc(sx(p.x), sy(p.y), u * .42, 0, 7); g.fill(); });
  g.shadowColor = '#fff'; g.shadowBlur = 6; g.fillStyle = '#fff'; g.beginPath(); g.arc(sx(ball.x), sy(ball.y), u * .45, 0, 7); g.fill(); g.shadowBlur = 0;
  // Einblendungen als Übertragungs-Banner
  if (S.msgT > 0 && S.msg) {
    const big = S.msg === 'TOR!', hh = big ? 17 * u : 9 * u, yy = H * .42 - hh / 2, a = clamp(S.msgT * 2, 0, 1), pulse = big ? 1 + .06 * Math.sin(now / 90) : 1;
    g.globalAlpha = a; q = g.createLinearGradient(0, 0, W, 0); q.addColorStop(0, 'rgba(0,0,0,0)'); q.addColorStop(.2, 'rgba(8,14,26,.82)'); q.addColorStop(.8, 'rgba(8,14,26,.82)'); q.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = q; g.fillRect(0, yy, W, hh);
    g.fillStyle = big ? '#ffb300' : '#4dd2ff'; g.fillRect(W * .2, yy, W * .6, .5 * u); g.fillRect(W * .2, yy + hh - .5 * u, W * .6, .5 * u);
    const fs = (big ? 12 : 6) * u * pulse; g.font = 'italic 900 ' + fs + 'px Arial'; g.textAlign = 'center'; q = g.createLinearGradient(0, H * .42 - fs / 2, 0, H * .42 + fs / 2); q.addColorStop(0, '#fff7b0'); q.addColorStop(1, big ? '#ff8a00' : '#7fe3ff'); g.shadowColor = 'rgba(0,0,0,.8)'; g.shadowBlur = 1.5 * u; g.fillStyle = q; g.fillText(S.msg, cx, H * .42 + fs * .34); g.shadowBlur = 0; g.globalAlpha = 1;
  }
}
/* ---------- Menü-Hintergrund: Stadion bei Nacht + Helden-Szene ---------- */
let menuScr = '';
function drawMenuBg(now) {
  const t = now / 1000, hh = H * .56, u = Math.min(W, H) / 100, sy = hh - H * .2;
  let q = g.createLinearGradient(0, 0, 0, hh); q.addColorStop(0, '#040a16'); q.addColorStop(.6, '#0d2142'); q.addColorStop(1, '#1b4a73'); g.fillStyle = q; g.fillRect(0, 0, W, hh);
  for (let i = 0; i < 90; i++) { const z = i % 7 ? 1.5 : 2.6; g.fillStyle = 'rgba(255,255,255,' + (.2 + .6 * Math.abs(Math.sin(t * .8 + i))) + ')'; g.fillRect(hash(i) * W, hash(i + 90) * hh * .5, z, z); }
  // Tribünenring mit flackerndem Publikum
  q = g.createLinearGradient(0, sy, 0, hh); q.addColorStop(0, '#0a1222'); q.addColorStop(1, '#22304c'); g.fillStyle = q; g.fillRect(0, sy, W, hh - sy);
  const cols = ['#e63946', '#f4d35e', '#6ec3ff', '#ffffff', '#8bd17c', '#c77dff', '#ff9f43'], rows = 7, cn = 80;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cn; c++) { const n = r * 200 + c, x = (c + .3 + hash(n) * .4) / cn * W, y = sy + (r + .6) / rows * (hh - sy) * .95; g.fillStyle = cols[Math.floor(hash(n + 5) * 7)]; g.globalAlpha = .28 + .3 * Math.abs(Math.sin(t * 1.3 + n)); g.fillRect(x, y, u * .5, u * .5); }
  g.globalAlpha = 1;
  g.fillStyle = '#04070d'; g.fillRect(0, sy - u * .5, W, u * .6);
  // Kamerablitze
  for (let k = 0; k < 6; k++) { const ph = (t * .8 + k * .37) % 1, id = Math.floor(t * .8 + k * .37) + k * 13; if (ph < .09) { const fx = hash(id) * W, fy = sy + hash(id + 3) * (hh - sy) * .8, a = 1 - ph / .09; g.fillStyle = rg(fx, fy, u * 5, 'rgba(255,255,255,' + a + ')', 'rgba(255,255,255,0)'); g.fillRect(fx - u * 5, fy - u * 5, u * 10, u * 10); } }
  // Rasen mit Streifen in Perspektive
  q = g.createLinearGradient(0, hh, 0, H); q.addColorStop(0, '#1d6a30'); q.addColorStop(1, '#0a3418'); g.fillStyle = q; g.fillRect(0, hh, W, H - hh);
  for (let i = -8; i < 8; i++) { g.fillStyle = i % 2 ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.1)'; g.beginPath(); g.moveTo(W / 2 + i * W * .02, hh); g.lineTo(W / 2 + (i + 1) * W * .02, hh); g.lineTo(W / 2 + (i + 1) * W * .3, H); g.lineTo(W / 2 + i * W * .3, H); g.fill(); }
  g.strokeStyle = 'rgba(255,255,255,.28)'; g.lineWidth = Math.max(2, u * .35); g.beginPath(); g.ellipse(W / 2, hh + (H - hh) * .62, W * .36, (H - hh) * .26, 0, 0, 7); g.stroke();
  g.beginPath(); g.moveTo(W / 2, hh); g.lineTo(W / 2, H); g.stroke();
  // Flutlichtmasten
  [.08, .34, .66, .92].forEach((fx, k) => {
    const x = W * fx, top = sy - H * .13;
    g.fillStyle = '#05080f'; g.fillRect(x - u * .3, top, u * .6, sy - top + u);
    g.fillStyle = '#0b1220'; g.fillRect(x - u * 3.2, top - u * 2.2, u * 6.4, u * 3.2);
    for (let i = 0; i < 12; i++) { g.fillStyle = '#fffbe0'; g.fillRect(x - u * 3 + (i % 6) * u * 1.02, top - u * 2 + Math.floor(i / 6) * u * 1.4, u * .8, u * .9); }
    g.globalCompositeOperation = 'lighter'; g.fillStyle = rg(x, top - u, u * 14, 'rgba(255,248,215,.45)', 'rgba(255,248,215,0)'); g.fillRect(x - u * 14, top - u * 15, u * 28, u * 28);
    const ex = x + Math.sin(t * .5 + k * 1.9) * W * .12 + (W / 2 - x) * .5; q = g.createLinearGradient(0, top, 0, H); q.addColorStop(0, 'rgba(255,250,210,.26)'); q.addColorStop(1, 'rgba(255,250,210,0)'); g.fillStyle = q; g.beginPath(); g.moveTo(x - u, top); g.lineTo(x + u, top); g.lineTo(ex + W * .09, H); g.lineTo(ex - W * .09, H); g.fill();
    g.globalCompositeOperation = 'source-over';
  });
  if (menuScr === 'main') drawHero(now, t, hh, u);
  else {
    const r = H * .06, bxp = W / 2 + Math.sin(t * .8) * W * .3, gy = hh + (H - hh) * .55, byp = gy - Math.abs(Math.sin(t * 2.4)) * H * .26, k = 1 - Math.abs(Math.sin(t * 2.4)) * .5;
    g.fillStyle = 'rgba(0,0,0,' + .4 * k + ')'; g.beginPath(); g.ellipse(bxp, gy + r * .3, r * k, r * .35 * k, 0, 0, 7); g.fill();
    paintBall(bxp, byp, r, rotAxis(.35, .9, .2, t * 3.2));
  }
  q = g.createRadialGradient(W / 2, H * .55, Math.min(W, H) * .35, W / 2, H * .55, Math.max(W, H) * .75); q.addColorStop(0, 'rgba(0,0,0,0)'); q.addColorStop(1, 'rgba(0,0,0,.6)'); g.fillStyle = q; g.fillRect(0, 0, W, H);
}
// Helden-Szene: Spieler der gewählten Teams laufen mit dem Ball auf die Kamera zu (nutzt die echte drawPlayer-Darstellung)
function drawHero(now, t, hh, u) {
  const base = H / 34 * 4.4, hero = [
    { sx: .60, sy: .80, k: .82, team: 1, num: 8, f: Math.PI / 2 + .2, ph: 1.7 },
    { sx: .88, sy: .78, k: .82, team: 1, num: 7, f: Math.PI / 2 - .25, ph: .4 },
    { sx: .74, sy: .91, k: 1, team: 0, num: 10, f: Math.PI / 2 - .12 * Math.sin(t * .7), ph: 0 }];
  cam.x = FW / 2; cam.y = MY;
  hero.forEach((h, i) => {
    sc = base * h.k; const px = h.sx * W, py = h.sy * H;
    g.globalCompositeOperation = 'lighter'; g.fillStyle = rg(px, py, H * .3 * h.k, 'rgba(255,248,215,.2)', 'rgba(255,248,215,0)'); g.fillRect(px - H * .3, py - H * .3 * .5, H * .6, H * .45); g.globalCompositeOperation = 'source-over';
    const wx = cam.x + (px - W / 2) / sc, wy = cam.y + (py - H / 2) / (sc * .78);
    drawPlayer({ x: wx, y: wy, vx: 0, vy: 5, f: h.f, anim: t * 4.5 + h.ph, team: h.team, num: h.num, gk: false, act: 0 }, now);
    if (i === 2) { const r = sc * .5, bx = px + W * .012, by = py + H * .015 + Math.sin(t * 5) * H * .012; g.fillStyle = 'rgba(0,0,0,.45)'; g.beginPath(); g.ellipse(bx, by, r * 1.3, r * .5, 0, 0, 7); g.fill(); paintBall(bx, by - r, r, rotAxis(-1, 0, 0, t * 7)); }
  });
}

/* ---------- Menüs ---------- */
const opt = (arr, sel, f = x => x) => arr.map((a, i) => `<option value="${i}"${i === sel ? ' selected' : ''}>${f(a)}</option>`).join('');
const IC = {
  play: '<svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg>',
  key: '<svg viewBox="0 0 24 24"><path d="M3 6h18a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V7a1 1 0 011-1zm2 3v2h2V9H5zm4 0v2h2V9H9zm4 0v2h2V9h-2zm4 0v2h2V9h-2zM5 13v2h2v-2H5zm4 0v2h6v-2H9zm8 0v2h2v-2h-2z"/></svg>',
  on: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  off: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M15 4l-8 8 8 8 2-2-6-6 6-6z"/></svg>',
  redo: '<svg viewBox="0 0 24 24"><path d="M12 5V2L7 6l5 4V7a5 5 0 11-5 5H5a7 7 0 107-7z"/></svg>',
  home: '<svg viewBox="0 0 24 24"><path d="M12 3l9 8h-3v9h-5v-6h-2v6H6v-9H3z"/></svg>'
};
const crH = (T, s = '6vmin') => `<i class="cr" style="--a:${T.a};--b:${T.b};--s:${s}">${T.n[0]}</i>`;
// Trikot-Set als SVG (gleiche Muster wie im Spiel: Nadelstreifen, Brustband, Schärpe, Ringel)
function kitSvg(T, ti, id) {
  const a = T.a, b = T.b, skin = '#e7b48e', J = 'M62 10 Q100 24 138 10 L180 36 L162 76 L140 62 L140 114 L60 114 L60 62 L38 76 L20 36 Z';
  const pat = [[0, 1, 2].map(i => `<rect x="${72 + i * 26}" y="0" width="8" height="120" fill="${b}"/>`).join(''), `<rect x="0" y="60" width="200" height="15" fill="${b}"/>`, `<path d="M20 14 L160 106" stroke="${b}" stroke-width="26" fill="none"/>`, [0, 1, 2].map(i => `<rect x="0" y="${24 + i * 26}" width="200" height="12" fill="${b}"/>`).join('')][ti];
  const sock = x => `<rect x="${x + 2}" y="148" width="20" height="30" fill="${skin}"/><rect x="${x}" y="168" width="24" height="24" rx="5" fill="${a}"/><rect x="${x}" y="172" width="24" height="7" fill="${b}"/><ellipse cx="${x + 12}" cy="194" rx="16" ry="6.5" fill="#101216"/><ellipse cx="${x + 12}" cy="192" rx="9" ry="2.5" fill="${b}"/>`;
  return `<svg viewBox="0 0 200 200"><defs><clipPath id="kc${id}"><path d="${J}"/></clipPath>
  <linearGradient id="ks${id}" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>
  <linearGradient id="kv${id}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient></defs>
  ${sock(66)}${sock(110)}
  <path d="M62 110 H138 L148 158 H104 L100 142 L96 158 H52 Z" fill="${b}" stroke="rgba(0,0,0,.45)" stroke-width="2.5" stroke-linejoin="round"/><path d="M62 112 L52 158M138 112 L148 158" stroke="${a}" stroke-width="5" fill="none"/>
  <g clip-path="url(#kc${id})"><path d="${J}" fill="${a}"/>${pat}<path d="M20 36 L38 76M180 36 L162 76" stroke="${b}" stroke-width="13" fill="none"/><rect width="200" height="120" fill="url(#ks${id})"/><rect width="200" height="120" fill="url(#kv${id})"/></g>
  <path d="${J}" fill="none" stroke="rgba(0,0,0,.55)" stroke-width="3" stroke-linejoin="round"/>
  <path d="M82 11 Q100 20 118 11 L100 42 Z" fill="${skin}"/><path d="M82 11 L100 42 L118 11" fill="none" stroke="${b}" stroke-width="5" stroke-linejoin="round"/>
  <text x="100" y="102" text-anchor="middle" font-family="Arial" font-size="36" font-weight="900" font-style="italic" fill="#fff" stroke="rgba(0,0,0,.7)" stroke-width="5" paint-order="stroke">10</text></svg>`;
}
const DDESC = ['Gegner spielt gemächlich', 'Ausgewogenes Spiel', 'Schnell, präzise, gnadenlos'];
function tp(side) {
  const ti = side ? cfg.t1 : cfg.t0, T = TEAMS[ti], ov = Math.round((T.at + T.mi + T.de) / 3), best = [['ANGRIFF', T.at], ['MITTELFELD', T.mi], ['ABWEHR', T.de]].sort((x, y) => y[1] - x[1])[0][0];
  return `<div class="tp ${side ? 'r' : 'l'}" style="--a:${T.a};--b:${T.b};background:linear-gradient(160deg,${T.a}dd,#0a1424 72%)"><div class="top"><div class="lbl">${side ? 'GEGNER' : 'DEIN TEAM'}</div>${crH(T, '5.4vmin')}</div>
  <div class="kitw">${kitSvg(T, ti, side)}</div>
  <div class="nm"><u data-t="${side}" data-d="-1">◀</u><span>${T.n}</span><u data-t="${side}" data-d="1">▶</u></div>
  <div class="ovr"><div class="ring" style="--v:${ov}"><b>${ov}</b></div><div class="ovt"><div class="ol2">GESAMT</div><div class="bst">STÄRKSTER BEREICH<br><strong>${best}</strong></div></div></div>
  ${[['ANGRIFF', T.at], ['MITTELFELD', T.mi], ['ABWEHR', T.de]].map(([l, v]) => `<div class="st"><em>${l}</em><div><s style="width:${v}%;background:linear-gradient(90deg,${T.b},#fff)"></s></div><b>${v}</b></div>`).join('')}</div>`;
}
function segc(k, opts, cur) { return `<div class="seg">${opts.map(([v, l]) => `<b class="${v === cur ? 'on' : ''}" data-k="${k}" data-v="${v}">${l}</b>`).join('')}</div>`; }
const kr = rows => rows.map(([k, l, c]) => `<div class="kr"><span><i class="d" style="background:${c}"></i>${l}</span><span>${k.map(x => `<kbd>${x}</kbd>`).join('')}</span></div>`).join('');
const pad = k => `<div class="pad">${k.map(x => `<kbd>${x}</kbd>`).join('')}</div><div class="padl">LAUFEN</div>`;
function menu(sc = 'main') {
  const same = sc === menuScr; menuScr = sc; S = {}; const st = same ? ' still' : '';
  const go = (id, f) => { const e = $(id); if (e) e.onclick = () => { Audio_.click(); f(); }; };
  const A = TEAMS[cfg.t0], B = TEAMS[cfg.t1];
  if (sc === 'main') {
    ui.innerHTML = `<div class="scr main${st}"><div class="side"><svg class="slant" viewBox="0 0 100 100" preserveAspectRatio="none"><line x1="99.7" y1="0" x2="83.7" y2="100"/></svg><div class="logo"><span>TURBO</span><span>KICK</span></div><div class="tag">FUSSBALL · 5 GEGEN 5</div>
    <div class="mb big" id="m1" style="animation-delay:.15s">${IC.play}<span>Spiel starten<small>Freundschaftsspiel</small></span></div><div class="mb" id="m2" style="animation-delay:.25s">${IC.key}<span>Steuerung</span></div><div class="mb" id="m3" style="animation-delay:.35s">${cfg.sound ? IC.on : IC.off}<span>Ton: ${cfg.sound ? 'An' : 'Aus'}</span></div></div>
    <div class="nx"><div class="t">NÄCHSTES SPIEL</div><div class="m">${crH(A, '4.6vmin')}<span>${A.n}</span><b>VS</b><span>${B.n}</span>${crH(B, '4.6vmin')}</div><div class="p"><i>${DIFF[cfg.diff].n.toUpperCase()}</i><i>${cfg.mins} MIN</i></div></div>
    <div class="ver">Alle Teams und Spieler sind frei erfunden</div></div>`;
    go('m1', () => menu('setup')); go('m2', () => menu('ctl')); go('m3', () => { cfg.sound = !cfg.sound; Audio_.on = cfg.sound; menu(); });
  } else if (sc === 'setup') {
    ui.innerHTML = `<div class="scr setup${st}"><div class="hd"><h2>Freundschaftsspiel</h2><div class="crumb">SPIELVORBEREITUNG</div></div>
    <div class="arena">${tp(0)}<div class="mid"><div class="vsb">VS</div>
    <div><div class="ol">SCHWIERIGKEIT</div>${segc('diff', DIFF.map((d, i) => [i, d.n.toUpperCase()]), cfg.diff)}<div class="dsc">${DDESC[cfg.diff] || ''}</div></div>
    <div><div class="ol">SPIELZEIT</div>${segc('mins', [[3, '3 MIN'], [5, '5 MIN'], [10, '10 MIN']], cfg.mins)}</div></div>${tp(1)}</div>
    <div class="ft"><div class="mb" id="back">${IC.back}<span>Zurück</span></div><div class="sum">${A.n} – ${B.n} · ${cfg.mins} Min · ${DIFF[cfg.diff].n}</div><div class="mb big" id="go"><span>Anstoss</span>${IC.play}</div></div></div>`;
    ui.querySelectorAll('[data-t]').forEach(el => el.onclick = () => { const sd = +el.dataset.t, d = +el.dataset.d, k = sd ? 't1' : 't0', o = sd ? 't0' : 't1'; let v = cfg[k]; do v = (v + d + 4) % 4; while (v === cfg[o]); cfg[k] = v; Audio_.click(); menu('setup'); });
    ui.querySelectorAll('[data-k]').forEach(el => el.onclick = () => { cfg[el.dataset.k] = +el.dataset.v; Audio_.click(); menu('setup'); });
    go('back', () => menu()); go('go', () => { Audio_.on = cfg.sound; newMatch(); });
  } else {
    ui.innerHTML = `<div class="scr ctl${st}"><div class="hd"><h2>Steuerung</h2><div class="crumb">TASTATUR</div></div><div class="cols">
    <div class="cc" style="--c:#ffe14d"><h3>SPIELER 1</h3>${pad(['W', 'A', 'S', 'D'])}${kr([[['Leertaste'], 'Sprint', '#5dff8f'], [['J'], 'Pass (halten = härter)', '#4dd2ff'], [['K'], 'Flanke (halten = härter)', '#4dd2ff'], [['L'], 'Schuss (halten)', '#ff5e1a'], [['I'], 'Steilpass', '#4dd2ff'], [['Shift'], 'Spielerwechsel', '#c77dff']])}<div class="kr"><span><i class="d" style="background:#9fb4d0"></i>Pause</span><span><kbd>Esc</kbd></span></div></div>
    <div class="cc tip"><h3>TIPPS</h3><ul><li>Schuss und Pässe: Taste halten, dann wird der Ball härter gespielt.</li><li>Sprint kostet Ausdauer, also nicht dauerhaft rennen.</li><li>Spielerwechsel: du übernimmst den Spieler, der dem Ball am nächsten ist.</li><li>Der Steilpass geht in deine Blickrichtung, also vorher ausrichten.</li></ul></div></div>
    <div class="ft"><div class="mb" id="back">${IC.back}<span>Zurück</span></div></div></div>`;
    go('back', () => menu());
  }
}
/* ---------- Pause und Spielende ---------- */
const clkH = () => { const m = Math.floor(S.time / S.total * 90), sec = Math.floor((S.time / S.total * 5400) % 60); return String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0') + '  ·  ' + S.half + '. HZ'; };
const scoreH = (A, B) => `<div class="sb"><div class="tm">${crH(A, '8vmin')}<div class="tn">${A.n}</div></div><div class="sc">${S.score[0]} : ${S.score[1]}</div><div class="tm">${crH(B, '8vmin')}<div class="tn">${B.n}</div></div></div>`;
const cmpH = (A, B, rows) => `<div class="cmp">${rows.map(([l, v0, v1, p0]) => `<div class="r"><b>${v0}</b><div><em>${l.toUpperCase()}</em><div class="bars"><i><s style="width:${p0}%;background:${A.a === '#ffffff' ? A.b : A.a}"></s></i><i><s style="width:${100 - p0}%;background:${B.a}"></s></i></div></div><b>${v1}</b></div>`).join('')}</div>`;
const statRows = (st, all) => { const tot = st[0].pos + st[1].pos || 1, sh = (a, b) => a + b ? Math.round(a / (a + b) * 100) : 50, r = [['Ballbesitz', Math.round(st[0].pos / tot * 100) + '%', Math.round(st[1].pos / tot * 100) + '%', Math.round(st[0].pos / tot * 100)], ['Schüsse', st[0].sh, st[1].sh, sh(st[0].sh, st[1].sh)], ['Pässe', st[0].ps, st[1].ps, sh(st[0].ps, st[1].ps)]]; if (all) r.push(['Fouls', st[0].fl, st[1].fl, sh(st[0].fl, st[1].fl)], ['Ecken', st[0].co, st[1].co, sh(st[0].co, st[1].co)]); return r; };
function pause() {
  S.phase = 'pause'; menuScr = ''; const A = TEAMS[cfg.t0], B = TEAMS[cfg.t1];
  ui.innerHTML = `<div class="pov"><div class="pan"><div class="eb">SPIEL UNTERBROCHEN</div><h2>Pause</h2>${scoreH(A, B)}<div class="clk">${clkH()}</div>${cmpH(A, B, statRows(S.stats, false))}
  <div class="bt"><div class="mb big" id="a">${IC.play}<span>Fortsetzen</span></div><div class="bt row"><div class="mb" id="b">${IC.redo}<span>Neustart</span></div><div class="mb" id="c2">${IC.home}<span>Hauptmenü</span></div></div></div></div></div>`;
  $('a').onclick = () => { Audio_.click(); S.phase = 'play'; ui.innerHTML = ''; }; $('b').onclick = () => { Audio_.click(); newMatch(); }; $('c2').onclick = () => { Audio_.click(); menu(); };
}
function endMatch() {
  S.phase = 'end'; menuScr = ''; Audio_.whistle(); const st = S.stats, A = TEAMS[cfg.t0], B = TEAMS[cfg.t1], s0 = S.score[0], s1 = S.score[1];
  const res = s0 > s1 ? A.n + ' gewinnt!' : s0 < s1 ? B.n + ' gewinnt!' : 'Unentschieden';
  const hl = (s0 > s1 ? ['Sieg', ''] : s0 < s1 ? ['Niederlage', 'lose'] : ['Unentschieden', 'draw']);
  const conf = s0 > s1 ? '<div class="cf">' + Array.from({ length: 36 }, (_, i) => `<i style="left:${Math.round(hash(i + 500) * 100)}%;background:${['#ffb300', '#ffe14d', '#5dff8f', '#4dd2ff', '#ff5e1a', '#fff'][i % 6]};animation-duration:${(3 + hash(i + 600) * 3).toFixed(2)}s;animation-delay:-${(hash(i + 700) * 5).toFixed(2)}s"></i>`).join('') + '</div>' : '';
  ui.innerHTML = `<div class="pov">${conf}<div class="pan"><div class="eb">SPIELENDE</div><div class="hl ${hl[1]}">${hl[0]}</div><div class="rs">${res}</div>${scoreH(A, B)}${cmpH(A, B, statRows(st, true))}
  <div class="bt row"><div class="mb big" id="r">${IC.redo}<span>Revanche</span></div><div class="mb" id="h">${IC.home}<span>Hauptmenü</span></div></div></div></div>`;
  $('r').onclick = () => { Audio_.click(); newMatch(); }; $('h').onclick = () => { Audio_.click(); menu(); };
}

/* ---------- Hauptschleife (Delta-Time) ---------- */
let last = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  try { update(dt); draw(now); } catch (e) { showErr(e); return; }
  requestAnimationFrame(loop);
}
function showErr(e) { console.error(e); ui.innerHTML = '<div class="box"><h2>Fehler</h2><div class="small">' + e.message + '</div><button onclick="location.reload()">Neu laden</button></div>'; }
addEventListener('error', e => showErr(e.error || new Error(e.message)));
menu(); requestAnimationFrame(loop);
})();