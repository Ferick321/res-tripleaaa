document.addEventListener('DOMContentLoaded', function() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const listaCarrito = document.getElementById('lista-carrito');
    const carritoVacio = document.getElementById('carrito-vacio');
    const subtotalElement = document.getElementById('subtotal');
    const envioElement = document.getElementById('envio');
    const totalElement = document.getElementById('total');
    const btnPagar = document.getElementById('btn-pagar');
    const btnVaciar = document.getElementById('btn-vaciar');
    const tipoEntrega = document.getElementById('tipo-entrega');
    const metodoPago = document.getElementById('metodo-pago');
    const divDireccion = document.getElementById('div-direccion');
    const direccionInput = document.getElementById('direccion');
    const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));
    
    const costoEnvio = 1.50;
    let envio = 0;

    // Event listeners
    tipoEntrega.addEventListener('change', actualizarEnvio);
    btnVaciar.addEventListener('click', vaciarCarrito);
    btnPagar.addEventListener('click', mostrarConfirmacion);
    metodoPago.addEventListener('change', actualizarMetodoPago);

    function renderCarrito() {
        listaCarrito.innerHTML = '';
        
        if (carrito.length === 0) {
            carritoVacio.classList.remove('d-none');
            btnPagar.disabled = true;
            subtotalElement.textContent = '$0.00';
            envioElement.textContent = '$0.00';
            totalElement.textContent = '$0.00';
            return;
        }
        
        carritoVacio.classList.add('d-none');
        btnPagar.disabled = false;
        
        let subtotal = 0;
        
        carrito.forEach((producto, index) => {
            subtotal += producto.precio * producto.cantidad;
            
            const item = document.createElement('div');
            item.className = 'row align-items-center mb-3';
            item.innerHTML = `
                <div class="col-3">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="img-fluid rounded">
                </div>
                <div class="col-5">
                    <h6 class="mb-1">${producto.nombre}</h6>
                    <small class="text-muted">$${producto.precio.toFixed(2)} c/u</small>
                </div>
                <div class="col-2">
                    <input type="number" min="1" value="${producto.cantidad}" 
                           class="form-control form-control-sm cantidad-item" 
                           data-index="${index}">
                </div>
                <div class="col-2 text-end">
                    <span class="fw-bold">$${(producto.precio * producto.cantidad).toFixed(2)}</span>
                    <button class="btn btn-sm btn-outline-danger ms-2 eliminar-item" data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;
            
            listaCarrito.appendChild(item);
        });
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        actualizarEnvio();
        
        // Event listeners para los nuevos elementos
        document.querySelectorAll('.cantidad-item').forEach(input => {
            input.addEventListener('change', function() {
                const index = this.dataset.index;
                const nuevaCantidad = parseInt(this.value);
                
                if (nuevaCantidad > 0) {
                    carrito[index].cantidad = nuevaCantidad;
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    renderCarrito();
                    window.dispatchEvent(new Event('carritoActualizado'));
                }
            });
        });
        
        document.querySelectorAll('.eliminar-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.dataset.index;
                carrito.splice(index, 1);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                renderCarrito();
                window.dispatchEvent(new Event('carritoActualizado'));
            });
        });
    }
    
    function actualizarEnvio() {
        if (tipoEntrega.value === 'domicilio') {
            envio = costoEnvio;
            divDireccion.classList.remove('d-none');
        } else {
            envio = 0;
            divDireccion.classList.add('d-none');
        }
        
        envioElement.textContent = `$${envio.toFixed(2)}`;
        actualizarTotal();
    }
    
    function actualizarMetodoPago() {
        if (metodoPago.value === 'tarjeta') {
            mostrarAlerta('Para pagos con tarjeta, por favor comuníquese con nuestro personal.');
        }
    }
    
    function actualizarTotal() {
        const subtotal = parseFloat(subtotalElement.textContent.replace('$', ''));
        const total = subtotal + envio;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
    
    function vaciarCarrito() {
        if (confirm('¿Estás seguro de que quieres vaciar tu carrito?')) {
            localStorage.removeItem('carrito');
            carrito.length = 0;
            renderCarrito();
            window.dispatchEvent(new Event('carritoActualizado'));
        }
    }
    
    function mostrarAlerta(mensaje) {
        const alerta = document.createElement('div');
        alerta.className = 'alert alert-warning alert-dismissible fade show';
        alerta.innerHTML = `
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        
        const contenedor = document.querySelector('.card-body');
        contenedor.prepend(alerta);
    }
    
    function mostrarConfirmacion() {
        if (tipoEntrega.value === 'domicilio' && !direccionInput.value.trim()) {
            mostrarAlerta('Por favor ingrese una dirección para la entrega.');
            direccionInput.classList.add('is-invalid');
            return;
        }
        
        const resumenPedido = document.getElementById('resumen-pedido');
        let html = `
            <h6>Resumen del Pedido</h6>
            <ul class="list-group mb-3">
        `;
        
        carrito.forEach(item => {
            html += `
                <li class="list-group-item d-flex justify-content-between">
                    <span>${item.nombre} x${item.cantidad}</span>
                    <span>$${(item.precio * item.cantidad).toFixed(2)}</span>
                </li>
            `;
        });
        
        html += `
            </ul>
            <div class="d-flex justify-content-between mb-2">
                <strong>Subtotal:</strong>
                <span>${subtotalElement.textContent}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <strong>Envío:</strong>
                <span>${envioElement.textContent}</span>
            </div>
            <div class="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <span>${totalElement.textContent}</span>
            </div>
            <div class="mb-2">
                <strong>Tipo de Entrega:</strong> ${tipoEntrega.options[tipoEntrega.selectedIndex].text}
            </div>
            <div class="mb-2">
                <strong>Método de Pago:</strong> ${metodoPago.options[metodoPago.selectedIndex].text}
            </div>
        `;
        
        if (tipoEntrega.value === 'domicilio' && direccionInput.value) {
            html += `
                <div class="mb-2">
                    <strong>Dirección:</strong> ${direccionInput.value}
                </div>
            `;
        }
        
        resumenPedido.innerHTML = html;
        confirmModal.show();
        
        document.getElementById('btn-confirmar').addEventListener('click', confirmarPedido);
    }
    
    function confirmarPedido() {
        const subtotal = parseFloat(subtotalElement.textContent.replace('$', ''));
        const total = subtotal + envio;
        
        let mensaje = `¡Hola! Quiero hacer un pedido:%0A%0A`;
        
        carrito.forEach(item => {
            mensaje += `- ${item.nombre} x${item.cantidad}: $${(item.precio * item.cantidad).toFixed(2)}%0A`;
        });
        
        mensaje += `%0ASubtotal: $${subtotal.toFixed(2)}%0A`;
        mensaje += `Envío: $${envio.toFixed(2)}%0A`;
        mensaje += `Total: $${total.toFixed(2)}%0A%0A`;
        mensaje += `Tipo de entrega: ${tipoEntrega.options[tipoEntrega.selectedIndex].text}%0A`;
        mensaje += `Método de pago: ${metodoPago.options[metodoPago.selectedIndex].text}%0A`;
        
        if (tipoEntrega.value === 'domicilio' && direccionInput.value) {
            mensaje += `Dirección: ${direccionInput.value}%0A`;
        }
        
        mensaje += `%0A¡Gracias!`;
        
        const spinner = document.getElementById('loading-spinner');
        if (spinner) spinner.style.display = 'flex';
        
        setTimeout(() => {
            window.open(`https://wa.me/+593987646410?text=${mensaje}`, '_blank');
            
            if (spinner) spinner.style.display = 'none';
            confirmModal.hide();
            
            localStorage.removeItem('carrito');
            window.dispatchEvent(new Event('carritoActualizado'));
            
            window.location.href = 'confirmacion.html';
        }, 1000);
    }

    // Inicializar
    renderCarrito();
    window.addEventListener('carritoActualizado', renderCarrito);
});