function ajaxCall(reqType, url, callback) {
	let request = new XMLHttpRequest();
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
//function to get the name from the URL parameter
	let urlParam = window.location.search.substring(1).split("=");
	let nameFromUrl = urlParam[1].replaceAll("_", " ");

//call ajax function to start create elements
//header element (photographer profile)
ajaxCall("GET", "./FishEyeDataFR.json", function(response) {
	response = JSON.parse(response);
	//give title to the page
	let pageTitle = document.querySelector("title")
	pageTitle.textContent = nameFromUrl;

	for (let i = 0; i<response.photographers.length; i++) {
		if (pageTitle.textContent === response.photographers[i].name) {
			//get DOM of the photographer profile section
			let idBlock = document.getElementById("id-block");
			let dataBlock = create("div", {class: "data-block"});

			//create the name element
			let photographerName = create("h1", {class: "tiles-items--name"});
			photographerName.textContent = nameFromUrl;

			//fetch photographer location
			let photographerLocation = create("h2", {class: "tiles-items--location"});
			photographerLocation.textContent = response.photographers[i].city + ", " + response.photographers[i].country;

			//fetch tagline
			let photographerTagline = create("p", {class: "tiles-items--tagline"});
			photographerTagline.textContent = response.photographers[i].tagline;

			//fetch tags
			let photographerTags = create("ul", {class: "container-tags"});
			//loop through each tags
			for (let k = 0; k<response.photographers[i].tags.length; k++) {
				let photographerTagsItems = create("li", {class: "container-tags--items photographer-tags", tabindex: 0, value: response.photographers[i].tags[k]});
				photographerTagsItems.textContent = "#" + response.photographers[i].tags[k];
				//tags for screen reader
				let srOnlyTags = create("span", {class: "sr-only"});
				srOnlyTags.textContent = response.photographers[i].tags[k];
				//tags position
				photographerTags.appendChild(photographerTagsItems);
				photographerTags.appendChild(srOnlyTags);
			}
			//create img element to store the picture
			let imgSamplePhoto = create("img", {class: "tiles-items--photo", alt: response.photographers[i].name});
			//fetch sample image for each photographer using id
			let photographerId = response.photographers[i].id;
			for (let j = 0; j<response.media.length; j++) {
				let samplePhotoId = response.media[j].photographerId;
				if(photographerId == samplePhotoId && Object.prototype.hasOwnProperty.call(response.media[j], "image")) {
					imgSamplePhoto.src = 'sass-partials/images/' + response.media[j].image;
					break;
				}
			}
			//div for picture
			let imgBlock = create("div", {class: "img-block"});

			//photographer price
			//DOM for price
			let photographerPrice = document.getElementById("photographer-price");
			photographerPrice.textContent = response.photographers[i].price;

			//put all elements on to the document
			appendAll(dataBlock, [photographerName, photographerLocation, photographerTagline, photographerTags])
			imgBlock.appendChild(imgSamplePhoto);
			appendAll(idBlock, [dataBlock, imgBlock]);
			//array to store the likes number
			let eachLikesNum = [];

			//media content
			let tiles = document.getElementById("photo-tiles");
			//loop through the media contents
			for (j = 0; j<response.media.length; j++) {
				let mediaPhotographerId = response.media[j].photographerId;
				//check if the media belonged to the same photographer
				if (photographerId === mediaPhotographerId) {
					//see if the media item is an image
					if (Object.prototype.hasOwnProperty.call(response.media[j], "image")) {
						//for initial image
						//use var because this variable will be used outside of this function block
						var mediaItems = create("img", {class: "tiles--img", alt: response.media[j].alt, tabindex: 0});
						mediaItems.src = 'sass-partials/images/' + response.media[j].image;
						//for modal image
						var mediaModal = create("img", {class: "modal-media", alt: response.media[j].alt});
						mediaModal.src = mediaItems.src;
						//media name
						var mediaName = create("p", {class: "tiles--name"});
						mediaName.textContent = response.media[j].image.replaceAll("_", " ").slice(0, -4);
						//modal name
						var mediaModalName = create("p", {class: "modal-media-name"});
						mediaModalName.textContent = mediaName.textContent;
					//if the media item is a video
					} else if (Object.prototype.hasOwnProperty.call(response.media[j], "video")) {
						//for initial video
						mediaItems = create("video", {class: "tiles--img", alt: response.media[j].alt, tabindex: 0, poster: 'sass-partials/images/' + response.media[j].video.replace("mp4", "JPG")});
						mediaItems.src = 'sass-partials/images/' + response.media[j].video;
						mediaItems.controls = true;
						//for modal video
						mediaModal = create("video", {class: "modal-media", alt: response.media[j].alt});
						mediaModal.src = mediaItems.src;
						mediaModal.controls = true;
						//media name
						mediaName = create("p", {class: "tiles--name"});
						mediaName.textContent = response.media[j].video.replaceAll("_", " ").slice(0, -4);
						//modal name
						mediaModalName = create("p", {class: "modal-media-name"});
						mediaModalName.textContent = mediaName.textContent;
					}
					//parent for modal (lightbox)
					let modalBg = document.getElementsByClassName("modal-bg");

					//create the tag of each picture
					let mediaTag = create("p", {class: "tags--individual sr-only"});
					mediaTag.textContent = response.media[j].tags;
					//tag for modal media
					let mediaModalTag = create("p", {class: "modal-media-tag sr-only"});
					mediaModalTag.textContent = response.media[j].tags;
					//media prices
					let price = create("p", {class: "tiles--details--price"});
					price.textContent = response.media[j].price + "€";
					//likes
					let likes = create("p", {class: "tiles--details--likes--number"});
					likes.textContent = response.media[j].likes;
					//likes icon
					let likesIcon = create("i", {class: "fas fa-heart tiles--details--likes--icon"});
					attr(likesIcon, "aria-label", "likes");
					//on click the icon, +1 like
					likesIcon.onclick = function() {
						this.previousSibling.textContent++;
						let totalLikes = document.getElementById("photographer-total-likes");
						totalLikes.textContent++;
					}
					//push to global let of likes
					eachLikesNum.push(parseInt(likes.textContent, 10));

					//media details block
					let mediaDetails = create("div", {class: "tiles--details"});
					//grouping the media details
					appendAll(mediaDetails, [price, likes, likesIcon]);

					//DOM
					let imageTiles = create("article", {class: "tiles"});
					attr(imageTiles, "date-taken", response.media[j].date);
					appendAll(imageTiles, [mediaItems, mediaName, mediaDetails, mediaTag]);
					tiles.appendChild(imageTiles);
					//modal content
					let modalContent = create("div", {class: "modal-content", likes: response.media[j].likes});
					attr(modalContent, "date-taken", response.media[j].date);
					appendAll(modalContent, [mediaModal, mediaModalName, mediaModalTag]);
					modalBg[0].appendChild(modalContent);
				}
			} //take the total likes DOM
			let totalLikes = document.getElementById("photographer-total-likes");
			let addAll = (acc, curValue) => acc + curValue;
			totalLikes.textContent = eachLikesNum.reduce(addAll);

			//filter DOM
			let filterTags = Array.from(document.getElementsByClassName("photographer-tags"));
			let modalContents = Array.from(document.getElementsByClassName("modal-content"));
			let modalParent = Array.from(document.getElementsByClassName("modal-bg"));
			let modalMediaTag = Array.from(document.getElementsByClassName("modal-media-tag"));
			//filter functionality
			filterTags.forEach(tag => {
				tag.onclick = function() {
					//make sure all modal elements are in place
					modalContents.forEach(content => {
						modalParent[0].appendChild(content);
					})
					//filtering main tile's content
					let tagValue = tag.getAttribute("value");
					let photographerTags = Array.from(document.getElementsByClassName("tags--individual"));
					photographerTags.forEach(tag => {
						if (tag.textContent == tagValue) {
							tag.parentElement.style.display = "block";
						} else {
							tag.parentElement.style.display = "none";
						}
					})
					//filtering modal contents
					modalMediaTag.forEach(tag => {
						if (tag.textContent != tagValue) {
							modalParent[0].removeChild(tag.parentElement);
						}
					})
					removeStyle(filterTags);
					tag.style.backgroundColor = "#901C1C";
					tag.style.color = "white";
				}
				//on enter button
				tag.addEventListener("keyup", function(e) {
					if (e.keyCode == 13) {
						tag.click();
					}
				})
			})
		}
	}
});

//DOM of contact form
let formModalBg = document.getElementById("bg-form-modal");
//contact button DOM
let contactBtn = document.getElementById("contact-btn");
//open form on click
contactBtn.addEventListener("click", function () {
	formModalBg.style.display = "block";
	firstName.focus();
});
//open form on enter
contactBtn.addEventListener("keyup", function(e) {
	if (e.keyCode === 13) {
		contactBtn.click();
	}
})
//take close button
let close = Array.from(document.getElementsByClassName("close"));
//function to exit modals
function exit(i, element) {
	close[i].addEventListener("click", function() {
		element.style.display = "none";
	})
}
//DOM of lightbox
let modalBg = document.getElementsByClassName("modal-bg");
exit(1, formModalBg);
exit(2, formModalBg);

//name on the contact form
let contactFormName = document.getElementById("photographer-name");
contactFormName.textContent = nameFromUrl;

//contact form submission
//DOM for form input fields
let firstName = document.getElementById("first");
let lastName = document.getElementById("last");
let email = document.getElementById("email");
let message = document.getElementById("message");

//form data DOM
let formData = Array.from(document.querySelectorAll(".form-data"));

//function to show error message
function showError(index, message) {
	formData[index].setAttribute("data-error", message);
	formData[index].setAttribute("data-error-visible", true);
}

//function to hide error when input is valid
function hideError(index) {
	formData[index].removeAttribute("data-error");
	formData[index].removeAttribute("data-error-visible");
}

//valid condition
let valid = true;

//first name validation function
//regex for name formats, not allowing space at the start and end
let nameRegex = /^[^\s]+(\s+[^\s]+)*$/;
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
}
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
 }
 //onblur validation
lastName.addEventListener('blur', validateLastName);

//email validation function
function validateEmail() {
	let regexEmail = /.+@.+\..+/;
	if (!regexEmail.test(email.value)) {
		valid = false;
		message = "Veuillez entrer une adresse email valide.";
		showError(2, message);
	} else {
		valid;
		hideError(2);
	}
	return valid;
}
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
let submitButton = document.getElementById("submit-btn");
//validation on clicking the submit button
submitButton.addEventListener("click", validate);

//function on clicking the submit button, AJAX request
function validate (e) {
	e.preventDefault();
	let request = new XMLHttpRequest();
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
		let successMessage = document.getElementById("formResult");
		let successMessageText = document.getElementById("formResultText");
		let message = "Merci pour votre message !";
		successMessageText.textContent = message;
		successMessage.style.display = "block";
		console.log("First name: " + firstName.value);
		console.log("Last name: " + lastName.value);
		console.log("Email: " + email.value);
	}
	return valid;
}

//Close button on modal
//close button DOM
let modalCloseBtn = document.getElementById("close-btn--validation");
//redirecting to index.html on click
modalCloseBtn.onclick = function() {
	let successMessage = document.getElementById("formResult");
	formModalBg.style.display = "none";
	document.querySelector("form").reset();
	successMessage.style.display = "none";
};

//image modals
//open modal images
document.addEventListener("click", function(e) {
	if (e.target.matches(".tiles--img")) {
		document.getElementsByClassName("modal-bg")[0].classList.add("show");
		let picName = e.target.nextSibling.textContent;
		
		let modalMediaName = Array.from(document.getElementsByClassName("modal-media-name"));
		modalMediaName.forEach(name => {
			if (picName == name.textContent) {
				name.parentElement.classList.add("current-modal");
			} else {
				name.parentElement.classList.remove("current-modal");
			}
		})
		prevBtn.removeAttribute("style");
		nextBtn.removeAttribute("style");		
	}
}, false)
//open modal on clicking enter
document.addEventListener("keyup", function(e) {
	if (e.target.matches(".tiles--img")) {
		if (e.keyCode === 13) {
			e.target.click()
		}
	}
}, false)

//close media modal
close[0].addEventListener("click", function() {
	document.getElementsByClassName("modal-bg")[0].classList.remove("show");
});
//close modals by esc key
document.addEventListener("keyup", function(e) {
	if (e.keyCode == 27) {
		close.forEach(close => {close.click()});
	}
})

//next button DOM
let nextBtn = document.getElementById("next-img");
//prev button DOM
let prevBtn = document.getElementById("prev-img");

//next image
nextBtn.addEventListener("click", function() {
	let modalContent = document.getElementsByClassName("modal-content");
	for (let i = 0; i<modalContent.length-1; i++) {
		if (modalContent[i].classList.contains("current-modal")) {
			if (i<modalContent.length-2) {
				modalContent[i].classList.remove("current-modal");
				modalContent[i+=1].classList.add("current-modal");
				prevBtn.removeAttribute("style");
			} else {
				modalContent[i].classList.remove("current-modal");
				modalContent[i+=1].classList.add("current-modal");
				nextBtn.style.display = "none";
			}
		} 
	}	
});
//next image by right arrow
document.addEventListener("keyup", function(e) {
	if (e.keyCode == 39 && document.getElementsByClassName("modal-bg")[0].classList.contains("show")) {
		document.getElementById("next-img").click();
	}
})

//prev image
prevBtn.addEventListener("click", function() {
	let modalContent = document.getElementsByClassName("modal-content");
	for (let i = modalContent.length - 1; i>0; i--) {
		if (modalContent[i].classList.contains("current-modal")) {
			if (i>1) {
				modalContent[i].classList.remove("current-modal");
				modalContent[i-=1].classList.add("current-modal");
				nextBtn.removeAttribute("style");
			} else {
				modalContent[i].classList.remove("current-modal");
				modalContent[i-=1].classList.add("current-modal");
				prevBtn.style.display = "none";
			}
		}
	}
});
//prev image by left arrow
document.addEventListener("keyup", function(e) {
	if (e.keyCode == 37 && document.getElementsByClassName("modal-bg")[0].classList.contains("show")) {
		document.getElementById("prev-img").click();
	}
})

//get style of element
function getStyle(el, name) {
	if (document.defaultView && document.defaultView.getComputedStyle) {
		let style = document.defaultView.getComputedStyle(el, null);
		if (style)
			return style[name];
	}
	//for IE
	else if(el.currentStyle)
		return el.currentStyle[name];
}
//sorting the elements
//DOM of all media tiles
let tiles = document.getElementById("photo-tiles");
let hidden = document.getElementById("hidden");
//sort button
let sortBtn = document.getElementById("sort-show");
//open the full sorting list
sortBtn.addEventListener("click", function() {
  if (getStyle(hidden, "display") == "none") {
    hidden.style.display = "block";
    attr(sortBtn, "aria-expanded", true);
  } else {
    hidden.style.display = "none";
    attr(sortBtn, "aria-expanded", false);
  }
})

//sorting function
//DOM of the selected sort function
let sortBy = document.getElementById("sort-by");
//DOM of sort buttons
let sortByLikes = document.getElementById("sort-likes");
let sortByDate = document.getElementById("sort-date");
let sortByName = document.getElementById("sort-name");
//class DOM of the sort button
let sortOptions = document.getElementsByClassName("sort-content--item");
//function to remove inline style attribute
function removeStyle(toReset) {
	for (let i = 0; i<toReset.length; i++) {
		if (toReset[i].hasAttribute("style")) {
			toReset[i].removeAttribute("style");
		}
	}
}
//sort by popularity
sortByLikes.onclick = function() {
	//DOM of children to be sorted
	let toSort = tiles.querySelectorAll(".tiles");
	//sort main tile by popularity and return the sorted content back to DOM
	Array.prototype.map.call(toSort, function (node) {
		return {
			node: node,
			popularity: node.querySelector(".tiles--details--likes--number").textContent
		};
	}).sort(function(a,b) {
		return b.popularity - a.popularity;
	}).forEach(function(item) {
		tiles.appendChild(item.node);
	})
	//modal elements
	let modalContent = modalBg[0].querySelectorAll(".modal-content");
	//sort modal elements by popularity
	Array.prototype.map.call(modalContent, function (node) {
		return {
			node: node,
			popularity: node.getAttribute("likes")
		};
	}).sort(function(a,b) {
		return b.popularity - a.popularity;
	}).forEach(function(item) {
		modalBg[0].appendChild(item.node);
	})
	//sort menu display
	hidden.removeAttribute("style");
	removeStyle(sortOptions);
	//show the selected filter
	sortBy.textContent = "Popularité";
	sortByLikes.style.display = "none";
	//aria attributes
	attr(sortBtn, "aria-activedescendant", "sort-likes");
	ariaSelected("sort-likes");
}
//by clicking enter
sortByLikes.addEventListener("keyup", function(e) {
	if (e.keyCode == 13) {
		sortByLikes.click();
	}
})	
//sort by date
sortByDate.onclick = function() {
	//DOM of children to be sorted
	let toSort = tiles.querySelectorAll(".tiles");
	//sort main tile by date
	sortDate(toSort, tiles);
	//modal elements
	let modalContent = modalBg[0].querySelectorAll(".modal-content");
	//sort modal elements
	sortDate(modalContent, modalBg[0]);
	//sorting menu display control
	hidden.removeAttribute("style");
	removeStyle(sortOptions);
	//show the selected filter
	sortBy.textContent = "Date";
	sortByDate.style.display = "none";
	//aria attributes
	attr(sortBtn, "aria-activedescendant", "sort-date");
	ariaSelected("sort-date");
}
//by clicking enter
sortByDate.addEventListener("keyup", function(e) {
	if (e.keyCode == 13) {
		sortByDate.click();
	}
})
//sort by name
sortByName.onclick = function() {
	//DOM of children to be sorted
	let toSort = tiles.querySelectorAll(".tiles");
	//sort main tile by name
	sortName(toSort, ".tiles--name", tiles);
	//modal elements
	let modalContent = modalBg[0].querySelectorAll(".modal-content");
	//sort modal elements by name
	sortName(modalContent, ".modal-media-name", modalBg[0]);
	//sorting menu display control
	hidden.removeAttribute("style");
	removeStyle(sortOptions);
	//show the selected filter
	sortBy.textContent = "Titre";
	sortByName.style.display = "none";
	//aria attributes
	attr(sortBtn, "aria-activedescendant", "sort-name");
	ariaSelected("sort-name");
}
//by clicking enter
sortByName.addEventListener("keyup", function(e) {
	if (e.keyCode == 13) {
		sortByName.click();
	}
})
//sort by date function
function sortDate(toSort, parentElement) {
	Array.prototype.map.call(toSort, function (node) {
	return {
		node: node,
		date: node.getAttribute("date-taken").replaceAll("-", "")
	};
}).sort(function(a,b) {
	return a.date > b.date ? 1 : -1;
}).forEach(function(item) {
	parentElement.appendChild(item.node);
});
}
//sort by name function
function sortName(toSort, sortReq, parentElement) {
	Array.prototype.map.call(toSort, function(node) {
		return {
			node: node,
			name: node.querySelector(sortReq).textContent
		};
	}).sort(function(a,b) {
		return a.name.localeCompare(b.name);
	}).forEach(function(item) {
		parentElement.appendChild(item.node);
	});
}
//aria-selected function
function ariaSelected(selectedProperty) {
	for (let i = 0; i<sortOptions.length; i++) {
		if (sortOptions[i].getAttribute("id") == selectedProperty) {
			attr(sortOptions[i], "aria-selected", "true");
		} else {
			attr(sortOptions[i], "aria-selected", "false");
		}
	}
}