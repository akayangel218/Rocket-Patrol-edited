class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('missile', './assets/missile.png');

        //this.load.audio('gme_music', './assets/odysseymusic.ogg');

        // load spritesheets
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('explosion2', './assets/explosion2.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('explosion3', './assets/explosion3.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.spritesheet('explosion4', './assets/explosion4.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);

        // add missile
        this.missile = new Missile(this, game.config.width, borderUISize*6 + borderPadding*-7, 'missile', 0, 50).setOrigin(0,0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // animation config
        this.anims.create({
            key: 'explode2',
            frames: this.anims.generateFrameNumbers('explosion2', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // animation config
        this.anims.create({
            key: 'explode3',
            frames: this.anims.generateFrameNumbers('explosion3', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // animation config
        this.anims.create({
            key: 'explode4',
            frames: this.anims.generateFrameNumbers('explosion4', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        // start music here
        //this.sound.play('gme_music');


        // mod 1: the high score
        // initialize score
        this.p1Score = 0;
        this.timer = game.settings.gameTimer / 1000;
        
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        this.timeRight = this.add.text((borderUISize + borderPadding) * 11.5, borderUISize + borderPadding*2, this.timer, scoreConfig);

        // GAME OVER flag
        this.gameOver = false;
        
        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
            // stop music
        }, null, this);
    }

    update() {

        this.timer = game.settings.gameTimer / 1000;
        this.timeRight.text = this.timer;

        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 4;
        this.p1Rocket.update();

        // update spaceships (x3)
        this.ship01.update();
        this.ship02.update();
        this.ship03.update();
        
        // update missile
        this.missile.update();
        
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkMcollision(this.p1Rocket, this.missile)) {
            this.p1Rocket.reset();
            this.missileExplode(this.missile);
        }

        console.log(this.timer);

        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.missile.update();
        } 
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    checkMcollision(rocket, missile) {
        // simple AABB checking
        if (rocket.x < missile.x + missile.width && 
            rocket.x + rocket.width > missile.x && 
            rocket.y < missile.y + missile.height &&
            rocket.height + rocket.y > missile. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position

        let boom;
        if (ship == this.ship01) {
            this.timer = this.timer + 2;
            boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
            boom.anims.play('explode');             // play explode animation
        }
        else if (ship == this.ship02) {
            this.timer += 5;
            boom = this.add.sprite(ship.x, ship.y, 'explosion2').setOrigin(0, 0);
            boom.anims.play('explode2');             // play explode animation
        }
        else if (ship == this.ship03){
            this.timer += 10;
            boom = this.add.sprite(ship.x, ship.y, 'explosion3').setOrigin(0, 0);
            boom.anims.play('explode3');             // play explode animation
        }
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        }); 

        this.sound.play('sfx_explosion');

        // score add and repaint
        console.log(this.timer);
        this.p1Score += ship.points;
        this.timeRight.text = this.timer;
        this.scoreLeft.text = this.p1Score;
    }

    missileExplode(missile) {
        // temporarily hide missile
        missile.alpha = 0;
        // create explosion sprite at missile's position
        let boom = this.add.sprite(missile.x, missile.y, 'explosion4').setOrigin(0, 0);
        boom.anims.play('explode4');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            missile.reset();                         // reset missile position
            missile.alpha = 1;                       // make missile visible again
            boom.destroy();                       // remove explosion sprite
        }); 

        this.sound.play('sfx_explosion');

        // score add and repaint
        this.timer = this.timer + 20;
        this.p1Score += missile.points;
        this.timeRight.text = this.timer;
        this.scoreLeft.text = this.p1Score;
    }
}