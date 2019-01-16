let Application = PIXI.Application,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite,
  TextureCache = PIXI.TextureCache,
  Rectangle = PIXI.Rectangle

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

let dungeon, explorer, treasure, id;

function setup() {
  id = resources["base"].textures;
  dungeon = new Sprite(id["dungeon"]);
  explorer = new Sprite(id["explorer"]);
  treasure = new Sprite(id["treasure"]);
  app.stage.addChild(dungeon);
  app.stage.addChild(explorer);
  app.stage.addChild(treasure);

  treasure.x = app.stage.width - treasure.width - 48;
  treasure.y = app.stage.height / 2 - treasure.height / 2;
  explorer.x = 48;
  explorer.y = app.stage.height / 2 - explorer.height / 2;
}
