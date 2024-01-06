window.onload = function () {
    var startLat = 44.4268;
    var startLong =  26.1025
    var map = L.map('map').setView([startLat, startLong], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var popupContent = `
    <p>Have you been here and made a nice memory?</p>
    <div class="d-grid gap-2 d-md-flex justify-content-md">
        <button id="btnYes" type="button" class="btn btn-outline-primary btn-sm" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Yes, let me add an image!</button>
        <button id="btnNO" type="button" class="btn btn-outline-primary btn-sm">No, maybe in the near future...</button>
    </div>

`;

var noImages = 0;
var markers = [];
const markerImageKeys = {};

var carouselContainer = document.createElement('div');

function onMapClick(e) {
    var popup = L.popup({interactive: true})
        .setLatLng(e.latlng)
        .setContent(popupContent)
        .openOn(map);

    var customIcon = L.divIcon({
        className: 'custom-marker'
    });
    
    let activeMarker = null;
    const keys= [];
    var isMarkerHovering = false;
    var isPopupHovering = false;

    carouselContainer = document.createElement('div');  


    function updateCarousel(carouselContainer, imageUrls) {
        const inner = carouselContainer.querySelector('.carousel-inner');
        inner.innerHTML = ''; // Clear all previous items
        
        imageUrls.forEach((imageUrl, index) => {
            const item = document.createElement('div');
            item.classList.add('carousel-item');
            
            if (index === 0) {
                item.classList.add('active');
            }
            
            const img = document.createElement('img');
            img.classList.add('d-block', 'w-100');
            img.src = imageUrl;
            
            img.onload = function() {
                const imgWidth = img.width;
                const imgHeight = img.height;
                
                carouselContainer.style.width = `${imgWidth}px`; // Set container width based on image
                carouselContainer.style.height = `${imgHeight}px`; // Set container height based on image
            };
            
            item.appendChild(img);
            inner.appendChild(item);
        });
    }
    

    function createCarousel(imageUrls) {
        const carouselContainer = document.createElement('div');
        const uniqueCarouselID = `carouselContainer_${Date.now()}`; // Create a unique ID for each carousel
        carouselContainer.id = uniqueCarouselID;
        carouselContainer.id = 'carouselContainer';
        carouselContainer.style.minWidth = '200px';
        carouselContainer.style.minHeight = '200px';
        carouselContainer.classList.add('carousel-container');
    
        // Create the carousel HTML structure
        const carousel = document.createElement('div');
        carousel.classList.add('carousel', 'slide');
        carousel.setAttribute('data-bs-ride', 'carousel');
    
        const inner = document.createElement('div');
        inner.classList.add('carousel-inner');
    
        imageUrls.forEach((imageUrl, index) => {
            const item = document.createElement('div');
            item.classList.add('carousel-item');
            if (index === 0) {
                item.classList.add('active');
            }
    
            const img = document.createElement('img');
            img.classList.add('d-block', 'w-100');
            img.src = imageUrl;
    
            img.onload = function() {
                const imgWidth = img.width;
                const imgHeight = img.height;
    
                carouselContainer.style.width = `${imgWidth}px`; // Set container width based on image
                carouselContainer.style.height = `${imgHeight}px`; // Set container height based on image
            };
    
            item.appendChild(img);
            inner.appendChild(item);
        });
    
        carousel.appendChild(inner);
    
        // Previous and Next buttons for navigation
        const prevButton = document.createElement('button');
        prevButton.classList.add('carousel-control-prev');
        prevButton.setAttribute('type', 'button');
        prevButton.setAttribute('data-bs-target', '#carouselContainer');
        prevButton.setAttribute('data-bs-slide', 'prev');
        prevButton.innerHTML = `
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
        `;
    
        const nextButton = document.createElement('button');
        nextButton.classList.add('carousel-control-next');
        nextButton.setAttribute('type', 'button');
        nextButton.setAttribute('data-bs-target', '#carouselContainer');
        nextButton.setAttribute('data-bs-slide', 'next');
        nextButton.innerHTML = `
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
        `;
    
        carousel.appendChild(prevButton);
        carousel.appendChild(nextButton);
    
        // Button slide for adding pictures
        const addButtonSlide = document.createElement('div');
        addButtonSlide.classList.add('carousel-item');
    
        const addButtonContainer = document.createElement('div');
        addButtonContainer.classList.add('d-flex', 'justify-content-center', 'align-items-center', 'h-100');
    
        const addButton = document.createElement('button');
        addButton.classList.add('btn', 'btn-primary');
        addButton.innerText = 'Add Pictures';
        addButton.addEventListener('click', function() {
            var addPictureModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
            addPictureModal.show();
            console.log('Button clicked for adding pictures!')
            addImage(keys).then(() => {
                updateCarousel(carouselContainer, keys)
            });
    
        });
    
        addButtonContainer.appendChild(addButton);
        addButtonSlide.appendChild(addButtonContainer);
        inner.appendChild(addButtonSlide);
    
        carouselContainer.appendChild(carousel);
    
        // Initialize the carousel using Bootstrap's Carousel API
        const carouselInstance = new bootstrap.Carousel(carousel, {
            interval: 3000
        });
        return carouselContainer;
    }
    
    function onMarkerHover(marker, markerID, e, carouselContainer){
        console.log(markerID);
        const keys = markerImageKeys[markerID];
        const imageUrls = keys.map(key => localStorage.getItem(key)).filter(url => url); // Retrieve image URLs
    
        const popupContent = createCarousel(imageUrls);
        keys.forEach((key) =>{
            console.log(key);
        });

        const uniqueCarouselID = `carouselContainer_${Date.now()}`; // Generate a unique ID for the new carousel
            
    
         var style = document.createElement('style');
         style.innerHTML = '.custom-popup { min-width: 300px; min-height: 300px; }';
         document.head.appendChild(style);
    
         marker.setIcon(L.divIcon({ className: 'custom-marker:hover' }));
         
         popupMarker = L.popup({interactive: true, maxWidth: 400})
         .setLatLng(e.latlng)
         .setContent(popupContent);
         marker.bindPopup(popupMarker);
         marker.openPopup();
    
         function closePopupIfNotHovering() {
            setTimeout(() => {
                if (!isMarkerHovering && !isPopupHovering) {
                    marker.closePopup();
                    marker.setIcon(customIcon);
                }
            }, 500);
        }
    
        marker.on('mouseover', function(e) {
            isMarkerHovering = true;
        });
    
        marker.on('mouseout', function(e) {
            isMarkerHovering = false;
            closePopupIfNotHovering();
        });
    
        popupMarker.on('mouseover', function(e) {
            isPopupHovering = true;
        });
    
        popupMarker.on('mouseout', function(e) {
            isPopupHovering = false;
            closePopupIfNotHovering();
        });
    }
    
    async function addImage (keys){
        try {
            const fileInput = document.getElementById('imageInput');
            const file = fileInput.files[0];
            if (!file) {
                console.error('No file selected');
                return;
            }
    
            // Read the contents of the file as an ArrayBuffer
            const arrayBuffer = await file.arrayBuffer();
    
            // Convert ArrayBuffer to Blob
            const blob = new Blob([arrayBuffer], { type: file.type });
    
            // Save the image Blob to local storage (IndexedDB, localStorage, etc.)
            localStorage.setItem(`savedImage${noImages}`, URL.createObjectURL(blob));
            console.log(`Image saved locally with the key savedImage${noImages}`);
           if(carouselContainer){
            keys.push(`savedImage${noImages}`);
            updateCarousel(carouselContainer, keys)
           }
           else{
            keys.push(`savedImage${noImages}`);
           }
            noImages++;
        } catch (error) {
            console.error('Error saving image:', error);
        }
        
    } 

    
    var addedPicture = false
    var buttonYes = document.getElementById('btnYes');
    buttonYes.addEventListener('click', function() {
        document.getElementById('btnSubmit').addEventListener('click', function () {
            addImage(keys);
            addedPicture =
        
        });

        const popupLatLng = popup.getLatLng();
        
        activeMarker = L.marker([popupLatLng.lat, popupLatLng.lng], { icon: customIcon }).addTo(map);
    
        markers.push(activeMarker);
        const markerID = markers.length - 1;
        console.log(markerID);
        markerImageKeys[markerID] = keys;
        activeMarker.on('mouseover', function(e) {
            onMarkerHover( activeMarker, markerID, e, carouselContainer);
        });
        map.closePopup(popup);

        
    });

    


    var closeButton = document.getElementById('btnNO');
    closeButton.addEventListener('click', function() {map.closePopup(popup);});
}



map.on('click', onMapClick);


  
}