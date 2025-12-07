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


document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const bgImage = card.style.backgroundImage;
            const imageUrl = bgImage.slice(5, -2);
            const itemName = extractItemName(imageUrl);
            
            createOverlay(imageUrl, itemName);
        });
    });
});

function extractItemName(imagePath) {
    const parts = imagePath.split('/');
    const filename = parts[parts.length - 1];
    const nameWithoutExt = filename.replace('.svg', '').replace(/\\/g, '');
    return nameWithoutExt.replace(/%20/g, ' ').replace('Palette', '').trim();
}

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
    

    const item = polaroidSearch.getBestMatch(itemName);
    
 
    if (!item) {
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = `
            padding: 40px;
            text-align: center;
            color: #666;
        `;
        
        const errorTitle = document.createElement('h2');
        errorTitle.textContent = '⚠️ Item Not Found';
        errorTitle.style.color = '#e74c3c';
        errorTitle.style.marginBottom = '15px';
        
        const errorText = document.createElement('p');
        errorText.textContent = `Could not find "${itemName}" in our menu.`;
        errorText.style.marginBottom = '20px';
        
        const suggestions = polaroidSearch.search(itemName, { limit: 3 });
        if (suggestions.length > 0) {
            const suggestText = document.createElement('p');
            suggestText.textContent = 'Did you mean:';
            suggestText.style.fontWeight = 'bold';
            suggestText.style.marginBottom = '10px';
            
            const suggestionList = document.createElement('ul');
            suggestionList.style.listStyle = 'none';
            suggestionList.style.padding = '0';
            
            suggestions.forEach(s => {
                const li = document.createElement('li');
                li.textContent = s.name;
                li.style.padding = '5px';
                li.style.color = '#3498db';
                suggestionList.appendChild(li);
            });
            
            errorMsg.appendChild(errorTitle);
            errorMsg.appendChild(errorText);
            errorMsg.appendChild(suggestText);
            errorMsg.appendChild(suggestionList);
        } else {
            errorMsg.appendChild(errorTitle);
            errorMsg.appendChild(errorText);
        }
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'back-btn';
        closeBtn.textContent = 'Close';
        closeBtn.style.marginTop = '20px';
        closeBtn.addEventListener('click', () => overlay.remove());
        
        errorMsg.appendChild(closeBtn);
        overlayContent.appendChild(img);
        overlayContent.appendChild(errorMsg);
        overlay.appendChild(overlayContent);
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });
        
        document.body.appendChild(overlay);
        return;
    }
    

    const actualItemName = item.name;
    const availableSizes = item.sizes;
    const itemPrices = item.prices;
    

    const itemTitle = document.createElement('h2');
    itemTitle.textContent = actualItemName;
    itemTitle.style.marginBottom = '20px';
    itemTitle.style.color = '#333';
    
  
    if (item.confidence && item.confidence !== 'exact' && actualItemName.toLowerCase() !== itemName.toLowerCase()) {
        const matchInfo = document.createElement('small');
        matchInfo.textContent = `(Matched from: "${itemName}")`;
        matchInfo.style.display = 'block';
        matchInfo.style.color = '#888';
        matchInfo.style.fontSize = '0.8em';
        matchInfo.style.marginTop = '5px';
        itemTitle.appendChild(matchInfo);
    }
    
    const sizeLabel = document.createElement('h3');
    sizeLabel.textContent = 'Choose Size:';
    
    const sizeButtons = document.createElement('div');
    sizeButtons.className = 'size-buttons';
    
    let selectedSize = null;
    let selectedPrice = 0;
    
    availableSizes.forEach(size => {
        const price = itemPrices[size];
        const btn = document.createElement('button');
        btn.className = 'size-btn';
        btn.textContent = `${size} - ₱${price}`;
        btn.addEventListener('click', () => {
            document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedSize = size;
            selectedPrice = price;
        });
        sizeButtons.appendChild(btn);
    });
    

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
            addToCart({
                name: actualItemName, 
                size: selectedSize,
                price: selectedPrice,
                quantity: quantity,
                imageUrl: imageUrl,
                category: 'food'
            });
            
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
            message.textContent = `Added ${quantity} ${selectedSize} ${actualItemName} to cart!`;
            document.body.appendChild(message);
            
            setTimeout(() => message.remove(), 3000);
            overlay.remove();
        } else {
            alert('Please select a size first!');
        }
    });
    
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
