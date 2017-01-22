var replaceTextInNode = function(parentNode) {
	// Iterate through all the HTML elements on the page:
	for (var i = parentNode.childNodes.length - 1; i >= 0; i--) {
		var node = parentNode.childNodes[i];

		// Check if the element is a text node:
		if (node.nodeType == Element.TEXT_NODE) {
			// Check if text node contains a dollar value (requires dollar sign at the beginning, and proper dollar format: $XX.YY)
			if (node.textContent.match(/\$[0-9]+\.[0-9][0-9](?:[^0-9]|$)/i)) {
				// Store cost in array (technically stores all prices in the text element, but we will only use the first at index 0):
				var prices = node.textContent.match(/\$[0-9]+\.[0-9][0-9](?:[^0-9]|$)/i);
				var price = prices[0];

				if (price.length == node.textContent.trim().length) {
					// Calculate hours needed to work to cover cost, and add to text string:
					var calculatedTime = price.replace("$", "");
					calculatedTime = Math.round((calculatedTime / 15) * 100) / 100;
					node.textContent = node.textContent.replace(price, price + " (" + calculatedTime + " hours)");

					// Add a wrapper div around text element containing price:
					var parent = node.parentNode;
					var wrapper = document.createElement('div');
					wrapper.setAttribute('class', 'linkWrapper');
					parent.replaceChild(wrapper, node);
					wrapper.appendChild(node);

					// Get page URL base:
					var domain = extractDomain(window.location.href);

					// Create a hoverbox:
					var hoverbox = document.createElement('div');
					hoverbox.setAttribute('class', 'hoverbox');
					hoverbox.innerHTML = "At $15/hr, it will take " + calculatedTime + " hours of work to cover the cost of this purchase.<br><br>Did this knowledge influence you to not buy this item?<br><div class=\"ext-button green\" onclick=\"logData(" + domain + ", " + price + ")\">Yes</div><div class=\"ext-button red\" onclick=\"hideHoverbox()\">No</div>";
					wrapper.appendChild(hoverbox);
				}
			}
		} else if (node.nodeType == Element.ELEMENT_NODE) {
			replaceTextInNode(node);
		}
	}
};

replaceTextInNode(document.body);

// Derived from stackoverflow.com/questions/8498592/extract-root-domain-name-from-string
function extractDomain(url) {
	var domain;

	if (url.indexOf("://") > -1) {
		domain = url.split('/')[2];
	} else {
		domain = url.split('/')[0];
	}

	domain = domain.split(':')[0];

	return domain;
}

function hideHoverbox() {
	var hoverboxes = document.getElementsByClassName("hoverbox")
	for (var i = 0; i < hoverboxes.length; i++) {
		hoverboxes[i].setAttribute("display", "none");
	}
}

function logData(vendor, price) {
	chrome.storage.sync.get('tac-list', function(data) {
		var timestamp = new Date().valueOf();
		l.push([timestamp, [vendor, price]]);
	});
}