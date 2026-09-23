// ============================================================
// SEED / DEMO DATA
// Everything here is deterministic so the app renders identical
// data on every load and works fully offline / in demo mode.
// ============================================================

export const uid = () => Math.random().toString(36).slice(2, 10)

export const IMG_SALON = [
  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1522336572468-97b06e8ef143?w=800&q=80&auto=format&fit=crop',
]

export const IMG_HAIR_MEN = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?w=800&q=80&auto=format&fit=crop',
]

export const IMG_HAIR_WOMEN = [
  'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=800&q=80&auto=format&fit=crop',
]

// ---------- HAIRSTYLES (20) ----------
export const hairstyles = [
  // MEN
  { id: 'low-fade', name: 'Low Fade', gender: 'men', price: 250, duration: 30, minutes: 30, popular: true, tags: ['clean', 'classic'], image: IMG_HAIR_MEN[0], description: 'A subtle fade that starts low around the ears, keeping most of the length on top. The safest and most versatile fade for any face shape.' },
  { id: 'mid-fade', name: 'Mid Fade', gender: 'men', price: 280, duration: 35, minutes: 35, popular: true, tags: ['trendy'], image: IMG_HAIR_MEN[1], description: 'Balances the low and high fade, starting at the middle of the temples. Crisp, clean and perfect for textured tops.' },
  { id: 'high-fade', name: 'High Fade', gender: 'men', price: 300, duration: 35, minutes: 35, popular: false, tags: ['edgy', 'military'], image: IMG_HAIR_MEN[2], description: 'Fades high up the sides for a bold, striking look. Great with pompadours, crops or a hard part.' },
  { id: 'crew-cut', name: 'Crew Cut', gender: 'men', price: 220, duration: 25, minutes: 25, popular: true, tags: ['military'], image: IMG_HAIR_MEN[3], description: 'Short back and sides, slightly longer on top, tapered into the crew. Low maintenance and always sharp.' },
  { id: 'buzz-cut', name: 'Buzz Cut', gender: 'men', price: 180, duration: 20, minutes: 20, popular: false, tags: ['military', 'low-maintenance'], image: IMG_HAIR_MEN[4], description: 'One length all over using a single guard. Minimal effort, maximum attitude.' },
  { id: 'pompadour', name: 'Pompadour', gender: 'men', price: 350, duration: 45, minutes: 45, popular: true, tags: ['classic', 'styled'], image: IMG_HAIR_MEN[1], description: 'Volume swept back from the forehead with faded sides. A statement of timeless class.' },
  { id: 'quiff', name: 'Quiff', gender: 'men', price: 320, duration: 40, minutes: 40, popular: true, tags: ['styled', 'trendy'], image: IMG_HAIR_MEN[2], description: 'The pompadour\'s modern cousin — textured height at the front with a clean fade. Effortlessly cool.' },
  { id: 'textured-crop', name: 'Textured Crop', gender: 'men', price: 290, duration: 35, minutes: 35, popular: true, tags: ['trendy'], image: IMG_HAIR_MEN[3], description: 'Short, messy and full of movement. The go-to style for a modern, effortless finish.' },
  { id: 'side-part', name: 'Side Part', gender: 'men', price: 310, duration: 40, minutes: 40, popular: false, tags: ['classic', 'formal'], image: IMG_HAIR_MEN[4], description: 'A sharp defined parting with clean sides. Smart, sophisticated and boardroom ready.' },
  { id: 'french-crop', name: 'French Crop', gender: 'men', price: 300, duration: 35, minutes: 35, popular: false, tags: ['edgy', 'classic'], image: IMG_HAIR_MEN[0], description: 'Faded sides with a short, blunt fringe on top. A Parisian classic with modern edges.' },

  // WOMEN
  { id: 'layer-cut', name: 'Layer Cut', gender: 'women', price: 700, duration: 60, minutes: 60, popular: true, tags: ['volume', 'classic'], image: IMG_HAIR_WOMEN[0], description: 'Frames the face with soft, graduated layers that add bounce, volume and movement.' },
  { id: 'bob-cut', name: 'Bob Cut', gender: 'women', price: 800, duration: 60, minutes: 60, popular: true, tags: ['classic'], image: IMG_HAIR_WOMEN[1], description: 'A chin-length bob that never goes out of style. Sharp, symmetrical and effortlessly chic.' },
  { id: 'butterfly-cut', name: 'Butterfly Cut', gender: 'women', price: 950, duration: 75, minutes: 75, popular: true, tags: ['trendy'], image: IMG_HAIR_WOMEN[2], description: 'Multi-layered wings that open like a butterfly — maximum volume with a soft, dreamy finish.' },
  { id: 'wolf-cut', name: 'Wolf Cut', gender: 'women', price: 900, duration: 70, minutes: 70, popular: true, tags: ['edgy', 'trendy'], image: IMG_HAIR_WOMEN[3], description: 'Shaggy, choppy and rebellious — the wolf cut blends 70s shag with modern layers.' },
  { id: 'pixie-cut', name: 'Pixie Cut', gender: 'women', price: 850, duration: 60, minutes: 60, popular: false, tags: ['bold'], image: IMG_HAIR_WOMEN[4], description: 'Ultra short and full of personality. A bold statement that frames the face beautifully.' },
  { id: 'step-cut', name: 'Step Cut', gender: 'women', price: 750, duration: 65, minutes: 65, popular: false, tags: ['volume'], image: IMG_HAIR_WOMEN[0], description: 'Stacked step layers that build thickness and volume toward the ends. Dramatic and pretty.' },
  { id: 'u-cut', name: 'U Cut', gender: 'women', price: 650, duration: 55, minutes: 55, popular: true, tags: ['sleek', 'classic'], image: IMG_HAIR_WOMEN[1], description: 'Long hair formed into a soft U shape. Keeps length while removing bulk and split ends.' },
  { id: 'feather-cut', name: 'Feather Cut', gender: 'women', price: 800, duration: 60, minutes: 60, popular: false, tags: ['soft'], image: IMG_HAIR_WOMEN[2], description: 'Light, feathery layers that taper out like a bird\'s wings. Delicate and full of movement.' },
  { id: 'hair-colour', name: 'Hair Colour', gender: 'women', price: 1500, duration: 120, minutes: 120, popular: true, tags: ['colour'], image: IMG_HAIR_WOMEN[3], description: 'Full head of premium hair colour in any shade you dream of. Glossy, dimensional colour.' },
  { id: 'keratin-style', name: 'Keratin Style', gender: 'women', price: 2500, duration: 150, minutes: 150, popular: false, tags: ['treatment'], image: IMG_HAIR_WOMEN[4], description: 'Smoothing keratin treatment for frizz-free, glass-straight hair that lasts for months.' },
]

// ---------- SALONS (10) ----------
const PRICING_INDEX = ['$', '$$', '$$$']

const salonSeeds = [
  { name: 'Modern Men\'s Salon', gender: 'men', rating: 4.6, area: 'Indiranagar', city: 'Bengaluru', desc: 'A premium men-only grooming studio that blends classic techniques with modern trends. Expect precision fades and a proper consultation before every cut.' },
  { name: 'Royal Gents Salon', gender: 'men', rating: 4.4, area: 'Koramangala', city: 'Bengaluru', desc: 'Regal interiors, relaxing service and barbers who take their craft seriously. A neighbourhood favourite for sharp fades and hot-towel shaves.' },
  { name: 'Urban Style Studio', gender: 'unisex', rating: 4.7, area: 'HSR Layout', city: 'Bengaluru', desc: 'A stylish urban studio for everyone. Trend-led stylists, premium products and great pricing make this the go-to spot in HSR.' },
  { name: 'Smart Cut Salon', gender: 'men', rating: 4.2, area: 'Whitefield', city: 'Bengaluru', desc: 'Quick, reliable and affordable. Walk in a mess, walk out sharp — the smart choice for the working man on a tight schedule.' },
  { name: 'Elite Hair Lounge', gender: 'unisex', rating: 4.8, area: 'Electronic City', city: 'Bengaluru', desc: 'An elite luxury lounge with experienced stylists, private cabins and a spa-like finish. Where regular grooming becomes an occasion.' },
  { name: 'Family Salon & Spa', gender: 'unisex', rating: 4.3, area: 'Jayanagar', city: 'Bengaluru', desc: 'One roof for the whole family — hair, spa and beauty services in a warm, friendly space with kids-friendly styling.' },
  { name: 'Style Hub Unisex Salon', gender: 'unisex', rating: 4.5, area: 'Marathahalli', city: 'Bengaluru', desc: 'Style Hub is where creativity meets craft. A buzzing unisex salon loved by students and young professionals.' },
  { name: 'Hair Craft Studio', gender: 'men', rating: 4.9, area: 'Malleshwaram', city: 'Bengaluru', desc: 'Known for the city\'s best fades, Hair Craft is run by award-winning barbers who obsess over the smallest details. Book early — slots vanish fast.' },
  { name: 'Trendz Salon', gender: 'unisex', rating: 4.1, area: 'BTM Layout', city: 'Bengaluru', desc: 'Fresh, experimental and affordable. Trendz stays ahead of every hair trend so you can try them all without burning a hole in your pocket.' },
  { name: 'Signature Salon', gender: 'women', rating: 4.8, area: 'Koramangala', city: 'Bengaluru', desc: 'A women-first luxury salon with master stylists, premium Keratin and colour specialists, and an indulgent experience from the moment you walk in.' },
]

function genServices(salon, index) {
  const s = []
  const hairNames = ['Haircut', 'Beard Styling', 'Hair Colour', 'Facial', 'Spa', 'Keratin']
  const base = 150 + (index % 4) * 30
  hairNames.forEach((n, i) => {
    if (salon.gender === 'men' && (n === 'Keratin' || (n === 'Hair Colour' && i === 2 && index % 2 === 0))) {
      if (n === 'Keratin' && index % 2) return
    }
    if (salon.gender === 'women' && n === 'Beard Styling') return
    s.push({
      id: salon.id + '-svc-' + i,
      name: n,
      price: base + i * (n === 'Keratin' ? 1200 : n === 'Hair Colour' ? 600 : 60),
      duration: n === 'Keratin' ? 150 : n === 'Hair Colour' ? 90 : n === 'Spa' ? 60 : 30 + (i % 2) * 15,
    })
  })
  return s
}

function buildSalons() {
  return salonSeeds.map((seed, i) => {
    const id = 'salon-' + (i + 1)
    const styles = hairstyles.filter((h) =>
      seed.gender === 'men' ? h.gender === 'men' : seed.gender === 'women' ? h.gender === 'women' : true,
    )
    const portfolio = styles.map((h, j) => ({
      id: h.id + '-' + id,
      hairstyleId: h.id,
      name: h.name,
      image: h.image,
      before: h.image,
      after: h.image,
      price: Math.round(h.price * (0.9 + ((i * 7 + j * 3) % 5) / 10)),
    }))
    const services = genServices(seed, i)
    const priceIndex = PRICING_INDEX[Math.min(2, 1 + (i % 2))]
    const d = new Date(0)
    return {
      id,
      name: seed.name,
      ownerName: 'Owner ' + seed.name.split(' ')[1] + ' ' + (i + 1),
      email: id + '@owner.styledemo.app',
      gender: seed.gender,
      rating: seed.rating,
      reviewsCount: 18 + i * 23,
      description: seed.desc,
      address: seed.area + ', ' + seed.city,
      city: seed.city,
      area: seed.area,
      lat: 12.93 + i * 0.004,
      lng: 77.6 + (i % 4) * 0.006,
      phone: String(9000000000 + i * 111111),
      logo: `https://ui-avatars.com/api/?name=${encodeURIComponent(seed.name)}&bold=true&background=e11d48&color=fff&size=128`,
      cover: IMG_SALON[i % IMG_SALON.length],
      priceIndex,
      startingPrice: Math.min(...services.map((x) => x.price)),
      featured: i < 6,
      verified: i % 3 !== 1,
      openingHours: { open: '09:30', close: '20:30' },
      workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      holidays: [],
      services,
      portfolio,
      slotInterval: 30,
      popular: i % 2 === 0,
    }
  })
}

export const salons = buildSalons()

// ---------- USERS (50) ----------
const firstNames = ['Aarav', 'Vihaan', 'Aditya', 'Arjun', 'Rohan', 'Kabir', 'Ishaan', 'Vivaan', 'Ram', 'Dev', 'Aadhya', 'Diya', 'Anika', 'Meera', 'Sara', 'Ira', 'Navya', 'Saanvi', 'Aarya', 'Myra', 'Riya', 'Priya', 'Nisha', 'Kavya', 'Shreya', 'Varun', 'Karan', 'Siddharth', 'Nikhil', 'Tejas', 'Sanjay', 'Manoj', 'Rajat', 'Harsh', 'Aman', 'Neha', 'Pooja', 'Ritika', 'Simran', 'Tanya', 'Gaurav', 'Dhruv', 'Yash', 'Anurag', 'Kunal', 'Mehul', 'Farhan', 'Imran', 'Zoya', 'Tanvi']
const lastNames = ['Sharma', 'Verma', 'Gupta', 'Nair', 'Reddy', 'Iyer', 'Patel', 'Singh', 'Kumar', 'Das', 'Mehta', 'Joshi', 'Khan', 'Rao', 'Menon']

function buildUsers() {
  return firstNames.map((name, i) => ({
    id: 'user-' + (i + 1),
    name,
    email: name.toLowerCase() + '.seed' + (i + 1) + '@styledemo.app',
    phone: '9' + String(600000000 + i * 12345),
    role: 'customer',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${['94a3b8', 'e11d48', '334155', '0ea5e9'][i % 4]}&color=fff&size=96`,
    createdAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
  }))
}
export const seedUsers = buildUsers()

// ---------- SLOTS (20/day) ----------
const SLOT_START = 9 * 60 + 30
const SLOT_END = 20 * 60 + 30
const SLOT_STEP = 30

function genSlots(salonId, forDate) {
  const d = forDate ? new Date(forDate) : new Date()
  const slots = []
  let bookable = SLOT_END - SLOT_START <= 24 * 60
  for (let t = SLOT_START; t + SLOT_STEP <= SLOT_END; t += SLOT_STEP) {
    const hh = String(Math.floor(t / 60)).padStart(2, '0')
    const mm = String(t % 60).padStart(2, '0')
    slots.push({
      id: salonId + '-' + d.toISOString().slice(0, 10) + '-' + hh + mm,
      salonId,
      date: d.toISOString().slice(0, 10),
      time: hh + ':' + mm,
      available: Math.random() > 0.35,
      booked: false,
    })
  }
  return slots
}
export { genSlots, SLOT_START, SLOT_END, SLOT_STEP }

// ---------- REVIEWS (50) ----------
const reviewTexts = [
  'Absolutely loved the experience. My stylist understood exactly what I wanted.',
  'Best fade I have ever gotten. Detail is impeccable and the ambience is calm.',
  'Walked in without an appointment, got seated in 5 minutes. Super efficient.',
  'Great value for money. Won\'t go anywhere else now.',
  'The keratin treatment worked wonders. My hair has never felt so smooth.',
  'Friendly staff, clean salon and great music. 10/10.',
  'Took my kids here, everyone in the family got styled together. Loved it.',
  'The colourist nailed the exact shade from my reference photo. Amazing!',
  'Reasonable prices and very skilled barbers. Highly recommended.',
  'A bit of a wait even with a booking, but the result was worth every minute.',
  'The salon is spotless and follows great hygiene practices.',
  'My new favourite spot! The wolf cut turned out better than I imagined.',
]
function buildReviews() {
  const reviews = []
  for (let i = 0; i < 50; i++) {
    const salon = salons[Math.floor(Math.random() * salons.length)]
    const user = buildUsers()[Math.floor(Math.random() * 50)]
    reviews.push({
      id: 'rev-' + (i + 1),
      salonId: salon.id,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
      text: reviewTexts[i % reviewTexts.length],
      date: new Date(Date.now() - (i + 1) * 86400000 * 2).toISOString(),
    })
  }
  return reviews
}
export const seedReviews = buildReviews()

// ---------- BOOKINGS (100) ----------
function dateOffset(off) {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + off)
  return d
}

function buildBookings() {
  const users = buildUsers()
  const fmtDate = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const fmtTime = (d) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  const bookings = []
  for (let i = 0; i < 100; i++) {
    const salon = salons[i % salons.length]
    const user = users[i % users.length]
    const style = salon.portfolio[i % salon.portfolio.length]
    const minutes = hairstyles.find((h) => h.id === style.hairstyleId)?.duration || 30
    const off = (i % 9) - 4 // -4..+4 days around today
    const d = dateOffset(off)
    const hours = 10 + (i % 9)
    const start = new Date(d)
    start.setHours(hours, (i % 2) * 30, 0, 0)
    const end = new Date(start.getTime() + minutes * 60000)
    const statusIdx = i % 10
    const status =
      statusIdx < 2 ? 'cancelled' : statusIdx < 5 ? 'completed' : statusIdx === 6 ? 'cancelled' : statusIdx < 8 ? 'confirmed' : 'pending'
    const dateStr = fmtDate(d)
    bookings.push({
      id: 'book-' + (i + 1),
      salonId: salon.id,
      salonName: salon.name,
      userId: user.id,
      userName: user.name,
      phone: user.phone,
      hairstyleId: style.hairstyleId,
      hairstyleName: style.name,
      price: Math.min(style.price, salon.startingPrice + 50),
      date: dateStr,
      slotId: `${salon.id}-${dateStr}-${fmtTime(start).replace(':', '')}`,
      time: fmtTime(start),
      endTime: fmtTime(end),
      status,
      createdAt: new Date(d.getTime() - 86400000 * 2).toISOString(),
    })
  }
  return bookings
}
export const seedBookings = buildBookings()

// ---------- FAVORITES (sample) ----------
export const seedFavorites = salons.slice(0, 3).map((s, i) => ({
  id: 'fav-' + (i + 1),
  userId: 'user-1',
  salonId: s.id,
  hairstyleId: undefined,
  type: 'salon',
}))