// Optimized Mario-style Kaboom.js Game
kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    debug: true,
    clearColor: [0, 0, 0, 1]
})

loadSprite('coin', 'sprites/coin.png')
loadSprite('evil-shroom', 'sprites/evil-shroom.png')
loadSprite('brick', 'sprites/brick.png')
loadSprite('block', 'sprites/block.png')
loadSprite('mario', 'sprites/mario.png')
loadSprite('mario_left', 'sprites/mario_left.png')
loadSprite('mushroom', 'sprites/mushroom.png')
loadSprite('surprise', 'sprites/surprise.png')
loadSprite('unboxed', 'sprites/unboxed.png')
loadSprite('pipe-top-left', 'sprites/pipe-top-left.png')
loadSprite('pipe-top-right', 'sprites/pipe-top-right.png')
loadSprite('pipe-bottom-left', 'sprites/pipe-bottom-left.png')
loadSprite('pipe-bottom-right', 'sprites/pipe-bottom-right.png')
loadSprite('blue-block', 'sprites/blue-block.png')
loadSprite('blue-brick', 'sprites/blue-brick.png')
loadSprite('blue-steel', 'sprites/blue-steel.png')
loadSprite('blue-evil-shroom', 'sprites/blue-evil-shroom.png')
loadSprite('blue-surprise', 'sprites/blue-surprise.png')
loadSprite('fire', 'sprites/fire.png')
loadSprite('bg', 'sprites/bg.jpg')
loadSprite('fireflower', 'sprites/fireflower.png')
loadSprite('bullet', 'sprites/bullet.png')
loadSprite('boss', 'sprites/boss.png')
loadSprite('image', 'sprites/image.jpg')

loadSound('gameSound', 'sounds/gameSound.mp3')
loadSound('jump', 'sounds/jump.mp3')
loadSound('powerup', 'sounds/powerup.mp3')
loadSound('powerdown', 'sounds/powerdown.mp3')
loadSound('gameOver', 'sounds/gameOver.mp3')
loadSound('kill', 'sounds/kill.mp3')

let MOVE_SPEED = 120
let current_move_speed = MOVE_SPEED
let JUMP_FORCE = 360
let BIG_JUMP_FORCE = 550
let ENEMY_SPEED = 20
let isJumping = true
let score = 0
let health = 3
let dir_p = true
let isShooting = false
let t = 0
const shootDelay = 0.5
const bulletSpeed = 200
let d_f = 1
const d_f_start = 1
let bulletCount = 0
const maxBullets = 5

layer(['bg', 'obj', 'ui'], 'obj')

const maps = [
    [
        'y                                                                              y',
        'y     %   =*=%=                                                                y',
        'y                                                                            -+y',
        'y                                                ^ ^    ^       ^     ^     ()y',
        'y                                      ^   ^     ====   ==     ==    ==     ()y',
        'y                     z      z   z    ====  ===  ====   ===   ====  ====    ()y',
        '================================================================================'
    ],
    [
        '                                                              ',
        '                                                              ',
        '                                                              ',
        '                                                              ',
        '        @         @@@@     @@@@@     @@@@@@@     @@@@         ',
        '   xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx      '
    ]
]

const levelCfg = {
    width: 20,
    height: 20,
    '=': [sprite('brick'), solid()],
    '$': [sprite('coin'), 'coin'],
    '%': [sprite('surprise'), solid(), 'coin-surprise'],
    '*': [sprite('surprise'), solid(), 'mushroom-surprise'],
    '}': [sprite('unboxed'), solid()],
    '(': [sprite('pipe-bottom-left'), solid(), scale(0.5)],
    ')': [sprite('pipe-bottom-right'), solid(), scale(0.5)],
    '-': [sprite('pipe-top-left'), solid(), scale(0.5), 'pipe'],
    '+': [sprite('pipe-top-right'), solid(), scale(0.5), 'pipe'],
    '^': [sprite('evil-shroom'), solid(), 'dangerous', body(), { dir: -1, timer: 0 }],
    '#': [sprite('mushroom'), solid(), 'mushroom', body()],
    'z': [sprite('fireflower'), solid(), 'fireflower', body()],
    'x': [sprite('blue-block'), solid()],
    '@': [sprite('boss'), solid(), 'boss', body()],
    'y': [sprite('blue-brick'), solid(), scale(1.2)]
}

scene('game', ({ level, score, health }) => {
    const music = play('gameSound', { loop: true })
    add([sprite('image'), layer('bg'), scale(1)])

    const gameLevel = addLevel(maps[level], levelCfg)

    const scoreLabel = add([text('Score: ' + score), pos(30, 6), layer('ui'), { value: score }])
    const healthLabel = add([text('Health: ' + health), pos(450, 6), layer('ui'), { value: health }])

    const player = add([
        sprite('mario'),
        solid(),
        pos(30, 0),
        body(),
        origin('bot'),
        big(),
        'player'
    ])

    player.action(() => {
        if (t > 0) t -= dt();
    })

    player.on('headbump', (obj) => {
        if (obj.is('coin-surprise')) {
            gameLevel.spawn('$', obj.gridPos.sub(0, 1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos)
        }
        if (obj.is('mushroom-surprise')) {
            gameLevel.spawn('#', obj.gridPos.sub(0, 1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos)
        }
    })

    player.collides('mushroom', (m) => {
        destroy(m)
        player.biggify(5)
        play('powerup')
    })

    player.collides('fireflower', (f) => {
        destroy(f)
        isShooting = true
    })

    player.collides('coin', (c) => {
        destroy(c)
        scoreLabel.value++
        scoreLabel.text = 'Score: ' + scoreLabel.value
    })

    player.collides('dangerous', (d) => {
        if (isJumping) {
            destroy(d)
            scoreLabel.value++
            scoreLabel.text = 'Score: ' + scoreLabel.value
            play('kill')
        } else {
            if (player.isBig()) {
                player.smallify()
                play('powerdown')
            } else {
                health--
                healthLabel.text = 'Health: ' + health
                if (health <= 0) {
                    music.stop()
                    go('lose', { score: scoreLabel.value })
                }
            }
        }
    })

    player.collides('pipe', () => {
        keyPress('down', () => {
            go('game', {
                level: (level + 1) % maps.length,
                score: scoreLabel.value,
                health: health
            })
        })
    })

    function shootBullet(spriteName, direction) {
        if (bulletCount < maxBullets) {
            add([
                sprite(spriteName),
                scale(0.1),
                'bullet',
                direction,
                pos(player.pos.sub(0, 25)),
                {
                    lifespan: 2,
                    add() {
                        bulletCount++;
                    },
                    destroy() {
                        bulletCount--;
                    }
                }
            ])
        }
    }

    keyDown('left', moveLeft)
    keyDown('a', moveLeft)
    function moveLeft() {
        player.move(-current_move_speed, 0)
        dir_p = false
        player.changeSprite('mario_left')
    }

    keyDown('right', moveRight)
    keyDown('d', moveRight)
    function moveRight() {
        player.move(current_move_speed, 0)
        dir_p = true
        player.changeSprite('mario')
    }

    keyPress('space', () => {
        if (isShooting && t <= 0) {
            shootBullet('bullet', dir_p ? 'right' : 'left')
            t = shootDelay
        }
    })

    action('bullet', (b) => {
        b.move(b.is('left') ? -bulletSpeed : bulletSpeed, 0)
        if (b.pos.x > width() || b.pos.x < 0) destroy(b)
    })

    action('fire', (f) => {
        f.move(-bulletSpeed, 0)
        if (f.pos.x < 0) destroy(f)
    })

    collides('bullet', 'boss', (b, k) => {
        destroy(b)
        destroy(k)
        scoreLabel.value++
        scoreLabel.text = 'Score: ' + scoreLabel.value
    })

    function spawnFire(b) {
        add([
            sprite('fire'),
            pos(b.pos.sub(0, 10)),
            scale(0.1),
            'fire'
        ])
    }

    action('boss', (B) => {
        d_f -= dt()
        if (d_f <= 0) {
            spawnFire(B)
            d_f = d_f_start
        }
    })

    keyPress('up', jump)
    keyPress('w', jump)
    function jump() {
        if (player.grounded()) {
            isJumping = true
            player.jump(player.isBig() ? BIG_JUMP_FORCE : JUMP_FORCE)
            play('jump')
        }
    }

    player.action(() => {
        camPos(player.pos)
        if (player.grounded()) isJumping = false
        if (player.pos.y >= 600) {
            music.stop()
            go('lose', { score: scoreLabel.value })
        }
    })
})

scene('lose', ({ score }) => {
    add([text('Score: ' + score, 32), origin('center'), pos(width() / 2, height() / 2)])
})

start('game', { level: 0, score: 0, health: 3 })
