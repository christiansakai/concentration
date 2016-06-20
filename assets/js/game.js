function onLoad() {
  let game = new Phaser.Game(500, 500);

  game.state.add("StateIntro", StateIntro);
  game.state.add("StateMain", StateMain);
  game.state.add("StateOver", StateOver);

  game.state.start("StateIntro");
}

window.onload = onLoad;
