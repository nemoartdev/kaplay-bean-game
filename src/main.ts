import kaplay from "kaplay";

const FLOOR_HEIGHT = 48;
const JUMP_FORCE = 800;
const SPEED = 480;

// initialize context
const k = kaplay();

// load assets
k.loadSprite("bean", "sprites/bean.png");

k.scene("game", () => {
  // define gravity
  k.setGravity(1600);

  // add a game object to screen
  const player = k.add([
    // list of components
    k.sprite("bean"),
    k.pos(80, 40),
    k.area(),
    k.body(),
  ]);

  // floor
  k.add([
    k.rect(k.width(), FLOOR_HEIGHT),
    k.outline(4),
    k.pos(0, k.height()),
    k.anchor("botleft"),
    k.area(),
    k.body({ isStatic: true }),
    k.color(127, 200, 255),
  ]);

  function jump() {
    if (player.isGrounded()) {
      player.jump(JUMP_FORCE);
    }
  }

  // jump when user press space
  k.onKeyPress("space", jump);
  k.onClick(jump);

  function spawnTree() {
    // add tree obj
    k.add([
      k.rect(48, k.rand(32, 96)),
      k.area(),
      k.outline(4),
      k.pos(k.width(), k.height() - FLOOR_HEIGHT),
      k.anchor("botleft"),
      k.color(255, 180, 255),
      k.move(k.LEFT, SPEED),
      "tree",
    ]);

    // wait a random amount of time to spawn next tree
    k.wait(k.rand(0.5, 1.5), spawnTree);
  }

  // start spawning trees
  spawnTree();

  // lose if player collides with any game obj with tag "tree"
  player.onCollide("tree", () => {
    // go to "lose" scene and pass the score
    k.go("lose", score);
    k.addKaboom(player.pos);
  });

  // keep track of score
  let score = 0;

  const scoreLabel = k.add([k.text(`${score}`), k.pos(24, 24)]);

  // increment score every frame
  k.onUpdate(() => {
    score++;
    scoreLabel.text = `${score}`;
  });
});

k.scene("lose", (score) => {
  k.add([
    k.sprite("bean"),
    k.pos(k.width() / 2, k.height() / 2 - 80),
    k.scale(2),
    k.anchor("center"),
  ]);

  // display score
  k.add([
    k.text(score),
    k.pos(k.width() / 2, k.height() / 2 + 80),
    k.scale(2),
    k.anchor("center"),
  ]);

  // go back to game with space is pressed
  k.onKeyPress("space", () => k.go("game"));
  k.onClick(() => k.go("game"));
});

k.go("game");
