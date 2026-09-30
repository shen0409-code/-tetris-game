import { COLS, ROWS, COLORS, ENCOURAGEMENT_MESSAGES } from './constants.js';
import { Board } from './board.js';
import { Player } from './player.js';
import { AssetLoader } from './assetLoader.js';
import { AudioManager } from './audioManager.js';

const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(30, 30);

const board = new Board();
const player = new Player(board);
const assetLoader = new AssetLoader();
const audioManager = new AudioManager();

let lastTime = 0;
let isGameOver = false;
let requestId = null;
let loadedAssets = { images: {}, audios: {} };

const ASSET_PATHS = {
    images: {
        background: 'assets/images/background.png',
        blocks: 'assets/images/blocks.png'
    },
    audios: {
        bgm: 'assets/audio/bgm.mp3',
        move: 'assets/audio/move.wav',
        clear: 'assets/audio/clear.wav',
        gameover: 'assets/audio/gameover.wav'
    }
};

function triggerGameOver() {
    isGameOver = true;
    audioManager.playSFX('gameover');
    document.getElementById('final-score').innerText = player.score;
    const randomIndex = Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length);
    document.getElementById('encouragement-text').innerText = ENCOURAGEMENT_MESSAGES[randomIndex];
    document.getElementById('game-over-overlay').classList.remove('hidden');
}

function updateScoreUI() {
    document.getElementById('score').innerText = player.score;
    document.getElementById('lines').innerText = player.lines;
    document.getElementById('level').innerText = player.level;
    
    const comboEl = document.getElementById('combo');
    const comboContainer = document.getElementById('combo-box');
    
    if (player.combo > 0) {
        comboEl.innerText = `x${player.combo}`;
        comboContainer.classList.add('combo-active');
    } else {
        comboEl.innerText = '0';
        comboContainer.classList.remove('combo-active');
    }
}

function playerDropAction() {
    const hit = player.drop(audioManager);
    if (hit) {
        const gameOver = player.resetPiece();
        if (gameOver) {
            triggerGameOver();
        }
    }
    updateScoreUI();
}

function playerHardDropAction() {
    player.hardDrop(audioManager);
    const gameOver = player.resetPiece();
    if (gameOver) {
        triggerGameOver();
    }
    updateScoreUI();
}

function drawBlock(x, y, colorIndex, isGhost = false) {
    // 1. 繪製落點陰影 (Ghost)
    if (isGhost) {
        context.strokeStyle = COLORS[colorIndex];
        context.lineWidth = 0.08;
        context.strokeRect(x + 0.05, y + 0.05, 0.9, 0.9);
        return;
    }

    // 2. 繪製鮮豔對應色彩方塊
    context.fillStyle = COLORS[colorIndex];
    context.fillRect(x, y, 1, 1);

    // 頂部與左側亮邊 (營造 3D 光澤)
    context.fillStyle = 'rgba(255, 255, 255, 0.45)';
    context.fillRect(x, y, 1, 0.12);
    context.fillRect(x, y, 0.12, 1);

    // 底部與右側暗邊 (營造立體陰影)
    context.fillStyle = 'rgba(0, 0, 0, 0.45)';
    context.fillRect(x, y + 0.88, 1, 0.12);
    context.fillRect(x + 0.88, y, 0.12, 1);

    // 外框細線
    context.strokeStyle = '#0d0d11';
    context.lineWidth = 0.03;
    context.strokeRect(x, y, 1, 1);
}
function drawMatrix(matrix, offset, isGhost = false) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                drawBlock(x + offset.x, y + offset.y, value, isGhost);
            }
        });
    });
}

function drawGhost() {
    const ghost = {
        pos: { x: player.pos.x, y: player.pos.y },
        matrix: player.matrix
    };
    while (!board.collide(ghost)) {
        ghost.pos.y++;
    }
    ghost.pos.y--;
    drawMatrix(ghost.matrix, ghost.pos, true);
}

function draw() {
    const bgImg = loadedAssets.images.background;

    if (bgImg) {
        context.drawImage(bgImg, 0, 0, COLS, ROWS);
    } else {
        context.fillStyle = '#0d0d11';
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.strokeStyle = '#181822';
        context.lineWidth = 0.02;
        for (let x = 0; x <= COLS; x++) {
            context.beginPath();
            context.moveTo(x, 0);
            context.lineTo(x, ROWS);
            context.stroke();
        }
        for (let y = 0; y <= ROWS; y++) {
            context.beginPath();
            context.moveTo(0, y);
            context.lineTo(COLS, y);
            context.stroke();
        }
    }

    drawMatrix(board.grid, { x: 0, y: 0 });

    if (player.matrix && !isGameOver) {
        drawGhost();
        drawMatrix(player.matrix, player.pos);
    }
}

function update(time = 0) {
    if (isGameOver) return;

    const deltaTime = time - lastTime;
    lastTime = time;

    player.dropCounter += deltaTime;
    if (player.dropCounter > player.dropInterval) {
        playerDropAction();
    }

    draw();
    requestId = requestAnimationFrame(update);
}

function restartGame() {
    if (requestId) {
        cancelAnimationFrame(requestId);
        requestId = null;
    }

    board.reset();
    player.resetStats();
    isGameOver = false;

    document.getElementById('game-over-overlay').classList.add('hidden');

    updateScoreUI();
    const gameOver = player.resetPiece();
    if (gameOver) {
        triggerGameOver();
    }

    audioManager.playBGM();

    lastTime = performance.now();
    requestId = requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
    if (isGameOver) return;

    audioManager.playBGM();

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(event.key)) {
        event.preventDefault();
    }

    if (event.key === 'ArrowLeft') {
        player.move(-1, audioManager);
    } else if (event.key === 'ArrowRight') {
        player.move(1, audioManager);
    } else if (event.key === 'ArrowDown') {
        playerDropAction();
        player.score += 1;
        updateScoreUI();
    } else if (event.key === 'ArrowUp') {
        player.rotate(1, audioManager);
    } else if (event.key === ' ') {
        playerHardDropAction();
    }
});

document.getElementById('restart-btn').addEventListener('click', restartGame);
document.getElementById('restart-overlay-btn').addEventListener('click', restartGame);

document.getElementById('mute-btn').addEventListener('click', () => {
    const isMuted = audioManager.toggleMute();
    document.getElementById('mute-btn').innerText = isMuted ? '🔇 音效：靜音' : '🔊 音效：開啟';
});

async function initApp() {
    loadedAssets = await assetLoader.loadAll(ASSET_PATHS);
    audioManager.init(loadedAssets.audios);
    
    document.getElementById('loading-overlay').classList.add('hidden');
    
    restartGame();
}

initApp();
