let selectedImages = [];

function previewImages(event) {
    const files = event.target.files;
    const previewContainer = document.getElementById('imagePreviewContainer');

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type === 'image/jpeg' || file.type === 'image/png') {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageData = {
                    src: e.target.result,
                    name: file.name
                };
                selectedImages.push(imageData);

                const previewDiv = document.createElement('div');
                previewDiv.classList.add('image-preview');
                previewDiv.innerHTML = `
                        <p>${imageData.name}</p>
                        <div>
                            <img src="${imageData.src}" alt="${imageData.name}" class="img-fluid">
                            <div class="remove-btn" onclick="removeImage(this, ${selectedImages.length - 1})">
                                <i class="fas fa-times"></i>
                            </div>
                        </div>
                    `;
                previewContainer.appendChild(previewDiv);
            };
            reader.readAsDataURL(file);
        }
    }
}

function removeImage(element, index) {
    selectedImages.splice(index, 1);
    element.closest('.image-preview').remove();
}

function saveImages() {
    const photosContainer = document.getElementById('photosContainer');

    selectedImages.forEach(image => {
        const colDiv = document.createElement('div');
        colDiv.classList.add('col-md-3', 'photo-item');
        colDiv.innerHTML = `
                <div class="card shadow-sm photo-card">
                    <div class="overflow-hidden img-home">
                        <img src="${image.src}" class="card-img-top img-fluid" alt="${image.name}">
                    </div>
                    <div class="card-body d-flex justify-content-between align-items-center">
                        <p class="card-text">${image.name}</p>
                         <div class="dropdown">
                            <button class="btn" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fas fa-ellipsis-v ms-auto"></i>
                            </button>
                            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                <li><a class="dropdown-item delete-item" href="#" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">Delete</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        photosContainer.appendChild(colDiv);
    });

    // Reset modal
    selectedImages = [];
    document.getElementById('imagePreviewContainer').innerHTML = '';
    document.getElementById('imageInput').value = '';

    // close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addImageModal'));
    modal.hide();
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-item')) {
        e.preventDefault();

        let currentElement = e.target;
        while (currentElement) {
            if (currentElement.classList.contains('list-group-item')) {
                itemToDelete = currentElement;
                break;
            }
            if (currentElement.classList.contains('col-md-3')) {
                itemToDelete = currentElement;
                break;
            }
            currentElement = currentElement.parentElement;
        }
    }
});

document.getElementById('confirmDeleteButton').addEventListener('click', function() {
    if (itemToDelete) {
        itemToDelete.remove();
        itemToDelete = null;
        const modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
        modal.hide();
    } else {
        console.error('No item to delete. itemToDelete is not defined.');
    }
});

const surfaceModal = document.getElementById('surfaceModal');
let currentIndex = null; // Lưu chỉ số của surface đang chỉnh sửa

// Xử lý khi modal được mở
surfaceModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget; // Nút đã kích hoạt modal
    const action = button.getAttribute('data-action'); // "add" hoặc "edit"

    const modalTitle = surfaceModal.querySelector('.modal-title');
    const surfaceNameInput = surfaceModal.querySelector('#surfaceName');
    const surfaceWidthInput = surfaceModal.querySelector('#surfaceWidth');
    const surfaceHeightInput = surfaceModal.querySelector('#surfaceHeight');

    if (action === 'add') {
        // Thêm mới surface
        modalTitle.textContent = 'ADD SURFACE';
        surfaceNameInput.value = '';
        surfaceWidthInput.value = '';
        surfaceHeightInput.value = '';
        currentIndex = null;
    } else if (action === 'edit') {
        // Sửa surface
        modalTitle.textContent = 'EDIT SURFACE';
        const surfaceItem = button.closest('.list-group-item');
        const name = surfaceItem.getAttribute('data-name');
        const width = surfaceItem.getAttribute('data-width');
        const height = surfaceItem.getAttribute('data-height');
        surfaceNameInput.value = name;
        surfaceWidthInput.value = width;
        surfaceHeightInput.value = height;
        currentIndex = Array.from(document.querySelectorAll('.list-group-item')).indexOf(surfaceItem);
    }
});

// Xử lý khi nhấn nút Save
document.getElementById('saveSurface').addEventListener('click', function () {
    const surfaceName = document.getElementById('surfaceName').value;
    const surfaceWidth = document.getElementById('surfaceWidth').value;
    const surfaceHeight = document.getElementById('surfaceHeight').value;

    if (surfaceName && surfaceWidth && surfaceHeight) {
        if (currentIndex === null) {
            // Thêm mới surface
            const surfaceList = document.querySelector('.surfaces-section .list-group');
            const newSurface = document.createElement('li');
            newSurface.className = 'list-group-item d-flex justify-content-between align-items-center card surface-item';
            newSurface.setAttribute('data-name', surfaceName);
            newSurface.setAttribute('data-width', surfaceWidth);
            newSurface.setAttribute('data-height', surfaceHeight);
            newSurface.innerHTML = `
                    <span class="surface-name">${surfaceName}</span>
                    <div class="dropdown position-absolute top-0 end-0">
                        <button class="btn btn-link" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fas fa-ellipsis-v ms-auto"></i>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            <li><a class="dropdown-item edit-item" href="#" data-bs-toggle="modal" data-bs-target="#surfaceModal" data-action="edit">Edit</a></li>
                            <li><a class="dropdown-item delete-item" href="#" data-bs-toggle="modal" data-bs-target="#confirmDeleteModal">Delete</a></li>
                        </ul>
                    </div>
                `;
            surfaceList.appendChild(newSurface);
        } else {
            // Sửa surface
            const surfaceItem = document.querySelectorAll('.list-group-item')[currentIndex];
            surfaceItem.setAttribute('data-name', surfaceName);
            surfaceItem.setAttribute('data-width', surfaceWidth);
            surfaceItem.setAttribute('data-height', surfaceHeight);
            surfaceItem.querySelector('span').textContent = surfaceName;
        }

        // Close modal
        const modal = bootstrap.Modal.getInstance(surfaceModal);
        modal.hide();
    } else {
        alert('Please fill in all information!');
    }
});

const surfaceModalImage = document.getElementById('imageModal');
let currentIndexImage = null;

surfaceModalImage.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;

    const title = button.getAttribute('data-title');
    const image = button.getAttribute('data-image');

    const modalTitle = this.querySelector('#imageModalLabel');
    const titleImage = this.querySelector('#titleImage');
    // const modalTextTitle = this.querySelector('#textareaModal');
    modalTitle.textContent = title;
    titleImage.value = title;
    // modalTextTitle.value = title;

    const imageItem = button.closest('.layout-item');

    currentIndexImage = Array.from(document.querySelectorAll('.layout-item')).indexOf(imageItem);
    const modalImage = this.querySelector('.modal-image');
    modalImage.src = image;
});



document.getElementById('saveLayout').addEventListener('click', function () {
    const titleImage = document.getElementById('titleImage').value;

    if (titleImage) {
        const surfaceItem = document.querySelectorAll('.layout-item')[currentIndexImage];
        const enterLink = surfaceItem.querySelector('.enter-link');
        const span = surfaceItem.querySelector('span');

        if (enterLink) {
            enterLink.setAttribute('data-title', titleImage);
        }

        if (span) {
            span.textContent = titleImage;
        }

        // Close modal
        const modal = bootstrap.Modal.getInstance(surfaceModalImage);
        modal.hide();
    } else {
        alert('Please fill in all information!');
    }
});

document.getElementById('toggleButton').addEventListener('click', function() {
    const photosSection = document.querySelector('.photos-section');

    photosSection.classList.toggle('overflow-hidden');
    photosSection.classList.toggle('expanded');
});

document.getElementById('toggleButtonSurfaces').addEventListener('click', function() {
    const photosSection = document.querySelector('.surfaces-section');

    photosSection.classList.toggle('overflow-hidden');
    photosSection.classList.toggle('expanded');
});

document.addEventListener('DOMContentLoaded', () => {
    const modalImage = document.getElementById('modalImage');
    const rectangle = document.getElementById('rectangle');
    const modal = document.getElementById('imageModal');

    // Khi modal đóng, ẩn hình vuông
    modal.addEventListener('hidden.bs.modal', () => {
        rectangle.style.display = 'none';
    });

    // Nhấp vào ảnh
    modalImage.addEventListener('click', (e) => {
        // Lấy kích thước hiển thị của ảnh
        const rect = modalImage.getBoundingClientRect();
        const imageWidth = rect.width; // Chiều rộng ảnh trong pixel
        console.log(imageWidth);
        const imageHeight = rect.height; // Chiều cao ảnh trong pixel

        // Giả sử ảnh gốc là 100cm, tính tỷ lệ cm-to-px
        const cmToPxRatio = 100; // 1cm = ?px
        const squareSize = 100; // Kích thước hình vuông (100cm) trong pixel

        // Tính tọa độ nhấp chuột tương đối với ảnh
        const clickXInImage = e.clientX - rect.left; // Tọa độ X trong ảnh
        const clickYInImage = e.clientY - rect.top;  // Tọa độ Y trong ảnh

        // Đặt vị trí cho hình vuông (căn giữa điểm nhấp chuột)
        const rectX = clickXInImage - squareSize / 2;
        const rectY = clickYInImage - squareSize / 2;

        // Đặt kích thước và vị trí cho hình vuông
        rectangle.style.width = `${squareSize}px`;
        rectangle.style.height = `${squareSize}px`;
        rectangle.style.left = `${rectX}px`;
        rectangle.style.top = `${rectY}px`;

        // Tính toán hiệu ứng zoom
        const zoomLevel = 2; // Phóng to 2x (có thể điều chỉnh)
        const zoomedImageWidth = imageWidth * zoomLevel;
        const zoomedImageHeight = imageHeight * zoomLevel;

        // Đặt background-image và background-size cho hình vuông
        rectangle.style.backgroundImage = `url(${modalImage.src})`;
        rectangle.style.backgroundSize = `${zoomedImageWidth}px ${zoomedImageHeight}px`;

        // Tính background-position để hiển thị khu vực zoom
        const bgPosX = clickXInImage * zoomLevel - squareSize / 2;
        const bgPosY = clickYInImage * zoomLevel - squareSize / 2;
        rectangle.style.backgroundPosition = `-${bgPosX}px -${bgPosY}px`;

        // Hiển thị hình vuông
        rectangle.style.display = 'block';
    });
});