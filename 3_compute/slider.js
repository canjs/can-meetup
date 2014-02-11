Slider = can.Control.extend(
{
	defaults: {orientation: "horizontal"}
},
{
    init: function(){
		this.element.addClass("ui-slider-handle ui-state-default ui-corner-all");
		this.dir = this.options.orientation === "horizontal" ? "left" : "top";
		this.dirCap = can.capitalize( this.dir );
		this.dim = this.options.orientation === "horizontal" ? "width" : "height";
		this.dimCap = can.capitalize( this.dim );
   		
        this.updatePosition();
    },
    "draginit": function(el, ev, drag){
        drag.limit(this.element.parent());
        drag[this.options.orientation]();
    },
    "dragmove": function(el, ev, drag){
        
        var container = this.element.parent(),
            sliderOffset = el.offset()[this.dir],
            containerOffset = container.offset()[this.dir],
            sliderWidth = el["outer"+this.dimCap](),
            containerWidth = container[this.dim]();
        
        containerOffset +=
            parseInt( container.css( "padding"+this.dirCap ) ) +
            parseInt( container.css("border"+this.dirCap+"Width") )
        
        var value = ( (sliderOffset-containerOffset ) /
                     (containerWidth - sliderWidth) ),
        	rounded = Math.round(value*100) / 100;
        
        if(this.options.orientation === "vertical") {
        	round = 1 - rounded;
        }
        this.options.value( rounded )
        
    },
    "{value} change" : "updatePosition",
    updatePosition: function(){
        var value = this.options.value(),
            container = this.element.parent(),
            containerOffset = container.offset()[this.dir],
            sliderWidth = this.element["outer"+this.dimCap](),
            containerWidth = container[this.dim]();
        
        containerOffset +=
            parseInt( container.css("padding"+this.dirCap) ) +
            parseInt( container.css( "border"+this.dirCap+"Width" ) )
        
        
        if(this.options.orientation === "vertical") {
        	value = 1 - value;
        }
        
        var sliderOffset = containerOffset+
            ( 	(containerWidth - sliderWidth) * 
             ( value ) );
        
        var pos = {};
        pos[ this.dir ] = sliderOffset;
        
        this.element.offset(pos)
    },
    "resize": "updatePosition"
});