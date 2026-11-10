function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}
let stopSprite; // 儲存角色停止狀態的圖片精靈
let walkSprite; // 儲存角色行走狀態的圖片精靈

let stopFrames = 10; // STOP動畫共有10張影格
let walkFrames = 9; // WALK動畫共有9張影格

let stopFrameWidth = 1395 / 10; // STOP每張影格的原始寬度
let stopFrameHeight = 196; // STOP每張影格的原始高度
let walkFrameWidth = 2866 / 9; // WALK每張影格的原始寬度
let walkFrameHeight = 197; // WALK每張影格的原始高度

let currentFrame = 0; // 記錄目前播放的影格
let animationSpeed = 10; // 每秒播放10張動畫影格
let lastFrameTime = 0; // 記錄上次切換影格的時間

let characterX = 0; // 角色的水平中心座標
let direction = 1; // 角色方向，1為向右，-1為向左
let isWalking = false; // 記錄角色是否正在行走
let moveSpeed = 300; // 角色每秒移動300像素

let scaleFactor = 1; // 角色的自適應縮放比例
let displayWidth = 0; // 角色實際顯示寬度
let displayHeight = 0; // 角色實際顯示高度

function preload() { // 在程式開始前載入圖片
stopSprite = loadImage("1/STOP/STOP.png"); // 載入角色停止動畫
walkSprite = loadImage("1/WALK/WALK.png"); // 載入角色行走動畫
} // 結束preload函式

function setup() { // 初始化畫布與角色
createCanvas(windowWidth, windowHeight); // 建立符合視窗大小的畫布
frameRate(60); // 設定每秒更新60次畫面
noSmooth(); // 關閉圖片平滑處理以保留像素風格
characterX = width * 2 / 3; // 角色初始位置在畫布X軸三分之二處
updateCharacterScale(); // 計算角色初始縮放比例
} // 結束setup函式

function draw() { // 持續更新遊戲畫面
background(135, 206, 235); // 設定天空藍色背景
updateCharacterScale(); // 根據畫布大小更新角色比例
updateMovement(); // 處理鍵盤控制與角色移動
updateAnimation(); // 更新角色動畫影格
drawCharacter(); // 繪製角色圖片精靈
} // 結束draw函式

function updateCharacterScale() { // 計算角色自適應縮放比例
let scaleByWidth = width / 1200; // 根據畫布寬度計算縮放比例
let scaleByHeight = height / 800; // 根據畫布高度計算縮放比例
let responsiveScale = min(scaleByWidth, scaleByHeight); // 使用較小比例維持畫面協調
let minimumScale = min(0.4, width / walkFrameWidth); // 避免小螢幕上角色比畫布還寬
scaleFactor = constrain(responsiveScale, minimumScale, 2.5); // 限制角色縮放範圍
scaleFactor = min(scaleFactor, width / walkFrameWidth); // 確保WALK影格能完整放入畫布
} // 結束縮放比例計算

function updateMovement() { // 處理角色移動及動畫切換
let previousWalking = isWalking; // 記錄上一個畫面的行走狀態
isWalking = false; // 預設角色沒有行走

if (keyIsDown(RIGHT_ARROW)) { // 偵測是否按住右方向鍵
isWalking = true; // 切換成行走狀態
direction = 1; // 設定角色面向右方
} else if (keyIsDown(LEFT_ARROW)) { // 偵測是否按住左方向鍵
isWalking = true; // 切換成行走狀態
direction = -1; // 設定角色面向左方
} // 結束鍵盤方向判斷

if (isWalking !== previousWalking) { // 偵測STOP與WALK狀態是否切換
currentFrame = 0; // 切換動畫時從第一張影格開始
lastFrameTime = millis(); // 重設動畫影格計時
} // 結束動畫狀態切換判斷

let frameWidth = isWalking ? walkFrameWidth : stopFrameWidth; // 取得目前動畫的影格寬度
let frameHeight = isWalking ? walkFrameHeight : stopFrameHeight; // 取得目前動畫的影格高度

displayWidth = frameWidth * scaleFactor; // 計算角色縮放後的寬度
displayHeight = frameHeight * scaleFactor; // 計算角色縮放後的高度

if (isWalking) { // 當方向鍵被按住時
characterX += direction * moveSpeed * scaleFactor * deltaTime / 1000; // 依方向、時間與縮放比例移動角色
} // 結束行走移動判斷

let leftBoundary = displayWidth / 2; // 設定角色最左側的中心位置
let rightBoundary = width - displayWidth / 2; // 設定角色最右側的中心位置

characterX = constrain(characterX, leftBoundary, rightBoundary); // 限制角色不超出畫布左右邊界
} // 結束角色移動函式

function updateAnimation() { // 更新角色動畫播放影格
let totalFrames = isWalking ? walkFrames : stopFrames; // 取得目前動畫的總影格數
let frameInterval = 1000 / animationSpeed; // 計算每張影格播放的毫秒數

if (millis() - lastFrameTime >= frameInterval) { // 判斷是否到達切換影格的時間
currentFrame = (currentFrame + 1) % totalFrames; // 播放下一張影格並循環
lastFrameTime = millis(); // 更新影格切換時間
} // 結束影格切換判斷
} // 結束動畫更新函式

function drawCharacter() { // 將角色圖片精靈繪製在畫布上
let sprite = isWalking ? walkSprite : stopSprite; // 選擇目前要使用的圖片精靈
let frameWidth = isWalking ? walkFrameWidth : stopFrameWidth; // 取得目前影格原始寬度
let frameHeight = isWalking ? walkFrameHeight : stopFrameHeight; // 取得目前影格原始高度
let sourceX = currentFrame * frameWidth; // 計算目前影格的水平裁切位置
let sourceY = 0; // 設定影格垂直裁切位置為0

push(); // 儲存畫布原本的座標設定
translate(characterX, height); // 將繪圖原點移至角色底部中心
scale(direction, 1); // 依照角色移動方向進行水平翻轉

image( // 繪製目前的角色動畫影格
sprite, // 指定目前使用的STOP或WALK圖片精靈
-displayWidth / 2, // 讓角色水平中心對齊目前位置
-displayHeight, // 讓角色底部對齊畫布最底端
displayWidth, // 設定角色縮放後的顯示寬度
displayHeight, // 設定角色縮放後的顯示高度
sourceX, // 設定原始圖片的水平裁切位置
sourceY, // 設定原始圖片的垂直裁切位置
frameWidth, // 設定原始影格的裁切寬度
frameHeight // 設定原始影格的裁切高度
); // 結束角色圖片繪製

pop(); // 還原畫布原本的座標設定
} // 結束角色繪製函式

function windowResized() { // 當瀏覽器視窗大小改變時執行
resizeCanvas(windowWidth, windowHeight); // 重新調整畫布大小
updateCharacterScale(); // 重新計算角色縮放比例
let frameWidth = isWalking ? walkFrameWidth : stopFrameWidth; // 取得目前動畫影格寬度
let newDisplayWidth = frameWidth * scaleFactor; // 計算縮放後的角色寬度
characterX = constrain(characterX, newDisplayWidth / 2, width - newDisplayWidth / 2); // 確保角色仍位於畫布內
} // 結束視窗尺寸調整函式

function keyPressed() { // 偵測鍵盤按鍵按下事件
if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) { // 判斷是否為左右方向鍵
return false; // 阻止方向鍵造成瀏覽器畫面捲動
} // 結束方向鍵判斷
} // 結束鍵盤按下事件