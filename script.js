document.addEventListener('DOMContentLoaded', () => {
    const revealButton = document.getElementById('reveal-button');
    const secretMessage = document.getElementById('secret-message');
    const sections = document.querySelectorAll('section');

    // Reveal message
    revealButton.addEventListener('click', () => {
        secretMessage.classList.remove('hidden');
        revealButton.style.display = 'none';
        const romanticMusic = document.getElementById('romantic-music');
        if (romanticMusic) {
            romanticMusic.play();
        }
    });

    // Password protected message
    const passwordButton = document.getElementById('password-button');
    const passwordMessage = document.getElementById('password-message');

    passwordButton.addEventListener('click', () => {
                const password = prompt('Lütfen şifreyi girin (Kfc, resmiyet tarih):');
        if (password === '10.01.2024') {
            passwordMessage.classList.remove('hidden');
            passwordMessage.classList.add('visible'); // Animasyon için sınıf ekle
            passwordButton.style.display = 'none';
        } else {
            alert('Yanlış şifre! Nazlı değilsen boşa uğraşma.');
        }
    });

    // Heart animation
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 2 + 3 + 's'; // 3-5 saniye
        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 5000);
    }

    setInterval(createHeart, 300);

    // Scroll animation
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Puzzle Game
    const puzzlePiecesContainer = document.getElementById('puzzle-pieces');
    const puzzleBoardContainer = document.getElementById('puzzle-board');
    const winOverlay = document.getElementById('win-overlay');
    let selectedPiece = null;

    function initializePuzzle() {
        puzzleBoardContainer.innerHTML = '';
        puzzlePiecesContainer.innerHTML = '';

        const puzzleSize = puzzleBoardContainer.clientWidth;
        const pieceCount = 16;
        const gridSize = 4;
        const pieceSize = puzzleSize / gridSize;

        puzzleBoardContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        puzzlePiecesContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

        const pieceNumbers = [...Array(pieceCount).keys()];
        const shuffledPieces = pieceNumbers.sort(() => Math.random() - 0.5);

        shuffledPieces.forEach(i => {
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            piece.dataset.id = i;
            piece.style.width = `${pieceSize}px`;
            piece.style.height = `${pieceSize}px`;
            piece.style.backgroundSize = `${puzzleSize}px ${puzzleSize}px`;
            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            piece.style.backgroundPosition = `-${col * pieceSize}px -${row * pieceSize}px`;
            piece.addEventListener('click', handlePieceClick);
            puzzlePiecesContainer.appendChild(piece);
        });

        for (let i = 0; i < pieceCount; i++) {
            const slot = document.createElement('div');
            slot.classList.add('puzzle-slot');
            slot.dataset.id = i;
            slot.addEventListener('click', handleSlotClick);
            puzzleBoardContainer.appendChild(slot);
        }
    }

    function handlePieceClick(e) {
        const clickedPiece = e.target;
        if (selectedPiece) {
            selectedPiece.classList.remove('selected');
        }
        if (selectedPiece === clickedPiece) {
            selectedPiece = null;
        } else {
            selectedPiece = clickedPiece;
            selectedPiece.classList.add('selected');
        }
    }

    function handleSlotClick(e) {
        const clickedSlot = e.target.closest('.puzzle-slot');
        if (!clickedSlot) return;

        if (selectedPiece && !clickedSlot.firstChild) {
            clickedSlot.appendChild(selectedPiece);
            selectedPiece.classList.remove('selected');
            selectedPiece = null;
            checkWin();
        } else if (selectedPiece && clickedSlot.firstChild) {
            const pieceInSlot = clickedSlot.firstChild;
            const containerOfSelected = selectedPiece.parentNode;
            containerOfSelected.appendChild(pieceInSlot);
            clickedSlot.appendChild(selectedPiece);
            selectedPiece.classList.remove('selected');
            selectedPiece = null;
            checkWin();
        }
    }

    function checkWin() {
        const slots = document.querySelectorAll('.puzzle-slot');
        let allCorrect = true;
        slots.forEach(slot => {
            const piece = slot.firstChild;
            if (!piece || parseInt(piece.dataset.id) !== parseInt(slot.dataset.id)) {
                allCorrect = false;
            }
        });

        if (allCorrect) {
            setTimeout(() => {
                winOverlay.classList.add('show');
                setTimeout(() => {
                    winOverlay.classList.remove('show');
                }, 5000);
            }, 200);
        }
    }

    initializePuzzle();

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (winOverlay.classList.contains('show')) return;
            initializePuzzle();
        }, 250);
    });

    // Lightbox Gallery
    const galleryImages = document.querySelectorAll('.gallery-image');
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxImage = document.getElementById('lightbox-image');
    const closeButton = document.querySelector('.close-button');
    const prevButton = document.querySelector('.prev-button');
    const nextButton = document.querySelector('.next-button');
    let currentImageIndex = 0;

    function showLightbox(index) {
        currentImageIndex = index;
        lightboxImage.src = galleryImages[currentImageIndex].src;
        lightboxOverlay.classList.remove('hidden');
    }

    function hideLightbox() {
        lightboxOverlay.classList.add('hidden');
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        lightboxImage.src = galleryImages[currentImageIndex].src;
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImage.src = galleryImages[currentImageIndex].src;
    }

    galleryImages.forEach((image, index) => {
        image.addEventListener('click', () => {
            showLightbox(index);
        });
    });

    closeButton.addEventListener('click', hideLightbox);
    nextButton.addEventListener('click', showNextImage);
    prevButton.addEventListener('click', showPrevImage);

    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) {
            hideLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightboxOverlay.classList.contains('hidden')) {
            if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'Escape') {
                hideLightbox();
            }
        }
    });

    // Carousel
    const carouselSlide = document.querySelector('.carousel-slide');
    const carouselImages = document.querySelectorAll('.carousel-slide img');
    const prevCarouselButton = document.querySelector('.carousel-button.prev');
    const nextCarouselButton = document.querySelector('.carousel-button.next');
    const dotsContainer = document.querySelector('.carousel-dots');

    let carouselIndex = 0;
    const totalImages = carouselImages.length;

    // Create dots
    for (let i = 0; i < totalImages; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        dot.addEventListener('click', () => {
            goToSlide(i);
        });
        dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll('.carousel-dot');

    function updateCarousel() {
        const imageWidth = carouselImages[0].clientWidth;
        carouselSlide.style.transform = `translateX(${-imageWidth * carouselIndex}px)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === carouselIndex);
        });
    }

    function goToSlide(index) {
        carouselIndex = index;
        updateCarousel();
    }

    function showNextCarouselImage() {
        carouselIndex = (carouselIndex + 1) % totalImages;
        updateCarousel();
    }

    function showPrevCarouselImage() {
        carouselIndex = (carouselIndex - 1 + totalImages) % totalImages;
        updateCarousel();
    }

    nextCarouselButton.addEventListener('click', showNextCarouselImage);
    prevCarouselButton.addEventListener('click', showPrevCarouselImage);

    // Auto-play
    setInterval(showNextCarouselImage, 5000); // 5 saniyede bir otomatik geçiş

    // Initial setup
    updateCarousel();
});