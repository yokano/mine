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
		
		// ランキングのラベル
		var label = new Label();
		label.text = 'ランキング';
		label.x = 40;
		label.y = 45;
		label.font = 'large sans-serif';
		this.addChild(label);
		
		// ランキングを表示する
		var ranking = game.getRanking();
		for(var i = 0; i < ranking.length; i++) {
		
			// 順位
			var rank = new Label();
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
			rank.text = (i + 1) + termination;
			rank.font = 'x-large serif';
			rank.color = '#006600';
			rank.x = 50;
			rank.y = 80 + 50 * i;
			this.addChild(rank);

			// プレイヤー名
			var name = new Label();
			name.text = ranking[i].name;
			name.font = 'x-large cursive';
			name.width = 150;
			name.color = (i % 2 == 0) ? '#000000' : '#880000';
			name.x = 120;
			name.y = 70 + 50 * i;
			this.addChild(name);
			
			// クリアタイム
			var time = new Label();
			time.text = ranking[i].time;
			time.font = 'xx-large cursive';
			time.color = (i % 2 == 0) ? '#000000' : '#880000';
			time.x = 300;
			time.y = 60 + 50 * i;
			this.addChild(time);
		}
		
		// タップしたらタイトルへ戻る
		this.addEventListener(Event.TOUCH_START, function() {
			game.returnTitle();
		});
	}
});