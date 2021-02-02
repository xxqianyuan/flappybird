import Phaser from 'phaser';
import bgImg from './assets/bg.png';

class MyGame extends Phaser.Scene
{
  constructor ()
  {
    super();
  }

  preload ()
  {
    this.load.image('bg', bgImg);
  }
    
  create ()
  {
    const logo = this.add.image(200, 0, 'bg');
    logo.setOrigin(0.5, 0).setScale(0.85)
  }
}

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 600,
  scene: MyGame
};

const game = new Phaser.Game(config);
