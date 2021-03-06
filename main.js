
var jumpButton;
var spacefield;
var spacedv;
var requiredToWin = 4;
// Create the state that will contain the whole game
var mainState = {
    preload: function () {
        game.load.image('background', 'assets/background.jpg');
        game.load.image('player', 'assets/player.png');
        game.load.image('wall', 'assets/wall.png');
        game.load.image('win', 'assets/win.png');
        game.load.image('enemy', 'assets/enemy.png');
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

        // Variable to store the arrow key pressed
        this.cursor = game.input.keyboard.createCursorKeys();

        // Create the player in the middle of the game
        this.player = game.add.sprite(180, 360+9*20, 'player');
        this.winCount = 0;

        this.walls = game.add.group();
        //        this.coins = game.add.group();
        this.trucks = game.add.group();
        this.wins = game.add.group();
        var level = [
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

        for (var i = 0; i < level.length; i++) {
            for (var j = 0; j < level[i].length; j++) {

                // Create a wall and add it to the 'walls' group
                if (level[i][j] == 'x') {
                    var wall = game.add.sprite(20 * j, 260 + 20 * i, 'wall');
                    this.walls.add(wall);
                }
                else if (level[i][j] == 'o') {
                    var win = game.add.sprite(20 * j, 260 + 20 * i, 'win');
                    this.wins.add(win);
                }
                

                //                // Create a coin and add it to the 'coins' group
                //                  Could be implemented on higher levels
                //                else if (level[i][j] == ' ') {
                //                    var coin = game.add.sprite(64+64*j, 64+64*i, 'coin');
                //                    this.coins.add(coin);
                //                }

                // Create a enemy and add it to the 'enemies' group
                else if (level[i][j] == 'e') {
                    const initialX = (i % 4 == 0) ? 420 : -420;
                    var enemy = game.add.sprite(-20 + 20 * j, 260 + 20 * i, 'enemy');
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
            this.player.body.y -= 20;
        }

        //        spacefield.tilePosition.y += spacedv;
        for (var i = 0; i < this.trucks.length; i++) {
            if (this.trucks.getAt(i).speed < 0) {
                if (this.trucks.getAt(i).body.x < 400)
                    this.trucks.getAt(i).body.x += speed;
                else
                    this.trucks.getAt(i).body.x -= 420;
            }
            else {
                if (this.trucks.getAt(i).body.x > -20)
                    this.trucks.getAt(i).body.x -= speed;
                else
                    this.trucks.getAt(i).body.x += 420;

            }

            game.physics.arcade.overlap(this.player, this.trucks, this.restart, null, this);
            game.physics.arcade.overlap(this.player, this.wins, this.achieved, null, this);
        }
    },

    // Function to kill a coin
    achieved: function (player, coin) {
        this.winCount++;
        if(this.winCount<requiredToWin){
            this.wins.getAt(this.winCount - 1).key = 'player';
            this.wins.getAt(this.winCount - 1).loadTexture('player',0);
            console.log(this.wins.getAt(this.winCount - 1)); 
            player.body.x = 180;
            player.body.y = 360+9*20;
        }
        else{
            console.log("You have won!");
        }
    },

    // Function to restart the game
    restart: function () {
        game.state.start('main');
    },
    loadLevel: function () {
    }

};

// Initialize the game and start our state
var game = new Phaser.Game(400, 600);
game.state.add('main', mainState);
game.state.start('main');