/* 
   StayShare — store.js
   Central localStorage data layer + seed data
    */

const DB_KEYS = {
  users: "ss_users",
  properties: "ss_properties",
  bookings: "ss_bookings",
  sharingRequests: "ss_sharing_requests",
  wishlist: "ss_wishlist",
  session: "ss_session",
  seeded: "ss_seeded_v1"
};

const Store = {
  _get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.error("Store read error", key, e);
      return fallback;
    }
  },
  _set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // Generic collection helpers
  getUsers() { return this._get(DB_KEYS.users, []); },
  setUsers(v) { this._set(DB_KEYS.users, v); },

  getProperties() { return this._get(DB_KEYS.properties, []); },
  setProperties(v) { this._set(DB_KEYS.properties, v); },

  getBookings() { return this._get(DB_KEYS.bookings, []); },
  setBookings(v) { this._set(DB_KEYS.bookings, v); },

  getSharingRequests() { return this._get(DB_KEYS.sharingRequests, []); },
  setSharingRequests(v) { this._set(DB_KEYS.sharingRequests, v); },

  getWishlist() { return this._get(DB_KEYS.wishlist, []); }, // [{userId, propertyId}]
  setWishlist(v) { this._set(DB_KEYS.wishlist, v); },

  getSession() { return this._get(DB_KEYS.session, null); },
  setSession(v) { this._set(DB_KEYS.session, v); },
  clearSession() { localStorage.removeItem(DB_KEYS.session); },

  uid(prefix) {
    return prefix + "_" + Math.random().toString(36).slice(2, 9);
  },

  resetAll() {
    Object.values(DB_KEYS).forEach(k => localStorage.removeItem(k));
    seedDatabase(true);
  }
};

/* 
   SEED DATA — only runs once (or on force reset)
    */
function seedDatabase(force) {
  if (!force && Store._get(DB_KEYS.seeded, false)) return;

  const users = [
    {
      id: "admin_001",
      name: "StayShare Admin",
      email: "admin@stayshare.com",
      password: "admin123",
      role: "superAdmin",
      status: "active",
      createdAt: Date.now()
    },
    {
      id: "hotelier_201",
      name: "Rahul Sharma",
      email: "rahul@hotel.com",
      password: "123456",
      role: "hotelier",
      status: "active",
      company: "Sharma Hospitality Group",
      createdAt: Date.now()
    },
    {
      id: "hotelier_202",
      name: "Meera Kapoor",
      email: "meera@stayhotels.com",
      password: "123456",
      role: "hotelier",
      status: "pending",
      company: "Kapoor Stays",
      createdAt: Date.now()
    },
    {
      id: "user_101",
      name: "Taran Singh",
      email: "taran@gmail.com",
      password: "123456",
      role: "user",
      status: "active",
      createdAt: Date.now()
    },
    {
      id: "user_102",
      name: "Anjali Verma",
      email: "anjali@gmail.com",
      password: "123456",
      role: "user",
      status: "active",
      createdAt: Date.now()
    }
  ];

  const properties = [
    {
      id: "property_101",
      ownerId: "hotelier_201",
      name: "The Grand Meridian",
      city: "Delhi",
      address: "Connaught Place, New Delhi",
      description: "A landmark luxury stay in the heart of the capital, blending colonial architecture with modern comfort. Walking distance from major markets and metro access.",
      amenities: ["WiFi", "Parking", "AC", "Pool", "Breakfast", "Gym"],
      rating: 4.7,
      status: "approved",
      createdAt: Date.now(),
      rooms: [
        { id: "room_1", type: "Private Deluxe", price: 4200, capacity: 2, available: true },
        { id: "room_2", type: "Private Suite", price: 6800, capacity: 3, available: true }
      ]
    },
    {
      id: "property_102",
      ownerId: "hotelier_201",
      name: "Coastal Breeze Resort",
      city: "Goa",
      address: "Calangute Beach Road, Goa",
      description: "Beachfront resort with private balconies overlooking the Arabian Sea. Known for its infinity pool and evening beach bonfires.",
      amenities: ["WiFi", "Pool", "Beach Access", "Bar", "AC"],
      rating: 4.5,
      status: "approved",
      createdAt: Date.now(),
      rooms: [
        { id: "room_3", type: "Sea View Room", price: 5200, capacity: 2, available: true },
        { id: "room_4", type: "Garden Cottage", price: 3400, capacity: 2, available: true }
      ]
    },
    {
      id: "property_103",
      ownerId: "hotelier_202",
      name: "Hillcrest Homestay",
      city: "Manali",
      address: "Old Manali",
      description: "A cozy mountain homestay with wood interiors, bonfire evenings, and views of the Beas valley. Perfect for backpackers and small groups.",
      amenities: ["WiFi", "Bonfire", "Home-cooked Meals", "Parking"],
      rating: 4.3,
      status: "pending",
      createdAt: Date.now(),
      rooms: [
        { id: "room_5", type: "Shared Dorm Bed", price: 900, capacity: 1, available: true },
        { id: "room_6", type: "Private Room", price: 2200, capacity: 2, available: true }
      ]
    },
    {
      id: "property_104",
      ownerId: "hotelier_201",
      name: "Urban Nest Bengaluru",
      city: "Bengaluru",
      address: "Indiranagar, Bengaluru",
      description: "A modern boutique stay tailored for working professionals, with coworking lounges and fast WiFi throughout.",
      amenities: ["WiFi", "Coworking Space", "AC", "Cafe", "Parking"],
      rating: 4.6,
      status: "approved",
      createdAt: Date.now(),
      rooms: [
        { id: "room_7", type: "Studio Room", price: 3100, capacity: 1, available: true },
        { id: "room_8", type: "Executive Room", price: 4700, capacity: 2, available: true }
      ]
    }
  ];

  const bookings = [
    {
      id: "booking_1",
      userId: "user_101",
      propertyId: "property_101",
      roomId: "room_1",
      checkIn: "2026-09-10",
      checkOut: "2026-09-13",
      guests: 2,
      totalPrice: 12600,
      status: "upcoming",
      sharing: false,
      createdAt: Date.now()
    }
  ];

  Store.setUsers(users);
  Store.setProperties(properties);
  Store.setBookings(bookings);
  Store.setSharingRequests([]);
  Store.setWishlist([]);
  Store._set(DB_KEYS.seeded, true);
}

seedDatabase(false);
