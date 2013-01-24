/**
 * 遊び方のシーン
 * @class
 * @extends Scene
 * @property {数値} _current 現在のページ番号
 * @proeprty {Page配列} _pages ページオブジェクトの配列
 */
var HowtoScene = Class.create(Scene, {
	_current: 0,
	_pages: [],
	
	// コンストラクタ
	initialize: function() {
		Scene.call(this);
	},
	
	/**
	 * 次のページを表示
	 * @function
	 * @memberOf HowtoScene
	 */
	next: function() {
		if(this._current < this._pages.length - 1) {
			this._pages[this._current].slide(-1);
			this._current++;
		}
	},
	
	/**
	 * 前のページを表示
	 * @function
	 * @memberOf HowtoScene
	 */
	back: function() {
		if(this._current > 0) {
			this._current--;
			this._pages[this._current].slide(1);
		}
	},
	
	/*+
	 * タイトル画面に戻る
	 * @function
	 * @memberOf HowtoScene
	 */
	title: function() {
		game.returnTitle();
	},
	
	/**
	 * 画面に表示された時に実行される処理
	 * @function
	 * @memberOf HowtoScene
	 */
	onenter: function() {
		// ページリストの作成
		this._pages = [];
		this._pages.push(new Page(0, 'home', 'next'));
		this._pages.push(new Page(1, 'back', 'next'));
		this._pages.push(new Page(2, 'back', 'home'));
		
		// ページを表示
		this.addChild(this._pages[2]);
		this.addChild(this._pages[1]);
		this.addChild(this._pages[0]);
		
		// 矢印キーでページめくり
		this.addEventListener(Event.RIGHT_BUTTON_DOWN, this.next);
		this.addEventListener(Event.LEFT_BUTTON_DOWN, this.back);
		this.addEventListener(Event.UP_BUTTON_DOWN, this.title);
	}
});

/**
 * 遊び方のページ
 * @class
 * @extends Group
 * @param {数値} number ページ番号
 * @param {文字列} leftButton 左側に表示するボタンの種類。
 * @param {文字列} rightButton 右側に表示するボタンの種類。
 * @property {オブジェクト} _buttons ボタンが入っているオブジェクト。_buttons[kind]で参照する。kind = next/back/home。
 */
var Page = Class.create(Group, {
	_buttons: null,
	
	// コンストラクタ
	initialize: function(number, leftButton, rightButton) {
		Group.call(this);
		
		// 画像の設定
		var background = new Sprite(game.width, game.height);
		background.image = game.assets['howto' + number + '.png'];
		this.addChild(background);

		// ボタンの準備
		var self = this;
		this._buttons = {};
		this._buttons.next = new Button('next', function() {self.parentNode.next()}, 71, 66);
		this._buttons.back = new Button('back', function() {self.parentNode.back()}, 71, 70);
		this._buttons.home = new Button('home', function() {self.parentNode.title()}, 83, 82);
		
		// 左のボタンを追加
		this._buttons[leftButton].x = 25;
		this._buttons[leftButton].y = 490;
		this.addChild(this._buttons[leftButton]);
		
		// 右のボタンを追加
		this._buttons[rightButton].x = 700;
		this._buttons[rightButton].y = 490;
		this.addChild(this._buttons[rightButton]);
	},
	
	/**
	 * スライドする
	 * @function
	 * @memberOf Page
	 * @param {数値} direction 左にスライドするなら-1, 右にスライドするなら1
	 */
	slide: function(direction) {
		this.tl.moveBy(direction * game.width, 0, 6);
	}
});