"use client";

import { useEffect, useState } from "react";
import { HomeBarberContext } from "./HomeBarberContext";

const STORAGE_KEY = "aznbrbr.homeBarberId";

export default function HomeBarberProvider({ defaultHomeBarberId, children }) {
  const [homeBarberId, setHomeBarberIdState] = useState(defaultHomeBarberId || null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setHomeBarberIdState(stored);
    } catch (e) {
      // localStorage unavailable — fall back to the default, no crash.
    }
  }, []);

  function setHomeBarberId(id) {
    setHomeBarberIdState(id);
    try {
      window.localStorage.setItem(STORAGE_KEY, id || "");
    } catch (e) {
      // ignore
    }
  }

  return (
    <HomeBarberContext.Provider value={{ homeBarberId, setHomeBarberId }}>
      {children}
    </HomeBarberContext.Provider>
  );
}
