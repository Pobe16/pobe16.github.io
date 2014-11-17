'use strict';

clicker.buildings = {
	list: ['big_box', 'forum', 'teamspeak', 'unboxing', 'quick_look', 'review', 'live', 'nutshell', 'time_warp', 'system_error', 'gramytatywnie'],
	big_box: {
		name: 'Pudełko z grą',
		base_cost: 15,
		base_dps: 0.1,
		description: 'Co 10 sekund wytrząsasz z pudełka Đinara.'
	},
	forum: {
		name: 'Wątek na forum',
		base_cost: 100,
		base_dps: 0.5,
		description: 'Ludzie na forum przesyłają Ci Đinary.'
	},
	teamspeak: {
		name: 'Kanał TeamSpeaka',
		base_cost: 500,
		base_dps: 4,
		description: 'Na TeamSpeaku możesz prosić ludzi o Đinary.'
	},
	unboxing: {
		name: 'Rozpakowanie',
		base_cost: 3000,
		base_dps: 10,
		description: 'Rozpakowujesz kolejną grę, znajdujesz Đinary.'
	},
	quick_look: {
		name: 'Podgląd',
		base_cost: 10000,
		base_dps: 40,
		description: 'Nie są to może aż tak dopieszczone materiały jak recenzje, ale dzięki nim też wpada do kieszeni trochę Đinarów.'
	},
	review: {
		name: 'Recenzja',
		base_cost: 40000,
		base_dps: 100,
		description: 'Twoje recenzje są najwyższej klasy. Nawet sławni youtuberzy dają Ci Đinary.'
	},
	live: {
		name: 'Livestream',
		base_cost: 200000,
		base_dps: 400,
		description: 'Podczas live\'ów Twoi widzowie rzucają Đinarami w monitory. Oglądalność wzrasta.'
	},
	nutshell: {
		name: '… w pigułce',
		base_cost: 1666666,
		base_dps: 6666,
		description: 'Nowa seria „… w pigułce” przyciąga ogromną uwagę. Dostajesz Đinary od firm tworzących gry.'
	},
	time_warp: {
		name: 'Time Warp',
		base_cost: 123456789,
		base_dps: 98765,
		description: 'Producenci konsol chwalą przenikliwość serii Time Warp. I nawet przesyłają Ci Đinary.'
	},
	system_error: {
		name: 'System Error',
		base_cost: 4000000000,
		base_dps: 1000000,
		description: 'Kiedy System Error? Widzowie chcą jak najczęściej, więc dają Ci Đinary. Producenci chcą jak najrzadziej i też dają Ci Đinary.'
	},
	gramytatywnie: {
		name: 'Gramytatywnie',
		base_cost: 75000000000,
		base_dps: 10000000,
		description: 'Cały dochód pieniężny z Gramypomocnie zostanie przekazany na cele charytatywne. Resztę zamienimy na Đinary.'
	}
};

clicker.zero_save = {
	fps: 30,
	dinary: 0,
	dps: 0,
	dpc: 1,
	clicked: 0,
	handmade: 0,
	all_made: 0,
	buildings: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	upgrades: [],
	achievements: []
};
