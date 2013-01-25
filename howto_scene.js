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
		this._pages.push(new Page(0, 'home', 'next', false));
		this._pages.push(new Page(1, 'back', 'next', true));
		this._pages.push(new Page(2, 'back', 'home', true));
		
		// ページを表示
		this.addChild(this._pages[2]);
		this.addChild(this._pages[1]);
		this.addChild(this._pages[0]);
		
		// 矢印キーでページめくり
		this.addEventListener(Event.RIGHT_BUTTON_DOWN, this.next);
		this.addEventListener(Event.LEFT_BUTTON_DOWN, this.back);
		this.addEventListener(Event.UP_BUTTON_DOWN, this.title);
	},
	
	/**
	 * チェックボックスがチェックされたら他のページのチェックをすべて外す
	 * @function
	 * @memberOf HowtoScene
	 */
	updateCheckboxes: function() {
		for(var i = 0; i < this._pages.length; i++) {
			var page = this._pages[i];
			if(page._checkbox != null && page._checkbox._mode != game.config.inputMethod) {
				page._checkbox.uncheck();
			}
		}
	}
});

/**
 * 遊び方のページ
 * @class
 * @extends Group
 * @param {数値} number ページ番号
 * @param {文字列} leftButton 左側に表示するボタンの種類
 * @param {文字列} rightButton 右側に表示するボタンの種類
 * @param {真理値} checkboxEnabled Trueならチェックボックスを表示する
 * @property {オブジェクト} _buttons ボタンが入っているオブジェクト。_buttons[kind]で参照する。kind = next/back/home。
 * @property {Checkboxオブジェクト} _checkbox チェックボックスオブジェクト。ページ内になければnull。
 */
var Page = Class.create(Group, {
	_buttons: null,
	_checkbox: null,
	
	// コンストラクタ
	initialize: function(number, leftButton, rightButton, checkboxEnabled) {
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
		
		// チェックボックスを追加
		if(checkboxEnabled) {
			var mode = '';
			if(number == 1) {
				mode = 'sequential';
			} else {
				mode = 'parallel';
			}
			this._checkbox = new Checkbox(mode);
			this.addChild(this._checkbox);
		}
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

/**
 * チェックボックスクラス
 * @class
 * @extends Group
 * @param {文字列} mode チェックすることで有効化するモード名 game.config.inputMethod = 'モード名'
 * @property {文字列} _mode モード名
 */
var Checkbox = Class.create(Group, {
	_mode: '',
	_checkmark: null,
	
	// コンストラクタ
	initialize: function(mode) {
		Group.call(this);
		this._mode = mode;
		this.x = 720;
		this.y = 120;
		
		// チェックボックス作成
		var box = new Sprite(53, 53);
		box.image = game.assets['checkbox.png'];
		box.addEventListener(Event.TOUCH_START, function() {
			this.parentNode.check();
		});
		this.addChild(box);
		
		// 設定済みの項目にチェックを付ける
		if(game.config.inputMethod == mode) {
			this.check();
		}
	},
	
	/**
	 * チェックボックスにチェックを入れて設定項目を変える
	 * @function
	 * @memberOf Checkbox
	 */
	check: function() {
		game.config.inputMethod = this._mode;
		
		var checkmark = new Sprite(86, 75);
		checkmark.x = -10;
		checkmark.y = -20;
		checkmark.image = game.assets['check.png'];
		checkmark.addEventListener(Event.TOUCH_START, function() {
			this.parentNode.uncheck();
		});
		this.addChild(checkmark);
		this._checkmark = checkmark;
		
		// 他のページのチェックボックスを外す
		if(this.parentNode != null) {
			this.parentNode.parentNode.updateCheckboxes();
		}
	},
	
	/**
	 * チェックボックスのチェックを外す
	 * @function
	 * @memberOf Checkbox
	 */
	uncheck: function() {
		this.removeChild(this._checkmark);
		this._checkmark = null;
	}
});