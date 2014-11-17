'use strict';
var	a = {
	gebi: function (id) {
		return document.getElementById(id);
	},
	//shortcut for the normalization of array-like elements
	gebcn: function (clas) {
		var dom = document.getElementsByClassName(clas);
		return Array.prototype.slice.call(dom);
	},
	//checks if the localStorage is initialised, do so if not
	start_ls: function() {
		if (!localStorage.hasOwnProperty('arhn_clicker')){
			this.ls_service('set', 1);
		}
	},
	//all about local storage
	ls_service: function (what_to_do, value) {
	
		if (what_to_do === 'get') {
			return JSON.parse(localStorage.getItem( 'arhn_clicker'));
		} else if (what_to_do === 'set') {
			var setValue = JSON.stringify(value);
			localStorage.setItem( 'arhn_clicker', setValue);
		}
	},

	beautify: function (value) {
		var words = {
			3: '',
			6: ' milionów',
			9: ' miliardów',
			12: ' bilionów',
			15: ' biliardów',
			18: ' trylionów',
			21: ' tryliardów',
			24: ' kwadrylionów',
			27: ' kwadryliardów',
			30: ' kwintylionów',
			33: ' kwintyliardów'
			},
			counter = 1;

		if ( value > 999999 ) {
			do {
				value = value / 1000;
				counter++;
			} 
			while ( (value / 1000) > 999 );

			value = Math.round(value) / 1000;
		}
		return value + words[counter * 3];
	},

	//shortcut for creating DOM elements with class
	insert: function(tag, clas){
		var html = document.createElement(tag);
		if (clas){
			html.className = clas;	
		}
		return html;
	},
	
	handle_visibility_change: function () {
  		if (document.hidden) {
  			clicker.moved_to_background();
  		} else  {
  			clicker.moved_to_front();
  		}
	}
}, 

	clicker = {
	loops: 0,
	stats: {},

	create_stats: function () {
		var game_state = a.ls_service('get');
		if (game_state === 1) {
			a.ls_service('set', this.zero_save);
			this.stats = this.zero_save;
		} else {
			if ( game_state.buildings.length < 11 ) {
				game_state.buildings[10] = 0;
			}
			this.stats = game_state;
		}
	},

	dinary_refresh: function() {
		var dinary = Math.floor(this.stats.dinary),
			place = a.gebi('dinar-count'),
			desc = a.gebi('count-description'),
			dps = a.gebi('dps');

		place.textContent = a.beautify(dinary);
		
		if (dinary < 1000) {
			if (dinary === 1) {
				desc.textContent = 'Đinar';
			} else if ( ( dinary % 100 > 10 ) && ( dinary % 100 < 15 ) ) {
				desc.textContent = 'Đinarów';
			} else {
				if ( ( dinary % 10 > 1 ) && ( dinary % 10 < 5 ) ) {
					desc.textContent = 'Đinary';
				} else {
					desc.textContent = 'Đinarów';
				}
			}
		} else {
			desc.textContent = 'Đinarów';
		}
		dps.textContent = a.beautify(this.stats.dps);
	},

	building_list_refresh: function () {
		var bank = this.stats.dinary,
			all = this.stats.all_made,
			i = 0;
		for (i; i<11; i++) {
			var b = this.buildings.list[i],
				count = a.gebi('building-count-' + i),
				how_many = this.stats.buildings[i],
				button = a.gebi('building-'+i),
				price = a.gebi('building-price-'+i),
				base_price = this.buildings[b].base_cost,
				current_price = Math.round(this.buildings[b].base_cost * (Math.pow(1.15, how_many)));
			price.textContent = a.beautify(Math.round(current_price));
			
			if (how_many === 0) {
				count.textContent = ''; 
			} else {
				count.textContent = how_many; 
			}

			if (bank < current_price) {
				button.classList.add('no-money');
			} else {
				button.classList.remove('no-money');
			}

			if (all < base_price) {
				button.classList.add('mystery');
			} else {
				button.classList.remove('mystery');
			}

			if (i > 1) {
				if (all < this.buildings[this.buildings.list[i-2]].base_cost) {
					button.classList.add('unknown');
				} else {
					button.classList.remove('unknown');
				}
			}
		}
	},

	refresh_all: function () {
		this.refresh_dps();
		this.building_list_refresh();
		this.dinary_refresh();
	},

	refresh_dps: function () {
		var new_dps = 0,
			i = 0;
		for (i; i<11; i++) {
			var building_dps = this.buildings[this.buildings.list[i]].base_dps;
			new_dps += this.stats.buildings[i]*building_dps;
		}
		this.stats.dps = Math.round(new_dps*10)/10;

	},

	add_events: function() {
		var big_dinar = a.gebi('big-dinar'),
			save = a.gebi('save'),
			buy_buttons = a.gebcn('building-body'),
			buy_10_buttons = a.gebcn('buy-10'),
			sell_buttons = a.gebcn('sell'),
			sell_all_buttons = a.gebcn('sell-all');

		big_dinar.addEventListener('click', function () {
			clicker.add_handmade_dinary();
		});

		save.addEventListener('click', function () {
			clicker.save_game();
		});

		buy_buttons.forEach(this.buy_building_event);
		buy_10_buttons.forEach(this.buy_10_buildings_event);
		sell_buttons.forEach(this.sell_building_event);
		sell_all_buttons.forEach(this.sell_all_buildings_event);
	},

	buy_building_event: function(element, index) {
		element.addEventListener('click', function () {
			clicker.buy_building(index);
			clicker.refresh_all();
		});
	},

	buy_10_buildings_event: function(element, index) {
		element.addEventListener('click', function () {
			clicker.buy_10_buildings(index);
			clicker.refresh_all();
		});
	},

	sell_building_event: function(element, index) {
		element.addEventListener('click', function () {
			clicker.sell_building(index);
			clicker.refresh_all();
		});
	},

	sell_all_buildings_event: function(element, index) {
		element.addEventListener('click', function () {
			clicker.sell_all_buildings(index);
			clicker.refresh_all();
		});
	},

	buy_building: function (id) {
		var price = Math.round(this.buildings[this.buildings.list[id]].base_cost * Math.pow(1.15, this.stats.buildings[id]));
		if (this.stats.dinary >= price) {
			this.stats.buildings[id]++;
			this.stats.dinary -= price;
			return true;	
		} else {
			return false;
		}
	},

	buy_10_buildings: function (id) {
		var i = 10,
			more = true;
		while (more && i > 0) {
			more = this.buy_building(id);
			i--;
		}
	},

	sell_building: function (id) {
		if (this.stats.buildings[id] > 0) {
			var money = (Math.round(this.buildings[this.buildings.list[id]].base_cost * Math.pow(1.15, this.stats.buildings[id])))/2;
			this.stats.buildings[id]--;
			this.stats.dinary += money;
			return true;
		} else {
			return false;
		}
	},

	sell_all_buildings: function (id) {
		var i = this.stats.buildings[id],
			more = true;
		while (more && i > 0) {
			more = this.sell_building(id);
			i--;
		}
	},

	add_handmade_dinary: function () {
		this.stats.dinary += this.stats.dpc;
		this.stats.all_made += this.stats.dpc;
		this.stats.clicked++;
		this.refresh_all();
	},

	generate_dinary: function() {
		var amount = this.stats.dps / this.stats.fps;
		this.stats.dinary += amount;
		this.stats.all_made += amount;
	},

	check_loops: function() {
		if (this.loops >= 60 * this.stats.fps) {
			this.save_game();
			this.loops = 0;
		}
	},

	save_game: function () {
		a.ls_service('set', this.stats);
	},

	the_main_loop: function() {
		this.generate_dinary();
		this.refresh_all();
		this.loops+= 30 / this.stats.fps;
		this.check_loops();
		this.timeoutID = window.setTimeout(function() {
			clicker.the_main_loop();
		}, 1000/this.stats.fps);
	},

	moved_to_background: function () {
		this.stats.fps = 1;
	},

	moved_to_front: function () {
		window.clearTimeout(this.timeoutID);
		this.stats.fps = 30;
		this.the_main_loop();
	},

	beginning : function(){
		a.start_ls();
		this.create_stats();
		this.refresh_all();
		this.add_events();
		this.the_main_loop();
	},

};