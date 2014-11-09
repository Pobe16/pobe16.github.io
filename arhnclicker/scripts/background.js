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

	//shortcut for creating DOM elements with class
	insert: function(tag, clas){
		var html = document.createElement(tag);
		if (clas){
			html.className = clas;	
		}
		return html;
	}
	}, 

	clicker = {
	loops: 0,
	stats: {},

	create_stats: function () {
		if (a.ls_service('get') === 1) {
			a.ls_service('set', this.zero_save);
			this.stats = this.zero_save;
		} else {
			this.stats = a.ls_service('get');
		}
	},

	dinary_refresh: function() {
		var dinary = Math.floor(this.stats.dinary),
			place = a.gebi('dinar-count'),
			desc = a.gebi('count-description'),
			dps = a.gebi('dps');

		place.textContent = dinary;
		
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
		dps.textContent = this.stats.dps;
	},

	building_list_refresh: function () {
		var bank = this.stats.dinary,
			all = this.stats.all_made,
			i = 0;
		for (i; i<10; i++) {
			var b = this.buildings.list[i],
				count = a.gebi('building-count-' + i),
				how_many = this.stats.buildings[i],
				button = a.gebi('building-'+i),
				price = a.gebi('building-price-'+i),
				base_price = this.buildings[b].base_cost,
				current_price = Math.round(this.buildings[b].base_cost * (Math.pow(1.15, how_many)));
			price.textContent = Math.round(current_price);
			
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

	add_events: function() {
		var big_dinar = a.gebi('big-dinar'),
			buy_buttons = a.gebcn('building-body'),
			buy_10_buttons = a.gebcn('buy-10'),
			sell_buttons = a.gebcn('sell'),
			sell_all_buttons = a.gebcn('sell_all');

		big_dinar.addEventListener('click', function() {
			clicker.add_handmade_dinary();
		});

		buy_buttons.forEach(this.buy_building_event);
		//buy_10_buttons.forEach(this.buy_10_building_event);
		//sell_buttons.forEach(this.sell_building_event);
		//sell_all_buttons.forEach(this.sell_all_building_event);
	},

	refresh_dps: function () {
		var new_dps = 0,
			i = 0;
		for (i; i<10; i++) {
			var building_dps = this.buildings[this.buildings.list[i]].base_dps;
			new_dps += this.stats.buildings[i]*building_dps;
		}
		this.stats.dps = Math.round(new_dps*10)/10;

	},

	buy_building_event: function(element, index) {
		element.addEventListener('click', function () {
			clicker.buy_building(index);
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
		this.loops++;
		this.check_loops();
		window.setTimeout(function() {
			clicker.the_main_loop();
		}, 1000/this.stats.fps);
	},

	beginning : function(){
		a.start_ls();
		this.create_stats();
		this.refresh_all();
		this.add_events();
		this.the_main_loop();
	},

};