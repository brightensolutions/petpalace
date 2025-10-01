"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, Trash2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Review {
  _id: string;
  product: {
    _id: string;
    name: string;
    slug: string;
    image: string;
  };
  user_name: string;
  user_email: string;
  rating: number;
  title: string;
  comment: string;
  approved: boolean;
  helpful: number;
  createdAt: string;
  updatedAt: string;
}

export default function ReviewDetailPage() {
  const router = useRouter();
  const params = useParams();
  const reviewId = params.id as string;

  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReview();
  }, [reviewId]);

  const fetchReview = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/reviews/${reviewId}`);
      const json = await res.json();
      if (json.success) {
        setReview(json.data);
      } else {
        toast.error("Failed to load review");
      }
    } catch (error) {
      toast.error("Error fetching review");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: true }),
      });

      const json = await res.json();
      if (json.success) {
        setReview((prev) => (prev ? { ...prev, approved: true } : null));
        toast.success("Review approved successfully");
      } else {
        toast.error("Failed to approve review");
      }
    } catch (err) {
      toast.error("An error occurred while approving");
    }
  };

  const handleReject = async () => {
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: false }),
      });

      const json = await res.json();
      if (json.success) {
        setReview((prev) => (prev ? { ...prev, approved: false } : null));
        toast.success("Review rejected successfully");
      } else {
        toast.error("Failed to reject review");
      }
    } catch (err) {
      toast.error("An error occurred while rejecting");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Review deleted successfully");
        router.push("/admin/review");
      } else {
        toast.error("Failed to delete review");
      }
    } catch (err) {
      toast.error("An error occurred while deleting");
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-2xl ${
              star <= rating ? "text-yellow-500" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="mt-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Loading review...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="mt-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">Review not found</p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => router.push("/admin/review")}
            >
              Back to Reviews
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/admin/review")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-blue-700">Review Details</h1>
          <p className="text-sm text-gray-500">
            View and manage customer review
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-xl">{review.title}</CardTitle>
              <CardDescription>
                Review for{" "}
                <span className="font-semibold text-blue-600">
                  {review.product.name}
                </span>
              </CardDescription>
            </div>
            {review.approved ? (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                Approved
              </Badge>
            ) : (
              <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                Pending
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={review.product.image || "/placeholder.svg"}
              alt={review.product.name}
              className="w-24 h-24 object-cover rounded-lg border"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{review.product.name}</h3>
              <p className="text-sm text-gray-500">
                Product ID: {review.product._id}
              </p>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Rating
              </h4>
              <div className="flex items-center gap-3">
                {renderStars(review.rating)}
                <span className="text-lg font-semibold">
                  {review.rating} / 5
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Customer Information
              </h4>
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {review.user_name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span>{" "}
                  {review.user_email}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Review Comment
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {review.comment}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">
                  Helpful votes:
                </span>{" "}
                <span className="text-gray-600">{review.helpful}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Submitted:</span>{" "}
                <span className="text-gray-600">
                  {new Date(review.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 flex flex-wrap gap-3">
            {!review.approved ? (
              <Button
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={handleApprove}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Review
              </Button>
            ) : (
              <Button
                className="bg-yellow-600 text-white hover:bg-yellow-700"
                onClick={handleReject}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject Review
              </Button>
            )}
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Review
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push(`/products/${review.product.slug}`)}
            >
              View Product
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
