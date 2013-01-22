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
				if(pos.x >= size.x - 1 && pos.y >= size.y - 1) {
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
		alert('ゲームが終了したのでタイトル画面へ戻ります');
		game.returnTitle();
	}
});

/**
 * ゲームボードを表すクラス
 * @class
 * @property {数値} _width マス目の幅
 * @property {数値} _height マス目の行数
 * @porperty {配列} _cells マス目の配列
 * @property {Cursorオブジェクト} _cursor カーソル
 * @see Cell
 */
var Board = Class.create(Group, {
	_width: 5,
	_height: 5,
	_cells: [],
	_cursor: null,
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
	},
	
	/**
	 * ボードの大きさを取得する
	 * @memberOf Board
	 * @function
	 * @returns {オブジェクト} 座標を含むオブジェクト{x:X座標の数値, y:Y座標の数値}
	 */
	getSize: function() {
		return {x: this._width, y: this._height};
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
	 * 数字を画面に表示する
	 * @function
	 * @memberOf Cell
	 */
	 showAnswer: function() {
		this.frame = this.answer;
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
			return (position.x >= size.x - 1 && position.y >= size.y - 1);
		};
		
		// カーソルが外にはみ出したらエラー
		if(isLast(this._position)) {
			throw new Error('カーソルがボードの外に出ようとしています');
		}
		
		// 座標の更新
		this._position.x += 1;
		if(this._position.x >= size.x) {
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
		var time = ( (game.frame - this._baseFrame) / game.fps);
		var s = Math.floor(time);
		var ms = Math.floor((time - s) * 100);
		var sZero = (s < 10) ? '0' : '';
		var msZero = (ms < 10) ? '0' : '';
		this.text = sZero + s + ':' + msZero + ms;
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
	}
});


