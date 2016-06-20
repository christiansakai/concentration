(function(window) {
  let Phaser = window.Phaser;

  let StateIntro = function() {};

  StateIntro.prototype.preload = function() {
    this.game.load.spritesheet("soundIcons", "/assets/img/sound.png", 80, 80); 
  };

  StateIntro.prototype.create = function() {
    // Scale game to full screen
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    // Removing focus from the game won't make the game pause
    this.game.state.disableVisibilityChange = true;

    this.renderTitle();
    this.renderSoundButtons();
  };

  StateIntro.prototype.renderTitle = function() {
    let width = this.game.width / 2; 
    let height = this.game.height / 2 - 100;
    let text = "Crack Alien Code";

    let style = {
      font: "48px Monospace",
      fill: "#00FF00",
      align: "center"
    };

    let title = this.game.add.text(width, height, text, style);

    // Set x plane anchor to be at the middle
    title.anchor.set(0.5);
  };

  StateIntro.prototype.renderSoundButtons = function() {
    let soundButton = this.game.add.button(this.game.width / 2 - 100,
                                           this.game.height / 2 + 100,
                                           "soundIcons",
                                           this.startGame,
                                           this);

    soundButton.frame = 1;
    soundButton.anchor.set(0.5);

    let noSoundButton = this.game.add.button(this.game.width / 2 + 100,
                                             this.game.height / 2 + 100,
                                             "soundIcons",
                                             this.startGame,
                                             this);

    noSoundButton.frame = 0;
    noSoundButton.anchor.set(0.5);
  };

  StateIntro.prototype.startGame = function(target) {
    let clearWorld = true;
    let clearCache = false;

    let playSound;

    if (target.frame === 0) {
      playSound = true;
    } else {
      playSound = false;
    }

    this.game.state.start("StateMain", clearWorld, clearCache, playSound); 
  };

  window.StateIntro = StateIntro;
})(window);

