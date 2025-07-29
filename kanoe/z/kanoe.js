// JavaScript for 長良川カヌー川下りゲーム 3D
// (moved from kanoe.html <script> block)

let bridgeData = [];

function startGameWithBridgeData(data) {
    bridgeData = data.slice().reverse(); // 橋の順番を反対に
    // ここから下に、元のThree.jsやゲームの初期化・イベント登録・animate()などの処理を記述
    // ... 既存のJSコードをbridgeData利用部分も含めてここに ...

    // Three.js設定
    let scene, camera, renderer;
    let canoe, canoePerson;
    let bridges = [];
    let river;
    let ambientLight, directionalLight;

    // ゲーム状態
    let gameState = {
        score: 0,
        speed: 1.0,
        position: 0,
        isDucking: false,
        isGameOver: false,
        currentBridgeIndex: 0,
        canoeHeight: 2.0,
        normalHeight: 2.0,
        duckingHeight: 0.8,
        bridgeSpacing: 50
    };

    // DOM要素
    const canvas = document.getElementById('gameCanvas');
    const scoreElement = document.getElementById('score');
    const speedElement = document.getElementById('speed');
    const altitudeElement = document.getElementById('altitude');
    const bridgeInfoElement = document.getElementById('bridgeInfo');
    const nextBridgeElement = document.getElementById('nextBridge');
    const warningElement = document.getElementById('warning');
    const duckingIndicator = document.getElementById('duckingIndicator');
    const gameOverElement = document.getElementById('gameOver');
    const finalScoreElement = document.getElementById('finalScore');
    const paddleBtn = document.getElementById('paddleBtn');
    const duckBtn = document.getElementById('duckBtn');

    // ... 以降、元のThree.jsやゲームの初期化・イベント登録・animate()などの処理 ...
    // bridgeDataはこのスコープ内で利用可能

    // (元のkanoe.jsの内容をここに展開)
    // ...

    // 例: 初期化
    window.addEventListener('DOMContentLoaded', () => {
        initThreeJS();
        updateBridgeInfo();  // 橋データ初期化
        animate();           // ゲームループ開始
    });
}

// JSONファイルを読み込んでからゲーム開始
fetch('bridges.json')
    .then(response => response.json())
    .then(data => {
        startGameWithBridgeData(data);
    })
    .catch(error => {
        alert('橋データの読み込みに失敗しました: ' + error);
    });

// ... 以降、kanoe.htmlの<script>内の全JSコードを移動 ...
// (three.jsのCDNはHTMLで読み込むので不要)
// ... 既存のJSコードをそのまま ... 