import { Game } from '../models/Game';

export class App {
    private game: Game;
    private gameBoardElement: HTMLElement;

    constructor(private gameContainer: HTMLElement) {
        this.gameBoardElement = gameContainer.querySelector('#gameBoard') as HTMLElement;
        this.game = new Game();
        this.initializeGame();
    }

    initializeGame(): void {
        this.displayElement('game-over', false);
        this.displayElement('win-message', false);
        this.game.reset();
        this.renderBoard();
        this.renderScore();
        document.addEventListener('keydown', (event) => this.handleKeyPress(event));
    }

    private displayElement(elementId: string, display: boolean = true): void {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = display ? 'flex' : 'none';
        }
    }

    private renderBoard(): void {
        const tiles = this.game.getBoard().getTiles();
        this.gameBoardElement.innerHTML = '';

        tiles.forEach(row => {
            const rowElement = document.createElement('div');
            rowElement.className = 'row';

            row.forEach(tile => {
                const tileElement = document.createElement('div');
                tileElement.className = 'tile';
                tileElement.textContent = tile.getValue()?.toString() || '';
                tileElement.setAttribute('data-value', tile.getValue()?.toString() || '');
                rowElement.appendChild(tileElement);
            });

            this.gameBoardElement.appendChild(rowElement);
        });
    }

    private renderScore(): void {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = 'SCORE: ' + this.game.getScore().toString();
        }
    }

    private handleKeyPress(event: KeyboardEvent): void {
        let moved = false;
    
        switch (event.key) {
            case 'ArrowUp':
                moved = this.game.move('up');
                break;
            case 'ArrowDown':
                moved = this.game.move('down');
                break;
            case 'ArrowLeft':
                moved = this.game.move('left');
                break;
            case 'ArrowRight':
                moved = this.game.move('right');
                break;
            default:
                return;
        }
    
        if (moved) {
            this.game.addRandomTile();
            if (this.game.isGameOver()) {
                this.displayElement('game-over');
            }
    
            if (this.game.hasWon()) {
                this.displayElement('win-message');
            }
        }
        this.renderBoard();
        this.renderScore();
    }
}
