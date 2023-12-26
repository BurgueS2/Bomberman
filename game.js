kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    debug: true,
    clearColor: [0,0,0,1]
})

const MOVE_SPEED = 120

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
        idleRight: { from: 7, to: 7 },
        idleUp: { from: 0, to: 0 },
        idleDown: { from: 14, to: 14 },

        // movendo
        moveLeft: { from: 22, to: 27 },
        moveRigth: { from: 8, to: 13 },
        moveUp: { from: 1, to: 6 },
        moveDown: { from: 15, to: 20 },
    }
})

scene('game', () => {
    layers(['bg', 'obj', 'ui'], 'obj');

    const mapa = [
        [
            'aaaaaaaaaaaaaaa',
            'a             a',
            'a             a',
            'a             a',
            'a             a',
            'a             a',
            'a             a',
            'a             a',
            'a             a',
            'a             a',
            'a             a',
            'a             a',
            'a             a',
            'a             a',
            'aaaaaaaaaaaaaaa',
        ],
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
    }

    const gameLevel = addLevel(mapa[0], levelCfg)

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

    keyDown('left', () => {
        player.move(-MOVE_SPEED, 0)
        player.dir = vec2(-1, 0)
    })

    keyDown('right', () => {
        player.move(MOVE_SPEED, 0)
        player.dir = vec2(1, 0)
    })

    keyDown('up', () => {
        player.move(0, -MOVE_SPEED)
        player.dir = vec2(0, -1)
    })

    keyDown('down', () => {
        player.move(0, MOVE_SPEED)
        player.dir = vec2(0, 1)
    })
})

go('game')