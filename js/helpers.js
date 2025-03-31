// Función para cargar componentes comunes
export function loadComponents() {
    // Cargar navbar
    fetch('includes/navbar.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('afterbegin', data);
            updateCartIcon();
            setActiveLink();
        });
    
    // Cargar footer
    fetch('includes/footer.html')
        .then(response => response.text())
        .then(data => {
            document.body.insertAdjacentHTML('beforeend', data);
        });
}

// Establecer enlace activo en el navbar
function setActiveLink() {
    const currentPage = location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Actualizar icono del carrito
export function updateCartIcon() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    const cartIcon = document.getElementById('cart-icon-count');
    
    if (cartIcon) {
        cartIcon.textContent = totalItems;
        cartIcon.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    // Actualizar también el carrito flotante
    const flotante = document.querySelector('.carrito-flotante');
    if (flotante) {
        const badge = flotante.querySelector('.badge');
        if (badge) {
            badge.textContent = totalItems;
        }
    }
}

// Mostrar notificación
export function showToast(message, type = 'success') {
    const toastContainer = document.createElement('div');
    toastContainer.className = `toast show align-items-center text-white bg-${type} border-0`;
    toastContainer.setAttribute('role', 'alert');
    toastContainer.setAttribute('aria-live', 'assertive');
    toastContainer.setAttribute('aria-atomic', 'true');
    
    toastContainer.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    const toastElement = document.getElementById('toast-container') || document.createElement('div');
    toastElement.id = 'toast-container';
    toastElement.className = 'position-fixed bottom-0 end-0 p-3';
    toastElement.style.zIndex = '11';
    toastElement.appendChild(toastContainer);
    
    if (!document.getElementById('toast-container')) {
        document.body.appendChild(toastElement);
    }
    
    setTimeout(() => {
        toastContainer.classList.remove('show');
        setTimeout(() => toastContainer.remove(), 300);
    }, 3000);
}