nx.onload = function() {
	nx.colorize("accent","#333")
	nx.colorize("fill","#f7f7f7")
	dbL.colors.fill = "#000"
	dbR.colors.fill = "#000"
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
				lineWidth = 1.5
				beginPath()
				moveTo(connection[0].x,connection[0].y)
				lineTo(connection[1].x,connection[1].y)
				stroke()
				closePath()
			}
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

	}
}

var PdObject = function(node) {

	this.x = node.layout.x
	this.y = node.layout.y
	this.text = node.proto
	this.index = node.id;
	this.args = node.args || false;

	this.create = function() {
		this.house = document.createElement("div")
		this.house.className = "pdobject"
		this.house.style.left = this.x+"px"
		this.house.style.top = this.y+"px"
		if (patch.objects[this.index]) {
			this.createInlets(patch.objects[this.index].inlets.length)
			this.createOutlets(patch.objects[this.index].outlets.length)
		}
		GUI.container.objects.appendChild(this.house)

		switch (this.text) {
			case "floatatom":
			case "nbx":
				var nexuswidget = this.createNX("number",40,15)
				nexuswidget.on('*',function(data) {
					patch.objects[this.index].i(0).message([data.value])
				}.bind(this))
				var receiver = new Pd.core.portlets.Inlet(GUI.dummy)
				receiver.message = function(args) {
				    nexuswidget.set({value:args[0]},false)
				}
				patch.objects[this.index].o(0).connect(receiver)
				this.house.style.borderRadius = "0px 8px 0px 0px"
				break;
			case "tgl":
				var nexuswidget = this.createNX("toggle",15,15)
				nexuswidget.on('*',function(data) {
					patch.objects[this.index].i(0).message(['bang'])
				}.bind(this))
				var receiver = new Pd.core.portlets.Inlet(GUI.dummy)
				receiver.message = function(args) {
				    nexuswidget.set({value:args[0]},false)
				}
				patch.objects[this.index].o(0).connect(receiver) 
				break;
			case "hsl":
				var nexuswidget = this.createNX("slider",100,12)
				nexuswidget.mode = "relative"
				nexuswidget.on('*',function(data) {
					patch.objects[this.index].i(0).message([data.value*128])
				}.bind(this))
				var receiver = new Pd.core.portlets.Inlet(GUI.dummy)
				receiver.message = function(args) {
				    nexuswidget.set({value:args[0]/128},false)
				}
				patch.objects[this.index].o(0).connect(receiver) 
				break;
			case "vsl":
				var nexuswidget = this.createNX("slider",12,100)
				nexuswidget.mode = "relative"
				nexuswidget.on('*',function(data) {
					patch.objects[this.index].i(0).message([data.value*128])
				}.bind(this))
				var receiver = new Pd.core.portlets.Inlet(GUI.dummy)
				receiver.message = function(args) {
				    nexuswidget.set({value:args[0]/128},false)
				}
				patch.objects[this.index].o(0).connect(receiver) 
				break;
			case "bng":
				var nexuswidget = this.createNX("button",15,15)
				nexuswidget.mode = "impulse"
				nexuswidget.on('*',function(data) {
					patch.objects[this.index].i(0).message(['bang'])
				}.bind(this))
				var receiver = new Pd.core.portlets.Inlet(GUI.dummy)
				receiver.message = function(args) {
					nexuswidget.set({press:1},false)
					setTimeout(nexuswidget.set.bind(nexuswidget,{press:0},false),40)
				}
				patch.objects[this.index].o(0).connect(receiver) 
				break;
			case "msg":
				var msgtext = patchData.nodes[this.index].args.join(" ")
				var nexuswidget = this.createNX("message",msgtext.length*6.7 + 17,15)
				nexuswidget.size = 11
				nexuswidget.val.value = msgtext
				nexuswidget.draw()
				var cutout = document.createElement("div")
				cutout.className = "msg-cutout"
				this.house.appendChild(cutout)
				this.house.style.borderRight = "solid 0px"
				nexuswidget.on('*',function(data) {
					patch.objects[this.index].i(0).message([data.value])
				}.bind(this))
				var receiver = new Pd.core.portlets.Inlet(GUI.dummy)
				receiver.message = function(args) {
				}
				patch.objects[this.index].o(0).connect(receiver) 
				break;
			case "text":
				this.text = ""
				this.createText(this.text)
				this.house.style.backgroundColor="#fff"
				this.house.style.border="solid 0px"
				break;
			default: 
				this.createText(this.text)
				break;
		}
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




/* util functions */

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