enchant();

var game;

/**
 * ゲーム全体の管理をするクラス
 * @class
 * @extend Core
 */
var Game = Class.create(Core, {
	/**
	 * ゲームの初期化
	 * @memberOf Game
	 * @function
	 */
	initialize: function(width, height) {
		Core.call(this, width, height);

		// リソースのプリロード
		var preloads = [
			'cell.png',
			'cursor.png',
			'bomb.png',
			'numbers.png',
			'background.png',
			'title.png',
			'start_button.png',
			'ranking_button.png',
			'howto_button.png',
			'giveup_button.png'
		];
		for(var i = 0; i < preloads.length; i++) {
			this.preload(preloads[i]);
		}
	},
	
	/**
	 * ゲーム開始直後の処理
	 * @memberOf Game
	 * @function
	 */
	onload: function() {
		var titleScene = new TitleScene();
		this.pushScene(titleScene);
	},
	
	/**
	 * ゲーム開始画面へ移動
	 * @memberOf Game
	 * @function
	 */
	startGame: function() {
		var gameScene = new GameScene();
		game.popScene();
		game.pushScene(gameScene);
	},
	
	/**
	 * タイトル画面へ移動
	 * @memberOf Game
	 * @function
	 */
	returnTitle: function() {
		var titleScene = new TitleScene();
		game.popScene();
		game.pushScene(titleScene);
	},
	
	/**
	 * 遊び方の表示
	 * @memberOf Game
	 * @function
	 */
	showHowto: function() {
	
	},
	
	/**
	 * ランキングの表示
	 * @memberof Game
	 * @function
	 */
	showRanking: function() {
	
	}
});

/**
 * 汎用ボタンクラス
 * @class
 * @extend Sprite
 * @param {文字列} name ボタンを表す名前(start, howto, ranking のいずれか)
 * @param {関数} action ボタンが押された時に実行する関数
 * @param {数値} width ボタンの幅
 * @param {数値} height ボタンの高さ
 */
var Button = Class.create(Sprite, {
	initialize: function(name, action, width, height) {
		Sprite.call(this, width, height);
		this.image = game.assets[name + '_button.png'];
		this.addEventListener(Event.TOUCH_START, action);
	}
});

window.onload = function() {
	game = new Game(800, 600);
	game.start();
};
