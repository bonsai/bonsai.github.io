// ブドウキャッチゲーム
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// キャンバスサイズ設定
canvas.width = 800;
canvas.height = 600;

// ゲーム変数
let player = { 
    x: canvas.width / 2 - 30, 
    y: canvas.height - 80, 
    width: 60, 
    height: 60, 
    score: 0,
    isJumping: false,
    jumpHeight: 0
};

let grapes = [];
let juiceScore = 100; // 難易度簡単：100点でクリア
let gameOver = false;
let gameWon = false;

// 画像読み込み
const playerImg = new Image();
const grapeImg = new Image();
const juiceImg = new Image();

playerImg.src = 'data:image/svg+xml;base64,' + btoa(`
<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="25" fill="#4CAF50"/>
    <circle cx="22" cy="22" r="3" fill="white"/>
    <circle cx="38" cy="22" r="3" fill="white"/>
    <path d="M 20 35 Q 30 45 40 35" stroke="white" stroke-width="2" fill="none"/>
</svg>
`);

grapeImg.src = 'data:image/svg+xml;base64,' + btoa(`
<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="20" cy="30" rx="15" ry="18" fill="#800080"/>
    <ellipse cx="20" cy="25" rx="12" ry="15" fill="#9932CC"/>
    <circle cx="16" cy="20" r="2" fill="#DDA0DD"/>
    <circle cx="24" cy="22" r="2" fill="#DDA0DD"/>
    <circle cx="20" cy="28" r="2" fill="#DDA0DD"/>
</svg>
`);

// ブドウ生成
function createGrape() {
    if (gameOver || gameWon) return;
    
    const grape = {
        x: Math.random() * (canvas.width - 40),
        y: 0,
        width: 40,
        height: 40,
        speed: 1.5 + Math.random() * 0.5 // ランダムな速度
    };
    grapes.push(grape);
}

// プレイヤー描画
function drawPlayer() {
    if (playerImg.complete) {
        ctx.drawImage(playerImg, player.x, player.y - player.jumpHeight, player.width, player.height);
    } else {
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(player.x, player.y - player.jumpHeight, player.width, player.height);
    }
}

// ブドウ描画
function drawGrapes() {
    grapes.forEach(grape => {
        if (grapeImg.complete) {
            ctx.drawImage(grapeImg, grape.x, grape.y, grape.width, grape.height);
        } else {
            ctx.fillStyle = '#800080';
            ctx.fillRect(grape.x, grape.y, grape.width, grape.height);
        }
    });
}

// ブドウ更新
function updateGrapes() {
    grapes.forEach((grape, index) => {
        grape.y += grape.speed;

        // キャッチ判定
        if (grape.x < player.x + player.width &&
            grape.x + grape.width > player.x &&
            grape.y < player.y + player.height - player.jumpHeight &&
            grape.y + grape.height > player.y - player.jumpHeight) {
            
            // ジャンプ中なら3倍得点
            let points = player.isJumping ? 30 : 10;
            player.score += points;
            grapes.splice(index, 1);
            
            // 得点表示更新
            scoreElement.textContent = `Score: ${player.score}`;
        }

        // 画面外で失敗
        if (grape.y > canvas.height) {
            gameOver = true;
        }
    });
}

// ジャンプ処理
function updateJump() {
    if (player.isJumping) {
        player.jumpHeight += 5;
        if (player.jumpHeight >= 80) {
            player.isJumping = false;
        }
    } else if (player.jumpHeight > 0) {
        player.jumpHeight -= 5;
        if (player.jumpHeight < 0) {
            player.jumpHeight = 0;
        }
    }
}

// メインゲームループ
function gameLoop() {
    // 画面クリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameOver) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('F5キーでリスタート', canvas.width / 2, canvas.height / 2 + 50);
        return;
    }

    if (player.score >= juiceScore && !gameWon) {
        gameWon = true;
        ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'orange';
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ジュース完成！', canvas.width / 2, canvas.height / 2);
        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('F5キーでリスタート', canvas.width / 2, canvas.height / 2 + 50);
        return;
    }

    // ゲーム要素更新・描画
    updateJump();
    drawPlayer();
    drawGrapes();
    updateGrapes();

    requestAnimationFrame(gameLoop);
}

// キー入力処理
window.addEventListener('keydown', (e) => {
    if (gameOver || gameWon) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            if (player.x > 0) player.x -= 25;
            break;
        case 'ArrowRight':
            if (player.x < canvas.width - player.width) player.x += 25;
            break;
        case ' ':
            e.preventDefault();
            if (!player.isJumping && player.jumpHeight === 0) {
                player.isJumping = true;
            }
            break;
    }
});

// ゲーム開始
setInterval(createGrape, 2000); // 2秒間隔でブドウ生成
gameLoop();
