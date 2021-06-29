/*Points breakdown:
- Add your own (copyright-free) background music to the Play scene (5)
- Allow the player to control the Rocket after it's fired (5)
- Display the time remaining (in seconds) on the screen (10)
- Create a new spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (20)
- Create new artwork for all of the in-game assets (rocket, spaceships, explosion) (20) 
- Implement a simultaneous two-player mode (30)
*/



let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [ Menu, Play ]
}
let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars
let keyF, keyR, keyLEFT, keyRIGHT, keyZ, keyC, keyA;