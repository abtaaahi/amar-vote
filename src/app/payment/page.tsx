import { Suspense } from "react";
import PaymentClient from "./PaymentClient";

export default function PaymentPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <PaymentClient />
    </Suspense>
  );
}
