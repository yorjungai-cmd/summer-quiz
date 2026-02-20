"use client";
// ==================== IMPORTS ====================
import { useState } from "react";
import THAI_QUESTIONS from "../questions/Thai";
import MATH_QUESTIONS from "../questions/Math";

// ==================== VERSION ====================
const APP_VERSION = "1.0.0";

// ==================== QUESTION BANK ====================
const QUESTION_BANK = {
  thai: THAI_QUESTIONS,
  math: MATH_QUESTIONS,
};

// ==================== STYLES ====================
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Kanit', sans-serif; background: #1a0533; overflow: hidden; user-select: none; -webkit-user-select: none; }

  .app-root {
    width: 100vw; height: 100vh; position: relative; overflow: hidden;
    background: linear-gradient(135deg, #0f0524 0%, #1a0533 40%, #0d1b4b 100%);
  }
  .stars {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      radial-gradient(1px 1px at 10% 15%, #fff 0%, transparent 100%),
      radial-gradient(1px 1px at 25% 60%, rgba(255,255,255,0.8) 0%, transparent 100%),
      radial-gradient(1px 1px at 40% 30%, #fff 0%, transparent 100%),
      radial-gradient(1px 1px at 60% 80%, rgba(255,255,255,0.6) 0%, transparent 100%),
      radial-gradient(1px 1px at 75% 20%, #fff 0%, transparent 100%),
      radial-gradient(1px 1px at 88% 55%, rgba(255,255,255,0.7) 0%, transparent 100%),
      radial-gradient(2px 2px at 35% 10%, rgba(255,220,100,0.8) 0%, transparent 100%),
      radial-gradient(2px 2px at 70% 40%, rgba(150,200,255,0.8) 0%, transparent 100%);
  }
  .screen { position: relative; z-index: 1; width: 100%; height: 100vh; display: flex; flex-direction: column; }
  .card { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; backdrop-filter: blur(10px); }
  .btn { font-family: 'Kanit', sans-serif; font-weight: 700; border: none; cursor: pointer; transition: all 0.15s ease; position: relative; overflow: hidden; }
  .btn:active { transform: scale(0.95); }
  .btn::after { content: ''; position: absolute; inset: 0; background: linear-gradient(rgba(255,255,255,0.2), transparent); pointer-events: none; }
  .btn:disabled { cursor: not-allowed; }

  .hp-bar-bg { background: rgba(0,0,0,0.4); border-radius: 10px; overflow: hidden; height: 16px; border: 2px solid rgba(255,255,255,0.2); }
  .hp-bar-fill { height: 100%; border-radius: 8px; transition: width 0.6s cubic-bezier(0.4,0,0.2,1); position: relative; }
  .hp-bar-fill::after { content: ''; position: absolute; top: 2px; left: 5px; right: 5px; height: 4px; background: rgba(255,255,255,0.4); border-radius: 3px; }

  .choice-btn {
    width: 100%; padding: 14px 16px; border-radius: 14px;
    font-family: 'Kanit', sans-serif; font-size: 1.05rem; font-weight: 600;
    text-align: left; cursor: pointer; border: 2px solid rgba(255,255,255,0.2);
    background: rgba(255,255,255,0.08); color: white; transition: all 0.15s ease;
    display: flex; align-items: center; gap: 12px; backdrop-filter: blur(5px);
  }
  .choice-btn:hover:not(:disabled) { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.4); transform: translateX(4px); }
  .choice-btn.selected { background: rgba(124,58,237,0.4); border-color: #a855f7; box-shadow: 0 0 20px rgba(168,85,247,0.4); }
  .review-correct { background: rgba(34,197,94,0.2) !important; border-color: #22c55e !important; }
  .review-wrong   { background: rgba(239,68,68,0.2) !important;  border-color: #ef4444 !important; }

  .screen-shake { animation: shake 0.4s ease; }
  .damage-text { position: absolute; font-family: 'Kanit', sans-serif; font-weight: 900; font-size: 2.2rem; text-shadow: 0 0 10px rgba(255,215,0,0.8), 2px 2px 0 #000; animation: damage-float 0.8s ease-out forwards; pointer-events: none; z-index: 100; }
  .result-card { animation: bounce-in 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  .confetti-piece { position: fixed; animation: confetti-fall linear forwards; z-index: 999; border-radius: 2px; }

  @keyframes float1  { 0%,100%{transform:translateY(0) rotate(0deg);opacity:.7} 50%{transform:translateY(-18px) rotate(180deg);opacity:1} }
  @keyframes float2  { 0%,100%{transform:translateY(0) translateX(0);opacity:.5} 33%{transform:translateY(-14px) translateX(9px);opacity:.9} 66%{transform:translateY(-5px) translateX(-7px);opacity:.6} }
  @keyframes pulse-glow { 0%,100%{box-shadow:0 0 20px rgba(255,107,53,0.5)} 50%{box-shadow:0 0 40px rgba(255,107,53,0.9),0 0 60px rgba(255,107,53,0.4)} }
  @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-10px) rotate(-2deg)} 40%{transform:translateX(10px) rotate(2deg)} 60%{transform:translateX(-8px)} 80%{transform:translateX(8px)} }
  @keyframes bounce-in { 0%{transform:scale(0) rotate(-10deg);opacity:0} 60%{transform:scale(1.2) rotate(3deg);opacity:1} 80%{transform:scale(0.95)} 100%{transform:scale(1);opacity:1} }
  @keyframes monster-idle { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-8px) scale(1.02)} }
  @keyframes monster-hurt { 0%{transform:translateX(0) scale(1);filter:brightness(1)} 25%{transform:translateX(20px) scale(0.95);filter:brightness(3) saturate(0)} 50%{transform:translateX(-15px) scale(1.05);filter:brightness(2) hue-rotate(180deg)} 75%{transform:translateX(10px);filter:brightness(1.5)} 100%{transform:translateX(0) scale(1);filter:brightness(1)} }
  @keyframes hero-attack { 0%{transform:translateX(0) scale(1)} 40%{transform:translateX(60px) scale(1.1)} 70%{transform:translateX(40px) scale(0.95)} 100%{transform:translateX(0) scale(1)} }
  @keyframes hero-hurt { 0%{transform:translateX(0);filter:brightness(1)} 30%{transform:translateX(-20px);filter:brightness(2) hue-rotate(180deg)} 60%{transform:translateX(10px);filter:brightness(1.5)} 100%{transform:translateX(0);filter:brightness(1)} }
  @keyframes damage-float { 0%{transform:translateY(0) scale(0.5);opacity:1} 100%{transform:translateY(-80px) scale(1.3);opacity:0} }
  @keyframes confetti-fall { 0%{transform:translateY(-100px) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(720deg);opacity:0} }
  @keyframes rainbow { 0%{filter:hue-rotate(0deg)} 100%{filter:hue-rotate(360deg)} }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 3px; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
`;

// ==================== CONFIG ====================
const SUBJECTS = [
  {
    id: "thai", name: "ภาษาไทย", emoji: "📚",
    color: "#ff6b35", gradient: "linear-gradient(135deg, #ff6b35, #ff9a5c)",
    monster: "🐉", monsterName: "ราชามังกร",
    hero: "🧙‍♀️", heroName: "ซัมเมอร์นักเวท",
    available: true,
  },
  {
    id: "math", name: "คณิตศาสตร์", emoji: "🔢",
    color: "#6b7280", gradient: "linear-gradient(135deg, #4b5563, #6b7280)",
    monster: "🤖", monsterName: "หุ่นยนต์ยักษ์",
    hero: "🦸‍♀️", heroName: "ซัมเมอร์ฮีโร่",
    available: false,
    comingSoon: "รออัพเดท",
  },
];

const QUIZ_SIZES = [10, 20, 50, 100];

// ==================== UTILITIES ====================
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getRewardInfo(score, total) {
  const pct = Math.round((score / total) * 100);
  if (pct < 50) return { emoji: "😱", title: "โอ้โห!", msg: "โดนยึด iPad\nงดทีวี งดเครื่องเกมส์!", color: "#ef4444", bg: "linear-gradient(135deg,#7f1d1d,#991b1b)", confetti: false, shake: true };
  if (pct < 60) return { emoji: "😰", title: "เสียใจด้วยนะ", msg: "โดนยึด iPad\nกับเครื่องเกมส์!", color: "#f97316", bg: "linear-gradient(135deg,#7c2d12,#9a3412)", confetti: false, shake: true };
  if (pct < 70) return { emoji: "😅", title: "เกือบแล้ว", msg: "โดนยึด TV นะ!\nพยายามอีกนิดนึง", color: "#eab308", bg: "linear-gradient(135deg,#713f12,#854d0e)", confetti: false };
  if (pct < 90) return { emoji: "😊", title: "เก่งมาก!", msg: "ผ่านเกณฑ์แล้ว!\nพยายามอีกนิดนึงนะ", color: "#22c55e", bg: "linear-gradient(135deg,#14532d,#166534)", confetti: true };
  if (pct < 95) return { emoji: "🏆", title: "สุดยอด!!", msg: "ได้เครื่องเกมส์\nพกพาเครื่องใหม่!! 🎮", color: "#ffd700", bg: "linear-gradient(135deg,#1a1a2e,#16213e)", confetti: true, rainbow: true };
  return { emoji: "👑", title: "อัจฉริยะ!!!", msg: "ได้มือถือเครื่องใหม่!!\n🎉🎊🎈", color: "#ff6bff", bg: "linear-gradient(135deg,#0a0015,#150025)", confetti: true, rainbow: true, ultra: true };
}

function loadStats() {
  try { return JSON.parse(localStorage.getItem("summerQuizStats") || '{"exp":0,"level":1,"totalCorrect":0,"totalAnswered":0}'); }
  catch { return { exp: 0, level: 1, totalCorrect: 0, totalAnswered: 0 }; }
}
function saveStats(s) { try { localStorage.setItem("summerQuizStats", JSON.stringify(s)); } catch {} }
function loadHistory() { try { return JSON.parse(localStorage.getItem("summerQuizHistory") || "[]"); } catch { return []; } }
function saveHistory(h) { try { localStorage.setItem("summerQuizHistory", JSON.stringify(h.slice(-50))); } catch {} }

// ==================== SHARED COMPONENTS ====================
function Particles() {
  const items = ["⭐","✨","💫","🌟","⚡","💎","🔮"];
  return (
    <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0 }}>
      {Array.from({length:12},(_,i)=>(
        <div key={i} style={{ position:"absolute", left:`${(i*8.7+5)%100}%`, top:`${(i*13.3+10)%90}%`, fontSize:`${1+(i%3)*0.5}rem`, animation:`float${i%2+1} ${3+i%3}s ease-in-out infinite`, animationDelay:`${i*0.4}s`, opacity:0.6 }}>
          {items[i%items.length]}
        </div>
      ))}
    </div>
  );
}

function HPBar({ current, max, color, label }) {
  const pct = Math.max(0, Math.min(100, (current/max)*100));
  const barColor = pct > 60 ? color : pct > 30 ? "#f59e0b" : "#ef4444";
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3, fontSize:"0.8rem", fontWeight:700, color:"rgba(255,255,255,0.9)" }}>
        <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"68%" }}>{label}</span>
        <span style={{ color:barColor, flexShrink:0 }}>{current}/{max}</span>
      </div>
      <div className="hp-bar-bg">
        <div className="hp-bar-fill" style={{ width:`${pct}%`, background:`linear-gradient(90deg,${barColor},${barColor}dd)` }}/>
      </div>
    </div>
  );
}

function Confetti({ count=60 }) {
  const colors=["#ff6b35","#ffd700","#00e5ff","#ff6bff","#22c55e","#f97316","#a855f7"];
  return (
    <>
      {Array.from({length:count},(_,i)=>(
        <div key={i} className="confetti-piece" style={{
          left:`${Math.random()*100}%`, top:"-20px",
          background:colors[i%colors.length],
          width:6+Math.random()*8, height:6+Math.random()*8,
          borderRadius:i%3===0?"50%":"2px",
          animationDuration:`${2+Math.random()*2}s`,
          animationDelay:`${Math.random()*2}s`,
          transform:`rotate(${Math.random()*360}deg)`,
        }}/>
      ))}
    </>
  );
}

// ==================== SCREENS ====================
function HomeScreen({ onSelectSubject, stats }) {
  const level = stats.level;
  const expForNext = level * 100;
  const expPct = (stats.exp % expForNext) / expForNext * 100;

  return (
    <div className="screen" style={{ padding:"18px 24px", justifyContent:"space-between" }}>
      <Particles/>

      {/* Title */}
      <div style={{ textAlign:"center", position:"relative", zIndex:2 }}>
        <div style={{ fontSize:"1.9rem", fontWeight:900, background:"linear-gradient(90deg,#ffd700,#ff6b35,#ff6bff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", lineHeight:1.2 }}>
          🌟 มาช่วยติวน้องซัมเมอร์สอบกันเถอะ!! 🌟
        </div>
      </div>

      {/* Level Card */}
      <div className="card" style={{ padding:"14px 20px", display:"flex", alignItems:"center", gap:16, position:"relative", zIndex:2 }}>
        <div style={{ width:60, height:60, borderRadius:"50%", background:"linear-gradient(135deg,#ffd700,#ff6b35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.8rem", flexShrink:0, boxShadow:"0 0 20px rgba(255,215,0,0.5)" }}>
          {level<5?"🌱":level<10?"⭐":level<20?"🌟":"👑"}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:800, fontSize:"1.2rem", color:"#ffd700" }}>น้องซัมเมอร์ • เลเวล {level}</div>
          <div style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.85rem", marginBottom:5 }}>EXP: {stats.exp%expForNext} / {expForNext}</div>
          <div className="hp-bar-bg" style={{ height:12 }}>
            <div className="hp-bar-fill" style={{ width:`${expPct}%`, background:"linear-gradient(90deg,#a855f7,#ffd700)" }}/>
          </div>
        </div>
        <div style={{ textAlign:"center", flexShrink:0 }}>
          <div style={{ fontSize:"1.6rem" }}>🏆</div>
          <div style={{ fontSize:"1rem", fontWeight:800, color:"#ffd700" }}>{stats.totalCorrect}</div>
          <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.6)" }}>ข้อถูก</div>
        </div>
      </div>

      {/* Subject Grid */}
      <div>
        <div style={{ textAlign:"center", fontSize:"1.1rem", fontWeight:700, color:"rgba(255,255,255,0.8)", marginBottom:14, position:"relative", zIndex:2 }}>
          🎯 เลือกวิชาที่ต้องการสอบ
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, position:"relative", zIndex:2 }}>
          {SUBJECTS.map(sub => (
            <button
              key={sub.id}
              className="btn"
              onClick={() => sub.available && onSelectSubject(sub)}
              disabled={!sub.available}
              style={{
                padding:"22px 16px", borderRadius:22,
                background: sub.available ? sub.gradient : "linear-gradient(135deg,#374151,#4b5563)",
                color: sub.available ? "white" : "rgba(255,255,255,0.45)",
                fontSize:"1.3rem", fontWeight:800,
                boxShadow: sub.available ? `0 8px 28px ${sub.color}60` : "none",
                border: sub.available ? `3px solid ${sub.color}80` : "3px solid rgba(255,255,255,0.1)",
                display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                animation: sub.available ? "pulse-glow 2s ease-in-out infinite" : "none",
                opacity: sub.available ? 1 : 0.6,
              }}
            >
              <span style={{ fontSize:"2.8rem", filter: sub.available ? "none" : "grayscale(1)" }}>{sub.emoji}</span>
              <span>{sub.name}</span>
              {sub.available ? (
                <span style={{ fontSize:"0.8rem", fontWeight:500, opacity:0.85 }}>
                  {QUESTION_BANK[sub.id].length} ข้อในคลัง
                </span>
              ) : (
                <span style={{ fontSize:"0.8rem", fontWeight:700, background:"rgba(0,0,0,0.3)", padding:"3px 10px", borderRadius:20, color:"rgba(255,255,255,0.5)" }}>
                  🔒 {sub.comingSoon}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer with version */}
      <div style={{ textAlign:"center", position:"relative", zIndex:2 }}>
        <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"0.75rem" }}>
          ผจญภัยกับน้องซัมเมอร์ • ประถม 1 &nbsp;|&nbsp;
          <span style={{ color:"rgba(255,255,255,0.5)", fontWeight:700 }}>v{APP_VERSION}</span>
        </div>
      </div>
    </div>
  );
}

function ConfigScreen({ subject, onStart, onBack }) {
  const [size, setSize] = useState(10);
  const maxQ = QUESTION_BANK[subject.id].length;
  const available = QUIZ_SIZES.filter(s => s <= maxQ);

  return (
    <div className="screen" style={{ padding:"30px", justifyContent:"center", alignItems:"center", gap:22 }}>
      <Particles/>
      <div style={{ textAlign:"center", position:"relative", zIndex:2 }}>
        <div style={{ fontSize:"4rem", animation:"monster-idle 2s ease-in-out infinite" }}>{subject.monster}</div>
        <div style={{ fontSize:"1.7rem", fontWeight:900, color:"#ffd700", marginTop:8 }}>{subject.monsterName}</div>
        <div style={{ color:"rgba(255,255,255,0.7)", marginTop:4 }}>กำลังรอท้าทายน้องซัมเมอร์!</div>
      </div>

      <div className="card" style={{ padding:"24px", width:"100%", maxWidth:520, position:"relative", zIndex:2 }}>
        <div style={{ fontSize:"1.2rem", fontWeight:800, color:"white", textAlign:"center", marginBottom:18 }}>⚔️ วิชา {subject.name} ⚔️</div>
        <div style={{ fontSize:"1rem", fontWeight:600, color:"rgba(255,255,255,0.8)", marginBottom:12 }}>จะสอบกี่ข้อ?</div>
        <div style={{ display:"grid", gridTemplateColumns:`repeat(${available.length},1fr)`, gap:10 }}>
          {available.map(s => (
            <button key={s} className="btn" onClick={() => setSize(s)} style={{
              padding:"16px 8px", borderRadius:14,
              background: size===s ? subject.gradient : "rgba(255,255,255,0.1)",
              color:"white", fontSize:"1.4rem", fontWeight:800,
              border: size===s ? `3px solid ${subject.color}` : "3px solid rgba(255,255,255,0.2)",
              boxShadow: size===s ? `0 0 20px ${subject.color}60` : "none",
              transition:"all 0.2s ease",
            }}>
              {s}<br/><span style={{ fontSize:"0.7rem", fontWeight:500, opacity:0.8 }}>ข้อ</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", gap:14, width:"100%", maxWidth:520, position:"relative", zIndex:2 }}>
        <button className="btn" onClick={onBack} style={{ flex:1, padding:"16px", borderRadius:14, background:"rgba(255,255,255,0.1)", color:"white", fontSize:"1.05rem", fontWeight:700, border:"2px solid rgba(255,255,255,0.2)" }}>← กลับ</button>
        <button className="btn" onClick={() => onStart(size)} style={{ flex:2, padding:"16px", borderRadius:14, background:subject.gradient, color:"white", fontSize:"1.2rem", fontWeight:800, boxShadow:`0 8px 24px ${subject.color}60`, border:"none", animation:"pulse-glow 2s ease-in-out infinite" }}>⚔️ เริ่มสู้เลย!</button>
      </div>
    </div>
  );
}

function QuizScreen({ subject, questions, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [monsterHP, setMonsterHP] = useState(questions.length);
  const [heroHP, setHeroHP] = useState(questions.length);
  const [animState, setAnimState] = useState(null);
  const [damageText, setDamageText] = useState(null);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const q = questions[current];
  const totalQ = questions.length;
  const isLast = current === totalQ - 1;
  const LABELS = ["ก","ข","ค","ง"];

  function handleConfirm() {
    if (selected === null || confirmed) return;
    setConfirmed(true);
    const ok = selected === q.answer;
    setAnswers(prev => ({...prev, [current]: selected}));
    if (ok) {
      setAnimState("attack");
      setDamageText({text:"💥 ถูก!", type:"correct"});
      setTimeout(() => setMonsterHP(h => Math.max(0,h-1)), 300);
    } else {
      setAnimState("hurt");
      setShakeScreen(true);
      setDamageText({text:"❌ ผิด!", type:"wrong"});
      setTimeout(() => { setHeroHP(h => Math.max(0,h-1)); setShakeScreen(false); }, 400);
    }
    setTimeout(() => { setAnimState(null); setDamageText(null); }, 800);
  }

  function handleNext() {
    if (isLast) { onFinish({...answers,[current]:selected}, questions); }
    else { setCurrent(c=>c+1); setSelected(null); setConfirmed(false); }
  }

  return (
    <div className={`screen${shakeScreen?" screen-shake":""}`} style={{ padding:"12px 16px", gap:9, position:"relative" }}>
      {damageText && (
        <div className="damage-text" style={{ top:"28%", left:"50%", transform:"translateX(-50%)", color:damageText.type==="correct"?"#ffd700":"#ef4444" }}>
          {damageText.text}
        </div>
      )}

      {/* Progress Bar */}
      <div style={{ display:"flex", alignItems:"center", gap:10, position:"relative", zIndex:2 }}>
        <div style={{ fontWeight:800, fontSize:"0.95rem", color:subject.color, minWidth:72 }}>ข้อ {current+1}/{totalQ}</div>
        <div className="hp-bar-bg" style={{ flex:1 }}>
          <div className="hp-bar-fill" style={{ width:`${(current/totalQ)*100}%`, background:subject.gradient }}/>
        </div>
        <div style={{ fontSize:"0.85rem", fontWeight:700, color:"rgba(255,255,255,0.55)", minWidth:44, textAlign:"right" }}>{Object.keys(answers).length}/{totalQ}</div>
      </div>

      {/* Battle */}
      <div className="card" style={{ padding:"12px 16px", display:"flex", gap:14, alignItems:"center", position:"relative", zIndex:2 }}>
        <div style={{ flex:1 }}>
          <HPBar current={heroHP} max={totalQ} color="#22c55e" label={`${subject.hero} ซัมเมอร์`}/>
          <div style={{ textAlign:"center", fontSize:"2.8rem", marginTop:5, animation:animState==="attack"?"hero-attack 0.5s ease":animState==="hurt"?"hero-hurt 0.4s ease":"monster-idle 3s ease-in-out infinite" }}>
            {subject.hero}
          </div>
        </div>
        <div style={{ fontWeight:900, fontSize:"1.2rem", color:"#ffd700", textShadow:"0 0 10px rgba(255,215,0,0.7)", flexShrink:0, textAlign:"center" }}>⚔️<br/>VS</div>
        <div style={{ flex:1 }}>
          <HPBar current={monsterHP} max={totalQ} color="#ef4444" label={`${subject.monster} ${subject.monsterName}`}/>
          <div style={{ textAlign:"center", fontSize:"2.8rem", marginTop:5, animation:animState==="attack"?"monster-hurt 0.5s ease":"monster-idle 2.5s ease-in-out infinite", display:"inline-block", width:"100%" }}>
            {monsterHP<=0?"💀":subject.monster}
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="card" style={{ padding:"12px 16px", position:"relative", zIndex:2, flexShrink:0 }}>
        <div style={{ fontSize:"0.75rem", fontWeight:600, color:subject.color, marginBottom:3 }}>📖 {q.topic}</div>
        <div style={{ fontSize:"1.2rem", fontWeight:700, color:"white", lineHeight:1.4 }}>{q.question}</div>
      </div>

      {/* Choices */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7, flex:1, position:"relative", zIndex:2 }}>
        {q.choices.map((c,i) => (
          <button key={i} className={`choice-btn${selected===i?" selected":""}`} onClick={()=>!confirmed&&setSelected(i)} disabled={confirmed}>
            <span style={{ width:30, height:30, borderRadius:"50%", flexShrink:0, background:selected===i?"rgba(168,85,247,0.6)":"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"0.95rem", border:selected===i?"2px solid #a855f7":"2px solid rgba(255,255,255,0.2)" }}>
              {LABELS[i]}
            </span>
            <span style={{ flex:1, fontSize:"1rem", lineHeight:1.3 }}>{c}</span>
          </button>
        ))}
      </div>

      {/* Action */}
      <div style={{ position:"relative", zIndex:2, flexShrink:0 }}>
        {!confirmed ? (
          <button className="btn" onClick={handleConfirm} disabled={selected===null} style={{ width:"100%", padding:"15px", borderRadius:14, background:selected!==null?subject.gradient:"rgba(255,255,255,0.1)", color:"white", fontSize:"1.15rem", fontWeight:800, border:"none", opacity:selected!==null?1:0.5, transition:"all 0.2s", boxShadow:selected!==null?`0 8px 24px ${subject.color}60`:"none" }}>
            ⚔️ ยืนยันคำตอบ!
          </button>
        ) : (
          <button className="btn" onClick={handleNext} style={{ width:"100%", padding:"15px", borderRadius:14, background:isLast?"linear-gradient(135deg,#ffd700,#ff6b35)":"linear-gradient(135deg,#22c55e,#16a34a)", color:"white", fontSize:"1.15rem", fontWeight:800, border:"none", boxShadow:isLast?"0 8px 24px rgba(255,215,0,0.5)":"0 8px 24px rgba(34,197,94,0.5)" }}>
            {isLast?"🏁 ดูผลคะแนน!":"ข้อถัดไป →"}
          </button>
        )}
      </div>
    </div>
  );
}

function ResultsScreen({ subject, questions, answers, onReview, onHome, onRetry }) {
  const score = questions.filter((q,i) => answers[i]===q.answer).length;
  const total = questions.length;
  const pct = Math.round((score/total)*100);
  const r = getRewardInfo(score, total);
  const wrongQ = questions.filter((q,i) => answers[i]!==q.answer);

  return (
    <div className="screen" style={{ justifyContent:"center", alignItems:"center", padding:"20px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", inset:0, background:r.bg, zIndex:0 }}/>
      {r.confetti && <Confetti count={r.ultra?100:60}/>}
      <div className="result-card" style={{ position:"relative", zIndex:2, width:"100%", maxWidth:500, background:"rgba(0,0,0,0.5)", borderRadius:28, padding:"26px 22px", border:`3px solid ${r.color}60`, backdropFilter:"blur(20px)", textAlign:"center", boxShadow:`0 0 60px ${r.color}40` }}>
        <div style={{ width:110, height:110, borderRadius:"50%", margin:"0 auto 12px", background:`radial-gradient(circle,${r.color}40,transparent)`, border:`5px solid ${r.color}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", boxShadow:`0 0 30px ${r.color}60`, animation:r.rainbow?"rainbow 2s linear infinite":"none" }}>
          <span style={{ fontSize:"2.2rem", fontWeight:900, color:r.color }}>{score}</span>
          <span style={{ opacity:0.7, fontSize:"0.8rem" }}>/{total} ข้อ</span>
        </div>
        <div style={{ fontSize:"2.4rem", marginBottom:4 }}>{r.emoji}</div>
        <div style={{ fontSize:"1.6rem", fontWeight:900, color:r.color, marginBottom:6 }}>{r.title}</div>
        <div style={{ fontSize:"1.1rem", fontWeight:700, color:"white", lineHeight:1.6, whiteSpace:"pre-line", marginBottom:6 }}>{r.msg}</div>
        <div style={{ fontSize:"0.85rem", color:"rgba(255,255,255,0.55)", marginBottom:16 }}>คะแนน {pct}% • EXP +{score*10}</div>
        <div style={{ display:"flex", gap:10, marginBottom:14 }}>
          {[{label:"✅ ถูก",val:score,color:"#22c55e"},{label:"❌ ผิด",val:total-score,color:"#ef4444"},{label:"📊 คะแนน",val:`${pct}%`,color:r.color}].map(it=>(
            <div key={it.label} style={{ flex:1, background:"rgba(255,255,255,0.08)", borderRadius:12, padding:"10px 6px", border:`1px solid ${it.color}40` }}>
              <div style={{ fontSize:"1.3rem", fontWeight:900, color:it.color }}>{it.val}</div>
              <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.6)", marginTop:2 }}>{it.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {wrongQ.length>0 && (
            <button className="btn" onClick={onReview} style={{ width:"100%", padding:"13px", borderRadius:14, background:"linear-gradient(135deg,#7c3aed,#a855f7)", color:"white", fontSize:"1rem", fontWeight:800, border:"none", boxShadow:"0 6px 20px rgba(124,58,237,0.5)" }}>
              📖 ดูข้อที่ผิด ({wrongQ.length} ข้อ)
            </button>
          )}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9 }}>
            <button className="btn" onClick={onRetry} style={{ padding:"13px", borderRadius:14, background:subject.gradient, color:"white", fontSize:"0.95rem", fontWeight:700, border:"none" }}>🔄 สอบอีกครั้ง</button>
            <button className="btn" onClick={onHome} style={{ padding:"13px", borderRadius:14, background:"rgba(255,255,255,0.1)", color:"white", fontSize:"0.95rem", fontWeight:700, border:"2px solid rgba(255,255,255,0.2)" }}>🏠 หน้าหลัก</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReviewScreen({ subject, questions, answers, onHome }) {
  const [idx, setIdx] = useState(0);
  const wrongQ = questions.map((q,i) => ({q,i,userAns:answers[i]})).filter(x => x.userAns!==x.q.answer);
  const LABELS = ["ก","ข","ค","ง"];

  if (!wrongQ.length) return (
    <div className="screen" style={{ justifyContent:"center", alignItems:"center" }}>
      <div style={{ textAlign:"center", color:"white" }}>
        <div style={{ fontSize:"4rem" }}>🎉</div>
        <div style={{ fontSize:"1.5rem", fontWeight:800, marginTop:12 }}>ไม่มีข้อที่ผิดเลย!</div>
        <button className="btn" onClick={onHome} style={{ marginTop:20, padding:"15px 30px", borderRadius:14, background:"linear-gradient(135deg,#ffd700,#ff6b35)", color:"white", fontSize:"1.05rem", fontWeight:700, border:"none" }}>🏠 กลับหน้าหลัก</button>
      </div>
    </div>
  );

  const {q, userAns} = wrongQ[idx];

  return (
    <div className="screen" style={{ padding:"14px 16px", gap:11, position:"relative" }}>
      <Particles/>
      <div style={{ display:"flex", alignItems:"center", gap:10, position:"relative", zIndex:2 }}>
        <button className="btn" onClick={onHome} style={{ padding:"9px 13px", borderRadius:11, background:"rgba(255,255,255,0.1)", color:"white", fontWeight:700, border:"1px solid rgba(255,255,255,0.2)", fontSize:"0.9rem" }}>← กลับ</button>
        <div style={{ flex:1, textAlign:"center", fontSize:"1rem", fontWeight:800, color:"#ffd700" }}>📖 ข้อที่ผิด ({idx+1}/{wrongQ.length})</div>
      </div>

      <div className="card" style={{ padding:"14px 16px", position:"relative", zIndex:2 }}>
        <div style={{ fontSize:"0.75rem", fontWeight:600, color:subject.color, marginBottom:3 }}>📌 {q.topic}</div>
        <div style={{ fontSize:"1.15rem", fontWeight:700, color:"white", lineHeight:1.4 }}>{q.question}</div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:7, position:"relative", zIndex:2 }}>
        {q.choices.map((c,ci)=>{
          const isCorrect=ci===q.answer, isUser=ci===userAns;
          return (
            <div key={ci} className={`choice-btn${isCorrect?" review-correct":isUser?" review-wrong":""}`}
              style={{ cursor:"default", borderWidth:(isCorrect||isUser)?3:2 }}>
              <span style={{ width:30, height:30, borderRadius:"50%", background:isCorrect?"#22c55e":isUser?"#ef4444":"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"0.9rem", flexShrink:0 }}>
                {isCorrect?"✓":isUser?"✗":LABELS[ci]}
              </span>
              <span style={{ flex:1, fontSize:"0.98rem" }}>{c}</span>
              {isCorrect && <span style={{ color:"#22c55e", fontWeight:800, fontSize:"0.8rem", flexShrink:0 }}>เฉลย</span>}
              {isUser&&!isCorrect && <span style={{ color:"#ef4444", fontWeight:800, fontSize:"0.8rem", flexShrink:0 }}>คำตอบเรา</span>}
            </div>
          );
        })}
      </div>

      <div style={{ background:"rgba(34,197,94,0.1)", border:"2px solid rgba(34,197,94,0.4)", borderRadius:14, padding:"13px", position:"relative", zIndex:2, overflowY:"auto", maxHeight:"22vh" }}>
        <div style={{ fontSize:"0.8rem", fontWeight:800, color:"#22c55e", marginBottom:3 }}>💡 เฉลยอธิบาย</div>
        <div style={{ fontSize:"0.9rem", color:"rgba(255,255,255,0.9)", lineHeight:1.5 }}>{q.explanation}</div>
        {q.wrongExplanations?.[userAns] && (
          <div style={{ marginTop:8, paddingTop:8, borderTop:"1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ fontSize:"0.78rem", fontWeight:700, color:"#ef4444", marginBottom:3 }}>❌ ทำไมถึงผิด?</div>
            <div style={{ fontSize:"0.82rem", color:"rgba(255,255,255,0.7)" }}>{q.wrongExplanations[userAns]}</div>
          </div>
        )}
      </div>

      <div style={{ display:"flex", gap:9, position:"relative", zIndex:2, flexShrink:0 }}>
        <button className="btn" onClick={()=>setIdx(i=>Math.max(0,i-1))} disabled={idx===0} style={{ flex:1, padding:"13px", borderRadius:13, background:"rgba(255,255,255,0.1)", color:"white", fontWeight:700, border:"1px solid rgba(255,255,255,0.2)", fontSize:"0.9rem", opacity:idx===0?0.4:1 }}>← ก่อนหน้า</button>
        {idx<wrongQ.length-1
          ? <button className="btn" onClick={()=>setIdx(i=>i+1)} style={{ flex:2, padding:"13px", borderRadius:13, background:subject.gradient, color:"white", fontWeight:800, border:"none", fontSize:"0.9rem" }}>ถัดไป →</button>
          : <button className="btn" onClick={onHome} style={{ flex:2, padding:"13px", borderRadius:13, background:"linear-gradient(135deg,#ffd700,#ff6b35)", color:"white", fontWeight:800, border:"none", fontSize:"0.9rem" }}>🏠 กลับหน้าหลัก</button>
        }
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [screen, setScreen] = useState("home");
  const [subject, setSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [stats, setStats] = useState(loadStats());

  function startQuiz(size) {
    const pool = QUESTION_BANK[subject.id];
    const q = shuffle(pool).slice(0, Math.min(size, pool.length));
    setQuestions(q); setAnswers({}); setScreen("quiz");
  }

  function finishQuiz(ans, qs) {
    setAnswers(ans);
    const score = qs.filter((q,i) => ans[i]===q.answer).length;
    const ns = {...stats, totalCorrect:stats.totalCorrect+score, totalAnswered:stats.totalAnswered+qs.length, exp:stats.exp+score*10};
    ns.level = Math.floor(ns.exp/100)+1;
    setStats(ns); saveStats(ns);
    const h = loadHistory();
    h.push({ date:new Date().toISOString(), subject:subject.id, score, total:qs.length, pct:Math.round((score/qs.length)*100) });
    saveHistory(h);
    setScreen("results");
  }

  return (
    <>
      <style>{GLOBAL_STYLE}</style>
      <div className="app-root">
        <div className="stars"/>
        {screen==="home"    && <HomeScreen onSelectSubject={s=>{setSubject(s);setScreen("config")}} stats={stats}/>}
        {screen==="config"  && subject && <ConfigScreen subject={subject} onStart={startQuiz} onBack={()=>setScreen("home")}/>}
        {screen==="quiz"    && subject && <QuizScreen key={questions.map(q=>q.id).join("-")} subject={subject} questions={questions} onFinish={finishQuiz}/>}
        {screen==="results" && subject && <ResultsScreen subject={subject} questions={questions} answers={answers} stats={stats} onReview={()=>setScreen("review")} onHome={()=>setScreen("home")} onRetry={()=>startQuiz(questions.length)}/>}
        {screen==="review"  && subject && <ReviewScreen subject={subject} questions={questions} answers={answers} onHome={()=>setScreen("home")}/>}
      </div>
    </>
  );
}
