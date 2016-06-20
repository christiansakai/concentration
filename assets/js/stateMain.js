(function(window) {
  let Phaser = window.Phaser;

  let StateMain = function() {};

  StateMain.prototype.init = function(playSound) {
    this.playSound = playSound;
    this.tileSize = 80;
    this.numRows = 4;
    this.numCols = 5;
    this.tileSpacing = 10;
    this.tiles = [];
    this.selectedTiles = [];
    this.sounds = {};
    this.timeLeft = 60;
    this.timeText = null;
    this.tilesLeft = this.numRows * this.numCols;
    this.score = 0;
    this.scoreText = null;
  };

  StateMain.prototype.preload = function() {
    this.game.load.spritesheet("tiles", "/assets/img/tiles-letter.png", this.tileSize, this.tileSize);

    this.game.load.audio("select", "/assets/audio/select.mp3");
    this.game.load.audio("right", "/assets/audio/right.mp3");
    this.game.load.audio("wrong", "/assets/audio/wrong.mp3");
  };

  StateMain.prototype.create = function() {
    if (this.playSound) {
      this.setupSounds();
    }

    this.setupTiles();
    this.setupScoreboard();
    this.setupTime();
  };

  StateMain.prototype.setupSounds = function() {
    this.sounds.select = this.game.add.audio("select");
    this.sounds.right = this.game.add.audio("right");
    this.sounds.wrong = this.game.add.audio("wrong");
  };

  StateMain.prototype.setupTiles = function() {
    let leftSpace = (this.game.width - (this.numCols * this.tileSize) - ((this.numCols - 1) * this.tileSpacing)) / 2;
    let topSpace = (this.game.height - (this.numRows * this.tileSize) - ((this.numRows - 1) * this.tileSpacing)) / 2;

    // Two tiles each representation
    // because there are two tiles to be matched
    let i, j;
    for (i = 0; i < this.numRows * this.numCols; i++) {
      this.tiles.push(Math.floor(i / 2));
    }

    // Randomize array
    for (i = 0; i < this.numRows * this.numCols; i++) {
      let from = this.game.rnd.between(0, this.tiles.length - 1);
      let to = this.game.rnd.between(0, this.tiles.length - 1);
      let temp = this.tiles[from];

      this.tiles[from] = this.tiles[to];
      this.tiles[to] = temp;
    }

    for (i = 0; i < this.numCols; i++) {
      for (j = 0; j < this.numRows; j++) {
        let tile = this.game.add.button(leftSpace + i * (this.tileSize + this.tileSpacing),
                                        topSpace + j * (this.tileSize + this.tileSpacing),
                                        "tiles",
                                        this.showTile,
                                        this);

        tile.frame = 11;
        tile.value = this.tiles[j * this.numCols + i];
      }
    }
  };

  StateMain.prototype.showTile = function(target) {
    if (this.selectedTiles.length < 2 &&
        this.selectedTiles.indexOf(target) === -1) {
      if (this.playSound) {
        this.sounds.select.play();
      }

      target.frame = target.value;
      this.selectedTiles.push(target);
    }

    this.game.time.events.add(Phaser.Timer.SECOND, this.checkTiles, this);
  };
  
  StateMain.prototype.checkTiles = function() {
    if (this.selectedTiles.length == 2) {
      if (this.selectedTiles[0].value === this.selectedTiles[1].value) {
        if (this.playSound) {
          this.sounds.right.play();
        }

        this.score++;
        this.scoreText.text = `Score: ${this.score}`;

        this.timeLeft += 2;
        this.timeText.text = `Time left: ${this.timeLeft}`;

        this.selectedTiles[0].destroy();
        this.selectedTiles[1].destroy();

        this.tilesLeft -= 2;
        if (this.tilesLeft === 0) {
          this.tiles.length = 0;
          this.selectedTiles.length = 0;
          this.setupTiles();
        }
      } else {
        if (this.playSound) {
          this.sounds.wrong.play();
        }

        this.selectedTiles[0].frame = 11;
        this.selectedTiles[1].frame = 11;
      }

      this.selectedTiles.pop();
      this.selectedTiles.pop();
    }
  };

  StateMain.prototype.setupScoreboard = function() {
    let width = height = 5;

    let scoreText = `Score: ${this.score}`;

    let style = {
      font: "32px Monospace",
      fill: "#00FF00",
      align: "center"
    };

    this.scoreText = this.game.add.text(height, width, scoreText, style);
  };

  StateMain.prototype.setupTime = function() {
    let width = 5;
    let height = this.game.height - 5;

    let timeLeftText = `Time left: ${this.timeLeft}`;

    let style = {
      font: "32px Monospace",
      fill: "#00FF00",
      align: "center"
    };

    this.timeText = this.game.add.text(width, height, timeLeftText, style);
    this.timeText.anchor.set(0, 1);

    this.game.time.events.loop(Phaser.Timer.SECOND, decreaseTime, this);

    function decreaseTime() {
      this.timeLeft--;
      this.timeText.text = `Time left: ${this.timeLeft}`;

      if (this.timeLeft === 0) {
        this.game.state.start("StateOver", true, false, this.score);
      }
    }
  };

  window.StateMain = StateMain;

})(window);
