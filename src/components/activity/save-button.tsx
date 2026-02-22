"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";

interface SaveButtonProps {
  activityId: string;
  initialSaved?: boolean;
}

export function SaveButton({ activityId, initialSaved = false }: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/activities/${activityId}/save`, {
        method: "POST",
      });
      if (res.ok) {
        const { saved: newState } = await res.json();
        setSaved(newState);
        if (newState) {
          setJustSaved(true);
          setTimeout(() => setJustSaved(false), 700);
        }
      }
    } catch {
      console.error("Failed to toggle save");
    }
    setLoading(false);
  };

  return (
    <Button
      variant={saved ? "default" : "outline"}
      size="sm"
      onClick={toggle}
      disabled={loading}
      className={`gap-1.5 transition-all ${
        saved
          ? "bg-desk-teal text-white border-desk-teal hover:opacity-90"
          : "border-desk-border text-desk-body hover:border-desk-teal hover:text-desk-teal"
      }`}
    >
      <span className={justSaved ? "stamp-animate inline-flex" : "inline-flex"}>
        {saved ? (
          <BookmarkCheck className="h-4 w-4" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
      </span>
      {saved ? "Saved to Binder" : "Save to Binder"}
    </Button>
  );
}

