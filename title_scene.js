/**
 * タイトル画面
 * @class
 * @extend Scene
 */
var TitleScene = Class.create(Scene, {
	initialize: function() {
		Scene.call(this);
	},
	
	/**
	 * シーン開始直後の処理
	 * @memberOf TitleScene
	 * @function
	 */
	onenter: function() {
		// 背景を表示
		var background = new Sprite(game.width, game.height);
		background.image = game.assets['background.png'];
		this.addChild(background);
		
		// タイトルロゴを表示
		var title = new Sprite(609, 313);
		title.image = game.assets['title.png'];
		title.x = 100;
		title.y = 50;
		this.addChild(title);
		
		// スタートボタンを表示
		var startButton = new Button('start', game.startGame, 309, 101);
		startButton.x = 30;
		startButton.y = 430;
		this.addChild(startButton);
		
		// あそびかたボタンを表示
		var howtoButton = new Button('howto', game.showHowto, 183, 101);
		howtoButton.x = 330;
		howtoButton.y = 430;
		this.addChild(howtoButton);
		
		// ランキングボタンを表示
		var rankingButton = new Button('ranking', game.showRanking, 222, 107);
		rankingButton.x = 530;
		rankingButton.y = 425;
		this.addChild(rankingButton);
		
		// 点滅するメッセージを表示
		var message = new Label();
		message.x = 250;
		message.y = 380;
		message.width = 500;
		message.font = '30px serif';
		message.color = 'white';
		message.text = 'Press any key to start';
		message.tl.fadeOut(40).fadeIn(20).loop();
		this.addChild(message);
		
		// スペースキーを押したらゲーム開始
		$(window).keydown(function(e) {
			game.startGame();
		});
	},
	
	/**
	 * シーン終了直前の処理
	 * @memberOf TitleScene
	 * @function
	 */
	onexit: function() {
		// キーイベントの解除
		$(window).unbind('keydown');
	}
});

/**
 * ボタンクラス
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