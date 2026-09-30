export const COLS = 10;
export const ROWS = 20;

export const COLORS = [
    null,
    '#00f0f0', // I
    '#0000f0', // J
    '#ff7f00', // L
    '#ffff00', // O
    '#00f000', // S
    '#a000f0', // T
    '#f00000'  // Z
];

export const ENCOURAGEMENT_MESSAGES = [
    "差一點！再挑戰一次吧！",
    "再來一次，挑戰更高分！",
    "別放棄，你一定可以突破紀錄！",
    "這次很接近了，再試一次！",
    "每一次挑戰都會更進步！",
    "準備好了嗎？下一場突破自己！"
];

export function createPiece(type) {
    if (type === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (type === 'J') {
        return [
            [0, 2, 0],
            [0, 2, 0],
            [2, 2, 0],
        ];
    } else if (type === 'L') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ];
    } else if (type === 'O') {
        return [
            [4, 4],
            [4, 4],
        ];
    } else if (type === 'S') {
        return [
            [0, 5, 5],
            [5, 5, 0],
            [0, 0, 0],
        ];
    } else if (type === 'T') {
        return [
            [0, 6, 0],
            [6, 6, 6],
            [0, 0, 0],
        ];
    } else if (type === 'Z') {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ];
    }
}

export function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}