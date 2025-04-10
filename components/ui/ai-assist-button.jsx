"use client";

import { useState } from "react";
import { Button } from "./button";
import { Sparkles } from "lucide-react";

export function AiAssistButton({ onClick, type = "button", loading = false, className = "" }) {
  const [hover, setHover] = useState(false);

  return (
    <Button
      type={type}
      variant="outline"
      className={`flex items-center bg-gradient-to-r hover:from-purple-100 hover:to-indigo-100 transition-all ${className}`}
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Sparkles
        className={`w-4 h-4 mr-2 transition-colors ${hover ? 'text-purple-600' : 'text-gray-600'}`}
      />
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Yazılıyor...</span>
        </>
      ) : (
        <span>AI ile Yaz</span>
      )}
    </Button>
  );
} 