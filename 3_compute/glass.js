// parts of this code were adopted from: http://jsbin.com/evodil/28/edit
var Glass = can.Control({
	defaults: {
  		base: 75,
  		top: 250,
  		height: 250
	}
}, {
	init: function(){
		this.canvas = this.element[0].getContext('2d');
		this.update();
	},
	getHeightForPercent: function(){
		
		var base = this.options.base,
			top = this.options.top,
			height= this.options.height,
			slope =  (top-base) / height,
			total = base * height + ( height * (top-base) / 2 );
			
		var percent = this.options.value();
			
		// setup quadratic
		var a = slope / 2,
			b = base,
			c = - total * percent;
		
	    return ( -b + Math.sqrt(  Math.pow(b,2) - 4 * a*c  ) ) / (2 *a )
	},
	update: function(){
		this.canvas.clearRect(0,0,250,250);
		
		
		var base = this.options.base,
			top = this.options.top,
			height= this.options.height,
			slope =  (top-base) / height;
		
		
		this.canvas.strokeStyle = '#cccccc';
		this.canvas.lineWidth = 1;
		for(var i =0; i < 5; i++){
			var lineTop = 250 - i * (250 / 4);
			this.canvas.beginPath();
			this.canvas.moveTo(0, lineTop);
			this.canvas.lineTo(250, lineTop);
			this.canvas.stroke();
		}
		
		
		
		this.canvas.beginPath();
		this.canvas.moveTo(0,0);
		this.canvas.lineTo( (top-base) / 2 ,this.options.height);
		this.canvas.lineTo( (top-base) / 2 + base,this.options.height);
		this.canvas.lineTo(top,0);
		this.canvas.strokeStyle = '#000000';
		this.canvas.lineWidth = 2;
		this.canvas.stroke();
		
		var fullness = 250 - this.getHeightForPercent();
		
		
		this.canvas.beginPath();
		this.canvas.moveTo(fullness * slope / 2,fullness);
		this.canvas.lineTo(250- (fullness * slope / 2),fullness);
		this.canvas.strokeStyle = '#0000ff';
		this.canvas.lineWidth = 4;
		this.canvas.stroke();
	},
	"{value} change": "update"
});



