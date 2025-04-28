//IMPORTANT: Make sure to use Kaboom version 0.5.0 for this game by adding the correct script tag in the HTML file.

kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  debug: true,
  clearColor: [0, 0, 1, 1]
})

//const BOWSER_FIRE_RATE = 1
const Fireball_speed = 0.75
var isJumping = true
const fall_death = 400
var isBig = false
const jump_force = 360
const big_jump_force = 550
let current_jump_force = jump_force
const move_speed = 150
let current_move_speed = move_speed
const big_move_speed = 180
var t = 0
var f_count = 0
var b_lives = 20
let dir_p = true
loadSprite('image', 'background.png')
loadSprite('big_powerup', 'Sprites/Big.png'),
  loadSprite('block', 'Sprites/Block.png'),
  loadSprite('boss', 'Sprites/bowser.png')
loadSprite('coin', 'Sprites/Coin.png'),
  loadSprite('fire', 'Sprites/fire.png'),
  loadSprite('health', 'Sprites/health.png'),
  loadSprite('goomba', 'Sprites/goomba.png')
loadSprite('mario_right', 'Sprites/Mario_right.png'),
  loadSprite('mario_left', 'Sprites/Mario_left.png')
loadSprite('mystery_box', 'Sprites/Mystery.png'),
  loadSprite('portal', 'Sprites/portal.png'),
  loadSprite('empty_box', 'Sprites/empty.png'),
  loadSprite('bu_right', 'Sprites/bu_right.png'),
  loadSprite('bu_left', 'Sprites/bu_left.png'),
  loadSprite('lava', 'Sprites/lava.png')
loadSprite('h_mario', 'Sprites/h_mario.png')
loadSprite('peach', 'Sprites/peach.png')
loadSprite('s_mario', 'Sprites/s_mario.png')

scene("game", ({ level, score }) => {
  layers(['bg', 'obj', 'ui'], 'obj')

  const maps = [
    [
      '_                                                                     _',
      '_               _        E         _                                  _',
      '_        qqqqq  ____________________                        ___^^^    _',
      '_   ___                                                        _      _',
      '_                                                          P   _   P  _',
      '_        _     E        _                                _______$$$$$$_',
      '______________________________________________  _______________________',
      '_                                                                     _',
      '_                                                                     _',
      '_                                                                     _',
      '_                            h  __          E       __          E $$ __',
      '_     ___^^___^^___^^___^^_____________________________________________',
      '_                  __   __                                            _',
      '_                                                                     _',
      '_                    _     E       _                                  _',
      '_                    _______________                               p  _',
      '_           _______________________________              _____^^      _',
      '_______________________________________________________________________',
    ],
    [
      '_                                                                     _',
      '_                  $$    _     E  $$   _                              _',
      '_         _     E        __^^^__________     E       _                _',
      '_     $$$ ____________________________________________                _',
      '__________________________________________________________      _______',
      '_                                                                     _',
      '_      _         E       E        E      E     E                     __',
      '_      ________________________________________________________________',
      '_                                                                     _',
      '_                                                                     _',
      '_                                                  $$$$$$$$$$$$$$$$$$$_',
      '_                                    h P  _        $$$$$$$$$$$$$$$$$$$_',
      '__      E         ____________    _________^^^^^^^_____________________',
      '___________________                       _________                   _',
      '_                    _     E       _                                  _',
      '_                    _______________                     ___        p _',
      '_                         PPPP                      ___  ___          _',
      '__________________________________________________^^___^^______________',
    ],
    [
      '_                                        P          $$$$$$$$$$$$$$$$$$_',
      '_                                       _____^^^^^^^$$$$$$$$$$$$$$$$$$_',
      '_                                  _________________________________$$_',
      '_                             ______                                $$_',
      '_                                                                     _',
      '_________  __________________________________    ______________  ______',
      '_          _     $$$$$$$$$$$$$$$$$$$$_   $$$_       _ $$      _       _',
      '_          ___   _____________________   $$$_____     $$      ______  _',
      '____  ______                         _   ____   _   _______           _',
      '_          _  ___                                   _       _      h  _',
      '__    E _  _        _________  _______       E  _____         _________',
      '_________  ______     _              _________________^^^____$$$$$$$$__',
      '_          _          _              $$$$$$$$$$$ ^^^^^^^^^^^_$$$$E$$$__',
      '_$$$$$$$$$$       _____________   _____________________________________',
      '__$$$$E$$$$  ______                                                   _',
      '____  ________                ____                                 p  _',
      '_$$$$$$$$$$$$$                   _   EEE        EEE       _           _',
      '____________________^^^^^^_________________________________^^__________',
    ],
    [
      '_                                                                     _',
      '_                                                                     _',
      '_                            _      E     _                           _',
      '_              _      E      ______________       E   _     _ $$$$$$$$_',
      '__        E    __________________         _____________     ___________',
      '________________                _                                     _',
      '_                               _                     _      E   _$$$$_',
      '_                               __         _     EE   ____________$$$$_',
      '_                               __     E   ____________          ______',
      '_               $$$h            _______  ___                          _',
      '_             ________                _         E   _                 _',
      '_             _      _^_____          _______________                 _',
      '_             _            _^____                                     _',
      '__________  ___                 _^_____  EE        __ EE             __',
      '_               P               _______________________________________',
      '_        __________                                             p     _',
      '_        $$$$$$$___      EEEEEEEE__           E__                     _',
      '_______________________________________________________________________',
    ],
    [
      '_                                                                     _',
      '_                                                                     _',
      '_             h                                                       _',
      '__________________________               ______________________________',
      '_                                                                     _',
      '_                                                                     _',
      '_                                                                     _',
      '_                                                                     _',
      '_                         _______________                             _',
      '_                                                                     _',
      '_                                                                     _',
      '_          _______________               _______________              _',
      '_                                                                     _',
      '_                               B                                     _',
      '___________                                             _______________',
      '_                                                                     _',
      '_                             ____________                            _',
      '_______________________________________________________________________',
    ],
  ]


  const levelCfg = {
    width: 20,
    height: 20,
    "_": [sprite('block'), solid(), 'wall'],
    "P": [sprite('big_powerup'), 'powerup', body()],
    "$": [sprite('coin'), 'money'],
    "q": [sprite('mystery_box'), 'mystery', solid()],
    "p": [sprite('portal'), solid(), 'next_level'],
    "e": [sprite('empty_box'), solid()],
    "B": [sprite('boss'), 'boss', solid(), scale(0.2)],
    "f": [sprite('fire'), 'fire', scale(0.17), 'dangeorus'],
    "E": [sprite('goomba'), 'enemy', solid(), scale(0.15), 'goomba', { dir: -1, timer: 0 }],
    "^": [sprite('lava'), 'dangerous', solid(), scale(0.017)],
    "h": [sprite('health'), 'health', solid(), scale(0.1), body()],
  }
  add([
    sprite('image'),
    scale(1),
  ])
  add([
    sprite('image'),
    scale(1),
    pos(700, 0)
  ])
  add([
    text("Use WAD or the arrow keys to move, Use SPACE to shoot"),
    pos(400, 500),
    scale(2),
  ])
  add([
    text("Avoid goombas and lava, collect as many coins as possible, gain health upgrades for lives and gain powerups for size"),
    pos(50, 700),
    scale(2),
  ])


  const gameLevel = addLevel(maps[level], levelCfg)

  const score1 = add([
    text("Score: "),
    pos(30, 0),
    layer('ui'),
  ])
  const score_board = add([
    text(score),
    pos(80, 0),
    layer('ui'),
    {
      value: score,
    }
  ])
  add([text('Level: ' + parseInt(level + 1)), pos(30, 12)])


  const lives = add([
    text('Lives: ' + 3),
    pos(30, 24),
    layer('ui'),
    {
      value: 3,
    }
  ])

  function big() {
    let timer = 0
    return {
      update() {
        if (isBig) {
          current_jump_force = big_jump_force
          current_move_speed = big_move_speed
          timer -= dt()
          if (timer <= 0) {
            this.smallify()
            current_jump_force = jump_force
            current_move_speed = move_speed
          }
        }
      },
      isBig() {
        return isBig
      },
      smallify() {
        this.scale = vec2(1),
          timer = 0
        isBig = false
      },
      biggify(time) {
        this.scale = vec2(2),
          timer = time
        isBig = true
      }
    }
  }

  const player = add([
    sprite('mario_right'),
    solid(),
    pos(30, 30),
    body(),
    origin('bot'),
    big()
  ])

  player.on("headbump", (obj) => {
    if (obj.is('mystery')) {
      //Fix randomiser
      if (rand() <= 0.5) {
        gameLevel.spawn('P', obj.gridPos.sub(0, 1))
        destroy(obj)
        gameLevel.spawn('e', obj.gridPos.sub(0, 0))
      } else {
        gameLevel.spawn('$', obj.gridPos.sub(0, 1))
        destroy(obj)
        gameLevel.spawn('e', obj.gridPos.sub(0, 0))
      }
    }
  })

  player.collides('powerup', (m) => {
    destroy(m)
    camShake(4)
    player.biggify(6)
  })

  player.collides('money', (c) => {
    destroy(c)
    score_board.value++
    score_board.text = score_board.value
  })
  player.collides('health', (h) => {
    destroy(h)
    lives.value++
    lives.value++
    lives.text = "Lives: " + lives.value
  })
  player.collides('dangerous', (d) => {
    lives.value -= 1
    lives.text = "Lives: " + lives.value
    player.pos = vec2(30, 30)
    camShake(4)
    if (lives.value === 0) {
      go('lose', { score: score_board.value })
    }
  })
  player.collides('enemy', (d) => {
    //Displaey lives
    if (isJumping || isBig) {
      destroy(d)
      camShake(4)
      score_board.value++
      score_board.text = score_board.value
    } else {
      lives.value -= 1
      lives.text = "Lives: " + lives.value
      player.pos = vec2(30, 30)
      camShake(4)
      if (lives.value === 0) {
        go('lose', { score: score_board.value })
      }
    }
  })
  player.action((p) => {
    if (player.pos.y >= fall_death) {
      lives.value -= 1
      lives.text = "Lives: " + lives.value
      player.pos = vec2(30, 30)
      if (lives.value === 0) {
        go('lose', { score: score_board.value })
      }
    }
  })


  player.collides('next_level', () => {
    if (isJumping) {
      if ((level + 1) % maps.length === 0) {
        go('win', { score: score_board.value })
      } else {
        go('game', {
          level: (level + 1),
          score: score_board.value
        })
        score_board.text = score_board.value
      }
    }
  })

  function spawnFire(obj) {
    const playerPos = player.pos;
    direction = vec2(playerPos.x - obj.pos.x, playerPos.y - obj.pos.y).unit();
    const fireball = add([
      sprite('fire'),
      'dangerous',
      'fire',
      scale(0.2),
      pos(obj.pos),
      {
        dir: vec2(playerPos.x - obj.pos.x, playerPos.y - obj.pos.y)
      }
    ]);
  }

  action('fire', (f) => {
    f.move(f.dir.scale(Fireball_speed))
  })
  const d_f_start = 3
  var d_f = d_f_start
  action('boss', (B) => {
    if (d_f <= 1) {
      spawnFire(B)
      d_f = d_f_start
    }
    d_f -= dt()
  })

  const enemy_speed = 25
  action('goomba', (g) => {
    g.move(g.dir * enemy_speed, 0)
  })

  collides('enemy', 'bullet', (e, b) => {
    destroy(e)
    destroy(b)
    camShake(4)
    score_board.value++
    score_board.text = score_board.value
  })

  collides('boss', 'bullet', (B, b) => {
    b_lives = b_lives - 1
    destroy(b)
    camShake(2)
    if (b_lives === 0) {
      for (let i = 0; i < 20; i++) {
        score_board.value++
      }
      score_board.text = score_board.value
      destroy(B)
      camShake(4)
      gameLevel.spawn('p', B.gridPos.sub(0, -1))
    }
  })

  collides('wall', 'bullet', (w, b) => {
    destroy(b)
  })

  collides('goomba', 'wall', (g, w) => {
    g.dir = -g.dir
  })

  keyDown('left', () => {
    player.move(-current_move_speed, 0)
    dir_p = false
    player.changeSprite('mario_left')
  })
  keyDown('a', () => {
    player.move(-current_move_speed, 0)
    dir_p = false
    player.changeSprite('mario_left')
  })

  keyDown('d', () => {
    player.move(current_move_speed, 0)
    dir_p = true
    player.changeSprite('mario_right')
  })
  keyDown('right', () => {
    player.move(current_move_speed, 0)
    dir_p = true
    player.changeSprite('mario_right')
  })

  keyDown('space', () => {
    if (dir_p) {
      if (t <= 0) {
        add([
          sprite('bu_right'),
          scale(0.1),
          'bulletRight',
          'bullet',
          pos(player.pos.sub(0, 25)),
        ])
        t = 0.5
      }
    } else {
      if (t <= 0) {
        add([
          sprite('bu_left'),
          scale(0.1),
          'bulletLeft',
          'bullet',
          pos(player.pos.sub(0, 25)),
        ])
        t = 0.5
      }

    }
    t -= dt()
  })

  player.action(() => {
    if (player.grounded()) {
      isJumping = false
    }
  })

  keyDown('up', () => {
    if (player.grounded()) {
      player.jump(current_jump_force)
      isJumping = true
    }
  })
  keyDown('w', () => {
    if (player.grounded()) {
      player.jump(current_jump_force)
      isJumping = true
    }
  })
  action('bulletRight', (b) => {
    b.move(250, 0)
  })
  action('bulletLeft', (b) => {
    b.move(-250, 0)
  })


})

scene('lose', ({ score }) => {
  add([
    sprite('s_mario'),
    scale(1),
    pos(720, 100)
  ])
  add([
    text(score, 32),
    origin('center'),
    pos(width() / 2, height() / 2)
  ])
  add([
    text("Score:"),
    scale(2),
    pos((width() / 2) - 45, (height() / 2) - 35),
  ])
  add([
    text("You lose!!!!!"),
    scale(2),
    pos((width() / 2) - 70, (height() / 2) - 55),
  ])
  add([
    text("Space to restart"),
    scale(2),
    pos((width() / 2) - 100, (height() / 2) + 200),
  ])
  keyPress("space", () => {
    go('game', { level: 0, score: 0 })
  })
})

scene('win', ({ score }) => {
  add([
    sprite('h_mario'),
    scale(1),
    pos(1000, 300)
  ])
  add([
    sprite('peach'),
    scale(1),
    pos(700, 260)
  ])
  add([
    text(score, 32),
    origin('center'),
    pos(width() / 2, height() / 2)
  ])
  add([
    text("Score:"),
    scale(2),
    pos((width() / 2) - 45, (height() / 2) - 35),
  ])
  add([
    text("You win!!!!!"),
    scale(2),
    pos((width() / 2) - 70, (height() / 2) - 55),
  ])
  add([
    text("Space to restart"),
    scale(2),
    pos((width() / 2) - 100, (height() / 2) + 200),
  ])
  keyPress("space", () => {
    go('game', { level: 0, score: 0 })
  })
})


start("game", { level: 0, score: 0 })