import { useState, useEffect } from "react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  product: string;
  client: string;
}

interface ReviewsResponse {
  reviews: Review[];
}

interface UseReviewsReturn {
  reviews: Review[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
}

export const useReviews = (storeId: string): UseReviewsReturn => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/${storeId}/reviews`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ReviewsResponse = await response.json();
      setReviews(data.reviews);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch reviews")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReview = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/${storeId}/reviews/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      await fetchReviews();
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to delete review")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return {
    reviews,
    isLoading,
    error,
    refetch: fetchReviews,
    deleteReview,
  };
};
