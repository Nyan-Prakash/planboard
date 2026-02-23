import { Suspense } from "react";
import { JoinPageInner } from "./join-page-inner";

export default function OrgJoinPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[80vh]">
        <span className="text-sm" style={{ color: "var(--desk-muted)" }}>Loading…</span>
      </div>
    }>
      <JoinPageInner />
    </Suspense>
  );
}
