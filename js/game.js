
// инициализация движка
/*Phaser.Game(ширина холста, высота холста, режим рендеринга Phaser.AUTO(Phaser.CONVAS, Phaser.WEBGL), задаем id дива через который будет
	инициализироваться (выводиться) изображение, добовляем для быстрого прототепирования объект который будет содержать 
	все основные функции { preload: preload, create: create, update: update });*/
var game = new Phaser.Game(800, 600, Phaser.AUTO, "game" , { preload: preload, create: create, update: update });


 // Начальное значение
    var score = 0;
 // переменная хранения счетчика
		var scoreText;
		var platforms;
		var live = 100;
		var liveText;

// прелодер, здесь произайдет загрузка всех необходимых ресурсво перед началом ишры
// инициализируем ресурсы
function preload() {

    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('apt', 'assets/firstaid.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48); // ключь, нзачение (адрес ресурса), размер одного кадра

}


//загрузка статических ресуров для игры (картинки, тайтылы)
// добавляем ресурсы в игровой мир


function create() {

		//  добавляем в игру физику (выбираем аркадную фищику)
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  добвляем небо в игру
    game.add.sprite(0, 0, 'sky');

    //  выведет группу объектов
    platforms = game.add.group();

    //  создаем тело (массу) для всех элиментов которые будут находиться в этой группе
    platforms.enableBody = true;

    // добовляем нижнюю платформу
    var ground = platforms.create(0, game.world.height - 64, 'ground');

    //  увеличиваем объект в два раза
    ground.scale.setTo(2, 2); // элимент.скалировать.втановить в (2,2)

    //  делаем элимент недвижимым при столкновение его с другими элиментами
    ground.body.immovable = true;

    //  добовляем вторую платформу
    var ledge = platforms.create(400, 400, 'ground');

    ledge.body.immovable = true;

    ledge = platforms.create(-150, 250, 'ground');

    ledge.body.immovable = true;




     // добовляем игрока
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  добовляем играку физику (инициализируем ее)
    game.physics.arcade.enable(player);

    //  добовляем параметры для физики
    player.body.bounce.y = 0.2; // отскок от поверхности
    player.body.gravity.y = 300; // вектор гравитации
    player.body.collideWorldBounds = true; // запещаем игроку заходить за гроницы мира

    //  добовляем анимации (ходьба влева и вправо)
    player.animations.add('left', [0, 1, 2, 3], 10, true); // название, номера слайдов, колчество кадров в
    // секунду, true замыкаем анимацию в цикде
    player.animations.add('right', [5, 6, 7, 8], 10, true);


    // звездочки

    // добовляем звездочки
    stars = game.add.group();
    // добовляем массу тела
    stars.enableBody = true;

    //  добовляем звездочки через цикл
    for (var i = 0; i < 12; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = stars.create(i * 70, 0, 'star');

        //  добовляем им вектор гравитации
        star.body.gravity.y = 100;

        // добовляем им случаную скорость отталкивания от поверхности
        star.body.bounce.y = 0.2 + Math.random() * 0.2;
    };


 // добовляю аптечки

    aptec = game.add.group();
    // добовляем массу тела
    aptec.enableBody = true;

    ledge1 = aptec.create(0, game.world.height - 164, 'apt');

		ledge1.body.bounce.y = 0.2; // отскок от поверхности
   	ledge1.body.gravity.y = 300; // вектор гравитации


       //Добовляем счетчик очков
		scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#fff' });

		// добовляем стетчик жизней 

		liveText = game.add.text(160, 16, 'live: 100', { fontSize: '32px', fill: '#fff' });
 
}

// то что будет работать в цикле
// цикл игры
function update() {

	//  добовляем в цикл игры физику столкновений игрока и платформы
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(player, stars, collectStar, null, this); // добовляем столкновение между персонажем и звездой и событие которое
    // возникнет при их столкновение

    game.physics.arcade.collide(aptec, platforms);
    game.physics.arcade.overlap(player, aptec, collectApt , null, this); 


    function collectStar (player, star) {

    // удалит звезду при столкновение
    star.kill();

    // добовляем десячь очков если собрать одну звездочку к счетчику
    score += 10;
    // добовляем изменненное значение в текст счетчика
    scoreText.text = 'Score: ' + score;

		};

		function collectApt (player, aptec) {
 		aptec.kill();

 		live -= 10;
		liveText.text = 'live: ' + live;

		};


	// инициализируем клавиатуру для управления 
    cursors = game.input.keyboard.createCursorKeys();

    // устанавливаем начальную скорость игрока по оси х
    player.body.velocity.x = 0;


    // добовляем управление
    // если нажать на лево то
    if (cursors.left.isDown)
    {
        //  изменяем крость тела игрока
        player.body.velocity.x = -150;
        // добовляем анимацию при нажатие
        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  изменяем вектор скорости и добовляем анимацию
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        // если мы не нажимаем то анимация остонавливается
        player.animations.stop();

        // выбираем 4 слайд (из спрайта)
        player.frame = 4;
    }

    //  разрешае игроку прыгать если он находиться на змеле
    if (cursors.up.isDown && player.body.touching.down) // если нажата кнопка вверх и тело игрока касаеться низа
    {
        player.body.velocity.y = -310;
    };

 

}