const headerEl = document.querySelector('.Nav-bar');
headerEl.addEventListener('mouseenter', () => {
    headerEl.classList.add('Nav-bar-hov');
});
headerEl.addEventListener('mouseleave', () => {
    headerEl.classList.remove('Nav-bar-hov');
});
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');
    
    carousels.forEach(carousel => {
        let isDown = false;
        let startX;
        let scrollLeft;

        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            carousel.style.scrollBehavior = 'auto';
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });

        carousel.addEventListener('mouseleave', () => {
            isDown = false;
            carousel.style.scrollBehavior = 'smooth';
        });

        carousel.addEventListener('mouseup', () => {
            isDown = false;
            carousel.style.scrollBehavior = 'smooth';
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
    });
});
// Image overlay functionality
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const bgImage = card.style.backgroundImage;
            const imageUrl = bgImage.slice(5, -2); // Extract URL from url("...")
            
            createOverlay(imageUrl);
        });
    });
});

function createOverlay(imageUrl) {
  // Create overlay container
  const overlay = document.createElement('div');
  overlay.className = 'image-overlay';
  
  // Create content container
  const overlayContent = document.createElement('div');
  overlayContent.className = 'overlay-content';
  
  // Create image
  const img = document.createElement('img');
  img.src = imageUrl;
  img.className = 'overlay-image';
  
  // Create options container
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'overlay-options';
  
  const sizeLabel = document.createElement('h3');

  
  const sizeButtons = document.createElement('div');
  sizeButtons.className = 'size-buttons';
  
  
  // Quantity selection
  const quantityLabel = document.createElement('h3');
  quantityLabel.textContent = 'Quantity:';
  
  const quantityContainer = document.createElement('div');
  quantityContainer.className = 'quantity-container';
  
  const decreaseBtn = document.createElement('button');
  decreaseBtn.className = 'quantity-btn';
  decreaseBtn.textContent = '-';
  
  const quantityDisplay = document.createElement('span');
  quantityDisplay.className = 'quantity-display';
  quantityDisplay.textContent = '1';
  let quantity = 1;
  
  const increaseBtn = document.createElement('button');
  increaseBtn.className = 'quantity-btn';
  increaseBtn.textContent = '+';
  
  decreaseBtn.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      quantityDisplay.textContent = quantity;
    }
  });
  
  increaseBtn.addEventListener('click', () => {
    if (quantity < 99) {
      quantity++;
      quantityDisplay.textContent = quantity;
    }
  });
  
  quantityContainer.appendChild(decreaseBtn);
  quantityContainer.appendChild(quantityDisplay);
  quantityContainer.appendChild(increaseBtn);
  
  // Action buttons
  const actionButtons = document.createElement('div');
  actionButtons.className = 'action-buttons';
  
  const backBtn = document.createElement('button');
  backBtn.className = 'back-btn';
  backBtn.textContent = 'Go Back';
  backBtn.addEventListener('click', () => {
    overlay.remove();
  });
  
  const addToCartBtn = document.createElement('button');
  addToCartBtn.className = 'add-to-cart-btn';
  addToCartBtn.textContent = 'Add to Cart';
  addToCartBtn.addEventListener('click', () => {
    const selectedSize = document.querySelector('.size-btn.selected');
    if (selectedSize) {
      alert(`Added ${quantity} ${selectedSize.textContent} item(s) to cart!`);
      overlay.remove();
    } else {
      alert('Please select a size first!');
    }
  });
  
  // Append everything
  optionsContainer.appendChild(sizeLabel);
  optionsContainer.appendChild(sizeButtons);
  optionsContainer.appendChild(quantityLabel);
  optionsContainer.appendChild(quantityContainer);
  actionButtons.appendChild(backBtn);
  actionButtons.appendChild(addToCartBtn);
  optionsContainer.appendChild(actionButtons);
  
  overlayContent.appendChild(img);
  overlayContent.appendChild(optionsContainer);
  overlay.appendChild(overlayContent);
  
  // Close on overlay background click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });
  
  document.body.appendChild(overlay);
}