"use client";

import { Button } from "./ui/button";

export const EmergencyCallButton = () => {
  return (
    <Button 
      onClick={() => {
        // Client-side işlemler
        alert("Acil çilingir çağrılıyor!");
      }}
      className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold"
    >
      Acil Çilingir Çağır
    </Button>
  );
}; 