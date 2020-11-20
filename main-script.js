function ajaxGet(url, callback) {
	var request = new XMLHttpRequest();
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

var mainTiles = document.getElementById("main-tiles");

//element creation function
function create(element) {
	var name = document.createElement(element);
	return name;
}

//attribute function
function attr(element, attrName, attrValue) {
	element.setAttribute(attrName, attrValue);
}


ajaxGet("http://localhost/P6_OC/FishEyeDataFR.json", function(response) {
	var photos = JSON.parse(response);

	for (var i = 0; i<photos.photographers.length; i++) {
		//create img element to store the picture
		var imgSamplePhoto = create("img");
		//fetch sample image for each photographer using id
		var photographerId = photos.photographers[i].id;
		for (var j = 0; j<photos.media.length; j++) {
			var mediaPhotographerId = photos.media[j].photographerId;

			if(photographerId == mediaPhotographerId && photos.media[j].hasOwnProperty("image")) {
				imgSamplePhoto.src = 'sass-partials/images/' + photos.media[j].image;
				break;
			}
		}
		//image alt text
		var altText = "Photo par " + photos.photographers[i].name;
		attr(imgSamplePhoto, "alt", altText);
		//image style
		attr(imgSamplePhoto, "class", "tiles-items--photo");
		//link to go to each photographer's page
		var pageLink = create("a");
		//link to each page
		attr(pageLink, "href", "photographer-page.html");
		//make sample photo as child of link element
		pageLink.appendChild(imgSamplePhoto);

		//fetch photographer name
		var photographerName = create("h2");
		photographerName.textContent = photos.photographers[i].name;
		//name style
		attr(photographerName, "class", "tiles-items--name");

		//make division for link to photographer pages
		var tilesLink = create("div");
		attr(tilesLink, "class", "tiles-items--link");
		tilesLink.appendChild(pageLink);
		tilesLink.appendChild(photographerName);


		//fetch photographer location
		var photographerLocation = create("h3");
		photographerLocation.textContent = photos.photographers[i].city + ", " + photos.photographers[i].country;
		//location style
		attr(photographerLocation, "class", "tiles-items--location");

		//fetch tagline
		var photographerTagline = create("p");
		photographerTagline.textContent = photos.photographers[i].tagline;
		//tagline style
		attr(photographerTagline, "class", "tiles-items--tagline");

		//fetch price
		var photographerPrice = create("p");
		photographerPrice.textContent = photos.photographers[i].price + "€/jour";
		//price style
		attr(photographerPrice, "class", "tiles-items--price");

		//fetch tags
		var photographerTags = create("ul");
		attr(photographerTags, "class", "container-tags container-tags--individual");
		//loop through each tags
		for (var k = 0; k<photos.photographers[i].tags.length; k++) {
			var photographerTagsItems = create("li");
			photographerTagsItems.textContent = "#" + photos.photographers[i].tags[k];
			attr(photographerTagsItems, "value", photographerTagsItems.textContent);
			//tags style
			attr(photographerTagsItems, "class", "container-tags--items photographer-tags");
			//tags position
			photographerTags.appendChild(photographerTagsItems);
		}

		//filter functionality for each tag button
		//get the DOM of the tag element
		var photographerTag = Array.from(document.getElementsByClassName("photographer-tags"));
		//give event listener to each tag
		photographerTag.forEach(item => {
			item.addEventListener("click", function() {
				var tagValue = item.getAttribute("value");
				var photographerTags = Array.from(document.getElementsByClassName("container-tags--individual"));

				photographerTags.forEach(tag => {
				var tagChildren = tag.children;
				for (var b = 0; b<tagChildren.length; b++) {
					if (tagChildren[b].textContent.includes(tagValue)) {
					tag.parentElement.style.display = "block";
					break;
				} else {
					tag.parentElement.style.display = "none";
				}
				}
			})
		})
		})
		
		var tilesItems = document.createElement("article");
		tilesItems.setAttribute("class", "tiles-items");
		//elements inside each tiles
		tilesItems.appendChild(tilesLink);
		tilesItems.appendChild(photographerLocation);
		tilesItems.appendChild(photographerTagline);
		tilesItems.appendChild(photographerPrice);
		tilesItems.appendChild(photographerTags);

		mainTiles.appendChild(tilesItems);
	}
});


//get tags elements on navigation bar
var navigationTags = Array.from(document.getElementsByClassName("navigation-tags"));
//filter function (on navigation bar)
navigationTags.forEach(item => {
	item.addEventListener("click", function() {
		var tagValue = item.getAttribute("value");
		var photographerTags = Array.from(document.getElementsByClassName("container-tags--individual"));

		photographerTags.forEach(tag => {
			var tagChildren = tag.children;
			for (var b = 0; b<tagChildren.length; b++) {
				if (tagChildren[b].textContent.includes(tagValue)) {
				tag.parentElement.style.display = "block";
				break;
			} else {
				tag.parentElement.style.display = "none";
			}
			}
		})
})
});


//DOM of the top menu to bring back the main content
var navigationLabel = document.getElementsByClassName("header--navigation--additional-label");
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





