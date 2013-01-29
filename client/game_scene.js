/**
 * ゲームのプレイ画面のクラス
 * @class
 * @porperty {Timerオブジェクト} timer ゲームのタイマー
 * @porperty {Boardオブジェクト} board ゲームボード
 * @porperty {Cursorオブジェクト} cursor カーソル
 * @extends Scene
 */
var GameScene = Class.create(Scene, {
	timer: null,
	board: null,
	initialize: function(width, height) {
		Scene.call(this, width, height);
	},
	
	/**
	 * ゲームのシーンに変わった直後の処理
	 * @memberOf GameScene
	 * @function
	 */
	onenter: function() {
		// キーイベントの設定
		// enchant.jsではAボタン、Bボタン、方向ボタンしか使えないのでjQueryで数字キーを取得する
		var self = this;
		$(window).keydown(function(e) {
			self.keydown(String.fromCharCode(e.keyCode));
		});

		// 背景の表示
		var background = new Sprite(800, 600);
		background.image = game.assets['background.png'];
		game.rootScene.addChild(background);
		
		// ボード
		this.board = new Board();
		this.addChild(this.board);
		
		// タイマー
		this.timer = new Timer();
		this.addChild(this.timer);
		this.timer.start();
		
		// タイマーのラベル
		var timerLabel = new Label();
		timerLabel.x = 580;
		timerLabel.y = 30;
		timerLabel.font = '50px sans-serif';
		timerLabel.color = 'white';
		timerLabel.text = 'Time';
		this.addChild(timerLabel);
		
		// キーパッド
		var numberPad = new NumberPad();
		numberPad.x = 570;
		numberPad.y = 170;
		this.addChild(numberPad);
		
		// ギブアップボタン
		var giveupButton = new Button('giveup', game.returnTitle, 217, 120);
		giveupButton.x = 575;
		giveupButton.y = 450;
		this.addChild(giveupButton);
	},
	
	/**
	 * 別のシーンに変わる直前の処理
	 * @memberOf GameScene
	 * @function
	 */
	onexit: function() {
		// キーイベントを外す
		$(window).unbind('keydown');
	},
			
	/**
	 * キーが押されたときの処理
	 * @memberOf GameScene
	 * @function
	 * @param {文字列} key 入力されたキー
	 */
	keydown: function(key) {
		var cursor = this.board.getCursor();
		var targetCell = cursor.getCell();
		
		// 数字が入力されたら
		if('0' <= key && key <= '9') {
		
			// 正解
			if(targetCell.answer == key) {
				game.assets['open.mp3'].play();
				targetCell.showAnswer();
				
				var pos = cursor.getPosition();
				var size = this.board.getSize();
				if(pos.x >= size.width - 1 && pos.y >= size.height - 1) {
					this.gameOver();
				} else {
					cursor.next();
				}
			}

			// 不正解
			else {
				game.assets['miss.mp3'].play();
				this.timer.penalty(2);
			}
		}
	},
	
	/**
	 * ゲームが終了したときに実行される処理
	 * @memberOf GameScene
	 * @function
	 */
	gameOver: function() {
		this.timer.stop();
		this.tl.delay(10).then(function() {
			if(window.confirm('ランキングにクリアタイムを送信しますか？', '名無し')) {
				var name = window.prompt('登録名を入力してください(14文字以内)');
				$.ajax({
					url: '/register',
					dataType: 'json',
					data: {
						name: name,
						time: this.timer._toString(this.timer.getTime())
					},
					success: function(data) {
						alert('あなたは' + data.rank + '位です');
					},
					error: function() {
						console.log('error');
					}
				});
			}
			game.returnTitle();
		});
	}
});

/**
 * ゲームボードを表すクラス
 * @class
 * @property {数値} _width マス目の幅
 * @property {数値} _height マス目の行数
 * @porperty {配列} _cells マス目の配列
 * @property {Cursorオブジェクト} _cursor カーソル
 * @property {数値} _touchCount タッチされた回数。タッチ操作で数字をセットするときに使用する。
 * @see Cell
 */
var Board = Class.create(Group, {
	_width: 5,
	_height: 5,
	_cells: [],
	_cursor: null,
	_touchCount: 0,
	initialize: function() {
		// 継承
		Group.call(this);
		this.x = 25;
		this.y = 25;
		
		// マス目を作成
		for(var x = 0; x < this._width; x++) {
			this._cells[x] = [];
			for(var y = 0; y < this._height; y++) {
				this._cells[x][y] = new Cell(x, y);
				this.addChild(this._cells[x][y]);
			}
		}
		
		// ボムを配置
		var bombNum = 6;
		var bombPositions = [];
		while(bombPositions.length < bombNum) {
			var rand = Math.floor(Math.random() * this._width * this._height);
			if(bombPositions.indexOf(rand) == -1 && rand != 0) {
				bombPositions.push(rand);
			}
		}
		for(var i = 0; i < bombPositions.length; i++) {
			var x = Math.floor(bombPositions[i] % this._width);
			var y = Math.floor(bombPositions[i] / this._width);
			this._cells[x][y].setBomb();
		}
		
		// 答えの数字を計算する準備
		var getAnswer = function(x, y) {
			var count = 0;
			for(var dx = -1; dx <= 1; dx++) {
				if(x + dx < 0 || x + dx >= this._width) {
					continue;
				}
				for(var dy = -1; dy <= 1; dy++) {
					if((dx == 0 && dy == 0) || (y + dy < 0 || y + dy >= this._height)) {
						continue
					}
					if(this._cells[x + dx][y + dy].bomb) {
						count++;
					}
				}
			}
			return count;
		};
		
		// 答えの数字をすべてのマス目にセット
		for(var x = 0; x < this._width; x++) {
			for(var y = 0; y < this._height; y++) {
				if(!this._cells[x][y].bomb) {
					this._cells[x][y].answer = getAnswer.call(this, x, y);
				}
			}
		}
		
		// カーソルの追加
		this._cursor = new Cursor(this);
		
		// タッチイベントの追加
		this.addEventListener(Event.TOUCH_START, this._touchStart);
		this.addEventListener(Event.TOUCH_END, this._touchEnd);
	},
	
	/**
	 * タッチされた時の処理
	 * @memberOf Board
	 * @function
	 * @param {Event} e タッチ座標が入ったイベントオブジェクト
	 */
	_touchStart: function(e) {
		this._touchPosition = {};
		this._touchPosition.x = e.localX;
		this._touchPosition.y = e.localY;
	},
	
	/**
	 * タッチが終わった時の処理
	 * @memberOf Board
	 * @function
	 * @param {Event} e タッチ座標が入ったイベントオブジェクト
	 */
	_touchEnd: function(e) {
		var dx = Math.abs(this._touchPosition.x - e.localX);
		var dy = Math.abs(this._touchPosition.y - e.localY);
		
		// フリックなら確定
		if(dx + dy > 60) {
			this.parentNode.keydown(this._touchCount.toString());
			this._touchCount = 0;
		}
		// タップなら数値変更
		else {
			this._touchCount = (this._touchCount + 1) % 10;
			this._cursor.getCell().showNumber(this._touchCount);
		}
	},
	
	/**
	 * ボードの大きさを取得する
	 * @memberOf Board
	 * @function
	 * @returns {width:幅, height:高さ}
	 */
	getSize: function() {
		return {width: this._width, height: this._height};
	},
	
	/**
	 * 指定された座標のセルを返す
	 * @memberOf Board
	 * @function
	 * @param {数値} x X座標
	 * @param {数値} y Y座標
	 * @returns {Cellオブジェクト} 指定された座標のセル
	 */
	getCell: function(x, y) {
		return this._cells[x][y];
	},

	/**
	 * カーソルオブジェクトを取得する
	 * @memberOf Board
	 * @function
	 * @returns {Cursorオブジェクト} カーソル
	 */
	getCursor: function() {
		return this._cursor;
	}
});

/**
 * マス目を表すクラス
 * @class
 * @property {論理値} bomb 爆弾がセットされていたらtrue
 * @property {数値} answer マスに入る正しい数字,爆弾なら0がセットされる。¥
 * @porperty {論理値} visibleAnswer 答えの数字が表示されていればtrue
 * @param {数値} x マス目のX座標
 * @param {数値} y マス目のY座標
 * @static {数値} WIDTH マス目の幅(ピクセル)
 * @static {数値} HEIGHT マス目の高さ(ピクセル)
 */
var Cell = Class.create(Sprite, {
	bomb: false,
	answer: 0,
	visibleAnswer: false,
	initialize: function(x, y) {
		Sprite.call(this, Cell.WIDTH, Cell.HEIGHT);
		this.image = game.assets['cell.png'];
		this.x = x * Cell.WIDTH;
		this.y = y * Cell.HEIGHT;
	},
	
	/**
	 * ボムをマス目に置く
	 * @function
	 * @memberOf Cell
	 */
	setBomb: function() {
		this.bomb = true;
		this.image = game.assets['bomb.png'];
	},
	
	/**
	 * 答えをマス目に表示する
	 * @function
	 * @memberOf Cell
	 */
	 showAnswer: function() {
		this.showNumber(this.answer);
	 },
	 
	 /**
	  * 任意の数字をマス目に表示する
	  * @function
	  * @memberOf Cell
	  * @param {数値} number 表示する数値
	  */
	 showNumber: function(number) {
	 	this.frame = number;
		this.image = game.assets['numbers.png'];
	 }
});
Cell.WIDTH = 108;
Cell.HEIGHT = 108;

/**
 * カーソルを表すクラス
 * @class
 * @param {Boardオブジェクト} board ボードオブジェクト
 * @property {x:X座標, y:Y座標} _position カーソルが乗っているマス目を表す座標
 * @property {Cellオブジェクト} _cell カーソルが指しているセルオブジェクトの参照
 */
var Cursor = Class.create(Sprite, {
	_position: null,
	_cell: null,
	initialize: function(board) {
		Sprite.call(this, Cell.WIDTH, Cell.HEIGHT);
		this.image = game.assets['cursor.png'];
		this._position = {x: 0, y: 0};
		this._cell = board.getCell(0, 0);
		this.tl.scaleTo(1.05, 1.05, 30).scaleTo(1, 1, 30).loop();
		board.addChild(this);
	},

	/**
	 * 次のマスへ移動する
	 * @memberOf Cursor
	 * @function
	 */
	next: function() {
		var size = this.parentNode.getSize();
		var isLast = function(position) {
			return (position.x >= size.width - 1 && position.y >= size.height - 1);
		};
		
		// カーソルが外にはみ出したらエラー
		if(isLast(this._position)) {
			throw new Error('カーソルがボードの外に出ようとしています');
		}
		
		// 座標の更新
		this._position.x += 1;
		if(this._position.x >= size.width) {
			this._position.x = 0;
			this._position.y += 1;
		}
		
		// 示すセルを更新
		this._cell = this.parentNode.getCell(this._position.x, this._position.y);
		
		// 移動先がボムなら飛ばす、ボムじゃないならカーソルを移動
		if(this._cell.bomb) {
			if(isLast(this._position)) {
				this.parentNode.parentNode.gameOver();
			} else {
				this.next();
			}
		} else {
			this.moveTo(Cell.WIDTH * this._position.x, Cell.HEIGHT * this._position.y);
		}
	},
	
	/**
	 * 指している座標を返す
	 * @memberOf Cursor
	 * @function
	 * @returns {x:X座標, y:Y座標} カーソルが指しているマス目
	 */
	getPosition: function() {
		return this._position;
	},

	/**
	 * 指しているマス目を返す
	 * @memberOf Cursor
	 * @function
	 * @returns {Cellオブジェクト} 現在指しているマス目
	*/
	getCell: function() {
		return this._cell;
	}
});

/**
 * タイマークラス
 * @class
 * @extends Sprite
 * @property {数値} _baseFrame タイマーが動いた瞬間のフレーム
 */
var Timer = Class.create(Label, {
	_baseFrame: 0,
	
	/**
	 * コンストラクタ
	 * @memberOf Timer
	 * @function
	 */
	initialize: function() {
		Label.call(this);
		this.x = 620;
		this.y = 90;
		this.font = '50px sans-serif';
		this.color = 'white';
		this.text = '00:00';
	},
	
	/**
	 * タイマーを更新
	 * @memberOf Timer
	 * @function
	 */
	_update: function() {
		var time = this.getTime();
		this.text = this._toString(time);
	},
	
	/**
	 * タイムを画面表示用の文字列に変換する
	 * @memberOf Timer
	 * @function
	 * @returns {文字列} 「秒:ミリ秒」形式の文字列
	 * @param {数値} time 文字列に変換する時間
	 */
	_toString: function(time) {
		var s = Math.floor(time);
		var ms = Math.floor((time - s) * 100);
		var sZero = (s < 10) ? '0' : '';
		var msZero = (ms < 10) ? '0' : '';
		return sZero + s + ':' + msZero + ms;
	},
	
	/**
	 * ペナルティとして経過時間を増やす
	 * @memberOf Time
	 * @param {数値} sec 増やす秒数
	 */
	penalty: function(sec) {
		this._baseFrame -= sec * game.fps;
		
		// 増えた秒数を表示する準備
		var label = new Label();
		label.text = '+' + sec + '秒';
		label.font = '25px sans-serif';
		label.color = 'white';
		label.x = this.x - 10;
		label.y = this.y + 50;
		label.tl.hide();
		this.parentNode.addChild(label);

		// アニメーション実行
		this.tl.then(function() {
			this.color = 'red';
			label.tl.fadeIn(10).and().moveBy(50, 0, 10);
		}).moveBy(-10, 0, 3).moveBy(20, 0, 3).moveBy(-10, 0, 3).then(function() {
			this.color = 'white';
			label.tl.fadeOut(10).removeFromScene();
		});
	},
	
	/**
	 * タイマーを動かす
	 * @memberOf Timer
	 * @function
	 */
	start: function() {
		this._baseFrame = game.frame;
		this.addEventListener(Event.ENTER_FRAME, this._update);
	},
	
	/**
	 * タイマーを止める
	 * @memberOf Timer
	 * @function
	 */
	stop: function() {
		this.clearEventListener(Event.ENTER_FRAME);
	},
	
	/**
	 * 時間を取得する
	 * @memberOf Timer
	 * @function
	 * @returns {数値} 現在の時間（秒）
	 */
	getTime: function() {
		return (game.frame - this._baseFrame) / game.fps;
	}
});

/**
 * 数字入力ボタン
 * @class
 */
var NumberPad = Class.create(Group, {
	initialize: function() {
		Group.call(this);
		
		// ボタンの作成
		var buttons = [];
		for(var i = 0; i <= 9; i++) {
			buttons[i] = new Sprite(108, 108);
			buttons[i].image = game.assets['numbers.png'];
			buttons[i].frame = i;
			buttons[i].scaleX = 0.5;
			buttons[i].scaleY = 0.5;
			buttons[i].number = i;
			buttons[i].addEventListener(Event.TOUCH_START, function() {
				this.parentNode.parentNode.keydown(this.number);
			});
		}
		
		// 位置を調整 [行,列]
		buttons[0].position = [1, 3];
		buttons[1].position = [0, 2];
		buttons[2].position = [1, 2];
		buttons[3].position = [2, 2];
		buttons[4].position = [0, 1];
		buttons[5].position = [1, 1];
		buttons[6].position = [2, 1];
		buttons[7].position = [0, 0];
		buttons[8].position = [1, 0];
		buttons[9].position = [2, 0];
		for(var i = 0; i < 10; i++) {
			buttons[i].x = buttons[i].position[0] * 54;
			buttons[i].y = buttons[i].position[1] * 54;
		}
		
		// 画面に追加
		for(var i = 0; i < 10; i++) {
			this.addChild(buttons[i]);
		}
	}
});
