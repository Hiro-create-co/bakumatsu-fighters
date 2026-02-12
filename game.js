// ============================================================
// 幕末闘伝 - BAKUMATSU FIGHTERS
// HTML5 Canvas Fighting Game
// ============================================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ============================================================
// CONSTANTS
// ============================================================
const SCREEN_W = 960;
const SCREEN_H = 540;
const GROUND_Y = 440;
const GRAVITY = 0.6;
const FRICTION = 0.85;
const ROUND_TIME = 99;
const WINS_NEEDED = 2;

// Game states
const STATE = {
    TITLE: 'title',
    DIFFICULTY: 'difficulty',
    SELECT: 'select',
    ARCADE_MAP: 'arcade_map',
    VS_SCREEN: 'vs_screen',
    FIGHT_INTRO: 'fight_intro',
    FIGHTING: 'fighting',
    ROUND_END: 'round_end',
    MATCH_END: 'match_end',
    ARCADE_ENDING: 'arcade_ending',
    MANUAL: 'manual',
    SETTINGS: 'settings',
    DEMO: 'demo',
};

const DIFFICULTY_LEVELS = [
    { name: '弱い', nameEn: 'EASY', value: 0.15, color: '#4CAF50' },
    { name: '普通', nameEn: 'NORMAL', value: 0.35, color: '#2196F3' },
    { name: '強い', nameEn: 'HARD', value: 0.6, color: '#FF9800' },
    { name: '超強い', nameEn: 'VERY HARD', value: 0.85, color: '#F44336' },
];
let selectedDifficulty = 1; // Default: 普通

// ============================================================
// CHARACTER DEFINITIONS
// ============================================================
const CHARACTERS = [
    {
        id: 'ryoma',
        name: '坂本龍馬',
        nameEn: 'RYOMA SAKAMOTO',
        color: '#4A90D9',
        accentColor: '#2C5FA1',
        description: '海援隊を率いた維新の志士',
        stats: { power: 7, speed: 8, defense: 5 },
        moves: {
            basic: {
                name: '北辰一刀流',
                nameEn: 'Hokushin Ittoryu',
                damage: 8,
                range: 80,
                startup: 4,
                recovery: 8,
                color: '#87CEEB',
            },
            special: {
                name: '船中八策',
                nameEn: 'Senchu Hassaku',
                damage: 18,
                range: 200,
                startup: 10,
                recovery: 20,
                color: '#4169E1',
                isProjectile: true,
                projectileSpeed: 8,
            },
            super: {
                name: '薩長同盟',
                nameEn: 'Satcho Alliance',
                damage: 35,
                range: 300,
                startup: 15,
                recovery: 30,
                color: '#FFD700',
                isSuper: true,
                superCost: 100,
            },
            jump_attack: {
                name: '空中斬り',
                nameEn: 'Aerial Slash',
                damage: 10,
                range: 70,
                startup: 3,
                recovery: 6,
                color: '#87CEEB',
                isJumpAttack: true,
            },
            throw: {
                name: '一本背負い',
                nameEn: 'Ippon Seoi',
                damage: 12,
                range: 65,
                startup: 5,
                recovery: 25,
                color: '#FFD700',
                isThrow: true,
            },
        },
        height: 130,
        width: 70,
        sprites: {
            idle: 'sprites/ryoma/idle.gif',
            attack: 'sprites/ryoma/attack.gif',
            special: 'sprites/ryoma/special.gif',
            super: 'sprites/ryoma/super.gif',
        },
        spriteScale: 0.28,
        spriteOffsetY: 2,
        voice: { pitch: 140, speed: 1.0, intensity: 0.9, formantShift: 0, type: 'aggressive' },
        ending: {
            title: '維新開国',
            subtitle: 'Dawn of a New Japan',
            description: '新たなる日本の夜明けは、此処から始まる！',
        },
    },
    {
        id: 'katsu',
        name: '勝海舟',
        nameEn: 'KATSU KAISHU',
        color: '#2E8B57',
        accentColor: '#1B5E3A',
        description: '江戸無血開城の立役者',
        stats: { power: 5, speed: 6, defense: 9 },
        moves: {
            basic: {
                name: '直心影流',
                nameEn: 'Jikishinkage-ryu',
                damage: 7,
                range: 75,
                startup: 5,
                recovery: 7,
                color: '#90EE90',
            },
            special: {
                name: '咸臨丸',
                nameEn: 'Kanrin Maru',
                damage: 15,
                range: 180,
                startup: 12,
                recovery: 18,
                color: '#006400',
                isProjectile: true,
                projectileSpeed: 6,
            },
            super: {
                name: '江戸無血開城',
                nameEn: 'Bloodless Surrender',
                damage: 30,
                range: 250,
                startup: 18,
                recovery: 35,
                color: '#FFD700',
                isSuper: true,
                superCost: 100,
            },
            jump_attack: {
                name: '空中手刀',
                nameEn: 'Aerial Chop',
                damage: 8,
                range: 65,
                startup: 4,
                recovery: 7,
                color: '#90EE90',
                isJumpAttack: true,
            },
            throw: {
                name: '柔術投げ',
                nameEn: 'Jujutsu Throw',
                damage: 10,
                range: 65,
                startup: 5,
                recovery: 25,
                color: '#FFD700',
                isThrow: true,
            },
        },
        height: 130,
        width: 70,
        sprites: {
            idle: 'sprites/katsu/idle.gif',
            attack: 'sprites/katsu/attack.gif',
            special: 'sprites/katsu/special.gif',
            super: 'sprites/katsu/super.gif',
        },
        spriteScale: 0.28,
        spriteOffsetY: 2,
        voice: { pitch: 160, speed: 0.85, intensity: 0.6, formantShift: 30, type: 'calm' },
        ending: {
            title: '江戸守護',
            subtitle: 'Guardian of Edo',
            description: '百万の民を戦火から守る。それが真の勝利よ。',
        },
    },
    {
        id: 'shoin',
        name: '吉田松陰',
        nameEn: 'YOSHIDA SHOIN',
        color: '#8B4513',
        accentColor: '#5C2D0E',
        description: '松下村塾の創設者',
        stats: { power: 6, speed: 9, defense: 4 },
        moves: {
            basic: {
                name: '至誠の拳',
                nameEn: 'Fist of Sincerity',
                damage: 6,
                range: 70,
                startup: 3,
                recovery: 6,
                color: '#DEB887',
            },
            special: {
                name: '松下村塾',
                nameEn: 'Shoka Sonjuku',
                damage: 20,
                range: 150,
                startup: 8,
                recovery: 15,
                color: '#D2691E',
                isProjectile: true,
                projectileSpeed: 10,
            },
            super: {
                name: '草莽崛起',
                nameEn: 'Rise of Heroes',
                damage: 38,
                range: 280,
                startup: 12,
                recovery: 28,
                color: '#FFD700',
                isSuper: true,
                superCost: 100,
            },
            jump_attack: {
                name: '飛燕脚',
                nameEn: 'Swallow Kick',
                damage: 9,
                range: 65,
                startup: 2,
                recovery: 5,
                color: '#DEB887',
                isJumpAttack: true,
            },
            throw: {
                name: '巴投げ',
                nameEn: 'Tomoe Nage',
                damage: 11,
                range: 65,
                startup: 5,
                recovery: 24,
                color: '#FFD700',
                isThrow: true,
            },
        },
        height: 130,
        width: 70,
        sprites: {
            idle: 'sprites/shoin/idle.gif',
            attack: 'sprites/shoin/attack.gif',
            special: 'sprites/shoin/special.gif',
            super: 'sprites/shoin/super.gif',
        },
        spriteScale: 0.28,
        spriteOffsetY: 2,
        voice: { pitch: 180, speed: 0.9, intensity: 0.5, formantShift: 50, type: 'refined' },
        ending: {
            title: '志士育成',
            subtitle: 'Seeds of Revolution',
            description: '我が志、松下村塾の門下生たちが必ず受け継ぐであろう！',
        },
    },
    {
        id: 'yoshinobu',
        name: '徳川慶喜',
        nameEn: 'TOKUGAWA YOSHINOBU',
        color: '#800080',
        accentColor: '#4B0082',
        description: '最後の征夷大将軍',
        stats: { power: 8, speed: 5, defense: 8 },
        moves: {
            basic: {
                name: '将軍の威光',
                nameEn: "Shogun's Authority",
                damage: 9,
                range: 85,
                startup: 6,
                recovery: 10,
                color: '#DA70D6',
            },
            special: {
                name: '大政奉還',
                nameEn: 'Taisei Hokan',
                damage: 16,
                range: 220,
                startup: 14,
                recovery: 22,
                color: '#9400D3',
                isProjectile: true,
                projectileSpeed: 7,
            },
            super: {
                name: '徳川十五代',
                nameEn: '15 Generations',
                damage: 40,
                range: 320,
                startup: 20,
                recovery: 35,
                color: '#FFD700',
                isSuper: true,
                superCost: 100,
            },
            jump_attack: {
                name: '空中扇打',
                nameEn: 'Aerial Fan Strike',
                damage: 9,
                range: 75,
                startup: 4,
                recovery: 7,
                color: '#DA70D6',
                isJumpAttack: true,
            },
            throw: {
                name: '裏投げ',
                nameEn: 'Ura Nage',
                damage: 11,
                range: 65,
                startup: 6,
                recovery: 26,
                color: '#FFD700',
                isThrow: true,
            },
        },
        height: 130,
        width: 70,
        sprites: {
            idle: 'sprites/yoshinobu/idle.gif',
            attack: 'sprites/yoshinobu/attack.gif',
            special: 'sprites/yoshinobu/special.gif',
            super: 'sprites/yoshinobu/super.gif',
        },
        spriteScale: 0.28,
        spriteOffsetY: 2,
        voice: { pitch: 120, speed: 0.75, intensity: 0.7, formantShift: -20, type: 'authoritative' },
        ending: {
            title: '大政奉還',
            subtitle: 'Return of Imperial Rule',
            description: '戦わずして国を守る。これが最後の将軍の決断である。',
        },
    },
    {
        id: 'saigo',
        name: '西郷隆盛',
        nameEn: 'SAIGO TAKAMORI',
        color: '#DC143C',
        accentColor: '#8B0000',
        description: '維新三傑の一人',
        stats: { power: 10, speed: 4, defense: 7 },
        moves: {
            basic: {
                name: '薩摩示現流',
                nameEn: 'Satsuma Jigen-ryu',
                damage: 11,
                range: 90,
                startup: 7,
                recovery: 12,
                color: '#FF6347',
            },
            special: {
                name: '城山の咆哮',
                nameEn: 'Shiroyama Roar',
                damage: 22,
                range: 160,
                startup: 10,
                recovery: 20,
                color: '#B22222',
                isProjectile: true,
                projectileSpeed: 9,
            },
            super: {
                name: '西南の魂',
                nameEn: 'Spirit of Seinan',
                damage: 45,
                range: 350,
                startup: 22,
                recovery: 38,
                color: '#FFD700',
                isSuper: true,
                superCost: 100,
            },
            jump_attack: {
                name: '空中兜砕き',
                nameEn: 'Aerial Helm Breaker',
                damage: 12,
                range: 80,
                startup: 4,
                recovery: 8,
                color: '#FF6347',
                isJumpAttack: true,
            },
            throw: {
                name: '怒涛投げ',
                nameEn: 'Raging Throw',
                damage: 15,
                range: 65,
                startup: 6,
                recovery: 28,
                color: '#FFD700',
                isThrow: true,
            },
        },
        height: 130,
        width: 70,
        sprites: {
            idle: 'sprites/saigo/idle.gif',
            attack: 'sprites/saigo/attack.gif',
            special: 'sprites/saigo/special.gif',
            super: 'sprites/saigo/super.gif',
        },
        spriteScale: 0.28,
        spriteOffsetY: 2,
        voice: { pitch: 90, speed: 0.7, intensity: 1.0, formantShift: -40, type: 'powerful' },
        ending: {
            title: '敬天愛人',
            subtitle: 'Revere Heaven, Love the People',
            description: '天を敬い、人を愛す。これぞ我が武士の道なり！',
        },
    },
];

// ============================================================
// HAN (DOMAIN) LOCATIONS FOR JAPAN MAP
// ============================================================
const HAN_LOCATIONS = {
    ryoma:     { han: '土佐藩', hanEn: 'Tosa',    x: 530, y: 365, region: 'shikoku' },
    katsu:     { han: '江戸',   hanEn: 'Edo',     x: 705, y: 262, region: 'kanto' },
    shoin:     { han: '長州藩', hanEn: 'Choshu',  x: 370, y: 285, region: 'chugoku' },
    yoshinobu: { han: '水戸藩', hanEn: 'Mito',    x: 728, y: 242, region: 'kanto' },
    saigo:     { han: '薩摩藩', hanEn: 'Satsuma', x: 330, y: 420, region: 'kyushu' },
};

// ============================================================
// SPRITE LOADING SYSTEM
// ============================================================
// GIF sprites are loaded as Image elements. The browser handles
// GIF animation natively - we just drawImage each frame and
// the browser auto-advances the GIF animation.
// To make GIF animation work on canvas, we use an offscreen
// technique: render the GIF in a hidden img element, then
// draw it to canvas each frame.
const spriteCache = {};

function loadSprite(path) {
    if (spriteCache[path]) return spriteCache[path];
    const img = new Image();
    img.src = path;
    spriteCache[path] = img;
    return img;
}

// Preload all character sprites
CHARACTERS.forEach(char => {
    if (char.sprites) {
        Object.values(char.sprites).forEach(path => {
            loadSprite(path);
        });
    }
});

// ============================================================
// INPUT HANDLING
// ============================================================
const keys = {};
const keysPressed = {};

document.addEventListener('keydown', (e) => {
    if (!keys[e.code]) {
        keysPressed[e.code] = true;
    }
    keys[e.code] = true;
    e.preventDefault();
});

document.addEventListener('keyup', (e) => {
    keys[e.code] = false;
    keysPressed[e.code] = false;
    e.preventDefault();
});

function wasPressed(code) {
    if (keysPressed[code]) {
        keysPressed[code] = false;
        return true;
    }
    return false;
}

// ============================================================
// MOBILE TOUCH CONTROLS
// ============================================================
const isMobile = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 1024;

// Virtual pad button definitions (positions set in resizeCanvas)
const touchButtons = [
    // Direction pad (left side)
    { id: 'KeyW', label: 'W',  sublabel: 'JUMP',   x: 0, y: 0, r: 28, color: '#4488FF' },
    { id: 'KeyA', label: 'A',  sublabel: 'LEFT',    x: 0, y: 0, r: 28, color: '#4488FF' },
    { id: 'KeyD', label: 'D',  sublabel: 'RIGHT',   x: 0, y: 0, r: 28, color: '#4488FF' },
    { id: 'KeyS', label: 'S',  sublabel: 'GUARD',   x: 0, y: 0, r: 28, color: '#44AAFF' },
    // Attack buttons (right side)
    { id: 'KeyJ', label: 'J',  sublabel: 'ATK',     x: 0, y: 0, r: 32, color: '#FF4444' },
    { id: 'KeyK', label: 'K',  sublabel: 'SP',      x: 0, y: 0, r: 28, color: '#FFAA00' },
    { id: 'KeyL', label: 'L',  sublabel: 'SUPER',   x: 0, y: 0, r: 28, color: '#FF44FF' },
    { id: 'KeyF', label: 'F',  sublabel: 'THROW',   x: 0, y: 0, r: 26, color: '#44FF44' },
    // System buttons
    { id: 'Enter', label: 'START', sublabel: '',     x: 0, y: 0, r: 22, color: '#FFFFFF' },
];

const touchActiveButtons = new Set(); // Currently pressed button IDs
let canvasScale = 1;
let canvasOffsetX = 0;
let canvasOffsetY = 0;
let PAD_AREA_H = 0; // Height of the virtual pad area below game
let lastTapX = -1; // Last tap position in game coordinates (for menu tap)
let lastTapY = -1;

function layoutTouchButtons() {
    if (!isMobile) return;
    // Scale factor based on pad area height (baseline 160, min 1.0)
    const scale = Math.max(1.0, Math.min(PAD_AREA_H / 160, 2.5));
    const btnR = Math.round(28 * scale);
    const bigBtnR = Math.round(32 * scale);
    const smallBtnR = Math.round(26 * scale);
    const startR = Math.round(22 * scale);

    const padMidY = SCREEN_H + PAD_AREA_H / 2;

    // Direction pad - left side
    const dpadCX = 30 + btnR * 2.5;
    const dpadCY = padMidY;
    const dpadSpread = Math.round(48 * scale);
    touchButtons[0].x = dpadCX;              touchButtons[0].y = dpadCY - dpadSpread; touchButtons[0].r = btnR; // W
    touchButtons[1].x = dpadCX - dpadSpread; touchButtons[1].y = dpadCY;              touchButtons[1].r = btnR; // A
    touchButtons[2].x = dpadCX + dpadSpread; touchButtons[2].y = dpadCY;              touchButtons[2].r = btnR; // D
    touchButtons[3].x = dpadCX;              touchButtons[3].y = dpadCY + dpadSpread; touchButtons[3].r = btnR; // S

    // Attack buttons - right side (diamond layout)
    const atkCX = SCREEN_W - 30 - bigBtnR * 2.5;
    const atkCY = padMidY;
    const atkSpread = Math.round(50 * scale);
    touchButtons[4].x = atkCX - atkSpread;   touchButtons[4].y = atkCY;                    touchButtons[4].r = bigBtnR; // J
    touchButtons[5].x = atkCX;               touchButtons[5].y = atkCY - atkSpread;         touchButtons[5].r = btnR;    // K
    touchButtons[6].x = atkCX + atkSpread;   touchButtons[6].y = atkCY - atkSpread;         touchButtons[6].r = btnR;    // L
    touchButtons[7].x = atkCX;               touchButtons[7].y = atkCY + atkSpread * 0.7;   touchButtons[7].r = smallBtnR; // F

    // Start button - center top of pad area
    touchButtons[8].x = SCREEN_W / 2;       touchButtons[8].y = SCREEN_H + Math.min(30, PAD_AREA_H * 0.15); touchButtons[8].r = startR;
}

let mobileIsPortrait = false; // Track orientation for portrait message

function resizeCanvas() {
    if (isMobile) {
        mobileIsPortrait = window.innerHeight > window.innerWidth;

        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Determine how much height to give the game vs pad
        // Game needs at least SCREEN_H pixels (scaled), pad needs minimum space
        const minPadInternalH = 120; // minimum pad height in internal coords

        // Try width-based scale first
        let scale = vw / SCREEN_W;
        let gameDisplayH = SCREEN_H * scale;
        let padDisplayH = vh - gameDisplayH;

        if (padDisplayH < minPadInternalH * scale) {
            // Not enough room for pad - scale down game to fit both
            // game + pad total internal height should fit in vh
            const totalInternalH = SCREEN_H + minPadInternalH;
            scale = Math.min(vw / SCREEN_W, vh / totalInternalH);
            PAD_AREA_H = minPadInternalH;
        } else {
            // Enough room - pad gets remaining space (in internal coords)
            PAD_AREA_H = padDisplayH / scale;
        }

        canvasScale = scale;
        const totalInternalH = SCREEN_H + PAD_AREA_H;
        canvas.width = SCREEN_W;
        canvas.height = Math.round(totalInternalH);
        canvas.style.width = Math.round(SCREEN_W * scale) + 'px';
        canvas.style.height = Math.round(totalInternalH * scale) + 'px';
        layoutTouchButtons();
    } else {
        const scaleX = window.innerWidth / SCREEN_W;
        const scaleY = window.innerHeight / SCREEN_H;
        canvasScale = Math.min(scaleX, scaleY);
        canvas.style.width = (SCREEN_W * canvasScale) + 'px';
        canvas.style.height = (SCREEN_H * canvasScale) + 'px';
    }

    const rect = canvas.getBoundingClientRect();
    canvasOffsetX = rect.left;
    canvasOffsetY = rect.top;
}

function getTouchCanvasPos(touch) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (touch.clientX - rect.left) / (rect.width / canvas.width),
        y: (touch.clientY - rect.top) / (rect.height / canvas.height)
    };
}

function hitTestButton(pos) {
    for (const btn of touchButtons) {
        const dx = pos.x - btn.x;
        const dy = pos.y - btn.y;
        if (dx * dx + dy * dy < (btn.r + 8) * (btn.r + 8)) {
            return btn;
        }
    }
    return null;
}

if (isMobile) {
    layoutTouchButtons();
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        for (const touch of e.changedTouches) {
            const pos = getTouchCanvasPos(touch);
            // Record tap on game screen area (for menu/select tap)
            if (pos.y < SCREEN_H) {
                lastTapX = pos.x;
                lastTapY = pos.y;
            }
            const btn = hitTestButton(pos);
            if (btn) {
                touchActiveButtons.add(btn.id);
                if (!keys[btn.id]) {
                    keysPressed[btn.id] = true;
                }
                keys[btn.id] = true;
            }
        }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        // Rebuild active set from all current touches
        const newActive = new Set();
        for (const touch of e.touches) {
            const pos = getTouchCanvasPos(touch);
            const btn = hitTestButton(pos);
            if (btn) {
                newActive.add(btn.id);
                if (!keys[btn.id]) {
                    keysPressed[btn.id] = true;
                }
                keys[btn.id] = true;
            }
        }
        // Release buttons no longer touched
        for (const id of touchActiveButtons) {
            if (!newActive.has(id)) {
                keys[id] = false;
                keysPressed[id] = false;
            }
        }
        touchActiveButtons.clear();
        for (const id of newActive) touchActiveButtons.add(id);
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        e.preventDefault();
        // Find which buttons are still being touched
        const stillActive = new Set();
        for (const touch of e.touches) {
            const pos = getTouchCanvasPos(touch);
            const btn = hitTestButton(pos);
            if (btn) stillActive.add(btn.id);
        }
        // Release buttons no longer touched
        for (const id of touchActiveButtons) {
            if (!stillActive.has(id)) {
                keys[id] = false;
                keysPressed[id] = false;
            }
        }
        touchActiveButtons.clear();
        for (const id of stillActive) touchActiveButtons.add(id);
    }, { passive: false });

    canvas.addEventListener('touchcancel', (e) => {
        e.preventDefault();
        for (const id of touchActiveButtons) {
            keys[id] = false;
            keysPressed[id] = false;
        }
        touchActiveButtons.clear();
    }, { passive: false });
}

function drawTouchControls() {
    if (!isMobile) return;

    // Pad background
    ctx.fillStyle = 'rgba(10, 5, 0, 0.95)';
    ctx.fillRect(0, SCREEN_H, SCREEN_W, PAD_AREA_H);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, SCREEN_H);
    ctx.lineTo(SCREEN_W, SCREEN_H);
    ctx.stroke();

    for (const btn of touchButtons) {
        const isPressed = touchActiveButtons.has(btn.id);
        const alpha = isPressed ? 0.8 : 0.35;

        // Button circle
        ctx.beginPath();
        ctx.arc(btn.x, btn.y, btn.r, 0, Math.PI * 2);
        ctx.fillStyle = isPressed
            ? btn.color
            : `rgba(${hexToRgb(btn.color)}, ${alpha})`;
        ctx.fill();
        ctx.strokeStyle = btn.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.fillStyle = isPressed ? '#000' : 'rgba(255,255,255,0.8)';
        ctx.font = `bold ${btn.r * 0.7}px 'Arial Black', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(btn.label, btn.x, btn.y - (btn.sublabel ? 3 : 0));

        // Sub-label
        if (btn.sublabel) {
            ctx.fillStyle = isPressed ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.4)';
            ctx.font = `bold ${Math.max(8, btn.r * 0.32)}px sans-serif`;
            ctx.fillText(btn.sublabel, btn.x, btn.y + btn.r * 0.45);
        }
    }
}

function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r},${g},${b}`;
}

// ============================================================
// SOUND MANAGER (Web Audio API)
// ============================================================
const SoundManager = {
    ctx: null,
    bgmNodes: [],
    bgmGain: null,
    seGain: null,
    voiceGain: null,
    masterGain: null,
    currentBGM: null,
    initialized: false,
    bgmVolume: 0.25,
    seVolume: 0.4,
    voiceVolume: 0.5,
    masterVolume: 1.0,
    muted: false,
    _preMuteVolume: 1.0,

    init() {
        if (this.initialized) return;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            // Master gain → destination
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.value = this.masterVolume;
            this.masterGain.connect(this.ctx.destination);
            // BGM → master
            this.bgmGain = this.ctx.createGain();
            this.bgmGain.gain.value = this.bgmVolume;
            this.bgmGain.connect(this.masterGain);
            // SE → master
            this.seGain = this.ctx.createGain();
            this.seGain.gain.value = this.seVolume;
            this.seGain.connect(this.masterGain);
            // Voice → master
            this.voiceGain = this.ctx.createGain();
            this.voiceGain.gain.value = this.voiceVolume;
            this.voiceGain.connect(this.masterGain);
            this.initialized = true;
        } catch(e) { console.warn('Audio not available:', e); }
    },

    // Volume control methods
    setBgmVolume(v) {
        this.bgmVolume = Math.max(0, Math.min(1, v));
        if (this.bgmGain) this.bgmGain.gain.value = this.bgmVolume;
    },
    setSeVolume(v) {
        this.seVolume = Math.max(0, Math.min(1, v));
        if (this.seGain) this.seGain.gain.value = this.seVolume;
    },
    setVoiceVolume(v) {
        this.voiceVolume = Math.max(0, Math.min(1, v));
        if (this.voiceGain) this.voiceGain.gain.value = this.voiceVolume;
    },
    toggleMute() {
        this.muted = !this.muted;
        if (this.masterGain) {
            if (this.muted) {
                this._preMuteVolume = this.masterVolume;
                this.masterGain.gain.value = 0;
            } else {
                this.masterGain.gain.value = this._preMuteVolume;
            }
        }
        return this.muted;
    },

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    // --- SE (Sound Effects) ---
    _playTone(freq, type, duration, volume, dest) {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.value = volume || 0.3;
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(dest || this.seGain);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + duration);
    },

    _playNoise(duration, volume, dest) {
        if (!this.ctx) return;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        const gain = this.ctx.createGain();
        gain.gain.value = volume || 0.2;
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
        source.connect(gain);
        gain.connect(dest || this.seGain);
        source.start();
    },

    seHit() {
        // パシッ - short sharp hit
        this._playNoise(0.08, 0.35);
        this._playTone(800, 'square', 0.06, 0.2);
        this._playTone(400, 'sawtooth', 0.04, 0.15);
    },

    seSpecialFire() {
        // シュッ - sweep down projectile
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.2);
        gain.gain.value = 0.2;
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(this.seGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
        this._playNoise(0.1, 0.15);
    },

    seSuperActivate() {
        // ドーン - dramatic super activation
        if (!this.ctx) return;
        // Low boom
        this._playTone(80, 'sine', 0.5, 0.4);
        this._playTone(60, 'sine', 0.6, 0.3);
        // High shine
        setTimeout(() => {
            this._playTone(1200, 'sine', 0.3, 0.15);
            this._playTone(1500, 'sine', 0.25, 0.1);
            this._playNoise(0.15, 0.2);
        }, 50);
        // Rising sweep
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2000, this.ctx.currentTime + 0.3);
        gain.gain.value = 0.15;
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(this.seGain);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
    },

    seGuard() {
        // カキン - metallic guard block
        this._playTone(2000, 'square', 0.05, 0.2);
        this._playTone(3000, 'square', 0.03, 0.15);
        this._playTone(1500, 'sine', 0.15, 0.1);
        this._playNoise(0.03, 0.15);
    },

    seHurt() {
        // ドス - dull impact
        this._playTone(120, 'sine', 0.15, 0.3);
        this._playTone(80, 'triangle', 0.1, 0.2);
        this._playNoise(0.05, 0.2);
    },

    seThrow() {
        // Grab/throw sound - low thump + swoosh
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const o = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        o.connect(g);
        g.connect(this.seGain);
        o.frequency.setValueAtTime(150, t);
        o.frequency.exponentialRampToValueAtTime(60, t + 0.15);
        o.type = 'sine';
        g.gain.setValueAtTime(0.3, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
        o.start(t);
        o.stop(t + 0.2);
        this._playNoise(0.08, 0.15);
    },

    seFightStart() {
        // Short fanfare for FIGHT!
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.2, t + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.2);
            osc.connect(gain);
            gain.connect(this.seGain);
            osc.start(t + i * 0.08);
            osc.stop(t + i * 0.08 + 0.25);
        });
    },

    seRoundWin() {
        // Short victory jingle
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const melody = [523, 659, 784, 659, 784, 1047]; // C E G E G C6
        melody.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.18, t + i * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.15);
            osc.connect(gain);
            gain.connect(this.seGain);
            osc.start(t + i * 0.12);
            osc.stop(t + i * 0.12 + 0.2);
        });
    },

    seMatchWin() {
        // Longer victory fanfare
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const melody = [392, 523, 659, 784, 784, 659, 784, 1047]; // G C E G G E G C6
        const durations = [0.15, 0.15, 0.15, 0.15, 0.08, 0.08, 0.15, 0.4];
        let time = 0;
        melody.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.2, t + time);
            gain.gain.exponentialRampToValueAtTime(0.001, t + time + durations[i]);
            osc.connect(gain);
            gain.connect(this.seGain);
            osc.start(t + time);
            osc.stop(t + time + durations[i] + 0.05);
            time += durations[i];
        });
        // Harmony
        this._playTone(262, 'sine', 1.2, 0.08);
        this._playTone(330, 'sine', 1.2, 0.06);
    },

    seGameOver() {
        // Dark descending sound
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const notes = [440, 370, 311, 262, 220]; // A4 F#4 Eb4 C4 A3
        notes.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.18, t + i * 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.2 + 0.3);
            osc.connect(gain);
            gain.connect(this.seGain);
            osc.start(t + i * 0.2);
            osc.stop(t + i * 0.2 + 0.35);
        });
        // Low rumble
        this._playTone(60, 'sine', 1.5, 0.15);
    },

    seEnding() {
        // Triumphant ending melody - Japanese pentatonic celebration
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        // D-pentatonic: D E F# A B
        const melody = [587, 659, 740, 880, 988, 880, 988, 1175]; // D5 E5 F#5 A5 B5 A5 B5 D6
        const durations = [0.2, 0.2, 0.2, 0.3, 0.15, 0.15, 0.2, 0.6];
        let time = 0;
        melody.forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.18, t + time);
            gain.gain.exponentialRampToValueAtTime(0.001, t + time + durations[i]);
            osc.connect(gain);
            gain.connect(this.seGain);
            osc.start(t + time);
            osc.stop(t + time + durations[i] + 0.05);
            time += durations[i];
        });
        // Bass support
        this._playTone(294, 'sine', 2.0, 0.1);
        this._playTone(440, 'sine', 2.0, 0.06);
    },

    seCursor() {
        // ピッ - short blip
        this._playTone(1200, 'square', 0.04, 0.15);
    },

    seConfirm() {
        // ピロン - confirm two-note
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = 'square';
        osc1.frequency.value = 880;
        gain1.gain.setValueAtTime(0.18, t);
        gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc1.connect(gain1);
        gain1.connect(this.seGain);
        osc1.start(t);
        osc1.stop(t + 0.15);

        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = 'square';
        osc2.frequency.value = 1320;
        gain2.gain.setValueAtTime(0.18, t + 0.08);
        gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc2.connect(gain2);
        gain2.connect(this.seGain);
        osc2.start(t + 0.08);
        osc2.stop(t + 0.25);
    },

    // --- VOICE (Formant-based synthesis) ---
    _playVowel(vowel, pitch, duration, volume, formantShift) {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const fs = formantShift || 0;
        // Japanese vowel formant frequencies [F1, F2, F3]
        const formants = {
            'a': [800 + fs, 1200 + fs, 2500 + fs],
            'i': [300 + fs, 2300 + fs, 3000 + fs],
            'u': [350 + fs, 1000 + fs, 2200 + fs],
            'e': [500 + fs, 1800 + fs, 2500 + fs],
            'o': [500 + fs, 900 + fs, 2300 + fs]
        };
        const f = formants[vowel] || formants['a'];

        // F0 source (sawtooth for voiced sound)
        const src = this.ctx.createOscillator();
        src.type = 'sawtooth';
        src.frequency.value = pitch;

        // Create parallel formant filters
        const masterGain = this.ctx.createGain();
        masterGain.gain.setValueAtTime(volume, t);
        masterGain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        masterGain.connect(this.voiceGain || this.seGain);

        f.forEach((freq, i) => {
            const bp = this.ctx.createBiquadFilter();
            bp.type = 'bandpass';
            bp.frequency.value = freq;
            bp.Q.value = 8 + i * 4;
            const fGain = this.ctx.createGain();
            fGain.gain.value = i === 0 ? 1.0 : (i === 1 ? 0.7 : 0.4);
            src.connect(bp);
            bp.connect(fGain);
            fGain.connect(masterGain);
        });

        src.start(t);
        src.stop(t + duration + 0.05);
    },

    _playConsonant(type, duration, volume) {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        // Noise source
        const bufSize = this.ctx.sampleRate * duration;
        const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = this.ctx.createBufferSource();
        noise.buffer = buf;

        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(volume, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        // Different consonant shapes
        switch(type) {
            case 'h': filter.type = 'highpass'; filter.frequency.value = 2000; break;
            case 's': filter.type = 'bandpass'; filter.frequency.value = 6000; filter.Q.value = 2; break;
            case 'f': filter.type = 'highpass'; filter.frequency.value = 3000; break;
            case 't': case 'k': filter.type = 'highpass'; filter.frequency.value = 4000;
                gain.gain.setValueAtTime(volume * 1.5, t);
                gain.gain.exponentialRampToValueAtTime(0.001, t + duration * 0.3); break;
            case 'r': filter.type = 'bandpass'; filter.frequency.value = 1500; filter.Q.value = 3; break;
            default: filter.type = 'highpass'; filter.frequency.value = 2000; break;
        }

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.voiceGain || this.seGain);
        noise.start(t);
        noise.stop(t + duration + 0.05);
    },

    // Announcer "FIGHT!" voice
    voiceFight() {
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        // "F" consonant
        this._playConsonant('f', 0.08, 0.25);
        // "AI" - two vowels
        setTimeout(() => {
            this._playVowel('a', 200, 0.12, 0.35, 0);
            setTimeout(() => {
                this._playVowel('i', 220, 0.08, 0.3, 0);
            }, 100);
        }, 60);
        // "TO"
        setTimeout(() => {
            this._playConsonant('t', 0.04, 0.3);
            setTimeout(() => this._playVowel('o', 180, 0.2, 0.35, 0), 30);
        }, 250);
    },

    // Character attack voice
    voiceAttack(charData, moveType) {
        if (!this.ctx || !charData || !charData.voice) return;
        const v = charData.voice;
        if (moveType === 'special') {
            this._voiceSpecial(v);
        } else if (moveType === 'super') {
            this._voiceSuper(v);
        } else {
            this._voiceGrunt(v);
        }
    },

    // Basic attack grunt: short "Ha!" / "Sei!"
    _voiceGrunt(v) {
        if (!this.ctx) return;
        const p = v.pitch;
        const vol = 0.2 * v.intensity;
        if (v.type === 'refined') {
            // Shoin: "Sei!"
            this._playConsonant('s', 0.04, vol * 0.8);
            setTimeout(() => this._playVowel('e', p * 1.1, 0.08, vol, v.formantShift), 30);
            setTimeout(() => this._playVowel('i', p * 1.2, 0.05, vol * 0.7, v.formantShift), 90);
        } else if (v.type === 'powerful') {
            // Saigo: deep "Ha!"
            this._playConsonant('h', 0.03, vol);
            setTimeout(() => this._playVowel('a', p * 0.9, 0.12, vol * 1.2, v.formantShift), 25);
        } else {
            // Default: "Ha!"
            this._playConsonant('h', 0.03, vol);
            setTimeout(() => this._playVowel('a', p, 0.1, vol, v.formantShift), 25);
        }
    },

    // Special move: "Orya!" / "Seiya!" / "Torya!" / "Uoo!"
    _voiceSpecial(v) {
        if (!this.ctx) return;
        const p = v.pitch;
        const vol = 0.25 * v.intensity;
        if (v.type === 'aggressive') {
            // Ryoma: "Orya!"
            setTimeout(() => this._playVowel('o', p, 0.08, vol, v.formantShift), 0);
            setTimeout(() => {
                this._playConsonant('r', 0.03, vol * 0.6);
                this._playVowel('a', p * 1.15, 0.15, vol * 1.1, v.formantShift);
            }, 80);
        } else if (v.type === 'calm') {
            // Katsu: "Seiya!"
            this._playConsonant('s', 0.04, vol * 0.7);
            setTimeout(() => this._playVowel('e', p, 0.07, vol * 0.8, v.formantShift), 30);
            setTimeout(() => this._playVowel('i', p * 1.1, 0.05, vol * 0.7, v.formantShift), 80);
            setTimeout(() => this._playVowel('a', p * 1.2, 0.12, vol, v.formantShift), 120);
        } else if (v.type === 'refined') {
            // Shoin: "Teyaa!"
            this._playConsonant('t', 0.03, vol * 0.8);
            setTimeout(() => this._playVowel('e', p * 1.05, 0.06, vol * 0.8, v.formantShift), 25);
            setTimeout(() => this._playVowel('a', p * 1.2, 0.18, vol, v.formantShift), 75);
        } else if (v.type === 'authoritative') {
            // Yoshinobu: "Torya!"
            this._playConsonant('t', 0.04, vol);
            setTimeout(() => this._playVowel('o', p, 0.07, vol * 0.8, v.formantShift), 30);
            setTimeout(() => {
                this._playConsonant('r', 0.03, vol * 0.5);
                this._playVowel('a', p * 1.15, 0.15, vol * 1.1, v.formantShift);
            }, 85);
        } else if (v.type === 'powerful') {
            // Saigo: "Uoo!"
            this._playVowel('u', p * 0.9, 0.1, vol, v.formantShift);
            setTimeout(() => this._playVowel('o', p, 0.2, vol * 1.3, v.formantShift), 90);
        }
    },

    // Super move: long dramatic shout
    _voiceSuper(v) {
        if (!this.ctx) return;
        const p = v.pitch;
        const vol = 0.3 * v.intensity;
        if (v.type === 'aggressive') {
            // Ryoma: "Ooryaaa!!"
            this._playVowel('o', p * 0.95, 0.12, vol * 0.8, v.formantShift);
            setTimeout(() => this._playVowel('o', p, 0.08, vol * 0.9, v.formantShift), 100);
            setTimeout(() => {
                this._playConsonant('r', 0.03, vol * 0.5);
                this._playVowel('a', p * 1.2, 0.3, vol * 1.2, v.formantShift);
            }, 170);
        } else if (v.type === 'calm') {
            // Katsu: "Haaaa!"
            this._playConsonant('h', 0.04, vol * 0.8);
            setTimeout(() => this._playVowel('a', p * 1.1, 0.4, vol * 1.1, v.formantShift), 35);
        } else if (v.type === 'refined') {
            // Shoin: "Seiyaaa!"
            this._playConsonant('s', 0.05, vol * 0.7);
            setTimeout(() => this._playVowel('e', p * 1.05, 0.08, vol * 0.8, v.formantShift), 40);
            setTimeout(() => this._playVowel('i', p * 1.1, 0.06, vol * 0.7, v.formantShift), 100);
            setTimeout(() => this._playVowel('a', p * 1.3, 0.35, vol * 1.2, v.formantShift), 150);
        } else if (v.type === 'authoritative') {
            // Yoshinobu: "Hikaee!!"
            this._playConsonant('h', 0.04, vol);
            setTimeout(() => this._playVowel('i', p, 0.1, vol * 0.7, v.formantShift), 30);
            setTimeout(() => {
                this._playConsonant('k', 0.03, vol * 0.8);
                this._playVowel('a', p * 1.05, 0.12, vol * 0.9, v.formantShift);
            }, 110);
            setTimeout(() => this._playVowel('e', p * 1.2, 0.3, vol * 1.2, v.formantShift), 220);
        } else if (v.type === 'powerful') {
            // Saigo: "Doryaaa!!"
            this._playConsonant('t', 0.05, vol * 1.2);
            setTimeout(() => this._playVowel('o', p * 0.9, 0.1, vol, v.formantShift), 40);
            setTimeout(() => {
                this._playConsonant('r', 0.04, vol * 0.6);
                this._playVowel('a', p, 0.4, vol * 1.4, v.formantShift);
            }, 130);
        }
    },

    // Victory voice
    voiceVictory(charData) {
        if (!this.ctx || !charData || !charData.voice) return;
        const v = charData.voice;
        const p = v.pitch;
        const vol = 0.22 * v.intensity;
        // Rising triumphant "Ha!"
        setTimeout(() => {
            this._playConsonant('h', 0.03, vol * 0.8);
            setTimeout(() => this._playVowel('a', p * 1.1, 0.15, vol, v.formantShift), 25);
        }, 200);
        // Second rising note
        setTimeout(() => {
            this._playVowel('a', p * 1.3, 0.25, vol * 1.1, v.formantShift);
        }, 450);
    },

    // Defeat voice - descending painful groan
    voiceDefeat(charData) {
        if (!this.ctx || !charData || !charData.voice) return;
        const v = charData.voice;
        const p = v.pitch;
        const vol = 0.2 * v.intensity;
        // Descending "Uaa..." groan
        const src = this.ctx.createOscillator();
        src.type = 'sawtooth';
        const t = this.ctx.currentTime;
        src.frequency.setValueAtTime(p * 1.1, t);
        src.frequency.linearRampToValueAtTime(p * 0.6, t + 0.5);

        const formantF = [700 + v.formantShift, 1100 + v.formantShift, 2400 + v.formantShift];
        const masterGain = this.ctx.createGain();
        masterGain.gain.setValueAtTime(vol, t);
        masterGain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
        masterGain.connect(this.voiceGain || this.seGain);

        formantF.forEach((freq, i) => {
            const bp = this.ctx.createBiquadFilter();
            bp.type = 'bandpass';
            bp.frequency.value = freq;
            bp.Q.value = 8 + i * 3;
            const fGain = this.ctx.createGain();
            fGain.gain.value = i === 0 ? 1.0 : 0.5;
            src.connect(bp);
            bp.connect(fGain);
            fGain.connect(masterGain);
        });

        src.start(t);
        src.stop(t + 0.6);
    },

    // --- BGM (Background Music) ---
    stopBGM() {
        // Clear all melody loop timeouts
        clearTimeout(this._titleMelodyTimeout);
        clearTimeout(this._titleBassTimeout);
        clearTimeout(this._titleDrumTimeout);
        clearTimeout(this._titleChordTimeout);
        clearTimeout(this._fightBassTimeout);
        clearTimeout(this._fightMelTimeout);
        clearTimeout(this._fightRhythmTimeout);
        clearTimeout(this._fightChordTimeout);
        clearTimeout(this._mapMelTimeout);
        clearTimeout(this._endingMelTimeout);
        this.bgmNodes.forEach(node => {
            try {
                if (node.gain) {
                    node.gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
                }
                setTimeout(() => { try { node.osc.stop(); } catch(e) {} }, 600);
            } catch(e) {}
        });
        this.bgmNodes = [];
        this.currentBGM = null;
    },


    _bgmOsc(freq, type, vol) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.value = vol;
        osc.connect(gain);
        gain.connect(this.bgmGain);
        osc.start();
        this.bgmNodes.push({ osc, gain });
        return { osc, gain };
    },

    playBGM(name, charId) {
        // charId: opponent's character id for fight BGM (SF2 style)
        const bgmKey = (name === 'fight' && charId) ? 'fight_' + charId : name;
        if (!this.ctx || this.currentBGM === bgmKey) return;
        this.stopBGM();
        this.currentBGM = bgmKey;

        switch(name) {
            case 'title': this._bgmTitle(); break;
            case 'fight':
                switch(charId) {
                    case 'ryoma': this._bgmFightRyoma(); break;
                    case 'katsu': this._bgmFightKatsu(); break;
                    case 'shoin': this._bgmFightShoin(); break;
                    case 'yoshinobu': this._bgmFightYoshinobu(); break;
                    case 'saigo': this._bgmFightSaigo(); break;
                    default: this._bgmFight(); break;
                }
                break;
            case 'map': this._bgmMap(); break;
            case 'ending': this._bgmEnding(); break;
        }
    },

    _bgmTitle() {
        // SF2-style aggressive title BGM ~130BPM
        // Heavy bass, power chords, fast lead, kick+hihat drums
        if (!this.ctx) return;
        const bpm = 130;
        const beat = 60 / bpm; // ~0.46s per beat
        const sixteenth = beat / 4;

        // Layer 1: Persistent heavy bass drone (tracked) - subtle foundation
        this._bgmOsc(82.4, 'sawtooth', 0.025);  // E2 heavy bass (subtle)
        this._bgmOsc(164.8, 'square', 0.012);   // E3 octave (subtle)

        // Layer 2: Bass riff loop (16th note pattern, temporary)
        const bassNotes = [82.4, 82.4, 82.4, 0, 110, 110, 82.4, 0,
                           98, 98, 82.4, 0, 73.4, 82.4, 98, 110]; // E2-based riff
        const bassLoopLen = bassNotes.length * sixteenth;

        const playBassLoop = () => {
            if (this.currentBGM !== 'title') return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.connect(gain);
            gain.connect(this.bgmGain);

            bassNotes.forEach((freq, i) => {
                if (freq === 0) {
                    gain.gain.setValueAtTime(0.001, now + i * sixteenth);
                } else {
                    osc.frequency.setValueAtTime(freq, now + i * sixteenth);
                    gain.gain.setValueAtTime(0.065, now + i * sixteenth);
                    gain.gain.setValueAtTime(0.02, now + i * sixteenth + sixteenth * 0.7);
                }
            });
            gain.gain.setValueAtTime(0.001, now + bassLoopLen);
            osc.start(now);
            osc.stop(now + bassLoopLen + 0.1);
            this._titleBassTimeout = setTimeout(playBassLoop, bassLoopLen * 1000 - 50);
        };
        playBassLoop();

        // Layer 3: Power chord stabs (detuned squares, temporary)
        const chordPattern = [
            { notes: [329.6, 392, 493.9], dur: beat },    // E4/G4/B4
            { notes: [0], dur: beat * 0.5 },                // rest
            { notes: [349.2, 440, 523.3], dur: beat * 0.5 },// F4/A4/C5
            { notes: [329.6, 392, 493.9], dur: beat },      // E4/G4/B4
            { notes: [293.7, 370, 440], dur: beat },         // D4/F#4/A4
            { notes: [0], dur: beat * 0.5 },
            { notes: [311.1, 392, 466.2], dur: beat * 0.5 },// Eb4/G4/Bb4
            { notes: [329.6, 392, 493.9], dur: beat },       // E4/G4/B4
        ];
        let chordTotalDur = 0;
        chordPattern.forEach(c => chordTotalDur += c.dur);

        const playChordLoop = () => {
            if (this.currentBGM !== 'title') return;
            const now = this.ctx.currentTime;
            let offset = 0;
            chordPattern.forEach(chord => {
                if (chord.notes[0] !== 0) {
                    chord.notes.forEach((freq, j) => {
                        const osc = this.ctx.createOscillator();
                        const gain = this.ctx.createGain();
                        osc.type = 'square';
                        osc.frequency.value = freq + (j === 1 ? 2 : 0); // slight detune
                        gain.gain.setValueAtTime(0.04, now + offset);
                        gain.gain.exponentialRampToValueAtTime(0.005, now + offset + chord.dur * 0.9);
                        osc.connect(gain);
                        gain.connect(this.bgmGain);
                        osc.start(now + offset);
                        osc.stop(now + offset + chord.dur + 0.05);
                    });
                }
                offset += chord.dur;
            });
            this._titleChordTimeout = setTimeout(playChordLoop, chordTotalDur * 1000 - 50);
        };
        setTimeout(playChordLoop, beat * 1000);

        // Layer 4: Lead melody (aggressive square wave, temporary)
        const melNotes = [659, 784, 880, 784, 659, 587, 659, 784,
                          880, 988, 1047, 988, 880, 784, 659, 587,
                          659, 784, 880, 1047, 988, 880, 784, 880,
                          988, 880, 784, 659, 587, 659, 784, 880];
        const melNoteDur = sixteenth * 2; // 8th notes
        const melLoopLen = melNotes.length * melNoteDur;

        const playMelLoop = () => {
            if (this.currentBGM !== 'title') return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.connect(gain);
            gain.connect(this.bgmGain);

            melNotes.forEach((freq, i) => {
                osc.frequency.setValueAtTime(freq, now + i * melNoteDur);
                gain.gain.setValueAtTime(0.035, now + i * melNoteDur);
                gain.gain.exponentialRampToValueAtTime(0.008, now + i * melNoteDur + melNoteDur * 0.8);
            });
            gain.gain.setValueAtTime(0.001, now + melLoopLen);
            osc.start(now);
            osc.stop(now + melLoopLen + 0.1);
            this._titleMelodyTimeout = setTimeout(playMelLoop, melLoopLen * 1000 - 50);
        };
        setTimeout(playMelLoop, beat * 2 * 1000);

        // Layer 5: Drum pattern (kick + hihat, temporary)
        const drumLoopLen = beat * 4; // 4 beats per loop
        const playDrumLoop = () => {
            if (this.currentBGM !== 'title') return;
            const now = this.ctx.currentTime;
            for (let i = 0; i < 16; i++) {
                const time = now + i * sixteenth;
                // Kick on beats 1 and 3
                if (i % 8 === 0 || i % 8 === 4) {
                    const kick = this.ctx.createOscillator();
                    const kGain = this.ctx.createGain();
                    kick.type = 'sine';
                    kick.frequency.setValueAtTime(150, time);
                    kick.frequency.exponentialRampToValueAtTime(30, time + 0.08);
                    kGain.gain.setValueAtTime(0.15, time);
                    kGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
                    kick.connect(kGain);
                    kGain.connect(this.bgmGain);
                    kick.start(time);
                    kick.stop(time + 0.12);
                }
                // Hihat on every 16th
                const bufSize = Math.floor(this.ctx.sampleRate * 0.03);
                const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
                const d = buf.getChannelData(0);
                for (let j = 0; j < bufSize; j++) d[j] = Math.random() * 2 - 1;
                const hh = this.ctx.createBufferSource();
                hh.buffer = buf;
                const hhF = this.ctx.createBiquadFilter();
                hhF.type = 'highpass';
                hhF.frequency.value = 8000;
                const hhG = this.ctx.createGain();
                hhG.gain.setValueAtTime(i % 4 === 0 ? 0.06 : 0.03, time);
                hhG.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
                hh.connect(hhF);
                hhF.connect(hhG);
                hhG.connect(this.bgmGain);
                hh.start(time);
                hh.stop(time + 0.04);
            }
            this._titleDrumTimeout = setTimeout(playDrumLoop, drumLoopLen * 1000 - 50);
        };
        playDrumLoop();
    },

    _bgmFight() {
        // Generic fallback fighting BGM (used when no charId)
        if (!this.ctx) return;
        const bgm = this.currentBGM;

        const bassPattern = [147, 147, 175, 147, 196, 175, 147, 131];
        const bassNoteDur = 0.25;
        const bassLoopLen = bassPattern.length * bassNoteDur;
        const playBassLoop = () => {
            if (this.currentBGM !== bgm) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.connect(gain); gain.connect(this.bgmGain);
            bassPattern.forEach((freq, i) => {
                osc.frequency.setValueAtTime(freq, now + i * bassNoteDur);
                gain.gain.setValueAtTime(0.08, now + i * bassNoteDur);
                gain.gain.setValueAtTime(0.01, now + i * bassNoteDur + bassNoteDur * 0.6);
            });
            gain.gain.setValueAtTime(0.001, now + bassLoopLen);
            osc.start(now); osc.stop(now + bassLoopLen + 0.1);
            this._fightBassTimeout = setTimeout(playBassLoop, bassLoopLen * 1000 - 50);
        };
        playBassLoop();

        const melodyNotes = [587, 523, 587, 659, 784, 659, 523, 440, 523, 587, 659, 784, 880, 784, 659, 587];
        const melNoteDur = 0.2;
        const melLoopLen = melodyNotes.length * melNoteDur;
        const playMelLoop = () => {
            if (this.currentBGM !== bgm) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.connect(gain); gain.connect(this.bgmGain);
            melodyNotes.forEach((freq, i) => {
                osc.frequency.setValueAtTime(freq, now + i * melNoteDur);
                gain.gain.setValueAtTime(0.04, now + i * melNoteDur);
                gain.gain.exponentialRampToValueAtTime(0.008, now + i * melNoteDur + melNoteDur * 0.7);
            });
            gain.gain.setValueAtTime(0.001, now + melLoopLen);
            osc.start(now); osc.stop(now + melLoopLen + 0.1);
            this._fightMelTimeout = setTimeout(playMelLoop, melLoopLen * 1000 - 50);
        };
        setTimeout(playMelLoop, 200);

        const playRhythmLoop = () => {
            if (this.currentBGM !== bgm) return;
            const now = this.ctx.currentTime;
            for (let i = 0; i < 8; i++) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(80, now + i * 0.25);
                osc.frequency.exponentialRampToValueAtTime(30, now + i * 0.25 + 0.08);
                gain.gain.setValueAtTime(i % 2 === 0 ? 0.12 : 0.06, now + i * 0.25);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.25 + 0.1);
                osc.connect(gain); gain.connect(this.bgmGain);
                osc.start(now + i * 0.25); osc.stop(now + i * 0.25 + 0.12);
            }
            this._fightRhythmTimeout = setTimeout(playRhythmLoop, 2000 - 50);
        };
        playRhythmLoop();
    },

    // ===== CHARACTER-SPECIFIC FIGHT BGMs =====

    _bgmFightRyoma() {
        // 龍馬: ど根性魂 - Aggressive underdog energy ~140BPM
        if (!this.ctx) return;
        const bgm = this.currentBGM;
        const bpm = 140;
        const beat = 60 / bpm;
        const sixteenth = beat / 4;

        // Heavy sawtooth bass drone (tracked) - subtle foundation
        this._bgmOsc(73.4, 'sawtooth', 0.03);  // D2
        this._bgmOsc(146.8, 'square', 0.015);  // D3

        // Aggressive bass riff (temporary)
        const bassNotes = [146.8, 146.8, 146.8, 0, 174.6, 196, 146.8, 0,
                           164.8, 164.8, 146.8, 0, 130.8, 146.8, 174.6, 196]; // D3 riff, climbing
        const bassLoopLen = bassNotes.length * sixteenth;
        const playBassLoop = () => {
            if (this.currentBGM !== bgm) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.connect(gain); gain.connect(this.bgmGain);
            bassNotes.forEach((freq, i) => {
                if (freq === 0) { gain.gain.setValueAtTime(0.001, now + i * sixteenth); }
                else {
                    osc.frequency.setValueAtTime(freq, now + i * sixteenth);
                    gain.gain.setValueAtTime(0.1, now + i * sixteenth);
                    gain.gain.setValueAtTime(0.03, now + i * sixteenth + sixteenth * 0.6);
                }
            });
            gain.gain.setValueAtTime(0.001, now + bassLoopLen);
            osc.start(now); osc.stop(now + bassLoopLen + 0.1);
            this._fightBassTimeout = setTimeout(playBassLoop, bassLoopLen * 1000 - 50);
        };
        playBassLoop();

        // Ascending battle melody (square wave, temporary)
        const melNotes = [587, 659, 784, 880, 784, 659, 587, 523,
                          659, 784, 880, 988, 880, 784, 659, 784,
                          880, 988, 1047, 988, 880, 784, 880, 988,
                          784, 659, 587, 659, 784, 880, 784, 659];
        const melNoteDur = sixteenth * 2;
        const melLoopLen = melNotes.length * melNoteDur;
        const playMelLoop = () => {
            if (this.currentBGM !== bgm) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.connect(gain); gain.connect(this.bgmGain);
            melNotes.forEach((freq, i) => {
                osc.frequency.setValueAtTime(freq, now + i * melNoteDur);
                gain.gain.setValueAtTime(0.04, now + i * melNoteDur);
                gain.gain.exponentialRampToValueAtTime(0.008, now + i * melNoteDur + melNoteDur * 0.75);
            });
            gain.gain.setValueAtTime(0.001, now + melLoopLen);
            osc.start(now); osc.stop(now + melLoopLen + 0.1);
            this._fightMelTimeout = setTimeout(playMelLoop, melLoopLen * 1000 - 50);
        };
        setTimeout(playMelLoop, beat * 1000);

        // Punchy drum pattern
        const drumLoopLen = beat * 4;
        const playDrumLoop = () => {
            if (this.currentBGM !== bgm) return;
            const now = this.ctx.currentTime;
            for (let i = 0; i < 16; i++) {
                const time = now + i * sixteenth;
                if (i % 4 === 0) { // Strong kick on every beat
                    const k = this.ctx.createOscillator(); const kg = this.ctx.createGain();
                    k.type = 'sine';
                    k.frequency.setValueAtTime(160, time);
                    k.frequency.exponentialRampToValueAtTime(35, time + 0.07);
                    kg.gain.setValueAtTime(0.16, time);
                    kg.gain.exponentialRampToValueAtTime(0.001, time + 0.09);
                    k.connect(kg); kg.connect(this.bgmGain);
                    k.start(time); k.stop(time + 0.11);
                }
                if (i % 2 === 0) { // Hihat on 8ths
                    const bs = Math.floor(this.ctx.sampleRate * 0.025);
                    const b = this.ctx.createBuffer(1, bs, this.ctx.sampleRate);
                    const d = b.getChannelData(0);
                    for (let j = 0; j < bs; j++) d[j] = Math.random() * 2 - 1;
                    const hh = this.ctx.createBufferSource(); hh.buffer = b;
                    const hf = this.ctx.createBiquadFilter(); hf.type = 'highpass'; hf.frequency.value = 8000;
                    const hg = this.ctx.createGain();
                    hg.gain.setValueAtTime(0.04, time);
                    hg.gain.exponentialRampToValueAtTime(0.001, time + 0.025);
                    hh.connect(hf); hf.connect(hg); hg.connect(this.bgmGain);
                    hh.start(time); hh.stop(time + 0.03);
                }
            }
            this._fightRhythmTimeout = setTimeout(playDrumLoop, drumLoopLen * 1000 - 50);
        };
        playDrumLoop();
    },

    _bgmFightKatsu() {
        // 海舟: 戦略的緊張感 - Strategic tension, jazz-influenced ~120BPM
        if (!this.ctx) return;
        const bgm = this.currentBGM;
        const bpm = 120;
        const beat = 60 / bpm;
        const eighth = beat / 2;

        // Walking bass drone (tracked) - subtle foundation
        this._bgmOsc(110, 'triangle', 0.02);  // A2
        this._bgmOsc(55, 'sine', 0.02);        // A1 sub

        // Walking bass line (temporary)
        const bassNotes = [110, 123.5, 130.8, 146.8, 164.8, 146.8, 130.8, 123.5,
                           110, 98, 87.3, 98, 110, 130.8, 146.8, 130.8]; // A2 walking
        const bassNoteDur = eighth;
        const bassLoopLen = bassNotes.length * bassNoteDur;
        const playBassLoop = () => {
            if (this.currentBGM !== bgm) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.connect(gain); gain.connect(this.bgmGain);
            bassNotes.forEach((freq, i) => {
                osc.frequency.setValueAtTime(freq, now + i * bassNoteDur);
                gain.gain.setValueAtTime(0.07, now + i * bassNoteDur);
                gain.gain.exponentialRampToValueAtTime(0.02, now + i * bassNoteDur + bassNoteDur * 0.8);
            });
            gain.gain.setValueAtTime(0.001, now + bassLoopLen);
            osc.start(now); osc.stop(now + bassLoopLen + 0.1);
            this._fightBassTimeout = setTimeout(playBassLoop, bassLoopLen * 1000 - 50);
        };
        playBassLoop();

        // Jazz-minor melody (sawtooth, syncopated, temporary)
        const melNotes = [440, 523, 622, 659, 523, 440, 415, 440,
                          523, 622, 659, 784, 659, 622, 523, 440,
                          415, 440, 523, 622, 784, 659, 523, 440,
                          622, 523, 440, 415, 440, 523, 440, 415];
        const melNoteDur = eighth * 1.2; // slightly swung
        const melLoopLen = melNotes.length * melNoteDur;
        const playMelLoop = () => {
            if (this.currentBGM !== bgm) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.connect(gain); gain.connect(this.bgmGain);
            melNotes.forEach((freq, i) => {
                osc.frequency.setValueAtTime(freq, now + i * melNoteDur);
                gain.gain.setValueAtTime(0.03, now + i * melNoteDur);
                gain.gain.exponentialRampToValueAtTime(0.006, now + i * melNoteDur + melNoteDur * 0.7);
            });
            gain.gain.setValueAtTime(0.001, now + melLoopLen);
            osc.start(now); osc.stop(now + melLoopLen + 0.1);
            this._fightMelTimeout = setTimeout(playMelLoop, melLoopLen * 1000 - 50);
        };
        setTimeout(playMelLoop, beat * 1000);

        // Syncopated rim/snare pattern
        const drumLoopLen = beat * 4;
        const playDrumLoop = () => {
            if (this.currentBGM !== bgm) return;
            const now = this.ctx.currentTime;
            // Kick on 1 and 3
            [0, 2].forEach(b => {
                const time = now + b * beat;
                const k = this.ctx.createOscillator(); const kg = this.ctx.createGain();
                k.type = 'sine';
                k.frequency.setValueAtTime(120, time);
                k.frequency.exponentialRampToValueAtTime(30, time + 0.06);
                kg.gain.setValueAtTime(0.1, time);
                kg.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
                k.connect(kg); kg.connect(this.bgmGain);
                k.start(time); k.stop(time + 0.1);
            });
            // Offbeat rimshots (syncopated)
            [1.5, 3.5, 2.75].forEach(b => {
                const time = now + b * beat;
                const bs = Math.floor(this.ctx.sampleRate * 0.015);
                const buf = this.ctx.createBuffer(1, bs, this.ctx.sampleRate);
                const d = buf.getChannelData(0);
                for (let j = 0; j < bs; j++) d[j] = Math.random() * 2 - 1;
                const sn = this.ctx.createBufferSource(); sn.buffer = buf;
                const sf = this.ctx.createBiquadFilter(); sf.type = 'bandpass'; sf.frequency.value = 4000; sf.Q.value = 3;
                const sg = this.ctx.createGain();
                sg.gain.setValueAtTime(0.07, time);
                sg.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
                sn.connect(sf); sf.connect(sg); sg.connect(this.bgmGain);
                sn.start(time); sn.stop(time + 0.03);
            });
            this._fightRhythmTimeout = setTimeout(playDrumLoop, drumLoopLen * 1000 - 50);
        };
        playDrumLoop();
    },

    _bgmFightShoin() {
        // 松陰: 静かなる決意 - Quiet determination, koto-like ~110BPM
        if (!this.ctx) return;
        const bgm = this.currentBGM;
        const bpm = 110;
        const beat = 60 / bpm;
        const eighth = beat / 2;

        // Soft sine bass drone (tracked) - subtle foundation
        this._bgmOsc(164.8, 'sine', 0.02);  // E3
        this._bgmOsc(82.4, 'sine', 0.015);  // E2

        // Gentle bass pattern (temporary)
        const bassNotes = [164.8, 0, 164.8, 196, 0, 220, 196, 0,
                           185, 0, 164.8, 0, 146.8, 164.8, 0, 196];
        const bassNoteDur = eighth;
        const bassLoopLen = bassNotes.length * bassNoteDur;
        const playBassLoop = () => {
            if (this.currentBGM !== bgm) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.connect(gain); gain.connect(this.bgmGain);
            bassNotes.forEach((freq, i) => {
                if (freq === 0) { gain.gain.setValueAtTime(0.001, now + i * bassNoteDur); }
                else {
                    osc.frequency.setValueAtTime(freq, now + i * bassNoteDur);
                    gain.gain.setValueAtTime(0.05, now + i * bassNoteDur);
                    gain.gain.exponentialRampToValueAtTime(0.01, now + i * bassNoteDur + bassNoteDur * 0.8);
                }
            });
            gain.gain.setValueAtTime(0.001, now + bassLoopLen);
            osc.start(now); osc.stop(now + bassLoopLen + 0.1);
            this._fightBassTimeout = setTimeout(playBassLoop, bassLoopLen * 1000 - 50);
        };
        playBassLoop();

        // Koto-like pluck melody (triangle with fast decay, temporary)
        const melNotes = [659, 784, 880, 659, 587, 523, 587, 659,
                          784, 880, 988, 880, 784, 659, 523, 587,
                          659, 784, 659, 587, 523, 587, 659, 784,
                          880, 784, 659, 587, 659, 784, 880, 988];
        const melNoteDur = eighth * 1.1;
        const melLoopLen = melNotes.length * melNoteDur;
        const playMelLoop = () => {
            if (this.currentBGM !== bgm) return;
            const now = this.ctx.currentTime;
            melNotes.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = freq;
                // Fast pluck decay (koto feel)
                gain.gain.setValueAtTime(0.05, now + i * melNoteDur);
                gain.gain.exponentialRampToValueAtTime(0.003, now + i * melNoteDur + melNoteDur * 0.5);
                osc.connect(gain); gain.connect(this.bgmGain);
                osc.start(now + i * melNoteDur);
                osc.stop(now + i * melNoteDur + melNoteDur * 0.7);
            });
            this._fightMelTimeout = setTimeout(playMelLoop, melLoopLen * 1000 - 50);
        };
        setTimeout(playMelLoop, beat * 2 * 1000);

        // Minimal drum (soft kick + woodblock feel)
        const drumLoopLen = beat * 4;
        const playDrumLoop = () => {
            if (this.currentBGM !== bgm) return;
            const now = this.ctx.currentTime;
            [0, 2].forEach(b => {
                const time = now + b * beat;
                const k = this.ctx.createOscillator(); const kg = this.ctx.createGain();
                k.type = 'sine';
                k.frequency.setValueAtTime(100, time);
                k.frequency.exponentialRampToValueAtTime(35, time + 0.05);
                kg.gain.setValueAtTime(0.08, time);
                kg.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
                k.connect(kg); kg.connect(this.bgmGain);
                k.start(time); k.stop(time + 0.08);
            });
            // Woodblock-like clicks
            [1, 3].forEach(b => {
                const time = now + b * beat;
                const wb = this.ctx.createOscillator(); const wg = this.ctx.createGain();
                wb.type = 'sine'; wb.frequency.value = 800;
                wg.gain.setValueAtTime(0.04, time);
                wg.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
                wb.connect(wg); wg.connect(this.bgmGain);
                wb.start(time); wb.stop(time + 0.03);
            });
            this._fightRhythmTimeout = setTimeout(playDrumLoop, drumLoopLen * 1000 - 50);
        };
        playDrumLoop();
    },

    _bgmFightYoshinobu() {
        // 慶喜: 威厳 - Regal authority, gagaku-inspired ~105BPM
        if (!this.ctx) return;
        const bgm = this.currentBGM;
        const bpm = 105;
        const beat = 60 / bpm;
        const eighth = beat / 2;

        // Majestic sawtooth bass (tracked) - subtle foundation
        this._bgmOsc(130.8, 'sawtooth', 0.025); // C3
        this._bgmOsc(65.4, 'sawtooth', 0.02);   // C2

        // Sho-like pad (gagaku organ, tracked - two detuned oscillators)
        const sho1 = this._bgmOsc(523.3, 'sine', 0.012);  // C5
        const sho2 = this._bgmOsc(526, 'sine', 0.012);     // slightly detuned
        const sho3 = this._bgmOsc(659.3, 'sine', 0.008);   // E5

        // Slow stately bass pattern (temporary)
        const bassNotes = [130.8, 130.8, 0, 146.8, 164.8, 146.8, 130.8, 0,
                           123.5, 0, 130.8, 146.8, 0, 164.8, 146.8, 130.8];
        const bassNoteDur = eighth;
        const bassLoopLen = bassNotes.length * bassNoteDur;
        const playBassLoop = () => {
            if (this.currentBGM !== bgm) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.connect(gain); gain.connect(this.bgmGain);
            bassNotes.forEach((freq, i) => {
                if (freq === 0) { gain.gain.setValueAtTime(0.001, now + i * bassNoteDur); }
                else {
                    osc.frequency.setValueAtTime(freq, now + i * bassNoteDur);
                    gain.gain.setValueAtTime(0.07, now + i * bassNoteDur);
                    gain.gain.setValueAtTime(0.02, now + i * bassNoteDur + bassNoteDur * 0.7);
                }
            });
            gain.gain.setValueAtTime(0.001, now + bassLoopLen);
            osc.start(now); osc.stop(now + bassLoopLen + 0.1);
            this._fightBassTimeout = setTimeout(playBassLoop, bassLoopLen * 1000 - 50);
        };
        playBassLoop();

        // Stately fanfare melody (square, regal, temporary)
        const melNotes = [523.3, 659.3, 784, 659.3, 523.3, 440, 523.3, 659.3,
                          784, 880, 784, 659.3, 784, 880, 1047, 880,
                          784, 659.3, 523.3, 440, 523.3, 659.3, 784, 880,
                          659.3, 523.3, 440, 523.3, 659.3, 784, 659.3, 523.3];
        const melNoteDur = eighth * 1.15;
        const melLoopLen = melNotes.length * melNoteDur;
        const playMelLoop = () => {
            if (this.currentBGM !== bgm) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.connect(gain); gain.connect(this.bgmGain);
            melNotes.forEach((freq, i) => {
                osc.frequency.setValueAtTime(freq, now + i * melNoteDur);
                gain.gain.setValueAtTime(0.03, now + i * melNoteDur);
                gain.gain.exponentialRampToValueAtTime(0.008, now + i * melNoteDur + melNoteDur * 0.8);
            });
            gain.gain.setValueAtTime(0.001, now + melLoopLen);
            osc.start(now); osc.stop(now + melLoopLen + 0.1);
            this._fightMelTimeout = setTimeout(playMelLoop, melLoopLen * 1000 - 50);
        };
        setTimeout(playMelLoop, beat * 2 * 1000);

        // Taiko-style drum (deep, authoritative)
        const drumLoopLen = beat * 4;
        const playDrumLoop = () => {
            if (this.currentBGM !== bgm) return;
            const now = this.ctx.currentTime;
            // Deep taiko hits
            [0, 1.5, 2, 3.25].forEach(b => {
                const time = now + b * beat;
                const k = this.ctx.createOscillator(); const kg = this.ctx.createGain();
                k.type = 'sine';
                k.frequency.setValueAtTime(b === 0 ? 100 : 80, time);
                k.frequency.exponentialRampToValueAtTime(25, time + 0.12);
                kg.gain.setValueAtTime(b === 0 ? 0.18 : 0.1, time);
                kg.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
                k.connect(kg); kg.connect(this.bgmGain);
                k.start(time); k.stop(time + 0.18);
            });
            this._fightRhythmTimeout = setTimeout(playDrumLoop, drumLoopLen * 1000 - 50);
        };
        playDrumLoop();
    },

    _bgmFightSaigo() {
        // 隆盛: 圧倒的力 - Overwhelming heavy force ~100BPM
        if (!this.ctx) return;
        const bgm = this.currentBGM;
        const bpm = 100;
        const beat = 60 / bpm;
        const eighth = beat / 2;
        const sixteenth = beat / 4;

        // ULTRA heavy detuned bass (tracked) - powerful but controlled
        this._bgmOsc(55, 'sawtooth', 0.04);    // A1
        this._bgmOsc(56.5, 'sawtooth', 0.03);  // A1 detuned
        this._bgmOsc(110, 'square', 0.015);     // A2

        // Heavy slow bass pattern (temporary)
        const bassNotes = [55, 55, 0, 55, 65.4, 73.4, 55, 0,
                           61.7, 0, 55, 0, 49, 55, 65.4, 55];
        const bassNoteDur = eighth;
        const bassLoopLen = bassNotes.length * bassNoteDur;
        const playBassLoop = () => {
            if (this.currentBGM !== bgm) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sawtooth';
            osc.connect(gain); gain.connect(this.bgmGain);
            bassNotes.forEach((freq, i) => {
                if (freq === 0) { gain.gain.setValueAtTime(0.001, now + i * bassNoteDur); }
                else {
                    osc.frequency.setValueAtTime(freq, now + i * bassNoteDur);
                    gain.gain.setValueAtTime(0.12, now + i * bassNoteDur);
                    gain.gain.setValueAtTime(0.04, now + i * bassNoteDur + bassNoteDur * 0.6);
                }
            });
            gain.gain.setValueAtTime(0.001, now + bassLoopLen);
            osc.start(now); osc.stop(now + bassLoopLen + 0.1);
            this._fightBassTimeout = setTimeout(playBassLoop, bassLoopLen * 1000 - 50);
        };
        playBassLoop();

        // Sparse ominous melody (square, low register, temporary)
        const melNotes = [220, 0, 262, 220, 0, 196, 220, 262,
                          0, 294, 262, 220, 0, 196, 175, 196,
                          220, 262, 294, 0, 262, 220, 196, 0,
                          175, 196, 220, 0, 262, 294, 262, 220];
        const melNoteDur = eighth * 1.2;
        const melLoopLen = melNotes.length * melNoteDur;
        const playMelLoop = () => {
            if (this.currentBGM !== bgm) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.connect(gain); gain.connect(this.bgmGain);
            melNotes.forEach((freq, i) => {
                if (freq === 0) { gain.gain.setValueAtTime(0.001, now + i * melNoteDur); }
                else {
                    osc.frequency.setValueAtTime(freq, now + i * melNoteDur);
                    gain.gain.setValueAtTime(0.035, now + i * melNoteDur);
                    gain.gain.exponentialRampToValueAtTime(0.008, now + i * melNoteDur + melNoteDur * 0.7);
                }
            });
            gain.gain.setValueAtTime(0.001, now + melLoopLen);
            osc.start(now); osc.stop(now + melLoopLen + 0.1);
            this._fightMelTimeout = setTimeout(playMelLoop, melLoopLen * 1000 - 50);
        };
        setTimeout(playMelLoop, beat * 2 * 1000);

        // Super heavy taiko pattern (maximum impact)
        const drumLoopLen = beat * 4;
        const playDrumLoop = () => {
            if (this.currentBGM !== bgm) return;
            const now = this.ctx.currentTime;
            // Massive taiko hits
            [0, 0.75, 1.5, 2, 2.5, 3, 3.5].forEach((b, idx) => {
                const time = now + b * beat;
                const k = this.ctx.createOscillator(); const kg = this.ctx.createGain();
                k.type = 'sine';
                k.frequency.setValueAtTime(idx === 0 ? 120 : 80, time);
                k.frequency.exponentialRampToValueAtTime(20, time + 0.15);
                kg.gain.setValueAtTime(idx === 0 ? 0.22 : (idx === 3 ? 0.18 : 0.12), time);
                kg.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
                k.connect(kg); kg.connect(this.bgmGain);
                k.start(time); k.stop(time + 0.22);
            });
            // Low rumble on beat 1
            const rumble = this.ctx.createOscillator(); const rg = this.ctx.createGain();
            rumble.type = 'sawtooth'; rumble.frequency.value = 35;
            rg.gain.setValueAtTime(0.06, now);
            rg.gain.exponentialRampToValueAtTime(0.001, now + beat);
            rumble.connect(rg); rg.connect(this.bgmGain);
            rumble.start(now); rumble.stop(now + beat + 0.1);

            this._fightRhythmTimeout = setTimeout(playDrumLoop, drumLoopLen * 1000 - 50);
        };
        playDrumLoop();
    },

    _bgmMap() {
        // Travel / map BGM - calm Japanese journey feel
        if (!this.ctx) return;

        // Drone (persistent - tracked)
        this._bgmOsc(147, 'sine', 0.05); // D3
        this._bgmOsc(220, 'sine', 0.03); // A3

        // Gentle melody (D pentatonic - temporary, not tracked)
        const melody = [587, 659, 740, 880, 740, 659, 587, 494, 587, 659, 740, 880, 988, 880, 740, 587];
        const noteDur = 0.6;
        const loopLen = melody.length * noteDur;

        const playLoop = () => {
            if (this.currentBGM !== 'map') return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.connect(gain);
            gain.connect(this.bgmGain);

            melody.forEach((freq, i) => {
                osc.frequency.setValueAtTime(freq, now + i * noteDur);
                gain.gain.setValueAtTime(0.07, now + i * noteDur);
                gain.gain.exponentialRampToValueAtTime(0.015, now + i * noteDur + noteDur * 0.85);
            });
            gain.gain.setValueAtTime(0.001, now + loopLen);
            osc.start(now);
            osc.stop(now + loopLen + 0.1);
            this._mapMelTimeout = setTimeout(playLoop, loopLen * 1000 - 100);
        };
        playLoop();
    },

    _bgmEnding() {
        // Triumphant ending BGM
        if (!this.ctx) return;

        // Major chord drone
        this._bgmOsc(294, 'sine', 0.05); // D4
        this._bgmOsc(370, 'sine', 0.03); // F#4
        this._bgmOsc(440, 'sine', 0.03); // A4

        // Celebratory melody
        const melody = [587, 740, 880, 740, 587, 659, 740, 880, 988, 1175, 988, 880, 740, 880, 988, 1175];
        const noteDur = 0.4;
        const loopLen = melody.length * noteDur;

        const playLoop = () => {
            if (this.currentBGM !== 'ending') return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.connect(gain);
            gain.connect(this.bgmGain);

            melody.forEach((freq, i) => {
                osc.frequency.setValueAtTime(freq, now + i * noteDur);
                gain.gain.setValueAtTime(0.07, now + i * noteDur);
                gain.gain.exponentialRampToValueAtTime(0.015, now + i * noteDur + noteDur * 0.8);
            });
            gain.gain.setValueAtTime(0.001, now + loopLen);
            osc.start(now);
            osc.stop(now + loopLen + 0.1);
            this._endingMelTimeout = setTimeout(playLoop, loopLen * 1000 - 100);
        };
        playLoop();
    },
};

// Initialize audio on first user interaction
document.addEventListener('keydown', function initAudio() {
    SoundManager.init();
    SoundManager.resume();
    document.removeEventListener('keydown', initAudio);
}, { once: false });

// Also try to init on any keydown (re-resume if needed)
document.addEventListener('keydown', () => {
    if (SoundManager.ctx && SoundManager.ctx.state === 'suspended') {
        SoundManager.resume();
    }
});

// ============================================================
// PARTICLE SYSTEM
// ============================================================
class Particle {
    constructor(x, y, vx, vy, color, life, size) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = size || 3;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1;
        this.life--;
    }

    draw() {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.x - this.size / 2,
            this.y - this.size / 2,
            this.size,
            this.size
        );
        ctx.globalAlpha = 1;
    }
}

const particles = [];

function spawnParticles(x, y, color, count, spread) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * spread;
        particles.push(
            new Particle(
                x,
                y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed - 2,
                color,
                20 + Math.random() * 20,
                2 + Math.random() * 4
            )
        );
    }
}

function spawnHitSpark(x, y) {
    const colors = ['#FFF', '#FF0', '#FFA500', '#F00'];
    for (let i = 0; i < 12; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particles.push(
            new Particle(
                x,
                y,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                color,
                10 + Math.random() * 10,
                2 + Math.random() * 3
            )
        );
    }
}

// ============================================================
// PROJECTILE CLASS
// ============================================================
class Projectile {
    constructor(x, y, direction, move, owner) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.speed = move.projectileSpeed || 6;
        this.damage = move.damage;
        this.color = move.color;
        this.owner = owner;
        this.width = 30;
        this.height = 20;
        this.life = 60;
        this.isSuper = move.isSuper || false;
        if (this.isSuper) {
            this.width = 60;
            this.height = 35;
            this.speed = 10;
        }
    }

    update() {
        this.x += this.speed * this.direction;
        this.life--;
        if (this.isSuper && Math.random() < 0.3) {
            spawnParticles(
                this.x - this.direction * 10,
                this.y,
                this.color,
                2,
                2
            );
        }
    }

    draw() {
        ctx.save();
        // Glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.isSuper ? 20 : 10;
        ctx.fillStyle = this.color;

        if (this.isSuper) {
            // Super projectile - larger, more dramatic
            ctx.fillRect(
                this.x - this.width / 2,
                this.y - this.height / 2,
                this.width,
                this.height
            );
            ctx.fillStyle = '#FFF';
            ctx.fillRect(
                this.x - this.width / 4,
                this.y - this.height / 4,
                this.width / 2,
                this.height / 2
            );
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FFF';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.width / 4, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    getHitbox() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height,
        };
    }
}

const projectiles = [];

// ============================================================
// FIGHTER CLASS
// ============================================================
class Fighter {
    constructor(charData, playerNum, x) {
        this.charData = charData;
        this.playerNum = playerNum;
        this.x = x;
        this.y = GROUND_Y;
        this.vx = 0;
        this.vy = 0;
        this.width = charData.width;
        this.height = charData.height;
        this.direction = playerNum === 1 ? 1 : -1;
        this.health = 100;
        this.maxHealth = 100;
        this.super = 0;
        this.maxSuper = 100;

        // State
        this.state = 'idle'; // idle, walk, jump, crouch, attack, hit, block, knockdown, victory, defeat
        this.stateTimer = 0;
        this.currentMove = null;
        this.hasHit = false;
        this.isGrounded = true;
        this.isCrouching = false;
        this.isBlocking = false;
        this.comboCount = 0;
        this.comboTimer = 0;
        this.hitStun = 0;
        this.blockStun = 0;
        this.invincible = 0;
        this.knockdownTimer = 0;
        this.canCancel = false;
        this.cancelWindow = 0;

        // Animation
        this.animFrame = 0;
        this.animTimer = 0;
        this.flashTimer = 0;
        this.shakeX = 0;
        this.shakeY = 0;

        // Wins
        this.wins = 0;
    }

    reset(x) {
        this.x = x;
        this.y = GROUND_Y;
        this.vx = 0;
        this.vy = 0;
        this.health = 100;
        this.super = Math.min(this.super, 100);
        this.state = 'idle';
        this.stateTimer = 0;
        this.currentMove = null;
        this.hasHit = false;
        this.isGrounded = true;
        this.isCrouching = false;
        this.isBlocking = false;
        this.comboCount = 0;
        this.comboTimer = 0;
        this.hitStun = 0;
        this.blockStun = 0;
        this.invincible = 0;
        this.knockdownTimer = 0;
        this.canCancel = false;
        this.cancelWindow = 0;
        this.flashTimer = 0;
        this._collapseProgress = 0;
        this._collapseFallDir = undefined;
    }

    getHitbox() {
        const h = this.isCrouching ? this.height * 0.6 : this.height;
        return {
            x: this.x - this.width / 2,
            y: this.y - h,
            width: this.width,
            height: h,
        };
    }

    getAttackHitbox() {
        if (!this.currentMove || this.state !== 'attack') return null;
        if (this.currentMove.isThrow) return null; // Throws use distance check
        const move = this.currentMove;
        const attackFrame = this.stateTimer;
        if (attackFrame < move.startup || attackFrame > move.startup + 4)
            return null;

        const range = move.range || 80;

        // Jump attack hitbox - angled downward
        if (move.isJumpAttack) {
            return {
                x: this.direction === 1
                    ? this.x + this.width / 2 - range * 0.3
                    : this.x - this.width / 2 - range * 0.7,
                y: this.y - this.height * 0.3,
                width: range,
                height: this.height * 0.6,
            };
        }

        const h = this.isCrouching ? this.height * 0.4 : this.height * 0.5;
        return {
            x:
                this.direction === 1
                    ? this.x + this.width / 2
                    : this.x - this.width / 2 - range,
            y: this.y - this.height * 0.7,
            width: range,
            height: h,
        };
    }

    attack(moveType) {
        // Cancel system: allow cancelling into higher-tier moves on hit
        if (this.state === 'attack') {
            if (!this.canCancel) return;
            // Cancel hierarchy: jump_attack(0) → basic(1) → special(2) → super(3)
            const currentTier = this.currentMove.isSuper ? 3 :
                               (this.currentMove.isProjectile && !this.currentMove.isSuper) ? 2 :
                               this.currentMove.isJumpAttack ? 0 : 1;
            const move = this.charData.moves[moveType];
            if (!move) return;
            const newTier = move.isSuper ? 3 : (move.isProjectile && !move.isSuper) ? 2 : 1;
            if (newTier <= currentTier) return; // Can only cancel into higher tier
            // Cancel visual effect
            spawnParticles(this.x, this.y - this.height * 0.5, '#FFF', 6, 2);
            screenFlash = 3;
        } else {
            if (this.state === 'hit' || this.state === 'knockdown') return;
            if (this.hitStun > 0 || this.blockStun > 0) return;
        }

        const move = this.charData.moves[moveType];
        if (!move) return;

        // Check super cost
        if (move.isSuper && this.super < move.superCost) return;
        if (move.isSuper) {
            this.super -= move.superCost;
            screenShake = 8;
            screenFlash = 10;
            slowMotion = 15;
            SoundManager.seSuperActivate();
        }

        this.state = 'attack';
        this.stateTimer = 0;
        this.currentMove = move;
        this.hasHit = false;
        this.canCancel = false;
        this.cancelWindow = 0;

        // Voice shout
        SoundManager.voiceAttack(this.charData, moveType);

        // Projectile sound effect (spawning is now frame-synced in update())
        if (move.isProjectile && !move.isSuper) {
            SoundManager.seSpecialFire();
        }
        this._projectileSpawned = false;
    }

    jumpAttack() {
        if (this.isGrounded) return;
        if (this.state === 'attack' || this.state === 'hit' || this.state === 'knockdown') return;
        if (this.hitStun > 0 || this.blockStun > 0) return;

        const move = this.charData.moves.jump_attack;
        if (!move) return;

        this.state = 'attack';
        this.stateTimer = 0;
        this.currentMove = move;
        this.hasHit = false;
        this.canCancel = false;
        this.cancelWindow = 0;

        SoundManager.voiceAttack(this.charData, 'basic');
    }

    performThrow(opponent) {
        if (this.state === 'attack' || this.state === 'hit' || this.state === 'knockdown') return false;
        if (this.hitStun > 0 || this.blockStun > 0) return false;
        if (!this.isGrounded) return false;

        const throwMove = this.charData.moves.throw;
        if (!throwMove) return false;

        // Check distance
        const dist = Math.abs(this.x - opponent.x);
        if (dist > throwMove.range) return false;

        // Cannot throw airborne or already hit opponents
        if (!opponent.isGrounded) return false;
        if (opponent.hitStun > 0 || opponent.knockdownTimer > 0) return false;

        this.state = 'attack';
        this.stateTimer = 0;
        this.currentMove = throwMove;
        this.hasHit = false;

        SoundManager.voiceAttack(this.charData, 'basic');
        return true;
    }

    takeDamage(damage, attacker) {
        if (this.invincible > 0) return;

        // Check if blocking
        if (this.isBlocking && this.isGrounded) {
            this.blockStun = 10;
            this.vx = -this.direction * 3;
            spawnParticles(
                this.x + this.direction * 20,
                this.y - this.height / 2,
                '#88F',
                5,
                3
            );
            attacker.super = Math.min(attacker.super + 3, 100);
            this.super = Math.min(this.super + 5, 100);
            SoundManager.seGuard();
            return;
        }

        this.health = Math.max(0, this.health - damage);
        SoundManager.seHurt();
        // Jump attacks cause extra hitstun for combo potential
        this.hitStun = (attacker.currentMove && attacker.currentMove.isJumpAttack) ? 16 : 12;
        this.state = 'hit';
        this.stateTimer = 0;
        this.currentMove = null;
        this.flashTimer = 6;

        // Knockback
        this.vx = -this.direction * (damage > 20 ? 8 : 4);
        this.vy = damage > 20 ? -6 : -2;
        this.isGrounded = false;

        // Big knockdown for super moves
        if (damage >= 30) {
            this.knockdownTimer = 40;
            this.vy = -8;
            screenShake = 12;
            screenFlash = 8;
        } else {
            screenShake = 4;
        }

        // Super meter gain
        attacker.super = Math.min(attacker.super + damage * 0.8, 100);
        this.super = Math.min(this.super + damage * 0.5, 100);

        // Combo
        attacker.comboCount++;
        attacker.comboTimer = 60;

        // Hit effects
        spawnHitSpark(
            this.x + this.direction * 10,
            this.y - this.height / 2
        );
    }

    update(opponent) {
        // Timers
        if (this.hitStun > 0) this.hitStun--;
        if (this.blockStun > 0) this.blockStun--;
        if (this.invincible > 0) this.invincible--;
        if (this.flashTimer > 0) this.flashTimer--;
        if (this.cancelWindow > 0) {
            this.cancelWindow--;
            if (this.cancelWindow === 0) this.canCancel = false;
        }
        if (this.comboTimer > 0) {
            this.comboTimer--;
            if (this.comboTimer === 0) this.comboCount = 0;
        }
        if (this.knockdownTimer > 0) {
            this.knockdownTimer--;
            if (this.knockdownTimer === 0 && this.health > 0) {
                this.state = 'idle';
                this.invincible = 20;
            }
        }

        // Face opponent
        if (this.state !== 'attack' && this.state !== 'hit') {
            this.direction = opponent.x > this.x ? 1 : -1;
        }

        // Attack state update
        if (this.state === 'attack') {
            this.stateTimer++;
            if (this.currentMove) {
                // Frame-synced projectile spawn at startup frame
                if ((this.currentMove.isProjectile || this.currentMove.isSuper) &&
                    !this._projectileSpawned &&
                    this.stateTimer === this.currentMove.startup) {
                    const px = this.x + this.direction * 30;
                    const py = this.y - this.height * 0.5;
                    projectiles.push(
                        new Projectile(px, py, this.direction, this.currentMove, this)
                    );
                    this._projectileSpawned = true;
                }

                const totalFrames =
                    this.currentMove.startup + this.currentMove.recovery;
                if (this.stateTimer >= totalFrames) {
                    this.state = 'idle';
                    this.currentMove = null;
                }
            }
        }

        // Hit state update
        if (this.state === 'hit' && this.hitStun <= 0 && this.isGrounded) {
            if (this.knockdownTimer <= 0) {
                this.state = 'idle';
            }
        }

        // Clear crouching when airborne
        if (!this.isGrounded) {
            this.isCrouching = false;
        }

        // Physics
        if (!this.isGrounded) {
            this.vy += GRAVITY;
            this.y += this.vy;
            if (this.y >= GROUND_Y) {
                this.y = GROUND_Y;
                this.vy = 0;
                this.isGrounded = true;
                // Cancel jump attack on landing with short recovery
                if (this.state === 'attack' && this.currentMove && this.currentMove.isJumpAttack) {
                    this.state = 'idle';
                    this.currentMove = null;
                    this.canCancel = false;
                }
                if (this.knockdownTimer > 0) {
                    screenShake = 3;
                }
            }
        }

        this.x += this.vx;
        this.vx *= FRICTION;

        // Stage boundaries
        this.x = Math.max(30, Math.min(SCREEN_W - 30, this.x));

        // Push apart if overlapping
        const dist = Math.abs(this.x - opponent.x);
        if (dist < this.width * 0.8) {
            const push = (this.width * 0.8 - dist) / 2;
            this.x += this.direction === 1 ? -push : push;
            opponent.x += this.direction === 1 ? push : -push;
        }

        // Animation
        this.animTimer++;
        if (this.animTimer >= 8) {
            this.animTimer = 0;
            this.animFrame = (this.animFrame + 1) % 4;
        }

        // Shake effect decay
        this.shakeX *= 0.8;
        this.shakeY *= 0.8;
    }

    // Determine which sprite animation to use based on current state
    _getSpriteState() {
        if (this.state === 'attack' && this.currentMove) {
            if (this.currentMove.isThrow) return 'throw';
            if (this.currentMove.isJumpAttack) return 'jump_attack';
            if (this.currentMove.isSuper) return 'super';
            if (this.currentMove.isProjectile) return 'special';
            return 'attack';
        }
        if (this.state === 'hit' || this.state === 'knockdown') return 'hit';
        if (this.state === 'walk') return 'walk';
        if (this.state === 'jump' || !this.isGrounded) return 'jump';
        if (this.state === 'victory') return 'victory';
        if (this.state === 'defeat') return 'defeat';
        if (this.isCrouching) return 'crouch';
        if (this.isBlocking) return 'block';
        return 'idle';
    }

    draw() {
        ctx.save();

        const drawX = this.x + this.shakeX;
        const drawY = this.y + this.shakeY;
        const h = this.isCrouching ? this.height * 0.6 : this.height;

        // Flash when hit
        if (this.flashTimer > 0 && this.flashTimer % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }

        // Invincibility flash
        if (this.invincible > 0 && Math.floor(this.invincible / 2) % 2 === 0) {
            ctx.globalAlpha = 0.4;
        }

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x, GROUND_Y + 2, this.width * 0.8, 6, 0, 0, Math.PI * 2);
        ctx.fill();

        // --- CHARACTER RENDERING ---
        // Determine which sprite to use based on current state
        // Falls back to idle sprite if the specific state sprite isn't available
        const spriteState = this._getSpriteState();
        let spritePath = this.charData.sprites && this.charData.sprites[spriteState];
        if (!spritePath && this.charData.sprites) {
            spritePath = this.charData.sprites.idle; // fallback to idle
        }
        const sprite = spritePath ? spriteCache[spritePath] : null;
        const hasSprite = sprite && sprite.complete && sprite.naturalWidth > 0;

        if (hasSprite) {
            // Draw GIF sprite with visual state modifications
            const scale = this.charData.spriteScale || 0.25;
            const offsetY = this.charData.spriteOffsetY || 0;
            const sw = sprite.naturalWidth * scale;
            const sh = sprite.naturalHeight * scale;

            // --- KNOCKDOWN COLLAPSE: Rotate sprite to fall over ---
            const isKOCollapse = this.state === 'knockdown' && this.health <= 0 && this.isGrounded;
            if (isKOCollapse) {
                // Decide fall direction once (1 = forward, -1 = backward)
                if (this._collapseProgress === undefined) this._collapseProgress = 0;
                if (this._collapseFallDir === undefined) this._collapseFallDir = Math.random() < 0.5 ? 1 : -1;
                this._collapseProgress = Math.min(1, this._collapseProgress + 0.04);
                const t = this._collapseProgress;
                // Ease-in for natural fall
                const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
                const angle = eased * (Math.PI / 2) * this._collapseFallDir;

                ctx.save();
                // Pivot from feet
                ctx.translate(drawX, drawY);
                ctx.rotate(angle);
                if (this.direction === -1) {
                    ctx.scale(-1, 1);
                }
                ctx.drawImage(sprite, -sw / 2, -sh + offsetY, sw, sh);
                ctx.restore();
            } else {
                // --- CROUCH: Squish sprite vertically and shift down ---
                const isCrouchVisual = this.isCrouching && this.isGrounded;
                const crouchScaleY = isCrouchVisual ? 0.65 : 1.0;
                const crouchOffsetY = isCrouchVisual ? sh * (1 - crouchScaleY) : 0;

                ctx.save();
                if (this.direction === -1) {
                    ctx.translate(drawX, 0);
                    ctx.scale(-1, 1);
                    if (isCrouchVisual) {
                        ctx.drawImage(sprite, -sw / 2, drawY - sh * crouchScaleY + offsetY, sw, sh * crouchScaleY);
                    } else {
                        ctx.drawImage(sprite, -sw / 2, drawY - sh + offsetY, sw, sh);
                    }
                } else {
                    if (isCrouchVisual) {
                        ctx.drawImage(sprite, drawX - sw / 2, drawY - sh * crouchScaleY + offsetY, sw, sh * crouchScaleY);
                    } else {
                        ctx.drawImage(sprite, drawX - sw / 2, drawY - sh + offsetY, sw, sh);
                    }
                }
                ctx.restore();

                // --- CROUCH VISUAL: Shield effect around character ---
                if (isCrouchVisual) {
                    ctx.save();
                    ctx.strokeStyle = 'rgba(100, 180, 255, 0.6)';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([4, 4]);
                    const shieldW = sw * 0.8;
                    const shieldH = sh * crouchScaleY * 0.9;
                    ctx.strokeRect(drawX - shieldW / 2, drawY - shieldH + offsetY, shieldW, shieldH);
                    ctx.setLineDash([]);
                    // Small crouch indicator text
                    ctx.fillStyle = 'rgba(100, 180, 255, 0.8)';
                    ctx.font = 'bold 10px monospace';
                    ctx.textAlign = 'center';
                    ctx.fillText('GUARD', drawX, drawY - shieldH + offsetY - 4);
                    ctx.restore();
                }
            }

            // --- JUMP ATTACK VISUAL: Slash arc + speed lines ---
            if (this.state === 'attack' && this.currentMove && this.currentMove.isJumpAttack && !this.isGrounded) {
                ctx.save();
                const atkProgress = this.stateTimer / (this.currentMove.startup + 5);
                const moveColor = this.currentMove.color || '#87CEEB';

                // Diagonal slash arc
                if (this.stateTimer >= this.currentMove.startup) {
                    const slashAngle = this.direction === 1 ? -0.5 : Math.PI + 0.5;
                    const slashSize = 40 + atkProgress * 20;
                    ctx.strokeStyle = moveColor;
                    ctx.lineWidth = 3;
                    ctx.shadowColor = moveColor;
                    ctx.shadowBlur = 15;
                    ctx.beginPath();
                    ctx.arc(drawX + this.direction * 20, drawY - sh * 0.5, slashSize,
                        slashAngle - 0.8, slashAngle + 0.8);
                    ctx.stroke();

                    // Inner bright slash
                    ctx.strokeStyle = '#FFF';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(drawX + this.direction * 20, drawY - sh * 0.5, slashSize * 0.8,
                        slashAngle - 0.6, slashAngle + 0.6);
                    ctx.stroke();
                }

                // Speed lines behind character during jump attack
                ctx.globalAlpha = 0.5;
                ctx.strokeStyle = '#FFF';
                ctx.lineWidth = 1;
                for (let i = 0; i < 5; i++) {
                    const lineY = drawY - sh * (0.2 + i * 0.15) + (Math.random() - 0.5) * 4;
                    const lineX = drawX - this.direction * (20 + i * 8);
                    ctx.beginPath();
                    ctx.moveTo(lineX, lineY);
                    ctx.lineTo(lineX - this.direction * (15 + Math.random() * 10), lineY);
                    ctx.stroke();
                }

                ctx.shadowBlur = 0;
                ctx.globalAlpha = 1.0;
                ctx.restore();
            }

            // --- THROW VISUAL: Grab hands + golden energy ring ---
            if (this.state === 'attack' && this.currentMove && this.currentMove.isThrow) {
                ctx.save();
                const throwProgress = Math.min(1, this.stateTimer / (this.currentMove.startup + 3));
                const throwColor = this.currentMove.color || '#FFD700';

                // "投" kanji indicator - always visible during throw
                ctx.fillStyle = 'rgba(255, 215, 0, 0.95)';
                ctx.font = 'bold 22px serif';
                ctx.textAlign = 'center';
                ctx.shadowColor = '#FF8C00';
                ctx.shadowBlur = 12;
                ctx.fillText('投', drawX, drawY - sh - 15);
                ctx.fillText('投', drawX, drawY - sh - 15); // double draw for glow

                // Grabbing hands reaching forward
                const reach = throwProgress * 35;
                const handX = drawX + this.direction * (sw / 2 + reach);
                const handY = drawY - sh * 0.45;

                // Arm extension lines
                ctx.strokeStyle = throwColor;
                ctx.lineWidth = 5;
                ctx.shadowColor = throwColor;
                ctx.shadowBlur = 10;
                ctx.beginPath();
                ctx.moveTo(drawX + this.direction * 12, handY - 3);
                ctx.lineTo(handX, handY - 8);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(drawX + this.direction * 12, handY + 13);
                ctx.lineTo(handX, handY + 18);
                ctx.stroke();

                // Grab clamp circles (hands)
                ctx.fillStyle = throwColor;
                ctx.beginPath();
                ctx.arc(handX, handY - 8, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(handX, handY + 18, 6, 0, Math.PI * 2);
                ctx.fill();

                // Golden energy ring - visible throughout throw
                const ringSize = 30 + Math.sin(this.stateTimer * 0.4) * 10;
                const ringAlpha = 0.5 + throwProgress * 0.4;
                ctx.strokeStyle = `rgba(255, 215, 0, ${ringAlpha})`;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(handX + this.direction * 5, handY + 5, ringSize, 0, Math.PI * 2);
                ctx.stroke();

                // Throw name text
                if (this.stateTimer >= this.currentMove.startup) {
                    ctx.fillStyle = 'rgba(255, 255, 200, 0.9)';
                    ctx.font = 'bold 14px sans-serif';
                    ctx.fillText(this.currentMove.name, drawX, drawY - sh - 35);
                }

                ctx.shadowBlur = 0;
                ctx.restore();
            }

            // Hit flash overlay
            if (this.state === 'hit' && this.flashTimer > 0) {
                ctx.save();
                ctx.globalCompositeOperation = 'source-atop';
                ctx.fillStyle = 'rgba(255,255,255,0.6)';
                if (this.direction === -1) {
                    ctx.translate(drawX, 0);
                    ctx.scale(-1, 1);
                    ctx.fillRect(-sw / 2, drawY - sh + offsetY, sw, sh);
                } else {
                    ctx.fillRect(drawX - sw / 2, drawY - sh + offsetY, sw, sh);
                }
                ctx.restore();
            }
        } else {
            // --- PLACEHOLDER DRAWING (no sprite available) ---
            const bodyColor = this.state === 'hit' ? '#FFF' : this.charData.color;
            const accentColor = this.charData.accentColor;

            // Legs
            const legOffset = this.state === 'walk' ? Math.sin(this.animTimer * 0.5 + this.animFrame) * 4 : 0;
            ctx.fillStyle = '#444';
            ctx.fillRect(drawX - this.width * 0.3 * this.direction - 5, drawY - h * 0.35, 10, h * 0.35 + legOffset);
            ctx.fillRect(drawX + this.width * 0.1 * this.direction - 5, drawY - h * 0.35, 10, h * 0.35 - legOffset);

            // Feet
            ctx.fillStyle = '#333';
            ctx.fillRect(drawX - this.width * 0.3 * this.direction - 6, drawY - 4, 12, 6);
            ctx.fillRect(drawX + this.width * 0.1 * this.direction - 6, drawY - 4, 12, 6);

            // Torso
            ctx.fillStyle = bodyColor;
            const torsoTop = drawY - h;
            const torsoH = h * 0.65;
            ctx.fillRect(drawX - this.width / 2, torsoTop + h * 0.15, this.width, torsoH);

            // Kimono collar
            ctx.fillStyle = accentColor;
            const collarX = drawX - 3 * this.direction;
            ctx.beginPath();
            ctx.moveTo(collarX, torsoTop + h * 0.15);
            ctx.lineTo(collarX + 6 * this.direction, torsoTop + h * 0.5);
            ctx.lineTo(collarX - 6 * this.direction, torsoTop + h * 0.5);
            ctx.closePath();
            ctx.fill();

            // Obi
            ctx.fillStyle = accentColor;
            ctx.fillRect(drawX - this.width / 2, torsoTop + h * 0.55, this.width, 6);

            // Arms
            const armY = torsoTop + h * 0.25;
            ctx.fillStyle = bodyColor;
            if (this.state === 'attack' && this.currentMove) {
                const attackProgress = this.stateTimer / (this.currentMove.startup + 2);
                const reach = Math.min(1, attackProgress) * 25;
                ctx.fillRect(drawX + this.direction * (this.width / 2), armY, this.direction * (15 + reach), 8);
                if (this.stateTimer >= this.currentMove.startup && this.stateTimer <= this.currentMove.startup + 4) {
                    ctx.fillStyle = this.currentMove.color;
                    ctx.shadowColor = this.currentMove.color;
                    ctx.shadowBlur = 10;
                    ctx.fillRect(drawX + this.direction * (this.width / 2 + 15 + reach) - 5, armY - 2, 12, 12);
                    ctx.shadowBlur = 0;
                }
                ctx.fillStyle = bodyColor;
                ctx.fillRect(drawX - this.direction * (this.width / 2 + 5), armY + 5, this.direction * -10, 8);
            } else if (this.state === 'idle') {
                const idleBob = Math.sin(this.animTimer * 0.3 + this.animFrame * 0.5) * 2;
                ctx.fillRect(drawX + this.direction * (this.width / 2 - 5), armY + idleBob, this.direction * 15, 8);
                ctx.fillStyle = '#DEB887';
                ctx.fillRect(drawX + this.direction * (this.width / 2 + 8), armY + idleBob - 1, 7, 7);
                ctx.fillStyle = bodyColor;
                ctx.fillRect(drawX - this.direction * 5, armY + 5 + idleBob, this.direction * -12, 8);
            } else {
                ctx.fillRect(drawX + this.direction * (this.width / 2 - 5), armY, this.direction * 12, 8);
                ctx.fillRect(drawX - this.direction * (this.width / 2 - 5), armY + 5, this.direction * -12, 8);
            }

            // Head
            const headY = torsoTop + h * 0.05;
            const headSize = 18;
            ctx.fillStyle = '#DEB887';
            ctx.fillRect(drawX - headSize / 2, headY, headSize, headSize);
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(drawX - headSize / 2, headY - 2, headSize, 6);
            ctx.fillRect(drawX - 3, headY - 6, 6, 6);
            ctx.fillStyle = '#000';
            ctx.fillRect(drawX + this.direction * 3 - 1, headY + 7, 3, 3);
            ctx.fillRect(drawX + this.direction * 3 + (this.direction === 1 ? -7 : 4), headY + 7, 3, 3);
        }

        // Calculate visual bounds for effects (sprite or placeholder)
        let visualW = this.width;
        let visualH = h;
        if (hasSprite) {
            const scale = this.charData.spriteScale || 0.25;
            visualW = sprite.naturalWidth * scale;
            visualH = sprite.naturalHeight * scale;
        }

        // Knockdown effect - removed ★★★ stars

        // Block effect
        if (this.isBlocking && this.blockStun > 0) {
            ctx.strokeStyle = '#88F';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                drawX - visualW / 2 - 5,
                drawY - visualH - 5,
                visualW + 10,
                visualH + 10
            );
        }

        // Super meter glow when full
        if (this.super >= 100) {
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 15 + Math.sin(Date.now() * 0.01) * 5;
            ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                drawX - visualW / 2 - 3,
                drawY - visualH - 3,
                visualW + 6,
                visualH + 6
            );
            ctx.shadowBlur = 0;
        }

        ctx.restore();
    }
}

// ============================================================
// AI CONTROLLER
// ============================================================
class AIController {
    constructor(difficulty) {
        this.difficulty = difficulty || 0.5; // 0-1
        this.actionTimer = 0;
        this.currentAction = 'idle';
        this.reactionTime = Math.floor(40 - this.difficulty * 30);
        // Idle chance: how often AI does nothing (higher = easier)
        this.idleChance = Math.max(0, 0.4 - this.difficulty * 0.4);
        // Pending jump attack (frame-synced replacement for setTimeout)
        this._jumpAttackDelay = 0;
        this._jumpAttackFighter = null;
    }

    update(fighter, opponent) {
        // Process pending jump attack (frame-synced)
        if (this._jumpAttackDelay > 0) {
            this._jumpAttackDelay--;
            if (this._jumpAttackDelay === 0 && this._jumpAttackFighter) {
                if (!this._jumpAttackFighter.isGrounded) {
                    this._jumpAttackFighter.jumpAttack();
                }
                this._jumpAttackFighter = null;
            }
        }
        // Cancel combos - react to successful hits (priority check)
        if (fighter.state === 'attack' && fighter.canCancel && fighter.cancelWindow > 0) {
            if (Math.random() < this.difficulty * 0.6) {
                if (!fighter.currentMove.isProjectile && !fighter.currentMove.isSuper) {
                    fighter.attack('special');
                    this.actionTimer = 20;
                    return;
                } else if (fighter.currentMove.isProjectile && !fighter.currentMove.isSuper && fighter.super >= 100) {
                    fighter.attack('super');
                    this.actionTimer = 30;
                    return;
                }
            }
        }

        this.actionTimer--;
        if (this.actionTimer > 0) return;

        const dist = Math.abs(fighter.x - opponent.x);
        const rand = Math.random();

        // Sometimes just idle (weaker AI idles more)
        if (rand < this.idleChance) {
            this.actionTimer = 20 + Math.random() * 20;
            fighter.isBlocking = false;
            fighter.isCrouching = false;
            return;
        }

        // React to opponent attacks
        if (opponent.state === 'attack' && dist < 120) {
            if (rand < this.difficulty * 0.7) {
                // Block (crouch + guard)
                fighter.isBlocking = true;
                fighter.isCrouching = true;
                this.actionTimer = 15;
                return;
            }
        } else {
            fighter.isBlocking = false;
            fighter.isCrouching = false;
        }

        // Move speed scales with difficulty
        const moveSpd = 2 + this.difficulty * 2;

        // Choose action based on distance
        if (dist > 250) {
            // Far away - approach, projectile, or jump attack approach
            if (rand < 0.30 + this.difficulty * 0.15 && fighter.isGrounded) {
                // Jump attack approach - high probability for visible AI aggression
                fighter.vy = -11;
                fighter.vx = fighter.direction * 4;
                fighter.isGrounded = false;
                fighter.state = 'jump';
                this._jumpAttackFighter = fighter;
                this._jumpAttackDelay = 11;
                this.actionTimer = 30;
            } else if (rand < 0.45 + this.difficulty * 0.15) {
                fighter.attack('special');
                this.actionTimer = 35 - this.difficulty * 10;
            } else {
                fighter.vx += fighter.direction * moveSpd;
                this.actionTimer = 12 - this.difficulty * 4;
            }
        } else if (dist > 100) {
            // Mid range
            if (rand < 0.25 + this.difficulty * 0.15 && fighter.isGrounded) {
                // Jump attack - frequent at mid range for aggressive feel
                fighter.vy = -10;
                fighter.vx = fighter.direction * 3;
                fighter.isGrounded = false;
                fighter.state = 'jump';
                this._jumpAttackFighter = fighter;
                this._jumpAttackDelay = 9;
                this.actionTimer = 25;
            } else if (rand < 0.35 + this.difficulty * 0.15 && fighter.super >= 100) {
                fighter.attack('super');
                this.actionTimer = 40;
            } else if (rand < 0.4 + this.difficulty * 0.15) {
                fighter.attack('special');
                this.actionTimer = 28 - this.difficulty * 8;
            } else if (rand < 0.6 + this.difficulty * 0.1) {
                fighter.vx += fighter.direction * moveSpd;
                this.actionTimer = 10 - this.difficulty * 3;
            } else {
                this.actionTimer = 15 + Math.random() * 15;
            }
        } else {
            // Close range
            if (opponent.isBlocking && dist < 60 && rand < this.difficulty * 0.4) {
                // Throw when opponent is blocking (guard break)
                fighter.performThrow(opponent);
                this.actionTimer = 25;
            } else if (rand < 0.2 + this.difficulty * 0.2) {
                fighter.attack('basic');
                this.actionTimer = 18 - this.difficulty * 6;
            } else if (rand < 0.3 + this.difficulty * 0.1 && dist < 55) {
                // Random throw attempt
                fighter.performThrow(opponent);
                this.actionTimer = 20;
            } else if (rand < 0.4 + this.difficulty * 0.15 && fighter.super >= 100) {
                fighter.attack('super');
                this.actionTimer = 35;
            } else if (rand < 0.45 + this.difficulty * 0.1) {
                // Jump attack over opponent from close range
                if (fighter.isGrounded) {
                    fighter.vy = -12;
                    fighter.vx = fighter.direction * 2;
                    fighter.isGrounded = false;
                    fighter.state = 'jump';
                    this._jumpAttackFighter = fighter;
                    this._jumpAttackDelay = 10;
                }
                this.actionTimer = 25;
            } else if (rand < 0.55 + this.difficulty * 0.1) {
                // Jump back
                if (fighter.isGrounded) {
                    fighter.vy = -10;
                    fighter.vx = -fighter.direction * 4;
                    fighter.isGrounded = false;
                }
                this.actionTimer = 20;
            } else if (rand < 0.65 + this.difficulty * 0.2) {
                fighter.isBlocking = true;
                fighter.isCrouching = true;
                this.actionTimer = 15 + this.difficulty * 10;
            } else {
                fighter.attack('basic');
                this.actionTimer = 15 - this.difficulty * 5;
            }
        }
    }
}

// ============================================================
// GAME STATE
// ============================================================
let gameState = STATE.TITLE;
let player1 = null;
let player2 = null;
let ai = new AIController(0.4);
let selectedChar1 = 0;
let selectedChar2 = -1; // -1 = not selected yet
let selectingPlayer = 1;
let roundNum = 1;
let timer = ROUND_TIME;
let timerAccum = 0;
let screenShake = 0;
let screenFlash = 0;
let slowMotion = 0;
let koZoom = 1.0;
let koZoomTarget = 1.0;
let koFocusX = SCREEN_W / 2;
let koFocusY = SCREEN_H / 2;
let koStagingTimer = 0;   // KO演出中カウンタ（FIGHTING内でスロー＋ズーム）
let koStaging = false;     // KO演出進行中フラグ
let transitionTimer = 0;
let introText = '';
let introTimer = 0;
let titleAnimFrame = 0;
let settingsSelection = 0; // 0=BGM, 1=SE, 2=Voice, 3=Mute

// Demo play state
let demoTimer = 0;
let demoAI1 = null;
let demoAI2 = null;
let demoRoundTimer = 0;
let demoEndTimer = 0;
let demoState = 'fighting'; // 'fighting' or 'ending'

// Arcade mode state
let arcadeOpponents = [];
let arcadeCurrentIndex = 0;
let arcadeDefeated = [];
let arcadePlayerCharIdx = -1;
let mapAnimTimer = 0;
let mapTravelProgress = 0;
let mapFromLocation = null;
let mapToLocation = null;
let mapShowingIntro = false;

// Manual screen state
let manualCharIndex = 0;

// Ending screen state
let endingTimer = 0;

// ============================================================
// DRAWING HELPERS
// ============================================================
function drawText(text, x, y, size, color, align, stroke) {
    ctx.font = `bold ${size}px 'MS Gothic', monospace`;
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'middle';
    if (stroke) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = size > 20 ? 4 : 2;
        ctx.strokeText(text, x, y);
    }
    ctx.fillStyle = color || '#FFF';
    ctx.fillText(text, x, y);
}

function drawHealthBar(x, y, width, health, maxHealth, isP1) {
    const barH = 20;
    const ratio = health / maxHealth;

    // Background
    ctx.fillStyle = '#333';
    ctx.fillRect(x, y, width, barH);

    // Health gradient
    let healthColor;
    if (ratio > 0.5) healthColor = '#2ECC40';
    else if (ratio > 0.25) healthColor = '#FF851B';
    else healthColor = '#FF4136';

    const hw = width * ratio;
    if (isP1) {
        ctx.fillStyle = healthColor;
        ctx.fillRect(x + width - hw, y + 2, hw, barH - 4);
    } else {
        ctx.fillStyle = healthColor;
        ctx.fillRect(x, y + 2, hw, barH - 4);
    }

    // Damage flash
    if (ratio < 0.9) {
        ctx.fillStyle = 'rgba(255,0,0,0.3)';
        const dmgW = width * (1 - ratio);
        if (isP1) {
            ctx.fillRect(x, y + 2, dmgW, barH - 4);
        } else {
            ctx.fillRect(x + hw, y + 2, dmgW, barH - 4);
        }
    }

    // Border
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, barH);
}

function drawSuperBar(x, y, width, superVal, maxSuper, color) {
    const barH = 8;

    ctx.fillStyle = '#222';
    ctx.fillRect(x, y, width, barH);

    const ratio = superVal / maxSuper;
    if (ratio >= 1) {
        // Full - flash gold
        const flash = Math.sin(Date.now() * 0.01) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(255, 215, 0, ${flash})`;
    } else {
        ctx.fillStyle = color;
    }
    ctx.fillRect(x + 1, y + 1, (width - 2) * ratio, barH - 2);

    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, barH);

    // "SUPER" text when full
    if (ratio >= 1) {
        ctx.font = 'bold 8px monospace';
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'center';
        ctx.fillText('MAX', x + width / 2, y + barH / 2 + 1);
    }
}

function drawBackground() {
    // Sky gradient (dusk/dawn feel for Bakumatsu era)
    const grad = ctx.createLinearGradient(0, 0, 0, SCREEN_H);
    grad.addColorStop(0, '#1a0a2e');
    grad.addColorStop(0.3, '#3d1e6d');
    grad.addColorStop(0.5, '#8b2252');
    grad.addColorStop(0.7, '#c0392b');
    grad.addColorStop(1, '#e67e22');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

    // Moon
    ctx.fillStyle = 'rgba(255, 248, 220, 0.8)';
    ctx.beginPath();
    ctx.arc(760, 80, 35, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255, 248, 220, 0.2)';
    ctx.beginPath();
    ctx.arc(760, 80, 50, 0, Math.PI * 2);
    ctx.fill();

    // Distant mountains
    ctx.fillStyle = '#2c1445';
    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.lineTo(100, 220);
    ctx.lineTo(200, 260);
    ctx.lineTo(350, 190);
    ctx.lineTo(500, 250);
    ctx.lineTo(650, 200);
    ctx.lineTo(800, 230);
    ctx.lineTo(960, 210);
    ctx.lineTo(960, 300);
    ctx.closePath();
    ctx.fill();

    // Castle silhouette (Japanese castle)
    ctx.fillStyle = '#1a0a1e';
    // Castle base
    ctx.fillRect(380, 250, 200, 50);
    // Castle tiers
    ctx.fillRect(400, 220, 160, 30);
    ctx.fillRect(420, 195, 120, 25);
    ctx.fillRect(445, 170, 70, 25);
    ctx.fillRect(465, 155, 30, 15);
    // Roof curves (simplified)
    ctx.beginPath();
    ctx.moveTo(395, 250);
    ctx.lineTo(380, 255);
    ctx.lineTo(580, 255);
    ctx.lineTo(565, 250);
    ctx.fill();

    // Cherry blossom petals (floating)
    ctx.fillStyle = 'rgba(255, 182, 193, 0.6)';
    for (let i = 0; i < 8; i++) {
        const px =
            ((Date.now() * 0.02 + i * 130) % (SCREEN_W + 40)) - 20;
        const py =
            150 +
            Math.sin(Date.now() * 0.001 + i * 2) * 40 +
            i * 25;
        ctx.beginPath();
        ctx.ellipse(px, py, 3, 2, (Date.now() * 0.003 + i) % (Math.PI * 2), 0, Math.PI * 2);
        ctx.fill();
    }

    // Ground
    ctx.fillStyle = '#2c1810';
    ctx.fillRect(0, GROUND_Y + 2, SCREEN_W, SCREEN_H - GROUND_Y);

    // Ground line
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y + 2);
    ctx.lineTo(SCREEN_W, GROUND_Y + 2);
    ctx.stroke();

    // Ground texture
    ctx.fillStyle = '#3a2015';
    for (let i = 0; i < 20; i++) {
        ctx.fillRect(i * 50 + 10, GROUND_Y + 10, 30, 2);
    }
}

// ============================================================
// SCREEN RENDERERS
// ============================================================
// 90s SF2-style pixelated retro text renderer
// Draws text to small offscreen canvas then scales up with nearest-neighbor for pixel look
const _retroTextCache = new Map();
function drawRetroText(text, x, y, size, colors, options) {
    const opt = options || {};
    const depth = opt.depth || 0;
    const pixelScale = opt.pixelScale || 3; // lower = more pixelated

    // Cache key based on text content and visual properties
    const cacheKey = `${text}|${size}|${depth}|${pixelScale}|${colors.fill}|${colors.grad1}|${colors.grad2}|${colors.shadow}|${colors.outline}`;
    let offCanvas = _retroTextCache.get(cacheKey);

    if (!offCanvas) {
        // Render at reduced resolution then scale up
        const smallSize = Math.round(size / pixelScale);
        const padding = smallSize * 2;

        // Create offscreen canvas
        offCanvas = document.createElement('canvas');
        const oc = offCanvas.getContext('2d');

        // Set font on offscreen to measure
        oc.font = `900 ${smallSize}px 'Arial Black', 'Impact', sans-serif`;
        const textW = oc.measureText(text).width;

        offCanvas.width = textW + padding * 2 + depth * 3;
        offCanvas.height = smallSize * 2.5 + depth * 3;

        const tx = padding + depth;
        const ty = smallSize * 1.4;

        oc.font = `900 ${smallSize}px 'Arial Black', 'Impact', sans-serif`;
        oc.textAlign = 'left';
        oc.textBaseline = 'middle';

        // 3D depth layers
        if (depth > 0) {
            for (let d = depth; d > 0; d--) {
                oc.fillStyle = colors.shadow || '#1a0500';
                oc.fillText(text, tx + d, ty + d);
            }
        }

        // Thick outline
        oc.strokeStyle = colors.outline || '#000';
        oc.lineWidth = Math.max(2, smallSize * 0.15);
        oc.lineJoin = 'round';
        oc.strokeText(text, tx, ty);

        // Gradient fill
        if (colors.grad1 && colors.grad2) {
            const g = oc.createLinearGradient(0, ty - smallSize * 0.5, 0, ty + smallSize * 0.5);
            g.addColorStop(0, colors.grad1);
            g.addColorStop(0.35, colors.fill || colors.grad1);
            g.addColorStop(0.65, colors.fill || colors.grad2);
            g.addColorStop(1, colors.grad2);
            oc.fillStyle = g;
        } else {
            oc.fillStyle = colors.fill || '#FFF';
        }
        oc.fillText(text, tx, ty);

        _retroTextCache.set(cacheKey, offCanvas);
    }

    // Blit to main canvas with nearest-neighbor scaling (pixelated!)
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    const destW = offCanvas.width * pixelScale;
    const destH = offCanvas.height * pixelScale;
    const destX = x - destW / 2;
    const destY = y - destH / 2;

    ctx.drawImage(offCanvas, 0, 0, offCanvas.width, offCanvas.height,
                  destX, destY, destW, destH);

    // Glow effect (drawn smoothly on main canvas)
    if (colors.glow) {
        ctx.imageSmoothingEnabled = true;
        ctx.globalAlpha = 0.12 + Math.sin(Date.now() * 0.003) * 0.06;
        ctx.shadowColor = colors.glow;
        ctx.shadowBlur = size * 0.5;
        ctx.drawImage(offCanvas, 0, 0, offCanvas.width, offCanvas.height,
                      destX, destY, destW, destH);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
    }

    ctx.restore();
}

function drawTitleScreen() {
    // Dark background - 90s arcade CRT feel
    const grad = ctx.createLinearGradient(0, 0, 0, SCREEN_H);
    grad.addColorStop(0, '#000000');
    grad.addColorStop(0.35, '#080200');
    grad.addColorStop(0.65, '#100400');
    grad.addColorStop(1, '#000000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

    titleAnimFrame += 0.02;

    // Hot glow behind title (fire-like)
    const glowPulse = 0.18 + Math.sin(titleAnimFrame * 1.5) * 0.06;
    const radGrad = ctx.createRadialGradient(SCREEN_W / 2, 195, 30, SCREEN_W / 2, 210, 300);
    radGrad.addColorStop(0, `rgba(200, 80, 0, ${glowPulse})`);
    radGrad.addColorStop(0.4, `rgba(120, 30, 0, ${glowPulse * 0.5})`);
    radGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

    // CRT scan lines (chunky, 90s feel)
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    for (let sy = 0; sy < SCREEN_H; sy += 2) {
        ctx.fillRect(0, sy, SCREEN_W, 1);
    }

    // Main title: 幕末闘伝 - pixelated 90s arcade text
    const titleY = 155 + Math.sin(titleAnimFrame) * 2;

    drawRetroText('幕末闘伝', SCREEN_W / 2, titleY, 108, {
        fill: '#E8A000',
        grad1: '#FFE060',
        grad2: '#8B4500',
        shadow: '#301000',
        outline: '#000000',
        glow: '#FF5500'
    }, { depth: 6, pixelScale: 3 });

    // Subtitle: BAKUMATSU FIGHTERS - also pixelated
    drawRetroText('BAKUMATSU FIGHTERS', SCREEN_W / 2, titleY + 90, 32, {
        fill: '#DD4400',
        grad1: '#FF8844',
        grad2: '#881100',
        shadow: '#200800',
        outline: '#000000',
        glow: '#FF4400'
    }, { depth: 3, pixelScale: 2 });

    // Decorative pixel line
    const lineY = titleY + 125;
    ctx.fillStyle = '#FF4400';
    for (let lx = SCREEN_W / 2 - 180; lx < SCREEN_W / 2 + 180; lx += 4) {
        const dist = Math.abs(lx - SCREEN_W / 2) / 180;
        const alpha = 1 - dist;
        ctx.globalAlpha = alpha;
        ctx.fillRect(lx, lineY, 3, 2);
    }
    ctx.globalAlpha = 1;

    // PRESS START - classic 90s blinking
    const blink = Math.floor(Date.now() / 500) % 2 === 0; // hard blink, not smooth
    if (blink) {
        const startText = isMobile ? 'TAP TO START' : 'PRESS ENTER TO START';
        drawRetroText(startText, SCREEN_W / 2, 390, 20, {
            fill: '#FFFFFF',
            grad1: '#FFFFFF',
            grad2: '#999999',
            outline: '#000000'
        }, { depth: 1, pixelScale: 2 });
    }

    // Controls info (bottom, pixelated style)
    if (!isMobile) {
    drawRetroText('AD:移動 W:ジャンプ S:しゃがみ/ガード J:攻撃 K:必殺技 L:超必殺 F:投げ', SCREEN_W / 2, 455, 12, {
        fill: '#CCBB99',
        grad1: '#CCBB99',
        grad2: '#AA9977',
        outline: '#222222'
    }, { depth: 1, pixelScale: 1.5 });
    }
    if (!isMobile) {
    drawRetroText('M: ワザ一覧 (MOVE LIST)  N: システム設定 (SETTINGS)', SCREEN_W / 2, 480, 11, {
        fill: '#CCBB99',
        grad1: '#CCBB99',
        grad2: '#997744',
        outline: '#222222'
    }, { depth: 1, pixelScale: 1.5 });
    }

    // Mute indicator (top-right corner, always visible)
    if (SoundManager.muted) {
        drawRetroText('MUTE', SCREEN_W - 50, 20, 10, {
            fill: '#FF4444', outline: '#000'
        }, { depth: 0, pixelScale: 2 });
    }
}

function drawDifficultyScreen() {
    ctx.fillStyle = '#0a0015';
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

    drawText('難易度選択', SCREEN_W / 2, 120, 32, '#FFD700', 'center', true);
    drawText('DIFFICULTY', SCREEN_W / 2, 155, 16, '#AAA', 'center', false);

    const boxW = 160;
    const boxH = 100;
    const gap = 30;
    const totalW = DIFFICULTY_LEVELS.length * boxW + (DIFFICULTY_LEVELS.length - 1) * gap;
    const startX = (SCREEN_W - totalW) / 2;
    const boxY = 220;

    for (let i = 0; i < DIFFICULTY_LEVELS.length; i++) {
        const bx = startX + i * (boxW + gap);
        const diff = DIFFICULTY_LEVELS[i];
        const isSelected = i === selectedDifficulty;

        // Box background
        ctx.fillStyle = isSelected ? diff.color + '33' : '#151525';
        ctx.fillRect(bx, boxY, boxW, boxH);

        // Border
        if (isSelected) {
            ctx.strokeStyle = diff.color;
            ctx.lineWidth = 3;
            ctx.strokeRect(bx - 2, boxY - 2, boxW + 4, boxH + 4);
        } else {
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.strokeRect(bx, boxY, boxW, boxH);
        }

        // Name
        drawText(diff.name, bx + boxW / 2, boxY + 38, 22, isSelected ? diff.color : '#666', 'center', true);
        drawText(diff.nameEn, bx + boxW / 2, boxY + 65, 12, isSelected ? '#CCC' : '#555', 'center', false);
    }

    if (isMobile) {
        drawText('タップで選択 → もう一度タップで決定', SCREEN_W / 2, 400, 16, '#888', 'center', false);
    } else {
        drawText('← → : 選択 / ENTER: 決定 / ESC: 戻る', SCREEN_W / 2, 400, 14, '#666', 'center', false);
    }
}

function drawSelectScreen() {
    // Background
    ctx.fillStyle = '#0a0015';
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

    drawText(
        'キャラクター選択',
        SCREEN_W / 2,
        35,
        28,
        '#FFD700',
        'center',
        true
    );
    drawText(
        'CHARACTER SELECT',
        SCREEN_W / 2,
        60,
        14,
        '#AAA',
        'center',
        false
    );

    // Character cards
    const cardW = 160;
    const cardH = 320;
    const startX = (SCREEN_W - cardW * 5 - 20 * 4) / 2;
    const cardY = 90;

    for (let i = 0; i < CHARACTERS.length; i++) {
        const cx = startX + i * (cardW + 20);
        const char = CHARACTERS[i];
        const isSelected = i === selectedChar1;
        const isP1Pick = false;

        // Card background
        ctx.fillStyle = isSelected ? '#2a1a3e' : '#151525';
        ctx.fillRect(cx, cardY, cardW, cardH);

        // Selected border
        if (isSelected) {
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.strokeRect(cx - 2, cardY - 2, cardW + 4, cardH + 4);
        } else if (isP1Pick) {
            ctx.strokeStyle = '#4A90D9';
            ctx.lineWidth = 2;
            ctx.strokeRect(cx - 1, cardY - 1, cardW + 2, cardH + 2);
        } else {
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            ctx.strokeRect(cx, cardY, cardW, cardH);
        }

        // Character portrait
        const charCenterX = cx + cardW / 2;
        const charY = cardY + 120;

        const idleSpritePath = char.sprites && char.sprites.idle;
        const idleSprite = idleSpritePath ? spriteCache[idleSpritePath] : null;
        const hasIdleSprite = idleSprite && idleSprite.complete && idleSprite.naturalWidth > 0;

        if (hasIdleSprite) {
            // Draw sprite in select screen card
            const selectScale = 0.30;
            const ssw = idleSprite.naturalWidth * selectScale;
            const ssh = idleSprite.naturalHeight * selectScale;
            ctx.drawImage(idleSprite, charCenterX - ssw / 2, cardY + 40, ssw, ssh);
        } else {
            // Placeholder
            ctx.fillStyle = char.color;
            ctx.fillRect(charCenterX - 20, charY - 35, 40, 50);
            ctx.fillStyle = '#DEB887';
            ctx.fillRect(charCenterX - 9, charY - 50, 18, 18);
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(charCenterX - 9, charY - 52, 18, 6);
            ctx.fillRect(charCenterX - 3, charY - 56, 6, 6);
            ctx.fillStyle = '#444';
            ctx.fillRect(charCenterX - 12, charY + 15, 10, 25);
            ctx.fillRect(charCenterX + 2, charY + 15, 10, 25);
        }

        // P1 marker
        if (isP1Pick) {
            drawText('1P', cx + 15, cardY + 15, 14, '#4A90D9', 'center', true);
        }

        // Name
        drawText(
            char.name,
            charCenterX,
            cardY + cardH - 100,
            16,
            '#FFF',
            'center',
            true
        );
        drawText(
            char.nameEn,
            charCenterX,
            cardY + cardH - 78,
            10,
            '#AAA',
            'center',
            false
        );

        // Stats
        const statsY = cardY + cardH - 60;
        const statsX = cx + 15;
        drawText('攻', statsX, statsY, 10, '#F88', 'left', false);
        drawStatBar(statsX + 18, statsY - 4, 50, char.stats.power, '#F44');
        drawText('速', statsX, statsY + 16, 10, '#8F8', 'left', false);
        drawStatBar(statsX + 18, statsY + 12, 50, char.stats.speed, '#4F4');
        drawText('防', statsX, statsY + 32, 10, '#88F', 'left', false);
        drawStatBar(statsX + 18, statsY + 28, 50, char.stats.defense, '#44F');
    }

    // Description of selected character
    const selIdx = selectedChar1;
    if (selIdx >= 0 && selIdx < CHARACTERS.length) {
        const char = CHARACTERS[selIdx];
        drawText(
            char.description,
            SCREEN_W / 2,
            cardY + cardH + 30,
            14,
            '#CCC',
            'center',
            false
        );

        // Move names
        const movesY = cardY + cardH + 55;
        drawText(
            `基本技: ${char.moves.basic.name}  |  必殺技: ${char.moves.special.name}  |  超必殺: ${char.moves.super.name}`,
            SCREEN_W / 2,
            movesY,
            12,
            '#999',
            'center',
            false
        );
    }

    // Player indicator
    drawText('1P SELECT', SCREEN_W / 2, SCREEN_H - 15, 16, '#4A90D9', 'center', true);

    if (isMobile) {
        drawText(
            'タップで選択 → もう一度タップで決定',
            SCREEN_W / 2,
            SCREEN_H - 35,
            14,
            '#888',
            'center',
            false
        );
    } else {
        drawText(
            '← → : 選択 / ENTER: 決定',
            SCREEN_W / 2,
            SCREEN_H - 35,
            12,
            '#666',
            'center',
            false
        );
    }
}

function drawStatBar(x, y, width, value, color) {
    ctx.fillStyle = '#333';
    ctx.fillRect(x, y, width, 8);
    ctx.fillStyle = color;
    ctx.fillRect(x, y, (width * value) / 10, 8);
}

// ============================================================
// MOVE MANUAL SCREEN
// ============================================================
function drawMoveCard(x, y, w, h, keyLabel, jpLabel, enLabel, move, isSuper) {
    // Card background
    ctx.fillStyle = isSuper ? '#1a1525' : '#151525';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = isSuper ? '#FFD700' : '#333';
    ctx.lineWidth = isSuper ? 2 : 1;
    ctx.strokeRect(x, y, w, h);

    // Key icon (circular badge)
    const keyX = x + 35;
    const keyY = y + h / 2;
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(keyX, keyY, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(keyX, keyY, 20, 0, Math.PI * 2);
    ctx.stroke();
    drawText(keyLabel, keyX, keyY, 22, '#FFD700', 'center', true);

    // Move type label
    drawText(jpLabel, x + 75, y + 22, 13, '#AAA', 'left', false);
    drawText(enLabel, x + 75 + jpLabel.length * 14 + 8, y + 22, 10, '#555', 'left', false);

    // Move name
    drawText(move.name, x + 75, y + 50, 20, move.color, 'left', true);
    drawText(move.nameEn, x + 75 + move.name.length * 22 + 12, y + 50, 11, '#888', 'left', false);

    // Stats line
    const statsLine = `ダメージ: ${move.damage}   射程: ${move.range}`;
    drawText(statsLine, x + 75, y + 65, 9, '#555', 'left', false);

    // Super meter note
    if (isSuper) {
        drawText('※ 超必殺ゲージMAX時のみ使用可', x + 300, y + 65, 9, '#FFD700', 'left', false);
    }
}

function drawManualScreen() {
    ctx.fillStyle = '#0a0015';
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

    // Header
    drawText('技表', SCREEN_W / 2, 35, 30, '#FFD700', 'center', true);
    drawText('MOVE LIST', SCREEN_W / 2, 60, 14, '#AAA', 'center', false);

    const char = CHARACTERS[manualCharIndex];
    const loc = HAN_LOCATIONS[char.id];

    // Character portrait (left side)
    const portraitX = 150;
    const portraitY = 230;
    const idleSpritePath = char.sprites && char.sprites.idle;
    const idleSprite = idleSpritePath ? spriteCache[idleSpritePath] : null;
    if (idleSprite && idleSprite.complete && idleSprite.naturalWidth > 0) {
        const scale = 0.35;
        const sw = idleSprite.naturalWidth * scale;
        const sh = idleSprite.naturalHeight * scale;
        ctx.drawImage(idleSprite, portraitX - sw / 2, portraitY - sh / 2, sw, sh);
    } else {
        // Placeholder
        ctx.fillStyle = char.color;
        ctx.fillRect(portraitX - 25, portraitY - 40, 50, 65);
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(portraitX - 12, portraitY - 55, 24, 22);
    }

    // Character name + domain
    drawText(char.name, portraitX, portraitY + 75, 22, char.color, 'center', true);
    drawText(char.nameEn, portraitX, portraitY + 98, 11, '#AAA', 'center', false);
    drawText(loc.han, portraitX, portraitY + 118, 14, '#CCC', 'center', false);

    // Stats bars
    const statsX = portraitX - 55;
    const statsY = portraitY + 145;
    drawText('攻撃', statsX, statsY, 11, '#F88', 'left', false);
    drawStatBar(statsX + 35, statsY - 4, 65, char.stats.power, '#F44');
    drawText('速度', statsX, statsY + 18, 11, '#8F8', 'left', false);
    drawStatBar(statsX + 35, statsY + 14, 65, char.stats.speed, '#4F4');
    drawText('防御', statsX, statsY + 36, 11, '#88F', 'left', false);
    drawStatBar(statsX + 35, statsY + 32, 65, char.stats.defense, '#44F');

    // Move list (right side)
    const movesX = 280;
    const moveCardW = 510;
    const moveCardH = 70;
    const gap = 6;

    drawMoveCard(movesX, 80, moveCardW, moveCardH, 'J', '基本技', 'BASIC', char.moves.basic, false);
    drawMoveCard(movesX, 80 + (moveCardH + gap), moveCardW, moveCardH, 'J↑', '空中技', 'JUMP ATK', char.moves.jump_attack, false);
    drawMoveCard(movesX, 80 + (moveCardH + gap) * 2, moveCardW, moveCardH, 'F', '投げ技', 'THROW', char.moves.throw, false);
    drawMoveCard(movesX, 80 + (moveCardH + gap) * 3, moveCardW, moveCardH, 'K', '必殺技', 'SPECIAL', char.moves.special, false);
    drawMoveCard(movesX, 80 + (moveCardH + gap) * 4, moveCardW, moveCardH, 'L', '超必殺技', 'SUPER', char.moves.super, true);

    // System info
    const infoY = 80 + (moveCardH + gap) * 5 + 2;
    drawText('S: しゃがみ+ガード | 攻撃命中時 K/Lでキャンセル可能', movesX + 5, infoY, 10, '#FFA500', 'left', false);
    drawText('投げはガードを貫通 | 三すくみ: 打撃 > 投げ > ガード > 打撃', movesX + 5, infoY + 14, 10, '#888', 'left', false);

    // Navigation arrows
    const arrowY = SCREEN_H - 35;
    drawText('◀', 70, arrowY, 24, manualCharIndex > 0 ? '#FFD700' : '#333', 'center', true);
    drawText('▶', SCREEN_W - 70, arrowY, 24, manualCharIndex < CHARACTERS.length - 1 ? '#FFD700' : '#333', 'center', true);
    drawText(`${manualCharIndex + 1} / ${CHARACTERS.length}`, SCREEN_W / 2, SCREEN_H - 18, 12, '#666', 'center', false);
    drawText('← → : キャラ切替 / ESC: 戻る', SCREEN_W / 2, SCREEN_H - 38, 12, '#555', 'center', false);
}

// ============================================================
// JAPAN MAP SCREEN (ARCADE MODE)
// ============================================================
function drawJapanOutline() {
    ctx.fillStyle = '#2a1e12';
    ctx.strokeStyle = '#6B5030';
    ctx.lineWidth = 1.5;

    // Hokkaido - distinctive shape with SW peninsula and central mass
    ctx.beginPath();
    ctx.moveTo(690, 145);  // Tsugaru strait side
    ctx.bezierCurveTo(695, 132, 710, 118, 725, 108);  // SW coast up
    ctx.bezierCurveTo(740, 100, 755, 92, 770, 88);    // N coast
    ctx.bezierCurveTo(790, 85, 810, 88, 822, 98);     // NE cape
    ctx.bezierCurveTo(832, 108, 835, 122, 828, 135);   // E coast
    ctx.bezierCurveTo(822, 145, 810, 152, 798, 155);   // SE
    ctx.bezierCurveTo(785, 158, 770, 158, 758, 162);   // Tokachi
    ctx.bezierCurveTo(745, 165, 735, 168, 720, 165);   // S coast
    ctx.bezierCurveTo(708, 162, 698, 158, 690, 152);   // SW peninsula
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Honshu - long curved main island, NE to SW
    ctx.beginPath();
    // Northern Honshu (Tohoku) - starts at Aomori
    ctx.moveTo(700, 172);
    ctx.bezierCurveTo(712, 168, 722, 172, 728, 180);   // Aomori NE tip
    ctx.bezierCurveTo(735, 190, 738, 202, 736, 215);   // Pacific coast Tohoku
    ctx.bezierCurveTo(734, 228, 728, 238, 720, 246);   // Kanto approach
    // Kanto (Tokyo/Mito area) - eastward bulge
    ctx.bezierCurveTo(715, 252, 718, 260, 724, 264);   // Boso peninsula tip
    ctx.bezierCurveTo(718, 270, 708, 274, 698, 276);   // Tokyo bay south
    ctx.bezierCurveTo(688, 278, 678, 276, 668, 278);   // Sagami bay
    // Chubu - Izu peninsula, then curves SW
    ctx.bezierCurveTo(662, 284, 658, 292, 650, 290);   // Izu
    ctx.bezierCurveTo(640, 288, 628, 284, 618, 286);   // Suruga
    ctx.bezierCurveTo(605, 288, 590, 292, 578, 296);   // Kii channel area
    // Kansai - Kii peninsula juts south
    ctx.bezierCurveTo(565, 300, 552, 308, 540, 312);   // Kii peninsula
    ctx.bezierCurveTo(530, 316, 520, 318, 512, 314);   // Kii tip
    ctx.bezierCurveTo(505, 310, 498, 306, 490, 308);   // around Kii
    // Chugoku - narrowing toward west
    ctx.bezierCurveTo(478, 310, 465, 308, 452, 306);   // Inland sea coast
    ctx.bezierCurveTo(438, 304, 422, 302, 408, 300);   // Hiroshima area
    ctx.bezierCurveTo(395, 298, 382, 296, 372, 292);   // Yamaguchi approach
    ctx.bezierCurveTo(362, 288, 355, 282, 350, 278);   // Shimonoseki tip

    // North coast going back east (Sea of Japan side)
    ctx.bezierCurveTo(355, 272, 362, 266, 372, 264);   // Yamaguchi N
    ctx.bezierCurveTo(385, 260, 400, 258, 415, 256);   // Shimane
    ctx.bezierCurveTo(432, 254, 450, 252, 465, 250);   // Tottori
    ctx.bezierCurveTo(480, 248, 498, 248, 515, 250);   // Hyogo N
    ctx.bezierCurveTo(535, 252, 555, 256, 572, 254);   // Fukui/Ishikawa
    ctx.bezierCurveTo(590, 252, 605, 248, 618, 242);   // Niigata
    ctx.bezierCurveTo(635, 235, 648, 226, 660, 218);   // Akita
    ctx.bezierCurveTo(672, 210, 682, 200, 690, 190);   // Aomori W
    ctx.bezierCurveTo(695, 182, 698, 176, 700, 172);   // close at top
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Noto peninsula (small bump on N coast)
    ctx.beginPath();
    ctx.moveTo(590, 252);
    ctx.bezierCurveTo(595, 242, 604, 236, 608, 240);
    ctx.bezierCurveTo(612, 244, 608, 250, 602, 254);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Shikoku - four-province island south of Honshu center
    ctx.beginPath();
    ctx.moveTo(478, 328);  // NW
    ctx.bezierCurveTo(492, 322, 510, 320, 528, 322);   // N coast (Inland sea)
    ctx.bezierCurveTo(542, 324, 555, 328, 562, 334);   // NE
    ctx.bezierCurveTo(568, 340, 572, 348, 570, 356);   // E coast
    ctx.bezierCurveTo(568, 365, 560, 372, 550, 376);   // SE (Muroto)
    ctx.bezierCurveTo(538, 380, 522, 382, 508, 380);   // S coast (Tosa)
    ctx.bezierCurveTo(495, 378, 485, 372, 478, 364);   // SW (Ashizuri)
    ctx.bezierCurveTo(472, 356, 470, 345, 472, 336);   // W coast
    ctx.bezierCurveTo(474, 332, 476, 330, 478, 328);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Kyushu - larger island with distinctive shape
    ctx.beginPath();
    ctx.moveTo(358, 296);  // NE (Kokura/Kitakyushu)
    ctx.bezierCurveTo(368, 298, 378, 304, 385, 312);   // E coast
    ctx.bezierCurveTo(390, 320, 394, 332, 396, 344);   // Oita
    ctx.bezierCurveTo(398, 356, 396, 368, 390, 380);   // Miyazaki
    ctx.bezierCurveTo(385, 392, 378, 402, 370, 410);   // SE cape
    ctx.bezierCurveTo(362, 418, 355, 426, 345, 432);   // Osumi peninsula
    ctx.bezierCurveTo(338, 436, 328, 434, 322, 428);   // S tip (Satsuma)
    ctx.bezierCurveTo(315, 420, 310, 410, 308, 398);   // SW coast
    ctx.bezierCurveTo(306, 385, 308, 372, 312, 360);   // W coast
    ctx.bezierCurveTo(316, 348, 322, 338, 328, 328);   // NW Nagasaki area
    ctx.bezierCurveTo(325, 320, 318, 316, 315, 308);   // Nagasaki peninsula
    ctx.bezierCurveTo(320, 304, 328, 300, 338, 296);   // N coast
    ctx.bezierCurveTo(345, 294, 352, 294, 358, 296);   // back to NE
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Sado Island (small island off Niigata)
    ctx.beginPath();
    ctx.moveTo(635, 218);
    ctx.bezierCurveTo(640, 214, 648, 214, 650, 218);
    ctx.bezierCurveTo(652, 222, 648, 226, 642, 226);
    ctx.bezierCurveTo(638, 226, 635, 222, 635, 218);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Awaji Island (between Honshu and Shikoku)
    ctx.beginPath();
    ctx.moveTo(502, 308);
    ctx.bezierCurveTo(506, 304, 512, 306, 512, 312);
    ctx.bezierCurveTo(512, 318, 506, 320, 502, 316);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
}

function drawHanMarker(charId, state) {
    const loc = HAN_LOCATIONS[charId];
    const char = CHARACTERS.find(c => c.id === charId);
    if (!loc || !char) return;
    const radius = 8;

    ctx.save();
    if (state === 'defeated') {
        ctx.globalAlpha = 0.4;
    }

    // Glow for current opponent
    if (state === 'current') {
        const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.005);
        ctx.fillStyle = char.color;
        ctx.globalAlpha = pulse * 0.4;
        ctx.beginPath();
        ctx.arc(loc.x, loc.y, radius * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    // Player home marker
    if (state === 'player') {
        ctx.fillStyle = '#FFD700';
        ctx.globalAlpha = 0.3 + 0.2 * Math.sin(Date.now() * 0.003);
        ctx.beginPath();
        ctx.arc(loc.x, loc.y, radius * 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }

    // Main circle
    ctx.fillStyle = char.color;
    ctx.beginPath();
    ctx.arc(loc.x, loc.y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(loc.x, loc.y, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Defeated cross
    if (state === 'defeated') {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = '#FF3333';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(loc.x - 7, loc.y - 7);
        ctx.lineTo(loc.x + 7, loc.y + 7);
        ctx.moveTo(loc.x + 7, loc.y - 7);
        ctx.lineTo(loc.x - 7, loc.y + 7);
        ctx.stroke();
    }

    ctx.restore();

    // Han name label
    drawText(loc.han, loc.x, loc.y - 20, 12, state === 'defeated' ? '#666' : '#FFF', 'center', true);
}

function drawTravelLine(from, to, progress) {
    if (!from || !to) return;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const endX = from.x + dx * progress;
    const endY = from.y + dy * progress;

    // Dashed line trail
    ctx.save();
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Moving dot
    if (progress < 1) {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(endX, endY, 5, 0, Math.PI * 2);
        ctx.fill();
        // Glow
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.beginPath();
        ctx.arc(endX, endY, 12, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawArcadeMapScreen() {
    // Background - dark ocean
    const grad = ctx.createLinearGradient(0, 0, 0, SCREEN_H);
    grad.addColorStop(0, '#050510');
    grad.addColorStop(0.5, '#0a0a20');
    grad.addColorStop(1, '#0a0515');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

    // Subtle grid on ocean
    ctx.strokeStyle = 'rgba(50, 50, 80, 0.3)';
    ctx.lineWidth = 1;
    for (let gx = 0; gx < SCREEN_W; gx += 40) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, SCREEN_H);
        ctx.stroke();
    }
    for (let gy = 0; gy < SCREEN_H; gy += 40) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(SCREEN_W, gy);
        ctx.stroke();
    }

    // Title
    drawText('日本全国制覇', SCREEN_W / 2, 35, 26, '#FFD700', 'center', true);

    // Draw Japan
    drawJapanOutline();

    // Draw han markers
    for (let i = 0; i < CHARACTERS.length; i++) {
        const charId = CHARACTERS[i].id;
        let markerState = 'normal';

        if (i === arcadePlayerCharIdx) {
            markerState = 'player';
        } else if (arcadeDefeated.includes(i)) {
            markerState = 'defeated';
        } else if (arcadeOpponents[arcadeCurrentIndex] === i) {
            markerState = 'current';
        }
        drawHanMarker(charId, markerState);
    }

    // Travel line
    if (!mapShowingIntro && mapFromLocation && mapToLocation) {
        drawTravelLine(mapFromLocation, mapToLocation, mapTravelProgress);
    }

    // Current opponent info (bottom)
    if (arcadeCurrentIndex < arcadeOpponents.length) {
        const oppIdx = arcadeOpponents[arcadeCurrentIndex];
        const opp = CHARACTERS[oppIdx];
        const loc = HAN_LOCATIONS[opp.id];

        // Info box at bottom
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, SCREEN_H - 80, SCREEN_W, 80);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, SCREEN_H - 80);
        ctx.lineTo(SCREEN_W, SCREEN_H - 80);
        ctx.stroke();

        drawText(`次の相手: ${opp.name}`, SCREEN_W / 2, SCREEN_H - 55, 20, '#FFF', 'center', true);
        drawText(`${loc.han} (${loc.hanEn})`, SCREEN_W / 2, SCREEN_H - 32, 15, opp.color, 'center', true);
        drawText(`STAGE ${arcadeCurrentIndex + 1} / ${arcadeOpponents.length}`, SCREEN_W / 2, SCREEN_H - 12, 12, '#888', 'center', false);
    }

    // "Press Enter" after travel animation
    if (!mapShowingIntro && mapTravelProgress >= 1) {
        const blink = Math.sin(Date.now() * 0.005) > 0;
        if (blink) {
            drawText('PRESS ENTER', SCREEN_W - 100, 35, 14, '#AAA', 'center', false);
        }
    }
}

// ============================================================
// ARCADE ENDING SCREEN
// ============================================================
function drawArcadeEnding() {
    // Dark gradient background
    const grad = ctx.createLinearGradient(0, 0, 0, SCREEN_H);
    grad.addColorStop(0, '#0a0015');
    grad.addColorStop(0.5, '#1a0a2e');
    grad.addColorStop(1, '#3d1e6d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

    // Firework-like particles
    for (const p of particles) p.draw();

    // Player character data
    const playerChar = CHARACTERS[arcadePlayerCharIdx];
    const ending = playerChar.ending || { title: '勝利', subtitle: 'VICTORY', description: '' };

    // Title - character-specific ending title
    const titleScale = Math.min(1, endingTimer / 40);
    const titleSize = Math.floor(44 * titleScale);
    if (titleSize > 0) {
        drawText(ending.title + '！', SCREEN_W / 2, 65, titleSize, '#FFD700', 'center', true);
        if (endingTimer > 40) {
            drawText(ending.subtitle, SCREEN_W / 2, 105, 18, '#C0C0C0', 'center', true);
        }
    }

    // Character-specific description
    if (endingTimer > 40 && ending.description) {
        drawText(ending.description, SCREEN_W / 2, 135, 14, '#E0D0FF', 'center', false);
    }

    // Player character prominently in center
    const centerX = SCREEN_W / 2;
    const pSprite = playerChar.sprites && playerChar.sprites.idle ? spriteCache[playerChar.sprites.idle] : null;
    if (pSprite && pSprite.complete && pSprite.naturalWidth > 0) {
        const scale = 0.45;
        const sw = pSprite.naturalWidth * scale;
        const sh = pSprite.naturalHeight * scale;
        ctx.drawImage(pSprite, centerX - sw / 2, 155, sw, sh);
    } else {
        ctx.fillStyle = playerChar.color;
        ctx.fillRect(centerX - 30, 175, 60, 80);
    }
    drawText(playerChar.name, centerX, 345, 26, playerChar.color, 'center', true);
    drawText(playerChar.nameEn, centerX, 372, 13, '#AAA', 'center', false);

    // Four defeated opponents in a row below
    if (endingTimer > 60) {
        const oppCount = arcadeOpponents.length;
        const spacing = 160;
        const oppStartX = (SCREEN_W - (oppCount - 1) * spacing) / 2;
        for (let i = 0; i < oppCount; i++) {
            const fadeIn = Math.min(1, (endingTimer - 60 - i * 15) / 30);
            if (fadeIn <= 0) continue;

            const opp = CHARACTERS[arcadeOpponents[i]];
            const ox = oppStartX + i * spacing;
            const oy = 460;

            ctx.globalAlpha = fadeIn * 0.7;
            const oppSprite = opp.sprites && opp.sprites.idle ? spriteCache[opp.sprites.idle] : null;
            if (oppSprite && oppSprite.complete && oppSprite.naturalWidth > 0) {
                const s2 = 0.2;
                const sw2 = oppSprite.naturalWidth * s2;
                const sh2 = oppSprite.naturalHeight * s2;
                ctx.drawImage(oppSprite, ox - sw2 / 2, oy - sh2, sw2, sh2);
            } else {
                ctx.fillStyle = opp.color;
                ctx.fillRect(ox - 15, oy - 45, 30, 40);
            }
            ctx.globalAlpha = fadeIn;
            drawText(opp.name, ox, oy + 15, 11, opp.color, 'center', true);
            ctx.globalAlpha = 1;
        }
    }

    // Press enter prompt
    if (endingTimer > 150) {
        const blink = Math.sin(Date.now() * 0.005) > 0;
        if (blink) {
            drawText('PRESS ENTER', SCREEN_W / 2, SCREEN_H - 25, 16, '#AAA', 'center', false);
        }
    }
}

function drawVsScreen() {
    const c1 = CHARACTERS[arcadePlayerCharIdx];
    const c2 = CHARACTERS[selectedChar2 < 0 ? 0 : selectedChar2];
    const t = transitionTimer;

    // Background - dramatic split with diagonal slash
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

    // P1 side (blue tint)
    const slideIn = Math.min(1, t / 25); // slide-in easing
    const easeSlide = 1 - Math.pow(1 - slideIn, 3); // ease-out cubic

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(SCREEN_W / 2 + 40, 0);
    ctx.lineTo(SCREEN_W / 2 - 40, SCREEN_H);
    ctx.lineTo(0, SCREEN_H);
    ctx.closePath();
    ctx.clip();
    const g1 = ctx.createLinearGradient(0, 0, SCREEN_W / 2, 0);
    g1.addColorStop(0, '#0a1530');
    g1.addColorStop(1, '#152850');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

    // P1 character portrait
    const x1 = -300 + easeSlide * 300 + SCREEN_W * 0.22;
    const c1Sprite = c1.sprites && c1.sprites.idle ? spriteCache[c1.sprites.idle] : null;
    if (c1Sprite && c1Sprite.complete && c1Sprite.naturalWidth > 0) {
        const scale = 0.55;
        const sw = c1Sprite.naturalWidth * scale;
        const sh = c1Sprite.naturalHeight * scale;
        ctx.globalAlpha = 0.15;
        ctx.drawImage(c1Sprite, x1 - sw / 2 - 60, 40, sw * 1.8, sh * 1.8);
        ctx.globalAlpha = 1;
        ctx.drawImage(c1Sprite, x1 - sw / 2, 80, sw, sh);
    } else {
        // Placeholder character render
        ctx.fillStyle = c1.color;
        ctx.globalAlpha = 0.15;
        ctx.fillRect(x1 - 80, 60, 160, 260);
        ctx.globalAlpha = 1;
        ctx.fillRect(x1 - 35, 160, 70, 100);
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(x1 - 15, 130, 30, 30);
    }
    ctx.restore();

    // P2 side (red tint)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(SCREEN_W / 2 + 40, 0);
    ctx.lineTo(SCREEN_W, 0);
    ctx.lineTo(SCREEN_W, SCREEN_H);
    ctx.lineTo(SCREEN_W / 2 - 40, SCREEN_H);
    ctx.closePath();
    ctx.clip();
    const g2 = ctx.createLinearGradient(SCREEN_W / 2, 0, SCREEN_W, 0);
    g2.addColorStop(0, '#301020');
    g2.addColorStop(1, '#501525');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

    // P2 character portrait
    const x2 = SCREEN_W + 300 - easeSlide * 300 - SCREEN_W * 0.22;
    const c2Sprite = c2.sprites && c2.sprites.idle ? spriteCache[c2.sprites.idle] : null;
    if (c2Sprite && c2Sprite.complete && c2Sprite.naturalWidth > 0) {
        const scale = 0.55;
        const sw = c2Sprite.naturalWidth * scale;
        const sh = c2Sprite.naturalHeight * scale;
        ctx.save();
        ctx.translate(x2, 0);
        ctx.scale(-1, 1);
        ctx.globalAlpha = 0.15;
        ctx.drawImage(c2Sprite, -sw / 2 - 60, 40, sw * 1.8, sh * 1.8);
        ctx.globalAlpha = 1;
        ctx.drawImage(c2Sprite, -sw / 2, 80, sw, sh);
        ctx.restore();
    } else {
        ctx.fillStyle = c2.color;
        ctx.globalAlpha = 0.15;
        ctx.fillRect(x2 - 80, 60, 160, 260);
        ctx.globalAlpha = 1;
        ctx.fillRect(x2 - 35, 160, 70, 100);
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(x2 - 15, 130, 30, 30);
    }
    ctx.restore();

    // Diagonal slash line (center)
    ctx.save();
    ctx.shadowColor = '#FFF';
    ctx.shadowBlur = t < 20 ? 20 : 5;
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(SCREEN_W / 2 + 40, 0);
    ctx.lineTo(SCREEN_W / 2 - 40, SCREEN_H);
    ctx.stroke();
    ctx.restore();

    // Scan lines
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    for (let sy = 0; sy < SCREEN_H; sy += 2) {
        ctx.fillRect(0, sy, SCREEN_W, 1);
    }

    // Character names - slide in from sides
    const nameSlide = Math.min(1, Math.max(0, (t - 10) / 20));
    const nameEase = 1 - Math.pow(1 - nameSlide, 3);

    // P1 name
    const p1NameX = -300 + nameEase * 300 + SCREEN_W * 0.22;
    drawRetroText(c1.name, p1NameX, 380, 30, {
        fill: '#FFFFFF',
        grad1: '#FFFFFF',
        grad2: '#8888CC',
        shadow: '#000044',
        outline: '#000000'
    }, { depth: 2, pixelScale: 2 });

    // P1 label
    if (t > 15) {
        drawRetroText('1P', SCREEN_W * 0.22, 420, 16, {
            fill: '#4A90D9',
            outline: '#000000'
        }, { depth: 1, pixelScale: 2 });
    }

    // P2 name
    const p2NameX = SCREEN_W + 300 - nameEase * 300 - SCREEN_W * 0.22;
    drawRetroText(c2.name, p2NameX, 380, 30, {
        fill: '#FFFFFF',
        grad1: '#FFFFFF',
        grad2: '#CC8888',
        shadow: '#440000',
        outline: '#000000'
    }, { depth: 2, pixelScale: 2 });

    // P2 label
    if (t > 15) {
        drawRetroText('CPU', SCREEN_W * 0.78, 420, 16, {
            fill: '#DC143C',
            outline: '#000000'
        }, { depth: 1, pixelScale: 2 });
    }

    // VS text - dramatic entrance
    if (t > 20) {
        const vsT = Math.min(1, (t - 20) / 15);
        const vsEase = 1 - Math.pow(1 - vsT, 4);
        const vsSize = 60 * vsEase;
        const vsPulse = t > 35 ? (1 + Math.sin(t * 0.15) * 0.05) : 1;

        ctx.save();
        ctx.translate(SCREEN_W / 2, SCREEN_H / 2 - 20);
        ctx.scale(vsPulse, vsPulse);
        drawRetroText('VS', 0, 0, vsSize, {
            fill: '#FF2200',
            grad1: '#FF6644',
            grad2: '#881100',
            shadow: '#330000',
            outline: '#000000',
            glow: '#FF4400'
        }, { depth: 4, pixelScale: 3 });
        ctx.restore();
    }

    // Stage info (bottom)
    if (t > 40) {
        const infoAlpha = Math.min(1, (t - 40) / 20);
        ctx.globalAlpha = infoAlpha;
        drawRetroText('STAGE ' + (arcadeCurrentIndex + 1), SCREEN_W / 2, 490, 14, {
            fill: '#AAAAAA',
            outline: '#000000'
        }, { depth: 0, pixelScale: 2 });
        ctx.globalAlpha = 1;
    }

    // Flash effect on entry
    if (t < 8) {
        ctx.fillStyle = '#FFF';
        ctx.globalAlpha = 1 - t / 8;
        ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
        ctx.globalAlpha = 1;
    }
}

function drawFightUI() {
    // Health bars
    const barW = 350;
    const barY = 20;

    // P1 health (right-aligned, drains from left)
    drawHealthBar(30, barY, barW, player1.health, player1.maxHealth, true);
    // P2 health (left-aligned, drains from right)
    drawHealthBar(SCREEN_W - 30 - barW, barY, barW, player2.health, player2.maxHealth, false);

    // Super bars
    drawSuperBar(30, barY + 25, barW, player1.super, player1.maxSuper, player1.charData.color);
    drawSuperBar(SCREEN_W - 30 - barW, barY + 25, barW, player2.super, player2.maxSuper, player2.charData.color);

    // Names
    drawText(player1.charData.name, 30, barY - 8, 14, '#FFF', 'left', true);
    drawText(player2.charData.name, SCREEN_W - 30, barY - 8, 14, '#FFF', 'right', true);

    // Timer
    ctx.fillStyle = '#000';
    ctx.fillRect(SCREEN_W / 2 - 30, barY - 5, 60, 35);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.strokeRect(SCREEN_W / 2 - 30, barY - 5, 60, 35);
    drawText(
        Math.ceil(timer).toString(),
        SCREEN_W / 2,
        barY + 12,
        24,
        timer <= 10 ? '#FF4136' : '#FFF',
        'center',
        false
    );

    // Round indicator
    drawText(
        `ROUND ${roundNum}`,
        SCREEN_W / 2,
        barY + 42,
        12,
        '#AAA',
        'center',
        false
    );

    // Win markers
    for (let i = 0; i < player1.wins; i++) {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(50 + i * 20, barY + 50, 6, 0, Math.PI * 2);
        ctx.fill();
    }
    for (let i = 0; i < player2.wins; i++) {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(SCREEN_W - 50 - i * 20, barY + 50, 6, 0, Math.PI * 2);
        ctx.fill();
    }

    // Combo counter
    if (player1.comboCount > 1) {
        drawText(
            `${player1.comboCount} HIT COMBO!`,
            150,
            SCREEN_H / 2,
            20,
            '#FF0',
            'center',
            true
        );
    }
    if (player2.comboCount > 1) {
        drawText(
            `${player2.comboCount} HIT COMBO!`,
            SCREEN_W - 150,
            SCREEN_H / 2,
            20,
            '#FF0',
            'center',
            true
        );
    }

    // Move name display on attack
    if (player1.state === 'attack' && player1.currentMove && player1.stateTimer < 15) {
        drawText(
            player1.currentMove.name,
            player1.x,
            player1.y - player1.height - 25,
            12,
            player1.currentMove.color,
            'center',
            true
        );
    }
    if (player2.state === 'attack' && player2.currentMove && player2.stateTimer < 15) {
        drawText(
            player2.currentMove.name,
            player2.x,
            player2.y - player2.height - 25,
            12,
            player2.currentMove.color,
            'center',
            true
        );
    }
}

function drawFightIntro() {
    drawBackground();
    player1.draw();
    player2.draw();
    drawFightUI();

    // Dark overlay
    const alpha = Math.max(0, 1 - introTimer / 30);
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

    if (introTimer > 20 && introTimer < 80) {
        drawText('ROUND ' + roundNum, SCREEN_W / 2, SCREEN_H / 2 - 20, 40, '#FFF', 'center', true);
    }
    if (introTimer > 60 && introTimer < 120) {
        const fightAlpha = Math.min(1, (introTimer - 60) / 10);
        ctx.globalAlpha = fightAlpha;
        drawText('闘え！', SCREEN_W / 2, SCREEN_H / 2 + 30, 52, '#FF4136', 'center', true);
        drawText('FIGHT!', SCREEN_W / 2, SCREEN_H / 2 + 70, 24, '#FFD700', 'center', true);
        ctx.globalAlpha = 1;
    }
}

function drawRoundEnd() {
    // Apply KO zoom
    koZoom += (koZoomTarget - koZoom) * 0.08;
    if (koZoom > 1.01) {
        ctx.save();
        ctx.translate(koFocusX, koFocusY);
        ctx.scale(koZoom, koZoom);
        ctx.translate(-koFocusX, -koFocusY);
    }

    drawBackground();
    player1.draw();
    player2.draw();

    // Particles
    for (const p of particles) p.draw();

    drawFightUI();

    if (koZoom > 1.01) {
        ctx.restore();
    }

    // Darken overlay as transition progresses
    if (transitionTimer > 30) {
        const alpha = Math.min(0.3, (transitionTimer - 30) * 0.005);
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
        ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    }

    if (transitionTimer > 15) {
        const winner = player1.health > player2.health ? player1 : player2;
        const isKO = player1.health <= 0 || player2.health <= 0;

        if (isKO) {
            // K.O. text with punch-in scale animation
            const t = Math.min(1, (transitionTimer - 15) / 12);
            const scale = 1 + (1 - t) * 1.5; // 2.5x → 1x
            ctx.save();
            ctx.translate(SCREEN_W / 2, SCREEN_H / 2 - 30);
            ctx.scale(scale, scale);
            ctx.translate(-SCREEN_W / 2, -(SCREEN_H / 2 - 30));
            drawRetroText('K.O.!', SCREEN_W / 2, SCREEN_H / 2 - 30, 64, {
                fill: '#FF2200',
                grad1: '#FFDD00',
                grad2: '#CC0000',
                shadow: '#330000',
                outline: '#000000',
                glow: '#FF4400'
            }, { depth: 4, pixelScale: 2.5 });
            ctx.restore();
        } else {
            drawRetroText('TIME UP!', SCREEN_W / 2, SCREEN_H / 2 - 30, 48, {
                fill: '#FFD700',
                grad1: '#FFEE66',
                grad2: '#BB8800',
                shadow: '#332200',
                outline: '#000000',
                glow: '#FFAA00'
            }, { depth: 3, pixelScale: 2.5 });
        }

        if (transitionTimer > 60) {
            drawRetroText(winner.charData.name + ' WIN', SCREEN_W / 2, SCREEN_H / 2 + 35, 32, {
                fill: winner.charData.color,
                grad1: '#FFFFFF',
                grad2: winner.charData.color,
                outline: '#000000'
            }, { depth: 2, pixelScale: 2 });
        }
    }
}

function drawMatchEnd() {
    drawBackground();
    player1.draw();
    player2.draw();

    for (const p of particles) p.draw();

    drawFightUI();

    // Overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

    const winner = player1.wins >= WINS_NEEDED ? player1 : player2;

    if (player1.wins >= WINS_NEEDED) {
        // Player won
        drawText(winner.charData.name, SCREEN_W / 2, SCREEN_H / 2 - 60, 42, winner.charData.color, 'center', true);
        drawText('勝利！', SCREEN_W / 2, SCREEN_H / 2, 56, '#FFD700', 'center', true);
        drawText('VICTORY!', SCREEN_W / 2, SCREEN_H / 2 + 45, 28, '#FFF', 'center', true);
    } else {
        // Player lost - GAME OVER
        drawText(winner.charData.name, SCREEN_W / 2, SCREEN_H / 2 - 60, 42, winner.charData.color, 'center', true);
        drawText('GAME OVER', SCREEN_W / 2, SCREEN_H / 2, 56, '#FF3333', 'center', true);
        drawText('敗北...', SCREEN_W / 2, SCREEN_H / 2 + 45, 28, '#AAA', 'center', true);
    }

    if (transitionTimer > 90) {
        const blink = Math.sin(Date.now() * 0.005) > 0;
        if (blink) {
            drawText(
                'PRESS ENTER TO CONTINUE',
                SCREEN_W / 2,
                SCREEN_H / 2 + 100,
                18,
                '#AAA',
                'center',
                false
            );
        }
    }
}

// ============================================================
// COLLISION DETECTION
// ============================================================
function boxOverlap(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function resolveThrow(attacker, defender) {
    if (!attacker.currentMove || !attacker.currentMove.isThrow) return;
    if (attacker.hasHit) return;
    const move = attacker.currentMove;
    const dist = Math.abs(attacker.x - defender.x);
    if (dist > move.range) return;
    if (attacker.stateTimer < move.startup || attacker.stateTimer > move.startup + 3) return;
    if (!defender.isGrounded || defender.state === 'hit' || defender.state === 'knockdown') return;

    // Throw connects - bypasses block!
    attacker.hasHit = true;
    SoundManager.seThrow();
    defender.health = Math.max(0, defender.health - move.damage);
    defender.hitStun = 15;
    defender.state = 'hit';
    defender.stateTimer = 0;
    defender.currentMove = null;
    defender.isBlocking = false;
    defender.isCrouching = false;
    defender.flashTimer = 6;
    // Toss opponent
    defender.vx = attacker.direction * 6;
    defender.vy = -7;
    defender.isGrounded = false;
    // Super meter
    attacker.super = Math.min(attacker.super + move.damage * 0.8, 100);
    defender.super = Math.min(defender.super + move.damage * 0.5, 100);
    // Combo
    attacker.comboCount++;
    attacker.comboTimer = 60;
    // Effects
    spawnHitSpark(defender.x, defender.y - defender.height / 2);
    spawnParticles(defender.x, defender.y - defender.height / 2, '#FFD700', 8, 4);
    screenShake = 6;
}

function checkAttackCollisions() {
    // Throw resolution (before normal attacks)
    resolveThrow(player1, player2);
    resolveThrow(player2, player1);

    // P1 attack vs P2
    if (player1.state === 'attack' && !player1.hasHit) {
        const atkBox = player1.getAttackHitbox();
        if (atkBox) {
            const defBox = player2.getHitbox();
            if (boxOverlap(atkBox, defBox)) {
                player1.hasHit = true;
                player1.canCancel = true;
                player1.cancelWindow = 12;
                SoundManager.seHit();
                player2.takeDamage(player1.currentMove.damage, player1);
            }
        }
    }

    // P2 attack vs P1
    if (player2.state === 'attack' && !player2.hasHit) {
        const atkBox = player2.getAttackHitbox();
        if (atkBox) {
            const defBox = player1.getHitbox();
            if (boxOverlap(atkBox, defBox)) {
                player2.hasHit = true;
                player2.canCancel = true;
                player2.cancelWindow = 12;
                SoundManager.seHit();
                player1.takeDamage(player2.currentMove.damage, player2);
            }
        }
    }

    // Projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const proj = projectiles[i];
        const target = proj.owner === player1 ? player2 : player1;
        const targetBox = target.getHitbox();
        const projBox = proj.getHitbox();

        if (boxOverlap(projBox, targetBox)) {
            SoundManager.seHit();
            target.takeDamage(proj.damage, proj.owner);
            spawnHitSpark(proj.x, proj.y);
            projectiles.splice(i, 1);
            continue;
        }

        if (proj.life <= 0 || proj.x < -50 || proj.x > SCREEN_W + 50) {
            projectiles.splice(i, 1);
        }
    }
}

// ============================================================
// INPUT PROCESSING
// ============================================================
function processPlayerInput() {
    if (
        player1.state === 'hit' ||
        player1.state === 'knockdown' ||
        player1.hitStun > 0
    )
        return;

    // Movement
    const moveSpeed = 4;
    if (keys['KeyA']) {
        player1.vx -= moveSpeed;
        if (player1.state !== 'attack') player1.state = 'walk';
    }
    if (keys['KeyD']) {
        player1.vx += moveSpeed;
        if (player1.state !== 'attack') player1.state = 'walk';
    }
    if (!keys['KeyA'] && !keys['KeyD'] && player1.state === 'walk') {
        player1.state = 'idle';
    }

    // Jump (cannot jump while crouching)
    if (keys['KeyW'] && player1.isGrounded && player1.state !== 'attack' && !player1.isCrouching) {
        player1.vy = -11;
        player1.isGrounded = false;
        player1.state = 'jump';
    }

    // Crouch + Guard (S key)
    if (keys['KeyS'] && player1.isGrounded && player1.state !== 'attack') {
        player1.isCrouching = true;
        player1.isBlocking = true;
        if (player1.state !== 'jump') player1.state = 'crouch';
    } else {
        player1.isCrouching = false;
        if (!keys['KeyS']) player1.isBlocking = false;
    }

    // Attacks
    if (wasPressed('KeyJ')) {
        if (!player1.isGrounded) {
            player1.jumpAttack();
        } else {
            player1.attack('basic');
        }
    }
    if (wasPressed('KeyK')) {
        player1.attack('special');
    }
    if (wasPressed('KeyL')) {
        player1.attack('super');
    }
    // Throw (F key)
    if (wasPressed('KeyF')) {
        player1.performThrow(player2);
    }
}

// ============================================================
// GAME LOOP UPDATE
// ============================================================
function updateTitle() {
    SoundManager.playBGM('title');
    // Mobile: tap game screen area to start
    if (isMobile && lastTapX >= 0) {
        SoundManager.seConfirm();
        demoTimer = 0;
        lastTapX = -1; lastTapY = -1;
        gameState = STATE.DIFFICULTY;
        return;
    }
    if (wasPressed('Enter') || wasPressed('Space')) {
        SoundManager.seConfirm();
        demoTimer = 0;
        gameState = STATE.DIFFICULTY;
        return;
    }
    if (wasPressed('KeyM')) {
        SoundManager.seConfirm();
        demoTimer = 0;
        manualCharIndex = 0;
        gameState = STATE.MANUAL;
        return;
    }
    if (wasPressed('KeyN')) {
        SoundManager.seConfirm();
        demoTimer = 0;
        settingsSelection = 0;
        gameState = STATE.SETTINGS;
        return;
    }

    // Check any key input to reset demo timer
    const anyKey = Object.keys(keysPressed).some(k => keysPressed[k]);
    if (anyKey) {
        demoTimer = 0;
    } else {
        demoTimer++;
    }

    // Start demo after ~10 seconds of inactivity
    if (demoTimer >= 600) {
        demoTimer = 0;
        startDemo();
    }
}

function startDemo() {
    // Pick 2 random different characters
    const idx1 = Math.floor(Math.random() * CHARACTERS.length);
    let idx2 = Math.floor(Math.random() * (CHARACTERS.length - 1));
    if (idx2 >= idx1) idx2++;

    player1 = new Fighter(CHARACTERS[idx1], 1, 250);
    player2 = new Fighter(CHARACTERS[idx2], 2, SCREEN_W - 250);
    demoAI1 = new AIController(0.5);
    demoAI2 = new AIController(0.5);
    demoRoundTimer = 30 * 60; // 30 seconds in frames
    demoEndTimer = 0;
    demoState = 'fighting';
    timer = 30;
    timerAccum = 0;
    roundNum = 1;
    player1.wins = 0;
    player2.wins = 0;
    projectiles.length = 0;
    particles.length = 0;
    screenShake = 0;
    screenFlash = 0;
    slowMotion = 0;
    koZoom = 1.0;
    koZoomTarget = 1.0;
    SoundManager.stopBGM();
    SoundManager.playBGM('fight', player2.charData.id);
    gameState = STATE.DEMO;
}

function anyKeyPressed() {
    return Object.keys(keysPressed).some(k => keysPressed[k]);
}

function exitDemoToTitle() {
    // Clear keysPressed so title doesn't immediately react
    for (const k in keysPressed) keysPressed[k] = false;
    SoundManager.stopBGM();
    player1 = null;
    player2 = null;
    projectiles.length = 0;
    particles.length = 0;
    screenShake = 0;
    screenFlash = 0;
    slowMotion = 0;
    koZoom = 1.0;
    koZoomTarget = 1.0;
    demoTimer = 0;
    gameState = STATE.TITLE;
}

function updateDemo() {
    // Any key or tap returns to title
    if (anyKeyPressed() || (isMobile && lastTapX >= 0)) {
        lastTapX = -1; lastTapY = -1;
        exitDemoToTitle();
        return;
    }

    if (demoState === 'fighting') {
        // Decay effects
        if (screenShake > 0) screenShake *= 0.9;
        if (screenFlash > 0) screenFlash--;

        // Round timer
        timerAccum++;
        if (timerAccum >= 60) {
            timerAccum = 0;
            timer = Math.max(0, timer - 1);
        }

        // Both players controlled by AI
        demoAI1.update(player1, player2);
        demoAI2.update(player2, player1);

        player1.update(player2);
        player2.update(player1);

        // Projectiles
        for (let i = projectiles.length - 1; i >= 0; i--) {
            projectiles[i].update();
            if (projectiles[i].life <= 0 || projectiles[i].x < -50 || projectiles[i].x > SCREEN_W + 50) {
                projectiles.splice(i, 1);
            }
        }

        // Collision
        checkAttackCollisions();

        // Particles
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            if (particles[i].life <= 0) particles.splice(i, 1);
        }

        // KO or time up check
        if (player1.health <= 0 || player2.health <= 0 || timer <= 0) {
            demoState = 'ending';
            demoEndTimer = 0;
            slowMotion = 30;
            if (player1.health <= 0 || player2.health <= 0) {
                const winner = player1.health > player2.health ? player1 : player2;
                const loser = winner === player1 ? player2 : player1;
                winner.state = 'victory';
                loser.state = 'knockdown';
                loser.knockdownTimer = 999;
                screenShake = 12;
                screenFlash = 8;
            }
        }
    } else {
        // Demo ending - show result briefly then return to title
        if (screenShake > 0) screenShake *= 0.85;
        if (screenShake < 0.5) screenShake = 0;
        player1.animTimer++;
        player2.animTimer++;
        demoEndTimer++;
        if (demoEndTimer > 180) {
            exitDemoToTitle();
        }
    }
}

function drawDemo() {
    drawBackground();
    player1.draw();
    player2.draw();

    for (const proj of projectiles) proj.draw();
    for (const p of particles) p.draw();

    drawFightUI();

    // "DEMO PLAY" overlay
    ctx.save();
    ctx.globalAlpha = 0.4 + Math.sin(Date.now() * 0.003) * 0.1;
    drawText('DEMO PLAY', SCREEN_W / 2, 25, 18, '#FFFFFF', 'center', true);
    ctx.restore();

    // Show KO result during ending
    if (demoState === 'ending' && demoEndTimer > 15) {
        const isKO = player1.health <= 0 || player2.health <= 0;
        const winner = player1.health > player2.health ? player1 : player2;

        if (isKO) {
            drawRetroText('K.O.!', SCREEN_W / 2, SCREEN_H / 2 - 30, 64, {
                fill: '#FF2200',
                grad1: '#FFDD00',
                grad2: '#CC0000',
                shadow: '#330000',
                outline: '#000000',
                glow: '#FF4400'
            }, { depth: 4, pixelScale: 2.5 });
        } else {
            drawRetroText('TIME UP!', SCREEN_W / 2, SCREEN_H / 2 - 30, 48, {
                fill: '#FFD700',
                grad1: '#FFEE66',
                grad2: '#BB8800',
                shadow: '#332200',
                outline: '#000000',
                glow: '#FFAA00'
            }, { depth: 3, pixelScale: 2.5 });
        }

        if (demoEndTimer > 50) {
            drawRetroText(winner.charData.name + ' WIN', SCREEN_W / 2, SCREEN_H / 2 + 35, 32, {
                fill: winner.charData.color,
                grad1: '#FFFFFF',
                grad2: winner.charData.color,
                outline: '#000000'
            }, { depth: 2, pixelScale: 2 });
        }
    }
}

function updateSettings() {
    // Navigate items
    if (wasPressed('ArrowUp') || wasPressed('KeyW')) {
        SoundManager.seCursor();
        settingsSelection = (settingsSelection - 1 + 4) % 4;
    }
    if (wasPressed('ArrowDown') || wasPressed('KeyS')) {
        SoundManager.seCursor();
        settingsSelection = (settingsSelection + 1) % 4;
    }

    // Adjust volume with Left/Right
    const step = 0.05;
    if (wasPressed('ArrowLeft') || wasPressed('KeyA')) {
        if (settingsSelection === 0) SoundManager.setBgmVolume(SoundManager.bgmVolume - step);
        else if (settingsSelection === 1) SoundManager.setSeVolume(SoundManager.seVolume - step);
        else if (settingsSelection === 2) SoundManager.setVoiceVolume(SoundManager.voiceVolume - step);
        else if (settingsSelection === 3) SoundManager.toggleMute();
        SoundManager.seCursor();
    }
    if (wasPressed('ArrowRight') || wasPressed('KeyD')) {
        if (settingsSelection === 0) SoundManager.setBgmVolume(SoundManager.bgmVolume + step);
        else if (settingsSelection === 1) SoundManager.setSeVolume(SoundManager.seVolume + step);
        else if (settingsSelection === 2) SoundManager.setVoiceVolume(SoundManager.voiceVolume + step);
        else if (settingsSelection === 3) SoundManager.toggleMute();
        SoundManager.seCursor();
    }

    // Mute toggle with Enter on mute item
    if (settingsSelection === 3 && (wasPressed('Enter') || wasPressed('Space'))) {
        SoundManager.toggleMute();
        SoundManager.seCursor();
    }

    // Back
    if (wasPressed('Escape') || wasPressed('Backspace')) {
        SoundManager.seConfirm();
        gameState = STATE.TITLE;
    }
}

function drawSettingsScreen() {
    ctx.fillStyle = '#0a0015';
    ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

    // Scan lines
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    for (let sy = 0; sy < SCREEN_H; sy += 2) {
        ctx.fillRect(0, sy, SCREEN_W, 1);
    }

    // Title
    drawRetroText('SETTINGS', SCREEN_W / 2, 60, 36, {
        fill: '#FFD700',
        grad1: '#FFE060',
        grad2: '#B8860B',
        shadow: '#301000',
        outline: '#000000'
    }, { depth: 3, pixelScale: 2 });

    const items = [
        { label: 'BGM', value: SoundManager.bgmVolume },
        { label: 'SE', value: SoundManager.seVolume },
        { label: 'VOICE', value: SoundManager.voiceVolume },
        { label: 'MUTE', value: SoundManager.muted }
    ];

    const startY = 160;
    const itemH = 70;

    items.forEach((item, i) => {
        const y = startY + i * itemH;
        const selected = i === settingsSelection;

        // Selection highlight
        if (selected) {
            ctx.fillStyle = 'rgba(255, 200, 50, 0.08)';
            ctx.fillRect(SCREEN_W / 2 - 250, y - 22, 500, 50);
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 1;
            ctx.strokeRect(SCREEN_W / 2 - 250, y - 22, 500, 50);
        }

        // Cursor arrow
        if (selected) {
            drawRetroText('>', SCREEN_W / 2 - 220, y, 20, {
                fill: '#FFD700', outline: '#000'
            }, { depth: 1, pixelScale: 2 });
        }

        // Label
        const labelColor = selected ? '#FFFFFF' : '#888888';
        drawRetroText(item.label, SCREEN_W / 2 - 120, y, 20, {
            fill: labelColor, outline: '#000000'
        }, { depth: 1, pixelScale: 2 });

        if (i < 3) {
            // Volume bar
            const barX = SCREEN_W / 2 + 10;
            const barW = 200;
            const barH = 16;
            const barY = y - barH / 2;

            // Bar background
            ctx.fillStyle = '#222';
            ctx.fillRect(barX, barY, barW, barH);

            // Bar fill
            const fillW = barW * item.value;
            const barGrad = ctx.createLinearGradient(barX, 0, barX + barW, 0);
            if (i === 0) { barGrad.addColorStop(0, '#2244AA'); barGrad.addColorStop(1, '#4488FF'); }
            else if (i === 1) { barGrad.addColorStop(0, '#22AA44'); barGrad.addColorStop(1, '#44FF88'); }
            else { barGrad.addColorStop(0, '#AA4422'); barGrad.addColorStop(1, '#FF8844'); }
            ctx.fillStyle = barGrad;
            ctx.fillRect(barX, barY, fillW, barH);

            // Bar border
            ctx.strokeStyle = selected ? '#FFD700' : '#555';
            ctx.lineWidth = 1;
            ctx.strokeRect(barX, barY, barW, barH);

            // Percentage
            const pct = Math.round(item.value * 100) + '%';
            drawRetroText(pct, barX + barW + 40, y, 14, {
                fill: labelColor, outline: '#000'
            }, { depth: 0, pixelScale: 2 });

            // Arrows hint
            if (selected) {
                drawRetroText('<', barX - 15, y, 14, { fill: '#FFD700', outline: '#000' }, { depth: 0, pixelScale: 2 });
                drawRetroText('>', barX + barW + 10, y, 14, { fill: '#FFD700', outline: '#000' }, { depth: 0, pixelScale: 2 });
            }
        } else {
            // Mute toggle
            const muteX = SCREEN_W / 2 + 60;
            const muteStatus = SoundManager.muted ? 'ON' : 'OFF';
            const muteColor = SoundManager.muted ? '#FF4444' : '#44FF44';
            drawRetroText(muteStatus, muteX, y, 20, {
                fill: muteColor, outline: '#000000'
            }, { depth: 1, pixelScale: 2 });

            // Speaker icon
            if (SoundManager.muted) {
                ctx.strokeStyle = '#FF4444';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(muteX + 55, y - 8);
                ctx.lineTo(muteX + 70, y + 8);
                ctx.moveTo(muteX + 70, y - 8);
                ctx.lineTo(muteX + 55, y + 8);
                ctx.stroke();
            }
        }
    });

    // Footer
    drawRetroText('↑↓: 選択  ←→: 調整  ESC: 戻る', SCREEN_W / 2, 470, 12, {
        fill: '#666', outline: '#000'
    }, { depth: 0, pixelScale: 1.5 });

    // Global mute shortcut hint
    drawRetroText('P: ミュート切替 (どの画面でも)', SCREEN_W / 2, 500, 10, {
        fill: '#555', outline: '#000'
    }, { depth: 0, pixelScale: 1.5 });
}

function updateManual() {
    if (wasPressed('ArrowLeft') || wasPressed('KeyA')) {
        SoundManager.seCursor();
        manualCharIndex = (manualCharIndex - 1 + CHARACTERS.length) % CHARACTERS.length;
    }
    if (wasPressed('ArrowRight') || wasPressed('KeyD')) {
        SoundManager.seCursor();
        manualCharIndex = (manualCharIndex + 1) % CHARACTERS.length;
    }
    if (wasPressed('Escape') || wasPressed('Backspace')) {
        SoundManager.seConfirm();
        gameState = STATE.TITLE;
    }
}

function updateDifficulty() {
    if (wasPressed('ArrowLeft') || wasPressed('KeyA')) {
        SoundManager.seCursor();
        selectedDifficulty = (selectedDifficulty - 1 + DIFFICULTY_LEVELS.length) % DIFFICULTY_LEVELS.length;
    }
    if (wasPressed('ArrowRight') || wasPressed('KeyD')) {
        SoundManager.seCursor();
        selectedDifficulty = (selectedDifficulty + 1) % DIFFICULTY_LEVELS.length;
    }
    // Mobile: tap on difficulty box to select & confirm
    if (isMobile && lastTapX >= 0) {
        const boxW = 160, boxH = 100, gap = 30;
        const totalW = DIFFICULTY_LEVELS.length * boxW + (DIFFICULTY_LEVELS.length - 1) * gap;
        const startX = (SCREEN_W - totalW) / 2;
        const boxY = 220;
        for (let i = 0; i < DIFFICULTY_LEVELS.length; i++) {
            const bx = startX + i * (boxW + gap);
            if (lastTapX >= bx && lastTapX <= bx + boxW && lastTapY >= boxY && lastTapY <= boxY + boxH) {
                if (selectedDifficulty === i) {
                    // Already selected → confirm
                    SoundManager.seConfirm();
                    gameState = STATE.SELECT;
                    selectedChar1 = 0;
                    selectedChar2 = -1;
                    selectingPlayer = 1;
                } else {
                    SoundManager.seCursor();
                    selectedDifficulty = i;
                }
                break;
            }
        }
        lastTapX = -1; lastTapY = -1;
    }
    if (wasPressed('Enter') || wasPressed('Space')) {
        SoundManager.seConfirm();
        gameState = STATE.SELECT;
        selectedChar1 = 0;
        selectedChar2 = -1;
        selectingPlayer = 1;
    }
    if (wasPressed('Escape') || wasPressed('Backspace')) {
        SoundManager.seCursor();
        gameState = STATE.TITLE;
    }
}

function updateSelect() {
    // Arcade mode: 1P select only
    if (wasPressed('ArrowLeft') || wasPressed('KeyA')) {
        SoundManager.seCursor();
        selectedChar1 = (selectedChar1 - 1 + CHARACTERS.length) % CHARACTERS.length;
    }
    if (wasPressed('ArrowRight') || wasPressed('KeyD')) {
        SoundManager.seCursor();
        selectedChar1 = (selectedChar1 + 1) % CHARACTERS.length;
    }
    // Mobile: tap on character card to select & confirm
    if (isMobile && lastTapX >= 0) {
        const cardW = 160, cardH = 320;
        const startX = (SCREEN_W - cardW * 5 - 20 * 4) / 2;
        const cardY = 90;
        for (let i = 0; i < CHARACTERS.length; i++) {
            const cx = startX + i * (cardW + 20);
            if (lastTapX >= cx && lastTapX <= cx + cardW && lastTapY >= cardY && lastTapY <= cardY + cardH) {
                if (selectedChar1 === i) {
                    // Already selected → confirm
                    SoundManager.seConfirm();
                    initArcadeMode();
                } else {
                    SoundManager.seCursor();
                    selectedChar1 = i;
                }
                break;
            }
        }
        lastTapX = -1; lastTapY = -1;
    }

    if (wasPressed('Enter') || wasPressed('Space')) {
        SoundManager.seConfirm();
        initArcadeMode();
    }

    if (wasPressed('Escape') || wasPressed('Backspace')) {
        SoundManager.seCursor();
        gameState = STATE.DIFFICULTY;
    }
}

function initArcadeMode() {
    arcadePlayerCharIdx = selectedChar1;
    arcadeDefeated = [];
    arcadeCurrentIndex = 0;

    // Build shuffled opponent list (all characters except the player's)
    arcadeOpponents = [];
    for (let i = 0; i < CHARACTERS.length; i++) {
        if (i !== arcadePlayerCharIdx) {
            arcadeOpponents.push(i);
        }
    }
    // Fisher-Yates shuffle
    for (let i = arcadeOpponents.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arcadeOpponents[i], arcadeOpponents[j]] = [arcadeOpponents[j], arcadeOpponents[i]];
    }

    // Initialize map state - show player's home first
    mapAnimTimer = 0;
    mapShowingIntro = true;
    mapTravelProgress = 0;
    mapFromLocation = null;
    mapToLocation = null;

    gameState = STATE.ARCADE_MAP;
    SoundManager.playBGM('map');
}

function updateArcadeMap() {
    mapAnimTimer++;

    if (mapShowingIntro) {
        // Phase 1: Show the player's home location (60 frames)
        if (mapAnimTimer > 60) {
            mapShowingIntro = false;
            mapAnimTimer = 0;
            // Set up travel animation
            const playerChar = CHARACTERS[arcadePlayerCharIdx];
            const fromCharIdx = arcadeDefeated.length === 0
                ? arcadePlayerCharIdx
                : arcadeDefeated[arcadeDefeated.length - 1];
            const fromLoc = HAN_LOCATIONS[CHARACTERS[fromCharIdx].id];
            const toLoc = HAN_LOCATIONS[CHARACTERS[arcadeOpponents[arcadeCurrentIndex]].id];
            mapFromLocation = { x: fromLoc.x, y: fromLoc.y };
            mapToLocation = { x: toLoc.x, y: toLoc.y };
            mapTravelProgress = 0;
        }
    } else {
        // Phase 2: Animate travel line (over 90 frames)
        mapTravelProgress = Math.min(1, mapAnimTimer / 90);

        // After travel completes, wait for Enter or auto-proceed
        if (mapTravelProgress >= 1 && (wasPressed('Enter') || wasPressed('Space'))) {
            SoundManager.seConfirm();
            SoundManager.stopBGM();
            // Set up the fight
            const oppIdx = arcadeOpponents[arcadeCurrentIndex];
            selectedChar2 = oppIdx;
            gameState = STATE.VS_SCREEN;
            transitionTimer = 0;

            player1 = new Fighter(CHARACTERS[arcadePlayerCharIdx], 1, 250);
            player2 = new Fighter(CHARACTERS[oppIdx], 2, SCREEN_W - 250);
            ai = new AIController(DIFFICULTY_LEVELS[selectedDifficulty].value);
            roundNum = 1;
        }
    }
}

function updateArcadeEnding() {
    endingTimer++;

    // Spawn celebration particles
    if (endingTimer % 6 === 0) {
        const px = Math.random() * SCREEN_W;
        const colors = ['#FFD700', '#FF4136', '#4A90D9', '#2ECC40', '#FF69B4', '#FF8C00'];
        spawnParticles(px, -10, colors[Math.floor(Math.random() * colors.length)], 4, 4);
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].life <= 0) particles.splice(i, 1);
    }

    if (endingTimer > 150 && (wasPressed('Enter') || wasPressed('Space'))) {
        SoundManager.stopBGM();
        gameState = STATE.TITLE;
        particles.length = 0;
        projectiles.length = 0;
    }
}

function updateVsScreen() {
    transitionTimer++;
    // Dramatic whoosh sound on entry
    if (transitionTimer === 2) {
        SoundManager.seCursor(); // slide-in sound
    }
    // VS impact sound
    if (transitionTimer === 22) {
        SoundManager.seHit(); // impact for VS text
    }
    if (transitionTimer > 140) {
        gameState = STATE.FIGHT_INTRO;
        introTimer = 0;
    }
}

function updateFightIntro() {
    introTimer++;
    // Play FIGHT! sound at the right moment
    if (introTimer === 61) {
        SoundManager.seFightStart();
        SoundManager.voiceFight();
    }
    if (introTimer > 130) {
        gameState = STATE.FIGHTING;
        timer = ROUND_TIME;
        timerAccum = 0;
        SoundManager.playBGM('fight', player2.charData.id);
    }
}

function updateFighting() {
    // KO staging phase: slow + zoom while still in FIGHTING state
    if (koStaging) {
        koStagingTimer++;

        // Keep updating physics/animations during staging for natural motion
        player1.update(player2);
        player2.update(player1);
        for (const proj of projectiles) proj.update();
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            if (particles[i].life <= 0) particles.splice(i, 1);
        }
        if (screenShake > 0) screenShake *= 0.9;
        if (screenFlash > 0) screenFlash--;

        // After staging completes, transition to ROUND_END
        if (koStagingTimer > 50) {
            koStaging = false;
            koStagingTimer = 0;
            gameState = STATE.ROUND_END;
            transitionTimer = 0;
            SoundManager.seRoundWin();

            const winner = player1.health > player2.health ? player1 : player2;
            const loser = winner === player1 ? player2 : player1;
            winner.wins++;
            winner.state = 'victory';
            SoundManager.voiceVictory(winner.charData);
            SoundManager.voiceDefeat(loser.charData);
        }
        return;
    }

    // Timer
    timerAccum++;
    if (timerAccum >= 60) {
        timerAccum = 0;
        timer = Math.max(0, timer - 1);
    }

    // Process input
    processPlayerInput();

    // AI
    ai.update(player2, player1);

    // Update fighters
    player1.update(player2);
    player2.update(player1);

    // Projectiles
    for (const proj of projectiles) proj.update();

    // Collisions
    checkAttackCollisions();

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].life <= 0) particles.splice(i, 1);
    }

    // Screen effects
    if (screenShake > 0) screenShake *= 0.9;
    if (screenFlash > 0) screenFlash--;

    // Round end check
    if (player1.health <= 0 || player2.health <= 0 || timer <= 0) {
        const isKO = player1.health <= 0 || player2.health <= 0;

        if (isKO) {
            // KO: enter staging phase (slow + zoom while still in FIGHTING)
            const winner = player1.health > player2.health ? player1 : player2;
            const loser = winner === player1 ? player2 : player1;
            loser.state = 'knockdown';
            loser.knockdownTimer = 999;

            koStaging = true;
            koStagingTimer = 0;
            slowMotion = 90;
            screenShake = 18;
            screenFlash = 15;
            koZoomTarget = 1.35;
            koFocusX = loser.x;
            koFocusY = GROUND_Y - 80;
            SoundManager.stopBGM();
        } else {
            // Time up: go straight to ROUND_END
            gameState = STATE.ROUND_END;
            transitionTimer = 0;
            SoundManager.stopBGM();
            SoundManager.seRoundWin();

            const winner = player1.health > player2.health ? player1 : player2;
            const loser = winner === player1 ? player2 : player1;
            winner.wins++;
            winner.state = 'victory';
            SoundManager.voiceVictory(winner.charData);
            SoundManager.voiceDefeat(loser.charData);
        }
    }
}

function updateRoundEnd() {
    transitionTimer++;

    // Decay screen shake
    if (screenShake > 0) screenShake *= 0.85;
    if (screenShake < 0.5) screenShake = 0;

    // Ease zoom back toward 1.0 after KO text has shown
    if (transitionTimer > 60) {
        koZoomTarget = 1.0;
    }

    // Update animations
    player1.animTimer++;
    player2.animTimer++;

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].life <= 0) particles.splice(i, 1);
    }

    if (transitionTimer > 120) {
        // Reset KO zoom
        koZoom = 1.0;
        koZoomTarget = 1.0;

        // Check for match end
        if (player1.wins >= WINS_NEEDED || player2.wins >= WINS_NEEDED) {
            gameState = STATE.MATCH_END;
            transitionTimer = 0;
            // Play match win or game over sound
            if (player1.wins >= WINS_NEEDED) {
                SoundManager.seMatchWin();
            } else {
                SoundManager.seGameOver();
            }
        } else {
            // Next round
            roundNum++;
            player1.reset(250);
            player2.reset(SCREEN_W - 250);
            projectiles.length = 0;
            particles.length = 0;
            gameState = STATE.FIGHT_INTRO;
            introTimer = 0;
        }
    }
}

function updateMatchEnd() {
    transitionTimer++;

    // Decay screen shake
    if (screenShake > 0) screenShake *= 0.85;
    if (screenShake < 0.5) screenShake = 0;

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        if (particles[i].life <= 0) particles.splice(i, 1);
    }

    // Spawn celebration particles
    if (transitionTimer % 10 === 0) {
        const winner = player1.wins >= WINS_NEEDED ? player1 : player2;
        spawnParticles(
            winner.x + (Math.random() - 0.5) * 60,
            winner.y - winner.height / 2,
            winner.charData.color,
            5,
            4
        );
    }

    if (transitionTimer > 90 && (wasPressed('Enter') || wasPressed('Space'))) {
        projectiles.length = 0;
        particles.length = 0;

        if (player1.wins >= WINS_NEEDED) {
            // Player won the match - arcade progression
            arcadeDefeated.push(arcadeOpponents[arcadeCurrentIndex]);
            arcadeCurrentIndex++;

            if (arcadeCurrentIndex >= arcadeOpponents.length) {
                // All opponents defeated - show ending!
                gameState = STATE.ARCADE_ENDING;
                endingTimer = 0;
                SoundManager.seEnding();
                SoundManager.playBGM('ending');
            } else {
                // More opponents - go back to map
                gameState = STATE.ARCADE_MAP;
                mapAnimTimer = 0;
                SoundManager.playBGM('map');
                mapShowingIntro = false;
                // Set up travel from last defeated to next
                const fromLoc = HAN_LOCATIONS[CHARACTERS[arcadeDefeated[arcadeDefeated.length - 1]].id];
                const toLoc = HAN_LOCATIONS[CHARACTERS[arcadeOpponents[arcadeCurrentIndex]].id];
                mapFromLocation = { x: fromLoc.x, y: fromLoc.y };
                mapToLocation = { x: toLoc.x, y: toLoc.y };
                mapTravelProgress = 0;
            }
        } else {
            // Player lost - game over, back to title
            gameState = STATE.TITLE;
            SoundManager.playBGM('title');
        }
    }
}

// ============================================================
// MAIN GAME LOOP
// ============================================================
function update() {
    // Global mute toggle (P key, works in any screen)
    if (wasPressed('KeyP')) {
        SoundManager.toggleMute();
    }

    switch (gameState) {
        case STATE.TITLE:
            updateTitle();
            break;
        case STATE.DIFFICULTY:
            updateDifficulty();
            break;
        case STATE.MANUAL:
            updateManual();
            break;
        case STATE.SETTINGS:
            updateSettings();
            break;
        case STATE.SELECT:
            updateSelect();
            break;
        case STATE.ARCADE_MAP:
            updateArcadeMap();
            break;
        case STATE.VS_SCREEN:
            updateVsScreen();
            break;
        case STATE.FIGHT_INTRO:
            updateFightIntro();
            break;
        case STATE.FIGHTING:
            updateFighting();
            break;
        case STATE.ROUND_END:
            updateRoundEnd();
            break;
        case STATE.MATCH_END:
            updateMatchEnd();
            break;
        case STATE.ARCADE_ENDING:
            updateArcadeEnding();
            break;
        case STATE.DEMO:
            updateDemo();
            break;
    }
    // Clear tap state at end of frame (consumed or not)
    lastTapX = -1;
    lastTapY = -1;
}

function drawPortraitMessage() {
    // Full canvas black background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Rotate phone icon
    ctx.save();
    ctx.translate(centerX, centerY - 80);
    ctx.rotate(Math.sin(Date.now() * 0.003) * 0.3); // gentle rocking animation
    ctx.font = '60px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('📱', 0, 0);
    ctx.restore();

    // Arrow
    ctx.font = '40px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('↪️', centerX, centerY);

    // Message
    ctx.font = "bold 24px 'Hiragino Sans', 'MS Gothic', sans-serif";
    ctx.fillStyle = '#FFD700';
    ctx.textAlign = 'center';
    ctx.fillText('スマホを横にしてください', centerX, centerY + 60);

    ctx.font = "16px 'Hiragino Sans', 'MS Gothic', sans-serif";
    ctx.fillStyle = '#999';
    ctx.fillText('画面を横向きにしてプレイしましょう', centerX, centerY + 95);

    ctx.font = "14px 'Hiragino Sans', 'MS Gothic', sans-serif";
    ctx.fillStyle = '#666';
    ctx.fillText('離れて目を休めましょう 👀', centerX, centerY + 130);
}

function draw() {
    // Portrait orientation: show rotate message instead of game
    if (isMobile && mobileIsPortrait) {
        drawPortraitMessage();
        return;
    }

    ctx.save();

    // Screen shake
    if (screenShake > 0.5) {
        ctx.translate(
            (Math.random() - 0.5) * screenShake,
            (Math.random() - 0.5) * screenShake
        );
    }

    switch (gameState) {
        case STATE.TITLE:
            drawTitleScreen();
            break;
        case STATE.DIFFICULTY:
            drawDifficultyScreen();
            break;
        case STATE.MANUAL:
            drawManualScreen();
            break;
        case STATE.SETTINGS:
            drawSettingsScreen();
            break;
        case STATE.SELECT:
            drawSelectScreen();
            break;
        case STATE.ARCADE_MAP:
            drawArcadeMapScreen();
            break;
        case STATE.VS_SCREEN:
            drawVsScreen();
            break;
        case STATE.FIGHT_INTRO:
            drawFightIntro();
            break;
        case STATE.FIGHTING:
            // Apply KO zoom during staging
            koZoom += (koZoomTarget - koZoom) * 0.06;
            if (koStaging && koZoom > 1.01) {
                ctx.save();
                ctx.translate(koFocusX, koFocusY);
                ctx.scale(koZoom, koZoom);
                ctx.translate(-koFocusX, -koFocusY);
            }
            drawBackground();
            player1.draw();
            player2.draw();
            for (const proj of projectiles) proj.draw();
            for (const p of particles) p.draw();
            drawFightUI();
            if (koStaging && koZoom > 1.01) {
                ctx.restore();
            }
            break;
        case STATE.ROUND_END:
            drawRoundEnd();
            break;
        case STATE.MATCH_END:
            drawMatchEnd();
            break;
        case STATE.ARCADE_ENDING:
            drawArcadeEnding();
            break;
        case STATE.DEMO:
            drawDemo();
            break;
    }

    // Screen flash
    if (screenFlash > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${screenFlash * 0.04})`;
        ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);
    }

    ctx.restore();

    // Global mute indicator (drawn AFTER restore, always on top)
    if (SoundManager.muted) {
        ctx.save();
        ctx.globalAlpha = 0.7 + Math.sin(Date.now() * 0.005) * 0.3;
        ctx.font = "bold 12px 'MS Gothic', monospace";
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#FF4444';
        ctx.fillText('🔇 MUTE', SCREEN_W - 10, 8);
        ctx.globalAlpha = 1;
        ctx.restore();
    }

    // Mobile virtual pad (drawn outside screen shake transform)
    drawTouchControls();
}

function gameLoop() {
    if (slowMotion > 0) {
        slowMotion--;
        // KO staging uses heavier slow (5x), normal slow uses 3x
        const slowRate = koStaging ? 5 : 3;
        if (slowMotion % slowRate !== 0) {
            // Skip update for slow motion effect but still draw
            draw();
            requestAnimationFrame(gameLoop);
            return;
        }
    }

    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start!
gameLoop();
