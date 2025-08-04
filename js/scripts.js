// Clase para manejar el carrito
class Carrito {
    constructor() {
        this.carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        this.actualizarIconoCarrito();
        this.actualizarCarritoFlotante();
    }

    agregarProducto(producto) {
        // Verificar si es un producto personalizado
        if (producto.personalizado) {
            // Los productos personalizados siempre se agregan como nuevos items
            this.carrito.push(producto);
        } else {
            // Para productos normales, verificar si ya existe
            const productoExistente = this.carrito.find(item => 
                item.id === producto.id && 
                (!item.personalizado || JSON.stringify(item.ingredientes) === JSON.stringify(producto.ingredientes)
            ));
            
            if (productoExistente) {
                productoExistente.cantidad += 1;
            } else {
                this.carrito.push({
                    ...producto,
                    cantidad: 1
                });
            }
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
        const flotante = document.getElementById('btn-carrito-flotante');
        if (flotante) {
            const count = this.obtenerCantidadTotal();
            const badge = flotante.querySelector('.badge');
            if (badge) {
                badge.textContent = count;
                if (count > 0) {
                    flotante.classList.add('has-items');
                    badge.style.display = 'flex';
                } else {
                    flotante.classList.remove('has-items');
                    badge.style.display = 'none';
                }
            }
        }
    }

    mostrarNotificacion(nombreProducto) {
        // Crear notificación dinámica si no existe el toast
        const notificacion = document.createElement('div');
        notificacion.className = 'position-fixed bottom-0 end-0 p-3';
        notificacion.style.zIndex = '1100';
        notificacion.innerHTML = `
            <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-success text-white">
                    <strong class="me-auto">Éxito</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    "${nombreProducto}" se ha añadido a tu carrito.
                </div>
            </div>
        `;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.remove();
        }, 3000);
    }

    async enviarPedido() {
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