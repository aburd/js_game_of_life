const WIDTH = 64;
const HEIGHT = 64;
const CELL_SIZE = 10;
const CELL_STROKE = '#000';
const BORDER = 1;
const BORDER_STROKE = '#666';

const Cell = {
    Alive: 1,
    Dead: 0,
}

class Universe {
    constructor() {
        this.width = WIDTH;
        this.height = HEIGHT;
        this.cells = this.createCells()
    }

    createCells() {
        return new Array(this.width * this.height).fill(null).map((_, i) => {
            return i % 2 ? Cell.Alive : Cell.Dead;
        })
    }

    getCellIndex(row, col) {
        return row * this.width + col
    }

    toString() {
        let str = '';
        for(let i = 1; i <= this.cells.length; i++) {
            str += this.cells[i] === Cell.Alive ? 'O' : '_'
            if(i % this.width === 0) str += '\n'
        }
        return str;
    }

    findCellNeighbors(row, col) {
        let neighbors = 0;
        for(let i = 0; i < 3; i++) {
            const neighborRow = (row - 1 + i + this.height) % this.height;
            for(let j = 0; j < 3; j++) {
                const neighborCol = (col - 1 + j + this.width) % this.width;
                if(neighborRow === row && neighborCol === col) continue;
                const idx = this.getCellIndex(neighborRow, neighborCol)
                neighbors += this.cells[idx];
            }
        }
        return neighbors;
    }
}

function drawCells(universe, ctx) {
    const { cells } = universe;
    for(let i = 0; i < cells.length; i++) {
        // ctx
    }
}

function drawGrid(universe, ctx) {
    ctx.strokeColor = BORDER_STROKE;
    ctx.lineWidth = BORDER;
    for(let row = 0; row <= universe.height; row++) {
        ctx.moveTo(0, row * CELL_SIZE + BORDER)
        ctx.lineTo(universe.width * CELL_SIZE + BORDER, row * CELL_SIZE + BORDER)
        for(let col = 0; col <= universe.height; col++) {
            ctx.moveTo(col * CELL_SIZE + BORDER, 0)
            ctx.lineTo(col * CELL_SIZE + BORDER, universe.height * CELL_SIZE + BORDER)
        }
    }
    ctx.stroke()
}

export default function(canvas) {
    const universe = new Universe();
    canvas.width = universe.width * (CELL_SIZE + BORDER);
    canvas.height = universe.height * (CELL_SIZE + BORDER);
    const ctx = canvas.getContext('2d');
    
    drawGrid(universe, ctx);
}