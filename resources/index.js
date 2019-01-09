let Application = PIXI.Application,
  loader = PIXI.loader,
  resources = PIXI.loader.resources,
  Sprite = PIXI.Sprite;
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

app.renderer.backgroundColor = 0x717171;
app.renderer.autoResize = true;
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

loader
  .add("cat", "resources/images/cat.png")
  .add("tudo", "resources/images/tileset.png")
  .on("progress", loadProgressHandler)
  .load(setup);

function setup() {
  let tileset = TextureCache["tudo"];
  let cat = new Sprite(resources.cat.texture);
  let alienGrabber = new Rectangle(2 * ICON, 1 * ICON, ICON, ICON);
  tileset.frame = alienGrabber;
  let alien = new Sprite(tileset);
  cat.x = 100;
  cat.y = 100;
  cat.width = 80;
  cat.height = 600;
  cat.scale.set(1, 3);
  cat.rotation = 0.5;
  app.stage.addChild(cat);
  app.stage.addChild(alien);
};

function loadProgressHandler(loader, resource) {
  console.log("loading: " + resource.url);
  console.log("progress: " + loader.progress + "%");
}