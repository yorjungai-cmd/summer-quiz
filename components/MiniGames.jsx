"use client";
import { useState, useEffect, useCallback } from "react";
import { MEMORY_CARDS, FILL_SENTENCES, WORD_ORDER_SENTENCES } from "../questions/MiniGameData";

// ==================== STYLES ====================
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;600;700;800;900&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Kanit', sans-serif; }

  .mg-root {
    width: 100vw; height: 100vh; overflow: hidden; position: relative;
    background: linear-gradient(135deg, #0f0524 0%, #1a0533 50%, #0d1b4b 100%);
    font-family: 'Kanit', sans-serif;
  }
  .mg-stars {
    position: absolute; inset: 0; pointer-events: none;
    background-image:
      radial-gradient(1px 1px at 8% 12%, #fff 0%, transparent 100%),
      radial-gradient(1px 1px at 22% 65%, rgba(255,255,255,0.7) 0%, transparent 100%),
      radial-gradient(1px 1px at 45% 28%, #fff 0%, transparent 100%),
      radial-gradient(1px 1px at 65% 78%, rgba(255,255,255,0.6) 0%, transparent 100%),
      radial-gradient(1px 1px at 80% 18%, #fff 0%, transparent 100%),
      radial-gradient(2px 2px at 33% 8%, rgba(255,220,100,0.8) 0%, transparent 100%),
      radial-gradient(2px 2px at 72% 42%, rgba(150,200,255,0.8) 0%, transparent 100%);
  }
  .mg-screen { position: relative; z-index: 1; width: 100%; height: 100vh; display: flex; flex-direction: column; }
  .mg-card { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 18px; backdrop-filter: blur(10px); }
  .mg-btn { font-family: 'Kanit', sans-serif; font-weight: 700; border: none; cursor: pointer; transition: all 0.15s ease; }
  .mg-btn:active { transform: scale(0.94); }

  /* ── Memory Match ── */
  .mem-grid { display: grid; gap: 10px; }
  .mem-card {
    aspect-ratio: 1; border-radius: 16px; border: 2px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.08); cursor: pointer; transition: all 0.35s ease;
    display: flex; align-items: center; justify-content: center;
    backdrop-filter: blur(5px); position: relative; overflow: hidden;
    transform-style: preserve-3d; padding: 6px;
  }
  .mem-card.flipped { background: rgba(124,58,237,0.3); border-color: #a855f7; }
  .mem-card.matched { background: rgba(34,197,94,0.25); border-color: #22c55e; cursor: default; animation: matched-pop 0.4s ease; }
  .mem-card:hover:not(.matched) { border-color: rgba(255,255,255,0.4); transform: scale(1.04); }
  .mem-back { font-size: clamp(2rem,5vw,2.8rem); }
  .mem-front { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; width:100%; height:100%; padding: 6px; }
  .mem-front .big-emoji { font-size: clamp(2.4rem,6vw,3.6rem); line-height: 1; }
  .mem-front .word-label { font-size: clamp(1rem,2.8vw,1.35rem); font-weight: 900; color: white; text-align: center; line-height: 1.2; }
  .mem-front .word-hint { font-size: clamp(0.75rem,2vw,0.95rem); font-weight: 600; color: rgba(255,255,255,0.65); text-align: center; line-height: 1.2; }

  /* ── Fill Blank ── */
  .fill-choice {
    padding: 12px 14px; border-radius: 13px; border: 2px solid rgba(255,255,255,0.2);
    background: rgba(255,255,255,0.08); color: white; font-family: 'Kanit', sans-serif;
    font-size: 1.05rem; font-weight: 600; cursor: pointer; transition: all 0.15s ease; text-align: left;
    display: flex; align-items: center; gap: 10px;
  }
  .fill-choice:hover:not(:disabled) { background: rgba(255,255,255,0.18); transform: translateX(4px); }
  .fill-choice.correct { background: rgba(34,197,94,0.3) !important; border-color: #22c55e !important; }
  .fill-choice.wrong   { background: rgba(239,68,68,0.3) !important;  border-color: #ef4444 !important; }

  /* ── Word Order ── */
  .word-chip {
    padding: 10px 16px; border-radius: 20px; border: 2px solid rgba(255,255,255,0.25);
    background: rgba(255,255,255,0.1); color: white; font-family: 'Kanit', sans-serif;
    font-size: 1.05rem; font-weight: 700; cursor: pointer; transition: all 0.15s ease;
    user-select: none; display: inline-flex; align-items: center;
  }
  .word-chip:hover { background: rgba(255,255,255,0.2); transform: scale(1.05); }
  .word-chip.placed { background: rgba(124,58,237,0.4); border-color: #a855f7; }
  .word-chip.correct-place { background: rgba(34,197,94,0.3); border-color: #22c55e; }
  .word-slot {
    min-width: 70px; min-height: 42px; border-radius: 12px; border: 2px dashed rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.05); display: inline-flex; align-items: center; justify-content: center;
    padding: 6px 10px; transition: all 0.2s;
  }
  .word-slot.filled { border-style: solid; border-color: #a855f7; background: rgba(124,58,237,0.2); }

  /* ── Animations ── */
  @keyframes matched-pop { 0%{transform:scale(1)} 40%{transform:scale(1.15)} 100%{transform:scale(1)} }
  @keyframes slide-in { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes correct-flash { 0%,100%{background:rgba(34,197,94,0.2)} 50%{background:rgba(34,197,94,0.5)} }
  @keyframes wrong-shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes confetti-fall { 0%{transform:translateY(-50px) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(540deg);opacity:0} }
  @keyframes bounce-in { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
  .slide-in { animation: slide-in 0.4s ease; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
`;

// ==================== CONFETTI ====================
function Confetti() {
  const colors = ["#ff6b35","#ffd700","#00e5ff","#ff6bff","#22c55e","#a855f7"];
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:999 }}>
      {Array.from({length:50},(_,i) => (
        <div key={i} style={{
          position:"absolute", left:`${Math.random()*100}%`, top:"-30px",
          width:8+Math.random()*8, height:8+Math.random()*8,
          background:colors[i%colors.length], borderRadius:i%3===0?"50%":"2px",
          animation:`confetti-fall ${1.5+Math.random()*2}s ${Math.random()*1.5}s linear forwards`,
        }}/>
      ))}
    </div>
  );
}

// ==================== HOME SCREEN ====================
function MiniGameHome({ onSelect, onBack, scores }) {
  const games = [
    { id:"memory",  emoji:"🎴", name:"จับคู่ภาพ-คำ",       desc:"พลิกการ์ดจับคู่ให้ครบ",       color:"#ff6b35", gradient:"linear-gradient(135deg,#ff6b35,#ff9a5c)", best: scores.memory },
    { id:"fill",    emoji:"✏️", name:"เติมคำในประโยค",      desc:"เลือกคำที่หายไปให้ถูกต้อง",   color:"#a855f7", gradient:"linear-gradient(135deg,#7c3aed,#a855f7)", best: scores.fill },
    { id:"word",    emoji:"🔤", name:"เรียงคำเป็นประโยค",   desc:"จัดเรียงคำให้เป็นประโยคที่ถูก", color:"#00e5ff", gradient:"linear-gradient(135deg,#0ea5e9,#00e5ff)", best: scores.word },
  ];
  return (
    <div className="mg-screen" style={{ padding:"18px 22px", gap:16, justifyContent:"space-between" }}>
      <div style={{ position:"relative", zIndex:2 }}>
        <button className="mg-btn" onClick={onBack} style={{ padding:"8px 16px", borderRadius:20, background:"rgba(255,255,255,0.1)", color:"white", fontSize:"0.9rem", border:"1px solid rgba(255,255,255,0.2)", marginBottom:14 }}>
          ← กลับหน้าหลัก
        </button>
        <div style={{ textAlign:"center" }}>
          <div style={{ fontSize:"1.8rem", fontWeight:900, background:"linear-gradient(90deg,#ffd700,#ff6bff)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            🎮 เกมส์เสริมความจำ
          </div>
          <div style={{ color:"rgba(255,255,255,0.6)", fontSize:"0.9rem", marginTop:4 }}>เลือกเกมส์ที่อยากเล่น!</div>
        </div>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:14, position:"relative", zIndex:2, flex:1, justifyContent:"center" }}>
        {games.map(g => (
          <button key={g.id} className="mg-btn" onClick={() => onSelect(g.id)} style={{
            padding:"20px 22px", borderRadius:22, background:g.gradient, color:"white",
            display:"flex", alignItems:"center", gap:16, textAlign:"left",
            boxShadow:`0 6px 24px ${g.color}50`, border:`2px solid ${g.color}80`,
            width:"100%",
          }}>
            <span style={{ fontSize:"2.6rem", flexShrink:0 }}>{g.emoji}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"1.2rem", fontWeight:800 }}>{g.name}</div>
              <div style={{ fontSize:"0.85rem", opacity:0.85, marginTop:2 }}>{g.desc}</div>
            </div>
            {g.best > 0 && (
              <div style={{ textAlign:"center", flexShrink:0 }}>
                <div style={{ fontSize:"1.2rem", fontWeight:900 }}>⭐</div>
                <div style={{ fontSize:"0.8rem", fontWeight:700 }}>ดีที่สุด</div>
                <div style={{ fontSize:"1rem", fontWeight:900 }}>{g.best}%</div>
              </div>
            )}
          </button>
        ))}
      </div>

      <div style={{ textAlign:"center", color:"rgba(255,255,255,0.3)", fontSize:"0.75rem", position:"relative", zIndex:2 }}>
        เก็บ EXP ทุกเกมส์ • วิชาภาษาไทย ป.1
      </div>
    </div>
  );
}

// ==================== GAME 1: MEMORY MATCH ====================
function MemoryGame({ onFinish }) {
  const PAIRS = 8;
  const pool = [...MEMORY_CARDS].sort(() => Math.random()-0.5).slice(0, PAIRS);

  const buildDeck = useCallback(() => {
    const cards = [];
    pool.forEach((c,i) => {
      cards.push({ uid: `e${i}`, pairId: c.id, type:"emoji", content: c.emoji, word: c.word, emoji: c.emoji });
      cards.push({ uid: `w${i}`, pairId: c.id, type:"word",  content: c.word,  word: c.word, emoji: c.emoji });
    });
    return cards.sort(() => Math.random()-0.5);
  }, []);

  const [deck, setDeck] = useState(buildDeck);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState(new Set());
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const [done, setDone] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now()-startTime)/1000)), 1000);
    return () => clearInterval(t);
  }, [done, startTime]);

  function flip(uid) {
    if (locked || flipped.includes(uid) || matched.has(uid)) return;
    const next = [...flipped, uid];
    setFlipped(next);
    if (next.length === 2) {
      setMoves(m => m+1);
      setLocked(true);
      const [a, b] = next.map(id => deck.find(c => c.uid === id));
      if (a.pairId === b.pairId) {
        const newMatched = new Set([...matched, a.uid, b.uid]);
        setMatched(newMatched);
        setFlipped([]);
        setLocked(false);
        if (newMatched.size === deck.length) setTimeout(() => setDone(true), 400);
      } else {
        setTimeout(() => { setFlipped([]); setLocked(false); }, 900);
      }
    }
  }

  const pct = Math.max(0, Math.min(100, Math.round(100 - (moves - PAIRS) * 5)));
  const cols = 4;

  if (done) return (
    <ResultScreen
      emoji="🎴" gameTitle="จับคู่ภาพ-คำ"
      score={pct} moves={moves} time={elapsed}
      onRetry={() => { setDeck(buildDeck()); setFlipped([]); setMatched(new Set()); setMoves(0); setLocked(false); setDone(false); setElapsed(0); }}
      onBack={onFinish}
    />
  );

  return (
    <div className="mg-screen" style={{ padding:"14px 16px", gap:12 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, position:"relative", zIndex:2 }}>
        <button className="mg-btn" onClick={onFinish} style={{ padding:"8px 12px", borderRadius:12, background:"rgba(255,255,255,0.1)", color:"white", fontSize:"0.85rem", border:"1px solid rgba(255,255,255,0.2)", flexShrink:0 }}>←</button>
        <div style={{ flex:1, textAlign:"center", fontWeight:800, fontSize:"1.05rem", color:"#ffd700" }}>🎴 จับคู่ภาพ-คำ</div>
        <div style={{ display:"flex", gap:10, flexShrink:0 }}>
          <div className="mg-card" style={{ padding:"6px 12px", textAlign:"center" }}>
            <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.6)" }}>การเดิน</div>
            <div style={{ fontSize:"1rem", fontWeight:800, color:"#ffd700" }}>{moves}</div>
          </div>
          <div className="mg-card" style={{ padding:"6px 12px", textAlign:"center" }}>
            <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.6)" }}>เวลา</div>
            <div style={{ fontSize:"1rem", fontWeight:800, color:"#00e5ff" }}>{elapsed}s</div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ position:"relative", zIndex:2 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.8rem", color:"rgba(255,255,255,0.6)", marginBottom:4 }}>
          <span>จับคู่แล้ว {matched.size/2}/{PAIRS} คู่</span>
          <span>เหลือ {PAIRS - matched.size/2} คู่</span>
        </div>
        <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:8, height:10, overflow:"hidden", border:"1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ height:"100%", width:`${(matched.size/deck.length)*100}%`, background:"linear-gradient(90deg,#22c55e,#4ade80)", borderRadius:8, transition:"width 0.5s ease" }}/>
        </div>
      </div>

      {/* Grid */}
      <div className="mem-grid" style={{ gridTemplateColumns:`repeat(${cols},1fr)`, flex:1, position:"relative", zIndex:2 }}>
        {deck.map(card => {
          const isFlipped = flipped.includes(card.uid);
          const isMatched = matched.has(card.uid);
          return (
            <div
              key={card.uid}
              className={`mem-card ${isFlipped||isMatched?"flipped":""} ${isMatched?"matched":""}`}
              onClick={() => flip(card.uid)}
              style={{ minHeight:'clamp(80px,14vw,130px)' }}
            >
              {isFlipped || isMatched ? (
                <div className="mem-front">
                  {card.type === "emoji" ? (
                    <>
                      <span className="big-emoji">{card.content}</span>
                    </>
                  ) : (
                    <>
                      <span className="big-emoji">{card.emoji}</span>
                      <span className="word-label">{card.content}</span>
                    </>
                  )}
                </div>
              ) : (
                <div className="mem-back">❓</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== GAME 2: FILL THE BLANK ====================
function FillGame({ onFinish }) {
  const questions = [...FILL_SENTENCES].sort(() => Math.random()-0.5);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [shakeWrong, setShakeWrong] = useState(false);

  const q = questions[idx];
  const parts = q.template.split("___");
  const isLast = idx === questions.length - 1;

  function confirm(choice) {
    if (confirmed) return;
    setSelected(choice);
    setConfirmed(true);
    if (choice === q.answer) {
      setScore(s => s+1);
    } else {
      setShakeWrong(true);
      setTimeout(() => setShakeWrong(false), 500);
    }
  }

  function next() {
    if (isLast) { setDone(true); return; }
    setIdx(i => i+1); setSelected(null); setConfirmed(false);
  }

  const pct = Math.round((score / questions.length) * 100);
  const shuffledChoices = q.choices; // already set

  if (done) return (
    <ResultScreen
      emoji="✏️" gameTitle="เติมคำในประโยค"
      score={pct} moves={questions.length} detail={`ถูก ${score}/${questions.length} ข้อ`}
      onRetry={() => { setIdx(0); setSelected(null); setConfirmed(false); setScore(0); setDone(false); }}
      onBack={onFinish}
    />
  );

  return (
    <div className="mg-screen" style={{ padding:"14px 16px", gap:12 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, position:"relative", zIndex:2 }}>
        <button className="mg-btn" onClick={onFinish} style={{ padding:"8px 12px", borderRadius:12, background:"rgba(255,255,255,0.1)", color:"white", fontSize:"0.85rem", border:"1px solid rgba(255,255,255,0.2)", flexShrink:0 }}>←</button>
        <div style={{ flex:1 }}>
          <div style={{ textAlign:"center", fontWeight:800, fontSize:"1.05rem", color:"#a855f7" }}>✏️ เติมคำในประโยค</div>
          <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:6, height:8, overflow:"hidden", marginTop:4, border:"1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ height:"100%", width:`${((idx)/questions.length)*100}%`, background:"linear-gradient(90deg,#7c3aed,#a855f7)", borderRadius:6, transition:"width 0.4s ease" }}/>
          </div>
        </div>
        <div className="mg-card" style={{ padding:"6px 12px", textAlign:"center", flexShrink:0 }}>
          <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.6)" }}>คะแนน</div>
          <div style={{ fontSize:"1rem", fontWeight:800, color:"#22c55e" }}>{score}/{questions.length}</div>
        </div>
      </div>

      {/* Progress text */}
      <div style={{ textAlign:"center", fontSize:"0.85rem", color:"rgba(255,255,255,0.5)", position:"relative", zIndex:2 }}>
        ข้อ {idx+1} / {questions.length}
      </div>

      {/* Sentence */}
      <div className={`mg-card slide-in ${shakeWrong?"":""}` } style={{
        padding:"20px", position:"relative", zIndex:2,
        animation: shakeWrong ? "wrong-shake 0.4s ease" : "slide-in 0.4s ease",
        textAlign:"center",
      }}>
        <div style={{ fontSize:"1rem", color:"rgba(255,255,255,0.55)", marginBottom:10, fontWeight:600 }}>💡 {q.hint}</div>
        <div style={{ fontSize:"1.25rem", fontWeight:700, color:"white", lineHeight:1.8, display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"center", gap:6 }}>
          <span>{parts[0]}</span>
          <span style={{
            display:"inline-flex", alignItems:"center", justifyContent:"center",
            minWidth:110, padding:"4px 14px", borderRadius:10, fontWeight:900, fontSize:"1.1rem",
            background: !confirmed ? "rgba(255,255,255,0.1)" : selected===q.answer ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)",
            border: !confirmed ? "2px dashed rgba(255,255,255,0.3)" : selected===q.answer ? "2px solid #22c55e" : "2px solid #ef4444",
            color: !confirmed ? "rgba(255,255,255,0.4)" : "white",
            transition:"all 0.3s ease",
          }}>
            {confirmed ? selected : "___"}
          </span>
          <span>{parts[1]}</span>
        </div>
      </div>

      {/* Choices */}
      <div style={{ display:"flex", flexDirection:"column", gap:9, position:"relative", zIndex:2, flex:1, justifyContent:"center" }}>
        {shuffledChoices.map((c, i) => {
          const isCorrect = c === q.answer;
          const isSelected = c === selected;
          return (
            <button
              key={i}
              className={`fill-choice ${confirmed&&isCorrect?"correct":""} ${confirmed&&isSelected&&!isCorrect?"wrong":""}`}
              onClick={() => confirm(c)}
              disabled={confirmed}
            >
              <span style={{ width:28, height:28, borderRadius:"50%", background:"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:"0.85rem", flexShrink:0 }}>
                {confirmed ? (isCorrect?"✓":isSelected?"✗":String.fromCharCode(65+i)) : String.fromCharCode(65+i)}
              </span>
              {c}
            </button>
          );
        })}
      </div>

      {/* Next */}
      {confirmed && (
        <button className="mg-btn" onClick={next} style={{
          width:"100%", padding:"15px", borderRadius:14, color:"white", fontSize:"1.1rem", fontWeight:800, border:"none",
          background: isLast ? "linear-gradient(135deg,#ffd700,#ff6b35)" : selected===q.answer ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg,#7c3aed,#a855f7)",
          boxShadow:"0 6px 20px rgba(0,0,0,0.3)", position:"relative", zIndex:2,
        }}>
          {isLast ? "🏁 ดูผลคะแนน!" : selected===q.answer ? "🎉 ถูกต้อง! ถัดไป →" : "ข้อถัดไป →"}
        </button>
      )}
    </div>
  );
}

// ==================== GAME 3: WORD ORDER ====================
function WordOrderGame({ onFinish }) {
  const questions = [...WORD_ORDER_SENTENCES].sort(() => Math.random()-0.5);
  const [idx, setIdx] = useState(0);
  const [placed, setPlaced] = useState([]);
  const [score, setScore] = useState(0);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [done, setDone] = useState(false);
  const [shuffledWords, setShuffledWords] = useState([]);

  const q = questions[idx];
  const isLast = idx === questions.length - 1;

  useEffect(() => {
    setShuffledWords([...q.words].sort(() => Math.random()-0.5));
    setPlaced([]);
    setChecked(false);
    setIsCorrect(false);
  }, [idx]);

  function tapWord(word, from) {
    if (checked) return;
    if (from === "bank") {
      if (placed.length < q.answer.length) setPlaced(p => [...p, word]);
    } else {
      setPlaced(p => p.filter((_,i) => i !== from));
    }
  }

  function checkAnswer() {
    const correct = placed.join("") === q.answer.join("") || placed.every((w,i) => w === q.answer[i]);
    setIsCorrect(correct);
    setChecked(true);
    if (correct) setScore(s => s+1);
  }

  function next() {
    if (isLast) { setDone(true); return; }
    setIdx(i => i+1);
  }

  const remaining = shuffledWords.filter(w => !placed.includes(w) || placed.filter(p=>p===w).length < shuffledWords.filter(s=>s===w).length);
  const pct = Math.round((score/questions.length)*100);

  if (done) return (
    <ResultScreen
      emoji="🔤" gameTitle="เรียงคำเป็นประโยค"
      score={pct} detail={`ถูก ${score}/${questions.length} ข้อ`}
      onRetry={() => { setIdx(0); setScore(0); setDone(false); }}
      onBack={onFinish}
    />
  );

  return (
    <div className="mg-screen" style={{ padding:"14px 16px", gap:12 }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:10, position:"relative", zIndex:2 }}>
        <button className="mg-btn" onClick={onFinish} style={{ padding:"8px 12px", borderRadius:12, background:"rgba(255,255,255,0.1)", color:"white", fontSize:"0.85rem", border:"1px solid rgba(255,255,255,0.2)", flexShrink:0 }}>←</button>
        <div style={{ flex:1 }}>
          <div style={{ textAlign:"center", fontWeight:800, fontSize:"1.05rem", color:"#00e5ff" }}>🔤 เรียงคำเป็นประโยค</div>
          <div style={{ background:"rgba(0,0,0,0.3)", borderRadius:6, height:8, overflow:"hidden", marginTop:4 }}>
            <div style={{ height:"100%", width:`${(idx/questions.length)*100}%`, background:"linear-gradient(90deg,#0ea5e9,#00e5ff)", borderRadius:6, transition:"width 0.4s ease" }}/>
          </div>
        </div>
        <div className="mg-card" style={{ padding:"6px 12px", textAlign:"center", flexShrink:0 }}>
          <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.6)" }}>คะแนน</div>
          <div style={{ fontSize:"1rem", fontWeight:800, color:"#00e5ff" }}>{score}/{questions.length}</div>
        </div>
      </div>

      <div style={{ textAlign:"center", fontSize:"0.85rem", color:"rgba(255,255,255,0.5)", position:"relative", zIndex:2 }}>ข้อ {idx+1} / {questions.length}</div>

      {/* Instruction */}
      <div className="mg-card" style={{ padding:"14px 16px", position:"relative", zIndex:2, textAlign:"center" }}>
        <div style={{ fontSize:"0.85rem", color:"rgba(255,255,255,0.55)", marginBottom:6 }}>🧩 จัดเรียงคำให้เป็นประโยคที่ถูกต้อง</div>
        <div style={{ fontSize:"0.95rem", color:"rgba(255,255,255,0.8)", fontWeight:600 }}>
          ประโยคนี้มี <span style={{ color:"#00e5ff", fontWeight:900 }}>{q.words.length}</span> คำ
        </div>
      </div>

      {/* Drop Zone */}
      <div className="mg-card" style={{ padding:"16px", minHeight:80, position:"relative", zIndex:2, display:"flex", flexWrap:"wrap", gap:8, alignItems:"center", justifyContent:"center",
        border: checked ? (isCorrect ? "2px solid #22c55e" : "2px solid #ef4444") : "2px dashed rgba(0,229,255,0.3)",
        background: checked ? (isCorrect ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)") : "rgba(255,255,255,0.05)",
        transition:"all 0.3s",
      }}>
        {placed.length === 0 && !checked && (
          <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.9rem" }}>กดคำด้านล่างเพื่อวางที่นี่</div>
        )}
        {placed.map((w,i) => (
          <span
            key={i}
            className={`word-chip placed ${checked&&isCorrect?"correct-place":""}`}
            onClick={() => !checked && tapWord(w, i)}
            style={{ cursor: checked ? "default" : "pointer" }}
          >
            {w}
          </span>
        ))}
      </div>

      {/* Result Message */}
      {checked && (
        <div style={{ textAlign:"center", position:"relative", zIndex:2, animation:"bounce-in 0.4s ease" }}>
          {isCorrect ? (
            <div style={{ color:"#22c55e", fontWeight:800, fontSize:"1.1rem" }}>🎉 ถูกต้องเลย!</div>
          ) : (
            <div>
              <div style={{ color:"#ef4444", fontWeight:800, fontSize:"1rem" }}>❌ ยังไม่ถูกนะ</div>
              <div style={{ color:"rgba(255,255,255,0.7)", fontSize:"0.85rem", marginTop:4 }}>✅ ที่ถูกคือ: <span style={{ color:"#ffd700", fontWeight:700 }}>{q.answer.join(" ")}</span></div>
            </div>
          )}
        </div>
      )}

      {/* Word Bank */}
      <div style={{ position:"relative", zIndex:2 }}>
        <div style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.5)", marginBottom:8, textAlign:"center" }}>คำที่ใช้ได้</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
          {shuffledWords.map((w,i) => {
            const usedCount = placed.filter(p=>p===w).length;
            const totalCount = shuffledWords.filter(s=>s===w).length;
            const isUsed = usedCount >= totalCount;
            return (
              <span
                key={i}
                className="word-chip"
                onClick={() => !isUsed && tapWord(w,"bank")}
                style={{ opacity:isUsed?0.3:1, cursor:isUsed||checked?"default":"pointer", textDecoration:isUsed?"line-through":"none" }}
              >
                {w}
              </span>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display:"flex", gap:10, position:"relative", zIndex:2 }}>
        {!checked ? (
          <>
            <button className="mg-btn" onClick={() => setPlaced([])} style={{ flex:1, padding:"13px", borderRadius:13, background:"rgba(255,255,255,0.1)", color:"white", fontSize:"0.95rem", border:"1px solid rgba(255,255,255,0.2)" }}>🔄 ล้างใหม่</button>
            <button className="mg-btn" onClick={checkAnswer} disabled={placed.length !== q.words.length} style={{
              flex:2, padding:"13px", borderRadius:13, color:"white", fontSize:"1rem", fontWeight:800, border:"none",
              background: placed.length===q.words.length ? "linear-gradient(135deg,#0ea5e9,#00e5ff)" : "rgba(255,255,255,0.1)",
              opacity: placed.length===q.words.length ? 1 : 0.5, boxShadow: placed.length===q.words.length ? "0 6px 20px rgba(0,229,255,0.4)" : "none",
            }}>✅ ตรวจคำตอบ</button>
          </>
        ) : (
          <button className="mg-btn" onClick={next} style={{
            flex:1, padding:"14px", borderRadius:13, color:"white", fontSize:"1.05rem", fontWeight:800, border:"none",
            background: isLast ? "linear-gradient(135deg,#ffd700,#ff6b35)" : isCorrect ? "linear-gradient(135deg,#22c55e,#16a34a)" : "linear-gradient(135deg,#7c3aed,#a855f7)",
            boxShadow:"0 6px 20px rgba(0,0,0,0.3)",
          }}>
            {isLast ? "🏁 ดูผลคะแนน!" : "ข้อถัดไป →"}
          </button>
        )}
      </div>
    </div>
  );
}

// ==================== RESULT SCREEN ====================
function ResultScreen({ emoji, gameTitle, score, moves, time, detail, onRetry, onBack }) {
  const stars = score >= 90 ? 3 : score >= 70 ? 2 : score >= 50 ? 1 : 0;
  const msgs = ["ลองอีกครั้งนะ! 💪", "เก่งมากเลย! 😊", "ยอดเยี่ยม! ⭐", "เพอร์เฟกต์!! 👑"];
  return (
    <div className="mg-screen" style={{ justifyContent:"center", alignItems:"center", padding:"20px", gap:16 }}>
      {score >= 70 && <Confetti/>}
      <div style={{ textAlign:"center", position:"relative", zIndex:2 }}>
        <div style={{ fontSize:"4rem", animation:"float 2s ease-in-out infinite" }}>{emoji}</div>
        <div style={{ fontSize:"1.6rem", fontWeight:900, color:"#ffd700", marginTop:8 }}>{gameTitle}</div>
      </div>

      <div className="mg-card" style={{ padding:"24px", width:"100%", maxWidth:400, position:"relative", zIndex:2, textAlign:"center" }}>
        <div style={{ fontSize:"3.5rem", marginBottom:8 }}>{["😢","😊","⭐","👑"][stars]}</div>
        <div style={{ fontSize:"0.95rem", color:"rgba(255,255,255,0.6)", marginBottom:4 }}>{msgs[stars]}</div>

        <div style={{ fontSize:"3rem", fontWeight:900, color: score>=90?"#ffd700":score>=70?"#22c55e":score>=50?"#f97316":"#ef4444", marginBottom:4 }}>{score}%</div>
        <div style={{ fontSize:"1.2rem", marginBottom:12 }}>{"⭐".repeat(stars)}{"☆".repeat(3-stars)}</div>

        {detail && <div style={{ color:"rgba(255,255,255,0.7)", fontSize:"1rem", fontWeight:600, marginBottom:8 }}>{detail}</div>}
        {time !== undefined && <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.85rem", marginBottom:4 }}>⏱ {time} วินาที</div>}
        {moves !== undefined && !detail && <div style={{ color:"rgba(255,255,255,0.5)", fontSize:"0.85rem" }}>🎯 {moves} การเดิน</div>}

        <div style={{ display:"flex", gap:10, marginTop:18 }}>
          <button className="mg-btn" onClick={onRetry} style={{ flex:1, padding:"14px", borderRadius:13, background:"linear-gradient(135deg,#ff6b35,#ff9a5c)", color:"white", fontSize:"1rem", fontWeight:800, border:"none", boxShadow:"0 6px 20px rgba(255,107,53,0.4)" }}>🔄 เล่นอีกครั้ง</button>
          <button className="mg-btn" onClick={onBack}  style={{ flex:1, padding:"14px", borderRadius:13, background:"rgba(255,255,255,0.1)", color:"white", fontSize:"1rem", fontWeight:700, border:"2px solid rgba(255,255,255,0.2)" }}>← กลับ</button>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN ====================
export default function MiniGames({ onBack }) {
  const [game, setGame] = useState(null);
  const [scores, setScores] = useState(() => {
    try { return JSON.parse(localStorage.getItem("miniGameScores") || '{"memory":0,"fill":0,"word":0}'); }
    catch { return { memory:0, fill:0, word:0 }; }
  });

  function saveScore(id, pct) {
    const ns = { ...scores, [id]: Math.max(scores[id]||0, pct) };
    setScores(ns);
    try { localStorage.setItem("miniGameScores", JSON.stringify(ns)); } catch {}
  }

  return (
    <>
      <style>{STYLE}</style>
      <div className="mg-root">
        <div className="mg-stars"/>
        {!game && <MiniGameHome onSelect={setGame} onBack={onBack} scores={scores}/>}
        {game==="memory" && <MemoryGame onFinish={() => setGame(null)}/>}
        {game==="fill"   && <FillGame   onFinish={() => setGame(null)}/>}
        {game==="word"   && <WordOrderGame onFinish={() => setGame(null)}/>}
      </div>
    </>
  );
}
