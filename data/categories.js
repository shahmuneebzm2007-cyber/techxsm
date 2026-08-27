// To add a new category, simply append an object to this array.
// name: Display name of the category
// slug: URL-friendly version of the name (used in product references)
// icon: Emoji icon for the category
// description: Short description
// subcategories: Array of strings representing subcategories

const categories = [
  {
    name: 'Audio',
    slug: 'audio',
    icon: '🎧',
    description: 'High quality audio equipment.',
    subcategories: ['Wireless Earbuds', 'Headphones', 'Speakers', 'Soundbars']
  },
  {
    name: 'Charging',
    slug: 'charging',
    icon: '⚡',
    description: 'Fast and reliable charging solutions.',
    subcategories: ['Wireless Chargers', 'Power Banks', 'Cables', 'Adapters']
  },
  {
    name: 'Wearables',
    slug: 'wearables',
    icon: '⌚',
    description: 'Smart tech you can wear.',
    subcategories: ['Smartwatches', 'Fitness Bands', 'Smart Glasses']
  },
  {
    name: 'Phone Accessories',
    slug: 'phone-accessories',
    icon: '📱',
    description: 'Enhance your smartphone experience.',
    subcategories: ['Cases', 'Screen Protectors', 'Holders', 'Grips']
  },
  {
    name: 'Computer Accessories',
    slug: 'computer-accessories',
    icon: '💻',
    description: 'Everything for your computing setup.',
    subcategories: ['USB Hubs', 'Keyboards', 'Mice', 'Webcams']
  },
  {
    name: 'Smart Home',
    slug: 'smart-home',
    icon: '🏠',
    description: 'Connected devices for a smarter home.',
    subcategories: ['Smart Plugs', 'Smart Lights', 'Smart Displays']
  }
];

module.exports = categories;
