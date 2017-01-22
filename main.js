var replaceTextInNode = function(parentNode) {
	// Iterate through all the HTML elements on the page:
	for (var i = parentNode.childNodes.length - 1; i >= 0; i--) {
		var node = parentNode.childNodes[i];

		// Check if the element is a text node:
		if (node.nodeType == Element.TEXT_NODE) {
			// Check if text node contains a dollar value (requires dollar sign at the beginning, and proper dollar format: $XX.YY)
			if (node.textContent.match(/\$[0-9]+\.[0-9][0-9](?:[^0-9]|$)/i)) {
				var val = node.textContent.match(/\$[0-9]+\.[0-9][0-9](?:[^0-9]|$)/i);

				// Calculate hours needed to work to cover cost, and add to text string:
				var calculatedTime = val[0].replace("$", "");
				calculatedTime = Math.round((calculatedTime / 15) * 100) / 100;
				node.textContent = node.textContent.replace(val[0], val[0] + " (" + calculatedTime + " hours)");

				// Add a wrapper div around text element containing price:
				var parent = node.parentNode;
				var wrapper = document.createElement('div');
				wrapper.setAttribute('class', 'linkWrapper');
				parent.replaceChild(wrapper, node);
				wrapper.appendChild(node);

				// Create a hoverbox:
				var hoverbox = document.createElement('div');
				hoverbox.setAttribute('class', 'hoverbox');
				hoverbox.innerHTML = "At $15/hr, it will take " + calculatedTime + " hours of work to cover the cost of this purchase.<br><br>Did this knowledge influence you to not buy this item?<br><div class=\"button green\">Yes</div><div class=\"button red\">No</div>";
				wrapper.appendChild(hoverbox);
			}
		} else if (node.nodeType == Element.ELEMENT_NODE) {
			replaceTextInNode(node);
		}
	}
};

replaceTextInNode(document.body);