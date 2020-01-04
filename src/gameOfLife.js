const WIDTH = 64;
const HEIGHT = 64;
const CELL_SIZE = 8;
const CELL_ALIVE_STROKE = '#77ccaa';
const CELL_DEAD_STROKE = '#FFFFFF';
const colors = [CELL_DEAD_STROKE, CELL_ALIVE_STROKE]
const BORDER = 1;
const BORDER_STROKE = '#ddd';
const MAX_FRAMERATE = 60;

const Cell = {
    Alive: 1,
    Dead: 0,
}

class Universe {
    constructor() {
        this.width = WIDTH;
        this.height = HEIGHT;
        this.cells = this.createCells();
    }

    createCells(seed = 2) {
        let newCells = new Array(this.width * this.height)
            .fill(null)
            .map((_, i) => i % seed ? Cell.Alive : Cell.Dead);
        return newCells
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

    tick() {
        let newCells = [];
        for(let row = 0; row < this.height; row++) {
            for(let col = 0; col < this.width; col++) {
                const idx = this.getCellIndex(row, col);
                const neighbors = this.findCellNeighbors(row, col);
                newCells[idx] = this.rules(this.cells[idx], neighbors);
            }
        }
        this.cells = newCells;
    }

    rules(cell, neighbors) {
        // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
        if(cell === Cell.Alive && neighbors < 2) {
            return Cell.Dead;
        }
        // Any live cell with two or three live neighbours lives on to the next generation.
        if(cell === Cell.Alive && (neighbors === 2) || (neighbors === 3)) {
            return Cell.Alive;
        }
        // Any live cell with more than three live neighbours dies, as if by overpopulation.
        if(cell === Cell.Alive && neighbors > 3) {
            return Cell.Dead;
        }
        // Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        if(cell === Cell.Dead && neighbors === 3) {
            return Cell.Alive;
        }
        return cell;
    }

    findCellNeighbors(row, col) {
        let neighbors = 0;
        for(let i = -1; i <= 1; i++) {
            const neighborRow = (row + i + this.height) % this.height;
            for(let j = -1; j <= 1; j++) {
                const neighborCol = (col + j + this.width) % this.width;
                if(neighborRow === row && neighborCol === col) continue;
                const idx = this.getCellIndex(neighborRow, neighborCol)
                neighbors += this.cells[idx];
            }
        }
        return neighbors;
    }
}

function drawCells(universe, ctx) {
    ctx.beginPath();

    for(let row = 0; row < universe.height; row++) {
        for(let col = 0; col < universe.width; col++) {
            const idx = universe.getCellIndex(row, col);
            const cell = universe.cells[idx]
            ctx.fillStyle = colors[cell];
            ctx.fillRect(
                col * (CELL_SIZE + BORDER) + BORDER,
                row * (CELL_SIZE + BORDER) + BORDER,
                CELL_SIZE,
                CELL_SIZE,
            )
        }
    }

    ctx.stroke()
}

function drawGrid(universe, ctx) {
    ctx.beginPath();

    ctx.strokeStyle = BORDER_STROKE;
    ctx.lineWidth = BORDER;

    for(let row = 0; row <= universe.height; row++) {
        ctx.moveTo(0, row * (CELL_SIZE + BORDER) + BORDER)
        ctx.lineTo(universe.width * (CELL_SIZE + BORDER) + BORDER, row * (CELL_SIZE + BORDER) + BORDER)
    }

    for(let col = 0; col <= universe.width; col++) {
        ctx.moveTo(col * (CELL_SIZE + BORDER) + BORDER, 0)
        ctx.lineTo(col * (CELL_SIZE + BORDER) + BORDER, universe.height * (CELL_SIZE + BORDER) + BORDER)
    }

    ctx.stroke()
}

export default function({ 
    canvas,
    seedRange,
    speedRange,
 }) {
    const universe = new Universe();
    canvas.width = universe.width * (CELL_SIZE + BORDER) + BORDER;
    canvas.height = universe.height * (CELL_SIZE + BORDER) + BORDER;
    const ctx = canvas.getContext('2d');
    let framerate = 15;

    // Handlers
    function changeSeed(ev) {
        universe.cells = universe.createCells(ev.target.value);
        drawCells(universe, ctx);
    }
    seedRange.addEventListener('input', changeSeed)
    function changeSpeed(ev) {
        framerate = (ev.target.value / 100) * MAX_FRAMERATE
    }
    speedRange.addEventListener('input', changeSpeed)
    
    // Loop
    drawGrid(universe, ctx);
    drawCells(universe, ctx);
    let time = Date.now();
    let timeBuffer = 0;
    const loop = () => {
        const now = Date.now();
        const delta = now - time;
        timeBuffer += delta;
        time = now; 
        if (timeBuffer > 1000 / framerate) {
            universe.tick();
            drawCells(universe, ctx);
            timeBuffer = 0;
        }

        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
}