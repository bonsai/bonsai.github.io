// main.js
import * as THREE from 'https://cdn.skypack.dev/three@0.152.2';

let scene, camera, renderer;
let canoe, river, bridges = [];
let velocity = 0.1;
let ducking = false;
let bridgeInfos = [];
let currentBridgeIndex = 0;
let gameOver = false;

window.setup = function() {
  noCanvas();
  textSize(32);
  fill(255);
  noStroke();
};

window.draw = function() {
  clear();
  if (gameOver) {
    textAlign(CENTER, CENTER);
    text('ぶつかった！ゲームオーバー', window.innerWidth/2, window.innerHeight/2);
    return;
  }
  if (currentBridgeIndex < bridgeInfos.length) {
    const b = bridgeInfos[currentBridgeIndex];
    textAlign(LEFT, TOP);
    text(`次の橋: ${b.name}\n距離: ${b.distance_from_mouth}km`, 20, 20);
  }
};

init();
animate();

async function init() {
  // 橋データをfetchで取得
  const res = await fetch('bridges.json');
  bridgeInfos = await res.json();

  // three.js初期化
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('gameCanvas'), alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // カヌー
  const canoeGeo = new THREE.BoxGeometry(1, 0.5, 2);
  const canoeMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  canoe = new THREE.Mesh(canoeGeo, canoeMat);
  canoe.position.set(0, 0.25, 5);
  scene.add(canoe);

  // 川
  const riverGeo = new THREE.PlaneGeometry(20, 200);
  const riverMat = new THREE.MeshBasicMaterial({ color: 0x3399ff, side: THREE.DoubleSide });
  river = new THREE.Mesh(riverGeo, riverMat);
  river.rotation.x = -Math.PI / 2;
  scene.add(river);

  // 橋
  for (let i = 0; i < bridgeInfos.length; i++) {
    const bridgeGeo = new THREE.BoxGeometry(10, 1, 1);
    const bridgeMat = new THREE.MeshBasicMaterial({ color: 0x888888 });
    const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridge.position.set(0, 2, -bridgeInfos[i].distance_from_mouth * 5);
    scene.add(bridge);
    bridges.push(bridge);
  }

  camera.position.set(0, 5, 10);
  camera.lookAt(canoe.position);

  // UIイベント
  document.getElementById('paddleBtn').addEventListener('click', () => {
    velocity += 0.05;
  });
  document.getElementById('duckBtn').addEventListener('mousedown', () => {
    ducking = true;
    canoe.scale.y = 0.3;
  });
  document.getElementById('duckBtn').addEventListener('mouseup', () => {
    ducking = false;
    canoe.scale.y = 1;
  });
}

function animate() {
  requestAnimationFrame(animate);
  if (gameOver) return;
  canoe.position.z -= velocity;
  camera.position.z = canoe.position.z + 5;

  for (let i = 0; i < bridges.length; i++) {
    if (Math.abs(canoe.position.z - bridges[i].position.z) < 1) {
      if (!ducking) {
        gameOver = true;
      } else {
        currentBridgeIndex = i + 1;
      }
    }
  }

  renderer.render(scene, camera);
}
