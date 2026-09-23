import { createPiece, COLS } from './constants.js';

export class Player {
    constructor(board) {
        this.board = board;
        this.resetStats();
    }

    resetStats() {
        this.pos = { x: 0, y: 0 };
        this.matrix = null;
        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.combo = 0;
        this.dropInterval = 1000;
        this.dropCounter = 0;
    }

    resetPiece() {
        const pieces = 'ILJOSZT';
        this.matrix = createPiece(pieces[Math.floor(Math.random() * pieces.length)]);
        this.pos.y = 0;
        this.pos.x = Math.floor(COLS / 2) - Math.floor(this.matrix[0].length / 2);

        return this.board.collide(this);
    }

    move(dir) {
        this.pos.x += dir;
        if (this.board.collide(this)) {
            this.pos.x -= dir;
        }
    }

    rotate(dir) {
        const pos = this.pos.x;
        let offset = 1;
        this._rotateMatrix(this.matrix, dir);
        while (this.board.collide(this)) {
            this.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > this.matrix[0].length) {
                this._rotateMatrix(this.matrix, -dir);
                this.pos.x = pos;
                return;
            }
        }
    }

    _rotateMatrix(matrix, dir) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
            }
        }
        if (dir > 0) {
            matrix.forEach(row => row.reverse());
        } else {
            matrix.reverse();
        }
    }

    drop() {
        this.pos.y++;
        let collided = false;
        if (this.board.collide(this)) {
            this.pos.y--;
            this.board.merge(this);
            this.board.sweep(this);
            collided = true;
        }
        this.dropCounter = 0;
        return collided;
    }

    hardDrop() {
        while (!this.board.collide(this)) {
            this.pos.y++;
            this.score += 2;
        }
        this.pos.y--;
        this.board.merge(this);
        this.board.sweep(this);
        this.dropCounter = 0;
    }
}