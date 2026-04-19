import { useState, useEffect } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface Outfit {
  id: string;
  material: string;
  pattern: string;
  type: string;
  colors: string[];
  emoji: string;
  name: string;
}

interface Animal {
  id: string;
  name: string;
  emoji: string;
  price: number;
}

interface Pattern {
  id: string;
  name: string;
  symbol: string;
  price: number;
}

interface PlayerData {
  name: string;
  coins: number;
  outfits: Outfit[];
  currentAnimalId: string;
  currentOutfitId: string | null;
  totalEarned: number;
}

// ─── CONSTANTS ─────────────────────────────────────────────────────────────────

const ALL_ANIMALS: Animal[] = [
  { id: "cat", name: "Котик", emoji: "🐱", price: 0 },
  { id: "dog", name: "Собачка", emoji: "🐶", price: 50 },
  { id: "bunny", name: "Зайчик", emoji: "🐰", price: 50 },
  { id: "bear", name: "Мишка", emoji: "🐻", price: 50 },
  { id: "fox", name: "Лисичка", emoji: "🦊", price: 50 },
  { id: "panda", name: "Панда", emoji: "🐼", price: 50 },
  { id: "frog", name: "Лягушка", emoji: "🐸", price: 50 },
  { id: "chick", name: "Цыплёнок", emoji: "🐥", price: 50 },
  { id: "hamster", name: "Хомяк", emoji: "🐹", price: 50 },
  { id: "unicorn", name: "Единорог", emoji: "🦄", price: 50 },
  { id: "penguin", name: "Пингвин", emoji: "🐧", price: 50 },
  { id: "owl", name: "Совёнок", emoji: "🦉", price: 50 },
  { id: "koala", name: "Коала", emoji: "🐨", price: 50 },
  { id: "tiger", name: "Тигрёнок", emoji: "🐯", price: 50 },
  { id: "dragon", name: "Дракончик", emoji: "🐲", price: 50 },
  { id: "dolphin", name: "Дельфин", emoji: "🐬", price: 50 },
  { id: "hedgehog", name: "Ёжик", emoji: "🦔", price: 50 },
  { id: "octopus", name: "Осьминожка", emoji: "🐙", price: 50 },
  { id: "butterfly", name: "Бабочка", emoji: "🦋", price: 50 },
  { id: "axolotl", name: "Аксолотль", emoji: "🫧", price: 50 },
];

const ALL_PATTERNS: Pattern[] = [
  { id: "plain", name: "Однотонный", symbol: "◼", price: 0 },
  { id: "stripes", name: "Полоски", symbol: "≡", price: 0 },
  { id: "dots", name: "Горошек", symbol: "⠿", price: 100 },
  { id: "hearts", name: "Сердечки", symbol: "♥", price: 100 },
  { id: "stars", name: "Звёзды", symbol: "★", price: 100 },
  { id: "flowers", name: "Цветочки", symbol: "✿", price: 100 },
  { id: "checks", name: "Клетка", symbol: "⊞", price: 100 },
  { id: "waves", name: "Волны", symbol: "〜", price: 100 },
  { id: "zigzag", name: "Зигзаг", symbol: "⌇", price: 100 },
  { id: "rainbow", name: "Радуга", symbol: "🌈", price: 100 },
];

const MATERIALS = ["Хлопок", "Шерсть", "Шёлк", "Деним", "Вязка"];
const MATERIAL_EMOJIS: Record<string, string> = {
  "Хлопок": "🌿", "Шерсть": "🐑", "Шёлк": "✨", "Деним": "👖", "Вязка": "🧶"
};

const OUTFIT_TYPES = [
  { id: "sweater", name: "Свитер", emoji: "🧥" },
  { id: "tshirt", name: "Футболка", emoji: "👕" },
  { id: "dress", name: "Платье", emoji: "👗" },
  { id: "shorts", name: "Шорты", emoji: "🩳" },
  { id: "skirt", name: "Юбка", emoji: "🩱" },
  { id: "cap", name: "Кепка", emoji: "🧢" },
];

const PALETTE = [
  "#FF6B9D", "#FF9F43", "#FFD93D", "#6BCF85", "#54A0FF",
  "#B96BFF", "#FF7675", "#00CEC9", "#FDCB6E", "#A29BFE",
  "#E17055", "#74B9FF", "#55EFC4", "#FD79A8", "#636E72",
  "#2D3436", "#FFFFFF", "#F8F9FA",
];

// ─── HELPERS ───────────────────────────────────────────────────────────────────

function makeOutfitName(type: string, patternName: string, material: string) {
  const typeNames: Record<string, string> = {
    sweater: "Свитер", tshirt: "Футболка", dress: "Платье",
    shorts: "Шорты", skirt: "Юбка", cap: "Кепка"
  };
  return `${typeNames[type] || type} «${patternName}» из ${material.toLowerCase()}а`;
}

function loadPlayer(): PlayerData | null {
  try {
    const s = localStorage.getItem("koto_player");
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

function savePlayer(p: PlayerData) {
  localStorage.setItem("koto_player", JSON.stringify(p));
}

function getSavedAnimals(name: string): string[] {
  try { const s = localStorage.getItem(`koto_animals_${name}`); return s ? JSON.parse(s) : ["cat"]; }
  catch { return ["cat"]; }
}

function saveAnimal(name: string, animalId: string) {
  const cur = getSavedAnimals(name);
  if (!cur.includes(animalId)) localStorage.setItem(`koto_animals_${name}`, JSON.stringify([...cur, animalId]));
}

function getSavedPatterns(name: string): string[] {
  try { const s = localStorage.getItem(`koto_patterns_${name}`); return s ? JSON.parse(s) : ["plain", "stripes"]; }
  catch { return ["plain", "stripes"]; }
}

function savePattern(name: string, patternId: string) {
  const cur = getSavedPatterns(name);
  if (!cur.includes(patternId)) localStorage.setItem(`koto_patterns_${name}`, JSON.stringify([...cur, patternId]));
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: (name: string, code: string, isNew: boolean) => void }) {
  const [mode, setMode] = useState<"choice" | "login" | "register">("choice");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleRegister() {
    if (name.trim().length < 2) { setError("Введи имя (минимум 2 буквы)"); return; }
    if (code.length < 4) { setError("Кодовое слово — минимум 4 символа"); return; }
    onLogin(name.trim(), code, true);
  }

  function handleLogin() {
    if (!name.trim()) { setError("Введи имя"); return; }
    if (code.length < 4) { setError("Введи кодовое слово"); return; }
    onLogin(name.trim(), code, false);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #FFE0EC 0%, #FFF8ED 40%, #E0F5FF 100%)" }}>
      <div className="text-center mb-8 animate-bounce-in">
        <div className="text-8xl mb-3 animate-float inline-block">🐱</div>
        <h1 className="text-5xl font-black text-gray-800 mb-1" style={{ fontFamily: "Caveat, cursive" }}>КотоМода</h1>
        <p className="text-gray-500 font-semibold text-lg">Одевай зверят и зарабатывай монетки!</p>
      </div>

      {mode === "choice" && (
        <div className="game-card p-8 w-full max-w-sm animate-slide-up flex flex-col gap-4">
          <button className="game-btn py-4 text-xl text-white" style={{ background: "var(--game-pink)" }} onClick={() => setMode("register")}>
            🌟 Новая игра
          </button>
          <button className="game-btn py-4 text-xl text-white" style={{ background: "var(--game-blue)" }} onClick={() => setMode("login")}>
            🔑 Войти в аккаунт
          </button>
        </div>
      )}

      {(mode === "register" || mode === "login") && (
        <div className="game-card p-8 w-full max-w-sm animate-slide-up flex flex-col gap-4">
          <h2 className="text-2xl font-black text-center text-gray-800">
            {mode === "register" ? "Создать аккаунт" : "Войти"}
          </h2>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">Твоё имя</label>
            <input value={name} onChange={e => { setName(e.target.value); setError(""); }}
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-pink-400 outline-none font-bold text-lg"
              placeholder={mode === "register" ? "Маша, Петя..." : "Твоё имя"} />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-1">
              {mode === "register" ? "Придумай кодовое слово" : "Кодовое слово"}
            </label>
            <input value={code} onChange={e => { setCode(e.target.value); setError(""); }}
              type="password"
              className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-pink-400 outline-none font-bold text-lg"
              placeholder="Минимум 4 символа" />
            {mode === "register" && <p className="text-xs text-gray-400 mt-1">Запомни его — оно нужно для входа!</p>}
          </div>
          {error && <p className="text-red-500 text-sm font-bold text-center animate-shake">{error}</p>}
          <button className="game-btn py-4 text-xl text-white"
            style={{ background: mode === "register" ? "var(--game-pink)" : "var(--game-blue)" }}
            onClick={mode === "register" ? handleRegister : handleLogin}>
            {mode === "register" ? "Начать играть! 🎉" : "Войти 🔑"}
          </button>
          <button className="text-gray-400 font-bold text-sm text-center" onClick={() => { setMode("choice"); setError(""); }}>← Назад</button>
        </div>
      )}
    </div>
  );
}

// ─── HOME TAB ─────────────────────────────────────────────────────────────────

function HomeTab({ player, updatePlayer }: { player: PlayerData; updatePlayer: (u: Partial<PlayerData>) => void }) {
  const [coinAnim, setCoinAnim] = useState(false);
  const [dressed, setDressed] = useState(false);
  const [sparkKey, setSparkKey] = useState(0);

  const currentAnimal = ALL_ANIMALS.find(a => a.id === player.currentAnimalId) || ALL_ANIMALS[0];
  const currentOutfit = player.outfits.find(o => o.id === player.currentOutfitId);
  const myAnimals = getSavedAnimals(player.name);

  function handleDress() {
    if (!currentOutfit) return;
    setCoinAnim(true);
    setDressed(true);
    setSparkKey(k => k + 1);
    updatePlayer({ coins: player.coins + 10, totalEarned: player.totalEarned + 10 });
    setTimeout(() => { setCoinAnim(false); setDressed(false); }, 900);
  }

  return (
    <div className="p-4 flex flex-col items-center gap-4">
      <div className="text-center animate-slide-up">
        <p className="text-gray-500 font-semibold">Привет, <span className="text-pink-500 font-black">{player.name}</span>! 👋</p>
        <p className="text-gray-400 text-sm">Надень наряд — получи 10 монеток</p>
      </div>

      {/* Animal stage */}
      <div className="game-card p-8 w-full flex flex-col items-center gap-3 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 30%, #FFE0EC55 0%, transparent 70%)" }} />

        {coinAnim && (
          <div className="absolute top-4 right-4 coin-badge flex items-center gap-1 px-3 py-1 text-sm animate-coin-fly z-20">
            🪙 +10
          </div>
        )}

        {coinAnim && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            {["💫", "⭐", "✨", "🌟", "✨"].map((s, i) => (
              <span key={`${sparkKey}-${i}`} className="absolute text-2xl animate-coin-fly"
                style={{ left: `${15 + i * 18}%`, top: `${25 + (i % 3) * 15}%`, animationDelay: `${i * 0.08}s` }}>{s}</span>
            ))}
          </div>
        )}

        <div className={`text-9xl relative z-10 select-none cursor-pointer transition-transform duration-200 ${dressed ? "animate-wiggle" : "animate-float"}`}
          onClick={handleDress}>
          {currentAnimal.emoji}
        </div>

        {currentOutfit ? (
          <div className="flex items-center gap-2 bg-pink-50 px-4 py-2 rounded-2xl border-2 border-pink-200 z-10">
            <span className="text-2xl">{currentOutfit.emoji}</span>
            <span className="font-bold text-pink-700 text-sm">{currentOutfit.name}</span>
          </div>
        ) : (
          <div className="text-gray-400 font-semibold text-sm bg-gray-50 px-4 py-2 rounded-2xl border-2 border-dashed border-gray-200 z-10">
            Без наряда 🪡
          </div>
        )}
        <p className="font-black text-gray-600 z-10">{currentAnimal.name}</p>
      </div>

      {/* Dress button */}
      {currentOutfit ? (
        <button onClick={handleDress}
          className="game-btn py-4 px-8 text-xl text-white w-full animate-pulse-glow"
          style={{ background: "linear-gradient(135deg, #FF6B9D, #FF9F43)" }}>
          👗 Одеть! +10 🪙
        </button>
      ) : (
        <div className="w-full text-center bg-amber-50 border-2 border-dashed border-amber-200 rounded-2xl py-4 text-amber-600 font-bold">
          Создай наряд в Мастерской!
        </div>
      )}

      {/* Outfit picker */}
      {player.outfits.length > 0 && (
        <div className="w-full">
          <p className="font-black text-gray-700 mb-2 text-sm">Наряды:</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button onClick={() => updatePlayer({ currentOutfitId: null })}
              className={`item-card flex-shrink-0 p-3 flex flex-col items-center gap-1 min-w-[64px] ${!player.currentOutfitId ? "selected" : ""}`}>
              <span className="text-2xl">❌</span>
              <span className="text-xs font-bold text-gray-400">Снять</span>
            </button>
            {player.outfits.map(o => (
              <button key={o.id} onClick={() => updatePlayer({ currentOutfitId: o.id })}
                className={`item-card flex-shrink-0 p-3 flex flex-col items-center gap-1 min-w-[64px] ${player.currentOutfitId === o.id ? "selected" : ""}`}>
                <span className="text-2xl">{o.emoji}</span>
                <span className="text-xs font-bold text-gray-500 max-w-[60px] text-center leading-tight">{OUTFIT_TYPES.find(t => t.id === o.type)?.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Animal picker */}
      {myAnimals.length > 1 && (
        <div className="w-full">
          <p className="font-black text-gray-700 mb-2 text-sm">Питомцы:</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {ALL_ANIMALS.filter(a => myAnimals.includes(a.id)).map(a => (
              <button key={a.id} onClick={() => updatePlayer({ currentAnimalId: a.id })}
                className={`item-card flex-shrink-0 p-3 flex flex-col items-center gap-1 min-w-[64px] ${player.currentAnimalId === a.id ? "selected" : ""}`}>
                <span className="text-2xl">{a.emoji}</span>
                <span className="text-xs font-bold text-gray-500">{a.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── WORKSHOP TAB ─────────────────────────────────────────────────────────────

function WorkshopTab({ player, updatePlayer }: { player: PlayerData; updatePlayer: (u: Partial<PlayerData>) => void }) {
  const [step, setStep] = useState(0);
  const [material, setMaterial] = useState("");
  const [pattern, setPattern] = useState("");
  const [outfitType, setOutfitType] = useState("");
  const [colors, setColors] = useState<string[]>([]);
  const [crafted, setCrafted] = useState(false);

  const unlockedPatterns = getSavedPatterns(player.name);
  const STEPS = ["Материал", "Паттерн", "Тип", "Цвета", "Верстак"];

  function toggleColor(c: string) {
    if (colors.includes(c)) { setColors(colors.filter(x => x !== c)); return; }
    if (colors.length >= 4) return;
    setColors([...colors, c]);
  }

  function handleCraft() {
    if (!material || !pattern || !outfitType || colors.length === 0) return;
    const typeObj = OUTFIT_TYPES.find(t => t.id === outfitType);
    const patternObj = ALL_PATTERNS.find(p => p.id === pattern);
    const outfit: Outfit = {
      id: Date.now().toString(),
      material, pattern, type: outfitType, colors,
      emoji: typeObj?.emoji || "👗",
      name: makeOutfitName(outfitType, patternObj?.name || pattern, material),
    };
    setCrafted(true);
    updatePlayer({ outfits: [...player.outfits, outfit], currentOutfitId: outfit.id });
    setTimeout(() => {
      setCrafted(false);
      setStep(0); setMaterial(""); setPattern(""); setOutfitType(""); setColors([]);
    }, 2200);
  }

  function reset() { setStep(0); setMaterial(""); setPattern(""); setOutfitType(""); setColors([]); }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="text-center">
        <h2 className="text-3xl font-black text-gray-800" style={{ fontFamily: "Caveat, cursive" }}>🪡 Мастерская</h2>
        <p className="text-gray-500 text-sm font-semibold">Создай уникальный наряд!</p>
      </div>

      {/* Step bar */}
      <div className="flex gap-1 justify-center items-center">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300
              ${i < step ? "text-white" : i === step ? "text-white scale-110" : "text-gray-400 bg-gray-100"}`}
              style={i <= step ? { background: i === step ? "var(--game-pink)" : "var(--game-mint)" } : {}}>
              {i < step ? "✓" : i + 1}
            </div>
            {i < STEPS.length - 1 && <div className={`w-4 h-0.5 rounded ${i < step ? "bg-green-300" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      {/* STEP 0: Material */}
      {step === 0 && (
        <div className="animate-slide-up flex flex-col gap-2">
          <h3 className="font-black text-gray-700 text-lg">Выбери материал:</h3>
          {MATERIALS.map(m => (
            <button key={m} onClick={() => { setMaterial(m); setStep(1); }}
              className="item-card p-4 flex items-center gap-3">
              <span className="text-3xl">{MATERIAL_EMOJIS[m]}</span>
              <span className="font-black text-gray-700 text-lg">{m}</span>
              <span className="ml-auto text-gray-300">→</span>
            </button>
          ))}
        </div>
      )}

      {/* STEP 1: Pattern */}
      {step === 1 && (
        <div className="animate-slide-up">
          <h3 className="font-black text-gray-700 text-lg mb-3">Выбери паттерн:</h3>
          <div className="grid grid-cols-2 gap-2">
            {ALL_PATTERNS.map(p => {
              const unlocked = unlockedPatterns.includes(p.id);
              return (
                <button key={p.id} onClick={() => { if (unlocked) { setPattern(p.id); setStep(2); } }}
                  className={`item-card p-4 flex flex-col items-center gap-1 relative ${!unlocked ? "opacity-50 cursor-not-allowed" : ""} ${pattern === p.id ? "selected" : ""}`}>
                  <span className="text-4xl">{p.symbol}</span>
                  <span className="font-black text-gray-700 text-sm">{p.name}</span>
                  {!unlocked && <span className="absolute top-1 right-1 text-xs font-bold text-gray-400">🔒100🪙</span>}
                </button>
              );
            })}
          </div>
          <button onClick={() => setStep(0)} className="mt-3 text-gray-400 font-bold text-sm">← Назад</button>
        </div>
      )}

      {/* STEP 2: Type */}
      {step === 2 && (
        <div className="animate-slide-up">
          <h3 className="font-black text-gray-700 text-lg mb-3">Что шьём?</h3>
          <div className="grid grid-cols-2 gap-2">
            {OUTFIT_TYPES.map(t => (
              <button key={t.id} onClick={() => { setOutfitType(t.id); setStep(3); }}
                className={`item-card p-4 flex flex-col items-center gap-2 ${outfitType === t.id ? "selected" : ""}`}>
                <span className="text-5xl">{t.emoji}</span>
                <span className="font-black text-gray-700">{t.name}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(1)} className="mt-3 text-gray-400 font-bold text-sm">← Назад</button>
        </div>
      )}

      {/* STEP 3: Colors */}
      {step === 3 && (
        <div className="animate-slide-up">
          <h3 className="font-black text-gray-700 text-lg mb-1">Выбери до 4 цветов:</h3>
          <p className="text-gray-400 text-sm font-semibold mb-3">Выбрано: {colors.length} / 4</p>
          <div className="flex flex-wrap gap-3 justify-center mb-4 p-4 bg-gray-50 rounded-2xl">
            {PALETTE.map(c => (
              <button key={c} onClick={() => toggleColor(c)}
                className="color-swatch"
                style={{
                  background: c,
                  border: colors.includes(c) ? "3px solid #333" : "3px solid rgba(0,0,0,0.1)",
                  transform: colors.includes(c) ? "scale(1.25)" : "scale(1)"
                }} />
            ))}
          </div>
          {colors.length > 0 && (
            <div className="flex gap-2 justify-center mb-3">
              {colors.map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full shadow"
                  style={{ background: c, border: "3px solid rgba(0,0,0,0.15)" }} />
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="text-gray-400 font-bold text-sm px-3">← Назад</button>
            <button disabled={colors.length === 0} onClick={() => setStep(4)}
              className="game-btn py-3 px-6 text-white flex-1 disabled:opacity-40"
              style={{ background: "var(--game-mint)", color: "#1a6b58" }}>
              На верстак →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Craft */}
      {step === 4 && (
        <div className="animate-slide-up">
          <h3 className="font-black text-gray-700 text-lg mb-3">🔨 Верстак</h3>
          <div className="game-card p-6 flex flex-col items-center gap-4">
            {crafted ? (
              <div className="text-center animate-bounce-in py-4">
                <div className="text-7xl mb-2">🎉</div>
                <p className="text-3xl font-black" style={{ color: "var(--game-pink)" }}>Готово!</p>
                <p className="text-gray-500 font-bold mt-1">Наряд создан и надет!</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-2 w-full">
                  <div className="bg-amber-50 rounded-2xl p-3 text-center border-2 border-amber-100">
                    <div className="text-3xl">{MATERIAL_EMOJIS[material]}</div>
                    <div className="text-xs font-black text-amber-700 mt-1">{material}</div>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-3 text-center border-2 border-purple-100">
                    <div className="text-3xl">{ALL_PATTERNS.find(p => p.id === pattern)?.symbol}</div>
                    <div className="text-xs font-black text-purple-700 mt-1">{ALL_PATTERNS.find(p => p.id === pattern)?.name}</div>
                  </div>
                  <div className="bg-pink-50 rounded-2xl p-3 text-center border-2 border-pink-100">
                    <div className="text-3xl">{OUTFIT_TYPES.find(t => t.id === outfitType)?.emoji}</div>
                    <div className="text-xs font-black text-pink-700 mt-1">{OUTFIT_TYPES.find(t => t.id === outfitType)?.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {colors.map((c, i) => (
                    <div key={i} className="w-7 h-7 rounded-full shadow"
                      style={{ background: c, border: "2px solid rgba(0,0,0,0.12)" }} />
                  ))}
                </div>

                <div className="text-center font-black text-gray-700 text-base leading-snug">
                  {OUTFIT_TYPES.find(t => t.id === outfitType)?.emoji}{" "}
                  {makeOutfitName(outfitType, ALL_PATTERNS.find(p => p.id === pattern)?.name || "", material)}
                </div>

                <button onClick={handleCraft}
                  className="game-btn py-4 px-8 text-xl text-white w-full"
                  style={{ background: "linear-gradient(135deg, #FF6B9D, #B96BFF)" }}>
                  ✨ Скрафтить!
                </button>
              </>
            )}
          </div>
          {!crafted && <button onClick={() => setStep(3)} className="mt-3 text-gray-400 font-bold text-sm">← Назад</button>}
        </div>
      )}
    </div>
  );
}

// ─── SHOP TAB ─────────────────────────────────────────────────────────────────

function ShopTab({ player, updatePlayer }: { player: PlayerData; updatePlayer: (u: Partial<PlayerData>) => void }) {
  const [shopTab, setShopTab] = useState<"animals" | "patterns">("animals");
  const [justBought, setJustBought] = useState<string | null>(null);
  const [ownedAnimals, setOwnedAnimals] = useState(getSavedAnimals(player.name));
  const [ownedPatterns, setOwnedPatterns] = useState(getSavedPatterns(player.name));

  function buyAnimal(a: Animal) {
    if (player.coins < a.price || ownedAnimals.includes(a.id)) return;
    saveAnimal(player.name, a.id);
    setOwnedAnimals(getSavedAnimals(player.name));
    updatePlayer({ coins: player.coins - a.price });
    setJustBought(a.id);
    setTimeout(() => setJustBought(null), 1500);
  }

  function buyPattern(p: Pattern) {
    if (player.coins < p.price || ownedPatterns.includes(p.id)) return;
    savePattern(player.name, p.id);
    setOwnedPatterns(getSavedPatterns(player.name));
    updatePlayer({ coins: player.coins - p.price });
    setJustBought(p.id);
    setTimeout(() => setJustBought(null), 1500);
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="text-center">
        <h2 className="text-3xl font-black text-gray-800" style={{ fontFamily: "Caveat, cursive" }}>🛍️ Магазин</h2>
        <div className="coin-badge inline-flex items-center gap-1.5 px-4 py-2 mt-1 text-sm">
          🪙 У тебя: {player.coins} монет
        </div>
      </div>

      <div className="flex gap-2">
        {([
          { id: "animals", label: "🐾 Животные", color: "var(--game-orange)" },
          { id: "patterns", label: "🎨 Паттерны", color: "var(--game-purple)" },
        ] as const).map(t => (
          <button key={t.id} onClick={() => setShopTab(t.id)}
            className={`flex-1 game-btn py-3 text-sm font-black ${shopTab === t.id ? "text-white" : "text-gray-600 bg-white"}`}
            style={shopTab === t.id ? { background: t.color } : {}}>
            {t.label}
          </button>
        ))}
      </div>

      {shopTab === "animals" && (
        <div className="grid grid-cols-2 gap-3 animate-slide-up">
          {ALL_ANIMALS.slice(1).map(a => {
            const owned = ownedAnimals.includes(a.id);
            return (
              <div key={a.id} className={`game-card p-4 flex flex-col items-center gap-2 ${justBought === a.id ? "animate-bounce-in" : ""}`}>
                <span className="text-5xl">{a.emoji}</span>
                <span className="font-black text-gray-700 text-sm text-center">{a.name}</span>
                {owned ? (
                  <div className="bg-green-100 text-green-700 font-black text-xs px-3 py-1 rounded-full">✓ Есть!</div>
                ) : (
                  <button onClick={() => buyAnimal(a)} disabled={player.coins < a.price}
                    className="game-btn py-2 px-4 text-sm text-white w-full disabled:opacity-40"
                    style={{ background: "var(--game-orange)", color: "#5a3000" }}>
                    🪙 {a.price}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {shopTab === "patterns" && (
        <div className="grid grid-cols-2 gap-3 animate-slide-up">
          {ALL_PATTERNS.slice(2).map(p => {
            const owned = ownedPatterns.includes(p.id);
            return (
              <div key={p.id} className={`game-card p-4 flex flex-col items-center gap-2 ${justBought === p.id ? "animate-bounce-in" : ""}`}>
                <span className="text-4xl">{p.symbol}</span>
                <span className="font-black text-gray-700 text-sm">{p.name}</span>
                {owned ? (
                  <div className="bg-green-100 text-green-700 font-black text-xs px-3 py-1 rounded-full">✓ Открыт!</div>
                ) : (
                  <button onClick={() => buyPattern(p)} disabled={player.coins < p.price}
                    className="game-btn py-2 px-4 text-sm text-white w-full disabled:opacity-40"
                    style={{ background: "var(--game-purple)" }}>
                    🪙 {p.price}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── PROFILE TAB ─────────────────────────────────────────────────────────────

function ProfileTab({ player, updatePlayer }: { player: PlayerData; updatePlayer: (u: Partial<PlayerData>) => void }) {
  const ownedAnimals = getSavedAnimals(player.name).length;
  const ownedPatterns = getSavedPatterns(player.name).length;

  function deleteOutfit(id: string) {
    updatePlayer({
      outfits: player.outfits.filter(o => o.id !== id),
      currentOutfitId: player.currentOutfitId === id ? null : player.currentOutfitId
    });
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="text-center">
        <h2 className="text-3xl font-black text-gray-800" style={{ fontFamily: "Caveat, cursive" }}>👤 Профиль</h2>
      </div>

      <div className="game-card p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="text-6xl">{ALL_ANIMALS.find(a => a.id === player.currentAnimalId)?.emoji || "🐱"}</div>
          <div>
            <h3 className="text-2xl font-black text-gray-800">{player.name}</h3>
            <p className="text-gray-500 font-semibold text-sm">Модельер зверят</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Монет", value: player.coins, emoji: "🪙" },
            { label: "Заработано", value: player.totalEarned, emoji: "💰" },
            { label: "Нарядов", value: player.outfits.length, emoji: "👗" },
            { label: "Питомцев", value: ownedAnimals, emoji: "🐾" },
          ].map(s => (
            <div key={s.label} className="bg-gray-50 rounded-2xl p-2 text-center border-2 border-gray-100">
              <div className="text-xl">{s.emoji}</div>
              <div className="text-lg font-black text-gray-800">{s.value}</div>
              <div className="text-xs font-bold text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-black text-gray-700 text-lg mb-3">🎽 Мои наряды ({player.outfits.length})</h3>
        {player.outfits.length === 0 ? (
          <div className="game-card p-8 text-center">
            <div className="text-5xl mb-2">🪡</div>
            <p className="text-gray-400 font-bold">Нарядов пока нет</p>
            <p className="text-gray-400 text-sm">Загляни в Мастерскую!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {player.outfits.map(o => (
              <div key={o.id}
                className={`game-card p-4 flex items-center gap-3 transition-all ${player.currentOutfitId === o.id ? "border-2 border-pink-300" : ""}`}
                style={player.currentOutfitId === o.id ? { background: "#FFF0F5" } : {}}>
                <span className="text-4xl">{o.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-700 text-sm leading-tight truncate">{o.name}</p>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {o.colors.map((c, i) => (
                      <div key={i} className="w-4 h-4 rounded-full"
                        style={{ background: c, border: "2px solid rgba(0,0,0,0.1)" }} />
                    ))}
                  </div>
                </div>
                <button onClick={() => deleteOutfit(o.id)} className="text-gray-300 hover:text-red-400 transition-colors text-xl flex-shrink-0">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── RATING TAB ──────────────────────────────────────────────────────────────

function RatingTab({ player }: { player: PlayerData }) {
  const ratings: { name: string; coins: number; outfits: number }[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key === "koto_player") {
      try {
        const data = JSON.parse(localStorage.getItem(key) || "");
        if (data.name) ratings.push({ name: data.name, coins: data.totalEarned || 0, outfits: data.outfits?.length || 0 });
      } catch (e) { /* ignore */ }
    }
  }

  if (!ratings.find(r => r.name === player.name)) {
    ratings.push({ name: player.name, coins: player.totalEarned || 0, outfits: player.outfits.length });
  }

  ratings.sort((a, b) => b.coins - a.coins || b.outfits - a.outfits);

  const medals = ["🥇", "🥈", "🥉"];
  const bgColors = ["#FFF8E1", "#F5F5F5", "#FFF3E0"];

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="text-center">
        <h2 className="text-3xl font-black text-gray-800" style={{ fontFamily: "Caveat, cursive" }}>🏆 Рейтинг</h2>
        <p className="text-gray-500 text-sm font-semibold">Лучшие модельеры зверят</p>
      </div>

      {ratings.length === 0 || (ratings.length === 1 && ratings[0].name === player.name) ? (
        <div className="game-card p-8 text-center">
          <div className="text-5xl mb-3">🌍</div>
          <p className="font-black text-gray-700">Ты первый на этом устройстве!</p>
          <p className="text-gray-400 text-sm mt-1">Зарабатывай монетки, чтобы попасть в топ</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {ratings.map((r, i) => {
            const isMe = r.name === player.name;
            return (
              <div key={i}
                className={`game-card p-4 flex items-center gap-3 ${isMe ? "border-2 border-pink-300" : ""}`}
                style={{ background: i < 3 ? bgColors[i] : isMe ? "#FFF0F5" : "white" }}>
                <div className="text-3xl w-10 text-center">
                  {i < 3 ? medals[i] : <span className="text-gray-500 font-black text-lg">#{i + 1}</span>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-gray-800">{r.name}</span>
                    {isMe && <span className="text-xs bg-pink-200 text-pink-700 font-black px-2 py-0.5 rounded-full">это ты!</span>}
                  </div>
                  <p className="text-gray-500 text-xs font-semibold">{r.outfits} нарядов создано</p>
                </div>
                <div className="coin-badge flex items-center gap-1 px-3 py-1 text-sm">
                  🪙 {r.coins}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── GAME SCREEN ─────────────────────────────────────────────────────────────

function GameScreen({ player, setPlayer }: { player: PlayerData; setPlayer: (p: PlayerData) => void }) {
  const [tab, setTab] = useState<"home" | "workshop" | "shop" | "profile" | "rating">("home");

  function updatePlayer(updates: Partial<PlayerData>) {
    const updated = { ...player, ...updates };
    setPlayer(updated);
    savePlayer(updated);
  }

  const TABS = [
    { id: "home", label: "Главная", icon: "🏠" },
    { id: "workshop", label: "Мастерская", icon: "🪡" },
    { id: "shop", label: "Магазин", icon: "🛍️" },
    { id: "profile", label: "Профиль", icon: "👤" },
    { id: "rating", label: "Рейтинг", icon: "🏆" },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 sticky top-0 z-10"
        style={{ background: "rgba(255,248,237,0.96)", backdropFilter: "blur(10px)", borderBottom: "2px solid rgba(0,0,0,0.06)" }}>
        <h1 className="text-2xl font-black text-gray-800" style={{ fontFamily: "Caveat, cursive" }}>КотоМода</h1>
        <div className="coin-badge flex items-center gap-1.5 px-4 py-2 text-base">
          <span>🪙</span><span>{player.coins}</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-28">
        {tab === "home" && <HomeTab player={player} updatePlayer={updatePlayer} />}
        {tab === "workshop" && <WorkshopTab player={player} updatePlayer={updatePlayer} />}
        {tab === "shop" && <ShopTab player={player} updatePlayer={updatePlayer} />}
        {tab === "profile" && <ProfileTab player={player} updatePlayer={updatePlayer} />}
        {tab === "rating" && <RatingTab player={player} />}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md px-3 pb-3 z-10">
        <div className="flex justify-around items-center rounded-3xl px-2 py-1.5"
          style={{ background: "rgba(255,248,237,0.97)", backdropFilter: "blur(12px)", border: "2px solid rgba(0,0,0,0.08)", boxShadow: "0 -2px 20px rgba(0,0,0,0.08)" }}>
          {TABS.map(t => (
            <button key={t.id} className={`nav-tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
              <span className="text-2xl">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function Index() {
  const [player, setPlayer] = useState<PlayerData | null>(null);

  function handleLogin(name: string, code: string, isNew: boolean) {
    const existing = loadPlayer();

    if (isNew) {
      const newPlayer: PlayerData = { name, coins: 0, outfits: [], currentAnimalId: "cat", currentOutfitId: null, totalEarned: 0 };
      savePlayer(newPlayer);
      localStorage.setItem(`koto_code_${name}`, code);
      localStorage.setItem(`koto_animals_${name}`, JSON.stringify(["cat"]));
      localStorage.setItem(`koto_patterns_${name}`, JSON.stringify(["plain", "stripes"]));
      setPlayer(newPlayer);
    } else {
      const savedCode = localStorage.getItem(`koto_code_${name}`);
      if (savedCode === code && existing?.name === name) {
        setPlayer(existing);
      } else if (!savedCode && (!existing || existing.name !== name)) {
        const p: PlayerData = { name, coins: 0, outfits: [], currentAnimalId: "cat", currentOutfitId: null, totalEarned: 0 };
        savePlayer(p);
        localStorage.setItem(`koto_code_${name}`, code);
        localStorage.setItem(`koto_animals_${name}`, JSON.stringify(["cat"]));
        localStorage.setItem(`koto_patterns_${name}`, JSON.stringify(["plain", "stripes"]));
        setPlayer(p);
      } else {
        alert("Неверное кодовое слово! Проверь и попробуй снова.");
      }
    }
  }

  if (!player) return <LoginScreen onLogin={handleLogin} />;
  return <GameScreen player={player} setPlayer={setPlayer} />;
}