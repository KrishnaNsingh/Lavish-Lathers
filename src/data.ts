import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: "lavender-shea-butter",
    name: "Lavender & Shea Butter Serenity Soap",
    type: "skincare",
    category: "Herbal Soaps",
    price: 18,
    rating: 4.9,
    reviewsCount: 148,
    description: "An ultra-moisturizing, hand-poured artisan botanical soap infused with calming lavender essential oils, nourishing organic shea butter, and crushed lavender buds for a gentle, skin-polishing lather.",
    details: "Hand-blended in small batches using our traditional cold-process method. This soap cures for six full weeks to guarantee a dense, creamy lather that locks in natural glycerin to protect your skin barrier.",
    ingredients: ["Organic French Lavender Oil", "Raw African Shea Butter", "Extra Virgin Olive Oil", "Cold-pressed Coconut Oil", "Sweet Almond Oil", "Crushed Lavender Florets", "Botanical Glycerin"],
    benefits: ["Soothes nervous tension and promotes deeper nightly sleep", "Deeply hydrates dry, flaking, or sensitive skin types", "Restores essential fatty acids to combat texture irregularities", "Gentle, non-stripping formula suited for hands, face, and body"],
    images: [
      "https://images.unsplash.com/photo-1607006342411-92447c05b579?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1546554137-f86b9593a222?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 24,
    isBestSeller: true
  },
  {
    id: "saffron-sandalwood-glow",
    name: "Sacred Saffron & Mysore Sandalwood Cleanser",
    type: "skincare",
    category: "Herbal Soaps",
    price: 24,
    rating: 5.0,
    reviewsCount: 94,
    description: "A decadent skincare bar blending pure red saffron threads and ethically sourced Mysore sandalwood powder. This luxury bar gently purifies while evening out skin tone and bringing forth a soft, natural inner radiance.",
    details: "Traditionally known as 'Ubtan in a bar', this classic Ayurvedic ritual bar utilizes genuine botanical wood pulps and rare pistils to gently clarify skin, fade dark spots, and envelop you in a rich, warm woody fragrance.",
    ingredients: ["Pure Kashmiri Saffron Threads", "Grade-A Sandalwood Extract", "Organic Jojoba Oil", "Kokum Seed Butter", "Saponified Avocado Oil", "Sandalwood Hydrosol", "Turmeric Root extract"],
    benefits: ["Brightens dark spots and unifies skin tone for golden radiance", "Calms red, reactive skin with active cooling anti-inflammatory properties", "Sandalwood essence relieves stress and centers the mind", "Exfoliates microscopically without microscopic tearing"],
    images: [
      "https://images.unsplash.com/photo-1605264964521-300ed3f3149b?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 18,
    isBestSeller: true
  },
  {
    id: "rosehip-jasmine-radiance",
    name: "Jasmine & Rosehip Botanical Radiance Elixir",
    type: "skincare",
    category: "Essential Oils",
    price: 48,
    rating: 4.8,
    reviewsCount: 112,
    description: "A lightweight, rapid-absorption face oil combining premium cold-pressed wild rosehip seed oil and precious night-blooming jasmine wax, yielding a natural skin glow.",
    details: "Designed for a sensorial skincare experience. Applied before bed, the intoxicating aroma of pure absolute jasmine oil calms active cortisol while active retinoic acid from rosehip oil works to deeply rejuvenate cellular structures.",
    ingredients: ["Organic Cold-pressed Rosehip Seed Oil", "Night-blooming Jasmine Absolute Oil", "Moroccan Neroli Extract", "Tocopherol (Pure Vitamin E)", "Squalane (derived from olives)", "Prunus Apricot Kernel Oil"],
    benefits: ["Boosts cellular turn-over and cellular collagen density naturally", "Locks in fine hydration layers without blocking pores or causing breakouts", "Induces beautiful aromatherapeutic calmness before bedtime", "Smooths fine lines and plumps cheek contours"],
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 15,
    isBestSeller: true
  },
  {
    id: "royal-botanical-chest",
    name: "The Royal Botanical Indulgence Gifting Chest",
    type: "giftbox",
    category: "Gift Boxes",
    price: 110,
    rating: 4.9,
    reviewsCount: 76,
    description: "Our signature luxury souvenir chest crafted from sustainable pinewood, bound in beautiful silk ribbons and containing our finest curation of botanical self-care soaps and elixirs.",
    details: "Inside you will find: 1x Lavender & Shea Butter Soap, 1x Sacred Saffron Bar, 1x Jasmine & Rosehip Elixir, and an premium hand-woven sandalwood and linen bath cloth. A fully-customizable wax-sealed scroll containing your recipient's gift note is tied to the outer ribbon.",
    ingredients: ["Artisan sustainable Pine Chest Box", "Premium Silk Ribbon Wrap", "Wax-sealed Cotton Scroll Gifting Note", "Organic Botanical collection contents"],
    benefits: ["The ultimate prestigious bridal, anniversary, or corporate souvenir", "Indulgently pre-packaged and curated by skilled master soap artisans", "Eco-friendly recyclable wood chest designed for vanity reuse"],
    images: [
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 12,
    isBestSeller: true
  },
  {
    id: "handcarved-heart-lace",
    name: "Hand-Carved Lace Heart Soap & Ribbon Souvenir",
    type: "souvenir",
    category: "Souvenirs",
    price: 35,
    rating: 5.0,
    reviewsCount: 215,
    description: "An emotionally captivating, highly detailed heart-shaped soap hand-carved with delicate lace flower filigrees. Decorated with an ivory silk ribbon, making it a spectacular wedding, anniversary, or baby-shower keepsake.",
    details: "Scented with sweet heirloom Damascus rose and white jasmine petals, this collectible piece can be rested in powder rooms as a premium room-freshener, or loured directly in soft water for a luxurious aromatic bath experience.",
    ingredients: ["Triple-milled Coconut Soap Base", "Damascus Rose Hydrosol", "White Jasmine Essential Oil", "Natural French Pink Clay", "Silk Embroidered Vanity Ribbon", "Crushed Pearl dust"],
    benefits: ["An exquisite, collectible wedding favors and high-class souvenir", "Infuses entire master bathrooms with notes of soft rose and pearly sugar", "Arrives cradled inside an elegant soft pink linen slide box bound in ivory silk"],
    images: [
      "https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 35,
    isCollectible: true
  },
  {
    id: "goldleaf-amber-blossom",
    name: "Gold Leaf Amber Blossom Soap Curio",
    type: "souvenir",
    category: "Souvenirs",
    price: 42,
    rating: 4.9,
    reviewsCount: 88,
    description: "An exceptional, semi-translucent Amber Soap Curio featuring hand-embedded 24-karat gold leaf flakes and a preserved miniature baby's breath blossom inside. A luxurious sculpture for the modern home.",
    details: "This soap curio represents the pinnacle of luxury soap craft. Formulated using double-distilled vegetable glycerin and active amber essence, it captures and refracts warm glow lighting beautifully on the vanity shelf.",
    ingredients: ["24K Edible Gold Leaf Flakes", "Natural Amber Resin Extract", "Triple-distilled Organic Vegetable Glycerin", "Preserved Gypsophila Blossom", "Sweet Vanilla Pod Extract"],
    benefits: ["A rare, striking artistic souvenir that sparks heartfelt conversation", "Naturally glowing visual properties create a warm, sunset mood in water", "Gentle, intensely humectant formula locks moisture flat to active skin"],
    images: [
      "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 10,
    isCollectible: true
  },
  {
    id: "peppermint-wild-eucalyptus",
    name: "Peppermint & Wild Eucalyptus Detox Soap",
    type: "skincare",
    category: "Herbal Soaps",
    price: 16,
    rating: 4.7,
    reviewsCount: 63,
    description: "A restorative, highly refreshing herbal soap bar formulated with clarifying Australian mint oils, organic wild eucalyptus paste, and deep-pore cleansing white clay.",
    details: "Best loved for post-exercise or early morning showers, this formula creates a tingling, deeply refreshing sensation that opens up congested airways and washes away impurities and fatigue.",
    ingredients: ["Australian Peppermint Essential Oil", "Wild Eucalyptus Globulus Oil", "French White Kaolin Clay", "Organic Hempseed Oil", "Spirulina Botanical Extract", "Menthol Crystals"],
    benefits: ["Energizes the body and stimulates active dermal microcirculation", "Kaolin clay absorbs oil congestion without dehydrating surface layers", "Eucalyptus steam clears sinuses during warm morning baths"],
    images: [
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1626880842125-8f0f15e518d9?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 40,
    isBestSeller: false
  },
  {
    id: "vetiver-cedarwood-elixir",
    name: "Sacred Vetiver & Cedarwood Grounding Elixir",
    type: "skincare",
    category: "Essential Oils",
    price: 52,
    rating: 4.9,
    reviewsCount: 45,
    description: "A deeply complex, grounding hair and body treatment oil centered around woodsy smoky Vetiver and pure cedarwood rind extracts, layered on base oils of Argan and Jojoba.",
    details: "Rich in antioxidants, this heavy botanical hair/body companion conditions coarse beards, seals locks of split-ends, or can be poured into hot dynamic baths for a meditative, forest-like aromatherapy transition.",
    ingredients: ["Pure Vetiver Root Extract", "Himalayan Cedarwood Essential Oil", "Organic Cold-pressed Argan Oil", "Safflower Oleosomes", "Golden Jojoba Oil", "Clary Sage Herb extract"],
    benefits: ["Densely deeply tames unruly hair textures and controls persistent flyaways", "Creates a grounding, therapeutic barrier against oxidative damage", "Moisturizes dry cuticles, elbows, and knees with long-wear sheen"],
    images: [
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 12,
    isBestSeller: false
  },
  {
    id: "lavender-gifting-trove",
    name: "Lavish Lavender & Oats Gifting Trove",
    type: "giftbox",
    category: "Gift Boxes",
    price: 78,
    rating: 4.8,
    reviewsCount: 52,
    description: "An elegant nudi-beige paper slide collection honoring natural relaxation. Includes our lavender soaps, a jar of wild lavender chamomile tea, and an exfoliating ramie bag.",
    details: "Expertly presented with dry wheat stalks and botanical lavender inserts, this box delivers an unmatched unboxing sensation. Perfect as a boutique birthday or thank-you token.",
    ingredients: ["Handmade Recycled Beige Paper Box", "Natural Chamomile Tea canister", "Lavender & Shea Butter Bar", "Natural Ramie Fiber Scrub Bag"],
    benefits: ["Soothing floral and oatmeal fragrance creates immediate relaxation", "Curated selection is extremely skin-safe and allergy friendly", "Stunning handmade packaging needs no wrapping paper"],
    images: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800"
    ],
    stock: 16,
    isBestSeller: false
  }
];

export const INSTAGRAM_POSTS = [
  {
    id: "ig-1",
    image: "https://images.unsplash.com/photo-1607006342411-92447c05b579?auto=format&fit=crop&q=80&w=500",
    likes: 312,
    comments: 24,
    caption: "Pouring serenity. Our signature French mountain lavender curls directly into cold-process molds. Craft takes patience, and luxury takes time. 💜 #LavishLathers"
  },
  {
    id: "ig-2",
    image: "https://images.unsplash.com/photo-1515688594390-b649af70d282?auto=format&fit=crop&q=80&w=500",
    likes: 582,
    comments: 48,
    caption: "Keepsakes of pure elegance. Our Hand-Carved Lace Hearts bound inside silk ribbons are waiting to elevate your special anniversary gift. 🌹 #ArtisanSouvenirs"
  },
  {
    id: "ig-3",
    image: "https://images.unsplash.com/photo-1605264964521-300ed3f3149b?auto=format&fit=crop&q=80&w=500",
    likes: 412,
    comments: 19,
    caption: "Golden hours. Kashmiri saffron threads and red clay curing peacefully on clean pine lattices. Organic skincare, handcrafted with profound devotion. ✨ #OrganicGlow"
  },
  {
    id: "ig-4",
    image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=500",
    likes: 389,
    comments: 11,
    caption: "Aromatherapy rituals. Drip, release, and ground with woodsy Himalayan Cedarwood extracts. Create your temple at home tonight. 🌿 #BotanicalElixir"
  },
  {
    id: "ig-5",
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&q=80&w=500",
    likes: 641,
    comments: 52,
    caption: "Sunlight dancing off 24K gold leaf flakes suspended in dense amber resin. Perfect decorative detail for your sanctuary room. ☀️ #LuxurySoapArt"
  },
  {
    id: "ig-6",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=500",
    likes: 476,
    comments: 31,
    caption: "Gift with emotional depth. Our wax-sealed Pine chests carry individual handwritten messages, because luxury stems from personalized connection. 🌾 #BoutiqueGifting"
  }
];

export const TESTIMONIALS = [
  {
    id: "test-1",
    name: "Clarissa de Medici",
    rating: 5,
    text: "The Lavender & Shea Butter soap is heaven in a bar. My dry skin has never felt this plump and glowing. The scent lingers like a high-end French perfume. It is standard routine for my evening baths.",
    role: "Verified Patron",
    location: "Sienna, Italy"
  },
  {
    id: "test-2",
    name: "Adrienne Vance",
    rating: 5,
    text: "We ordered 80 Hand-Carved Lace Hearts as souvenir favors for our 10-year anniversary celebration. Our clients were emotional over the exquisite detailing and the beautiful ribbon bows. Lavish Lathers is an absolute treasure!",
    role: "Keepsake Collaborator",
    location: "Beverly Hills, CA"
  },
  {
    id: "test-3",
    name: "Sienna Westbrook",
    rating: 5,
    text: "The Saffron Cleanser is unparalleled. It brought back a natural translucent glow to my skin that no designer serum could provide. Also, the wooden scroll gift note was printed with pure calligraphic elegance.",
    role: "Collector & Devotee",
    location: "London, UK"
  }
];
