import React, { useState, useEffect, useRef } from "react";
import {
  Camera, Mic, Package, Users, BarChart3, Plus, Check, X, ChevronRight,
  ChevronLeft, TrendingUp, AlertCircle, Home, Receipt, Wallet, Search,
  ArrowUpRight, ArrowDownRight, Sparkles, ImagePlus, FileText, Undo2,
  Bell, Globe, Store, CheckCircle2, CircleDashed, Wifi, WifiOff
} from "lucide-react";

/* ---------------- Fonts / tokens ---------------- */
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Baloo+Da+2:wght@500;600;700;800&family=Hind+Siliguri:wght@400;500;600;700&display=swap');
    .font-display { font-family: 'Baloo Da 2', 'Hind Siliguri', sans-serif; }
    .font-body { font-family: 'Hind Siliguri', sans-serif; }
    * { font-family: 'Hind Siliguri', sans-serif; }
    .stitch { border-left: 3px dashed #B4432F; }
    .paper-lines {
      background-image: repeating-linear-gradient(to bottom, transparent, transparent 27px, rgba(43,35,24,0.06) 28px);
    }
    @keyframes rise { from { transform: translateY(16px); opacity:0 } to { transform: translateY(0); opacity:1 } }
    .rise { animation: rise 0.35s cubic-bezier(.22,.61,.36,1) both; }
    @keyframes sheetUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
    .sheet-up { animation: sheetUp 0.32s cubic-bezier(.22,.61,.36,1) both; }
    @keyframes pop { 0%{transform:scale(.9);opacity:0} 100%{transform:scale(1);opacity:1} }
    .pop { animation: pop 0.28s cubic-bezier(.34,1.56,.64,1) both; }
    @keyframes scanline { 0%{ top:6% } 50%{ top:88% } 100%{ top:6% } }
    .scanline { animation: scanline 1.8s ease-in-out infinite; }
    @keyframes pulseRing { 0%{ box-shadow:0 0 0 0 rgba(31,92,78,0.35)} 70%{ box-shadow:0 0 0 14px rgba(31,92,78,0)} 100%{box-shadow:0 0 0 0 rgba(31,92,78,0)} }
    .pulse-ring { animation: pulseRing 1.6s ease-out infinite; }
    .no-scrollbar::-webkit-scrollbar{ display:none; }
    .no-scrollbar{ -ms-overflow-style:none; scrollbar-width:none; }
    .tap { transition: transform .12s ease, opacity .12s ease; }
    .tap:active { transform: scale(0.96); opacity: 0.85; }
  `}</style>
);

const COLORS = {
  paper: "#F6F1E4",
  paperDark: "#ECE4CF",
  ink: "#241C10",
  inkSoft: "#6B5F4A",
  green: "#1F5C4E",
  greenDark: "#163F35",
  marigold: "#E8A33D",
  thread: "#B4432F",
  sage: "#8FA998",
  white: "#FFFDF8",
};

/* ---------------- Mock data ---------------- */
const INIT_PRODUCTS = [
  { id: "p1", name: "চাল (মিনিকেট)", brand: "—", unit: "কেজি", stock: 42, minStock: 15, sell: 68, buy: 60 },
  { id: "p2", name: "সয়াবিন তেল", brand: "রূপচাঁদা", unit: "লিটার", stock: 6, minStock: 10, sell: 185, buy: 170 },
  { id: "p3", name: "চিনি", brand: "—", unit: "কেজি", stock: 25, minStock: 10, sell: 125, buy: 115 },
  { id: "p4", name: "মসুর ডাল", brand: "—", unit: "কেজি", stock: 18, minStock: 8, sell: 145, buy: 130 },
  { id: "p5", name: "গুঁড়া দুধ", brand: "ডানো", unit: "প্যাকেট", stock: 3, minStock: 6, sell: 620, buy: 580 },
];

const INIT_CUSTOMERS = [
  { id: "c1", name: "রহিম মিয়া", phone: "01711-XXXXXX", due: 750, last: "আজ" },
  { id: "c2", name: "করিম উদ্দিন", phone: "01812-XXXXXX", due: 1250, last: "গতকাল" },
  { id: "c3", name: "সালমা বেগম", phone: "01911-XXXXXX", due: 300, last: "২ দিন আগে" },
  { id: "c4", name: "জামাল হোসেন", phone: "—", due: 0, last: "৫ দিন আগে" },
];

const INIT_TXNS = [
  { id: "t1", type: "sale", label: "নগদ বিক্রি", desc: "চাল ৩ কেজি, তেল ১ লিটার", amount: 389, time: "১০:১২ AM", tag: "cash" },
  { id: "t2", type: "due", label: "বাকি বিক্রি", desc: "রহিম মিয়া", amount: 300, time: "১১:৪০ AM", tag: "due" },
  { id: "t3", type: "payment", label: "বাকি জমা", desc: "করিম উদ্দিন", amount: 500, time: "১২:০৫ PM", tag: "collected" },
  { id: "t4", type: "purchase", label: "সাপ্লায়ার বিল", desc: "মেসার্স বরকত ট্রেডার্স", amount: 4200, time: "০১:২০ PM", tag: "purchase" },
];

/* ---------------- Small UI atoms ---------------- */
const Chip = ({ children, tone = "green" }) => {
  const map = {
    green: { bg: "#E4EFEA", fg: COLORS.greenDark },
    marigold: { bg: "#FBEBD2", fg: "#8A5A15" },
    thread: { bg: "#F6E1DB", fg: COLORS.thread },
    sage: { bg: "#EAF0EA", fg: "#4E6459" },
  };
  const t = map[tone];
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: t.bg, color: t.fg }}>
      {children}
    </span>
  );
};

const Screen = ({ children }) => (
  <div className="rise absolute inset-0 overflow-y-auto no-scrollbar pb-28">{children}</div>
);

const TopBar = ({ title, subtitle, right }) => (
  <div className="px-5 pt-6 pb-4 flex items-start justify-between">
    <div>
      <h1 className="font-display text-2xl font-700" style={{ color: COLORS.ink }}>{title}</h1>
      {subtitle && <p className="text-sm mt-0.5" style={{ color: COLORS.inkSoft }}>{subtitle}</p>}
    </div>
    {right}
  </div>
);

/* ---------------- Onboarding ---------------- */
function Onboarding({ onDone }) {
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState("bn");
  const [shopName, setShopName] = useState("");
  const [category, setCategory] = useState("");

  const steps = ["language", "shop", "category", "ready"];

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: COLORS.green }}>
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        {step === 0 && (
          <div className="pop w-full">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center" style={{ background: COLORS.marigold }}>
              <FileText size={30} color={COLORS.greenDark} />
            </div>
            <h1 className="font-display text-3xl font-800 text-white mb-1">হিসাবসহায়ক</h1>
            <p className="text-white/70 text-sm mb-8">HisabShahoj</p>
            <p className="text-white/85 text-sm mb-8">ভাষা বেছে নিন / Choose your language</p>
            <div className="space-y-3">
              {[{ id: "bn", label: "বাংলা", sub: "Bangla" }, { id: "en", label: "English", sub: "ইংরেজি" }].map((l) => (
                <button key={l.id} onClick={() => setLang(l.id)}
                  className="tap w-full py-3.5 rounded-2xl flex items-center justify-between px-5"
                  style={{ background: lang === l.id ? COLORS.marigold : "rgba(255,255,255,0.1)", border: lang === l.id ? "none" : "1px solid rgba(255,255,255,0.25)" }}>
                  <span className="font-semibold" style={{ color: lang === l.id ? COLORS.greenDark : "#fff" }}>{l.label}</span>
                  <span className="text-xs" style={{ color: lang === l.id ? COLORS.greenDark : "rgba(255,255,255,0.6)" }}>{l.sub}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="pop w-full">
            <Store size={40} color={COLORS.marigold} className="mx-auto mb-4" />
            <h2 className="font-display text-2xl font-700 text-white mb-2">দোকানের নাম কী?</h2>
            <p className="text-white/70 text-sm mb-6">এটা পরে পরিবর্তন করা যাবে</p>
            <input
              autoFocus
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              placeholder="যেমন: রহিম জেনারেল স্টোর"
              className="w-full py-3.5 px-4 rounded-2xl text-center outline-none"
              style={{ background: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}
            />
          </div>
        )}

        {step === 2 && (
          <div className="pop w-full">
            <h2 className="font-display text-2xl font-700 text-white mb-6">কী ধরনের দোকান?</h2>
            <div className="grid grid-cols-2 gap-3">
              {["মুদি দোকান", "কাপড়ের দোকান", "হার্ডওয়্যার", "কসমেটিক্স"].map((c) => (
                <button key={c} onClick={() => setCategory(c)}
                  className="tap py-4 rounded-2xl text-sm font-semibold"
                  style={{ background: category === c ? COLORS.marigold : "rgba(255,255,255,0.1)", color: category === c ? COLORS.greenDark : "#fff", border: category === c ? "none" : "1px solid rgba(255,255,255,0.25)" }}>
                  {c}
                </button>
              ))}
            </div>
            <button onClick={() => setStep(3)} className="text-white/60 text-xs mt-6 underline tap">এখন বাদ দিন</button>
          </div>
        )}

        {step === 3 && (
          <div className="pop w-full">
            <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ background: COLORS.marigold }}>
              <CheckCircle2 size={38} color={COLORS.greenDark} />
            </div>
            <h2 className="font-display text-2xl font-700 text-white mb-2">প্রস্তুত!</h2>
            <p className="text-white/75 text-sm">{shopName || "আপনার দোকান"} এখন হিসাবসহায়কে যুক্ত হলো</p>
          </div>
        )}
      </div>

      <div className="px-8 pb-10">
        <div className="flex gap-1.5 justify-center mb-5">
          {steps.map((_, i) => (
            <div key={i} className="h-1.5 rounded-full transition-all duration-300" style={{ width: i === step ? 22 : 8, background: i <= step ? COLORS.marigold : "rgba(255,255,255,0.25)" }} />
          ))}
        </div>
        <button
          onClick={() => (step < 3 ? setStep(step + 1) : onDone(shopName || "আমার দোকান"))}
          className="tap w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
          style={{ background: COLORS.marigold, color: COLORS.greenDark }}
        >
          {step < 3 ? "পরবর্তী" : "শুরু করি"} <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

/* ---------------- Bill Scan Flow ---------------- */
function BillScanFlow({ onClose, onConfirm }) {
  const [stage, setStage] = useState("capture"); // capture -> processing -> review -> done
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (stage === "processing") {
      const t = setTimeout(() => {
        setItems([
          { id: "i1", name: "সয়াবিন তেল (রূপচাঁদা)", qty: 12, unit: "লিটার", price: 170, confidence: 0.97 },
          { id: "i2", name: "চিনি", qty: 20, unit: "কেজি", price: 116, confidence: 0.88 },
          { id: "i3", name: "গুঁড়া দুধ (ডানো)", qty: 8, unit: "প্যাকেট", price: 578, confidence: 0.62 },
        ]);
        setStage("review");
      }, 1600);
      return () => clearTimeout(t);
    }
  }, [stage]);

  const confBadge = (c) => {
    if (c >= 0.95) return { label: "উচ্চ নির্ভরযোগ্যতা", tone: "green" };
    if (c >= 0.75) return { label: "যাচাই করুন", tone: "marigold" };
    return { label: "নিশ্চিত করা জরুরি", tone: "thread" };
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col" style={{ background: COLORS.ink }}>
      {/* header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-3">
        <button onClick={onClose} className="tap w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
          <X size={18} color="#fff" />
        </button>
        <span className="text-white/80 text-sm font-medium">সাপ্লায়ার বিল স্ক্যান</span>
        <div className="w-9" />
      </div>

      {stage === "capture" && (
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden mb-8" style={{ background: "#3a2f1e", border: "2px dashed rgba(255,255,255,0.25)" }}>
            <div className="absolute inset-6 border-2 rounded-2xl" style={{ borderColor: "rgba(255,255,255,0.3)" }} />
            <FileText size={54} className="absolute inset-0 m-auto" color="rgba(255,255,255,0.35)" />
            <p className="absolute bottom-6 left-0 right-0 text-center text-white/60 text-xs px-6">বিলটি সম্পূর্ণ ফ্রেমের ভেতর রাখুন, ভালো আলোতে তুলুন</p>
          </div>
          <button onClick={() => setStage("processing")} className="tap w-16 h-16 rounded-full flex items-center justify-center pulse-ring" style={{ background: COLORS.marigold }}>
            <Camera size={26} color={COLORS.greenDark} />
          </button>
          <p className="text-white/50 text-xs mt-4">ছবি তুলতে ট্যাপ করুন</p>
        </div>
      )}

      {stage === "processing" && (
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden mb-8" style={{ background: "#3a2f1e" }}>
            <div className="absolute left-3 right-3 h-0.5 scanline" style={{ background: COLORS.marigold, boxShadow: `0 0 12px 2px ${COLORS.marigold}` }} />
            <FileText size={54} className="absolute inset-0 m-auto" color="rgba(255,255,255,0.25)" />
          </div>
          <div className="flex items-center gap-2 text-white/80 text-sm">
            <Sparkles size={16} color={COLORS.marigold} className="animate-pulse" />
            AI বিল পড়ছে…
          </div>
        </div>
      )}

      {stage === "review" && (
        <div className="flex-1 bg-white rounded-t-3xl overflow-hidden flex flex-col">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <h3 className="font-display font-700 text-lg" style={{ color: COLORS.ink }}>ড্রাফট পার্চেজ</h3>
            <Chip tone="sage">৩টি আইটেম শনাক্ত</Chip>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar px-5 space-y-3 pb-4">
            {items.map((it) => {
              const badge = confBadge(it.confidence);
              return (
                <div key={it.id} className="rise rounded-2xl p-4 stitch" style={{ background: COLORS.paper }}>
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-semibold text-sm" style={{ color: COLORS.ink }}>{it.name}</p>
                    <Chip tone={badge.tone}>{badge.label}</Chip>
                  </div>
                  <div className="flex items-center gap-4 text-xs" style={{ color: COLORS.inkSoft }}>
                    <span>{it.qty} {it.unit}</span>
                    <span>৳{it.price}/{it.unit}</span>
                    <span className="font-semibold" style={{ color: COLORS.green }}>মোট ৳{it.qty * it.price}</span>
                  </div>
                </div>
              );
            })}
            <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: COLORS.paperDark }}>
              <span className="text-sm font-semibold" style={{ color: COLORS.ink }}>সর্বমোট</span>
              <span className="font-display font-700 text-lg" style={{ color: COLORS.green }}>
                ৳{items.reduce((s, i) => s + i.qty * i.price, 0).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="p-5 pt-2">
            <button onClick={() => setStage("done")} className="tap w-full py-3.5 rounded-2xl font-semibold text-white flex items-center justify-center gap-2" style={{ background: COLORS.green }}>
              <Check size={18} /> নিশ্চিত করুন ও স্টক আপডেট করুন
            </button>
          </div>
        </div>
      )}

      {stage === "done" && (
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="pop w-16 h-16 rounded-full mb-4 flex items-center justify-center" style={{ background: COLORS.marigold }}>
            <Check size={30} color={COLORS.greenDark} />
          </div>
          <p className="text-white font-semibold mb-1">স্টক আপডেট হয়েছে</p>
          <p className="text-white/60 text-xs mb-8">৩টি প্রোডাক্ট যোগ হলো</p>
          <button onClick={() => onConfirm(items)} className="tap px-8 py-3 rounded-2xl font-semibold" style={{ background: COLORS.marigold, color: COLORS.greenDark }}>ঠিক আছে</button>
        </div>
      )}
    </div>
  );
}

/* ---------------- Voice Entry Flow ---------------- */
function VoiceEntryFlow({ onClose, onConfirm }) {
  const [stage, setStage] = useState("listening"); // listening -> parsed -> done
  const heard = "রহিমকে দুই কেজি চাল আর এক লিটার তেল দিলাম, ৩০০ টাকা বাকিতে";

  useEffect(() => {
    if (stage === "listening") {
      const t = setTimeout(() => setStage("parsed"), 1900);
      return () => clearTimeout(t);
    }
  }, [stage]);

  return (
    <div className="absolute inset-0 z-30 flex flex-col" style={{ background: COLORS.ink }}>
      <div className="flex items-center justify-between px-4 pt-6 pb-3">
        <button onClick={onClose} className="tap w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
          <X size={18} color="#fff" />
        </button>
        <span className="text-white/80 text-sm font-medium">ভয়েস এন্ট্রি</span>
        <div className="w-9" />
      </div>

      {stage === "listening" && (
        <div className="flex-1 flex flex-col items-center justify-center px-10">
          <div className="w-24 h-24 rounded-full mb-8 flex items-center justify-center pulse-ring" style={{ background: COLORS.thread }}>
            <Mic size={34} color="#fff" />
          </div>
          <div className="flex items-end gap-1 h-10 mb-8">
            {[6,14,22,10,18,8,16,24,12,6].map((h, i) => (
              <div key={i} className="w-1.5 rounded-full" style={{ height: h, background: "rgba(255,255,255,0.5)", animation: `pulse 0.8s ease-in-out ${i * 0.08}s infinite alternate` }} />
            ))}
          </div>
          <p className="text-white/60 text-sm text-center">শুনছি… বাংলায় বলুন</p>
        </div>
      )}

      {stage === "parsed" && (
        <div className="flex-1 bg-white rounded-t-3xl overflow-hidden flex flex-col">
          <div className="px-5 pt-5 pb-4">
            <p className="text-xs mb-1.5" style={{ color: COLORS.inkSoft }}>আপনি বলেছেন:</p>
            <p className="rounded-2xl p-3 text-sm italic stitch" style={{ background: COLORS.paper, color: COLORS.ink }}>"{heard}"</p>
          </div>
          <div className="flex-1 px-5 space-y-3 overflow-y-auto no-scrollbar">
            <p className="text-xs font-semibold" style={{ color: COLORS.inkSoft }}>শনাক্তকৃত তথ্য</p>
            <div className="rounded-2xl p-4 space-y-3" style={{ background: COLORS.paper }}>
              {[
                ["কাস্টমার", "রহিম মিয়া"],
                ["পণ্য", "চাল ২ কেজি, তেল ১ লিটার"],
                ["পেমেন্ট", "বাকি (Due)"],
                ["পরিমাণ", "৳৩০০"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: COLORS.inkSoft }}>{k}</span>
                  <span className="text-sm font-semibold" style={{ color: COLORS.ink }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-3 flex items-start gap-2" style={{ background: "#FBEBD2" }}>
              <AlertCircle size={16} color="#8A5A15" className="mt-0.5 shrink-0" />
              <p className="text-xs" style={{ color: "#8A5A15" }}>রহিমের নামে ৩০০ টাকা বাকি যোগ করবেন?</p>
            </div>
          </div>
          <div className="p-5 pt-3 flex gap-3">
            <button onClick={onClose} className="tap flex-1 py-3.5 rounded-2xl font-semibold" style={{ background: COLORS.paperDark, color: COLORS.ink }}>বাতিল</button>
            <button onClick={() => setStage("done")} className="tap flex-1 py-3.5 rounded-2xl font-semibold text-white" style={{ background: COLORS.green }}>নিশ্চিত করুন</button>
          </div>
        </div>
      )}

      {stage === "done" && (
        <div className="flex-1 flex flex-col items-center justify-center px-8">
          <div className="pop w-16 h-16 rounded-full mb-4 flex items-center justify-center" style={{ background: COLORS.marigold }}>
            <Check size={30} color={COLORS.greenDark} />
          </div>
          <p className="text-white font-semibold mb-1">বাকির খাতায় যোগ হলো</p>
          <p className="text-white/60 text-xs mb-8">রহিম মিয়া — ৳৩০০</p>
          <button onClick={onConfirm} className="tap px-8 py-3 rounded-2xl font-semibold" style={{ background: COLORS.marigold, color: COLORS.greenDark }}>ঠিক আছে</button>
        </div>
      )}
    </div>
  );
}

/* ---------------- Add Sheet ---------------- */
function AddSheet({ onClose, onPick }) {
  const options = [
    { id: "bill", label: "বিল স্ক্যান", sub: "ছবি তুলে স্টক যোগ করুন", icon: Camera, tone: COLORS.green },
    { id: "voice", label: "ভয়েস এন্ট্রি", sub: "বলে হিসাব লিখুন", icon: Mic, tone: COLORS.thread },
    { id: "sale", label: "নগদ বিক্রি", sub: "দ্রুত বিক্রি এন্ট্রি", icon: Receipt, tone: COLORS.marigold },
    { id: "payment", label: "বাকি জমা", sub: "কাস্টমার পেমেন্ট নিন", icon: Wallet, tone: COLORS.sage },
  ];
  return (
    <div className="absolute inset-0 z-20 flex items-end" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: "rgba(36,28,16,0.5)" }} />
      <div onClick={(e) => e.stopPropagation()} className="sheet-up relative w-full rounded-t-3xl p-5 pb-8" style={{ background: COLORS.white }}>
        <div className="w-10 h-1 rounded-full mx-auto mb-5" style={{ background: COLORS.paperDark }} />
        <h3 className="font-display font-700 text-lg mb-4" style={{ color: COLORS.ink }}>কী যোগ করবেন?</h3>
        <div className="grid grid-cols-2 gap-3">
          {options.map((o) => (
            <button key={o.id} onClick={() => onPick(o.id)} className="tap rounded-2xl p-4 text-left" style={{ background: COLORS.paper }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: o.tone }}>
                <o.icon size={18} color="#fff" />
              </div>
              <p className="font-semibold text-sm" style={{ color: COLORS.ink }}>{o.label}</p>
              <p className="text-xs mt-0.5" style={{ color: COLORS.inkSoft }}>{o.sub}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Home Screen ---------------- */
function HomeScreen({ shopName, txns, lowStockCount }) {
  const summary = {
    sales: txns.filter(t => t.type === "sale" || t.type === "due").reduce((s, t) => s + t.amount, 0),
    due: txns.filter(t => t.type === "due").reduce((s, t) => s + t.amount, 0),
    collected: txns.filter(t => t.type === "payment").reduce((s, t) => s + t.amount, 0),
    purchases: txns.filter(t => t.type === "purchase").reduce((s, t) => s + t.amount, 0),
  };
  const profit = Math.round(summary.sales * 0.18);

  return (
    <Screen>
      <TopBar
        title={shopName}
        subtitle="আজ, ১৩ আগস্ট"
        right={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: COLORS.paperDark }}>
              <Wifi size={14} color={COLORS.green} />
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center relative" style={{ background: COLORS.paperDark }}>
              <Bell size={14} color={COLORS.ink} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: COLORS.thread }} />
            </div>
          </div>
        }
      />

      {/* Summary hero */}
      <div className="mx-5 rounded-3xl p-5 mb-4" style={{ background: COLORS.green }}>
        <p className="text-white/70 text-xs mb-1">আজকের বিক্রি</p>
        <p className="font-display text-3xl font-800 text-white mb-4">৳{summary.sales.toLocaleString()}</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            ["বাকি বিক্রি", summary.due, ArrowUpRight],
            ["বাকি জমা", summary.collected, ArrowDownRight],
            ["আনুমানিক লাভ", profit, TrendingUp],
          ].map(([label, val, Icon]) => (
            <div key={label} className="rounded-2xl p-2.5" style={{ background: "rgba(255,255,255,0.1)" }}>
              <Icon size={13} color={COLORS.marigold} />
              <p className="text-white text-sm font-semibold mt-1">৳{val.toLocaleString()}</p>
              <p className="text-white/55 text-[10px] mt-0.5 leading-tight">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {lowStockCount > 0 && (
        <div className="mx-5 mb-4 rounded-2xl p-3.5 flex items-center gap-3" style={{ background: "#FBEBD2" }}>
          <AlertCircle size={18} color="#8A5A15" className="shrink-0" />
          <p className="text-xs" style={{ color: "#8A5A15" }}>
            <span className="font-semibold">{lowStockCount}টি প্রোডাক্টে</span> স্টক কমে গেছে — স্টক ট্যাব দেখুন
          </p>
        </div>
      )}

      {/* Recent transactions */}
      <div className="px-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-700 text-base" style={{ color: COLORS.ink }}>সাম্প্রতিক লেনদেন</h3>
          <span className="text-xs font-semibold" style={{ color: COLORS.green }}>সব দেখুন</span>
        </div>
        <div className="space-y-2.5">
          {txns.map((t) => {
            const cfg = {
              sale: { icon: Receipt, tone: COLORS.marigold, sign: "+" },
              due: { icon: ArrowUpRight, tone: COLORS.thread, sign: "+" },
              payment: { icon: ArrowDownRight, tone: COLORS.sage, sign: "+" },
              purchase: { icon: Package, tone: COLORS.green, sign: "−" },
            }[t.type];
            return (
              <div key={t.id} className="rise flex items-center gap-3 rounded-2xl p-3" style={{ background: COLORS.white, boxShadow: "0 1px 3px rgba(36,28,16,0.06)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: COLORS.paper }}>
                  <cfg.icon size={16} color={cfg.tone} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: COLORS.ink }}>{t.label}</p>
                  <p className="text-xs truncate" style={{ color: COLORS.inkSoft }}>{t.desc} · {t.time}</p>
                </div>
                <p className="text-sm font-semibold shrink-0" style={{ color: t.type === "purchase" ? COLORS.ink : COLORS.green }}>
                  {cfg.sign}৳{t.amount.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}

/* ---------------- Due Ledger Screen ---------------- */
function DueScreen({ customers, onPay }) {
  const [selected, setSelected] = useState(null);
  const [payAmount, setPayAmount] = useState("");
  const totalDue = customers.reduce((s, c) => s + c.due, 0);

  if (selected) {
    const c = selected;
    return (
      <Screen>
        <div className="px-5 pt-6 pb-4 flex items-center gap-3">
          <button onClick={() => setSelected(null)} className="tap w-8 h-8 rounded-full flex items-center justify-center" style={{ background: COLORS.paperDark }}>
            <ChevronLeft size={16} color={COLORS.ink} />
          </button>
          <div>
            <h2 className="font-display font-700 text-lg" style={{ color: COLORS.ink }}>{c.name}</h2>
            <p className="text-xs" style={{ color: COLORS.inkSoft }}>{c.phone}</p>
          </div>
        </div>

        <div className="mx-5 rounded-2xl p-5 mb-5 text-center stitch" style={{ background: COLORS.paper }}>
          <p className="text-xs mb-1" style={{ color: COLORS.inkSoft }}>মোট বাকি</p>
          <p className="font-display text-3xl font-800" style={{ color: COLORS.thread }}>৳{c.due.toLocaleString()}</p>
        </div>

        <div className="px-5 mb-5">
          <p className="text-xs font-semibold mb-2" style={{ color: COLORS.inkSoft }}>পেমেন্ট নিন</p>
          <div className="flex gap-2">
            <input value={payAmount} onChange={(e) => setPayAmount(e.target.value.replace(/[^0-9]/g, ""))} placeholder="৳ পরিমাণ লিখুন"
              className="flex-1 py-3 px-4 rounded-2xl outline-none text-sm" style={{ background: COLORS.paper, color: COLORS.ink, border: `1px solid ${COLORS.paperDark}` }} />
            <button
              onClick={() => { if (payAmount) { onPay(c.id, Number(payAmount)); setPayAmount(""); setSelected(null); } }}
              className="tap px-5 rounded-2xl font-semibold text-white text-sm" style={{ background: COLORS.green }}>জমা করুন</button>
          </div>
        </div>

        <div className="px-5">
          <p className="text-xs font-semibold mb-2" style={{ color: COLORS.inkSoft }}>লেনদেনের ইতিহাস</p>
          <div className="space-y-2">
            {[["গতকাল", "বাকি বিক্রি", "+৳300"], ["৩ দিন আগে", "পেমেন্ট", "−৳500"], ["৬ দিন আগে", "বাকি বিক্রি", "+৳950"]].map(([d, l, a], i) => (
              <div key={i} className="flex items-center justify-between rounded-xl p-3" style={{ background: COLORS.white, boxShadow: "0 1px 3px rgba(36,28,16,0.05)" }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: COLORS.ink }}>{l}</p>
                  <p className="text-xs" style={{ color: COLORS.inkSoft }}>{d}</p>
                </div>
                <span className="text-sm font-semibold" style={{ color: a.startsWith("+") ? COLORS.thread : COLORS.green }}>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title="বাকির খাতা" subtitle={`মোট বকেয়া ৳${totalDue.toLocaleString()}`} />
      <div className="px-5">
        <div className="flex items-center gap-2 rounded-2xl px-4 py-2.5 mb-4" style={{ background: COLORS.white, boxShadow: "0 1px 3px rgba(36,28,16,0.06)" }}>
          <Search size={15} color={COLORS.inkSoft} />
          <input placeholder="কাস্টমার খুঁজুন" className="flex-1 outline-none text-sm bg-transparent" style={{ color: COLORS.ink }} />
        </div>
        <div className="space-y-2.5">
          {customers.sort((a, b) => b.due - a.due).map((c) => (
            <button key={c.id} onClick={() => setSelected(c)} className="tap w-full flex items-center gap-3 rounded-2xl p-3.5" style={{ background: COLORS.white, boxShadow: "0 1px 3px rgba(36,28,16,0.06)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm shrink-0" style={{ background: COLORS.paper, color: COLORS.green }}>
                {c.name[0]}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: COLORS.ink }}>{c.name}</p>
                <p className="text-xs" style={{ color: COLORS.inkSoft }}>শেষ লেনদেন: {c.last}</p>
              </div>
              {c.due > 0 ? (
                <span className="text-sm font-semibold" style={{ color: COLORS.thread }}>৳{c.due.toLocaleString()}</span>
              ) : (
                <Chip tone="green">পরিশোধিত</Chip>
              )}
              <ChevronRight size={16} color={COLORS.inkSoft} />
            </button>
          ))}
        </div>
      </div>
    </Screen>
  );
}

/* ---------------- Stock Screen ---------------- */
function StockScreen({ products }) {
  return (
    <Screen>
      <TopBar title="স্টক" subtitle={`${products.length}টি প্রোডাক্ট`} right={
        <button className="tap w-9 h-9 rounded-full flex items-center justify-center" style={{ background: COLORS.green }}>
          <Plus size={16} color="#fff" />
        </button>
      } />
      <div className="px-5 space-y-2.5">
        {products.map((p) => {
          const low = p.stock <= p.minStock;
          return (
            <div key={p.id} className="rounded-2xl p-3.5 flex items-center gap-3" style={{ background: COLORS.white, boxShadow: "0 1px 3px rgba(36,28,16,0.06)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: low ? "#F6E1DB" : COLORS.paper }}>
                <Package size={18} color={low ? COLORS.thread : COLORS.green} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: COLORS.ink }}>{p.name}</p>
                <p className="text-xs" style={{ color: COLORS.inkSoft }}>বিক্রয় মূল্য ৳{p.sell}/{p.unit}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold" style={{ color: low ? COLORS.thread : COLORS.ink }}>{p.stock} {p.unit}</p>
                {low && <p className="text-[10px]" style={{ color: COLORS.thread }}>স্টক কম</p>}
              </div>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}

/* ---------------- Reports Screen ---------------- */
function ReportsScreen({ txns, products }) {
  const sales = txns.filter(t => t.type === "sale" || t.type === "due").reduce((s, t) => s + t.amount, 0);
  const purchases = txns.filter(t => t.type === "purchase").reduce((s, t) => s + t.amount, 0);
  const profit = Math.round(sales * 0.18);
  const days = [
    ["রবি", 40], ["সোম", 65], ["মঙ্গল", 50], ["বুধ", 80], ["বৃহঃ", 45], ["শুক্র", 90], ["শনি", 70],
  ];
  const max = Math.max(...days.map(d => d[1]));

  return (
    <Screen>
      <TopBar title="রিপোর্ট" subtitle="দৈনিক ও সাপ্তাহিক সারাংশ" />
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            ["আজকের বিক্রি", `৳${sales.toLocaleString()}`, COLORS.green],
            ["আনুমানিক লাভ", `৳${profit.toLocaleString()}`, COLORS.marigold],
            ["ক্রয়", `৳${purchases.toLocaleString()}`, COLORS.thread],
            ["মোট বকেয়া", "৳2,300", COLORS.sage],
          ].map(([label, val, tone]) => (
            <div key={label} className="rounded-2xl p-4" style={{ background: COLORS.white, boxShadow: "0 1px 3px rgba(36,28,16,0.06)" }}>
              <div className="w-2 h-2 rounded-full mb-2" style={{ background: tone }} />
              <p className="font-display font-700 text-lg" style={{ color: COLORS.ink }}>{val}</p>
              <p className="text-xs mt-0.5" style={{ color: COLORS.inkSoft }}>{label}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-4 mb-5 paper-lines" style={{ background: COLORS.white, boxShadow: "0 1px 3px rgba(36,28,16,0.06)" }}>
          <p className="text-sm font-semibold mb-3" style={{ color: COLORS.ink }}>সাপ্তাহিক বিক্রি</p>
          <div className="flex items-end justify-between gap-2 h-24">
            {days.map(([d, v]) => (
              <div key={d} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full rounded-md transition-all duration-500" style={{ height: `${(v / max) * 80}px`, background: d === "শুক্র" ? COLORS.marigold : COLORS.green, opacity: d === "শুক্র" ? 1 : 0.75 }} />
                <span className="text-[10px]" style={{ color: COLORS.inkSoft }}>{d}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm font-semibold mb-2" style={{ color: COLORS.ink }}>সর্বাধিক বিক্রিত পণ্য</p>
        <div className="space-y-2 mb-5">
          {products.slice(0, 3).map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: COLORS.white, boxShadow: "0 1px 3px rgba(36,28,16,0.06)" }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: COLORS.paper, color: COLORS.green }}>{i + 1}</span>
              <p className="flex-1 text-sm font-medium" style={{ color: COLORS.ink }}>{p.name}</p>
              <p className="text-xs" style={{ color: COLORS.inkSoft }}>৳{p.sell}/{p.unit}</p>
            </div>
          ))}
        </div>

        <button className="tap w-full py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2 mb-6" style={{ background: COLORS.paperDark, color: COLORS.ink }}>
          <FileText size={16} /> PDF এক্সপোর্ট করুন
        </button>
      </div>
    </Screen>
  );
}

/* ---------------- Toast ---------------- */
function Toast({ text }) {
  return (
    <div className="pop absolute bottom-24 left-5 right-5 z-40 rounded-2xl px-4 py-3 flex items-center gap-2" style={{ background: COLORS.ink }}>
      <CheckCircle2 size={16} color={COLORS.marigold} />
      <span className="text-white text-sm font-medium">{text}</span>
    </div>
  );
}

/* ---------------- Root App ---------------- */
export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [shopName, setShopName] = useState("আমার দোকান");
  const [tab, setTab] = useState("home");
  const [addOpen, setAddOpen] = useState(false);
  const [flow, setFlow] = useState(null);
  const [txns, setTxns] = useState(INIT_TXNS);
  const [customers, setCustomers] = useState(INIT_CUSTOMERS);
  const [products] = useState(INIT_PRODUCTS);
  const [toast, setToast] = useState(null);
  const [offline, setOffline] = useState(false);

  const showToast = (t) => { setToast(t); setTimeout(() => setToast(null), 2200); };

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

  const handlePick = (id) => {
    setAddOpen(false);
    if (id === "bill") setFlow("bill");
    else if (id === "voice") setFlow("voice");
    else if (id === "sale") {
      setTxns([{ id: "t" + Date.now(), type: "sale", label: "নগদ বিক্রি", desc: "দ্রুত এন্ট্রি", amount: 220, time: "এখন", tag: "cash" }, ...txns]);
      showToast("বিক্রি যোগ হয়েছে ✓");
    } else if (id === "payment") {
      showToast("বাকির খাতা থেকে বেছে নিন");
      setTab("due");
    }
  };

  const handlePay = (customerId, amount) => {
    setCustomers(customers.map(c => c.id === customerId ? { ...c, due: Math.max(0, c.due - amount) } : c));
    showToast(`৳${amount} জমা হয়েছে ✓`);
  };

  const tabs = [
    { id: "home", label: "হোম", icon: Home },
    { id: "due", label: "বাকি", icon: Wallet },
    { id: "add", label: "", icon: Plus, center: true },
    { id: "stock", label: "স্টক", icon: Package },
    { id: "reports", label: "রিপোর্ট", icon: BarChart3 },
  ];

  return (
    <div className="w-full h-screen flex items-center justify-center" style={{ background: "#DDD6C4" }}>
      <FontStyles />
      <div className="relative w-full max-w-sm h-full max-h-[860px] overflow-hidden shadow-2xl sm:rounded-[2.5rem]" style={{ background: COLORS.paper }}>

        {!onboarded ? (
          <Onboarding onDone={(name) => { setShopName(name); setOnboarded(true); showToast("স্বাগতম! 👋"); }} />
        ) : (
          <>
            {tab === "home" && <HomeScreen shopName={shopName} txns={txns} lowStockCount={lowStockCount} />}
            {tab === "due" && <DueScreen customers={customers} onPay={handlePay} />}
            {tab === "stock" && <StockScreen products={products} />}
            {tab === "reports" && <ReportsScreen txns={txns} products={products} />}

            {/* Bottom nav */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 pt-2 z-10" style={{ background: "linear-gradient(to top, #F6F1E4 60%, rgba(246,241,228,0))" }}>
              <div className="flex items-center justify-between rounded-3xl px-3 py-2" style={{ background: COLORS.white, boxShadow: "0 4px 20px rgba(36,28,16,0.12)" }}>
                {tabs.map((t) =>
                  t.center ? (
                    <button key={t.id} onClick={() => setAddOpen(true)} className="tap w-14 h-14 rounded-full flex items-center justify-center -mt-8" style={{ background: COLORS.marigold, boxShadow: "0 6px 16px rgba(232,163,61,0.5)" }}>
                      <Plus size={24} color={COLORS.greenDark} />
                    </button>
                  ) : (
                    <button key={t.id} onClick={() => setTab(t.id)} className="tap flex flex-col items-center gap-1 py-1.5 px-3">
                      <t.icon size={19} color={tab === t.id ? COLORS.green : COLORS.inkSoft} strokeWidth={tab === t.id ? 2.4 : 2} />
                      <span className="text-[10px] font-medium" style={{ color: tab === t.id ? COLORS.green : COLORS.inkSoft }}>{t.label}</span>
                    </button>
                  )
                )}
              </div>
            </div>

            {addOpen && <AddSheet onClose={() => setAddOpen(false)} onPick={handlePick} />}

            {flow === "bill" && (
              <BillScanFlow
                onClose={() => setFlow(null)}
                onConfirm={(items) => {
                  setFlow(null);
                  setTxns([{ id: "t" + Date.now(), type: "purchase", label: "সাপ্লায়ার বিল", desc: `${items.length}টি আইটেম`, amount: items.reduce((s, i) => s + i.qty * i.price, 0), time: "এখন", tag: "purchase" }, ...txns]);
                  showToast("স্টক ও ক্রয় হালনাগাদ হয়েছে ✓");
                }}
              />
            )}
            {flow === "voice" && (
              <VoiceEntryFlow
                onClose={() => setFlow(null)}
                onConfirm={() => {
                  setFlow(null);
                  setTxns([{ id: "t" + Date.now(), type: "due", label: "বাকি বিক্রি", desc: "রহিম মিয়া", amount: 300, time: "এখন", tag: "due" }, ...txns]);
                  setCustomers(customers.map(c => c.id === "c1" ? { ...c, due: c.due + 300 } : c));
                  showToast("বাকির খাতা হালনাগাদ হয়েছে ✓");
                }}
              />
            )}

            {toast && <Toast text={toast} />}
          </>
        )}
      </div>
    </div>
  );
}
