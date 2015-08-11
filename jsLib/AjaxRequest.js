function AjaxRequest() //new Ajax request object. Simple and universal
{
	var request = null;
	if(window.XMLHttpRequest) //standart WebKit version
	{
		try
		{
			request = new XMLHttpRequest();
		} catch(e)
		{
			request = null;
		}
	} else if(window.ActiveXObject) //MSE version
	{
		try
		{
			request = new ActiveXObject("Msxml2.XMLHTTP");
		} catch(e)
		{
			try
			{
				request = new ActiveXObject("Microsoft.XMLHTTP");
			} catch(e)
			{
				request = null;
			}
		}
	}
	this.request = request;
}

AjaxRequest.prototype.send = function(type, url, handler, postDataType, postData, isSynch) //Ajax send override
{
	if(this.request != null)
	{
		//delete previous request
		this.request.abort();

		//rewrite the cache
		url += "?dummy=" + new Date().getTime();

		try
		{
			this.request.onreadystatechange = handler;
			this.request.open(type, url, isSynch);
			if(type.toLowerCase() == "get")
			{
				//get request without data
				this.request.send(null);
			} else
			{
				//post request with data
				this.request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				this.request.send(postData);
			}
		} catch(e)
		{
			alert("Ajax error communication");
		}
	}
};