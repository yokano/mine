/**
 * タイトル画面
 * @class
 * @extends Scene
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
		var title = new Sprite(643, 431);
		title.image = game.assets['title.png'];
		title.x = 70;
		title.y = 30;
		this.addChild(title);
		
		// スタートボタンを表示
		var startButton = new Button('start', game.startGame, 309, 101);
		startButton.x = 30;
		startButton.y = 470;
		this.addChild(startButton);
		
		// あそびかたボタンを表示
		var howtoButton = new Button('howto', game.showHowto, 242, 101);
		howtoButton.x = 310;
		howtoButton.y = 470;
		this.addChild(howtoButton);
		
		// ランキングボタンを表示
		var rankingButton = new Button('ranking', game.showRanking, 234, 98);
		rankingButton.x = 530;
		rankingButton.y = 470;
		this.addChild(rankingButton);
		
		$(window).bind('keydown', function() {
			$('#enchant-stage').css('width', '100%').css('height', '100%');
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
