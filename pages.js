function ajaxCall(reqType, url, callback) {
	var request = new XMLHttpRequest();
	request.open(reqType, url);
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

//function to get the name from the URL parameter
	var urlParam = window.location.search.substring(1).split("=");
	var nameFromUrl = urlParam[1].replaceAll("_", " ");

//call ajax function to start create elements
//header element (photographer profile)
ajaxCall("GET", "http://localhost/P6_OC/FishEyeDataFR.json", function(response) {
	var response = JSON.parse(response);

	var pageTitle = document.querySelector("title")
	pageTitle.textContent = nameFromUrl;

	for (var i = 0; i<response.photographers.length; i++) {
		if (pageTitle.textContent === response.photographers[i].name) {
			//get DOM of the photographer profile section
			var idBlock = document.getElementById("id-block");
			var dataBlock = document.createElement("div");
			dataBlock.setAttribute("class", "data-block");

			//create the name element
			var photographerName = document.createElement("h1");
			photographerName.textContent = nameFromUrl;
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

//DOM of contact form
var formModalBg = document.getElementById("bg-form-modal");
//contact button DOM
var contactBtn = document.getElementById("contact-btn");
contactBtn.addEventListener("click", function () {
	formModalBg.style.display = "block";
});

//take close button
var close = document.getElementsByClassName("close");
//function to exit modals
function exit(i, element) {
	close[i].addEventListener("click", function() {
		element.style.display = "none";
	})
}
//DOM of lightbox
var modalBg = document.getElementById("modal-bg");
exit(1, formModalBg);
exit(0, modalBg);
exit(2, formModalBg);

//name on the contact form
var contactFormName = document.getElementById("photographer-name");
contactFormName.textContent = nameFromUrl;

//contact form submission
//DOM for form input fields
var firstName = document.getElementById("first");
var lastName = document.getElementById("last");
var email = document.getElementById("email");
var message = document.getElementById("message");

//form data DOM
var formData = Array.from(document.querySelectorAll(".form-data"));

//function to show error message
function showError(index, message) {
	formData[index].setAttribute("data-error", message);
	formData[index].setAttribute("data-error-visible", true);
};

//function to hide error when input is valid
function hideError(index) {
	formData[index].removeAttribute("data-error");
	formData[index].removeAttribute("data-error-visible");
};

//valid condition
valid = true;

//first name validation function
//regex for name formats, not allowing space at the start and end
var nameRegex = /^[^\s]+(\s+[^\s]+)*$/;
function validateFirstName() {
	if (!nameRegex.test(firstName.value) || firstName.value.length < 2) {
 		valid = false;
 		message = "Veuillez entrer 2 caractères ou plus pour le champ du prénom.";
		showError(0, message);		
 	} else {
 		valid;
 		hideError(0);	
 	}
 	return valid;
 };
//onblur validation
firstName.addEventListener('blur', validateFirstName);

//last name validation function
function validateLastName() {
	if (!nameRegex.test(lastName.value) || lastName.value.length < 2) {
 		valid = false;
 		message = "Veuillez entrer 2 caractères ou plus pour le champ du nom.";
 		showError(1, message);

 	} else {
 		valid;
 		hideError(1);
 	}
 	return valid;
 };
 //onblur validation
lastName.addEventListener('blur', validateLastName);

//email validation function
function validateEmail() {
	var regexEmail = /.+@.+\..+/;
 	if (!regexEmail.test(email.value)) {
 		valid = false;
 		message = "Veuillez entrer une adresse email valide.";
 		showError(2, message);
 	} else {
 		valid;
 		hideError(2);
 	}
 	return valid;
};
//onblur validation
email.addEventListener('blur', validateEmail);

//message validation function
function validateMessage() {
	if (!nameRegex.test(message.value)) {
		valid = false;
		message = "Veuillez entrer votre message.";
		showError(3, message);
	} else {
		valid;
		hideError(3);
	}
	return valid;
}
//onblur validation
message.addEventListener('blur', validateMessage);

//onsubmit form verification
//submit button DOM
var submitButton = document.getElementById("submit-btn");
//validation on clicking the submit button
submitButton.addEventListener("click", validate);

//function on clicking the submit button, AJAX request
function validate (e) {
	e.preventDefault();
	var request = new XMLHttpRequest();
	request.onload = validateForm();
}

//function to validate form onsubmit
function validateForm () {
 	valid = true;
 	//first name validation
 	validateFirstName();
 	//last name validation
 	validateLastName();
 	//email validation
 	validateEmail();
 	//message validation
 	validateMessage();

 	//valid form, show success message
 	if (valid) {
 		var successMessage = document.getElementById("formResult");
 		var successMessageText = document.getElementById("formResultText");
 		var message = "Merci pour votre message !";
 		successMessageText.textContent = message;
 		successMessage.style.display = "block";

 	}

 	return valid;
 }

 //Close button on modal
 //close button DOM
 var modalCloseBtn = document.getElementById("close-btn--validation");
 //redirecting to index.html on click
 modalCloseBtn.onclick = function() {
 	var successMessage = document.getElementById("formResult");
 	formModalBg.style.display = "none";
 	document.querySelector("form").reset();
 	successMessage.style.display = "none";
 };

