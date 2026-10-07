/* ============================================================
   DMart Latur — Demo Store Data
   Static data used across the website (no backend required).
   ============================================================ */

/* Build a responsive Unsplash image URL from a photo id */
const DM_IMG = (id, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

/* Verified photo ids */
const PH = {
  aisle: '1578916171728-46686eac8d58',        // bright supermarket aisle
  fruitShelf: '1583258292688-d0213dc5a3a8',   // fruit shelves in store
  aisleShelves: '1534723452862-4c874018d66d', // stocked aisle
  aisleDark: '1604719312566-8912e9227c6a',    // supermarket aisle (dark top)
  market: '1550989460-0adf9ea622e2',          // colourful fruit market
  produce: '1542838132-92c53300491e',         // fresh produce shelves
  bags: '1608686207856-001b95cf60ca',         // grocery bags
  vegBoard: '1610348725531-843dff563e2c',     // vegetables on board
  salads: '1540420773420-3366772f4999',       // healthy bowls
  fruitBasket: '1619566636858-adf3ef46400b',  // mixed fruit basket
  vegDark: '1518843875459-f738682238a6',      // vegetables on dark
  apples: '1567306226416-28f0efdc88ce',       // red apples
  rice: '1586201375761-83865001e31c',         // basmati rice grains
  oil: '1474979266404-7eaacbcd87c5',          // cooking oil bottle
  cookies: '1558961363-fa8fdf82db35',         // choco chip cookies
  chocolates: '1621939514649-280e2ee25f60',   // chocolate bars
  cola: '1622483767028-3f66f32aef97',         // chilled cola cans
  faceCare: '1556228578-8c89e6adf883',        // skincare tube
  milk: '1550583724-b2692b85b150',            // milk being poured
  bread: '1509440159596-0249088772ff',        // bakery bread
  gadgets: '1468495244123-6c6c332eeece',      // electronics desk
  stationery: '1455390582262-044cdead277a',   // pen & notebook
  baby: '1515488042361-ee00e0ddd4e4',         // baby & toys
  clothing: '1489987707025-afc232f7ea0f',     // clothing rack
  makeup: '1596462502278-27bfdc403348',       // makeup essentials
  kitchen: '1556911220-bff31c812dba',         // modern kitchen
  toothbrush: '1607613009820-a29f7bb81c04',   // oral care
  chips: '1566478989037-eec170784d0b',        // chips packets
  juice: '1600271886742-f049cd451bba',        // orange juice
  skincareSet: '1571781926291-c477ebfd024b',  // skincare combo
  sale: '1607083206869-4c7672e72a8a',         // SALE tags
  shelf: '1584680226833-0d680d0a0794',        // grocery shelf close-up
  lotion: '1620916566398-39f1143ab7be',       // body lotion
  storage: '1498837167922-ddd27525d352',      // storage / meal prep
  dishes: '1504674900247-0877df9cc836',       // plated dishes
  breakfast: '1567620905732-2d1ec7ab7445'     // pancakes / breakfast
};

/* ------------------------------------------------------------
   Categories
   ------------------------------------------------------------ */
const CATEGORIES = [
  { slug: 'groceries', name: 'Groceries', desc: 'Rice, atta, pulses, oils and daily kitchen staples.', img: PH.aisleShelves },
  { slug: 'fruits-vegetables', name: 'Fruits & Vegetables', desc: 'Fresh produce picked for everyday family meals.', img: PH.fruitBasket },
  { slug: 'beverages', name: 'Beverages', desc: 'Juices, soft drinks, tea, coffee and packaged water.', img: PH.cola },
  { slug: 'personal-care', name: 'Personal Care', desc: 'Skin, hair and oral care for every family member.', img: PH.makeup },
  { slug: 'home-kitchen', name: 'Home & Kitchen', desc: 'Cookware, storage and smart kitchen essentials.', img: PH.kitchen },
  { slug: 'clothing', name: 'Clothing', desc: 'Comfortable everyday wear for all age groups.', img: PH.clothing },
  { slug: 'baby-care', name: 'Baby Care', desc: 'Gentle and trusted products for your little ones.', img: PH.baby },
  { slug: 'stationery', name: 'Stationery', desc: 'School, office and creative stationery supplies.', img: PH.stationery },
  { slug: 'electronics', name: 'Electronics', desc: 'Useful gadgets and accessories for modern homes.', img: PH.gadgets },
  { slug: 'household', name: 'Household Essentials', desc: 'Cleaning, laundry and home maintenance products.', img: PH.storage }
];

/* ------------------------------------------------------------
   Products
   ------------------------------------------------------------ */
const PRODUCTS = [
  { id: 'p1', name: 'Premium Basmati Rice 5 kg', cat: 'groceries', price: 649, mrp: 799, rating: 4.6, img: PH.rice, tag: 'Bestseller' },
  { id: 'p2', name: 'Sunflower Cooking Oil 1 L', cat: 'groceries', price: 149, mrp: 175, rating: 4.4, img: PH.oil },
  { id: 'p3', name: 'Chocolate Chip Cookies', cat: 'groceries', price: 99, mrp: 120, rating: 4.5, img: PH.cookies },
  { id: 'p4', name: 'Family Potato Chips Combo', cat: 'groceries', price: 40, mrp: 50, rating: 4.3, img: PH.chips },
  { id: 'p5', name: 'Cola Soft Drink (Pack of 6)', cat: 'beverages', price: 180, mrp: 210, rating: 4.7, img: PH.cola, tag: 'Popular' },
  { id: 'p6', name: 'Fresh Orange Juice 1 L', cat: 'beverages', price: 110, mrp: 130, rating: 4.2, img: PH.juice },
  { id: 'p7', name: 'Toned Milk 1 L', cat: 'groceries', price: 68, mrp: 72, rating: 4.5, img: PH.milk },
  { id: 'p8', name: 'Whole Wheat Bread', cat: 'groceries', price: 45, mrp: 55, rating: 4.4, img: PH.bread },
  { id: 'p9', name: 'Assorted Chocolates Pack', cat: 'groceries', price: 250, mrp: 300, rating: 4.6, img: PH.chocolates, tag: 'New' },
  { id: 'p10', name: 'Daily Face & Body Cleanser', cat: 'personal-care', price: 249, mrp: 315, rating: 4.4, img: PH.faceCare },
  { id: 'p11', name: 'Skincare Combo Kit', cat: 'personal-care', price: 549, mrp: 699, rating: 4.3, img: PH.skincareSet },
  { id: 'p12', name: 'Soft Bristle Toothbrush (Pack of 3)', cat: 'personal-care', price: 99, mrp: 120, rating: 4.2, img: PH.toothbrush },
  { id: 'p13', name: 'Everyday Makeup Essentials', cat: 'personal-care', price: 449, mrp: 599, rating: 4.4, img: PH.makeup },
  { id: 'p14', name: 'Fresh Apples 1 kg', cat: 'fruits-vegetables', price: 129, mrp: 160, rating: 4.6, img: PH.apples },
  { id: 'p15', name: 'Seasonal Vegetables Bundle', cat: 'fruits-vegetables', price: 199, mrp: 260, rating: 4.5, img: PH.vegDark },
  { id: 'p16', name: 'Kitchen Storage Container Set', cat: 'home-kitchen', price: 799, mrp: 999, rating: 4.4, img: PH.storage },
  { id: 'p17', name: 'Kids Learning Toy Set', cat: 'baby-care', price: 399, mrp: 499, rating: 4.5, img: PH.baby },
  { id: 'p18', name: 'Classic Cotton T-Shirt', cat: 'clothing', price: 299, mrp: 399, rating: 4.3, img: PH.clothing },
  { id: 'p19', name: 'Everyday Stationery Set', cat: 'stationery', price: 149, mrp: 199, rating: 4.4, img: PH.stationery },
  { id: 'p20', name: 'Wireless Gadget Essentials', cat: 'electronics', price: 1299, mrp: 1599, rating: 4.6, img: PH.gadgets, tag: 'New' },
  { id: 'p21', name: 'Monthly Household Stock-up Combo', cat: 'household', price: 999, mrp: 1249, rating: 4.5, img: PH.bags, tag: 'Great Value' }
];

/* ------------------------------------------------------------
   Today's offers
   ------------------------------------------------------------ */
const OFFERS = [
  { id: 'o1', name: 'Fresh Everyday Essentials', note: 'Fruits, vegetables and staples', off: 30, price: 839, mrp: 1199, img: PH.fruitBasket, tag: 'Up to 30% OFF' },
  { id: 'o2', name: 'Cooking Oil Combo Deal', note: 'Value pack of 2 litres', off: 20, price: 359, mrp: 449, img: PH.oil },
  { id: 'o3', name: 'Snack Attack Hour', note: 'Chips and namkeen combo', off: 25, price: 225, mrp: 300, img: PH.chips, tag: 'Today Only' },
  { id: 'o4', name: 'Chilled Drinks Pack', note: 'Soft drinks, pack of six', off: 15, price: 179, mrp: 210, img: PH.cola },
  { id: 'o5', name: 'Breakfast Combo', note: 'Bread, milk and cookies', off: 22, price: 140, mrp: 180, img: PH.breakfast },
  { id: 'o6', name: 'Personal Care Savings', note: 'Skin and hair care range', off: 25, price: 465, mrp: 620, img: PH.lotion },
  { id: 'o7', name: 'Chocolates & Bars Bundle', note: 'Assorted family pack', off: 20, price: 400, mrp: 500, img: PH.chocolates },
  { id: 'o8', name: 'Fruit Freshness Deal', note: 'Seasonal fruit selection', off: 30, price: 238, mrp: 340, img: PH.apples, tag: 'Fresh' },
  { id: 'o9', name: 'Home & Kitchen Offer', note: 'Cookware and storage picks', off: 18, price: 2049, mrp: 2499, img: PH.kitchen },
  { id: 'o10', name: 'Summer Beverages Sale', note: 'Juices and cool drinks', off: 18, price: 189, mrp: 230, img: PH.juice }
];

/* ------------------------------------------------------------
   Why shop with us
   ------------------------------------------------------------ */
const WHY = [
  { title: 'Great Value', text: 'Everyday products at competitive, value-focused prices.', icon: 'tag' },
  { title: 'Wide Selection', text: 'Everything you need for your home and family in one place.', icon: 'grid' },
  { title: 'Quality Products', text: 'Products selected carefully for everyday household needs.', icon: 'badge' },
  { title: 'Convenient Shopping', text: 'Easy navigation, clear aisles and a relaxed shopping experience.', icon: 'clock' },
  { title: 'Trusted Retail', text: 'A familiar retail destination for everyday essentials.', icon: 'shield' }
];

/* Expose to the page scripts */
window.DMART = { DM_IMG, PH, CATEGORIES, PRODUCTS, OFFERS, WHY };
