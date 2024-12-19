const fileInput = document.getElementById('fileInput');
const cropperContainer = document.getElementById('cropperContainer');
const image = document.getElementById('image');
const cropButton = document.getElementById('cropButton');
const saveButton = document.getElementById('saveButton');
const canvas = document.getElementById('canvas');

// Declare a variable to hold the cropper instance
let cropper;

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      image.src = event.target.result;
      cropperContainer.style.display = 'block';
      cropperContainer.style.maxWidth = '100%';
      cropperContainer.style.maxHeight = '100vh'; 

      image.onload = () => {
        if (cropper) {
          cropper.destroy(); // Destroy existing cropper instance if any
        }
        cropper = new Cropper(image, {
          viewMode: 2, // Prevent cropper from going outside the image
          autoCropArea: 1, // Set the default auto crop area
          zoomable: true, // Allow zooming
          movable: true, // Allow moving the crop box
          cropBoxMovable: true, // Allow moving the crop box itself
          cropBoxResizable: true, // Allow resizing the crop box
          responsive: true, // Make the cropper responsive to window size
        });
      };
    };
    reader.readAsDataURL(file); // Read the file as a Data URL
  }
});

cropButton.addEventListener('click', () => {
  if (cropper) {
    const croppedCanvas = cropper.getCroppedCanvas();
    canvas.width = croppedCanvas.width;
    canvas.height = croppedCanvas.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(croppedCanvas, 0, 0);
  }
});

saveButton.addEventListener('click', () => {
  if (cropper) {
    cropper.getCroppedCanvas().toBlob((blob) => {

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'cropped-image.png'; // Set the download filename
      a.click(); // Trigger the download

      resetToInitialState();
    });
  }
});

function resetToInitialState() {
  if (cropper) {
    cropper.destroy();  
    cropper = null;
  }
  image.src = '';  
  cropperContainer.style.display = 'none';  
  fileInput.value = '';  
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);  
}
