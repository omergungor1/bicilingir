import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";

export const RatingModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  locksmith, 
  initialRating = 0 
}) => {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit({ rating, comment });
      // Form temizle
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Değerlendirme gönderirken hata:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="mb-6 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-2">Çilingir Hizmet Değerlendirmesi</h3>
          <p className="text-gray-600">
            <span className="font-bold">{locksmith?.name || "Çilingir"}</span> için değerlendirmenizi paylaşın
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="text-center mb-2">
              <p className="text-gray-700 mb-2">Hizmet kalitesini puanlayın</p>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-3xl focus:outline-none"
                  >
                    {star <= (hoverRating || rating) ? (
                      <span className="text-yellow-400">★</span>
                    ) : (
                      <span className="text-gray-300">☆</span>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {rating === 1 && "Çok Kötü"}
                {rating === 2 && "Kötü"}
                {rating === 3 && "Orta"}
                {rating === 4 && "İyi"}
                {rating === 5 && "Çok İyi"}
              </p>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="comment" className="block text-gray-700 mb-2">
              Yorumunuz
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Deneyiminizi paylaşın (opsiyonel)"
            ></textarea>
          </div>
          <div className="flex justify-end space-x-3">
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={rating === 0 || isSubmitting}
            >
              {isSubmitting ? "Gönderiliyor..." : "Gönder"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 