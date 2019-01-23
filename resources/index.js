let Application = PIXI.Application,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite,
  TextureCache = PIXI.TextureCache,
  Rectangle = PIXI.Rectangle,
  Container = PIXI.Container;

const ICON = 64;

let app = new Application({
  width: 512,
  height: 512,
  antialias: true,
  transparent: false,
  resolution: 1
});

document.body.appendChild(app.view);

loader
  .add("base", "resources/images/base.json")
  .load(setup);

let state;

function gameLoop(delta) {

}

function play(delta) {

}

function end() {

}

function setup() {
   state = play;
  app.ticker.add(delta => gameLoop(delta));

  gameScene = new Container();
  app.stage.addChild(gameScene);

  gameOverScene = new Container();
  app.stage.addChild(gameOverScene);
  gameOverScene.visible = false;

}
