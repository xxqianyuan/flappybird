import Phaser from 'phaser';
import bgImg from './assets/bg.png';
import bird1 from './assets/bird-frame-1.png'
import bird2 from './assets/bird-frame-2.png'
import bird3 from './assets/bird-frame-3.png'
import bird4 from './assets/bird-frame-4.png'
import groundImg from './assets/ground.png'
import pillarImg from './assets/pillar.png'

// 游戏状态
const GAMESTATE = {
  // 等待开始
  waiting: 1,
  // 游戏中
  playing: 2,
  // 游戏结束
  gameover: 3,
}

class MyGame extends Phaser.Scene
{
  constructor ()
  {
    super({
      // 物理引擎设置
      physics: {
        default: 'arcade',
        arcade: {
          // 重力
          gravity: { y: 2000 },
          // 开启debug
          debug: true,
        }
      }
    });

    // 游戏状态 默认为等待开始
    this.gameState = GAMESTATE.waiting
    // 柱子上下空间的一半
    this.halfSpace = 100
    // 是否可以重新开始
    this.canRestart = false
  }

  /**
   * 准备开始
   */
  ready ()
  {
    this.gameState = GAMESTATE.waiting
    this.canRestart = false
  }
  /**
   * 开始游戏
   */
  play ()
  {
    this.gameState = GAMESTATE.playing
  }
  /**
   * 游戏结束
   */
  gameover ()
  {
    this.gameState = GAMESTATE.gameover
    // 1秒后可以重新开始游戏
    setTimeout(() => this.canRestart = true, 1000)
  }

  preload ()
  {
    this.load.image('bg', bgImg)
    this.load.image('ground', groundImg)
    this.load.image('pillar', pillarImg)
    // 加载小鸟图片
    const birds = [bird1, bird2, bird3, bird4]
    birds.forEach((bird, i) => this.load.image(`bird${i + 1}`, bird))
  }
    
  create ()
  {
    // 背景
    const bg = this.add.image(200, 0, 'bg');
    bg.setOrigin(0.5, 0).setScale(0.85)

    // 创建柱子
    const pillars = this.physics.add.group()
    // 上下柱子空间的一半
    const { halfSpace } = this
    for (let i=0; i < 5; i++) {
      const x = 800 + i * 320
      // 随机垂直位置
      const randomY = Phaser.Math.Between(halfSpace * 2, 600 - halfSpace * 2)
      
      // 上面的柱子
      const topPillar = pillars.create(x, randomY - halfSpace, 'pillar')
      topPillar.setOrigin(0, 1).setGravityY(-2000)

      // 下面的柱子
      const bottomPillar = pillars.create(x, randomY + halfSpace, 'pillar')
      bottomPillar.setOrigin(0, 0).setGravityY(-2000)
    }

    this.pillars = pillars

    // 添加地面
    const ground = this.physics.add.group({
      key: 'ground',
      repeat: 4,
      setOrigin: {
        x: 0,
        y: 1,
      },
      setXY: {
        x: 0,
        y: 600,
        stepX: 128,
      },
      // 向左移动
      velocityX: -200,
      // 抵消世界的重力
      allowGravity: false,
    })

    this.ground = ground

    
    // 创建一个形状作为静态地面
    const staticGround = this.add.rectangle(0, 600, 400, 32)
    staticGround.setOrigin(0, 1)
    // 让几何形象成为物理对象
    this.physics.world.enable(staticGround, Phaser.Physics.Arcade.STATIC_BODY)

    // 小鸟
    const bird = this.physics.add.sprite(200, 300, 'bird1')
    bird.setScale(0.1).refreshBody()
    // 场景保存bird实例
    this.bird = bird

    // 小鸟与地面碰撞
    this.physics.add.collider(bird, staticGround, () => {
      if (this.gameState === GAMESTATE.playing) {
        this.gameover()
      }
    })

    // 小鸟与柱子碰撞
    this.physics.add.overlap(bird, pillars, () => {
      if (this.gameState === GAMESTATE.playing) {
        this.gameover()
      }
    })

    this.anims.create({
      key: 'fly',
      frames: [
        { key: 'bird1' },
        { key: 'bird2' },
        { key: 'bird3' },
        { key: 'bird4' },
      ],
      frameRate: 16,
      repeat: -1,
    })

    // 下落动画
    this.anims.create({
      key: 'fall',
      frames: [
        { key: 'bird1' },
      ]
    })

    bird.play('fly')
    // 先暂停物理引擎
    this.physics.pause()

    this.input.keyboard.on('keydown', () => {
      if (this.gameState === GAMESTATE.waiting) {
        // 开启物理引擎
        this.physics.resume()
        // 开始游戏
        this.play()
      } else if (this.gameState === GAMESTATE.gameover) {
        // 当可以重新开始时
        if (this.canRestart) {
          this.scene.restart()
          this.ready()
        }
      }
      
      if (this.gameState !== GAMESTATE.gameover) {
        // 设置向上的速度
        bird.setVelocityY(-600)
      }
    })

    // ~~~
    window.start = () => this.physics.resume()
  }

  update()
  {
    // 根据垂直速度播放相应动画
    if (this.bird.body.velocity.y <= 0 && this.gameState !== GAMESTATE.gameover) {
      this.bird.anims.play('fly', true)
    } else {
      this.bird.play('fall', true)
    }

    // 设置小鸟旋转与角度
    if (this.bird.body.velocity.y < 0) {
      // 角速度重置为0，角度重置为0
      this.bird.setAngularVelocity(0).setAngle(0)
    } else if (this.bird.body.velocity.y > 0) {
      // 下落时设置旋转角速度
      this.bird.setAngularVelocity(180)
    }
    // 限定最大旋转度
    if (this.bird.angle >= 65) {
      this.bird.setAngularVelocity(0)
    }

    // 地面循环移动
    this.ground.children.iterate((block) => {
      if (block.body.position.x <= -128) {
        block.body.position.x += this.ground.children.size * 128
      }
    })

    // 柱子循环移动
    for(let i = 0; i < this.pillars.children.size; i += 2) {
      // 上面的柱子
      const tp = this.pillars.children.entries[i]
      // 下面的柱子
      const bp = this.pillars.children.entries[i + 1]
      // 超出指定位置后循环到队尾
      if (tp.body.position.x <= -240) {
        // 队尾x坐标
        const x = tp.body.position.x + this.pillars.children.size / 2 * 320
        // 随机垂直位置
        const randomY = Phaser.Math.Between(this.halfSpace * 2, 600 - this.halfSpace * 2)
        // 修改上面的柱子位置
        tp.setPosition(x, randomY - this.halfSpace)
        // 修改下面的柱子位置
        bp.setPosition(x, randomY + this.halfSpace)
      }
    }

    if (this.gameState === GAMESTATE.playing) {
      this.ground.setVelocityX(-200)
      this.pillars.setVelocityX(-200)
    }
    else if (this.gameState === GAMESTATE.gameover) {
      // 地面停止移动
      this.ground.setVelocityX(0)
      this.pillars.setVelocityX(0)
    }
    else if (this.gameState === GAMESTATE.waiting) {
      //
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  scene: MyGame
};

const game = new Phaser.Game(config);
