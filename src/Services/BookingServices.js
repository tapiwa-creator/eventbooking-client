import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const BOOKINGS_COL = "bookings";

export async function createBooking(bookingData) {
    try {
        const bookingsRef = collection(db, BOOKINGS_COL);

        const bookingPayload = {
            ...bookingData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        const docRef = await addDoc(bookingsRef, bookingPayload);
        console.log("✅ Booking saved:", docRef.id);

        return docRef.id;
    } catch (error) {
        console.error("❌ Error saving booking:", error);
        throw new Error("Failed to save booking. Please try again.");
    }
}

export async function getBookingsByEvent(eventId) {
    // This function can be added later for admin view
}

export async function getUserBookings(email) {
    // This function can be added later for user to view their bookings
}