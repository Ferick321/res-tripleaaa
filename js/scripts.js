// Clase para manejar el carrito
class Carrito {
    constructor() {
        this.carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        this.actualizarIconoCarrito();
        this.actualizarCarritoFlotante();
    }

    agregarProducto(producto) {
        const productoExistente = this.carrito.find(item => item.id === producto.id);
        
        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            this.carrito.push({
                ...producto,
                cantidad: 1
            });
        }
        
        this.guardarCarrito();
        this.mostrarNotificacion(producto.nombre);
    }

    eliminarProducto(id) {
        this.carrito = this.carrito.filter(item => item.id !== id);
        this.guardarCarrito();
    }

    actualizarCantidad(id, cantidad) {
        const producto = this.carrito.find(item => item.id === id);
        if (producto) {
            producto.cantidad = cantidad;
            this.guardarCarrito();
        }
    }

    vaciarCarrito() {
        this.carrito = [];
        this.guardarCarrito();
    }

    obtenerTotal() {
        return this.carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
    }

    obtenerCantidadTotal() {
        return this.carrito.reduce((total, item) => total + item.cantidad, 0);
    }

    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
        this.actualizarIconoCarrito();
        this.actualizarCarritoFlotante();
        window.dispatchEvent(new Event('carritoActualizado'));
    }

    actualizarIconoCarrito() {
        const cantidad = this.obtenerCantidadTotal();
        const icono = document.getElementById('cart-icon-count');
        
        if (icono) {
            icono.textContent = cantidad;
            icono.style.display = cantidad > 0 ? 'flex' : 'none';
        }
    }

    actualizarCarritoFlotante() {
        const flotante = document.querySelector('.carrito-flotante');
        if (flotante) {
            const count = this.obtenerCantidadTotal();
            const badge = flotante.querySelector('.badge');
            badge.textContent = count;
            flotante.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    mostrarNotificacion(nombreProducto) {
        const toastEl = document.getElementById('added-to-cart-toast');
        if (toastEl) {
            const toastBody = toastEl.querySelector('.toast-body');
            toastBody.textContent = `"${nombreProducto}" se ha añadido a tu carrito.`;
            
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        }
    }

    async enviarPedigo() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 1500);
        });
    }
}

// Inicializar carrito
const carrito = new Carrito();

// Eventos cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    // Efecto scroll para navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Agregar productos al carrito con efecto de confirmación
    document.querySelectorAll('.agregar-carrito').forEach(boton => {
        boton.addEventListener('click', function() {
            const producto = {
                id: this.dataset.id,
                nombre: this.dataset.nombre,
                precio: parseFloat(this.dataset.precio),
                imagen: this.dataset.imagen
            };
            
            // Efecto visual de confirmación
            this.classList.add('confirmed');
            setTimeout(() => {
                this.classList.remove('confirmed');
            }, 600);
            
            carrito.agregarProducto(producto);
        });
    });

    // Efecto hover para dropdown
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            const dropdownMenu = this.querySelector('.dropdown-menu');
            dropdownMenu.classList.add('show');
        });
        
        dropdown.addEventListener('mouseleave', function() {
            const dropdownMenu = this.querySelector('.dropdown-menu');
            dropdownMenu.classList.remove('show');
        });
    });

    // Efecto especial para botón de logout
    const btnLogout = document.querySelector('.btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('mouseenter', function() {
            this.classList.add('pulse');
        });
        
        btnLogout.addEventListener('mouseleave', function() {
            this.classList.remove('pulse');
        });
        
        btnLogout.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Animación de salida
            const originalHTML = this.innerHTML;
            this.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span> Cerrando...';
            this.classList.remove('pulse');
            
            // Simular acción de logout
            setTimeout(() => {
                window.location.href = this.getAttribute('href');
            }, 1500);
        });
    }

    // Filtro de búsqueda
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const menuItems = document.querySelectorAll('.menu-item');
            
            menuItems.forEach(item => {
                const title = item.querySelector('.card-title').textContent.toLowerCase();
                const description = item.querySelector('.card-text').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    item.parentElement.style.display = 'block';
                } else {
                    item.parentElement.style.display = 'none';
                }
            });
        });
    }

    // Efecto ripple para botones
    document.querySelectorAll('.btn-primary, .btn-confirmar').forEach(button => {
        button.addEventListener('click', function(e) {
            // Crear elemento para el efecto
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            
            // Posicionar el efecto
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size/2;
            const y = e.clientY - rect.top - size/2;
            
            // Estilos del efecto
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // Agregar y luego remover el efecto
            this.appendChild(ripple);
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Evento para el botón flotante del carrito
    const btnCarritoFlotante = document.getElementById('btn-carrito-flotante');
    if (btnCarritoFlotante) {
        btnCarritoFlotante.addEventListener('click', function() {
            window.location.href = 'carrito.html';
        });
    }

    // Cargar componentes comunes
    cargarComponentes();
});

// Función para cargar componentes comunes
function cargarComponentes() {
    // Cargar navbar si existe el contenedor
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        fetch('includes/navbar.html')
            .then(response => response.text())
            .then(data => {
                navbarContainer.innerHTML = data;
                setActiveLink();
            });
    }
    
    // Cargar footer si existe el contenedor
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        fetch('includes/footer.html')
            .then(response => response.text())
            .then(data => {
                footerContainer.innerHTML = data;
            });
    }
    
    // Cargar elementos flotantes si existe el contenedor
    const flotantesContainer = document.getElementById('flotantes-container');
    if (flotantesContainer) {
        fetch('includes/whatsapp-flotante.html')
            .then(response => response.text())
            .then(data => {
                flotantesContainer.innerHTML = data;
            });
    }
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