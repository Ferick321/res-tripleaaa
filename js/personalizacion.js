document.addEventListener('DOMContentLoaded', function() {
    // Modal de personalización
    const personalizarModal = new bootstrap.Modal(document.getElementById('personalizarModal'));
    let currentProduct = null;
    
    // Lista de ingredientes disponibles
    const ingredientesDisponibles = [
        { nombre: 'Presa de Pollo', precio: 1.25 },
        { nombre: 'Carne', precio: 0.50 },
        { nombre: 'Salchicha ', precio: 0.25 },
        { nombre: 'Huevo', precio: 0.30 },
        { nombre: 'Porción de Papas', precio: 1.00 }
    ];
    
    // Event listeners para botones de personalizar
    document.querySelectorAll('.personalizar-item').forEach(button => {
        button.addEventListener('click', function() {
            currentProduct = {
                id: this.dataset.id,
                nombre: this.dataset.nombre,
                precio: parseFloat(this.dataset.precio),
                imagen: this.dataset.imagen
            };
            
            // Actualizar información del modal
            document.getElementById('modal-product-image').src = currentProduct.imagen;
            document.getElementById('modal-product-name').textContent = currentProduct.nombre;
            document.getElementById('modal-product-price').textContent = `$${currentProduct.precio.toFixed(2)}`;
            
            // Generar tabla de ingredientes
            const tableBody = document.getElementById('ingredientes-table');
            tableBody.innerHTML = '';
            
            ingredientesDisponibles.forEach(ingrediente => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><input type="number" min="0" value="0" class="form-control cantidad-ingrediente" data-precio="${ingrediente.precio}"></td>
                    <td>${ingrediente.nombre}</td>
                    <td>$${ingrediente.precio.toFixed(2)}</td>
                    <td class="total-ingrediente">$0.00</td>
                `;
                tableBody.appendChild(row);
            });
            
            // Actualizar total inicial
            actualizarTotalPersonalizado();
            
            // Mostrar modal
            personalizarModal.show();
        });
    });
    
    // Event listener para cambios en las cantidades
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('cantidad-ingrediente')) {
            const cantidad = parseInt(e.target.value) || 0;
            const precio = parseFloat(e.target.dataset.precio);
            const total = cantidad * precio;
            
            const row = e.target.closest('tr');
            row.querySelector('.total-ingrediente').textContent = `$${total.toFixed(2)}`;
            
            actualizarTotalPersonalizado();
        }
    });
    
    // Función para actualizar el total personalizado
    function actualizarTotalPersonalizado() {
        let total = currentProduct.precio;
        
        document.querySelectorAll('.cantidad-ingrediente').forEach(input => {
            const cantidad = parseInt(input.value) || 0;
            const precio = parseFloat(input.dataset.precio);
            total += cantidad * precio;
        });
        
        document.getElementById('total-personalizado').textContent = `$${total.toFixed(2)}`;
    }
    
    // Event listener para agregar al carrito
    document.getElementById('btn-agregar-personalizado').addEventListener('click', function() {
        if (!currentProduct) return;
        
        // Obtener los ingredientes seleccionados
        const ingredientesSeleccionados = [];
        let totalAdicional = 0;
        
        document.querySelectorAll('.cantidad-ingrediente').forEach((input, index) => {
            const cantidad = parseInt(input.value) || 0;
            if (cantidad > 0) {
                const ingrediente = ingredientesDisponibles[index];
                ingredientesSeleccionados.push({
                    nombre: ingrediente.nombre,
                    cantidad: cantidad,
                    precio: ingrediente.precio
                });
                totalAdicional += cantidad * ingrediente.precio;
            }
        });
        
        // Crear objeto del producto personalizado
        const productoPersonalizado = {
            id: currentProduct.id + '-personalizado-' + Date.now(),
            nombre: currentProduct.nombre,
            precio: currentProduct.precio + totalAdicional,
            imagen: currentProduct.imagen,
            cantidad: 1,
            personalizado: true,
            ingredientes: ingredientesSeleccionados
        };
        
        // Agregar al carrito (compatible con ambos métodos)
        if (typeof carrito !== 'undefined' && typeof carrito.agregarProducto === 'function') {
            carrito.agregarProducto(productoPersonalizado);
        } else {
            agregarAlCarrito(productoPersonalizado);
        }
        
        // Cerrar modal
        personalizarModal.hide();
        
        // Mostrar notificación
        mostrarNotificacion('Producto personalizado agregado al carrito');
    });
    
    // Función para agregar al carrito (compatible con carrito.js)
    function agregarAlCarrito(producto) {
        const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        
        // Verificar si ya existe un producto igual en el carrito
        const productoExistente = carrito.find(item => 
            item.id === producto.id && 
            JSON.stringify(item.ingredientes) === JSON.stringify(producto.ingredientes)
        );
        
        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            carrito.push(producto);
        }
        
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Disparar evento de actualización del carrito
        window.dispatchEvent(new Event('carritoActualizado'));
    }
    
    // Función para mostrar notificación
    function mostrarNotificacion(mensaje) {
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
                    ${mensaje}
                </div>
            </div>
        `;
        
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.remove();
        }, 3000);
    }
});