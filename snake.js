window.onload = function() {
	var main = document.getElementById('main');
	var showCanvas = true; //开不开启画步格子

	/*
	  地图对象得到构造方法
	  atom  原子的大小，宽和高是一致的 10
	  xnum  横向原子的数量
	  ynum  纵向原子的数量
	*/
	function Map(atom, xnum, ynum) {
		this.atom = atom;
		this.xnum = xnum;
		this.ynum = ynum;

		this.canvas = null;

		// 创建画布的方法
		this.create = function() {
			this.canvas = document.createElement('div');
			this.canvas.style.cssText = "position:relative;top:20px;border:1px solid darked; background:pink;";
			this.canvas.style.width = this.atom * this.xnum + 'px'; //画布的宽
			this.canvas.style.height = this.atom * this.ynum + 'px'; //画布的高
			main.appendChild(this.canvas);

			if (showCanvas) {
				for (var y = 0; y < ynum; y++) {
					for (var x = 0; x < xnum; x++) {
						var a = document.createElement('div')
						a.style.cssText = "border:1px solid white";
						a.style.width = this.atom + 'px';
						a.style.height = this.atom + 'px';
						a.style.backgroundColor = "#999999";
						this.canvas.appendChild(a);
						a.style.position = "absolute";
						a.style.left = x * this.atom + 'px';
						a.style.top = y * this.atom + "px";
					}
				}
			}
		}

	}

	// 创建食物的构造方法
	// map 地图对象
	function Food(map) {
		this.width = map.atom;
		this.height = map.atom;
		this.backgroundColor = "rgb(" + Math.floor(Math.random() * 200) + "," + Math.floor(Math.random() * 200) + "," +
			Math.floor(Math.random() * 200) + ")";

		this.x = Math.floor(Math.random() * map.xnum);
		this.y = Math.floor(Math.random() * map.ynum);

		this.flag = document.createElement('div');
		this.flag.style.width = this.width + 'px';
		this.flag.style.height = this.height + 'px';

		this.flag.style.backgroundColor = this.backgroundColor;
		this.flag.style.borderRadius = "10%";
		this.flag.style.position = 'absolute';
		this.flag.style.left = this.x * this.width + 'px';
		this.flag.style.top = this.y * this.height + 'px';

		map.canvas.appendChild(this.flag);
	}

	// 创建蛇的构造方法
	function Snake(map) {
		// 设置蛇的宽，高
		this.width = map.atom;
		this.height = map.atom;

		// 起始时默认的蛇的走的方向
		this.direction = 'right';

		this.body = [{
				x: 2,
				y: 0
			}, // 蛇头  第一个点
			{
				x: 1,
				y: 0
			}, // 蛇体  第二个点
			{
				x: 0,
				y: 0
			}, // 蛇尾  第三个点 
		];

		// 显示蛇的方法
		this.display = function() {
			for (var i = 0; i < this.body.length; i++) {
				if (this.body[i].x != null) { // 当吃到食物时，x==null，不能新建，不然会在0，0处新建一个
					var s = document.createElement('div')
					// 将节点保存到一个状态变量中，以后做删除使用
					this.body[i].flag = s;

					//设置蛇的样式
					s.style.width = this.width + 'px';
					s.style.height = this.height + 'px';
					s.style.backgroundColor = "lightblue";

					// 设置位置
					s.style.position = 'absolute';
					s.style.left = this.body[i].x * this.width + 'px';
					s.style.top = this.body[i].y * this.height + 'px';

					map.canvas.appendChild(s);
				}

			}
		}

		// 让蛇运动起来
		this.run = function() {
			// 让后一个元素带前一个元素的位置

			for (var i = this.body.length - 1; i > 0; i--) {
				this.body[i].x = this.body[i - 1].x;
				this.body[i].y = this.body[i - 1].y;
			}

			// 默认是right  left up down
			// 根据方法处理蛇头
			switch (this.direction) {
				case "left":
					this.body[0].x -= 1;
					break;
				case "right":
					this.body[0].x += 1;
					break;
				case "up":
					this.body[0].y -= 1;
					break;
				case "down":
					this.body[0].y += 1;
					break;
			}

			// 判断蛇头吃到食物
			if (snake.body[0].x == food.x && this.body[0].y == food.y) {
				this.body.push({
					x: null,
					y: null,
					flag: null
				});

				//判断一下设置级别
				if (this.body.length > L.slength) {
					L.set();
				}

				// 判断胜利
				if (this.body.length == 100) {
					clearInterval(timer);
					alert("你赢了~~~");
				}

				map.canvas.removeChild(food.flag);
				food = new Food(map);
			}

			// 判断蛇头是否出界 
			if (this.body[0].x < 0 || this.body[0].x > map.xnum - 1 || this.body[0].y < 0 || this.body[0].y > map.ynum - 1) {
				// 清除定时器
				clearInterval(timer);
				alert("撞死了,不会吧~不会吧~就这？");

				// 重新开始游戏
				restart(map, this);


				return false;
			}


			// 判断是否自己蚕食
			for (var i = 4; i < this.body.length; i++) {
				if (this.body[0].x == this.body[i].x && this.body[0].y == this.body[i].y) {
					// 清除定时器
					clearInterval(timer);
					alert("好家伙，我杀我自己...");

					// 重新开始游戏
					restart(map, this);


					return false;
				}
			};

			for (var i = 0; i < this.body.length; i++) {
				if (this.body[i].flag != null) { //当吃到食物时，flag是等于null，且不能删除
					map.canvas.removeChild(this.body[i].flag);
				}

			}

			this.display();
		}
	}

	// 重新开始游戏
	function restart(map, snake) {
		for (var i = 0; i < snake.body.length; i++) {
			map.canvas.removeChild(snake.body[i].flag);
		};
		// 重新创建一条蛇
		snake.body = [{
				x: 2,
				y: 0
			},
			{
				x: 1,
				y: 0
			},
			{
				x: 0,
				y: 0
			}
		];

		snake.direction = "right";
		snake.display();
		map.canvas.removeChild(food.flag);
		food = new Food(map);
	};

	//设置级别对象
	function Level() {
		this.num = 1; // 第几回合
		this.speed = 300; // 毫秒，每升一关，毫秒钱减少50
		this.slength = 4; // 每个级别的长度判断

		this.set = function() {
			this.num++;

			if (this.speed <= 50) {
				this.speed = 50;
			} else {
				this.speed -= 50;
			}
			this.slength += 5;
			this.display();

			start(); //重新开始，速度加快
		}


		this.display = function() {
			document.getElementById('guan').innerHTML = this.num;
		}
	}

	var L = new Level();
	L.display();

	// 创建地图对象
	var map = new Map(20, 30, 20);
	// 显示画布
	map.create();

	// 创建食物对象
	var food = new Food(map);

	// 构造蛇对象
	var snake = new Snake(map);
	snake.display();

	// 给body绑定键盘事件，处理方向
	window.onkeydown = function(e) {
		var event = e || window.event;

		switch (event.keyCode) {
			case 38:
				if (snake.direction != "down") {
					snake.direction = "up";
				}
				break;
			case 40:
				if (snake.direction != "up") {
					snake.direction = "down";
				}
				break;
			case 37:
				if (snake.direction != "right") {
					snake.direction = "left";
				}
				break;
			case 39:
				if (snake.direction != "left") {
					snake.direction = "right";
				}
				break;
		}
	}


	// 声明一个定时器，变量可以提升
	var timer;

	function start() {
		clearInterval(timer);
		timer = setInterval(function() {
			snake.run();
		}, L.speed);
	}

	document.getElementById('begin').onclick = function() {
		start();
	}

	document.getElementById('pause').onclick = function() {
		clearInterval(timer);
	}
}
