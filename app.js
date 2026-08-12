document.addEventListener('DOMContentLoaded', () => {
    let cart = [];

    const cartCountElement = document.querySelector('.cart-count');
    const cartBtn = document.querySelector('.cart-btn');
    const addButtons = document.querySelectorAll('.add-button');
    
    const searchInput = document.querySelector('.search-box input');
    const categorySelect = document.querySelector('.category-select');
    const productCards = document.querySelectorAll('.product-card');

    // ==========================================
    // 1. SISTEMA DE NOTIFICACIONES (TOAST)
    // ==========================================
    const toast = document.createElement('div');
    toast.id = 'custom-toast';
    toast.innerHTML = `
        <h4>🎮 ¡Acción Exitosa!</h4>
        <p id="toast-message">Operación realizada.</p>
    `;
    document.body.appendChild(toast);

    function showToast(title, message) {
        const toastTitle = toast.querySelector('h4');
        const toastMsg = toast.querySelector('#toast-message');
        
        toastTitle.innerHTML = `🎮 ${title}`;
        toastMsg.innerHTML = message;

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }

    // ==========================================
    // 2. CREAR LA ESTRUCTURA DEL MODAL DEL CARRITO
    // ==========================================
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'cart-modal-overlay';
    modalOverlay.innerHTML = `
        <div class="cart-modal">
            <div class="cart-modal-header">
                <h3>🛒 Carrito de Compras</h3>
                <button class="close-modal-btn">&times;</button>
            </div>
            <div class="cart-items-list">
                <!-- Los productos seleccionados aparecen aquí -->
            </div>
            <div class="cart-modal-footer">
                <div class="cart-total-section">
                    <span>Total a pagar:</span>
                    <span id="modal-total-price">$0 COP</span>
                </div>
                <button class="checkout-btn">Comprar Ahora</button>
                <button class="clear-cart-btn">Vaciar Carrito (Quitar todo)</button>
            </div>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    const closeModalBtn = modalOverlay.querySelector('.close-modal-btn');
    const cartItemsList = modalOverlay.querySelector('.cart-items-list');
    const modalTotalPrice = modalOverlay.querySelector('#modal-total-price');
    const checkoutBtn = modalOverlay.querySelector('.checkout-btn');
    const clearCartBtn = modalOverlay.querySelector('.clear-cart-btn');

    function updateCartCount() {
        if (cartCountElement) {
            cartCountElement.textContent = cart.length;
        }
    }

    function openCartModal() {
        renderCartItems();
        modalOverlay.classList.add('active');
    }

    function closeCartModal() {
        modalOverlay.classList.remove('active');
    }

    // Solo se abre el modal cuando el usuario hace clic en el ícono del carrito arriba
    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCartModal();
        });
    }

    closeModalBtn.addEventListener('click', closeCartModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeCartModal();
    });

    // ==========================================
    // 3. RENDERIZAR PRODUCTOS Y GESTIÓN EN EL MODAL
    // ==========================================
    function renderCartItems() {
        cartItemsList.innerHTML = '';
        let total = 0;

        updateCartCount();

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p style="color: #94a3b8; text-align: center; padding: 20px;">Tu carrito está vacío.</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.numericPrice;
                const itemRow = document.createElement('div');
                itemRow.className = 'cart-item-row';
                itemRow.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <span>${item.priceText}</span>
                    </div>
                    <button class="remove-item-btn" data-index="${index}">Quitar</button>
                `;
                cartItemsList.appendChild(itemRow);
            });
        }

        modalTotalPrice.textContent = `$${total.toLocaleString('es-CO')} COP`;

        // Botón para quitar un producto individual
        const removeButtons = cartItemsList.querySelectorAll('.remove-item-btn');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const indexToRemove = parseInt(btn.getAttribute('data-index'));
                const removedItem = cart[indexToRemove];
                cart.splice(indexToRemove, 1);
                renderCartItems();
                updateCartCount();
                showToast("Producto Eliminado", `Se quitó <b>${removedItem.name}</b> de tu carrito.`);
            });
        });
    }

    // Botón para vaciar todo el carrito de golpe
    clearCartBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast("Carrito Vacío", "No hay productos para quitar.");
            return;
        }
        cart = [];
        renderCartItems();
        updateCartCount();
        showToast("Carrito Vaciado", "Se han removido todos los productos.");
    });

    // ==========================================
    // 4. AGREGAR PRODUCTOS DESDE LAS TARJETAS (SIN ABRIR MODAL)
    // ==========================================
    addButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = button.closest('.product-card');
            
            if (productCard) {
                const productName = productCard.querySelector('.product-information h3').textContent;
                const priceText = productCard.querySelector('.price').textContent;
                
                const numericPrice = parseFloat(
                    priceText.replace(/[^0-9,.-]+/g, "")
                             .replace(/\./g, "")
                             .replace(',', '.')
                ) || 0;

                cart.push({
                    name: productName,
                    priceText: priceText,
                    numericPrice: numericPrice
                });

                updateCartCount();

                // Notificación flotante elegante sin abrir ventanas estorbosas
                showToast("¡Añadido al Carrito!", `🎮 ${productName}<br>Precio: <b>${priceText}</b>`);
            }
        });
    });

    // Botón de finalizar compra dentro del modal
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast("Carrito Vacío", "Agrega productos antes de comprar.");
            return;
        }
        
        closeCartModal();
        showToast("¡Compra Exitosa!", "Gracias por elegir MundoConsola. Tu pedido está en camino.");
        cart = [];
        updateCartCount();
    });

    // ==========================================
    // 5. FILTRADO EXACTO POR CATEGORÍAS Y BÚSQUEDA
    // ==========================================
    function filterProducts() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const selectedCategory = categorySelect ? categorySelect.value.toLowerCase() : 'todas las categorías';

        productCards.forEach(card => {
            const title = card.querySelector('.product-information h3').textContent.toLowerCase();
            const description = card.querySelector('.product-information p').textContent.toLowerCase();
            
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);

            let matchesCategory = true;

            if (selectedCategory.includes('controles')) {
                matchesCategory = title.includes('control') || description.includes('control');
            } else if (selectedCategory.includes('consolas')) {
                matchesCategory = title.includes('playstation') || title.includes('xbox') || title.includes('nintendo') || title.includes('consola');
            } else if (selectedCategory.includes('accesorios')) {
                matchesCategory = title.includes('audífono') || title.includes('silla') || title.includes('escritorio') || title.includes('micrófono') || title.includes('teclado') || description.includes('audífono') || description.includes('silla') || description.includes('escritorio') || description.includes('micrófono') || description.includes('teclado');
            }

            if (matchesSearch && matchesCategory) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterProducts);
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', filterProducts);
    }

    // ==========================================
    // 6. NAVEGACIÓN SUAVE DESDE EL MENÚ SUPERIOR
    // ==========================================
    const menuLinks = document.querySelectorAll('.nav a');
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const text = link.textContent.trim().toLowerCase();
            if (text.includes('catálogos') || text.includes('ventas') || text.includes('inicio')) {
                e.preventDefault();
                const targetSection = document.querySelector('.catalogos-section') || document.querySelector('.hero');
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});