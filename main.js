
var jumpButton;
var spacefield;
var spacedv;
var requiredToWin = 4;
var currentLevel = 1;
var height = 600;
var width = 400;
var blockSize = 20;
// Create the state that will contain the whole game
var mainState = {
    preload: function () {
        game.load.image('background', 'assets/background.jpg');
        game.load.image('player', 'assets/player.png');
        game.load.image('wall', 'assets/wall.png');
        game.load.image('win', 'assets/win.png');
        game.load.image('tickWall', 'assets/tickWall2.png');
        game.load.image('enemy', 'assets/enemy.png');
        game.load.json('levels', 'data/levels.json')
        // Here we preload the assets
    },

    create: function () {
        //background sprite
        //    spacefield = game.add.tileSprite(0,0,500,600,'background');
        spacedv = 0;
        //        0.5;
        game.stage.backgroundColor = '#3598db';
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.enableBody = true;
        this.levels = game.cache.getJSON('levels');
        this.currentLevel = 1;

        // Variable to store the arrow key pressed
        this.cursor = game.input.keyboard.createCursorKeys();

        // Create the player in the middle of the game
        this.player = game.add.sprite(190, height - 60, 'player');
        this.winCount = 0; //reset on refresh, can cache this to avoid that.

        this.walls = game.add.group();
        //        this.coins = game.add.group();
        this.trucks = game.add.group();
        this.wins = game.add.group();
        this.tickWalls = game.add.group();
        var level = this.levels[currentLevel];
        var levela = [
            'oooooooooooooooooooo',
            'xxxxxxxxxxxxxxxxxxxx',
            '  eeee    eee   eeee  ',
            'xxxxxxxxxxxxxxxxxxxx',
            // 'eeee   eeee   eeee  ee',
            // 'xxxxxxxxxxxxxxxxxxxx',
            // '   eeee   eeee  eeeee',
            // 'xxxxxxxxxxxxxxxxxxxx',
            'eeee   eeee   eeee',
            'xxxxxxxxxxxxxxxxxxxx',
            '   eeee   eeee  eeeee',
            'xxxxxxxxxxxxxxxxxxxx',
            ' eeee   eeee   eeee  ',
            'xxxxxxxxxxxxxxxxxxxx'
        ];
        this.yOffset = height - blockSize*level.length - 3*blockSize;
        for (var i = 0; i < level.length; i++) {
            for (var j = 0; j < level[i].length; j++) {

                // Create a wall and add it to the 'walls' group
                if (level[i][j] == 'x') {
                    var wall = game.add.sprite(blockSize * j,  this.yOffset + blockSize * i, 'wall');
                    this.walls.add(wall);
                }
                else if (level[i][j] == 'o') {
                    var win = game.add.sprite(blockSize * j, this.yOffset + blockSize * i, 'win');
                    this.wins.add(win);// can hold up to blockSize wins
                }
                else if (level[i][j] == 'w') {
                    var tickWall = game.add.sprite(blockSize * j, this.yOffset + blockSize * i, 'tickWall');
                    this.tickWalls.add(tickWall);// can hold up to blockSize wins
                }
                
                // Create a enemy and add it to the 'enemies' group
                else if (level[i][j] == 'e') {
                    const initialX = ((i-1) % 4 == 0) ? (width + blockSize) : -(width + blockSize);
                    var enemy = game.add.sprite(-blockSize + blockSize * j, this.yOffset + blockSize * i, 'enemy');
                    //                    enemy.body.velocity.x = 50;
                    enemy.speed = initialX;
                    this.trucks.add(enemy);
                }
            }
        }

    },

    update: function () {
        const speed = 0.5;
        if (this.cursor.right.downDuration(20)){
            this.player.body.x += 5;
        }
        else if(this.cursor.left.downDuration(20)){
            this.player.body.x -= 5;
        }
        else if(this.cursor.up.downDuration(20)){
            this.player.body.y -= blockSize;
        }

        //        spacefield.tilePosition.y += spacedv;
        for (var i = 0; i < this.trucks.length; i++) {
            if (this.trucks.getAt(i).speed < 0) {
                if (this.trucks.getAt(i).body.x < width)
                    this.trucks.getAt(i).body.x += speed;
                else
                    this.trucks.getAt(i).body.x -= width + blockSize;
            }
            else {
                if (this.trucks.getAt(i).body.x > -blockSize)
                    this.trucks.getAt(i).body.x -= speed;
                else
                    this.trucks.getAt(i).body.x += width + blockSize;

            }

            game.physics.arcade.overlap(this.player, this.trucks, this.restart, null, this);
            game.physics.arcade.overlap(this.player, this.wins, this.achieved, null, this);
        }
    },

    // Function to kill a coin
    achieved: function (player, slot) {
        this.winCount++;
        if(this.winCount<requiredToWin){
            slot.key = 'player';
            slot.loadTexture('player',0);
            // console.log(this.wins.getAt(this.winCount - 1)); 
            player.body.x = width/2;
            player.body.y = height - 60 ;
        }
        else{
            this.wins.getAt(this.winCount - 1).key = 'player';
            this.wins.getAt(this.winCount - 1).loadTexture('player',0);
            console.log("You have won!");
            // logic to go to next level after diplaying win
        }
    },

    // Function to restart the game
    restart: function (player) {
        // game.state.start('main');
        player.body.x = width/2;
        player.body.y = height - 3*blockSize ;
    },
    loadLevel: function () {
    }

};

// Initialize the game and start our state
var game = new Phaser.Game(width, 600,'gameContainer');
game.state.add('main', mainState);
game.state.start('main');

var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// create Oscillator node
var oscillator = audioCtx.createOscillator();

oscillator.type = 'sine';
oscillator.frequency.value = 1320; // value in hertz
oscillator.connect(audioCtx.destination);
oscillator.start();
setTimeout(()=> {oscillator.stop()},2000)