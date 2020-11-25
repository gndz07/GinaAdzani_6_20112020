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

//call ajax function to start create elements
//header element (photographer profile)
ajaxGet("./FishEyeDataFR.json", function(response) {
	var response = JSON.parse(response);
	var pageTitle = document.querySelector("title").textContent;

	for (var i = 0; i<response.photographers.length; i++) {
		if (pageTitle === response.photographers[i].name) {
			//get DOM of the photographer profile section
			var idBlock = document.getElementById("id-block");
			var dataBlock = document.createElement("div");
			dataBlock.setAttribute("class", "data-block");

			//create the name element
			var photographerName = document.createElement("h1");
			photographerName.textContent = pageTitle;
			//give class to element
			photographerName.setAttribute("class", "tiles-items--name");
			//put into the parent element
			

			//fetch photographer location
			var photographerLocation = document.createElement("h2");
			photographerLocation.textContent = response.photographers[i].city + ", " + response.photographers[i].country;
			//location style
			photographerLocation.setAttribute("class", "tiles-items--location");

			//fetch tagline
			var photographerTagline = document.createElement("p");
			photographerTagline.textContent = response.photographers[i].tagline;
			//tagline style
			photographerTagline.setAttribute("class", "tiles-items--tagline");

			//fetch tags
			var photographerTags = document.createElement("ul");
			photographerTags.setAttribute("class", "container-tags");
			//loop through each tags
			for (var k = 0; k<response.photographers[i].tags.length; k++) {
				var photographerTagsItems = document.createElement("li");
				photographerTagsItems.textContent = "#" + response.photographers[i].tags[k];
				photographerTagsItems.setAttribute("value", photographerTagsItems.textContent);
				//tags style
				photographerTagsItems.setAttribute("class", "container-tags--items");
				//tags position
				photographerTags.appendChild(photographerTagsItems);
			}

			//create img element to store the picture
			var imgSamplePhoto = document.createElement("img");
			//fetch sample image for each photographer using id
			var photographerId = response.photographers[i].id;
			for (var j = 0; j<response.media.length; j++) {
				var mediaPhotographerId = response.media[j].photographerId;

				if(photographerId == mediaPhotographerId && response.media[j].hasOwnProperty("image")) {
					imgSamplePhoto.src = 'sass-partials/images/' + response.media[j].image;
					break;
				}
			}
			//image alt text
			var altText = "Photo par " + response.photographers[i].name;
			imgSamplePhoto.setAttribute("alt", altText);
			//image style
			imgSamplePhoto.setAttribute("class", "tiles-items--photo");
			//div for picture
			var imgBlock = document.createElement("div");
			imgBlock.setAttribute("class", "img-block");



			//put all elements on to the document
			dataBlock.appendChild(photographerName);
			dataBlock.appendChild(photographerLocation);
			dataBlock.appendChild(photographerTagline);
			dataBlock.appendChild(photographerTags);
			imgBlock.appendChild(imgSamplePhoto);

			idBlock.appendChild(dataBlock);
			idBlock.appendChild(imgBlock);

			//media content
			var tiles = document.getElementById("photo-tiles");
			var photographerId = response.photographers[i].id;
			//loop through the media contents
			for (var j = 0; j<response.media.length; j++) {
				var mediaPhotographerId = response.media[j].photographerId;
				//check if the media belonged to the same photographer
				if (photographerId === mediaPhotographerId) {
					//see if the media item is an image
					if (response.media[j].hasOwnProperty("image")) {
						var mediaItems = document.createElement("img");
						mediaItems.src = 'sass-partials/images/' + response.media[j].image;
						//media name
						var mediaName = document.createElement("p");
						mediaName.textContent = response.media[j].image.replaceAll("_", " ").slice(0, -4);
					//if the media item is a video
					} else if (response.media[j].hasOwnProperty("video")) {
						var mediaItems = document.createElement("video");
						mediaItems.src = 'sass-partials/images/' + response.media[j].video;
						mediaItems.controls = true;
						//media name
						var mediaName = document.createElement("p");
						mediaName.textContent = response.media[j].video.replaceAll("_", " ").slice(0, -4);
					}
					//media on initial size
					mediaItems.setAttribute("class", "tiles--img");
					mediaName.setAttribute("class", "tiles--name");

					//trigger the modal appearance
					mediaItems.addEventListener("click", function() {
						if (this.tagName.toLowerCase() == "img") {
							//create image inside the modal
							var modalImg = document.createElement("img");
						} else if (this.tagName.toLowerCase() == "video") {
							//create video inside the modal
							var modalImg = document.createElement("video");
							modalImg.controls = true;
						}
						//take modal element
						var modalBg = document.getElementById("modal-bg");
						modalBg.appendChild(modalImg);
						modalImg.setAttribute("id", "modal-img");
						modalBg.style.display = "block";
						modalImg.src = this.src;
					});
					

					//media prices
					var price = document.createElement("p");
					price.textContent = response.media[j].price + "€";
					price.setAttribute("class", "tiles--details--price");
					//likes
					var likes = document.createElement("p");
					likes.textContent = response.media[j].likes;
					likes.setAttribute("class", "tiles--details--likes--number");
					//likes icon
					var likesIcon = document.createElement("i");
					likesIcon.setAttribute("class", "fas fa-heart tiles--details--likes--icon");


					//function to show slides
					function showSlide() {
						var i;
						var images = document.getElementsByClassName("")
					}
					//take previous button element
					var prevImg = document.getElementsByClassName("fa-chevron-left");
					//function on clicking previous button
					prevImg.onclick = function() {
						
					}
					//take next button element
					var nextImg = document.getElementsByClassName("fa-chevron-right");


					//media details block
					var mediaDetails = document.createElement("div");
					mediaDetails.setAttribute("class", "tiles--details");
					//grouping the media details
					mediaDetails.appendChild(price);
					mediaDetails.appendChild(likes);
					mediaDetails.appendChild(likesIcon);
					

					var imageTiles = document.createElement("article");
					imageTiles.setAttribute("class", "tiles");
					imageTiles.appendChild(mediaItems);
					imageTiles.appendChild(mediaName);
					imageTiles.appendChild(mediaDetails);
					tiles.appendChild(imageTiles);
				}


			}

			break;

		}
	}
});

//take close button
var close = document.getElementById("close");
//click on close button
close.onclick = function() {
	var modalBg = document.getElementById("modal-bg");
	modalBg.style.display = "none";
};

/*
//contact button DOM
var contactBtn = document.getElementById("contact-btn");
contactBtn.addEventListener("click", function () {
	var modalBg = document.getElementById("modal-bg");
	modalBg.style.display = "block";
});
*/
