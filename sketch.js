let ssIdle, ssWalk, ssAction, ssCast, ssProjectile, ssNewChar, ssFall, ssSmile, ssHelper, ssChar3, ssChar4; // 新增施法、投射物與新角色的 Sprite Sheet
const animIdle = [];
const animWalk = [];
const animPlayerCast = []; // 角色1的施法動畫 (原 animAction)
const animImpact = []; // 爆炸效果 (原 animCast)
const animProjectile = [];
const animNewChar = []; // 新增：新角色的動畫陣列
const animFall = []; // 新增：角色2倒下的動畫陣列
const animSmile = []; // 新增：角色2微笑的動畫陣列
const animHelper = []; // 新增：小幫手角色的動畫陣列
const animChar3 = []; // 新增：角色3的動畫陣列
const animChar4 = []; // 新增：角色4的動畫陣列

// 站立動畫的設定
const IDLE_SS_WIDTH = 1115;
const IDLE_SS_HEIGHT = 46;
const IDLE_FRAME_COUNT = 14;

// 走路動畫的設定
const WALK_SS_WIDTH = 605;
const WALK_SS_HEIGHT = 60;
const WALK_FRAME_COUNT = 10;

// 新增：角色1施法動畫的設定
const PLAYER_CAST_SS_WIDTH = 443;
const PLAYER_CAST_SS_HEIGHT = 53;
const PLAYER_CAST_FRAME_COUNT = 7;

// 新增：爆炸效果動畫的設定
const IMPACT_SS_WIDTH = 124;
const IMPACT_SS_HEIGHT = 37;
const IMPACT_FRAME_COUNT = 3;

// 新增：投射物動畫的設定
const PROJECTILE_SS_WIDTH = 225;
const PROJECTILE_SS_HEIGHT = 40;
const PROJECTILE_FRAME_COUNT = 5;

// 新增：新角色的動畫設定
const NEWCHAR_SS_WIDTH = 107;
const NEWCHAR_SS_HEIGHT = 40;
const NEWCHAR_FRAME_COUNT = 4;

// 新增：角色2倒下動畫的設定
const FALL_SS_WIDTH = 115;
const FALL_SS_HEIGHT = 37;
const FALL_FRAME_COUNT = 4;

// 新增：角色2微笑動畫的設定 (假設尺寸與站立相似)
const SMILE_SS_WIDTH = 107;
const SMILE_SS_HEIGHT = 40;
const SMILE_FRAME_COUNT = 4;

// 新增：小幫手動畫設定
const HELPER_SS_WIDTH = 757;
const HELPER_SS_HEIGHT = 151;
const HELPER_FRAME_COUNT = 6;
const HELPER_SCALE = 0.8; // 小幫手縮放比例 (調整大小以配合主角)

// 新增：角色3動畫設定
const CHAR3_SS_WIDTH = 243;
const CHAR3_SS_HEIGHT = 68;
const CHAR3_FRAME_COUNT = 4;

// 新增：角色4動畫設定
const CHAR4_SS_WIDTH = 241;
const CHAR4_SS_HEIGHT = 65;
const CHAR4_FRAME_COUNT = 6;

// 新增：角色放大倍率
const SCALE_FACTOR = 2.5;

// 角色狀態
let charX, charY;
let speed = 5; // 增加角色移動速度 (調整為 60fps 適用的速度)
let direction = 1; // 1 for right, -1 for left

// 背景與場景切換相關
let bg1, bg2, bg3, currentBg;
let stage = 0; // 新增：場景階段計數
let isTransitioning = false;
let isFadingIn = false; // 新增：控制淡入狀態
let transitionTimer = 0;
let transitionDuration = 60; // frames for transition (調整為 60fps)
let transitionDoor = 0; // 新增：記錄轉場門的方向 (1:右, -1:左)
const portalThreshold = 120; // 在接近左邊時顯示特效
const portalX = 60;
let doorImg;
// 門開啟動畫變數
let doorOpenProgress = 0; // 0..1
let doorOpenProgressLeft = 0; // 新增：左門開啟進度
const doorOpenSpeed = 0.02;

// 新增：新角色的位置
let newCharX, newCharY;
// 新增：角色3的位置
let char3X, char3Y;
// 新增：角色4的位置
let char4X, char4Y;

// 新增：小幫手相關變數
let helperX, helperY;
let helperWrongCount = 0; // 答錯次數計數
let helperDialogue = ""; // 小幫手的對話內容

// 新增：對話系統變數
let playerInput; // 玩家的文字輸入框
let npcDialogue = "需要我解答嗎?"; // 角色2的對話內容
let isInDialogueRange = false; // 追蹤是否在對話範圍內
let isNpcHit = false; // 新增：追蹤角色2是否被擊中
let npcHitTimer = 0; // 新增：NPC被擊中時的計時器
const npcRecoveryTime = 3000; // 新增：NPC恢復時間 (3秒)
const impactEffects = []; // 新增：存放爆炸效果的陣列

// --- 測驗相關變數 ---
let quizTable; // 由 CSV 載入的表格
let questions = []; // 解析後的題庫陣列
let currentQuestion = null; // 目前出題
let questionAnswered = false; // 是否已回答（用於控制不立即重抽）
let npcSubtext = ''; // 對話框的次要文字（例如提示），會被截斷到最多 8 字

// 豐富的正/負回覆選項（每項皆短於或等於 8 字）
const positiveReplies = [
  '太棒了', '好厲害', '正確喔', '幹得漂亮', '答對啦', '真聰明', '超棒', '你最棒'
];
const negativeReplies = [
  '再試一次', '不對喔', '差一點', '再想想', '再來一次', '別放棄', '小錯誤', '加油喔'
];


// 新增：跳躍相關物理變數
let isJumping = false;
let velocityY = 0;
const gravity = 0.4;
const jumpForce = -12; // 負數表示向上
let groundY;

// 新增：施法狀態
let isCasting = false;
let castFrameCounter = 0;

// 新增：投射物管理
const projectiles = [];
const projectileSpeed = 8;

// --- 遊戲狀態與UI變數 ---
let gameState = 'LOADING'; // 'LOADING', 'TITLE', 'PLAYING'
let loadingProgress = 0;
let score = 0;
let health = 5;
let keys = 3;
const coinEffects = []; // 金幣特效陣列
let dialogueQueue = []; // 對話框佇列，用於處理重疊
let soundWin, soundLose, soundLight, soundMusic; // 音效變數

// --- 新增：遊戲結束與特殊關卡變數 ---
let isGameOver = false;
let gameOverPhase = 0; // 0:炸彈飛入, 1:爆炸, 2:倒下, 3:布幕
let bombObj = null;
let curtainHeight = 0;
let isPlayerVisible = true;

// --- 新增：優化功能變數 ---
let screenShakeTimer = 0;
let screenShakeIntensity = 0;
let isPaused = false;
let isMuted = false;
let isInvincible = false;
let invincibleEndTime = 0;

// 打字機效果
let targetNpcDialogue = "需要我解答嗎?";
let currentNpcDialogue = "";

// Boss 血量
let char3Health = 100;
let char3MaxHealth = 100;
let isBossDead = false;

// Bg3 平台與愛心
let bg3Platforms = [];
let bg3Hearts = [];

// Bg2 Boss戰
let isBossFight = false;
let bossFightPhase = 'OFF'; // 新增：Boss戰階段 (OFF, PREPARING, FIGHTING)
let bossFightTimer = 0;     // 新增：Boss戰倒數計時器
let bossArrowTimer = 0;
let bossArrows = [];
let bossArrowCount = 0;
let bossHitsReceived = 0;
let droppedKey = null;
let particles = []; // 新增：粒子系統陣列

// 預先載入資源
function preload() {
  // 載入站立、走路和新動作的圖片精靈
  ssIdle = loadImage('1/1all.png');
  ssWalk = loadImage('2/2all.png');
  ssAction = loadImage('3/3all.png'); // 跳躍動畫使用 '3/3all.png'
  ssCast = loadImage('4/4all.png');
  ssProjectile = loadImage('5/5all.png');
  ssNewChar = loadImage('6/stop/6-1.png'); // 載入新角色的圖片
  ssFall = loadImage('6/fall/6-3.png'); // 載入新角色倒下的圖片
  ssSmile = loadImage('6/smile/6-2.png'); // 載入新角色微笑的圖片
  ssHelper = loadImage('8/8all.png'); // 載入小幫手圖片
  ssChar3 = loadImage('9/9all.png'); // 載入角色3圖片
  ssChar4 = loadImage('10/10all.png'); // 載入角色4圖片
  // 載入背景圖（全螢幕場景）
  bg1 = loadImage('7/pngtree-pixel-game-background-pixel-game-landscape-image_1342443.jpg');
  bg2 = loadImage('7/pngtree-nobody-interface-of-pixel-game-platform-image_1436145.jpg');
  bg3 = loadImage('7/—Pngtree—pixel game scene blue sky_17640434.png');
  // 載入門圖片
  doorImg = loadImage('7/Gemini_Generated_Image_1q67w01q67w01q67.png');
  // 載入測驗卷 CSV（header 格式）
  quizTable = loadTable('quiz.csv', 'csv', 'header');
}

function setup() {
  // 建立一個全螢幕的畫布
  createCanvas(windowWidth, windowHeight);

  // 在 setup 中載入音效，避免因為檔案遺失導致 preload 卡住而無法顯示畫面
  // 檢查 loadSound 是否存在 (避免沒有 p5.sound library 時報錯)
  if (typeof loadSound === 'function') {
    soundWin = loadSound('win.mp3', () => console.log('win.mp3 loaded'), () => console.log('win.mp3 failed'));
    soundLose = loadSound('lose.mp3', () => console.log('lose.mp3 loaded'), () => console.log('lose.mp3 failed'));
    soundLight = loadSound('light.mp3', () => console.log('light.mp3 loaded'), () => console.log('light.mp3 failed'));
    soundMusic = loadSound('music.mp3', () => console.log('music.mp3 loaded'), () => console.log('music.mp3 failed'));
  }

  // 初始化角色位置
  charX = width / 2;
  groundY = height * 0.75; // 將初始Y設為地面 (y軸下降)
  charY = groundY;

  // 新增：初始化新角色的位置
  newCharX = charX - 150; // 在主角色左邊 150px
  newCharY = groundY;

  // 新增：初始化角色3位置 (在 bg2 中，玩家在左側，角色3在右側)
  char3X = width - 200; // 放在背景2螢幕的最右邊
  char3Y = groundY;

  // 新增：初始化角色4位置 (在 bg3 中)
  char4X = 200;
  char4Y = groundY;

  // 新增：初始化小幫手位置 (在主角左邊)
  helperX = charX - 80; // 調整距離更貼近
  helperY = groundY;

  // 新增：創建文字輸入框並隱藏
  playerInput = createInput('');
  playerInput.hide();
  playerInput.attribute('placeholder', '輸入答案並按 Enter');
  playerInput.size(120, 24);
  // 當輸入完成 (按下Enter或失去焦點) 時，觸發 updateNpcDialogue 函式
  playerInput.changed(updateNpcDialogue);

  // 解析 quizTable（若有載入）為 questions 陣列
  if (quizTable && quizTable.getRowCount && quizTable.getRowCount() > 0) {
    for (let r = 0; r < quizTable.getRowCount(); r++) {
      const row = quizTable.getRow(r);
      questions.push({
        question: row.get('question'),
        answer: row.get('answer'),
        correct_feedback: row.get('correct_feedback'),
        wrong_feedback: row.get('wrong_feedback'),
        hint: row.get('hint')
      });
    }
  }


  // --- 處理站立動畫 ---
  const idleFrameWidth = IDLE_SS_WIDTH / IDLE_FRAME_COUNT;
  for (let i = 0; i < IDLE_FRAME_COUNT; i++) {
    let frame = ssIdle.get(i * idleFrameWidth, 0, idleFrameWidth, IDLE_SS_HEIGHT);
    animIdle.push(frame);
  }

  // --- 處理走路動畫 ---
  const walkFrameWidth = WALK_SS_WIDTH / WALK_FRAME_COUNT;
  for (let i = 0; i < WALK_FRAME_COUNT; i++) {
    let frame = ssWalk.get(i * walkFrameWidth, 0, walkFrameWidth, WALK_SS_HEIGHT);
    animWalk.push(frame);
  }

  // --- 處理角色1施法動畫 ---
  const playerCastFrameWidth = PLAYER_CAST_SS_WIDTH / PLAYER_CAST_FRAME_COUNT;
  for (let i = 0; i < PLAYER_CAST_FRAME_COUNT; i++) {
    let frame = ssAction.get(i * playerCastFrameWidth, 0, playerCastFrameWidth, PLAYER_CAST_SS_HEIGHT);
    animPlayerCast.push(frame);
  }

  // --- 處理爆炸效果動畫 ---
  const impactFrameWidth = IMPACT_SS_WIDTH / IMPACT_FRAME_COUNT;
  for (let i = 0; i < IMPACT_FRAME_COUNT; i++) {
    let frame = ssCast.get(i * impactFrameWidth, 0, impactFrameWidth, IMPACT_SS_HEIGHT);
    animImpact.push(frame);
  }

  // --- 處理投射物動畫 ---
  const projectileFrameWidth = PROJECTILE_SS_WIDTH / PROJECTILE_FRAME_COUNT;
  for (let i = 0; i < PROJECTILE_FRAME_COUNT; i++) {
    let frame = ssProjectile.get(i * projectileFrameWidth, 0, projectileFrameWidth, PROJECTILE_SS_HEIGHT);
    animProjectile.push(frame);
  }

  // --- 處理新角色的動畫 ---
  // 新增：移除背景色
  // 遍歷圖片的每個像素，將洋紅色背景變為透明
  ssNewChar.loadPixels();
  for (let i = 0; i < ssNewChar.pixels.length; i += 4) {
    // 檢查是否為洋紅色 (R:255, G:0, B:255)
    if (ssNewChar.pixels[i] === 255 && ssNewChar.pixels[i + 1] === 0 && ssNewChar.pixels[i + 2] === 255) {
      // 將其 alpha 值設為 0 (完全透明)
      ssNewChar.pixels[i + 3] = 0;
    }
  }
  ssNewChar.updatePixels();

  const newCharFrameWidth = NEWCHAR_SS_WIDTH / NEWCHAR_FRAME_COUNT;
  for (let i = 0; i < NEWCHAR_FRAME_COUNT; i++) {
    let frame = ssNewChar.get(i * newCharFrameWidth, 0, newCharFrameWidth, NEWCHAR_SS_HEIGHT);
    animNewChar.push(frame);
  }

  // --- 處理倒下動畫 ---
  // 新增：移除背景色
  ssFall.loadPixels();
  for (let i = 0; i < ssFall.pixels.length; i += 4) {
    // 檢查是否為洋紅色 (R:255, G:0, B:255)
    if (ssFall.pixels[i] === 255 && ssFall.pixels[i + 1] === 0 && ssFall.pixels[i + 2] === 255) {
      // 將其 alpha 值設為 0 (完全透明)
      ssFall.pixels[i + 3] = 0;
    }
  }
  ssFall.updatePixels();
  const fallFrameWidth = FALL_SS_WIDTH / FALL_FRAME_COUNT;
  for (let i = 0; i < FALL_FRAME_COUNT; i++) {
    let frame = ssFall.get(i * fallFrameWidth, 0, fallFrameWidth, FALL_SS_HEIGHT);
    animFall.push(frame);
  }

  // --- 處理微笑動畫 ---
  // 新增：移除背景色
  ssSmile.loadPixels();
  for (let i = 0; i < ssSmile.pixels.length; i += 4) {
    // 檢查是否為洋紅色 (R:255, G:0, B:255)
    if (ssSmile.pixels[i] === 255 && ssSmile.pixels[i + 1] === 0 && ssSmile.pixels[i + 2] === 255) {
      // 將其 alpha 值設為 0 (完全透明)
      ssSmile.pixels[i + 3] = 0;
    }
  }
  ssSmile.updatePixels();
  const smileFrameWidth = SMILE_SS_WIDTH / SMILE_FRAME_COUNT;
  for (let i = 0; i < SMILE_FRAME_COUNT; i++) {
    let frame = ssSmile.get(i * smileFrameWidth, 0, smileFrameWidth, SMILE_SS_HEIGHT);
    animSmile.push(frame);
  }

  // --- 處理小幫手動畫 ---
  // 移除背景色 (洋紅色)
  ssHelper.loadPixels();
  for (let i = 0; i < ssHelper.pixels.length; i += 4) {
    if (ssHelper.pixels[i] === 255 && ssHelper.pixels[i + 1] === 0 && ssHelper.pixels[i + 2] === 255) {
      ssHelper.pixels[i + 3] = 0;
    }
  }
  ssHelper.updatePixels();
  
  const helperFrameWidth = HELPER_SS_WIDTH / HELPER_FRAME_COUNT;
  for (let i = 0; i < HELPER_FRAME_COUNT; i++) {
    let frame = ssHelper.get(i * helperFrameWidth, 0, helperFrameWidth, HELPER_SS_HEIGHT);
    animHelper.push(frame);
  }

  // --- 處理角色3動畫 ---
  // 移除背景色 (洋紅色)
  ssChar3.loadPixels();
  for (let i = 0; i < ssChar3.pixels.length; i += 4) {
    if (ssChar3.pixels[i] === 255 && ssChar3.pixels[i + 1] === 0 && ssChar3.pixels[i + 2] === 255) {
      ssChar3.pixels[i + 3] = 0;
    }
  }
  ssChar3.updatePixels();
  const char3FrameWidth = CHAR3_SS_WIDTH / CHAR3_FRAME_COUNT;
  for (let i = 0; i < CHAR3_FRAME_COUNT; i++) {
    let frame = ssChar3.get(i * char3FrameWidth, 0, char3FrameWidth, CHAR3_SS_HEIGHT);
    animChar3.push(frame);
  }

  // --- 處理角色4動畫 ---
  // 移除背景色 (洋紅色)
  ssChar4.loadPixels();
  for (let i = 0; i < ssChar4.pixels.length; i += 4) {
    if (ssChar4.pixels[i] === 255 && ssChar4.pixels[i + 1] === 0 && ssChar4.pixels[i + 2] === 255) {
      ssChar4.pixels[i + 3] = 0;
    }
  }
  ssChar4.updatePixels();
  const char4FrameWidth = CHAR4_SS_WIDTH / CHAR4_FRAME_COUNT;
  for (let i = 0; i < CHAR4_FRAME_COUNT; i++) {
    let frame = ssChar4.get(i * char4FrameWidth, 0, char4FrameWidth, CHAR4_SS_HEIGHT);
    animChar4.push(frame);
  }

  // 設定動畫播放速度 (每秒 8 格)，放慢速度
  frameRate(60); // 提升幀率以獲得流暢移動

  // 讓圖片繪製的基準點在圖片的中心
  imageMode(CENTER);
  // 預設背景為第一張
  currentBg = bg1;

  // 如果門圖片存在，嘗試去背（把洋紅色背景變透明）
  if (doorImg) {
    try {
      doorImg.loadPixels();
      for (let i = 0; i < doorImg.pixels.length; i += 4) {
        if (doorImg.pixels[i] === 255 && doorImg.pixels[i + 1] === 0 && doorImg.pixels[i + 2] === 255) {
          doorImg.pixels[i + 3] = 0;
        }
      }
      doorImg.updatePixels();
    } catch (e) {
      // 若無法直接操作像素（跨域或尚未載入），忽略
    }
  }

  // 初始化 Bg3 平台 (模擬背景圖上的台階)
  bg3Platforms = [
    {x: width * 0.15, y: height * 0.6, w: 150},
    {x: width * 0.35, y: height * 0.5, w: 150},
    {x: width * 0.55, y: height * 0.4, w: 150},
    {x: width * 0.75, y: height * 0.5, w: 150}
  ];
  // 初始化 Bg3 愛心
  for(let p of bg3Platforms) {
    bg3Hearts.push({x: p.x + p.w/2, y: p.y - 20, active: true});
  }
  
  // 初始化打字機文字
  currentNpcDialogue = "";
}

// 新增：當玩家輸入後更新NPC對話的函式
function updateNpcDialogue() {
  const inputText = (playerInput.value() || '').trim();
  if (!currentQuestion) {
    setNpcDialogue(`${inputText}, 歡迎你`);
    playerInput.value('');
    return;
  }

  // 以文字比對（忽略大小寫與空白）
  const normalize = s => s.toString().replace(/\s+/g, '').toLowerCase();
  const userNorm = normalize(inputText);
  const answerNorm = normalize(currentQuestion.answer || '');

  if (userNorm && userNorm === answerNorm) {
    score += 10; // 答對加分
    if (soundWin && soundWin.isLoaded && soundWin.isLoaded()) soundWin.play(); // 播放勝利音效
    coinEffects.push({ x: charX, y: charY - 80, life: 90 }); // 觸發金幣特效 (調整 life 適應 60fps)
    setNpcDialogue(currentQuestion.correct_feedback || '答對了！');
    npcSubtext = '';
    questionAnswered = true;
    playerInput.value('');
    setTimeout(() => {
      pickRandomQuestion();
    }, 1400);
    // 答對時重置小幫手狀態
    helperWrongCount = 0;
    helperDialogue = "";
  } else {
    health = max(0, health - 0.5); // 答錯扣半顆心
    if (soundLose && soundLose.isLoaded && soundLose.isLoaded()) soundLose.play(); // 播放失敗音效
    npcDialogue = currentQuestion.wrong_feedback || truncateTo8(random(negativeReplies));
    npcSubtext = currentQuestion.hint || '';
    playerInput.value('');
    
    // 答錯時，小幫手計數並提供協助
    helperWrongCount++;
    if (helperWrongCount > 3) {
      helperDialogue = "答案是:\n" + (currentQuestion.answer || "");
    } else {
      helperDialogue = "提示:\n" + (currentQuestion.hint || "再想想看");
    }
  }
}

// 設定對話並重置打字機
function setNpcDialogue(text) {
  targetNpcDialogue = text;
  currentNpcDialogue = "";
}

// 從題庫隨機抽一題並設定為當前題目
function pickRandomQuestion() {
  if (!questions || questions.length === 0) return;
  const idx = floor(random(questions.length));
  currentQuestion = questions[idx];
  // 顯示題目為主回覆，次要文字清空
  setNpcDialogue(wrapTextByChars(currentQuestion.question, 8));
  npcSubtext = '';
  questionAnswered = false;
  // 換題時重置小幫手
  helperWrongCount = 0;
  helperDialogue = "";
}

// 將字串截斷為最多 8 個中文字（若超過則取前 8 字）
function truncateTo8(s) {
  if (!s) return '';
  // 簡單以字元數截斷；對於英文/混合情境可視作近似
  return s.toString().slice(0, 8);
}

// 每 N 個字元換行（支援 Unicode 字元）
function wrapTextByChars(s, n) {
  if (!s) return '';
  const chars = Array.from(s.toString());
  let out = '';
  for (let i = 0; i < chars.length; i++) {
    out += chars[i];
    if ((i + 1) % n === 0 && i !== chars.length - 1) out += '\n';
  }
  return out;
}

// 使用 keyPressed 處理單次觸發的動作，如跳躍
function keyPressed() {
  if (gameState === 'TITLE' && keyCode === ENTER) {
    gameState = 'PLAYING';
    return;
  }
  // 暫停功能
  if (key === 'p' || key === 'P' || key === ' ') {
    isPaused = !isPaused;
    if (isPaused) playerInput.hide(); // 暫停時隱藏輸入框
    else if (isInDialogueRange) playerInput.show();
  }
  // 遊戲結束重來
  if (isGameOver && (key === 'r' || key === 'R')) {
    resetGame();
    return;
  }
  if (gameState !== 'PLAYING') return;

  if (isPaused) return; // 暫停時不處理操作

  // 跳躍
  if (keyCode === UP_ARROW && !isJumping) {
    isJumping = true;
    velocityY = jumpForce;
  }
  // 施法 (向下方向鍵)
  if (keyCode === DOWN_ARROW && !isJumping && !isCasting) {
    isCasting = true;
    if (soundLight && soundLight.isLoaded && soundLight.isLoaded()) soundLight.play(); // 播放激光音效
  }
  // 按 H 鍵顯示提示
  if (keyCode === 72) { // 'H' key
    if (helperDialogue) {
      helperDialogue = ""; // 如果已有提示，再次按下則關閉
    } else {
      if (currentQuestion && !questionAnswered) {
        if (keys > 0) {
          keys--;
          helperDialogue = "提示:\n" + (currentQuestion.hint || "沒有提示");
        } else {
          helperDialogue = "鑰匙不足！";
        }
      } else {
        helperDialogue = "目前沒有題目";
      }
    }
  }
  // Boss戰觸發 (在 Bg2 且接近角色3)
  if (currentBg === bg2 && (key === 'f' || key === 'F') && !isBossFight && !droppedKey) {
    if (abs(charX - char3X) < 300) {
      startBossFight();
    }
  }
}

function draw() {
  dialogueQueue = []; // 每幀重置對話框佇列
  if (gameState === 'LOADING') {
    drawLoadingScreen();
    return;
  }
  if (gameState === 'TITLE') {
    drawTitleScreen();
    return;
  }
  
  // 暫停畫面處理
  if (isPaused) {
    drawGameScene(false); // 繪製但不更新
    drawPauseOverlay();
    return;
  }

  // --- 檢查遊戲結束狀態 ---
  if (health <= 0 && !isGameOver) {
    startGameOver();
  }
  if (isGameOver) {
    drawGameOverSequence();
    return; // 遊戲結束時停止繪製其他遊戲邏輯
  }
  
  drawGameScene(true); // 正常繪製並更新
}

// 將主要的遊戲繪製邏輯提取出來，增加 update 參數控制是否更新邏輯
function drawGameScene(doUpdate) {
  // --- 打字機效果更新 ---
  if (doUpdate && currentNpcDialogue.length < targetNpcDialogue.length) {
    // 每 3 幀增加一個字
    if (frameCount % 3 === 0) {
      currentNpcDialogue += targetNpcDialogue[currentNpcDialogue.length];
      // 這裡可以加入打字音效
    }
  }

  // --- 畫面震動 ---
  push();
  if (screenShakeTimer > 0) {
    translate(random(-screenShakeIntensity, screenShakeIntensity), random(-screenShakeIntensity, screenShakeIntensity));
    if (doUpdate) screenShakeTimer--;
  }

  // 繪製全螢幕背景（以目前場景為主）
  if (currentBg) {
    image(currentBg, width / 2, height / 2, width, height);
  } else {
    background('#ff66d8');
  }

  // --- 新增：繪製 Bg3 平台 (透明台階) ---
  if (currentBg === bg3) {
    push();
    fill(255, 255, 255, 100); // 半透明白色
    noStroke();
    rectMode(CORNER); // 確保與碰撞邏輯 (x, y, w) 一致
    for (let p of bg3Platforms) {
      rect(p.x, p.y, p.w, 20); // 繪製台階
    }
    pop();
  }

  // 左側接近檢測：顯示門與進入提示（需要按左箭頭進入）
  const portalY = groundY || height / 2;
  // 兩側門繪製：門高度對齊角色高度，並在同一水平線
    const portalRightX = width - portalX;
    const portalLeftX = portalX; // 新增：左門位置
    // 計算門顯示尺寸，與角色 idle 幀高度匹配
    let desiredDoorH = 120;
    if (animIdle && animIdle.length > 0 && animIdle[0]) {
      desiredDoorH = animIdle[0].height * SCALE_FACTOR;
    }
    if (doorImg) {
      const doorW = doorImg.width * (desiredDoorH / doorImg.height);
      const halfSrcW = doorImg.width / 2;

      // 控制門開啟進度（靠近右門則開啟，離開則關閉）
      const nearRight = abs(charX - portalRightX) < portalThreshold;
      if (nearRight && doUpdate) {
        doorOpenProgress = min(1, doorOpenProgress + doorOpenSpeed);
      } else {
        doorOpenProgress = max(0, doorOpenProgress - doorOpenSpeed);
      }

      // 開門偏移量（以顯示寬度為基準）
      const openOffset = doorOpenProgress * (doorW * 0.5);

      // 畫門左半，並向左滑動
      image(doorImg, portalRightX - doorW / 4 - openOffset, portalY - desiredDoorH / 2, doorW / 2, desiredDoorH,
            0, 0, halfSrcW, doorImg.height);
      // 畫門右半，並向右滑動
      image(doorImg, portalRightX + doorW / 4 + openOffset, portalY - desiredDoorH / 2, doorW / 2, desiredDoorH,
            halfSrcW, 0, halfSrcW, doorImg.height);

      // --- 新增：左門繪製邏輯 ---
      const nearLeft = abs(charX - portalLeftX) < portalThreshold;
      if (nearLeft && doUpdate) {
        doorOpenProgressLeft = min(1, doorOpenProgressLeft + doorOpenSpeed);
      } else {
        doorOpenProgressLeft = max(0, doorOpenProgressLeft - doorOpenSpeed);
      }
      const openOffsetLeft = doorOpenProgressLeft * (doorW * 0.5);
      // 畫左門左半
      image(doorImg, portalLeftX - doorW / 4 - openOffsetLeft, portalY - desiredDoorH / 2, doorW / 2, desiredDoorH,
            0, 0, halfSrcW, doorImg.height);
      // 畫左門右半
      image(doorImg, portalLeftX + doorW / 4 + openOffsetLeft, portalY - desiredDoorH / 2, doorW / 2, desiredDoorH,
            halfSrcW, 0, halfSrcW, doorImg.height);
    } else {
      // 若沒有門圖片，顯示簡易門方塊作為替代（右側）
      push();
      fill(80, 40, 20);
      rectMode(CENTER);
      rect(portalRightX, portalY - desiredDoorH / 2, desiredDoorH * 0.5, desiredDoorH, 6);
      pop();
      // 模擬開門進度（無圖仍顯示開門進度指示）
      const nearRight = abs(charX - portalRightX) < portalThreshold;
      if (nearRight && doUpdate) {
        doorOpenProgress = min(1, doorOpenProgress + doorOpenSpeed);
      } else {
        doorOpenProgress = max(0, doorOpenProgress - doorOpenSpeed);
      }

      // 新增：左側簡易門替代
      push();
      fill(80, 40, 20);
      rectMode(CENTER);
      rect(portalLeftX, portalY - desiredDoorH / 2, desiredDoorH * 0.5, desiredDoorH, 6);
      pop();
      const nearLeft = abs(charX - portalLeftX) < portalThreshold;
      if (nearLeft && doUpdate) {
        doorOpenProgressLeft = min(1, doorOpenProgressLeft + doorOpenSpeed);
      } else {
        doorOpenProgressLeft = max(0, doorOpenProgressLeft - doorOpenSpeed);
      }
    }

    // 若門已接近開啟且玩家在門附近，顯示按右箭頭進入提示
    if (doorOpenProgress > 0.8 && abs(charX - portalRightX) < portalThreshold) {
      drawDialogueBox(portalRightX, portalY - desiredDoorH - 20, '按 → 進入', '#333333', '#ffffff');
    }
    // 新增：左門提示
    if (doorOpenProgressLeft > 0.8 && abs(charX - portalLeftX) < portalThreshold) {
      drawDialogueBox(portalLeftX, portalY - desiredDoorH - 20, '按 ← 進入', '#333333', '#ffffff');
    }

  // 若正在轉場，使用圓形縮小特效 (Iris Out)
  if (isTransitioning) {
    if (doUpdate) transitionTimer++;
    
    // 計算圓形遮罩參數
    const maxD = max(width, height) * 2.5; // 足夠覆蓋螢幕的直徑
    const progress = transitionTimer / transitionDuration;
    const currentD = map(progress, 0, 1, maxD, 0); // 從大變小

    push();
    noFill();
    stroke(0);
    strokeWeight(maxD); // 超粗邊框作為遮罩
    // 圓心對準角色中心 (假設角色高度約 100px，中心上移 50px)
    ellipse(charX, charY - 50, currentD + maxD, currentD + maxD);
    pop();

    if (transitionTimer >= transitionDuration) {
      // 切換背景邏輯
      // 根據當前場景 (stage) 與進入的門 (transitionDoor) 決定去向
      if (stage === 0) { // 目前在 bg1 (中心)
        if (transitionDoor === 1) { // 進右門 -> 去 bg2
          stage = 1;
          currentBg = bg2;
          charX = 120; // 出現在左側
          isNpcHit = false; // 重置 NPC 擊中狀態
        } else { // 進左門 -> 去 bg3
          stage = 2;
          currentBg = bg3;
          charX = width - 120; // 出現在右側
          isNpcHit = false; // 重置 NPC 擊中狀態
        }
      } else if (stage === 1) { // 目前在 bg2 (右側場景)
        if (transitionDoor === -1) { // 進左門 -> 回 bg1
          stage = 0;
          currentBg = bg1;
          charX = width - 120; // 出現在右側
          isNpcHit = false; // 重置 NPC 擊中狀態
        } else {
          charX = width - 180; // 右門無路，彈回
        }
      } else if (stage === 2) { // 目前在 bg3 (左側場景)
        if (transitionDoor === 1) { // 進右門 -> 回 bg1
          stage = 0;
          currentBg = bg1;
          charX = 120; // 出現在左側
          isNpcHit = false; // 重置 NPC 擊中狀態
        } else {
          charX = 180; // 左門無路，彈回
        }
      }

      helperX = charX - (direction * 80); // 小幫手跟著重置位置 (根據方向)
      isTransitioning = false;
      isFadingIn = true; // 開始淡入 (Iris In)
      transitionTimer = 0;
    }
  } else if (isFadingIn) {
    // 畫面淡入，使用圓形放大特效 (Iris In)
    if (doUpdate) transitionTimer++;
    
    const maxD = max(width, height) * 2.5;
    const progress = transitionTimer / transitionDuration;
    const currentD = map(progress, 0, 1, 0, maxD); // 從小變大

    push();
    noFill();
    stroke(0);
    strokeWeight(maxD);
    ellipse(charX, charY - 50, currentD + maxD, currentD + maxD);
    pop();

    if (transitionTimer >= transitionDuration) {
      isFadingIn = false;
      transitionTimer = 0;
    }
  }

  // --- 1. 物理計算 (處理跳躍與平台) ---
  let isSupported = false;

  // 檢查 Bg3 的平台碰撞 (僅在更新時計算)
  if (currentBg === bg3) {
    for (let p of bg3Platforms) {
      // 簡單的平台碰撞：當角色向下落且腳部位置在平台範圍內
      if (velocityY >= 0 && charX > p.x && charX < p.x + p.w) {
        // 判斷高度是否剛好在平台上 (加上一些寬容度)
        if (charY <= p.y && charY + velocityY + gravity >= p.y) {
          charY = p.y;
          velocityY = 0;
          isJumping = false;
          isSupported = true;
        }
      }
    }
  }

  // 檢查地面碰撞
  if (charY >= groundY && velocityY >= 0) {
    charY = groundY;
    isJumping = false;
    velocityY = 0;
    isSupported = true;
  }

  // 如果沒有支撐點 (不在地面也不在平台)，則應用重力
  if (!isSupported && doUpdate) {
    velocityY += gravity;
    charY += velocityY;
    // 如果原本在走動但走出了邊緣，視為掉落
    if (!isJumping && velocityY > 1) {
      isJumping = true;
    }
  }

  // --- 2. 水平移動與方向更新 ---
  // 只有在不施法的時候才能移動
  let isWalking = false;
  if (!isCasting && !isTransitioning && !isFadingIn && doUpdate) {
    if (keyIsDown(RIGHT_ARROW)) {
      isWalking = true;
      direction = 1;
      charX += speed;

      // 自動進入右門轉場
      const portalRightX = width - portalX;
      if (abs(charX - portalRightX) < 50) {
        isTransitioning = true;
        transitionDoor = 1; // 標記進入右門
        transitionTimer = 0;
      }
    } else if (keyIsDown(LEFT_ARROW)) {
      isWalking = true;
      direction = -1;
      charX -= speed;

      // 新增：自動進入左門轉場
      const portalLeftX = portalX;
      if (abs(charX - portalLeftX) < 50) {
        isTransitioning = true;
        transitionDoor = -1; // 標記進入左門
        transitionTimer = 0;
      }
    }
  }

  // --- 新增：Boss戰異空間背景特效 (在角色繪製前繪製，使角色透出) ---
  if (isBossFight) {
    drawBossFightBackground();
  }

  // --- 3. 根據狀態繪製角色 ---
  // 無敵時間閃爍處理
  if (isInvincible) {
    if (doUpdate && millis() > invincibleEndTime) {
      isInvincible = false;
      isPlayerVisible = true; // 確保無敵結束後角色可見
    } else {
      if (frameCount % 10 < 5) isPlayerVisible = false; else isPlayerVisible = true;
    }
  }

  if (isPlayerVisible) {
  push();
  // 走路起伏動畫 (Bobbing)
  let bobY = 0;
  if (isWalking) {
    bobY = sin(frameCount * 0.8) * 3;
  }
  translate(charX, charY + bobY);
  if (direction === -1) {
    scale(-1, 1);
  }

  let frameToDraw;

  // 優先處理施法動畫
  if (isCasting) {
    const frameIndex = floor(castFrameCounter);

    // 檢查索引是否在動畫陣列範圍內
    if (frameIndex < PLAYER_CAST_FRAME_COUNT) {
      // 在施法期間，將要繪製的影格設定為施法動畫
      frameToDraw = animPlayerCast[frameIndex];
    }

    if (doUpdate) castFrameCounter += 0.15; // 控制施法動畫速度, 根據動畫幀數調整 (60fps)
    if (castFrameCounter >= PLAYER_CAST_FRAME_COUNT) {
      isCasting = false;
      castFrameCounter = 0;
      projectiles.push({ x: charX, y: charY, direction: direction });
      // 動畫結束後，立即根據當前移動狀態決定下一幀，避免卡住
      if (isWalking) {
        frameToDraw = animWalk[floor(frameCount / 6) % animWalk.length];
      } else {
        frameToDraw = animIdle[floor(frameCount / 8) % animIdle.length];
      }
    }

  // 如果不施法，才判斷其他狀態
  } else if (isJumping) {
    frameToDraw = animPlayerCast[floor(frameCount / 8) % animPlayerCast.length]; // 跳躍時也使用此動畫
  } else if (isWalking) {
    frameToDraw = animWalk[floor(frameCount / 6) % animWalk.length];
  } else { // idle
    frameToDraw = animIdle[floor(frameCount / 8) % animIdle.length];
  }

  // 如果有需要繪製的影格，才進行繪製
  if (frameToDraw) {
    image(frameToDraw, 0, 0, frameToDraw.width * SCALE_FACTOR, frameToDraw.height * SCALE_FACTOR);
  }

  pop(); // 恢復到之前的繪圖狀態
  }

  // 如果玩家在對話範圍內，於角色1 的對話框內顯示黃色提示（主文字為「請作答」，次文字為目前輸入）
  if (isInDialogueRange) {
    const inputTextForBox = (playerInput && playerInput.value) ? playerInput.value() : '';
    const main = '請作答';
    const sub = inputTextForBox;
    // 使用現有的 drawDialogueBox 以統一樣式，背景為黃色，文字為黑色
    drawDialogueBox(charX, charY - 150, main, '#FFD54A', '#000000', sub);
  }

  // --- 繪製新角色 ---
  // 檢查動畫是否都已載入
  // 且只在背景1 (bg1) 顯示
  if (currentBg === bg1 && animNewChar.length > 0 && animSmile.length > 0 && animFall.length > 0) {
    let frameToDrawNewChar;
    const proximityThreshold = 200; // 判斷為「接近」的距離 (像素)，增加觸發距離
    const distance = abs(charX - newCharX); // 計算兩個角色之間的距離
    const currentlyInRange = distance < proximityThreshold;

    // 檢查NPC是否應該從被擊中狀態恢復
    if (isNpcHit && millis() - npcHitTimer > npcRecoveryTime) {
      isNpcHit = false; // 恢復正常狀態
    }

    // 優先判斷是否被擊中
    if (isNpcHit && currentBg === bg1) {
      frameToDrawNewChar = animFall[floor(frameCount / 8) % animFall.length];
      playerInput.hide(); // 如果被擊中，隱藏輸入框
    } else {
      // 如果沒被擊中，才進行對話判斷
      if (currentlyInRange) {
        frameToDrawNewChar = animSmile[floor(frameCount / 8) % animSmile.length];
        // 若還沒有題目則抽題
        if (!currentQuestion && !questionAnswered) {
          pickRandomQuestion();
        }
        // 繪製角色2的對話框（主文字 + 次要提示）
        drawDialogueBox(newCharX, newCharY - 100, currentNpcDialogue, '#4281a4', '#ffede1', npcSubtext);

        // 顯示並定位玩家的輸入框
        playerInput.show();
        playerInput.position(charX - playerInput.width / 2, charY - 120);

        // 更新狀態
        isInDialogueRange = true;
      } else {
        // 否則，播放原本的站立動畫
        frameToDrawNewChar = animNewChar[floor(frameCount / 8) % animNewChar.length];
        // 如果是剛從對話範圍離開，則隱藏輸入框並重設對話
        if (isInDialogueRange) {
          playerInput.hide();
          setNpcDialogue("需要我解答嗎?"); // 重設NPC的對話
          // 離開對話範圍時重設當前題目
          currentQuestion = null;
          questionAnswered = false;
          npcSubtext = '';
          isInDialogueRange = false;
        }
      }
    }

    // 由於我們在 setup() 中設定了 imageMode(CENTER)，這裡的 x, y 座標就是圖片中心點
    // 直接在它的位置上繪製，不需 push/pop 或 translate，因為它不受翻轉影響
    image(frameToDrawNewChar, newCharX, newCharY, frameToDrawNewChar.width * SCALE_FACTOR, frameToDrawNewChar.height * SCALE_FACTOR);
  }

  // --- 繪製角色3 (只在 bg2 顯示) ---
  if (currentBg === bg2 && animChar3.length > 0 && !isBossDead) {
    const proximityThreshold = 200;
    const distance = abs(charX - char3X);
    const currentlyInRange = distance < proximityThreshold;

    // 計算角色2的尺寸，用於統一大小
    const char2W = (NEWCHAR_SS_WIDTH / NEWCHAR_FRAME_COUNT) * SCALE_FACTOR;
    const char2H = NEWCHAR_SS_HEIGHT * SCALE_FACTOR;

    // 繪製角色3 (循環播放)
    const frameToDraw = animChar3[floor(frameCount / 8) % animChar3.length];
    image(frameToDraw, char3X, char3Y, char2W, char2H); // 使用角色2的尺寸

    // 提示按 F 戰鬥
    if (currentlyInRange && !isBossFight && !droppedKey && !isBossDead) {
      drawDialogueBox(char3X, char3Y - 160, "按 F 單挑", '#ff0000', '#ffffff');
    }

    // 對話互動邏輯 (與角色2類似)
    if (currentlyInRange) {
      // 若還沒有題目則抽題
      if (!currentQuestion && !questionAnswered) {
        pickRandomQuestion();
      }
      // 繪製對話框
      drawDialogueBox(char3X, char3Y - 100, currentNpcDialogue, '#4281a4', '#ffede1', npcSubtext);

      // 顯示並定位玩家的輸入框
      playerInput.show();
      playerInput.position(charX - playerInput.width / 2, charY - 120);

      isInDialogueRange = true;
    } else {
      // 如果是剛從對話範圍離開，則隱藏輸入框並重設對話
      // 需確認當前是在 bg2 且之前在範圍內
      if (isInDialogueRange && currentBg === bg2) {
        playerInput.hide();
        setNpcDialogue("需要我解答嗎?");
        currentQuestion = null;
        questionAnswered = false;
        npcSubtext = '';
        isInDialogueRange = false;
      }
    }
  } else if (currentBg === bg2 && isBossDead) {
    // Boss 死亡動畫
    let fallFrame = animFall[min(floor((millis() - bossDeathTimer)/100), animFall.length-1)];
    if (fallFrame) image(fallFrame, char3X, char3Y, fallFrame.width * SCALE_FACTOR, fallFrame.height * SCALE_FACTOR);
    
    // 動畫播完掉鑰匙
    if (millis() - bossDeathTimer > 1000 && !droppedKey) {
       droppedKey = {x: char3X, y: 0, value: 3};
    }
  }

  // 繪製 Boss 血量條
  if (currentBg === bg2 && isBossFight && !isBossDead) {
    push();
    rectMode(CORNER);
    fill(100);
    rect(char3X - 50, char3Y - 100, 100, 10);
    fill(255, 0, 0);
    let hpW = map(char3Health, 0, char3MaxHealth, 0, 100);
    rect(char3X - 50, char3Y - 100, hpW, 10);
    noFill();
    stroke(0);
    rect(char3X - 50, char3Y - 100, 100, 10);
    pop();
  }

  // --- 繪製角色4 (只在 bg3 顯示) ---
  if (currentBg === bg3 && animChar4.length > 0) {
    const proximityThreshold = 200;
    const distance = abs(charX - char4X);
    const currentlyInRange = distance < proximityThreshold;

    // 計算角色2的尺寸，用於統一大小
    const char2W = (NEWCHAR_SS_WIDTH / NEWCHAR_FRAME_COUNT) * SCALE_FACTOR;
    const char2H = NEWCHAR_SS_HEIGHT * SCALE_FACTOR;

    // 繪製角色4 (循環播放)
    const frameToDraw = animChar4[floor(frameCount / 8) % animChar4.length];
    image(frameToDraw, char4X, char4Y, char2W, char2H); // 使用角色2的尺寸

    // 對話互動邏輯
    if (currentlyInRange) {
      // 若還沒有題目則抽題
      if (!currentQuestion && !questionAnswered) {
        pickRandomQuestion();
      }
      // 繪製對話框
      drawDialogueBox(char4X, char4Y - 100, currentNpcDialogue, '#4281a4', '#ffede1', npcSubtext);

      // 顯示並定位玩家的輸入框
      playerInput.show();
      playerInput.position(charX - playerInput.width / 2, charY - 120);

      isInDialogueRange = true;
    } else {
      // 如果是剛從對話範圍離開，則隱藏輸入框並重設對話
      if (isInDialogueRange && currentBg === bg3) {
        playerInput.hide();
        setNpcDialogue("需要我解答嗎?");
        currentQuestion = null;
        questionAnswered = false;
        npcSubtext = '';
        isInDialogueRange = false;
      }
    }
  }

  // --- 繪製小幫手 (Helper) ---
  if (animHelper.length > 0) {
    // 更新小幫手位置：平滑跟隨在角色後方 (根據方向調整)
    // 使用 lerp 讓移動有延遲感
    const targetHelperX = charX - (direction * 80);
    helperX = lerp(helperX, targetHelperX, 0.08);
    
    // 計算弧線偏移：當小幫手穿越角色 (距離小於 80) 時，產生向上的弧度
    let arcOffset = 0;
    const distToCenter = abs(helperX - charX);
    if (distToCenter < 80) {
      // 距離越近，飛得越高 (例如最高 -100)，形成繞過角色的效果
      const normDist = map(distToCenter, 0, 80, HALF_PI, 0);
      arcOffset = -100 * sin(normDist);
    }
    
    // Y 軸跟隨：目標是角色高度 + 弧線偏移
    const targetHelperY = charY + arcOffset;
    helperY = lerp(helperY, targetHelperY, 0.1);

    const helperFrame = animHelper[floor(frameCount / 8) % animHelper.length];
    
    push();
    translate(helperX, helperY);
    // 根據角色1的方向翻轉小幫手
    if (direction === -1) {
      scale(-1, 1);
    }
    image(helperFrame, 0, 0, helperFrame.width * HELPER_SCALE, helperFrame.height * HELPER_SCALE);
    pop();

    // 如果有提示訊息，顯示在小幫手頭上
    if (helperDialogue) {
      drawDialogueBox(helperX, helperY - 100, helperDialogue, '#ffffff', '#000000');
    }
  }

  // 最後，在所有角色繪圖邏輯結束後，才統一繪製投射物
  drawProjectiles(doUpdate);
  drawImpactEffects(doUpdate); // 繪製爆炸效果
  drawParticles(doUpdate); // 新增：繪製粒子效果

  // --- 繪製 Bg3 的愛心 ---
  if (currentBg === bg3) {
    for (let h of bg3Hearts) {
      if (h.active) {
        drawHeart(h.x, h.y, 10);
        // 檢查碰撞
        if (dist(charX, charY - 40, h.x, h.y) < 30) {
          h.active = false;
          if (health < 5) health++;
        }
      }
    }
  }

  // --- 處理 Boss 戰邏輯 ---
  if (isBossFight && doUpdate) {
    updateBossFight();
  }
  // 繪製掉落的鑰匙
  if (droppedKey) {
    if (doUpdate) droppedKey.y = min(droppedKey.y + 5, groundY); // 掉落
    push();
    fill(255, 215, 0);
    stroke(0);
    rectMode(CENTER);
    translate(droppedKey.x, droppedKey.y);
    // 簡單鑰匙圖形
    ellipse(0, -10, 20, 20);
    rect(0, 5, 8, 20);
    rect(5, 10, 8, 5);
    // 顯示鑰匙數量
    if (droppedKey.value > 1) {
      fill(0);
      noStroke();
      textSize(12);
      textAlign(CENTER, CENTER);
      text("x" + droppedKey.value, 15, 0);
    }
    pop();
    drawDialogueBox(droppedKey.x, droppedKey.y - 40, "點擊拾取", '#ffffff', '#000000');
  }
  
  pop(); // End Screen Shake Transform

  // 繪製 UI 介面 (分數、愛心、鑰匙)
  drawUI();
  drawCoinEffects(doUpdate); // 繪製金幣特效
  flushDialogues(); // 繪製所有對話框並處理重疊
}

// 新增：繪製對話框的函式
function drawDialogueBox(x, y, textContent, bgColor, textColor, subText) {
  // 預先計算尺寸並加入佇列，稍後統一繪製以處理重疊
  push();
  textFont('Arial'); // 可以換成你喜歡的字體
  const mainSize = 15;
  const subSize = 15;
  const mainLines = (textContent || '').toString().split('\n');
  const subLines = subText ? subText.toString().split('\n') : [];

  textSize(mainSize);
  let maxW = 0;
  for (const l of mainLines) {
    maxW = max(maxW, textWidth(l));
  }
  textSize(subSize);
  for (const l of subLines) {
    maxW = max(maxW, textWidth(l));
  }

  const paddingX = 20;
  const lineHeight = mainSize + 6;
  const totalLines = mainLines.length + subLines.length;
  const boxWidth = (maxW || 20) + paddingX;
  const boxHeight = totalLines * lineHeight + 12;
  pop();

  dialogueQueue.push({
    x, y, w: boxWidth, h: boxHeight,
    textContent, bgColor, textColor, subText,
    mainLines, subLines, lineHeight, mainSize, subSize
  });
}

function flushDialogues() {
  // 簡單的重疊處理：若兩個對話框重疊，將較高的一個（或後加入的）向上推
  // 這裡採用多次迭代來解決連鎖重疊
  for (let iter = 0; iter < 10; iter++) {
    let moved = false;
    for (let i = 0; i < dialogueQueue.length; i++) {
      for (let j = i + 1; j < dialogueQueue.length; j++) {
        let a = dialogueQueue[i];
        let b = dialogueQueue[j];
        
        // 檢查 AABB 重疊
        // 加上一些緩衝區 (padding) 讓它們不要貼太近
        let padding = 4;
        
        // 計算半寬高 (包含 padding)
        let aw = a.w / 2 + padding;
        let ah = a.h / 2 + padding;
        let bw = b.w / 2 + padding;
        let bh = b.h / 2 + padding;
        
        // 檢查 X 軸重疊
        if (abs(a.x - b.x) < (aw + bw)) {
          // 檢查 Y 軸重疊
          let distY = abs(a.y - b.y);
          let minDistY = ah + bh;
          
          if (distY < minDistY) {
            // 發生重疊，計算需要移動的距離
            let overlap = minDistY - distY;
            
            // 將位置較高 (Y值較小) 的那個再往上推
            // 如果 Y 值相同，則推索引較小的那個 (任意)
            if (a.y <= b.y) {
              a.y -= overlap;
            } else {
              b.y -= overlap;
            }
            moved = true;
          }
        }
      }
    }
    if (!moved) break;
  }

  // 繪製所有對話框
  for (let d of dialogueQueue) {
    push();
    rectMode(CENTER);
    textAlign(CENTER, CENTER);
    textFont('Arial');
    
    // 繪製方框
    fill(d.bgColor);
    noStroke();
    rect(d.x, d.y, d.w, d.h, 10);

    // 繪製文字
    fill(d.textColor);
    let startY = d.y - (d.h / 2) + d.lineHeight / 2 + 6;
    
    textSize(d.mainSize);
    for (const l of d.mainLines) {
      text(l, d.x, startY);
      startY += d.lineHeight;
    }
    
    if (d.subLines.length > 0) {
      textSize(d.subSize);
      for (const l of d.subLines) {
        text(l, d.x, startY);
        startY += d.lineHeight;
      }
    }
    pop();
  }
}

// 新增：繪製爆炸效果的函式
function drawImpactEffects(doUpdate) {
  for (let i = impactEffects.length - 1; i >= 0; i--) {
    const effect = impactEffects[i];
    
    // 播放爆炸動畫
    const frameIndex = floor(effect.frame); // 取得當前動畫幀的索引
    if (frameIndex < animImpact.length) {
      const effectFrame = animImpact[frameIndex];
      image(effectFrame, effect.x, effect.y, effectFrame.width * SCALE_FACTOR, effectFrame.height * SCALE_FACTOR);
    }

    // 更新動畫幀
    if (doUpdate) effect.frame += 0.1; // 控制爆炸動畫速度 (60fps)

    // 如果動畫播放完畢 (超過總幀數)，則移除
    if (effect.frame >= IMPACT_FRAME_COUNT) {
      impactEffects.splice(i, 1);
    }
  }
}

// 將投射物繪製邏輯提取為一個獨立函數
function drawProjectiles(doUpdate) {
  // --- 4. 更新並繪製所有投射物 ---
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    
    // 碰撞偵測
    const hitThreshold = 50; // 碰撞判定的距離
    
    // 根據場景決定攻擊目標
    let targetX = -9999, targetY = -9999;
    let canHit = false;
    if (currentBg === bg1) {
      targetX = newCharX; targetY = newCharY; canHit = true;
    } else if (currentBg === bg2) {
      targetX = char3X; targetY = char3Y; canHit = true;
    } else if (currentBg === bg3) {
      targetX = char4X; targetY = char4Y; canHit = true;
    }

    // Boss 碰撞檢測
    if (currentBg === bg2 && isBossFight && !isBossDead && dist(p.x, p.y, char3X, char3Y) < 50) {
      takeBossDamage(10);
      impactEffects.push({ x: p.x, y: p.y, frame: 0 });
      createExplosionParticles(p.x, p.y); // 新增：產生爆炸粒子
      projectiles.splice(i, 1);
      continue;
    }

    if (canHit && !isNpcHit && dist(p.x, p.y, targetX, targetY) < hitThreshold) {
      isNpcHit = true; // 標記NPC被擊中
      npcHitTimer = millis(); // 開始計時
      impactEffects.push({ x: p.x, y: p.y, frame: 0 }); // 在碰撞點產生爆炸效果
      createExplosionParticles(p.x, p.y); // 新增：產生爆炸粒子
      projectiles.splice(i, 1); // 移除投射物
      continue; // 繼續下一個迴圈，不再繪製這個已移除的投射物
    }

    if (doUpdate) p.x += projectileSpeed * p.direction;

    push();
    translate(p.x, p.y);
    if (p.direction === -1) {
      scale(-1, 1); // 如果投射物向左，則翻轉
    }
    const projectileFrame = animProjectile[floor(frameCount / 5) % animProjectile.length];
    image(projectileFrame, 0, 0, projectileFrame.width * SCALE_FACTOR, projectileFrame.height * SCALE_FACTOR);
    pop();

    // 如果投射物飛出畫面，則從陣列中移除
    if (p.x > width + 100 || p.x < -100) {
      projectiles.splice(i, 1);
    }
  }
}

// --- 新增：遊戲介面與特效函式 ---

function drawLoadingScreen() {
  background(30);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("遊戲載入中...", width / 2, height / 2 - 40);
  
  // 進度條
  stroke(255);
  noFill();
  rectMode(CENTER);
  rect(width / 2, height / 2, 300, 20);
  
  noStroke();
  fill(100, 255, 100);
  let w = map(loadingProgress, 0, 100, 0, 296);
  rectMode(CORNER);
  rect(width / 2 - 148, height / 2 - 8, w, 16);
  rectMode(CENTER);

  loadingProgress += 0.5; // 模擬載入進度 (60fps)
  if (loadingProgress >= 100) {
    gameState = 'TITLE';
    if (soundMusic && soundMusic.isLoaded && soundMusic.isLoaded()) soundMusic.loop(); // 播放背景音樂
  }
}

function drawTitleScreen() {
  if (bg1) {
    image(bg1, width / 2, height / 2, width, height);
  } else {
    background('#ff66d8');
  }
  
  // 半透明遮罩
  fill(0, 0, 0, 150);
  rectMode(CORNER);
  rect(0, 0, width, height);

  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("《教科大冒險：智慧試煉》", width / 2, height / 3);

  textSize(20);
  let rules = "遊戲規則：\n" +
              "1. 使用 ← → 移動，↑ 跳躍，↓ 施法\n" +
              "2. 接近角色回答問題，答對獲得 10 金幣\n" +
              "3. 答錯扣除半顆愛心 (初始 5 顆)\n" +
              "4. 按 'H' 消耗一把鑰匙獲得提示 (初始 3 把)\n" +
              "5. 按 Enter 開始遊戲";
  text(rules, width / 2, height / 2 + 40);
}

function drawUI() {
  push();
  // 左上角：愛心
  for (let i = 0; i < 5; i++) {
    let x = 40 + i * 35;
    let y = 40;
    noStroke();
    if (health >= i + 1) {
      fill(255, 50, 50); // 全紅心
      drawHeart(x, y, 15);
    } else if (health > i) {
      // 半顆心
      fill(255, 50, 50);
      drawHeart(x, y, 15, true); // true 表示半顆
    } else {
      fill(100); // 空心 (灰色)
      drawHeart(x, y, 15);
    }
  }

  // 右上角：分數
  textAlign(RIGHT, TOP);
  textSize(24);
  fill(255, 215, 0); // 金色
  text("分數: " + score, width - 20, 20);

  // 分數下方：鑰匙
  rectMode(CENTER);
  for (let i = 0; i < keys; i++) {
    let kx = width - 30 - i * 30;
    let ky = 60;
    fill(255, 215, 0);
    ellipse(kx, ky, 10, 10); // 鑰匙頭
    rect(kx, ky + 8, 4, 12); // 鑰匙身
    rect(kx + 3, ky + 12, 4, 3); // 鑰匙齒
  }

  // 右上角：靜音按鈕
  let muteX = width - 40;
  let muteY = 100;
  fill(255);
  noStroke();
  ellipse(muteX, muteY, 30, 30);
  fill(0);
  textAlign(CENTER, CENTER);
  text(isMuted ? "🔇" : "🔊", muteX, muteY);
  pop();
}

function drawHeart(x, y, size, half = false) {
  push();
  translate(x, y);
  beginShape();
  vertex(0, -size * 0.3); 
  bezierVertex(-size, -size, -size * 1.5, size * 0.5, 0, size * 1.2); // 左半邊
  if (!half) {
    bezierVertex(size * 1.5, size * 0.5, size, -size, 0, -size * 0.3); // 右半邊
  } else {
    vertex(0, size * 1.2); // 半顆心切斷
  }
  endShape(CLOSE);
  pop();
}

function drawCoinEffects(doUpdate) {
  for (let i = coinEffects.length - 1; i >= 0; i--) {
    let c = coinEffects[i];
    fill(255, 215, 0, map(c.life, 0, 90, 0, 255));
    noStroke();
    ellipse(c.x, c.y, 20, 20);
    fill(255, map(c.life, 0, 90, 0, 255));
    textAlign(CENTER);
    textSize(16);
    text("+10", c.x, c.y - 15);
    if (doUpdate) {
      c.y -= 1;
      c.life--;
    }
    if (c.life <= 0) coinEffects.splice(i, 1);
  }
}

// 當瀏覽器視窗大小改變時，自動調整畫布大小
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 重設地面位置和角色位置
  groundY = height * 0.75;
  // 如果角色不在跳躍中，將其放回地面
  newCharY = groundY;
  if (!isJumping) {
    charY = groundY;
  }
}

// --- 新增功能函式 ---

function startGameOver() {
  isGameOver = true;
  gameOverPhase = 0;
  // 炸彈從上方掉落 (出現炸彈特效)
  triggerScreenShake(10, 20); 
  // 設定炸彈目標位置在角色頭頂
  bombObj = {x: charX, y: charY - 200, targetX: charX, targetY: charY - 80, timer: 0};
}

function drawGameOverSequence() {
  // 繪製背景 (保持最後一幀的背景)
  if (currentBg) image(currentBg, width / 2, height / 2, width, height);
  
  if (gameOverPhase === 0) {
    // 炸彈掉落
    bombObj.y = lerp(bombObj.y, bombObj.targetY, 0.05);
    
    // 繪製炸彈 (黑色圓球)
    push();
    fill(0);
    ellipse(bombObj.x, bombObj.y, 30, 30);
    // 導火線
    stroke(255);
    line(bombObj.x, bombObj.y - 15, bombObj.x + 10, bombObj.y - 25);
    noStroke();
    fill(255, 0, 0);
    if (frameCount % 10 < 5) ellipse(bombObj.x + 10, bombObj.y - 25, 5, 5); // 閃爍導火線
    pop();

    // 繪製角色 (還活著)
    if (isPlayerVisible) {
      let frame = animIdle[0];
      if (frame) image(frame, charX, charY, frame.width * SCALE_FACTOR, frame.height * SCALE_FACTOR);
    }

    // 當炸彈到達位置
    if (abs(bombObj.y - bombObj.targetY) < 5) {
      gameOverPhase = 1;
      triggerScreenShake(30, 40); // 爆炸時劇烈震動
      impactEffects.push({x: charX, y: charY - 50, frame: 0}); // 觸發爆炸
      createExplosionParticles(charX, charY - 50); // 新增：產生爆炸粒子
      bombObj.timer = 0; // 重置計時器用於播放倒下動畫
    }
  } else if (gameOverPhase === 1) {
    // 爆炸動畫播放中
    drawImpactEffects(true);
    drawParticles(true); // 新增：繪製粒子效果
    
    // 等待爆炸特效結束
    if (impactEffects.length === 0) {
      // 動畫播完且爆炸結束
      isPlayerVisible = false; // 角色消失
      gameOverPhase = 3; // 進入布幕
    }
  } else if (gameOverPhase === 3) {
    // 布幕拉下
    curtainHeight = min(height, curtainHeight + 10);
    fill(0);
    rectMode(CORNER);
    rect(0, 0, width, curtainHeight);
    
    if (curtainHeight >= height) {
      fill(255);
      textAlign(CENTER, CENTER);
      textSize(50);
      text("遊戲失敗", width/2, height/2 - 50);
      textSize(30);
      text("按 R 重新開始", width/2, height/2 + 50);
    }
  }
}

function resetGame() {
  isGameOver = false;
  health = 5;
  score = 0;
  keys = 3;
  charX = width / 2;
  charY = groundY;
  isPlayerVisible = true;
  curtainHeight = 0;
  currentBg = bg1;
  stage = 0;
  // 重置愛心
  for(let h of bg3Hearts) h.active = true;
  // 重置 Boss
  char3Health = char3MaxHealth;
  isBossDead = false;
  isBossFight = false;
  bossFightPhase = 'OFF';
  droppedKey = null;
  particles = []; // 重置粒子
}

function startBossFight() {
  isBossFight = true;
  isBossDead = false;
  char3Health = char3MaxHealth;
  bossFightPhase = 'PREPARING'; // 設定為準備階段
  bossFightTimer = millis();    // 開始倒數計時
  bossArrowCount = 0;
  bossHitsReceived = 0;
  bossArrows = [];
  // bossArrowTimer 會在倒數結束後設定
  setNpcDialogue("進入異空間戰場...");
}

function updateBossFight() {
  // --- 階段 1: 倒數轉場 ---
  if (bossFightPhase === 'PREPARING') {
    // 倒數文字
    push();
    noStroke();
    fill(255, 255, 0);
    textSize(80);
    textAlign(CENTER, CENTER);
    let elapsed = millis() - bossFightTimer;
    let timeLeft = 3 - floor(elapsed / 1000);

    if (timeLeft > 0) {
      text(timeLeft, width / 2, height / 2);
    } else {
      text("FIGHT!", width / 2, height / 2);
    }
    pop();

    // 3秒後正式開始
    if (elapsed > 3000) {
      bossFightPhase = 'FIGHTING';
      bossArrowTimer = millis(); // 重置射箭計時器
      setNpcDialogue("接招吧！");
    }
    return; // 準備階段不執行下方的射箭邏輯
  }

  // --- 階段 2: 正式戰鬥 ---
  // 每3秒射箭 (Boss 活著時)，總共10支
  if (millis() - bossArrowTimer > 3000 && bossArrowCount < 10) {
    bossArrows.push({x: char3X, y: char3Y - 50, speed: 10});
    bossArrowTimer = millis();
    bossArrowCount++;
  }

  // 更新箭
  for (let i = bossArrows.length - 1; i >= 0; i--) {
    let arrow = bossArrows[i];
    arrow.x -= arrow.speed;
    
    // 繪製箭
    push();
    translate(arrow.x, arrow.y);
    fill(255, 0, 0);
    rectMode(CENTER);
    rect(0, 0, 40, 5); // 箭身
    triangle(-20, -5, -20, 5, -30, 0); // 箭頭
    pop();

    // 碰撞檢測
    if (dist(arrow.x, arrow.y, charX, charY - 50) < 40) {
      takePlayerDamage(0.5);
      bossHitsReceived++;
      if (bossHitsReceived > 3) {
        startGameOver(); // 超過3次被擊中，觸發炸彈
      }
      bossArrows.splice(i, 1);
    } else if (arrow.x < 0) {
      bossArrows.splice(i, 1);
    }
  }

  // 勝利條件：射完10支箭且場上無箭 (躲過攻擊)
  if (bossArrowCount >= 10 && bossArrows.length === 0 && !droppedKey) {
    isBossFight = false;
    bossFightPhase = 'OFF';
    setNpcDialogue("你贏了...");
    droppedKey = {x: width/2, y: 0, value: 1}; // 鑰匙從天而降 (1把)
  }
}

function mousePressed() {
  if (droppedKey && dist(mouseX, mouseY, droppedKey.x, droppedKey.y) < 50) {
    keys += (droppedKey.value || 1);
    droppedKey = null; // 拾取消失
    // 可以加音效
  }
  
  // 靜音按鈕點擊
  if (dist(mouseX, mouseY, width - 40, 100) < 15) {
    isMuted = !isMuted;
    outputVolume(isMuted ? 0 : 1);
  }
}

// --- 新增：輔助功能函式 ---

function triggerScreenShake(intensity, duration) {
  screenShakeIntensity = intensity;
  screenShakeTimer = duration;
}

function takePlayerDamage(amount) {
  if (isInvincible) return;
  health = max(0, health - amount);
  triggerScreenShake(10, 15); // 受傷震動
  if (soundLose && soundLose.isLoaded && soundLose.isLoaded()) soundLose.play();
  
  // 無敵時間
  isInvincible = true;
  invincibleEndTime = millis() + 2000;
}

function takeBossDamage(amount) {
  char3Health -= amount;
  triggerScreenShake(5, 5); // Boss 受傷輕微震動
  if (char3Health <= 0) {
    char3Health = 0;
    isBossDead = true;
    bossDeathTimer = millis();
    setNpcDialogue("不...不可能...");
  }
}

function drawPauseOverlay() {
  push();
  fill(0, 0, 0, 150);
  rectMode(CORNER);
  rect(0, 0, width, height);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("遊戲暫停", width/2, height/2);
  textSize(20);
  text("按 P 或 空白鍵 繼續", width/2, height/2 + 50);
  pop();
}

// --- 新增：Boss戰背景特效函式 ---
function drawBossFightBackground() {
  // 繪製時空背景特效 (持續顯示於戰鬥中)
  push();
  fill(0, 0, 40, 200); // 深藍色半透明遮罩
  rectMode(CORNER);
  rect(-100, -100, width + 200, height + 200); // 確保覆蓋全螢幕

  // 隨機線條模擬時空穿梭感
  stroke(100, 200, 255, 150);
  strokeWeight(2);
  // 以玩家為中心繪製線條
  push();
  translate(charX, charY); 
  for (let i = 0; i < 10; i++) {
    let angle = random(TWO_PI);
    let dist = random(50, 400);
    let len = random(50, 150);
    line(cos(angle) * dist, sin(angle) * dist, cos(angle) * (dist + len), sin(angle) * (dist + len));
  }
  pop();
  pop();
}

// --- 新增：粒子特效系統 ---

function createExplosionParticles(x, y) {
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: x,
      y: y,
      vx: random(-8, 8),
      vy: random(-8, 8),
      life: 255,
      color: [255, random(50, 200), 0], // 橘紅色系
      size: random(4, 10)
    });
  }
}

function drawParticles(doUpdate) {
  push();
  rectMode(CENTER);
  noStroke();
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    fill(p.color[0], p.color[1], p.color[2], p.life);
    rect(p.x, p.y, p.size, p.size);

    if (doUpdate) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3; // 重力效果
      p.life -= 5; // 淡出
    }

    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
  pop();
}
