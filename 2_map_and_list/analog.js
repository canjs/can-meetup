// parts of this code were adopted from: http://jsbin.com/evodil/28/edit
var Analog = can.Control({
	defaults: {
  		rad: 250
	}
}, {
	init: function(){
		this.canvas = this.element[0].getContext('2d');
		this.rad = this.options.rad;
		this.radius = this.rad/2 - 5;
		this.center = this.rad/2;
	},
	"{timer} time": function(timer, ev, newTime){
		
		var seconds = newTime.getSeconds()
		
		// draw circle
	    this.canvas.clearRect(0,0,this.center*2,this.center*2);
	    this.canvas.lineWidth = 4.0;
	    this.canvas.strokeStyle = "#567";
	    this.canvas.beginPath();
	    this.canvas.arc(this.center,this.center,this.radius,0,Math.PI * 2,true);
	    this.canvas.closePath();
	    this.canvas.stroke();
	
	    // draw second hand
	    var dist = newTime.getSeconds()
	    this.drawNeedle(
	    	this.center * 0.80,
	    	newTime.getSeconds(),
	    	{
	    		lineWidth:  2.0,
	    		strokeStyle: "#FF0000",
				lineCap: "round"
	    	}
	    );
	    // draw minute hand
	    this.drawNeedle(
	    	this.center * 0.65,
	    	dist = newTime.getMinutes() + dist/ 60,
	    	{
	    		lineWidth:  3.0,
	    		strokeStyle: "#423",
				lineCap: "round"
	    	}
	    );
	    this.drawNeedle(
	    	this.center * 0.40,
	    	newTime.getHours() * 60 / 12 + dist / 60,
	    	{
	    		lineWidth:  4.0,
	    		strokeStyle: "#42F",
				lineCap: "round"
	    	}
	    );
	
	},
	drawNeedle: function(size, dist, styles){
		var theta = (6 * Math.PI / 180),
	    	x = this.center + size * Math.cos(dist * theta - Math.PI/2),
			y = this.center + size * Math.sin(dist * theta - Math.PI/2);
		
		$.extend(this.canvas, styles)
		
		this.canvas.beginPath();
		this.canvas.moveTo(x,y);
		this.canvas.lineTo(this.center,this.center);
		this.canvas.closePath();
		this.canvas.stroke();
	}
});



