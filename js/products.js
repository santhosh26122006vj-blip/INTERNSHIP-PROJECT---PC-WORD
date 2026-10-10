/* ==========================================================================
   PC WORD — Product Catalog Data
   Single source of truth for every product shown on the homepage and cart.
   Swap the `image` path for each product with a real photo you've found —
   the filename is already wired up, just replace the file in
   /images/products/ and keep the same name (or update the path here).
   ========================================================================== */

/**
 * @typedef {Object} Product
 * @property {string} id            Unique id, also used as the cart key
 * @property {string} category      Display label, e.g. "Processor (CPU)"
 * @property {string} categorySlug  URL/filter-safe key, e.g. "cpu"
 * @property {string} name          Product name shown on the card
 * @property {string} spec          One-line spec summary (mono font)
 * @property {number} price         Current price in INR (no symbol, no commas)
 * @property {number|null} oldPrice Optional strike-through price, or null
 * @property {string} image         Path to product image (placeholder for now)
 * @property {boolean} inStock      Controls the "In Stock" badge
 */

const CATEGORIES = [
  { slug: 'all', label: 'All Products' },
  { slug: 'cpu', label: 'Processors' },
  { slug: 'gpu', label: 'Graphics Cards' },
  { slug: 'ram', label: 'Memory' },
  { slug: 'ssd', label: 'Storage' },
  { slug: 'cooler', label: 'Cooling' },
  { slug: 'monitor', label: 'Monitors' },
  { slug: 'peripherals', label: 'Keyboard & Mouse' },
  { slug: 'cabinet', label: 'Cabinets' },
];

/** @type {Product[]} */
const PRODUCTS = [
  // ---------------------------------------------------------------- CPU
  { id: 'cpu-1', category: 'Processor (CPU)', categorySlug: 'cpu', name: 'Intel Core i3-12100F', spec: '4 Cores / 8 Threads · 4.3GHz Boost', price: 8999, oldPrice: null, image: 'images/products/cpu-1.jpg', inStock: true },
  { id: 'cpu-2', category: 'Processor (CPU)', categorySlug: 'cpu', name: 'AMD Ryzen 5 5600', spec: '6 Cores / 12 Threads · 4.4GHz Boost', price: 11499, oldPrice: 12999, image: 'images/products/cpu-2.jpg', inStock: true },
  { id: 'cpu-3', category: 'Processor (CPU)', categorySlug: 'cpu', name: 'Intel Core i5-12400F', spec: '6 Cores / 12 Threads · 4.4GHz Boost', price: 15000, oldPrice: null, image: 'images/products/cpu-3.jpg', inStock: true },
  { id: 'cpu-4', category: 'Processor (CPU)', categorySlug: 'cpu', name: 'AMD Ryzen 7 7700X', spec: '8 Cores / 16 Threads · 5.4GHz Boost', price: 28999, oldPrice: 31999, image: 'images/products/cpu-4.jpg', inStock: true },
  { id: 'cpu-5', category: 'Processor (CPU)', categorySlug: 'cpu', name: 'Intel Core i9-14900K', spec: '24 Cores / 32 Threads · 6.0GHz Boost', price: 52999, oldPrice: null, image: 'images/products/cpu-5.jpg', inStock: true },

  // ---------------------------------------------------------------- GPU
  { id: 'gpu-1', category: 'Graphics Card (GPU)', categorySlug: 'gpu', name: 'NVIDIA RTX 4060', spec: '8GB GDDR6 · 1080p/1440p Gaming', price: 28999, oldPrice: null, image: 'images/products/gpu-1.jpg', inStock: true },
  { id: 'gpu-2', category: 'Graphics Card (GPU)', categorySlug: 'gpu', name: 'AMD Radeon RX 7600', spec: '8GB GDDR6 · 1080p/1440p Gaming', price: 26499, oldPrice: 29999, image: 'images/products/gpu-2.jpg', inStock: true },
  { id: 'gpu-3', category: 'Graphics Card (GPU)', categorySlug: 'gpu', name: 'NVIDIA RTX 4070 Super', spec: '12GB GDDR6X · 1440p/4K Gaming', price: 54999, oldPrice: null, image: 'images/products/gpu-3.jpg', inStock: true },
  { id: 'gpu-4', category: 'Graphics Card (GPU)', categorySlug: 'gpu', name: 'NVIDIA RTX 5070 Ti', spec: '16GB GDDR7 · 4K High Refresh Gaming', price: 135000, oldPrice: null, image: 'images/products/gpu-4.jpg', inStock: true },
  { id: 'gpu-5', category: 'Graphics Card (GPU)', categorySlug: 'gpu', name: 'NVIDIA RTX 4090', spec: '24GB GDDR6X · Flagship 4K/Creator', price: 189999, oldPrice: null, image: 'images/products/gpu-5.jpg', inStock: false },

  // ---------------------------------------------------------------- RAM
  { id: 'ram-1', category: 'Memory (RAM)', categorySlug: 'ram', name: '16GB (2x8GB) DDR4 3200MHz', spec: 'Dual Channel Kit · CL16', price: 3499, oldPrice: null, image: 'images/products/ram-1.jpg', inStock: true },
  { id: 'ram-2', category: 'Memory (RAM)', categorySlug: 'ram', name: '32GB (2x16GB) DDR4 3600MHz', spec: 'Dual Channel Kit · CL18', price: 6999, oldPrice: 7999, image: 'images/products/ram-2.jpg', inStock: true },
  { id: 'ram-3', category: 'Memory (RAM)', categorySlug: 'ram', name: '32GB (2x16GB) DDR5 6000MHz', spec: 'Dual Channel Kit · CL30', price: 9999, oldPrice: null, image: 'images/products/ram-3.jpg', inStock: true },
  { id: 'ram-4', category: 'Memory (RAM)', categorySlug: 'ram', name: '32GB (2x16GB) DDR5 RGB 6400MHz', spec: 'Dual Channel Kit · CL32 · ARGB', price: 12499, oldPrice: null, image: 'images/products/ram-4.jpg', inStock: true },
  { id: 'ram-5', category: 'Memory (RAM)', categorySlug: 'ram', name: '64GB (2x32GB) DDR5 6000MHz', spec: 'Dual Channel Kit · CL30', price: 22999, oldPrice: 24999, image: 'images/products/ram-5.jpg', inStock: true },

  // ---------------------------------------------------------------- SSD
  { id: 'ssd-1', category: 'Storage (SSD)', categorySlug: 'ssd', name: '500GB NVMe Gen3 SSD', spec: 'Up to 3500 MB/s Read', price: 3299, oldPrice: null, image: 'images/products/ssd-1.jpg', inStock: true },
  { id: 'ssd-2', category: 'Storage (SSD)', categorySlug: 'ssd', name: '1TB NVMe Gen4 SSD', spec: 'Up to 5000 MB/s Read', price: 6499, oldPrice: null, image: 'images/products/ssd-2.jpg', inStock: true },
  { id: 'ssd-3', category: 'Storage (SSD)', categorySlug: 'ssd', name: '2TB NVMe Gen4 SSD', spec: 'Up to 7000 MB/s Read', price: 11999, oldPrice: 13499, image: 'images/products/ssd-3.jpg', inStock: true },
  { id: 'ssd-4', category: 'Storage (SSD)', categorySlug: 'ssd', name: '2TB NVMe Gen5 SSD', spec: 'Up to 12000 MB/s Read', price: 20000, oldPrice: null, image: 'images/products/ssd-4.jpg', inStock: true },
  { id: 'ssd-5', category: 'Storage (SSD)', categorySlug: 'ssd', name: '4TB NVMe Gen4 SSD', spec: 'Up to 7000 MB/s Read', price: 27999, oldPrice: null, image: 'images/products/ssd-5.jpg', inStock: true },

  // ------------------------------------------------------------- COOLER
  { id: 'cooler-1', category: 'Cooling', categorySlug: 'cooler', name: '120mm Air Cooler', spec: 'Single Tower · 4 Heatpipes', price: 1499, oldPrice: null, image: 'images/products/cooler-1.jpg', inStock: true },
  { id: 'cooler-2', category: 'Cooling', categorySlug: 'cooler', name: 'Dual-Tower Air Cooler', spec: 'Twin Fan · 6 Heatpipes', price: 3299, oldPrice: null, image: 'images/products/cooler-2.jpg', inStock: true },
  { id: 'cooler-3', category: 'Cooling', categorySlug: 'cooler', name: '240mm AIO Liquid Cooler', spec: 'Dual Fan Radiator · ARGB Pump', price: 7999, oldPrice: null, image: 'images/products/cooler-3.jpg', inStock: true },
  { id: 'cooler-4', category: 'Cooling', categorySlug: 'cooler', name: '320mm AIO Liquid Cooler', spec: 'Triple Fan Radiator · ARGB Pump', price: 15000, oldPrice: null, image: 'images/products/cooler-4.jpg', inStock: true },
  { id: 'cooler-5', category: 'Cooling', categorySlug: 'cooler', name: '360mm ARGB AIO Liquid Cooler', spec: 'Triple Fan Radiator · LCD Pump Display', price: 17499, oldPrice: 18999, image: 'images/products/cooler-5.jpg', inStock: true },

  // ------------------------------------------------------------ MONITOR
  { id: 'monitor-1', category: 'Monitor', categorySlug: 'monitor', name: '24" FHD 165Hz IPS Monitor', spec: '1920x1080 · 1ms · IPS', price: 10999, oldPrice: null, image: 'images/products/monitor-1.jpg', inStock: true },
  { id: 'monitor-2', category: 'Monitor', categorySlug: 'monitor', name: '27" QHD 144Hz IPS Monitor', spec: '2560x1440 · 1ms · IPS', price: 18999, oldPrice: null, image: 'images/products/monitor-2.jpg', inStock: true },
  { id: 'monitor-3', category: 'Monitor', categorySlug: 'monitor', name: '27" QHD 165Hz Gaming Monitor', spec: '2560x1440 · 0.5ms · Fast IPS', price: 22999, oldPrice: 24999, image: 'images/products/monitor-3.jpg', inStock: true },
  { id: 'monitor-4', category: 'Monitor', categorySlug: 'monitor', name: '32" 4K 120Hz IPS Monitor', spec: '3840x2160 · 1ms · HDR400', price: 34999, oldPrice: null, image: 'images/products/monitor-4.jpg', inStock: true },
  { id: 'monitor-5', category: 'Monitor', categorySlug: 'monitor', name: '34" Ultrawide QHD 165Hz Monitor', spec: '3440x1440 · Curved · 1ms', price: 42999, oldPrice: null, image: 'images/products/monitor-5.jpg', inStock: true },

  // -------------------------------------------------------- PERIPHERALS
  { id: 'peripherals-1', category: 'Keyboard & Mouse', categorySlug: 'peripherals', name: 'Wired Membrane Combo', spec: 'Keyboard + Mouse · Plug & Play', price: 899, oldPrice: null, image: 'images/products/peripherals-1.jpg', inStock: true },
  { id: 'peripherals-2', category: 'Keyboard & Mouse', categorySlug: 'peripherals', name: 'Wireless Keyboard & Mouse Combo', spec: '2.4GHz Wireless · Long Battery Life', price: 1499, oldPrice: null, image: 'images/products/peripherals-2.jpg', inStock: true },
  { id: 'peripherals-3', category: 'Keyboard & Mouse', categorySlug: 'peripherals', name: 'RGB Mechanical Combo', spec: 'Blue Switches + 6400 DPI Mouse', price: 3000, oldPrice: null, image: 'images/products/peripherals-3.jpg', inStock: true },
  { id: 'peripherals-4', category: 'Keyboard & Mouse', categorySlug: 'peripherals', name: 'Hot-Swappable Mechanical Combo', spec: 'Hot-Swap Switches + Wireless Mouse', price: 5999, oldPrice: 6799, image: 'images/products/peripherals-4.jpg', inStock: true },
  { id: 'peripherals-5', category: 'Keyboard & Mouse', categorySlug: 'peripherals', name: 'Premium Wireless Mechanical Combo', spec: 'Low-Latency Wireless · Ultralight Mouse', price: 8499, oldPrice: null, image: 'images/products/peripherals-5.jpg', inStock: true },

  // ----------------------------------------------------------- CABINET
  { id: 'cabinet-1', category: 'Cabinet', categorySlug: 'cabinet', name: 'Compact Micro-ATX Cabinet', spec: 'Micro-ATX · Mesh Front Panel', price: 2499, oldPrice: null, image: 'images/products/cabinet-1.jpg', inStock: true },
  { id: 'cabinet-2', category: 'Cabinet', categorySlug: 'cabinet', name: 'Mid-Tower ATX Cabinet', spec: 'ATX · Tempered Glass Side Panel', price: 5000, oldPrice: null, image: 'images/products/cabinet-2.jpg', inStock: true },
  { id: 'cabinet-3', category: 'Cabinet', categorySlug: 'cabinet', name: 'Mid-Tower ARGB Mesh Cabinet', spec: 'ATX · 4 ARGB Fans Included', price: 6999, oldPrice: 7999, image: 'images/products/cabinet-3.jpg', inStock: true },
  { id: 'cabinet-4', category: 'Cabinet', categorySlug: 'cabinet', name: 'Full-Tower Dual-Chamber Cabinet', spec: 'E-ATX · Dual Chamber · High Airflow', price: 11999, oldPrice: null, image: 'images/products/cabinet-4.jpg', inStock: true },
  { id: 'cabinet-5', category: 'Cabinet', categorySlug: 'cabinet', name: 'Premium Tempered Glass Full-Tower', spec: 'E-ATX · 360mm Radiator Support', price: 15999, oldPrice: null, image: 'images/products/cabinet-5.jpg', inStock: true },
];

/**
 * Look up a single product by id. Returns undefined if not found.
 * @param {string} id
 * @returns {Product|undefined}
 */
function getProductById(id) {
  return PRODUCTS.find((product) => product.id === id);
}

/**
 * Format a number as Indian Rupees, e.g. 135000 -> "₹1,35,000"
 * @param {number} amount
 * @returns {string}
 */
function formatINR(amount) {
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}
