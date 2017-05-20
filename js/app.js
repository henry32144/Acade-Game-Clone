// 这是我们的玩家要躲避的敌人 
var Enemy = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    this.column = Math.round((Math.random()*10)/4);
    this.speed = Math.round(Math.random()*500) + 300;
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    this.x = -50;
    this.y = 60 + (this.column*83);
    this.sprite = 'images/enemy-bug.png';
};

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    this.x += this.speed * dt;
    //判斷是否超出邊界，超出後將位置移回左邊，並且隨機生在其他列。
    if(this.x > 606) {
        this.column = Math.round((Math.random()*10)/4);
        this.speed = Math.round(Math.random()*400) + 300;
        this.y = 60 + (this.column*83);
        this.x = -50;
    }
};

Enemy.prototype.Collisions = function() {
    //判斷是否與玩家的座標相同，是的話將玩家移動至原點
    if(this.y === player.y) {
        if(Math.abs(this.x - player.x) < 75)
        {
            player.x = 202;
            player.y = 392;
        }
    }
};

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function() {
    this.x = 202;
    this.y = 392;
    this.sprite = 'images/char-boy.png';
};

//將玩家的原型委託至敵人的原型
Player.prototype = Object.create(Enemy.prototype);

//更改玩家的constructor
Player.prototype.constructor = player;

Player.prototype.update = function() {
}

//處理玩家的輸入
Player.prototype.handleInput = function(getInput) {
    //判斷是否超出移動邊界
    switch (getInput)
    {
        case 'left':
            if(this.x > 0) {
                this.x -= 101;
        }
            break;

        case 'right':
            if(this.x < 404) {
                this.x += 101;
        }
            break;

        case 'up':
            if(this.y === 60) {
                win();
        }
            if(this.y > 60) {
                this.y -= 83;
        }
            break;

        case 'down':
            if(this.y < 392) {
                this.y += 83;
        }
            break;
    }
};

//寶石的函數
var Gem = function() {
    this.column = Math.round((Math.random()*10)/3);
    this.row = Math.round((Math.random()*10)/2);
    this.gemType = Math.round((Math.random()*10)/4);
    this.x = 0 + 101*this.row;
    this.y = 60 + 83*this.column;
    switch (this.gemType)
    {
        case 0:
            this.sprite = 'images/Gem-Blue.png';
            break;
        case 1:
            this.sprite = 'images/Gem-Green.png';
            break;
        case 2:
            this.sprite = 'images/Gem-Orange.png';
            break;
    }
};

//寶石的原型設定
Gem.prototype = Object.create(Enemy.prototype);
Gem.prototype.constructor = gems;
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//寶石的取得判定
Gem.prototype.getPoints = function() {
    //判斷是否與玩家的座標相同，是的話加分，並將寶石移走
    if(this.y === player.y) {
        if(Math.abs(this.x - player.x) < 50)
        {
            this.x = -100;
            this.y = -100;
            addPoints(this.gemType);
            showPoints();
        }
    }
};
Gem.prototype.update = function() {
}


//勝利函數
var Win = function() {

};



// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面

//實例敵人
var allEnemies = [];
for(var i = 0; i< 4 ; i++)
{
    var enemyBugs = new Enemy();
    allEnemies.push(enemyBugs);
}

//實例玩家
var player = new Player();

//實例寶石
var allGems = [];
for(var i = 0; i< 4 ; i++)
{
    //隨機寶石種類
    var gems = new Gem();
    allGems.push(gems);
}

// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
