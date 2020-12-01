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
//element creation function
function create(element) {
	var name = document.createElement(element);
	return name;
}
//attribute function
function attr(element, attrName, attrValue) {
	element.setAttribute(attrName, attrValue);
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
			var dataBlock = create("div");
			attr(dataBlock, "class", "data-block");

			//create the name element
			var photographerName = create("h1");
			photographerName.textContent = nameFromUrl;
			//give class to element
			attr(photographerName, "class", "tiles-items--name");
			//put into the parent element
			

			//fetch photographer location
			var photographerLocation = create("h2");
			photographerLocation.textContent = response.photographers[i].city + ", " + response.photographers[i].country;
			//location style
			attr(photographerLocation, "class", "tiles-items--location");

			//fetch tagline
			var photographerTagline = create("p");
			photographerTagline.textContent = response.photographers[i].tagline;
			//tagline style
			attr(photographerTagline, "class", "tiles-items--tagline");

			//fetch tags
			var photographerTags = create("ul");
			attr(photographerTags, "class", "container-tags");
			//loop through each tags
			for (var k = 0; k<response.photographers[i].tags.length; k++) {
				var photographerTagsItems = create("li");
				photographerTagsItems.textContent = "#" + response.photographers[i].tags[k];
				attr(photographerTagsItems, "value", response.photographers[i].tags[k]);
				//tags style
				attr(photographerTagsItems, "class", "container-tags--items photographer-tags");
				attr(photographerTagsItems, "tabindex", "0");
				//tags for screen reader
				var srOnlyTags = create("span");
				srOnlyTags.textContent = response.photographers[i].tags[k];
				attr(srOnlyTags, "class", "sr-only");
				//tags position
				photographerTags.appendChild(photographerTagsItems);
				photographerTags.appendChild(srOnlyTags);
			}

			//create img element to store the picture
			var imgSamplePhoto = create("img");
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
			attr(imgSamplePhoto, "alt", response.photographers[i].name);
			//image style
			attr(imgSamplePhoto, "class", "tiles-items--photo");
			//div for picture
			var imgBlock = create("div");
			attr(imgBlock, "class", "img-block");
			//photographer price
			//DOM for price
			var photographerPrice = document.getElementById("photographer-price");
			photographerPrice.textContent = response.photographers[i].price;



			//put all elements on to the document
			dataBlock.appendChild(photographerName);
			dataBlock.appendChild(photographerLocation);
			dataBlock.appendChild(photographerTagline);
			dataBlock.appendChild(photographerTags);
			imgBlock.appendChild(imgSamplePhoto);

			idBlock.appendChild(dataBlock);
			idBlock.appendChild(imgBlock);
			//array to store the likes number
			var eachLikesNum = [];

			//media content
			var tiles = document.getElementById("photo-tiles");
			var photographerId = response.photographers[i].id;
			//loop through the media contents
			for (var j = 0; j<response.media.length; j++) {
				var mediaPhotographerId = response.media[j].photographerId;
				var mediaIndex = j;
				//check if the media belonged to the same photographer
				if (photographerId === mediaPhotographerId) {
					//see if the media item is an image
					if (response.media[j].hasOwnProperty("image")) {
						//for initial image
						var mediaItems = create("img");
						mediaItems.src = 'sass-partials/images/' + response.media[j].image;
						//for modal image
						var mediaModal = create("img");
						mediaModal.src = mediaItems.src;
						//media name
						var mediaName = create("p");
						mediaName.textContent = response.media[j].image.replaceAll("_", " ").slice(0, -4);
						//modal name
						var mediaModalName = create("p");
						mediaModalName.textContent = mediaName.textContent;
					//if the media item is a video
					} else if (response.media[j].hasOwnProperty("video")) {
						//for initial video
						var mediaItems = create("video");
						mediaItems.src = 'sass-partials/images/' + response.media[j].video;
						mediaItems.controls = true;
						//for modal video
						var mediaModal = create("video");
						mediaModal.src = mediaItems.src;
						mediaModal.controls = true;
						//media name
						var mediaName = create("p");
						mediaName.textContent = response.media[j].video.replaceAll("_", " ").slice(0, -4);

						//modal name
						var mediaModalName = create("p");
						mediaModalName.textContent = mediaName.textContent;
					}
					//media on initial size
					attr(mediaItems, "class", "tiles--img");
					attr(mediaName, "class", "tiles--name");

					//on modal
					attr(mediaModal, "class", "modal-media");
					attr(mediaModalName, "class", "modal-media-name");

					
					var initialMedia = document.getElementsByClassName("tiles--img");
					var allModalImg = document.getElementsByClassName("modal-content");
					var modalBg = document.getElementById("modal-bg");

					
					//get the tag of each picture
					var mediaTag = create("p");
					mediaTag.textContent = response.media[j].tags;
					attr(mediaTag, "class", "tags--individual sr-only");
					
					

					//media prices
					var price = create("p");
					price.textContent = response.media[j].price + "€";
					attr(price, "class", "tiles--details--price");
					//likes
					var likes = create("p");
					likes.textContent = response.media[j].likes;
					attr(likes, "class", "tiles--details--likes--number");
					//likes icon
					var likesIcon = create("i");
					attr(likesIcon, "class", "fas fa-heart tiles--details--likes--icon");
					//on click the icon, +1 like
					likesIcon.onclick = function() {
						this.previousSibling.textContent++;
						var totalLikes = document.getElementById("photographer-total-likes");
						totalLikes.textContent++;
					}
					//push to global var of likes
					eachLikesNum.push(parseInt(likes.textContent, 10));


					//media details block
					var mediaDetails = create("div");
					attr(mediaDetails, "class", "tiles--details");
					//grouping the media details
					mediaDetails.appendChild(price);
					mediaDetails.appendChild(likes);
					mediaDetails.appendChild(likesIcon);
					
					//DOM
					var imageTiles = create("article");
					imageTiles.setAttribute("class", "tiles");
					imageTiles.appendChild(mediaItems);
					imageTiles.appendChild(mediaName);
					imageTiles.appendChild(mediaDetails);
					imageTiles.appendChild(mediaTag);
					tiles.appendChild(imageTiles);
					//modal content
					var modalContent = create("div");
					attr(modalContent, "class", "modal-content");
					modalContent.appendChild(mediaModal);
					modalContent.appendChild(mediaModalName);
					modalBg.appendChild(modalContent);
				}

			} //take the total likes DOM
				var totalLikes = document.getElementById("photographer-total-likes");
				var addAll = (acc, curValue) => acc + curValue;
				totalLikes.textContent = eachLikesNum.reduce(addAll);
		}
	}
});


//DOM of contact form
var formModalBg = document.getElementById("bg-form-modal");
//contact button DOM
var contactBtn = document.getElementById("contact-btn");
//open form on click
contactBtn.addEventListener("click", function () {
	formModalBg.style.display = "block";
});
//open form on enter
contactBtn.addEventListener("keyup", function(e) {
	if (e.keyCode === 13) {
		contactBtn.click();
	}
})

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
exit(0, modalBg);
exit(1, formModalBg);
exit(2, formModalBg);


//tags filter function
document.addEventListener("click", function(e) {
	if (e.target.matches(".photographer-tags")) {
		var tagValue = e.target.getAttribute("value");
				var photographerTags = Array.from(document.getElementsByClassName("tags--individual"));

				photographerTags.forEach(tag => {
				if (tag.textContent == tagValue) {
					tag.parentElement.style.display = "block";
				} else {
					tag.parentElement.style.display = "none";
				}
				})
	}
}, false)
//on clicking enter
document.addEventListener("keyup", function(e) {
	if (e.target.matches(".photographer-tags")) {
		if (e.keyCode === 13) {
			e.target.click()
		}
	}
}, false)


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


 //image modals
//class of photo tiles (initial size)
var medias = Array.from(document.getElementsByClassName("tiles--img"));
//modal images

document.addEventListener("click", function(e) {
	if (e.target.matches(".tiles--img")) {
		document.getElementById("modal-bg").style.display = "block";
		var picName = e.target.nextSibling.textContent;
		
		var modalMediaName = Array.from(document.getElementsByClassName("modal-media-name"));
		modalMediaName.forEach(name => {
			if (picName == name.textContent) {
				name.parentElement.style.display = "block";
			} else {
				name.parentElement.style.display = "none";
			}
		})		
	}
}, false)



/*//var slideIndex = 0;
function showSlides(n) {
	var modalMedia = Array.from(document.getElementsByClassName("modal-content"));

 	for (i = 0; i < modalMedia.length; i++) {
   		modalMedia[i].style.display = "none";
  	}
  	modalMedia[n].style.display = "block";
}*/








