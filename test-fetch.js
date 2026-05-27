require('dotenv').config();
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, query, orderBy, limit } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
    const q = query(collection(db, "events"), orderBy("createdAt", "desc"), limit(2));
    const snap = await getDocs(q);
    snap.forEach(doc => {
        console.log("ID:", doc.id);
        const data = doc.data();
        console.log("Title:", data.title);
        console.log("Pricing:", data.pricing);
        console.log("Tiers:", data.tiers);
        console.log("Price (flat):", data.price, data.priceNum);
        console.log("-------------------");
    });
}
test();
