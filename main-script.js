function ajaxGet(url, callback) {
	let request = new XMLHttpRequest();
	request.open("GET", url);
	request.addEventListener("load", function() {
		if (request.status >= 200 && request.status < 400) {
			callback(request.responseText);
		} else {
			console.error("Error");
		}
	});

	request.addEventListener("error", function() {
		console.error("Error");
	});

	request.send(null); 
}

let mainTiles = document.getElementById("main-tiles");

//function to create element
const create = (elm, attributes) => {
	const element = document.createElement(elm);
	for (key in attributes) {
    	element.setAttribute(key, attributes[key])
  	}
	return element;
}

//attribute function, for attributes whose names are not fulfiling the exigence for key object names, e.g attributes with dash
function attr(element, attrName, attrValue) {
	element.setAttribute(attrName, attrValue);
}

//function for multiple append child
function appendAll(parentElm, allChildren) {
	allChildren.forEach(item => {
		parentElm.appendChild(item);
	})
}

ajaxGet("./FishEyeDataFR.json", function(response) {
	response = JSON.parse(response);

	for (let i = 0; i<response.photographers.length; i++) {
		//create img element to store the picture
		let imgSamplePhoto = create("img", {class: "tiles-items--photo"});
		//fetch sample image for each photographer using id
		let photographerId = response.photographers[i].id;
		for (let j = 0; j<response.media.length; j++) {
			let mediaPhotographerId = response.media[j].photographerId;

			if(photographerId == mediaPhotographerId && Object.prototype.hasOwnProperty.call(response.media[j], "image")) {
				imgSamplePhoto.src = 'sass-partials/images/' + response.media[j].image;
				break;
			}
		}
		//image alt text
		let photoName = response.photographers[i].name;
		//link to go to each photographer's page
		let pageLink = create("a");
		attr(pageLink, "href", "photographer-page.html?name=" + photoName.replaceAll(" ", "_"));
		attr(pageLink, "aria-label", photoName);
		//make sample photo as child of link element
		pageLink.appendChild(imgSamplePhoto);

		//fetch photographer name
		let photographerName = create("h2", {class: "tiles-items--name"});
		photographerName.textContent = photoName;

		//make division for link to photographer pages
		let tilesLink = create("div", {class: "tiles-items--link", tabindex: 0});
		tilesLink.addEventListener("keyup", function(e) {
			if (e.keyCode == 13) {
				e.target.firstChild.click();
			}
		})
		appendAll(tilesLink, [pageLink, photographerName]);

		//fetch photographer location
		let photographerLocation = create("h3", {class: "tiles-items--location"});
		photographerLocation.textContent = response.photographers[i].city + ", " + response.photographers[i].country;

		//fetch tagline
		let photographerTagline = create("p", {class: "tiles-items--tagline"});
		photographerTagline.textContent = response.photographers[i].tagline;

		//fetch price
		let photographerPrice = create("p", {class: "tiles-items--price"});
		photographerPrice.textContent = response.photographers[i].price + "€/jour";

		//fetch tags
		let photographerTags = create("ul", {class: "container-tags container-tags--individual"});
		//loop through each tags
		for (let k = 0; k<response.photographers[i].tags.length; k++) {
			let photographerTagsItems = create("li", {class: "container-tags--items photographer-tags", tabindex: 0});
			photographerTagsItems.textContent = "#" + response.photographers[i].tags[k];
			attr(photographerTagsItems, "data-value", photographerTagsItems.textContent);
			//tags for screen reader
			let srOnlyTags = create("span", {class: "sr-only"});
			srOnlyTags.textContent = response.photographers[i].tags[k];
			//put into DOM
			photographerTags.appendChild(photographerTagsItems);
			photographerTags.appendChild(srOnlyTags);
		}

		//filter functionality for each tag button
		//get the DOM of the tag element
		let photographerTag = Array.from(document.getElementsByClassName("photographer-tags"));
		//filter function on each tags
		photographerTag.forEach(item => filterByTag(item));
		//join every elements in one group
		let tilesItems = create("article", {class: "tiles-items"});
		//elements inside each tiles
		appendAll(tilesItems, [tilesLink, photographerLocation, photographerTagline, photographerPrice, photographerTags]);
		//put into main section on DOM
		mainTiles.appendChild(tilesItems);
	}
});

//get tags elements on navigation bar
let navigationTags = Array.from(document.getElementsByClassName("navigation-tags"));
//function to remove inline style attribute
function removeStyle(toReset) {
	for (let i = 0; i<toReset.length; i++) {
		if (toReset[i].hasAttribute("style")) {
			toReset[i].removeAttribute("style");
		}
	}
}
//filter tag function
function filterByTag(item) {
	item.addEventListener("click", function() {
		let tagValue = item.getAttribute("data-value");
		let photographerTags = Array.from(document.getElementsByClassName("container-tags--individual"));
		let tagItems = document.getElementsByClassName("container-tags--items");

		photographerTags.forEach(tag => {
			let tagChildren = tag.children;
			for (let b = 0; b<tagChildren.length; b++) {
				if (tagChildren[b].textContent.includes(tagValue)) {
				tag.parentElement.style.display = "block";
				break;
			} else {
				tag.parentElement.style.display = "none";
			}
			}
		})
		removeStyle(tagItems);
		item.style.backgroundColor = "#901C1C";
		item.style.color = "white";
	})
	//on click enter
	item.addEventListener("keyup", function(e) {
		if (e.keyCode === 13) {
			item.click();
		}
	})
}
//filter function (on navigation bar)
navigationTags.forEach(item => filterByTag(item));

//DOM of the top menu to bring back the main content
let navigationLabel = document.getElementsByClassName("header--navigation--additional-label");
//click event to show all contents
navigationLabel[0].addEventListener("click", function() {
	Array.from(document.getElementsByClassName("tiles-items")).forEach(items => {
		items.style.display = "block";
	})
});
//show the additional button on top only after scrolling down
window.onscroll = function() {
	if (document.documentElement.scrollTop > 20) {
		navigationLabel[0].style.opacity = "1";
	} else {
		navigationLabel[0].style.opacity = "0";
	}
};






