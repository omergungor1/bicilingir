"use client";

import { Button } from "./ui/button";
import Link from "next/link";

export const EmergencyCallButton = () => {

  return (
    <Link href="/">
      <Button
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold"
      >
        Detaylı Çilingir Arama
      </Button>
    </Link>
  );
}; 