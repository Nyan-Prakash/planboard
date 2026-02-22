"use client";

import { useState } from "react";
import { StarRating } from "@/components/rating/star-rating";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RatingFormProps {
  activityId: string;
  initialRating?: {
    suitability: number;
    goalAchievement: number;
    recommendation: number;
    overallRating?: number | null;
    reviewText?: string | null;
    comment?: string | null;
  };
  onSuccess?: () => void;
}

export function RatingForm({
  activityId,
  initialRating,
  onSuccess,
}: RatingFormProps) {
  const [suitability, setSuitability] = useState(
    initialRating?.suitability ?? 0
  );
  const [goalAchievement, setGoalAchievement] = useState(
    initialRating?.goalAchievement ?? 0
  );
  const [recommendation, setRecommendation] = useState(
    initialRating?.recommendation ?? 0
  );
  const [overallRating, setOverallRating] = useState(
    initialRating?.overallRating ?? 0
  );
  const [reviewText, setReviewText] = useState(
    initialRating?.reviewText ?? ""
  );
  const [comment, setComment] = useState(initialRating?.comment ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const canSubmit =
    suitability > 0 && goalAchievement > 0 && recommendation > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityId,
          suitability,
          goalAchievement,
          recommendation,
          overallRating: overallRating || undefined,
          reviewText: reviewText || undefined,
          comment: comment || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to submit rating");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
      onSuccess?.();
    } catch {
      setError("Something went wrong");
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="mb-4 text-4xl">&#10003;</div>
          <h3 className="text-lg font-semibold text-gray-900">
            {initialRating ? "Rating updated!" : "Thank you for your feedback!"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Your rating helps improve activity recommendations for all teachers.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialRating ? "Update Your Rating" : "Rate This Activity"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <StarRating
          label="How suitable did you find it to the lesson information?"
          value={suitability}
          onChange={setSuitability}
        />

        <StarRating
          label="Were you able to achieve the learning goals through it?"
          value={goalAchievement}
          onChange={setGoalAchievement}
        />

        <StarRating
          label="Do you recommend it to your subject teachers?"
          value={recommendation}
          onChange={setRecommendation}
        />

        <div className="border-t pt-4">
          <StarRating
            label="Overall Rating (Optional)"
            value={overallRating ?? 0}
            onChange={setOverallRating}
          />
        </div>

        <div>
          <Label htmlFor="reviewText" className="font-medium text-gray-900">
            Write a Review (Optional)
          </Label>
          <Textarea
            id="reviewText"
            value={reviewText ?? ""}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this activity..."
            className="mt-2 bg-white"
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="comment" className="font-medium text-gray-900">
            Additional Comments (Optional)
          </Label>
          <Textarea
            id="comment"
            value={comment ?? ""}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Any additional thoughts..."
            className="mt-2 bg-white"
            rows={2}
          />
        </div>

        <Button
          className="w-full"
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
        >
          {submitting
            ? "Submitting..."
            : initialRating
              ? "Update Rating"
              : "Submit Rating"}
        </Button>
      </CardContent>
    </Card>
  );
}
