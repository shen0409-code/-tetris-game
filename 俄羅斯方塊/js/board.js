import { COLS, ROWS, createMatrix } from './constants.js';

export class Board {
    constructor() {
        this.grid = createMatrix(COLS, ROWS);
    }

    reset() {
        this.grid.forEach(row => row.fill(0));
    }

    collide(player) {
        const m = player.matrix;
        const o = player.pos;
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 &&
                   (this.grid[y + o.y] && this.grid[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    merge(player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.grid[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
    }

    sweep(player) {
        let rowCount = 0;
        outer: for (let y = this.grid.length - 1; y >= 0; --y) {
            for (let x = 0; x < this.grid[y].length; ++x) {
                if (this.grid[y][x] === 0) {
                    continue outer;
                }
            }

            const row = this.grid.splice(y, 1)[0].fill(0);
            this.grid.unshift(row);
            ++y;
            rowCount++;
        }

        if (rowCount > 0) {
            player.combo++;
            const scoreTable = [0, 100, 300, 500, 800];
            const baseScore = scoreTable[rowCount];
            const comboBonus = (player.combo - 1) * 50; 
            
            player.score += (baseScore + comboBonus) * player.level;
            player.lines += rowCount;
            player.level = Math.floor(player.lines / 10) + 1;
            player.dropInterval = Math.max(100, 1000 - (player.level - 1) * 80);
        } else {
            player.combo = 0;
        }
    }
}