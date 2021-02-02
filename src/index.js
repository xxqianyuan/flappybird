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
    super();
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
    const bird = this.add.sprite(200, 300, 'bird1')
    bird.setScale(0.1)

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
    setTimeout(() => bird.play('fall'), 3000)
  }
}

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  scene: MyGame
};

const game = new Phaser.Game(config);
