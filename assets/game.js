kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0,0,0,1]
})

const MOVE_SPEED = 120
const ENEMY_SPEED = 60

loadRoot('https://i.imgur.com/')

loadSprite('wall-steel', 'EkleLlt.png') // muro de aço
loadSprite('brick-red', 'C46n8aY.png') // bloco vermelho
loadSprite('door', 'Ou9w4gH.png') // porta
loadSprite('kaboom', 'o9WizfI.png') // bomba
loadSprite('bg', 'qIXIczt.png') // background
loadSprite('wall-gold', 'VtTXsgH.png') // muro de ouro
loadSprite('brick-wood', 'U751RRV.png') // bloco de madeira 

loadSprite('bomberman', 'T0xbHb8.png', {
    sliceX: 7,
    sliceY: 4,
    anims: {
        // parado
        idleLeft: { from: 21, to: 21 },
        idleRigth: { from: 7, to: 7 },
        idleUp: { from: 0, to: 0 },
        idleDown: { from: 14, to: 14 },

        // movendo
        moveLeft: { from: 22, to: 27 },
        moveRigth: { from: 8, to: 13 },
        moveUp: { from: 1, to: 6 },
        moveDown: { from: 15, to: 20 },
    }
})

loadSprite('bombar', 'etY46bP.png', {
    sliceX: 3,

    anims: {
        move: { from:0, to:2 },
    }
})

loadSprite('explosion', 'baBxoqs.png', {
    sliceX: 5,
    sliceY: 5,
})

loadSprite('baloon', 'z59lNU0.png', { sliceX: 3 })
loadSprite('ghost', '6YV0Zas.png', { sliceX: 3 })
loadSprite('slime', 'c1Vj0j1.png', { sliceX: 3})

scene('game', ({level, score}) => {
    layers(['bg', 'obj', 'ui'], 'obj');

    const mapa = [
        [
            'aaaaaaaaaaaaaaa',
            'azzzz  *zzzzzda',
            'azazazazazazaza',
            'azzzzzzzzzzzzza',
            'azazazazazaza a',
            'azzzz* zzzzzz}a',
            'azazazazazaza a',
            'a zzzzzzzzzzz a',
            'a azazazazazaza',
            'a  zzzdzzzzzzza',
            'a azazazazazaza',
            'azzzzzzzzzzzzza',
            'azazazazazazaza',
            'azzzzz   &   za',
            'aaaaaaaaaaaaaaa',
        ],
        [
            'bbbbbbbbbbbbbbb',
            'bwww   *wwwwwpb',
            'bwbwbwbwbwbwbwb',
            'b      *      b',
            'bwww* wwwwwwwwb',
            'bwbwbwbwb bwb b',
            'b wwwpwww}www b',
            'b bwbwbwb bwbwb',
            'b  wwwwwwwwwwwb',
            'b bwbwbwbwbwbwb',
            'bwww  &   wwwwb',
            'bwbwbwbwbwbwbwb',
            'bwwww   &    wb',
            'bbbbbbbbbbbbbbb',
        ]
    ]

    const levelCfg = {
        width: 26,
        height: 26,
        a: [sprite('wall-steel'), 'wall-steel', solid(), 'wall'],
        z: [sprite('brick-red'), 'wall-brick', solid(), 'wall'],
        d: [sprite('brick-red'), 'wall-brick-dool', solid(), 'wall'],
        b: [sprite('wall-gold'), 'wall-gold', solid(), 'wall'],
        w: [sprite('brick-wood'), 'wall-brick', solid(), 'wall'],
        p: [sprite('brick-wood'), 'wall-brick-dool', solid(), 'wall'],
        t: [sprite('door'), 'door', 'wall'],
        '}': [sprite('ghost'), 'ghost', 'dangerous', { dir: -1, time: 0 }],
        '&': [sprite('slime'), 'slime', 'dangerous', { dir: -1, time: 0 }],
        '*': [sprite('baloon'), 'baloon', 'dangerous', { dir: -1,  time: 0 }],
    }

    const gameLevel = addLevel(mapa[level], levelCfg)

    add([sprite('bg'), layer('bg')])

    const scoreLabel = add([
        text('Score: ' + score),
        pos(400, 30),
        layer('ui'),
        {
            value: score,
        },
        scale(1)
    ])

    add([text('Level: ' + parseInt(level + 1)), pos(400, 60), scale(1)])

    const player = add([
        sprite('bomberman',{
            animeSpeed: 0.1,
            frame: 14,
        }),
        pos(30,190),
        { dir: vec2(1,0) },
    ])

    // ação do jogador 

    player.action(() => {
        player.pushOutAll()
    })

    // direita
    keyDown('a', () => {
        player.move(-MOVE_SPEED, 0)
        player.dir = vec2(-1, 0)
    })

    // esquerda
    keyDown('d', () => {
        player.move(MOVE_SPEED, 0)
        player.dir = vec2(1, 0)
    })

    // cima
    keyDown('w', () => {
        player.move(0, -MOVE_SPEED)
        player.dir = vec2(0, -1)
    })

    // baixo
    keyDown('s', () => {
        player.move(0, MOVE_SPEED)
        player.dir = vec2(0, 1)
    })

    // animação

    keyPress('a', () => {
        player.play('moveLeft')
    })

    keyPress('d', () => {
        player.play('moveRigth')
    })

    keyPress('w', () => {
        player.play('moveUp')
    })

    keyPress('s', () => {
        player.play('moveDown')
    })

    keyRelease('a', () => {
        player.play('idleLeft')
    })

    keyRelease('d', () => {
        player.play('idleRigth')
    })

    keyRelease('w', () => {
        player.play('idleUp')
    })

    keyRelease('s', () => {
        player.play('idleDown')
    })

    keyPress('space', () => {
        spawnBomber(player.pos.add(player.dir.scale(0)))
    })

    // enemy action

    action('baloon', (s) => {
        s.pushOutAll()
        s.move(s.dir * ENEMY_SPEED, 0)
        s.timer -= dt()
        if (s.timer <= 0) {
            s.dir = -s.dir
            s.timer = rand(5)
        }
    })

    action('slime', (s) => {
        s.pushOutAll()
        s.move(s.dir * ENEMY_SPEED, 0)
        s.timer -= dt()
        if (s.timer <= 0) {
            s.dir = -s.dir
            s.timer = rand(5)
        }
    })

    action('ghost', (s) => {
        s.pushOutAll()
        s.move(0 , s.dir * ENEMY_SPEED, 0)
        s.timer -= dt()
        if (s.timer <= 0) {
            s.dir = -s.dir
            s.timer = rand(s)
        }
    })

    // Função

    function spawnKaboom(p, frame){
        const obj = add([
            sprite('explosion', {
                animeSpeed: 0.1,
                frame: frame,
            }),
            pos(p),
            scale(1.5),
            'kaboom'
        ])

        obj.pushOutAll()
        wait(0.5, () => {
            destroy(obj)
        })
    }

    function spawnBomber(p){
        const obj = add([sprite('bombar'), ('move'), pos(p), scale(1.5), 'bomber'])
        obj.pushOutAll()
        obj.play("move")

        wait(4, () => {
            destroy(obj)

            obj.dir = vec2(1, 0)
            spawnKaboom(obj.pos.add(obj.dir.scale(0)), 12) // center

            obj.dir = vec2(0, -1)
            spawnKaboom(obj.pos.add(obj.dir.scale(20)), 2) // up

            obj.dir = vec2(0, 1)
            spawnKaboom(obj.pos.add(obj.dir.scale(20)), 22) // down

            obj.dir = vec2(-1, 0)
            spawnKaboom(obj.pos.add(obj.dir.scale(20)), 10) // left

            obj.dir = vec2(1, 0)
            spawnKaboom(obj.pos.add(obj.dir.scale(20)), 14) // rigth
        })
    }

    // Colisão

    player.collides('door', (d) => {
        go("game", {
            level: (level + 1) % mapa.length,
            score: scoreLabel.value
        })
    })

    collides('kaboom', 'dangerous', (k,s) => {
        camShake(4)
        wait(1, () => {
            destroy(k)
        })
        destroy(s)
        scoreLabel.value++
        scoreLabel.text = 'Score: ' + scoreLabel.value
    })

    collides('kaboom', 'wall-brick', (k,s) => {
        camShake(4)
        wait(1, () => {
            destroy(k)
        })
        destroy(s)
    })

    collides('baloon', 'wall', (s) => {
        s.dir = -s.dir
    })

    collides('slime', 'wall', (s) => {
        s.dir = -s.dir
    })

    collides('ghost', 'wall', (s) => {
        s.dir = -s.dir
    })

    collides('kaboom', 'wall-brick-dool', (k,s) => {
        camShake(4)
        wait(1, () => {
            destroy(k)
        })
        destroy(s)
        gameLevel.spawn('t', s.gridPos.sub(0,0))
    })

    player.collides('dangerous', () => {
        go('lose', {score: scoreLabel.value})
    })
})

scene('lose', ( { score }) => {
    add([text('Score: ' + score, 32), origin('center'), pos(width() / 2, height() / 2)])

    keyPress('space', () => {
        go('game', { level: 0, score: 0 })
    })
})

go('game', { level: 0, score: 0 })