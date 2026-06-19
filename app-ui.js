// app-ui.js
document.addEventListener('DOMContentLoaded', () => {
  // 1. Inject HTML Overlays
  const uiHTML = `
    <!-- Cart Overlay -->
    <div id="cart-overlay" class="app-overlay" role="dialog" aria-modal="true" aria-label="Shopping Cart">
      <div class="app-backdrop" data-close="cart"></div>
      <div class="cart-drawer">
        <div class="cart-header" style="display:flex; justify-content:space-between; align-items:center;">
          <h2 style="margin:0; font-size:18px; text-transform:uppercase; letter-spacing:0.05em; font-family:var(--font-display, sans-serif);">Your Bag</h2>
          <button class="close-btn" aria-label="Close Cart" data-close="cart">&times;</button>
        </div>
        <div class="cart-body">
          <p style="color:var(--muted); text-align:center; margin-top:40px;">Your bag is currently empty.</p>
        </div>
        <div class="cart-footer">
          <div style="display:flex; justify-content:space-between; margin-bottom:20px; font-weight:700;">
            <span>Subtotal</span>
            <span>$0.00</span>
          </div>
          <button class="btn btn-primary" style="width:100%; padding:16px; font-size:14px; text-align:center; justify-content:center;">Checkout</button>
        </div>
      </div>
    </div>

    <!-- Search Overlay -->
    <div id="search-overlay" class="app-overlay" role="dialog" aria-modal="true" aria-label="Search">
      <div class="search-modal">
        <div class="search-header">
          <input type="text" class="search-input" placeholder="Search Atelier..." aria-label="Search items">
          <button class="close-btn" aria-label="Close Search" data-close="search" style="font-size:40px;">&times;</button>
        </div>
        <div style="padding:40px;">
          <p class="eyebrow" style="opacity:0.5; margin-bottom:16px; font-size:11px; text-transform:uppercase; letter-spacing:0.1em; font-family:var(--font-mono, monospace);">Popular Searches</p>
          <div style="display:flex; gap:16px; flex-wrap:wrap;">
            <a href="#" style="padding:8px 16px; border:1px solid var(--border); border-radius:100px; font-size:13px;">Heavyweight Tee</a>
            <a href="#" style="padding:8px 16px; border:1px solid var(--border); border-radius:100px; font-size:13px;">Cargo Pants</a>
            <a href="#" style="padding:8px 16px; border:1px solid var(--border); border-radius:100px; font-size:13px;">Accessories</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Nav Overlay -->
    <div id="mobile-nav-overlay" class="app-overlay" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
      <div class="app-backdrop" data-close="mobile-nav"></div>
      <div class="mobile-nav-drawer">
        <button class="close-btn" aria-label="Close Menu" data-close="mobile-nav" style="align-self:flex-end; margin-bottom:40px;">&times;</button>
        <nav style="display:flex; flex-direction:column;">
          <a href="#collection" class="mobile-nav-link">Collection</a>
          <a href="#lookbook" class="mobile-nav-link">Lookbook</a>
          <a href="#atelier" class="mobile-nav-link">Atelier</a>
          <a href="#service" class="mobile-nav-link">Service</a>
        </nav>
      </div>
    </div>

    <!-- Product Quick View Modal -->
    <div id="quickview-overlay" class="app-overlay" role="dialog" aria-modal="true" aria-label="Product Quick View">
      <div class="app-backdrop" data-close="quickview"></div>
      <div class="quickview-modal" style="position: absolute; top: 0; left: 0; bottom: 0; right: 0; margin: auto; background: var(--bg); width: 90%; max-width: 1000px; border-radius: var(--radius); overflow: hidden; display: flex; flex-direction: column; max-height: 90vh;">
        <button class="close-btn" data-close="quickview" style="position: absolute; top: 16px; right: 16px; z-index: 10; background: var(--surface); border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">&times;</button>
        <div id="quickview-content" style="flex: 1; min-height: 0; display: flex; flex-wrap: wrap; overflow-y: auto; background: var(--bg);"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', uiHTML);

  // 2. Overlay Setup
  const overlayMap = {
    'cart': { id: '#cart-overlay', panel: '.cart-drawer', animProps: { x: '100%' } },
    'search': { id: '#search-overlay', panel: '.search-modal', animProps: { y: -20, opacity: 0 } },
    'mobile-nav': { id: '#mobile-nav-overlay', panel: '.mobile-nav-drawer', animProps: { x: '-100%' } },
    'quickview': { id: '#quickview-overlay', panel: '.quickview-modal', animProps: { scale: 0.95, opacity: 0 } }
  };

  function openOverlay(type) {
    const config = overlayMap[type];
    const overlay = document.querySelector(config.id);
    const panel = overlay.querySelector(config.panel);
    overlay.classList.add('active');
    
    if (typeof gsap !== 'undefined') {
      gsap.to(overlay, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      if (type === 'cart' || type === 'mobile-nav') {
        gsap.fromTo(panel, config.animProps, { x: '0%', duration: 0.5, ease: 'expo.out' });
      } else if (type === 'search' || type === 'quickview') {
        gsap.fromTo(panel, config.animProps, { y: 0, x: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out' });
      }
    }
  }

  function closeOverlay(type) {
    const config = overlayMap[type];
    const overlay = document.querySelector(config.id);
    const panel = overlay.querySelector(config.panel);

    if (typeof gsap !== 'undefined') {
      gsap.to(panel, { ...config.animProps, duration: 0.4, ease: 'power2.in' });
      gsap.to(overlay, { opacity: 0, duration: 0.4, ease: 'power2.in', onComplete: () => overlay.classList.remove('active') });
    } else {
      overlay.classList.remove('active');
    }
  }

  // 3. Smooth Scrolling (SPA Navigation)
  document.querySelectorAll('.topnav nav a, .mobile-nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          // Close mobile nav if open
          if (document.querySelector('#mobile-nav-overlay').classList.contains('active')) {
            closeOverlay('mobile-nav');
          }
          // Smooth scroll
          const headerOffset = 80;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
             top: offsetPosition,
             behavior: "smooth"
          });

          // Update active state
          document.querySelectorAll('.topnav nav a').forEach(a => a.classList.remove('active'));
          const topnavLink = document.querySelector(`.topnav nav a[href="${targetId}"]`);
          if (topnavLink) topnavLink.classList.add('active');
        }
      }
    });
  });

  // 4. Attach General Listeners
  document.querySelectorAll('[aria-label="Cart"]').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); openOverlay('cart'); }));
  document.querySelectorAll('[aria-label="Search"]').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); openOverlay('search'); }));
  document.querySelectorAll('.nav-mobile-toggle').forEach(btn => btn.addEventListener('click', (e) => { e.preventDefault(); openOverlay('mobile-nav'); }));
  document.body.addEventListener('click', (e) => { if (e.target.dataset.close) closeOverlay(e.target.dataset.close); });

  // 5. Dynamic Collection Rendering (Moved from shop.html)
  if (typeof products !== 'undefined') {
    let currentCategory = 'All';
    let currentSort = 'Default';
    const grid = document.getElementById('product-grid');
    
    if (grid) {
      window.renderGrid = function() {
        let filtered = products;
        if (currentCategory !== 'All') filtered = products.filter(p => p.category === currentCategory);
        if (currentSort === 'Price: Low to High') filtered = filtered.slice().sort((a, b) => a.price - b.price);
        else if (currentSort === 'Price: High to Low') filtered = filtered.slice().sort((a, b) => b.price - a.price);

        function updateDOM() {
          grid.innerHTML = filtered.map(p => `
            <div class="product-card" onclick="window.openQuickView(${p.id})" style="cursor:pointer;">
              <div class="product-img">
                <img src="${p.img}" alt="${p.name}" ${p.filter ? `style="filter: ${p.filter};"` : ''}>
              </div>
              <div class="product-info">
                <h3 style="font-family: var(--font-display); font-size: 18px; margin: 0 0 4px; font-weight: 500;">${p.name}</h3>
                <span class="product-price" style="font-weight: 500; color: var(--accent);">$${p.price}</span>
              </div>
              <p style="padding: 0 24px 24px; font-family: var(--font-mono); font-size: 11px; color: var(--muted); margin: 0; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em;">${p.color}</p>
            </div>
          `).join('');

          const countDisplay = document.getElementById('count-display');
          if (countDisplay) countDisplay.textContent = `${filtered.length} Units in Drop`;

          try {
            if (typeof gsap !== 'undefined') {
              gsap.fromTo('.product-card', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'expo.out' });
              setTimeout(() => { if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh(); }, 100);
            }
          } catch (e) {
            console.error("Animation skipped:", e);
          }
        }

        const existingCards = document.querySelectorAll('#product-grid .product-card');
        if (existingCards.length > 0 && typeof gsap !== 'undefined') {
          gsap.to(existingCards, { opacity: 0, y: 20, duration: 0.3, stagger: 0.05, onComplete: updateDOM });
        } else {
          updateDOM();
        }
      };

      const filterSelect = document.getElementById('filter-select');
      const sortSelect = document.getElementById('sort-select');
      if (filterSelect) filterSelect.addEventListener('change', (e) => { currentCategory = e.target.value; renderGrid(); });
      if (sortSelect) sortSelect.addEventListener('change', (e) => { currentSort = e.target.value; renderGrid(); });
      
      setTimeout(renderGrid, 100);
    }

    // Quick View Logic
    window.openQuickView = function(productId) {
      const p = products.find(x => x.id === productId);
      if (!p) return;
      
      const content = document.getElementById('quickview-content');
      content.innerHTML = `
        <div style="flex: 1 1 300px; min-width: 300px; display: flex; align-items: center; justify-content: center; background: #F5F2EB; box-sizing: border-box; position: relative;">
          <img src="${p.img}" style="width: 100%; height: 100%; max-height: 600px; object-fit: contain; padding: 40px; box-sizing: border-box; ${p.filter ? `filter: ${p.filter};` : ''}" alt="${p.name}">
        </div>
        <div style="flex: 1 1 300px; min-width: 300px; display: flex; flex-direction: column; box-sizing: border-box; background: var(--bg);">
          <div style="padding: 48px 40px; overflow-y: auto; height: 100%; box-sizing: border-box;">
            
            <style>
              #q-add-to-bag { position: relative; overflow: hidden; transform: translateZ(0); box-shadow: 0 4px 14px 0 rgba(0,0,0,0.1); }
              #q-add-to-bag::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); transition: left 0.6s ease; }
              #q-add-to-bag:hover::before { left: 100%; }
              #q-add-to-bag:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.15); background: var(--accent); border-color: var(--accent); }
              #q-add-to-bag:active { transform: translateY(0); }
              .q-size-btn:hover { border-color: var(--fg) !important; transform: translateY(-1px); }
            </style>

            <div class="q-stagger" style="margin-bottom: 16px;">
              <span style="font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted);">${p.category}</span>
            </div>

            <h2 class="q-stagger" style="font-family: var(--font-display); font-size: 32px; font-weight: 400; color: var(--fg); margin-bottom: 8px; line-height: 1.1;">${p.name}</h2>
            <p class="q-stagger" style="font-size: 20px; color: var(--fg); margin-bottom: 32px;">$${p.price} USD</p>
            
            <p class="q-stagger" style="color: var(--muted); margin-bottom: 32px; line-height: 1.6; font-size: 15px;">${p.description || 'Premium heavyweight construction. Built for permanence and designed for modern streets.'}</p>
            
            <div class="q-stagger" style="height: 1px; background: var(--border); margin-bottom: 32px;"></div>

            <div class="q-stagger" style="margin-bottom: 32px;">
              <p style="font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fg); margin-bottom: 12px; font-weight: 500;">Color &mdash; <span style="color: var(--muted);">${p.color || 'Signature Standard'}</span></p>
              <div style="display: flex; gap: 12px;">
                <div style="width: 28px; height: 28px; border-radius: 50%; background: ${p.color && p.color.includes('Blue') ? '#2563EB' : p.color && p.color.includes('Yellow') ? '#EAB308' : p.color && p.color.includes('Pink') ? '#DB2777' : p.color && p.color.includes('Red') ? '#DC2626' : p.color && p.color.includes('Orange') ? '#EA580C' : p.color && p.color.includes('Violet') ? '#7C3AED' : '#1A1512'}; outline: 1px solid var(--fg); outline-offset: 2px;"></div>
              </div>
            </div>

            <div class="q-stagger" style="margin-bottom: 40px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 12px; align-items: baseline;">
                <p style="font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fg); font-weight: 500; margin: 0;">Size</p>
                <a href="#" onclick="event.preventDefault(); alert('Size Guide: Fits true to size. Take your normal size.');" style="font-family: var(--font-mono); font-size: 11px; color: var(--muted); text-decoration: underline;">Size Guide</a>
              </div>
              <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;" id="q-size-selector">
                ${(p.sizes || ['S', 'M', 'L', 'XL']).map((sz, i) => `
                  <button class="q-size-btn" data-size="${sz}" style="height: 44px; border: 1px solid ${i === 1 ? 'var(--fg)' : 'var(--border)'}; background: ${i === 1 ? 'var(--fg)' : 'transparent'}; color: ${i === 1 ? 'var(--bg)' : 'var(--fg)'}; font-family: var(--font-mono); font-size: 13px; cursor: pointer; transition: all 0.2s;">${sz}</button>
                `).join('')}
              </div>
            </div>

            <div class="q-stagger">
              <button id="q-add-to-bag" style="width: 100%; padding: 18px; background: var(--fg); color: var(--bg); border: 1px solid var(--fg); font-family: var(--font-mono); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; font-size: 13px; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); margin-bottom: 16px;">Add to Bag</button>
            </div>
            
            <div class="q-stagger" style="display: flex; justify-content: center; align-items: center; gap: 8px;">
              <div style="width: 6px; height: 6px; border-radius: 50%; background: #10B981;"></div>
              <span style="font-family: var(--font-body); font-size: 12px; color: var(--muted);">In stock & ready to ship</span>
            </div>

            <div class="q-stagger" style="margin-top: 48px; border-top: 1px solid var(--border);">
              <div class="q-accordion" style="border-bottom: 1px solid var(--border);">
                <div style="padding: 16px 0; display: flex; justify-content: space-between; cursor: pointer;">
                  <span style="font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fg);">Details & Care</span>
                  <span class="q-icon" style="color: var(--muted); transition: transform 0.3s;">+</span>
                </div>
                <div class="q-content" style="height: 0px; overflow: hidden; transition: height 0.3s ease;">
                  <p style="padding-bottom: 16px; margin: 0; font-size: 13px; color: var(--muted); line-height: 1.5;">Made from premium materials. Machine wash cold, lay flat to dry. Do not bleach or tumble dry to maintain shape and color.</p>
                </div>
              </div>
              <div class="q-accordion" style="border-bottom: 1px solid var(--border);">
                <div style="padding: 16px 0; display: flex; justify-content: space-between; cursor: pointer;">
                  <span style="font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fg);">Shipping & Returns</span>
                  <span class="q-icon" style="color: var(--muted); transition: transform 0.3s;">+</span>
                </div>
                <div class="q-content" style="height: 0px; overflow: hidden; transition: height 0.3s ease;">
                  <p style="padding-bottom: 16px; margin: 0; font-size: 13px; color: var(--muted); line-height: 1.5;">Complimentary standard shipping on all orders over $200. Returns accepted within 14 days of delivery in original condition.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      `;
      
      let selectedSize = (p.sizes || ['S', 'M', 'L', 'XL'])[1];
      const sizeBtns = content.querySelectorAll('.q-size-btn');
      sizeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          sizeBtns.forEach(b => {
            b.style.background = 'transparent';
            b.style.color = 'var(--fg)';
            b.style.borderColor = 'var(--border)';
          });
          btn.style.background = 'var(--fg)';
          btn.style.color = 'var(--bg)';
          btn.style.borderColor = 'var(--fg)';
          selectedSize = btn.dataset.size;
        });
      });

      const addBtn = content.querySelector('#q-add-to-bag');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          window.LoyalCart.addItem(p, selectedSize);
          document.querySelector('#quickview-overlay').classList.remove('active');
        });
      }

      const accordions = content.querySelectorAll('.q-accordion');
      accordions.forEach(acc => {
        const header = acc.querySelector('div:first-child');
        const accContent = acc.querySelector('.q-content');
        const icon = acc.querySelector('.q-icon');
        header.addEventListener('click', () => {
          const isOpen = accContent.style.height !== '0px';
          if (isOpen) {
            accContent.style.height = '0px';
            icon.style.transform = 'rotate(0deg)';
          } else {
            accContent.style.height = accContent.scrollHeight + 'px';
            icon.style.transform = 'rotate(45deg)';
          }
        });
      });

      openOverlay('quickview');

      // Subtle Entrance Animations
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(content.querySelectorAll('.q-stagger'), 
          { y: 20, opacity: 0 }, 
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out', delay: 0.1 }
        );
        gsap.fromTo(content.previousElementSibling.querySelector('img'),
          { scale: 0.95, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.1 }
        );
      }
    };
  }

  // 6. Magnetic Buttons
  const buttons = document.querySelectorAll('.btn:not(.nav-mobile)');
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      if (typeof gsap !== 'undefined') {
        gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
      }
    });
    btn.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
      }
    });
  });

});
