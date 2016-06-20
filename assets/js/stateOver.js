(function(window) {
  let Phaser = window.Phaser;

  let StateOver = function() {};

  StateOver.prototype.init = function(score) {
    this.score = score;
  };

  StateOver.prototype.create = function() {
    this.renderScore();

    this.game.input.onDown.add(this.restartGame, this);
  };

  StateOver.prototype.renderScore = function() {
    let { score, highScore } = this.setGetScores();

    let width = this.game.width / 2;
    let height = this.game.height / 2;

    let style = {
      font: "48px Monospace",
      fill: "#00FF00",
      align: "center"
    };

    let scoreText = `Game Over\n\nYour score: ${score}\n\nBest score: ${highScore}\n\nTap to restart`;

    let text = this.game.add.text(width, height, scoreText, style);

    text.anchor.set(0.5);
  };

  StateOver.prototype.setGetScores = function() {
    let highScore = localStorage.getItem("highScore");

    if (highScore) {
      highScore = Math.max(this.score, highScore);
    } else {
      highScore = this.score;
    }

    localStorage.setItem("highScore", highScore);

    return { score: this.score, highScore };
  };

  StateOver.prototype.restartGame = function() {
    this.game.state.start("StateIntro", true, false);
  };

  window.StateOver = StateOver;
})(window);
