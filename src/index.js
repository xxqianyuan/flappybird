import Phaser from 'phaser';
import bgImg from './assets/bg.png';
import bird1 from './assets/bird-frame-1.png'
import bird2 from './assets/bird-frame-2.png'
import bird3 from './assets/bird-frame-3.png'
import bird4 from './assets/bird-frame-4.png'

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
        }
      }
    });
  }

  preload ()
  {
    this.load.image('bg', bgImg);
    // 加载小鸟图片
    [bird1, bird2, bird3, bird4].forEach((bird, i) => this.load.image(`bird${i + 1}`, bird))
  }
    
  create ()
  {
    // 背景
    const logo = this.add.image(200, 0, 'bg');
    logo.setOrigin(0.5, 0).setScale(0.85)

    // 小鸟
    const bird = this.physics.add.sprite(200, 300, 'bird1')
    bird.setScale(0.1).refreshBody()
    // 场景保存bird实例
    this.bird = bird

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
      // 开启物理引擎
      this.physics.resume()
      // 设置向上的速度
      bird.setVelocityY(-600)
    })

    // ~~~
    window.start = () => this.physics.resume()
  }

  update()
  {
    // 根据垂直速度播放相应动画
    if (this.bird.body.velocity.y <= 0) {
      this.bird.anims.play('fly', true)
    } else {
      this.bird.play('fall', true)
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
