// Missile prefab
class Missile extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointsValue) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.points= pointsValue;
        this.moveSpeed = game.settings.missileSpeed;
    }

    update() {
        // move spaceship left
        this.x -= this.moveSpeed;

        // wrap around from left edge to right edge
        if (this.x <= 0 - this.width) {
            this.reset();
        }
    }

    // position reset
    reset() {
        this.x = game.config.width;
    }
}