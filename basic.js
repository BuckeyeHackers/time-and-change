document.addEventListener('DOMContentLoaded', function() {
	//chrome.storage.sync.clear(function(){})
    var submit = document.getElementById('submitall');

    chrome.storage.sync.get(null, function(data){
    	console.log(data)
    })

    //Check for the number of elements in the user's list (min 7)
    chrome.storage.sync.get('tac-elements', function(data){
    	if (Object.keys(data).length === 0 && data.constructor === Object){
    		var obj = {}
    		obj['tac-elements'] = 7
    		store_pref(obj);
    	}
    	else{
    		console.log("tac-elements response")
    		console.log(data)
    	}
    })

    chrome.storage.sync.get('tac-wage', function(data){
   		if (Object.keys(data).length === 0 && data.constructor === Object){
    		var obj = {}
    		obj['tac-wage'] = 0.0
    		store_pref(obj);
    	}
    	else{
    		console.log("tac-wage response")
    		console.log(data)
    	}
    })

    //populate our fields
    /*
	{'tac-list' : [ [timestamp,[vendor,cost]], [timestamp,[vendor,cost]] [...], ... ]}
    */
	chrome.storage.sync.get('tac-list', function(data){
		console.log(data)
		if (!(Object.keys(data).length === 0 && data.constructor === Object) && data['tac-list'].length > 0){
			console.log("initializing from list.")
			initialize_inputs(data['tac-list']);
		}
		else{
			console.log("No inputs for tac-list. initializing list.")
			var obj = {} 
			obj['tac-list'] = []
			store_pref(obj);
		}
		

	});

	chrome.storage.sync.get('tac-wage', function(data){
		console.log(data)
		if (!(Object.keys(data).length === 0 && data.constructor === Object)){
			console.log("initializing from wage.")
			initialize_wage(data['tac-wage']);
		}
		else{
			console.log("No inputs for tac-wage. initializing.")
			var obj = {} 
			obj['tac-wage'] = 0.0
			store_pref(obj);
		}
		

	});

    // onClick's logic below:
    submit.addEventListener('click', function() {
    	chrome.storage.sync.get('tac-elements', function(data){
    		if (Object.keys(data).length === 0 && data.constructor === Object){
    			console.log("tac-elements is empty. setting.")

    			var obj = {}
    			obj['tac-elements'] = 7
    			store_pref(obj);
    		}
    		var elements = Number(data['tac-elements'])//int(data)
  		  	var l = []
  		  	console.log("elements: " + elements)
  		  	console.log(data)
	    	console.log("Building list of inputs.")

	    	for (j = 1; j <= elements; j++){
				var keyi = "i"+String(j);
				var keyc = "c"+String(j);
				var a = document.getElementById(keyi).value
				var b = document.getElementById(keyc).value
				console.log(j)
				if (a !== '' && b !== ''){
					console.log(keyi + " " + keyc + " " + a + " " + b)
					var ts = new Date().valueOf()
					var vendor = a
					var cost = b
					l.push([ts,[vendor,cost]])
				}
			
			}

			var wage = document.getElementById('wage').value
			var objw = {}
			objw['tac-wage'] = wage
			console.log("Sending waeg to save: ")

			console.log(objw)
			store_pref(objw);

			//{'tac-list' : [ [timestamp,[vendor,cost]], [timestamp,[vendor,cost]] [...], ... ]}

			var obj = {}
			obj['tac-list'] = l
			console.log("Sending list to save: ")
			console.log(obj)


			store_pref(obj);

    	});
	});
});

function store_pref(obj){
	chrome.storage.sync.set(obj, function() {
	// Notify that we saved.
		console.log("saved! ")
		console.log(obj)
	});
}

//[ {timestamp:[vendor,cost]}, {timestamp:[vendor,cost]} {...}, ... ]
function initialize_inputs(data){
	console.log(data)
	for (i = 0; i < data.length; i++){
		item = data[i]

		timestamp = item[0]
		v_c = item[1]
		vendor = v_c[0]
		cost = v_c[1]

		keyi = "i"+String(i+1);
		keyc = "c"+String(i+1);
		console.log(keyi + " " + keyc + "whats up " + vendor + " " + cost)
		document.getElementById(keyi).value = vendor
		document.getElementById(keyc).value = cost

	}
}

function initialize_wage(data){
	document.getElementById("wage").value = data
}

