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
            const imageUrl = bgImage.slice(5, -2);
            
            // Extract item name from image path
            const itemName = extractItemName(imageUrl);
            
            createOverlay(imageUrl, itemName);
        });
    });
});

// Extract item name from image path
function extractItemName(imagePath) {
    const parts = imagePath.split('/');
    const filename = parts[parts.length - 1];
    const nameWithoutExt = filename.replace('.svg', '').replace(/\\/g, '');
    return nameWithoutExt.replace(/%20/g, ' ').replace('Palette', '').trim();
}

// Price data for items (you can adjust these)
const PRICES = {
    'Medio': 100,
    'Largo': 120
};

function createOverlay(imageUrl, itemName) {
    const overlay = document.createElement('div');
    overlay.className = 'image-overlay';
    
    const overlayContent = document.createElement('div');
    overlayContent.className = 'overlay-content';
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.className = 'overlay-image';
    
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'overlay-options';
    
    // Item name display
    const itemTitle = document.createElement('h2');
    itemTitle.textContent = itemName;
    itemTitle.style.marginBottom = '20px';
    itemTitle.style.color = '#333';
    
    // Size selection
    const sizeLabel = document.createElement('h3');
    sizeLabel.textContent = 'Choose Size:';
    
    const sizeButtons = document.createElement('div');
    sizeButtons.className = 'size-buttons';
    
    let selectedSize = null;
    let selectedPrice = 0;
    
    ['Medio', 'Largo'].forEach(size => {
        const btn = document.createElement('button');
        btn.className = 'size-btn';
        btn.textContent = `${size} - ₱${PRICES[size]}`;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedSize = size;
            selectedPrice = PRICES[size];
        });
        sizeButtons.appendChild(btn);
    });
    
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
        if (selectedSize) {
            // Add to cart
            addToCart({
                name: itemName,
                size: selectedSize,
                price: selectedPrice,
                quantity: quantity,
                imageUrl: imageUrl
            });
            
            // Show success message
            const message = document.createElement('div');
            message.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 15px 25px;
                border-radius: 8px;
                z-index: 10000;
                font-weight: 600;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            `;
            message.textContent = `Added ${quantity} ${selectedSize} ${itemName} to cart!`;
            document.body.appendChild(message);
            
            setTimeout(() => message.remove(), 3000);
            overlay.remove();
        } else {
            alert('Please select a size first!');
        }
    });
    
    // Append everything
    optionsContainer.appendChild(itemTitle);
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
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
    
    document.body.appendChild(overlay);
}