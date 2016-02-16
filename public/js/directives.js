/*
 *  Best Practice: 
 *  Dom manipulation should only be present in directives
 */ 

'use strict'

var elementMasterDirectives = angular.module('elementMasterDirectives', []);

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
var MagicalPoint = {
	construct: function(x, y, radius) {
		var shape = new createjs.Shape();
		shape.graphics.beginFill(createjs.Graphics.getRGB(0,0,0));
		shape.graphics.drawCircle(0, 0, radius);
		shape.x = x;
		shape.y = y;
		return shape;
	},

	constructElectron: function(x, y, radius) {
		var shape = new createjs.Shape();
		shape.graphics.beginFill(createjs.Graphics.getRGB(200,0,200));
		shape.graphics.drawCircle(0, 0, radius);
		shape.x = x;
		shape.y = y;
		return shape;
	},

	constructNucleus: function(x, y, radius) {
		var shape = new createjs.Shape();
		shape.graphics.beginFill(createjs.Graphics.getRGB(0,255,255));
		shape.graphics.drawCircle(0, 0, radius);
		shape.x = x;
		shape.y = y;
		return shape;
	},

	onKeyBoard: function(event) {
		var KEYCODE_LEFT = 37, 
			KEYCODE_RIGHT = 39,
			KEYCODE_UP = 38, 
			KEYCODE_DOWN = 40;

		console.log(Animator.direction);
		switch(event.keyCode) {
			case KEYCODE_LEFT:	
				//gotten.to({x: shape.x-distance}, time);
				Animator.direction.x -= 1;
				break;
			case KEYCODE_RIGHT: 
				//gotten.to({x: shape.x+distance}, time);
				Animator.direction.x += 1;
				break;
			case KEYCODE_UP: 
				// gotten.to({y: shape.y-distance}, time);
				Animator.direction.y -= 1;
				break;
			case KEYCODE_DOWN: 
				// gotten.to({y: shape.y+distance}, time);
				Animator.direction.y += 1;
				break;
		}
	}
}

//used as a static singleton
var Animator = {
	init: function(stage) {
		console.log('Animator.init()');
		this.stage = stage;
		this.userPoint = undefined;
		this.electrons = undefined;
		this.nucleus = undefined;
		Animator.direction = {x: 0, y:0};
	},

	findPosition: function(center, radius, xth, totalNumber) {
		let radian = Math.PI*2/totalNumber * xth;
		let cos = Math.cos(radian);
		let sin = Math.sin(radian);
		console.log(cos, sin);
		let x = radius * cos + center.x;
		let y = radius * sin + center.y;
		console.log(x, y);
		return {
			x: x,
			y: y
		};
	},

	moveUserPoint: function() {
		
		if(this.userPoint.x > 800) {
			this.userPoint.x = 0;
		}
		if(this.userPoint.x < 0) {
			this.userPoint.x = 800;
		}
		if(this.userPoint.y > 600) {
			this.userPoint.y = 0;
		}
		if(this.userPoint.y < 0) {
			this.userPoint.y = 600;
		}
		this.userPoint.x += Animator.direction.x;
		this.userPoint.y += Animator.direction.y;
	},

	/*
		electron: Shape
		nucleus: Shape
		distance: number, angular distance in radians
		time: number
	*/
	orbiting: function(electron, nucleus, distance) {
		console.log('Animator.orbiting()');
		let radius = Math.sqrt( 
			(nucleus.x-electron.x)*(nucleus.x-electron.x) +
			(nucleus.y-electron.y)*(nucleus.y-electron.y));

		let x1 = electron.x - nucleus.x;
		let y1 = electron.y - nucleus.y;
		
		let cos1 = x1/radius;
		let sin1 = y1/radius;
		let radian = Math.acos(cos1);
		if(y1 < 0) {
			radian += Math.PI;
		}

		createjs.Ticker.addEventListener("tick", function() {
			//bring the whole coordinates down to 0 centered
			radian += distance;

			let cos2 = Math.cos(radian);
			let sin2 = Math.sin(radian);

			let x2 = radius*cos2;
			let y2 = radius*sin2;

			electron.x = x2 + nucleus.x;
			electron.y = y2 + nucleus.y;

			Animator.stage.update();
		});
	},

	collisionDetection: function(shape, otherShapes) {
		otherShapes.forEach(function(item, index, array) {
			if(Animator.isCollided(shape, item)) {
				Game.handleCollision();
			}
		});
	},

	//both shape1 and shape2 have to be circles
	isCollided: function(shape1, shape2) {
		let r1 = shape1.graphics.command.radius;
		let r2 = shape2.graphics.command.radius;

		let x1 = shape1.x;
		let y1 = shape1.y;
		let x2 = shape2.x;
		let y2 = shape2.y;

		let distance = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));

		if(distance < (r1+r2)) {
			console.log(x1, y1);
			console.log(x2, y2);
			return true;
		} else {
			return false;
		}
	}
}

//used as static singleton
var Game = {
	init: function() {
		this.currentLevel = 0;
		this.levels = [
			{
				name: 'Hydrogen',
				electron: [1]
			},
			{
				name: 'Helium',
				electron: [2]
			},
			{
				name: 'Lithium',
				electron: [2,1]
			},
			{
				name: 'Beryllium',
				electron: [2,2]
			},
			{
				name: 'Baron',
				electron: [2,3]
			},
			{
				name: 'Carbon',
				electron: [2,4]
			},
			{
				name: 'Nitrogen',
				electron: [2,5]
			},
			{
				name: 'Carbon',
				electron: [2,6]
			},
			{
				name: 'Nitrogen',
				electron: [2,7]
			},
			{
				name: 'Nitrogen',
				electron: [2,8]
			}
		];
		this.startPos = {
			x: 400,
			y: 550,
			size: 10
		}
		this.nucleusPos = {
			x: 400,
			y: 250,
			size: 25
		}
	},

	run: function() {
		var stage = new createjs.Stage("canvas");
		Animator.init(stage);
		Game.currentLevel = 4;
		this.initLevel(4);
	},

	initLevel: function(level) {
		console.log('Game.initLevel('+this.currentLevel+')');

		Animator.userPoint = undefined;
		Animator.electrons = undefined;
		Animator.nucleus = undefined;
		Animator.direction = {x: 0, y:0};

		// createjs.Ticker.removeAllEventListeners();
		createjs.Tween.removeAllTweens();
		Animator.stage.removeAllChildren();

		//get current level
		var level = this.levels[level];

		//draw target name
		var targetText = level.name;
		var text = new createjs.Text(targetText, "20px Arial", "#ff7700");
		text.x = 363;
		text.y = 50;
		text.textBaseline = "alphabetic";
		Animator.stage.addChild(text);
		Animator.targetText = text;

		//init nucleus
		Animator.nucleus = MagicalPoint.constructNucleus(this.nucleusPos.x, this.nucleusPos.y, this.nucleusPos.size);
		Animator.stage.addChild(Animator.nucleus);

		var numberOfOrbits = level.electron.length;		
		Animator.electrons = [];
		//init electrons
		for(var i = 0; i < numberOfOrbits; i++) {
			var electronsPerOrbit = level.electron[i];
			var nthOrbit = i+1;
			var radius = nthOrbit*50;
			for(var j = 0; j < electronsPerOrbit; j++) {
				var pos = Animator.findPosition(Animator.nucleus, radius, j, electronsPerOrbit);
				var electron = MagicalPoint.constructElectron(pos.x, pos.y, 5);
				//console.log(pos.x, pos.y);
				Animator.orbiting(electron, Animator.nucleus, nthOrbit*0.06/(nthOrbit*2-1));
				Animator.stage.addChild(electron);
				Animator.electrons.push(electron);
			}
		}

		//the point gamer controls
		Animator.userPoint = MagicalPoint.construct(this.startPos.x, this.startPos.y, this.startPos.size);
		Animator.stage.addChild(Animator.userPoint);
		document.onkeydown = MagicalPoint.onKeyBoard;

		Animator.stage.update();
		//register animation events
		createjs.Ticker.setFPS(30);
		createjs.Ticker.addEventListener("tick", function() {
			Animator.moveUserPoint();
			Animator.collisionDetection(Animator.userPoint, Animator.electrons);
			Game.checkGameState();
		});
		createjs.Ticker.addEventListener("tick", Animator.stage);
	},

	goToNextLevel: function() {
		console.log('Game.goToNextLevel()');
		if(this.currentLevel < this.levels.length-1) {
			this.currentLevel++;
			this.initLevel(this.currentLevel);
		} else {
			//finished the game
			createjs.Ticker.removeAllEventListeners();
			createjs.Tween.removeAllTweens();
			var text = new createjs.Text("Congradulations! Last Level 达成！", "40px Arial", "000000");
			text.x = 140;
			text.y = 200;
			text.textBaseline = "alphabetic";
			Animator.stage.addChild(text);
		}
	},

	isLevelCompleted: function() {
		//console.log('Game.isLevelCompleted()');
		if(Animator.isCollided(Animator.nucleus, Animator.userPoint)) {
			return true;
		} else {
			return false;
		}
	},

	checkGameState: function() {
		//console.log('Game.checkGameState()');
		if(Game.isLevelCompleted()) {
			Game.goToNextLevel();
		}
	},

	handleCollision: function() {
		console.log('Game.handleCollision()');
		createjs.Ticker.removeAllEventListeners();
		createjs.Tween.removeAllTweens();
		var text = new createjs.Text("You Died", "40px Arial", "000000");
		text.x = 200;
		text.y = 200;
		text.textBaseline = "alphabetic";
		Animator.stage.addChild(text);
	}
}
