let Application = PIXI.Application,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite,
  TextureCache = PIXI.TextureCache,
  Rectangle = PIXI.Rectangle,
  Container = PIXI.Container,
  Graphics = PIXI.Graphics,
  TextStyle = PIXI.TextStyle,
  Text = PIXI.Text;

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
  .add("resources/images/base.json")
  .load(setup);

let state, id, dungeon, door, explorer, treasure, healthBar, message;

function gameLoop(delta) {
  state(delta);
}

function play(delta) {

}

function end() {

}

function setup() {
  state = play;
  gameScene = new Container();
  app.stage.addChild(gameScene);

  gameOverScene = new Container();
  app.stage.addChild(gameOverScene);
  gameOverScene.visible = false;

  id = resources["resources/images/base.json"].textures;
  dungeon = new Sprite(id["dungeon"]);
  gameScene.addChild(dungeon);

  door = new Sprite(id["door"]);
  door.position.set(32, 0);
  gameScene.addChild(door);

  explorer = new Sprite(id["explorer"]);
  explorer.x = 68;
  explorer.y = gameScene.height / 2 - explorer.height / 2;
  explorer.vx = 0;
  explorer.vy = 0;
  gameScene.addChild(explorer);

  treasure = new Sprite(id["treasure"]);
  treasure.x = gameScene.width - treasure.width - 48;
  treasure.y = gameScene.height / 2 - treasure.height / 2;
  gameScene.addChild(treasure);

  app.ticker.add(delta => gameLoop(delta));

  let numberOfBlobs = 6,
    spacing = 48,
    noZone = 150,
    speed = 2,
    direction = 1;

  blobs = [];

  for (let i = 0; i < numberOfBlobs; i++) {
    let blob = new Sprite(id["blob"]);
    let x = spacing * i + noZone;
    let y = randomInt(0, app.stage.height - blob.height);

    blob.x = x;
    blob.y = y;
    blob.vy = speed * direction;
    direction *= -1;
    blobs.push(blob);

    gameScene.addChild(blob);
  }

  healthBar = new Container();
  healthBar.position.set(app.stage.width - 170, 4);
  gameScene.addChild(healthBar);

  let backBar = new Graphics();
  backBar.beginFill(0x000000);
  backBar.drawRect(0, 0, 128, 8);
  backBar.endFill();
  healthBar.addChild(backBar);

  let frontBar = new Graphics();
  frontBar.beginFill(0x81259D);
  frontBar.drawRect(0, 0, 128, 8);
  frontBar.endFill();
  healthBar.addChild(frontBar);

  healthBar.outer = frontBar;
  healthBar.outer.width = 90;

  let style = new TextStyle({
    fontFamily: "Futura",
    fontSize: 64,
    fill: "orange"
  });
  message = new Text("The End!", style);
  message.x = 120;
  message.y = app.stage.height / 2 - 32;
  gameOverScene.addChild(message);
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function contain(sprite, container) {
  let collision = undefined;

  if (sprite.x < container.x) {
    sprite.x = container.x;
    collision = "left";
  }

  if (sprite.y < container.y) {
    sprite.y = container.y;
    collision = "top";
 }

 if (sprite.x + sprite.width > container.width) {
   sprite.x = container.width - sprite.width;
   collision = "right";
 }

 if (sprite.y + sprite.height > container.height) {
   sprite.y = container.height - sprite.height;
   collision = "bottom";
 }

 return collision;
}

function hitTestRectangle(r1, r2) {
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  r1.centerX = r1.x + r1.width / 2;
  r1.centerY = r1.y + r1.height / 2;
  r2.centerX = r2.x + r2.width / 2;
  r2.centerY = r2.y + r2.height / 2;

  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  return Math.abs(vx) < combinedHalfWidths && Math.abs(vy) < combinedHalfHeights;
}