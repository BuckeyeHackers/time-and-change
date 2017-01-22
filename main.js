var replaceTextInNode = function(parentNode){
	for(var i = parentNode.childNodes.length - 1; i >= 0; i--){
		var node = parentNode.childNodes[i];

		if (node.nodeType == Element.TEXT_NODE) {
			if (node.textContent.match(/\$[0-9]+\.[0-9][0-9](?:[^0-9]|$)/i)) {
				var val = node.textContent.match(/\$[0-9]+\.[0-9][0-9](?:[^0-9]|$)/i);
				var calculatedTime = val[0].replace("$", "");
				calculatedTime = Math.round((calculatedTime / 15) * 100) / 100;
				node.textContent = node.textContent.replace(val[0], val[0] + " (" + calculatedTime + " hours)");
			}
		} else if(node.nodeType == Element.ELEMENT_NODE){
			replaceTextInNode(node);
		}
	}
};

replaceTextInNode(document.body);