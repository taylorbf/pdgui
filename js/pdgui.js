$(function() {

	GUI.container = {
		objects: document.getElementById("objects"),
		connections: document.getElementById("connections")
	}
	GUI.ctx = GUI.container.connections.getContext("2d")

	var testobject = new PdObject({x: 0,y: 0})

	document.addEventListener("mousemove",GUI.update);

})

var GUI = {
	utils: {}
	connections: []
	startConnection: function(x,y) {
		GUI.ctx.
	}
	update: function() {
		
	}
}

var PdObject = function(param) {

	this.x = param.x
	this.y = param.y

	this.create = function() {
		this.house = document.createElement("div")
		this.house.className = "pdobject"
		this.createInlets(3)
		this.createOutlets(2)
		GUI.container.objects.appendChild(this.house)
		$([this.house]).draggable()
	}

	this.createInlets = function(number) {
		var inletcontainer = document.createElement("div")
		inletcontainer.className = "inlets"
		var inletrow = document.createElement("ul")
		for (var i=0;i<number;i++) {
			var inletcol = document.createElement("li")
			if (i==0) {
				inletcol.className = "left"
			}
			var inlet = document.createElement("div")
			inlet.className = "inlet"

			inlet.addEventListener("mousedown",function(inlet) {
				console.log("eh...")
				var pos = GUI.utils.findPosition(inlet)
				GUI.startConnection(pos.left,pos.top)
			}.bind(this,inlet))

			inletcol.appendChild(inlet)
			inletrow.appendChild(inletcol)
		}
		inletcontainer.appendChild(inletrow)
		this.house.appendChild(inletcontainer)

	}


	this.createOutlets = function(number) {
		var outletcontainer = document.createElement("div")
		outletcontainer.className = "outlets"
		var outletrow = document.createElement("ul")
		for (var i=0;i<number;i++) {
			var outletcol = document.createElement("li")
			if (i==0) {
				outletcol.className = "left"
			}
			var outlet = document.createElement("div")
			outlet.className = "outlet"
			outletcol.appendChild(outlet)
			outletrow.appendChild(outletcol)
		}

		outletcontainer.appendChild(outletrow)
		this.house.appendChild(outletcontainer)
	}

	this.create()

}







GUI.utils.findPosition = function(element) {
  var body = document.body,
      win = document.defaultView,
      docElem = document.documentElement,
      box = document.createElement('div');
  box.style.paddingLeft = box.style.width = "1px";
  body.appendChild(box);
  var isBoxModel = box.offsetWidth == 2;
  body.removeChild(box);
  box = element.getBoundingClientRect();
  var clientTop  = docElem.clientTop  || body.clientTop  || 0,
      clientLeft = docElem.clientLeft || body.clientLeft || 0,
      scrollTop  = win.pageYOffset || isBoxModel && docElem.scrollTop  || body.scrollTop,
      scrollLeft = win.pageXOffset || isBoxModel && docElem.scrollLeft || body.scrollLeft;
  return {
    top : box.top  + scrollTop  - clientTop,
    left: box.left + scrollLeft - clientLeft
  };
}




/* junk

			//inlet.style.left = ((i/number)*100)*(1+(1/number))+"%"
			//var effective = this.house.style.width
			//inlet.style.left = ((i/number)*100)*(1+(1/number))+"px" 

	*/