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

  function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    key.downHandler = event => {
      if (event.key === key.value) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
      }
    };

    key.upHandler = event => {
      if (event.key === key.value) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
      }
    };

    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener(
      "keydown", downListener, false
    );
    window.addEventListener(
      "keyup", upListener, false
    );

    key.unsubscribe = () => {
      window.removeEventListener("keydown", downListener);
      window.removeEventListener("keyup", upListener);
    };

    return key;
  }

let dungeon, explorer, treasure, door, id;
let state;
let left = keyboard("ArrowLeft"),
      up = keyboard("ArrowUp"),
      right = keyboard("ArrowRight"),
      down = keyboard("ArrowDown");
let blobArray = [];
let N_BLOBS = 100;
let MARGIN = 48;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function explorerLoop(d) {
  if (explorer.x <= (app.stage.width - 48) && explorer.vx > 0) {
    explorer.vx = 1;
  } else if (explorer.x >= 48 && explorer.vx < 0) {
    explorer.vx = -1;
  }
  else {
    explorer.vx = -explorer.vx;
  }
  explorer.x += explorer.vx * randomInt(1,10);
}

function blobLoop(d) {
  blobArray.forEach(b => {
    if (b.y <= (app.stage.height - 48) && b.vy > 0) {
      b.vy = 1;
    } else if (b.y >= 48  && b.vy < 0) {
      b.vy = -1;
    } else {
      b.vy = -b.vy;
    }
    b.y += b.vy * randomInt(1,4);
  });
}

function initializePositions() {
  treasure.x = app.stage.width - treasure.width - 48;
  treasure.y = app.stage.height / 2 - treasure.height / 2;
  explorer.x = 48;
  explorer.y = app.stage.height / 2 - explorer.height / 2;
  door.x = 48;
}

function initializeSprites() {
  id = resources["base"].textures;
  dungeon = new Sprite(id["dungeon"]);
  explorer = new Sprite(id["explorer"]);
  treasure = new Sprite(id["treasure"]);
  door = new Sprite(id["door"]);
  app.stage.addChild(dungeon);
  app.stage.addChild(explorer);
  app.stage.addChild(treasure);
  app.stage.addChild(door);
}

function initializeVelocities() {
  explorer.vx = 0;
  explorer.vy = 0;
}

function addBlobs() {
  for (let i = 0; i < N_BLOBS; i++) {
    let blob = new Sprite(id["blob"]);
    blob.x = randomInt(80, app.stage.width - MARGIN - blob.width - treasure.width);
    blob.y = randomInt(MARGIN, app.stage.height - MARGIN - blob.height);
    blob.vx = 0;
    blob.vy = 1;
    blobArray.push(blob);
    app.stage.addChild(blob);
  }
}

function setupMovements() {
  left.press = () => {
    explorer.vx = -5;
    explorer.vy = 0;
  };
  left.release = () => {
    if (!right.isDown) {
      explorer.vx = 0;
    }
  };

  right.press = () => {
    explorer.vx = 5;
    explorer.vy = 0;
  };
  right.release = () => {
    if (!left.isDown) {
      explorer.vx = 0;
    }
  };

  up.press = () => {
    explorer.vx = 0;
    explorer.vy = -5;
  };
  up.release = () => {
    if (!down.isDown) {
      explorer.vy = 0;
    }
  };

  down.press = () => {
    explorer.vx = 0;
    explorer.vy = 5;
  };
  down.release = () => {
    if (!up.isDown) {
      explorer.vy = 0;
    }
  };
}

function play(delta) {
  // explorerLoop(delta);
  explorer.x += explorer.vx;
  explorer.y += explorer.vy;
  blobLoop(delta);
}

function gameLoop(delta) {
  state(delta);
}

function setup() {
  initializeSprites();
  initializePositions();
  initializeVelocities();
  setupMovements();
  addBlobs();
  state = play;
  app.ticker.add(d => gameLoop(d));
}
