import { App } from "./components/App";

document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.getElementById("gameContainer");
  if (gameContainer) {
    const app = new App(gameContainer);
    const newGameButton = document.getElementById("new-game-button");
    if (newGameButton) {
      newGameButton.addEventListener("click", () => {
        app.initializeGame();
      });
    }
  }
});
