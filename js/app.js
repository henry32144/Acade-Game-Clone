//定義一些常用的位置變量
var coordinates = {
    origin_X : 202,  //玩家重生點座標x
    origin_Y : 392,  //玩家重生點座標y
    horizontal_Step : 101, //步伐
    vertical_Step : 83,
    border_Left : 0,    //  邊界
    border_Right : 404,
    border_Up : 60,
    border_Bottom : 392
};

//定義一個遊戲物件讓其他物件可以調用原型
var GameObject = function() {
};

// 此为游戏必须的函数，用来在屏幕上画出物體，
GameObject.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// 这是我们的玩家要躲避的敌人 
var Enemy = function() {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多
    // 敌人的图片或者雪碧图，用一个我们提供的工具函数来轻松的加载文件
    setEnemy(this);
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype = Object.create(GameObject.prototype);
Enemy.prototype.constructor = allEnemies;
// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的
    this.x += this.speed * dt;
    //判斷是否超出邊界，超出後將位置移回左邊，並且隨機生在其他列。
    if(this.x > 606) {
        setEnemy(this);
    }
};

Enemy.prototype.Collisions = function() {
    //判斷是否與玩家的座標相同，是的話將玩家移動至原點
    if(this.y === player.y) {
        if(Math.abs(this.x - player.x) < 75)
        {
            replacePlayer();
        }
    }
};



//設置敵人的位置
var setEnemy = function(enemy) {
    enemy.column = Math.round((Math.random()*10)/4);
    enemy.speed = Math.round(Math.random()*500) + 300;
    enemy.x = -50;
    enemy.y = 60 + (enemy.column*83);
};
// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数
var Player = function() {
    this.x = coordinates.origin_X;
    this.y = coordinates.origin_Y;
    this.sprite = 'images/char-boy.png';
};

//重置玩家位置
var replacePlayer = function() {
    player.x = coordinates.origin_X;
    player.y = coordinates.origin_Y;
};

//將玩家的原型委託至遊戲物件的原型
Player.prototype = Object.create(GameObject.prototype);

//更改玩家的constructor
Player.prototype.constructor = player;

//處理玩家的輸入
Player.prototype.handleInput = function(getInput) {
    //判斷是否超出移動邊界
    switch (getInput)
    {
        case 'left':
            if(this.x > coordinates.border_Left) {
                this.x -= coordinates.horizontal_Step;
        }
            break;

        case 'right':
            if(this.x < coordinates.border_Right) {
                this.x += coordinates.horizontal_Step;
        }
            break;

        //判斷如果下一層就是河流，就執行過河的函數
        case 'up':
            if(this.y === coordinates.border_Up) {
                cross();
        }
            if(this.y > coordinates.border_Up) {
                this.y -= coordinates.vertical_Step;
        }
            break;

        case 'down':
            if(this.y < coordinates.border_Bottom) {
                this.y += coordinates.vertical_Step;
        }
            break;
    }
};

//定義寶石的函數
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
Gem.prototype = Object.create(GameObject.prototype);
Gem.prototype.constructor = allGems;

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

//過河函數
var cross = function() {
    crossTimes += 1;
    Points += 500;
    showPoints();
    replacePlayer();
    deleteGems();
    generateGems();
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

//生成寶石的函數
var generateGems = function() {
    for(var i = 0; i< 4 ; i++)
    {
        //隨機寶石種類
        var gems = new Gem();
        allGems.push(gems);
    }
};

//首次生成寶石
generateGems();

//刪除寶石
var deleteGems = function() {
    for(var i = 0; i< 4 ; i++)
    {
        allGems.pop(i);
    }
};

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
