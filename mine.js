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
			'howto_button.png'
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
	}
});

window.onload = function() {
	game = new Game(800, 600);
	game.start();
};
