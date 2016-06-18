let playSound;
let score;
let localStorageName = "crackAlien";
let highScore;

class PlayGame {
  constructor(game) {
    this.game = game;

    this.tileSize = 80;
    this.numRows = 4;
    this.numCols = 5;
    this.tileSpacing = 10;
    this.tilesArray = [];
    this.selectedArray = [];

    this.soundArray = [];

    score = 0;
    this.scoreText = null;

    this.timeLeft = 60;
    this.timeText = null;

    this.tilesLeft;
  }

  preload() {
    this.game.load.spritesheet("tiles", "/assets/img/tiles-letter.png", this.tileSize, this.tileSize);

    this.game.load.audio("select", ["/assets/audio/select.mp3"]);
    this.game.load.audio("right", ["/assets/audio/right.mp3"]);
    this.game.load.audio("wrong", ["/assets/audio/wrong.mp3"]);
  }

  placeTiles() {
    let { game, 
          tileSize, 
          numRows, 
          numCols, 
          tileSpacing, 
          tilesArray,
          showTile } = this;

    this.tilesLeft = numRows * numCols;

    let leftSpace = (game.width - (numCols * tileSize) - ((numCols - 1) * tileSpacing)) / 2;
    let topSpace = (game.height - (numRows * tileSize) - ((numRows - 1) * tileSpacing)) / 2;

    // Having two representations for each tile
    // because there are two tiles to be matched
    for (let i = 0; i < numRows * numCols; i++) {
      tilesArray.push(Math.floor(i / 2));
    }

    // Randomize tiles
    for (let i = 0; i < numRows * numCols; i++) {
      let from = game.rnd.between(0, tilesArray.length - 1);
      let to = game.rnd.between(0, tilesArray.length - 1);

      let temp = tilesArray[from];

      tilesArray[from] = tilesArray[to];
      tilesArray[to] = temp;
    }

    // Place the tiles as buttons
    for (let i = 0; i < numCols; i++) {
      for (let j = 0; j < numRows; j++) {
        let tile = game.add.button(leftSpace + i * (tileSize + tileSpacing),
                                  topSpace + j * (tileSize + tileSpacing),
                                  "tiles",
                                  showTile,                
                                  this);
        tile.frame = 11;
        tile.value = tilesArray[j * numCols + i];
      }
    }
  }

  showTile(target) {
    let { selectedArray, checkTiles, game, soundArray } = this;

    if (selectedArray.length < 2 &&
        selectedArray.indexOf(target) == -1) {

      if (playSound) {
        soundArray[0].play();
      }

      target.frame = target.value;
      selectedArray.push(target);
    }

    game.time.events.add(Phaser.Timer.SECOND, checkTiles, this); 
  }

  checkTiles() {
    let { selectedArray, soundArray } = this;

    if (selectedArray.length == 2) {
      // Wait for 1 second so that we can show
      // the 2nd selected tile before checking tiles
      if (selectedArray[0].value == selectedArray[1].value) {
        if (playSound) {
          soundArray[1].play();
        }

        score++;
        this.scoreText.text = `Score: ${score}`;

        selectedArray[0].destroy();
        selectedArray[1].destroy();

        this.timeLeft += 2;
        this.timeText.text = `Time left: ${this.timeLeft}`;

        this.tilesLeft -= 2;
        if (this.tilesLeft === 0) {
          this.tilesArray.length = 0;
          this.selectedArray.length = 0;
          this.placeTiles();
        }

      } else {
        if (playSound) {
          soundArray[2].play();
        }

        selectedArray[0].frame = 11;
        selectedArray[1].frame = 11;
      }

      selectedArray.pop();
      selectedArray.pop();
    }
  }

  create() {
    this.placeTiles();

    if (playSound) {
      this.soundArray[0] = this.game.add.audio("select", 1);
      this.soundArray[1] = this.game.add.audio("right", 1);
      this.soundArray[2] = this.game.add.audio("wrong", 1);
    }

    let style = {
      font: "32px Monospace",
      fill: "#00FF00",
      align: "center"
    };

    this.scoreText = this.game.add.text(5, 5, `Score: ${score}`, style);

    this.timeText = this.game.add.text(5, this.game.height - 5, `Time left: ${this.timeLeft}`, style);
    this.timeText.anchor.set(0, 1);
    this.game.time.events.loop(Phaser.Timer.SECOND, this.decreaseTime, this);
  }

  decreaseTime() {
    this.timeLeft--;
    this.timeText.text = `Time left: ${this.timeLeft}`;

    if (this.timeLeft == 0) {
      this.game.state.start("GameOver");
    }
  }
}

class TitleScreen {
  constructor(game) {
    this.game = game;
  }

  preload() {
    this.game.load.spritesheet("sound", "/assets/img/sound.png", 80, 80);
  }

  create() {
    let { game, startGame } = this;

    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    // Removing focus from the page, the game won't pause
    // to prevent cheating by pausing the timer
    game.state.disableVisibilityChange = true;

    let style = {
      font: "48px Monospace",
      fill: "#00FF00",
      align: "center",
    };

    let text = game.add.text(game.width / 2, 
                             game.height / 2 - 100, 
                             "Crack Alien Code",
                             style);
    text.anchor.set(0.5);

    let soundButton = game.add.button(game.width / 2 - 100,
                                      game.height / 2 + 100,
                                      "sound",
                                      startGame, this);

    soundButton.frame = 1;
    soundButton.anchor.set(0.5);

    soundButton = game.add.button(game.width / 2 + 100,
                                  game.height / 2 + 100,
                                  "sound",
                                  startGame,
                                  this);

    soundButton.frame = 0;
    soundButton.anchor.set(0.5);
  }

  startGame(target) {
    if (target.frame == 0) {
      playSound = true;
    } else {
      playSound = false;
    }
    
    this.game.state.start("PlayGame");
  }
}

class GameOver {
  constructor(game) {
    this.game = game;
  }

  create() {
    highScore = Math.max(score, highScore);
    localStorage.setItem(localStorageName, highScore);

    let style = {
      font: "32px Monospace",
      fill: "#00FF00",
      align: "center"
    };

    let text = this.game.add.text(this.game.width / 2, 
                             this.game.height / 2, 
                             `Game over` + 
                             `\n\nYour score: ${score}` + 
                             `\n\nBest score: ${highScore}` +
                             `\n\nTap to restart`, style);
    text.anchor.set(0.5);

    this.game.input.onDown.add(this.restartGame, this);
  }

  restartGame() {
    this.game.state.start("TitleScreen");
  }
}

function onLoad() {
  let game = new Phaser.Game(500, 500);

  game.state.add("TitleScreen", TitleScreen);
  game.state.add("PlayGame", PlayGame);
  game.state.add("GameOver", GameOver);

  highScore = localStorage.getItem(localStorageName) == null ? 0 :
      localStorage.getItem(localStorageName);

  game.state.start("TitleScreen");

  // TODO 
  // organize better
  // make PreloadAssets state
  // squish bugs
}

window.onload = onLoad;
