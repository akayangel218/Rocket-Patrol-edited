// Rocket 2 prefab
class Rocket2 extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
  
      scene.add.existing(this);     // add object to existing, displayList, updateList
      this.isFiring = false;        // track rocket's firing squad
      this.moveSpeed = 4;           // pixels per frame
      this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
    }

    update() {
        // left/right movement
        if (keyZ.isDown && this.x >= borderUISize + this.width) {
            this.x -= this.moveSpeed;
        }
        else if (keyC.isDown && this.x <= game.config.width - borderUISize - this.width) {
            this.x += this.moveSpeed;
        }
        // fire button
        if (Phaser.Input.Keyboard.JustDown(keyA) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();  // play sfx
        }
        // if fired, move up
        if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            this.y -= this.moveSpeed;
        }
        // reset on miss
        if (this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

    // reset rocket to "ground"
    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
  }