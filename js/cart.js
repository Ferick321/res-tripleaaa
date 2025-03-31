// Manejo del carrito de compras
class Cart {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    }

    addItem(item) {
        const existingItem = this.cart.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.cart.push(item);
        }
        this.save();
    }

    removeItem(index) {
        this.cart.splice(index, 1);
        this.save();
    }

    updateQuantity(index, quantity) {
        if (quantity > 0) {
            this.cart[index].quantity = quantity;
            this.save();
        }
    }

    clear() {
        this.cart = [];
        this.save();
    }

    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    save() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateCartIcon();
    }

    updateCartIcon() {
        const count = this.getItemCount();
        const cartIcon = document.getElementById('cart-icon-count');
        if (cartIcon) {
            cartIcon.textContent = count;
            cartIcon.style.display = count > 0 ? 'flex' : 'none';
        }
    }
}

// Uso en otras páginas:
const cart = new Cart();

// Para agregar un producto:
function addToCart(product) {
    cart.addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description,
        quantity: 1
    });
    
    // Mostrar notificación
    const toast = new bootstrap.Toast(document.getElementById('added-to-cart-toast'));
    toast.show();
}