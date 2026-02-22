"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteActivityButtonProps {
  activityId: string;
  activityTitle: string;
}

export function DeleteActivityButton({ activityId, activityTitle }: DeleteActivityButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/activities/${activityId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOpen(false);
        router.refresh();
      } else {
        const { error } = await res.json();
        console.error("Delete failed:", error);
      }
    } catch {
      console.error("Failed to delete activity");
    }
    setLoading(false);
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
        className="p-1.5 rounded-md text-desk-muted hover:text-red-500 hover:bg-red-50 transition-colors"
        title="Delete activity"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 shrink-0">
                <TriangleAlert className="h-5 w-5 text-red-600" />
              </div>
              <DialogTitle className="text-desk-ink text-lg">Delete Activity?</DialogTitle>
            </div>
            <DialogDescription className="text-desk-body text-sm leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-desk-ink">&ldquo;{activityTitle}&rdquo;</span>?
              This action cannot be undone and will permanently remove the activity.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="border-desk-border text-desk-body"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting…" : "Yes, delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
