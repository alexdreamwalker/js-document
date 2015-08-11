var ajaxReq = null;

function DBOperator(uiOperator) //class for database manipulations. Get the UIOperator object to modify visual representation
{
	this.ajaxReq = new AjaxRequest();
	ajaxReq = this.ajaxReq.request;
	this.actionType = "POST";
	this.phpPath = "phpLib/AjaxRequest.php";
	this.uiOperator = uiOperator;
}

DBOperator.prototype.sendRequest = function(action, request, array, elementId) //send 'array' of data with seted 'action' and run 'request'
{
	document.getElementById("loader").style.display = "";
	var postString = "action=" + action;
	if(array != 'null') for(var key in array)
	{
		var propString = "&" + key + "=" + array[key];
		postString += propString;
	}
	console.log(postString);
	var reqFunction = function()
	{
		if(ajaxReq.readyState == 4 && ajaxReq.status == 200)
		{
			var responseText = ajaxReq.responseText;
			console.log(responseText);
			request(responseText, elementId);
			document.getElementById("loader").style.display = "none";
		}
		else if(ajaxReq.readyState == 1)
		{
			document.getElementById("loader").style.display = "";
		}
	}
	this.ajaxReq.send(this.actionType, this.phpPath, reqFunction, this.dataType, postString, true);
};

DBOperator.prototype.sendSynchRequest = function(action, request, array, elementId) //send 'array' of data with seted 'action' and run 'request'
{
	if(document.getElementById("loader") != null) document.getElementById("loader").style.display = "";
	var postString = "action="+action;
	if(array != 'null') for(var key in array)
	{
		var propString = "&" + key + "=" + array[key];
		postString += propString;
	}
	console.log(postString);
	var reqFunction = function()
	{
		if(ajaxReq.readyState == 4 && ajaxReq.status == 200)
		{
			var responseText = ajaxReq.responseText;
			console.log(responseText);
			request(responseText, elementId);
			if(document.getElementById("loader") != null) document.getElementById("loader").style.display = "none";
		}
		else if(ajaxReq.readyState == 1)
		{
			if(document.getElementById("loader") != null) document.getElementById("loader").style.display = "";
		}
	}
	this.ajaxReq.send(this.actionType, this.phpPath, reqFunction, this.dataType, postString, false);
};

DBOperator.prototype.sendFormData = function(data)
{
	var xhr = new XMLHttpRequest();
	document.getElementById("loader").style.display = "";
    xhr.open("POST", this.phpPath, false); 

    var formData = new FormData();
    for(var key in data) formData.append(key, data[key]);

    xhr.onload = function() {
    if (this.status == 200 && this.readyState == 4) {
      var resp = this.responseText;
      console.log(resp);
      document.getElementById("loader").style.display = "none";
      alert(resp);
    }
    else if(ajaxReq.readyState == 1) {
			document.getElementById("loader").style.display = "";
		}
    };
    
    //console.log(postStr);
    xhr.send(formData);
};