$(function() {



})

nx.onload = function() {
	nx.colorize("accent","#1bd")
	nx.colorize("fill","#f7f7f7")
}

var GUI = {
	utils: {},
	objects: [],
	connections: [],
	loadPatch: function(patchData) {
		this.init()
		console.log(patchData.nodes)
		for (var i=0;i<patchData.nodes.length;i++) {
			var node = patchData.nodes[i]
			var newobj = new PdObject({x: node.layout.x, y: node.layout.y, text: node.proto, index: i })
			GUI.objects.push(newobj)
		}
	},
	startConnection: function(x,y) {
		//GUI.ctx.
	},
	update: function() {
		if (GUI.changing) {
		//	GUI.drawConnections
		}
	},
	init: function() {

		this.container = {
			objects: document.getElementById("objects"),
			connections: document.getElementById("connections")
		}
		this.container.connections.width = 1000
		this.container.connections.height = 1000 
		this.ctx = GUI.container.connections.getContext("2d")

		//var testobject = new PdObject({x: 200,y: 100})
		//var testobject2 = new PdObject({x: 250,y: 300})

		this.updateevent = document.addEventListener("mousemove",GUI.update);

	}
}

var PdObject = function(param) {

	this.x = param.x || false;
	this.y = param.y || false;
	this.text = param.text || false;
	this.index = param.index || false;

	this.create = function() {
		this.house = document.createElement("div")
		this.house.className = "pdobject"
		this.house.style.left = param.x+"px"
		this.house.style.top = param.y+"px"
		this.createInlets(1)
		this.createOutlets(1)
		GUI.container.objects.appendChild(this.house)

		switch (this.text) {
			case "nbx":
				this.createNX("number",40,15)
				this.widget.on('*',function(data) {
					patch.objects[this.index].i(0).message([data.value])
				}.bind(this))
				break;
			case "tgl":
				this.createNX("toggle",15,15)
				this.widget.on('*',function(data) {
					patch.objects[this.index].i(0).message(['bang'])
				}.bind(this))
				break;
			default: 
				this.createText(this.text)
				break;
		}
	/*	$([this.house]).draggable({
			drag: function(e) {
				with (GUI.ctx) {
					lineWidth = 2
					clearRect(0,0,1000,1000)
					beginPath()
					moveTo(0,0)
					lineTo(e.clientX,e.clientY)
					stroke()
					closePath()
				}
				//console.log(e)
       // updateCounterStatus( $drag_counter, counts[ 1 ] );

      }
    }) */
	}

	this.createText = function(text) {
		var textcont = document.createElement("div")
		textcont.className = "objecttext"
		textcont.innerHTML = text
		this.house.appendChild(textcont)
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
		if (number==1) {
			var inletcol = document.createElement("li")
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
		if (number==1) {
			var outletcol = document.createElement("li")
			outletrow.appendChild(outletcol)
		}
		outletcontainer.appendChild(outletrow)
		this.house.appendChild(outletcontainer)
	}

	this.createNX = function(type,w,h) {
		this.widget = nx.add(type, {
			parent: this.house,
			w: w || false,
			h: h || false
		})
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