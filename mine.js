enchant();

var game;

/**
 * ゲーム全体の管理をするクラス
 * @class
 * @extends Core
 * @property {オブジェクト} config ゲームの設定オブジェクト
 */
var Game = Class.create(Core, {
	config: null,
	
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
			'giveup_button.png',
			'miss.mp3',
			'open.mp3',
			'start.mp3',
			'howto0.png',
			'howto1.png',
			'howto2.png',
			'home_button.png',
			'next_button.png',
			'back_button.png',
			'checkbox.png',
			'check.png',
			'ranking_background.png'
		];
		for(var i = 0; i < preloads.length; i++) {
			this.preload(preloads[i]);
		}
		
		// 設定の初期化
		this.config = {
			inputMethod: 'sequential'
		};
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
		game.assets['start.mp3'].play();
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
		var howtoScene = new HowtoScene();
		game.popScene();
		game.pushScene(howtoScene);
	},
	
	/**
	 * ランキングの表示
	 * @memberof Game
	 * @function
	 */
	showRanking: function() {
		var rankingScene = new RankingScene();
		game.popScene();
		game.pushScene(rankingScene);
	},
	
	/**
	 * サーバからランキングを取得する
	 * @memberOf Game
	 * @function
	 * @returns {オブジェクト} ランキングデータ
	 */
	 getRanking: function() {
	 	var ranking = [
			{name: 'okano', time: 5000},
			{name: 'okano', time: 5000},
			{name: 'okano', time: 5000},
			{name: 'okano', time: 5000},
			{name: 'okano', time: 5000},
			{name: 'okano', time: 5000},
			{name: 'okano', time: 5000},
			{name: 'okano', time: 5000},
			{name: 'okano', time: 5000},
			{name: 'okano', time: 5000},
		];
		
	 	
	 	return ranking;
	 }
});

/**
 * 汎用ボタンクラス
 * @class
 * @extends Sprite
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
