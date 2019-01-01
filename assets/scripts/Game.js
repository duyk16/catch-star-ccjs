cc.Class({
    extends: cc.Component,

    properties: {
        // this property quotes the PreFab resource of stars
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        // the random scale of disappearing time for stars
        maxStarDuration: 0,
        minStarDuration: 0,
        // ground node for confirming the height of the generated star's position
        ground: {
            default: null,
            type: cc.Node
        },
        // player node for obtaining the jump height of the main character and controlling the movement switch of the main character
        player: {
            default: null,
            type: cc.Node
        },
        // reference of score label
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        // scoring sound effect resource
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        },
        button: {
            default: null,
            type: cc.Button
        }
    },

    onLoad () {
        this.player.active = false
    },

    startGame: function () {
        // obtain the anchor point of ground level on the y axis
        this.groundY = this.ground.y + this.ground.height/2; // this.ground.top may also work
        // initialize timer
        this.timer = 0;
        this.starDuration = 0;
        // generate a new star
        this.spawnNewStar();
        // initialize scoring
        this.score = 0;
        this.scoreDisplay.string = 'Score: ' + this.score;
        
        this.player.active = true
        this.player.getComponent('Player').startPlayer()
        this.button.node.active = false
    },

    spawnNewStar: function() {
        // generate a new node in the scene with a preset template
        var newStar = cc.instantiate(this.starPrefab);
        // put the newly added node under the Canvas node
        this.node.addChild(newStar);
        // set up a random position for the star
        newStar.setPosition(this.getNewStarPosition());
        // Staging a reference of Game object on a star component
        newStar.getComponent('Star').game = this;
        // reset timer, randomly choose a value according the scale of star duration
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function () {
        var randX = 0;
        // According to the position of the ground level and the main character's jump height, randomly obtain an anchor point of the star on the y axis
        var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        // according to the width of the screen, randomly obtain an anchor point of star on the x axis
        var maxX = this.node.width/2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        // return to the anchor point of the star
        return cc.v2(randX, randY);
    },

    gainScore: function () {
        this.score += 1;
        // update the words of the scoreDisplay Label
        this.scoreDisplay.string = 'Score: ' + this.score;
        // play the scoring sound effect
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    update: function (dt) {
        // update timer for each frame, when a new star is not generated after exceeding duration
        // invoke the logic of game failure
        if (this.timer > this.starDuration && !this.button.node.active) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    },

    gameOver: function () {
        this.player.stopAllActions(); //stop the jumping action of the player node
        // cc.director.loadScene('Game');
        this.player.x = 0;
        this.player.y = this.groundY;
        this.button.node.active = true;

        // Set speed to Zero
        this.player._components[1].xSpeed = 0
        // Delete Star node
        this.node.getChildByName('Star').destroy()

    }

});
