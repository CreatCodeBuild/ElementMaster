/*
 *  Best Practice: 
 *  Dom manipulation should only be present in directives
 */ 

'use strict'

var elementMasterDirectives = angular.module('elementMasterDirectives', []);

const EVENT = {

}

/*
 *  Directives
 */
elementMasterDirectives.directive('elementMasterCanvas', function() {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'partials/ElementMasterCanvas.html',
		link: function(scope, element, attrs) {
			console.log('directive: elementMasterCanvas');
			Game.init();
			Game.run();
		}
	};
});

//used as a static factory
var ElementPool = {
	construct: function(x, y, radius) {
		var shape = new createjs.Shape();
		shape.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, radius);
		shape.x = x;
		shape.y = y;
		return shape;
	},

	logPosition: function(elementPool) {
		console.log('element pool x: '+elementPool.x+' y:'+elementPool.y);
	}
}

//used as a static factory
var Proton = {
	logPosition: function(proton) {
		console.log('Proton x: '+proton.x+' y:'+proton.y);
	},

	construct: function(x, y, radius) {
		var proton = new createjs.Shape();
		proton.graphics.beginFill(createjs.Graphics.getRGB(200,200,0));
		proton.graphics.drawCircle(0, 0, radius);
		proton.x = x;
		proton.y = y;
		return proton;
	},

	click: function(evt) {
		//Proton.logPosition(evt.target);
	    Animator.moveToElementPool(evt.target);
	    Game.updateGameState(1, 0, 0);
	}
}

//used as a static factory
var Neutron = {
	logPosition: function(neutron) {
		console.log('Neutron x: '+neutron.x+' y:'+neutron.y);
	},

	construct: function(x, y, radius) {
		var neutron = new createjs.Shape();
		neutron.graphics.beginFill(createjs.Graphics.getRGB(0,200,200));
		neutron.graphics.drawCircle(0, 0, radius);
		neutron.x = x;
		neutron.y = y;
		return neutron;
	},

	click: function(evt) {
		//Neutron.logPosition(evt.target);
	    Animator.moveToElementPool(evt.target);
	    Game.updateGameState(0, 1, 0);
	}
}

//used as a static factory
var Electron = {
	logPosition: function(electron) {
		console.log('Electron x: '+electron.x+' y:'+electron.y);
	},

	construct: function(x, y, radius) {
		var electron = new createjs.Shape();
		electron.graphics.beginFill(createjs.Graphics.getRGB(200,0,200));
		electron.graphics.drawCircle(0, 0, radius);
		electron.x = x;
		electron.y = y;
		return electron;
	},

	click: function(evt) {
		//Electron.logPosition(evt.target);
	    Animator.moveToElementPool(evt.target);
	    Game.updateGameState(0, 0, 1);
	}
}

//used as a static singleton
var Animator = {
	init: function(elementPool, stage) {
		console.log('Animator.init()');
		this.elementPool = elementPool;
		this.stage = stage;
	},

	moveToElementPool: function(particle) {
		console.log('Animator.moveToElementPool()');
		createjs.Tween.get(particle, {loop: false})
			.to({
					x: this.elementPool.x, 
					y: this.elementPool.y
				}, 
				400)
			.call(function() {
				this.stage.removeChild(particle);
				Game.checkGameState();
			});
		ElementPool.logPosition(this.elementPool);
		createjs.Ticker.setFPS(60);
		createjs.Ticker.addEventListener("tick", this.stage);
	},
}

//used as static singleton
var Game = {
	init: function() {
		this.currentLevel = 0;
		this.levels = [
			{
				target: {
					name: 'Hydrogen',
					protonNumber: 1,
					neutronNumber: 0,
					electronNumber: 1
				},
				given: {
					proton: 1,
					neutron: 0,
					electron: 1
				}
			},
			{
				target: {
					name: 'Helium',
					protonNumber: 2,
					neutronNumber: 2,
					electronNumber: 2
				},
				given: {
					proton: 2,
					neutron: 2,
					electron: 2
				}
			}
		];
	},

	run: function() {
		var stage = new createjs.Stage("canvas");
		var elementPool = ElementPool.construct(400, 250, 150);
		stage.addChild(elementPool);
		Animator.init(elementPool, stage);
		this.initLevel();
	},

	initLevel: function() {
		console.log('Game.initLevel('+this.currentLevel+')');
		//refresh current state
		this.currentState = {
			protonNumber: 0,
			neutronNumber: 0,
			electronNumber: 0
		};

		//get current level
		var level = this.levels[this.currentLevel];

		//draw target name
		Animator.stage.removeChild(Animator.targetText);
		var targetText = level.target.name;
		var text = new createjs.Text(targetText, "20px Arial", "#ff7700");
		text.x = 363;
		text.y = 50;
		text.textBaseline = "alphabetic";
		Animator.stage.addChild(text);
		Animator.targetText = text;

		//find out the number of total given particles
		var given = level.given;
		var numberOfParticles = given.proton + given.neutron + given.electron;
		var spaceMargin = 800/(numberOfParticles+1);
		console.log(spaceMargin);
		var particleCount = 0;
		
		//init protons
		for(var i = 0; i < given.proton; i++) {
			particleCount++;
			var proton = Proton.construct(spaceMargin*particleCount, 525, 25);
			proton.on('click', Proton.click);
			Animator.stage.addChild(proton);
		}

		//init neutrons
		for(var i = 0; i < given.neutron; i++) {
			particleCount++;
			var neutron = Neutron.construct(spaceMargin*particleCount, 525, 25);
			neutron.on('click', Neutron.click);
			Animator.stage.addChild(neutron);
		}

		//init electrons
		for(var i = 0; i < given.electron; i++) {
			particleCount++;
			var electron = Electron.construct(spaceMargin*particleCount, 525, 25);
			electron.on('click', Electron.click);
			Animator.stage.addChild(electron);
		}

		Animator.stage.update();
	},

	goToNextLevel: function() {
		console.log('Game.goToNextLevel()');
		if(this.currentLevel < this.levels.length-1) {
			this.currentLevel++;
			this.initLevel();
		} else {
			console.log(' Congradulations! You have already reached the last level.');
		}
	},

	isLevelCompleted: function() {
		console.log('Game.isLevelCompleted()');
		var target = this.levels[this.currentLevel].target;
		var currentState = this.currentState;
		if(
			currentState.protonNumber === target.protonNumber &&
			currentState.neutronNumber === target.neutronNumber &&
			currentState.electronNumber === target.electronNumber
		) {
			return true;
		} else {
			return false;
		}
	},

	updateGameState: function(proton, neutron, electron) {
		console.log('Game.updateGameState()');
		this.currentState.protonNumber += proton;
		this.currentState.neutronNumber += neutron;
		this.currentState.electronNumber += electron;
	},

	checkGameState: function() {
		console.log('Game.checkGameState()');
		if(Game.isLevelCompleted()) {
			Game.goToNextLevel();
		}
	}
}
