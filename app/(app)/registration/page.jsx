import { Suspense } from "react";
import SiteLayout from "@/app/components/layout/SiteLayout";
import Registration from "@/app/components/Registration";

export default function UserRegister() {
  return (
    <SiteLayout>
      <Suspense fallback={
        <div className="flex min-h-[50vh] items-center justify-center p-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent" />
        </div>
      }>
        <Registration />
      </Suspense>
    </SiteLayout>
  );
}
