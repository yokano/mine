/**
 * ランキング画面
 * @class
 * @extends Scene
 */
var RankingScene = Class.create(Scene, {
	initialize: function() {
		Scene.call(this);
		
		// 背景を追加
		var background = new Sprite(game.width, game.height);
		background.image = game.assets['background.png'];
		this.addChild(background);
		
		// ランキング表示部分の背景を追加
		var background = new Sprite(386, 557);
		background.x = 20;
		background.y = 20;
		background.image = game.assets['ranking_background.png'];
		this.addChild(background);
		
		// ランキングを表示する
		var ranking = game.getRanking();
		console.log(ranking);
		for(var i = 0; i < ranking.length; i++) {
			var name = new Label();
			var termination = '';
			if(i + 1 == 1) {
				termination = 'st';
			} else if(i + 1 == 2) {
				termination = 'nd';
			} else if(i + 1 == 3) {
				termination = 'rd';
			} else {
				termination = 'th';
			}
			name.text = (i + 1) + termination + ': ' + ranking[i].name + ' ' + ranking[i].time;
			name.font = 'xx-large cursive';
			name.color = (i % 2 == 0) ? '#000000' : '#880000';
			name.x = 50;
			name.y = 60 + 50 * i;
			this.addChild(name);
		}
		
		// タップしたらタイトルへ戻る
		this.addEventListener(Event.TOUCH_START, function() {
			game.returnTitle();
		});
	}
});