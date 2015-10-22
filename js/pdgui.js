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
		this.patchData = patchData
		this.init()
		for (var i=0;i<this.patchData.nodes.length;i++) {
			var node = this.patchData.nodes[i]
			var newobj = new PdObject(node)
			GUI.objects.push(newobj)
		}
		this.createConnections();
	},
	createConnections: function(x,y) {
		for (var i=0;i<this.patchData.connections.length;i++) {
			console.log(i)
			var connection = this.patchData.connections[i]
			var inlet1 = GUI.objects[connection.sink.id].inlets[connection.sink.port]
			inlet1 = GUI.utils.findPosition(inlet1)
			var outlet1 = GUI.objects[connection.source.id].outlets[connection.source.port]
			outlet1 = GUI.utils.findPosition(outlet1)
			this.connections.push([{x:inlet1.left+2,y:inlet1.top-18},{x:outlet1.left+2,y:outlet1.top-18}])
		}
		this.drawConnections()
	},
	drawConnections: function() {
		this.ctx.clearRect(0,0,1000,1000)
		for (var i=0;i<this.connections.length;i++) {
			var connection = this.connections[i]
			with (this.ctx) {
				lineWidth = 1
				beginPath()
				moveTo(connection[0].x,connection[0].y)
				lineTo(connection[1].x,connection[1].y)
				stroke()
				closePath()
			}
		}
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

		this.dummy = {patch: patch}

		//var testobject = new PdObject({x: 200,y: 100})
		//var testobject2 = new PdObject({x: 250,y: 300})

		//this.updateevent = document.addEventListener("mousemove",GUI.update);

	}
}

var PdObject = function(node) {

	//{x: node.layout.x, y: node.layout.y, text: node.proto, index: i }

	this.x = node.layout.x || false;
	this.y = node.layout.y || false;
	this.text = node.proto || false;
	this.index = node.id || false;
	this.args = node.args || false;

	this.create = function() {
		this.house = document.createElement("div")
		this.house.className = "pdobject"
		this.house.style.left = this.x+"px"
		this.house.style.top = this.y+"px"
		this.createInlets(2)
		this.createOutlets(2)
		GUI.container.objects.appendChild(this.house)

		switch (this.text) {
			case "nbx":
				var nexuswidget = this.createNX("number",40,15)
				nexuswidget.on('*',function(data) {
					patch.objects[this.index].i(0).message([data.value])
				}.bind(this))
				var receiver = new Pd.core.portlets.Inlet(GUI.dummy)
				receiver.message = function(args) {
				    console.log(args)
				    nexuswidget.set({value:args[0]},false)
				}
				patch.objects[this.index].o(0).connect(receiver)
				break;
			case "tgl":
				var nexuswidget = this.createNX("toggle",15,15)
				nexuswidget.on('*',function(data) {
					patch.objects[this.index].i(0).message(['bang'])
				}.bind(this))
				var receiver = new Pd.core.portlets.Inlet(GUI.dummy)
				receiver.message = function(args) {
				    console.log(args)
				    nexuswidget.set({value:args[0]},false)
				}
				patch.objects[this.index].o(0).connect(receiver) 
				break;
			default: 
				this.createText(this.text)
				break;
		}
	/*	$([this.house]).draggable({
			drag: function(e) {
      }
    }) */
	}

	this.createText = function(text) {
		var textcont = document.createElement("div")
		textcont.className = "objecttext"
		textcont.innerHTML = text + " " + this.args.join(' ')
		this.house.appendChild(textcont)
	}

	this.createInlets = function(number) {
		this.inlets = []
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

			/*inlet.addEventListener("mousedown",function(inlet) {
				var pos = GUI.utils.findPosition(inlet)
				GUI.startConnection(pos.left,pos.top)
			}.bind(this,inlet)) */

			this.inlets.push(inlet)
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
		this.outlets = []
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
			this.outlets.push(outlet)
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
		var nexuswidget = nx.add(type, {
			parent: this.house,
			w: w || false,
			h: h || false
		})
		return nexuswidget
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