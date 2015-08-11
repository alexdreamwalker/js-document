var dbOperator = new DBOperator(null);

var globalData = {
	technologies: {},
	technology: "",
	services: {},
	service: "",
	functions: {},
	func: "",
	selectedService: 0,
	getServiceById: function(serviceId) {
		for(var service in this.services) {
			if(this.services[service].id == serviceId)
				return service;
		}
		return null;
	},
	getTechById: function(techId) {
		for(var tech in this.technologies) {
			if(this.technologies[tech].id == techId)
				return tech;
		}
		return null;
	},
	innerAddFunc: null,
};

function applyTheme(color) {
	var col = "";
	if(color == "orange") col = "-dark"; 
	document.getElementById("colorcss").href = "css/style" + col + ".css";
}

function getTechnologies() {
	var result = {};
	dbOperator.sendSynchRequest("getTechnologies", function(responseText) {
		var technologies = JSON.parse(responseText).technologies;
		for(var i = 0; i < technologies.length; i++)
			result[technologies[i].name] = {id: technologies[i].id, name: technologies[i].name};
	}, null, null);
	return result;
}

function getServices() {
	var result = {};
	dbOperator.sendSynchRequest("getServices", function(responseText) {
		var services = JSON.parse(responseText).services;
		for(var i = 0; i < services.length; i++)
			result[services[i].name] = {id: services[i].id, name: services[i].name, address: services[i].address, ajaxPath: services[i].ajaxPath, ftpPath: services[i].ftpPath};
	}, null, null);
	return result;
}


function getFunctions(options) {
	var result = {};
	var serviceId = options.serviceId;
	var funcArray = new Array();
	funcArray["serviceId"] = serviceId;
	dbOperator.sendSynchRequest("getFunctions", function(responseText) {
		var functions = JSON.parse(responseText).functions;
		for(var i = 0; i < functions.length; i++)
			result[functions[i].name + "(" + functions[i].id + ")"] = {id: functions[i].id, name: functions[i].name, description: functions[i].description, techId: functions[i].techId};
	}, funcArray, null);
	return result;
}

function getFunctionInfo(options) {

}

function fillData() {
	globalData.services = getServices();
	globalData.technologies = getTechnologies();
	for(var service in globalData.services) {
		globalData.functions = getFunctions({serviceId: globalData.services[service].id});
		break;
	}
}

function updateServices() {
	//fill services list
	var services = [];
	for(var serv in globalData.services)
		services.push(serv);
	makeUl({"elem": "servicesUl", "name": "serv", "array": services});
	makeSelect({"elem": "addFunctionLinkService", "name": "serv", "array": services});
	var firstService = document.querySelectorAll("#servicesUl li")[0];
	firstService.classList.add("active");
	document.getElementById("mainHeader").innerHTML = "API " + firstService.innerHTML;
	var is = document.querySelectorAll("#serviceInfo i");
	var service = globalData.services[firstService.innerHTML];
	is[0].innerHTML = service.address;
	is[1].innerHTML = service.ajaxPath;
	is[2].innerHTML = service.ftpPath;
	globalData.selectedService = service.id;

	//add listeners to top menu
	var list = document.querySelectorAll("ul.top-menu li");
	[].forEach.call(list, function(elem) {
		elem.addEventListener("click", function(e) {
			e.preventDefault();
			var selElem = e.target;
			if(document.querySelector("ul.top-menu li.active") != null)
			var prevElem = document.querySelector("ul.top-menu li.active").classList.remove("active");
			selElem.classList.add("active");
			document.getElementById("mainHeader").innerHTML = "API " + selElem.innerHTML;

			var is = document.querySelectorAll("#serviceInfo i");
			var service = globalData.services[selElem.innerHTML];
			is[0].innerHTML = service.address;
			is[1].innerHTML = service.ajaxPath;
			is[2].innerHTML = service.ftpPath;

			globalData.functions = getFunctions({serviceId: service.id});
			globalData.selectedService = service.id;
			updateFunctions();
		}, false);
	});	
}

function updateFunctions() {
	var functions = [];
	var ids = [];
	for(var func in globalData.functions) {
		functions.push(func);
		ids.push(globalData.functions[func].id);
	}
	makeUl({"elem": "functionsUl", "name": "func", "array": functions});
	makeSelect({"elem": "addFunctionLinkAPI", "name": "func", "array": functions, "ids": ids});
	makeFunctionSearch();

	//add listeners to aside menu
	var list = document.querySelectorAll("aside nav ul li");
	[].forEach.call(list, function(elem) {
		elem.addEventListener("click", function(e) {
			e.preventDefault();
			var selElem = e.target;
			if(document.querySelector("aside nav ul li.active") != null)
			var prevElem = document.querySelector("aside nav ul li.active").classList.remove("active");
			selElem.classList.add("active");

			var funcId = globalData.functions[selElem.innerHTML].id;
			var funcArray = new Array();
			funcArray["functionId"] = funcId;
			dbOperator.sendRequest("getFunctionInfo", setAPIData, funcArray, null);

		}, false);
	});
}

function updateTechnologies() {
	//fill technologies list
	var technologies = [];
	for(var tech in globalData.technologies)
		technologies.push(tech);
	makeRadioGroup({"elem": "searchTechnology", "name": "tech", "array": technologies});
	makeRadioGroup({"elem": "addFunctionTech", "name": "tech", "array": technologies});
	var firstTech = document.querySelectorAll("#searchTechnology input")[0];
	firstTech.checked = "true";
	firstTech = document.querySelectorAll("#addFunctionTech input")[0];
	firstTech.checked = "true";
}

function start() {
	fillData();

	globalData.innerAddFunc = document.getElementById("addDiv").innerHTML;

	updateServices();
	updateTechnologies();
	updateFunctions();
	//disable editing in view
	var inputs = document.querySelectorAll("div.view-stage input");
	for(var i = 0; i < inputs.length; i++)
		inputs[i].readOnly = "true";
	var textAreas =  document.querySelectorAll("div.view-stage textarea");
	for(var i = 0; i < textAreas.length; i++)
		textAreas[i].readOnly = "true";
	//make view collapsible

	//create stager
	Stager({"elem": "stagerDiv"});
}

function makeRadioGroup(options) {
	var root = document.getElementById(options.elem);
	var name = options.name;
	var array = options.array;
	root.innerHTML = "";
	[].forEach.call(array, function(elem) {
		var input = document.createElement("input");
		input.id = name + elem;
		input.value = elem;
		input.type = "radio";
		input.name = name;

		var label = document.createElement("label");
		label.innerHTML = elem;
		label.for = name + elem;
		root.appendChild(input);
		root.appendChild(label);
	});	
}

function makeSelect(options) {
	var root = document.getElementById(options.elem);
	var array = options.array;
	var ids = options.ids;
	root.innerHTML = "";
	[].forEach.call(array, function(elem) {
		var option = document.createElement("option");
		option.innerHTML = elem;
		if(ids != null)
			option.dataset.id = ids[array.indexOf(elem)];
		root.appendChild(option);
	});
}

function makeUl(options) {
	var root = document.getElementById(options.elem);
	var array = options.array;
	root.innerHTML = "";
	[].forEach.call(array, function(elem) {
		var li = document.createElement("li");
		li.innerHTML = elem;
		root.appendChild(li);
	});
}


function makeFunctionSearch() {
	var exp = document.getElementById("searchInput").value;
	var techId = globalData.technologies[document.querySelector("#searchTechnology input[type='radio']:checked").value].id;

	var lis = document.querySelectorAll("#functionsUl li");
	for(var i = 0; i < lis.length; i++) {
		var func = globalData.functions[lis[i].innerHTML];
		if(func.techId == techId && func.name.indexOf(exp) != -1)
			lis[i].style.display = "";
		else lis[i].style.display = "none";
	}
}

function openNewFunctionPage() {
	document.getElementById("searchDiv").classList.add("hidden");
	document.getElementById("addDiv").classList.remove("hidden");
}

function openSearchPage() {
	document.getElementById("addDiv").classList.add("hidden");
	document.getElementById("searchDiv").classList.remove("hidden");
	document.getElementById("addDiv").innerHTML = globalData.innerAddFunc;

	fillData();

	globalData.functions = getFunctions({serviceId: globalData.selectedService});
	updateFunctions();
	updateTechnologies();

	Stager({"elem": "stagerDiv"});
}

function Stager(options) {
	var self = options.elem;
	var stages = document.querySelectorAll("#" + self + " div.add-stage");
	[].forEach.call(stages, function(stage) {
		var header = stage.querySelector("h2");
		header.innerHTML = "Этап " + (stageIndex(stage) + 1) + ": " + header.innerHTML;
		stage.classList.remove("active");
		addActionForm(stage);
	});	
	stages[0].classList.add("active");

	function stageIndex(stage) {
		return Array.prototype.indexOf.call(stages, stage);
	}

	function makeFormButton(options) {
		var button = document.createElement("button");
		button.type = "button";
		var img = document.createElement("img");
		img.src = "images/" + options.src;
		button.appendChild(img);
		button.appendChild(document.createTextNode(options.text));
		return button;
	}

	function reset() {
		[].forEach.call(stages, function(stage) {
			stage.classList.remove("active");
		});	
		stages[0].classList.add("active");
	}

	function prevStage() {
		var curStage = document.querySelector("#" + self + " div.add-stage.active");
		var index = stageIndex(curStage);
		curStage.classList.remove("active");
		stages[index - 1].classList.add("active");
	}

	function nextStage() {
		var curStage = document.querySelector("#" + self + " div.add-stage.active");
		var index = stageIndex(curStage);
		curStage.classList.remove("active");
		stages[index + 1].classList.add("active");
	}

	function addActionForm(stage) {
		var form = document.createElement("form");
		form.style.float = "right";
		var cancelBtn = makeFormButton({"text": "Отменить", "src": "remove.png"});
		cancelBtn.onclick =  function() {
			reset();
			openSearchPage();
		};
		var prevBtn = makeFormButton({"text": "Назад", "src": "arrow_left.png"});
		prevBtn.onclick = prevStage;
		var nextBtn = makeFormButton({"text": "Вперед", "src": "arrow_right.png"});
		nextBtn.onclick = nextStage;
		var readyBtn = makeFormButton({"text": "Готово", "src": "ok.png"});
		readyBtn.onclick = function(e) {
			getAPIData({"elem": self});
			alert("Готово!");
			reset();
			openSearchPage();
		};

		form.appendChild(cancelBtn);
		if(stageIndex(stage) != 0) form.appendChild(prevBtn);
		if(stageIndex(stage) != stages.length - 1) form.appendChild(nextBtn);
		if(stageIndex(stage) == stages.length - 1) form.appendChild(readyBtn);

		stage.appendChild(form); 
	}
}

var usefulActions = {
	addVariable: function() {
		var tr = document.createElement("tr");
		var nameTd = document.createElement("td");
		var input = document.createElement("input");
		input.type = "text";
		nameTd.appendChild(input);
		var typeTd = document.createElement("td");
		var inputType = document.createElement("input");
		inputType.type = "text";
		typeTd.appendChild(inputType);
		var descTd = document.createElement("td");
		var textarea = document.createElement("textarea");
		textarea.rows = "3";
		descTd.appendChild(textarea);
		tr.appendChild(nameTd);
		tr.appendChild(typeTd);
		tr.appendChild(descTd);
		document.querySelector("#varsTable tbody").appendChild(tr);
	},
	addException: function() {
		var tr = document.createElement("tr");
		var nameTd = document.createElement("td");
		var input = document.createElement("input");
		input.type = "text";
		nameTd.appendChild(input);
		var typeTd = document.createElement("td");
		var inputType = document.createElement("input");
		inputType.type = "text";
		typeTd.appendChild(inputType);
		var descTd = document.createElement("td");
		var textarea = document.createElement("textarea");
		textarea.rows = "5";
		descTd.appendChild(textarea);
		tr.appendChild(nameTd);
		tr.appendChild(descTd);
		document.querySelector("#exTable tbody").appendChild(tr);
	},
	updateLinksAPI: function() {
		var servId = globalData.services[document.getElementById("addFunctionLinkService").value].id;
		var funcs = getFunctions({"serviceId": servId});
		var functions = [];
		var ids = [];
		for(var func in funcs) {
			functions.push(func);
			ids.push(funcs[func].id);
		}
		makeSelect({"elem": "addFunctionLinkAPI", "name": "func", "array": functions, "ids": ids});
	},
	addLink: function() {
		var li = document.createElement("li");
		var index = document.getElementById("addFunctionLinkAPI").selectedIndex;
		li.dataset.id = document.getElementById("addFunctionLinkAPI").options[index].dataset.id;
		li.innerHTML = document.getElementById("addFunctionLinkAPI").options[index].innerHTML;
		document.getElementById("linksUl").appendChild(li);
	}
};

function getAPIData(options) {
	var self = options.elem;
	var stages = document.querySelectorAll("#" + self + " div.add-stage");
	var array = new Array();
	array["action"] = "addFunction";
	array["serviceId"] = globalData.selectedService;
	makeRequest();

	function getFirstStageInfo() {
		array["name"] = stages[0].querySelector("input[type='text']").value;
		array["description"] = stages[0].querySelectorAll("textarea")[0].value;
		array["result"] = stages[0].querySelectorAll("textarea")[1].value;
		array["techId"] = globalData.technologies[stages[0].querySelector("span input[type='radio']:checked").value].id;
	}

	function getSecondStageInfo() {
		array["variables[]"] = {};
		var trs = stages[1].querySelectorAll("tr");
		for(var i = 0; i < trs.length; i++) {
			if(trs[i].querySelectorAll("input").length == 0) continue;
			array["variables[]"][i] = {};
			array["variables[]"][i]["name"] = trs[i].querySelectorAll("input")[0].value;
			array["variables[]"][i]["type"] = trs[i].querySelectorAll("input")[1].value;
			array["variables[]"][i]["description"] = trs[i].querySelectorAll("textarea")[0].value;
		}
		array["variables[]"] = JSON.stringify(array["variables[]"]);
	}

	function getThirdStageInfo() {
		array["exceptions[]"] = {};
		var trs = stages[2].querySelectorAll("tr");
		for(var i = 0; i < trs.length; i++) {
			if(trs[i].querySelectorAll("input").length == 0) continue;
			array["exceptions[]"][i] = {};
			array["exceptions[]"][i]["name"] = trs[i].querySelectorAll("input")[0].value;
			array["exceptions[]"][i]["description"] = trs[i].querySelectorAll("textarea")[0].value;
		}
		array["exceptions[]"] = JSON.stringify(array["exceptions[]"]);
	}

	function getForthStageInfo() {
		array["links[]"] = {};
		var lis = stages[3].querySelectorAll("li");
		for(var i = 0; i < lis.length; i++) {
			array["links[]"][i] = {};
			array["links[]"][i]["linkId"] = lis[i].dataset.id;
		}
		array["links[]"] = JSON.stringify(array["links[]"]);
	}

	function makeRequest() {
		getFirstStageInfo();
		getSecondStageInfo();
		getThirdStageInfo();
		getForthStageInfo();
		dbOperator.sendFormData(array);
	}

}

function createDOMElement(type, inner) {
	var el = document.createElement(type);
	el.innerHTML = inner;
	return el;
}

function setAPIData(responseText) {
	var self = "viewDiv";
	var func = JSON.parse(responseText);
	var stages = document.querySelectorAll("#" + self + " div.view-stage");
	fillFirstStageInfo();
	fillSecondStageInfo();
	fillThirdStageInfo();
	fillForthStageInfo();

	function fillFirstStageInfo() {
		stages[0].querySelector("input[type='text']").value = func.general[0].name;
		stages[0].querySelectorAll("textarea")[0].value = func.general[0].description;
		stages[0].querySelectorAll("textarea")[1].value = func.general[0].result;
	}

	function fillSecondStageInfo() {
		var table = stages[1].querySelector("tbody");
		table.innerHTML = "";
		for(var i = 0; i < func.variables.length; i++) {
			var tr = document.createElement("tr");
			tr.appendChild(createDOMElement("td", func.variables[i].name));
			tr.appendChild(createDOMElement("td", func.variables[i].type));
			tr.appendChild(createDOMElement("td", func.variables[i].description));
			table.appendChild(tr);
		}
	}

	function fillThirdStageInfo() {
		var table = stages[2].querySelector("tbody");
		table.innerHTML = "";
		for(var i = 0; i < func.exceptions.length; i++) {
			var tr = document.createElement("tr");
			tr.appendChild(createDOMElement("td", func.exceptions[i].name));
			tr.appendChild(createDOMElement("td", func.exceptions[i].description));
			table.appendChild(tr);
		}
	}

	function fillForthStageInfo() {
		var ul = stages[3].querySelector("ul");
		ul.innerHTML = "";
		for(var i = 0; i < func.links.length; i++) {
			var li = document.createElement("li");
			li.innerHTML = func.links[i].name + "(" + globalData.getTechById(func.links[i].techId) + " " + globalData.getServiceById(func.links[i].serviceId) + ")";
			ul.appendChild(li);
		}
	}

}