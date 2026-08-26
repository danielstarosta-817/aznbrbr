"use client";

import { createContext, useContext } from "react";

export const HomeBarberContext = createContext({
  homeBarberId: null,
  setHomeBarberId: () => {},
});

export function useHomeBarber() {
  return useContext(HomeBarberContext);
}
