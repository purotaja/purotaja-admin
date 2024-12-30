"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LucideLoader, Pen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReviews } from "@/hooks/use-reviews";
import { usePathname } from "next/navigation";

interface Review {
  id: string;
  rating: number;
  comment: string;
  product: string;
  client: string;
}

const ReviewsTable = () => {
  const pathname = usePathname();
  const { reviews, deleteReview, isLoading, error } = useReviews(
    pathname.split("/")[1]
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredReviews, setFilteredReviews] = useState<Review[]>(reviews);

  console.log(reviews);

  useEffect(() => {
    if (!reviews) return;

    setFilteredReviews(
      reviews.filter((review) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          searchQuery === "" ||
          review.rating === parseInt(searchQuery) ||
          review.comment.toLowerCase().includes(searchLower) ||
          review.product.toLowerCase().includes(searchLower) ||
          review.client.toLowerCase().includes(searchLower)
        );
      })
    );
  }, [searchQuery, reviews]);

  if (error) {
    return <div className="text-red-500 mt-5">Error: {error.message}</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center mt-10">
        <LucideLoader className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <section className="flex flex-col mt-5">
      <Input
        placeholder="Search"
        className="w-1/6"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {filteredReviews.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReviews.map((review) => (
              <TableRow key={review.id}>
                <TableHead>{review.product}</TableHead>
                <TableHead>{review.client}</TableHead>
                <TableHead>{review.rating}</TableHead>
                <TableHead>{review.comment}</TableHead>
                <TableHead>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteReview(review.id)}
                  >
                    <Trash2 />
                  </Button>
                </TableHead>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-gray-400 mt-5 text-center">No reviews found.</div>
      )}
    </section>
  );
};

export default ReviewsTable;
