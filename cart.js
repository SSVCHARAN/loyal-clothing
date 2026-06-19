// cart.js
document.addEventListener('DOMContentLoaded', () => {
  const cartState = {
    items: JSON.parse(localStorage.getItem('loyal_cart')) || [],
    
    save() {
      localStorage.setItem('loyal_cart', JSON.stringify(this.items));
      this.render();
    },

    addItem(product, size) {
      const existingItem = this.items.find(i => i.id === product.id && i.size === size);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        this.items.push({ ...product, size, quantity: 1 });
      }
      this.save();
      
      // Also open the cart overlay when an item is added
      if (typeof openOverlay !== 'undefined') {
        openOverlay('cart');
      } else {
        // Fallback if openOverlay isn't globally accessible
        const overlay = document.querySelector('#cart-overlay');
        if (overlay) {
          overlay.classList.add('active');
          gsap.to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' });
          gsap.fromTo(overlay.querySelector('.cart-drawer'), { x: '100%' }, { x: '0%', duration: 0.5, ease: 'expo.out' });
        }
      }
    },

    removeItem(id, size) {
      this.items = this.items.filter(i => !(i.id === id && i.size === size));
      this.save();
    },
    
    updateQuantity(id, size, delta) {
      const item = this.items.find(i => i.id === id && i.size === size);
      if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) this.removeItem(id, size);
        else this.save();
      }
    },

    render() {
      const cartBody = document.querySelector('.cart-body');
      const cartFooter = document.querySelector('.cart-footer');
      
      const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
      document.querySelectorAll('[aria-label="Cart"] span').forEach(badge => {
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline-block' : 'none';
      });

      if (!cartBody) return;

      if (this.items.length === 0) {
        cartBody.innerHTML = '<p style="color:var(--muted); text-align:center; margin-top:40px;">Your cart is currently empty.</p>';
        if(cartFooter) cartFooter.querySelector('span:last-child').textContent = '$0.00';
        return;
      }

      let html = '<div style="display:flex; flex-direction:column; gap:24px;">';
      let subtotal = 0;

      this.items.forEach(item => {
        subtotal += item.price * item.quantity;
        html += `
          <div style="display:flex; gap:16px;">
            <div style="width:80px; height:100px; background:var(--muted); border-radius:4px; overflow:hidden;">
              <img src="${item.img}" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <div style="flex:1; display:flex; flex-direction:column; justify-content:space-between; font-size:13px;">
              <div>
                <h4 style="font-size:14px; margin:0 0 4px 0;">${item.name}</h4>
                <p style="margin:0; color:var(--muted);">Color: ${item.color} | Size: ${item.size}</p>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <div style="display:flex; align-items:center; gap:12px; border:1px solid var(--border); padding:4px 8px; border-radius:4px;">
                  <button onclick="window.LoyalCart.updateQuantity(${item.id}, '${item.size}', -1)" style="background:none; border:none; cursor:pointer; font-size:16px; line-height:1;">-</button>
                  <span>${item.quantity}</span>
                  <button onclick="window.LoyalCart.updateQuantity(${item.id}, '${item.size}', 1)" style="background:none; border:none; cursor:pointer; font-size:16px; line-height:1;">+</button>
                </div>
                <span style="font-weight:700;">$${item.price * item.quantity}</span>
              </div>
            </div>
          </div>
        `;
      });
      html += '</div>';
      cartBody.innerHTML = html;
      if(cartFooter) cartFooter.querySelector('span:last-child').textContent = '$' + subtotal.toFixed(2);
    }
  };

  window.LoyalCart = cartState;

  // Let app-ui inject HTML first
  setTimeout(() => cartState.render(), 100);
});
