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


function onMapClick(e) {
    var popup = L.popup({interactive: true})
        .setLatLng(e.latlng)
        .setContent(popupContent)
        .openOn(map);

    var buttonYes = document.getElementById('btnYes');
    buttonYes.addEventListener('click', function() {

        document.getElementById('btnSubmit').addEventListener('click', async () => {
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
            } catch (error) {
                console.error('Error saving image:', error);
            }
        });

        const popupLatLng = popup.getLatLng();
        setTimeout(() => {
            const circle = L.circle([popupLatLng.lat, popupLatLng.lng], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 20
            }).addTo(map);
        }, 2000);

        map.closePopup(popup);
        

    });

    var closeButton = document.getElementById('btnNO');
    closeButton.addEventListener('click', function() {
    map.closePopup(popup);
});
}

map.on('click', onMapClick);

  
}