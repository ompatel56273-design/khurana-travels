'use client';
import { createContext, useContext, useState, useCallback } from 'react';

const BookingContext = createContext(null);

const initialState = {
  packageData: null,
  passengerCount: 1,
  mainUser: {
    name: '',
    mobile: '',
    dob: '',
    aadhaarImage: null,
    panImage: null,
  },
  passengers: [],
  step: 1, // 1: package details, 2: form, 3: confirm
};

export const BookingProvider = ({ children }) => {
  const [bookingState, setBookingState] = useState(initialState);

  const setPackageData = useCallback((pkg) => {
    setBookingState((prev) => ({ ...prev, packageData: pkg }));
  }, []);

  const setPassengerCount = useCallback((count) => {
    setBookingState((prev) => {
      const newCount = Math.max(1, Math.min(count, 20));
      // Trim passengers array if count decreased
      const passengers = prev.passengers.slice(0, Math.max(0, newCount - 1));
      return { ...prev, passengerCount: newCount, passengers };
    });
  }, []);

  const setMainUser = useCallback((userData) => {
    setBookingState((prev) => ({
      ...prev,
      mainUser: { ...prev.mainUser, ...userData },
    }));
  }, []);

  const addPassenger = useCallback(() => {
    setBookingState((prev) => ({
      ...prev,
      passengers: [
        ...prev.passengers,
        { name: '', dob: '', aadhaarImage: null, panImage: null, id: Date.now() },
      ],
    }));
  }, []);

  const updatePassenger = useCallback((index, data) => {
    setBookingState((prev) => {
      const passengers = [...prev.passengers];
      passengers[index] = { ...passengers[index], ...data };
      return { ...prev, passengers };
    });
  }, []);

  const removePassenger = useCallback((index) => {
    setBookingState((prev) => ({
      ...prev,
      passengers: prev.passengers.filter((_, i) => i !== index),
    }));
  }, []);

  const setStep = useCallback((step) => {
    setBookingState((prev) => ({ ...prev, step }));
  }, []);

  const resetBooking = useCallback(() => {
    setBookingState(initialState);
  }, []);

  const getTotalAmount = useCallback(() => {
    if (!bookingState.packageData) return 0;
    return bookingState.passengerCount * bookingState.packageData.price;
  }, [bookingState.packageData, bookingState.passengerCount]);

  return (
    <BookingContext.Provider
      value={{
        ...bookingState,
        setPackageData,
        setPassengerCount,
        setMainUser,
        addPassenger,
        updatePassenger,
        removePassenger,
        setStep,
        resetBooking,
        getTotalAmount,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within BookingProvider');
  return context;
};

export default BookingContext;
