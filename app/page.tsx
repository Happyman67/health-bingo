import { Suspense } from "react";
import { AppFallback } from "@/components/AppFallback";
import HealthBingo from "@/components/HealthBingo";

export default function Page() {
  return (
    <Suspense fallback={<AppFallback />}>
      <HealthBingo />
    </Suspense>
  );
}
