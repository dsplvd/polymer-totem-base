'use strict';

(function(){

/**
* Conditionally loads webcomponents polyfill if needed.
* Credit: Glen Maddern (geelen on GitHub)
*/

lazyLoadPolymerAndElements();

function lazyLoadPolymerAndElements() {

	// Let's use Shadow DOM if we have it, because awesome.
	window.Polymer = window.Polymer || {};
	window.Polymer.dom = 'shadow';

	var components = [
	  'components/app-base/app-base.html'
	];

	components.map(function(elementURL) {

		var elImport = document.createElement('link');
		elImport.rel = 'import';
		elImport.href = elementURL;
		elImport.async = 'true';
		document.head.appendChild(elImport);

	})
}

})();