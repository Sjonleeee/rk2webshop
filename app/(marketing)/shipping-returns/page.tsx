export const metadata = {
  title: "Shipping & Returns — R/K2©",
  description: "Shipping, returns, and refund information for R/K2©.",
};

export default function ShippingReturnsPage() {
  return (
    <main className="min-h-screen flex justify-center px-6 py-32 text-black">
      <section className="w-full max-w-2xl text-[13px] leading-relaxed">
        <div className="space-y-8">
          {/* TITLE */}
          <h1 className="font-medium tracking-wide">Shipping & Returns</h1>

          {/* INTRO */}
          <p>
            We believe shipping and returns should feel clear, simple, and
            transparent. Below you’ll find everything you need to know before
            and after placing an order.
          </p>

          <div className="text-neutral-400">/</div>

          {/* SHIPPING */}
          <h2 className="font-medium">Shipping</h2>

          <p>
            Orders are processed within a reasonable timeframe after payment
            confirmation. Once shipped, you will receive a confirmation email
            with tracking information when available.
          </p>

          <p>
            Delivery times may vary depending on your location and external
            factors such as carrier delays or customs processing. Shipping
            costs, if applicable, are calculated at checkout.
          </p>

          <div className="text-neutral-400">/</div>

          {/* RETURNS */}
          <h2 className="font-medium">Returns</h2>

          <p>
            You have the right to return your order within{" "}
            <span className="font-medium">14 days of receipt</span>. Returned
            items must be unused, unworn, and in their original condition,
            including all tags and packaging.
          </p>

          <p>
            Items that are worn, washed, damaged, or altered are not eligible
            for a return or refund.
          </p>

          <div className="text-neutral-400">/</div>

          {/* HOW TO RETURN */}
          <h2 className="font-medium">How to Return an Item</h2>

          <p>
            To initiate a return, please contact us via email at{" "}
            <a
              href="mailto:info@rk2archive.com"
              className="underline underline-offset-2"
            >
              info@rk2archive.com
            </a>
            .
          </p>

          <p>
            Please include your order number and the item(s) you wish to return.
            Once your request is approved, the return address and instructions
            will be provided via email.
          </p>

          <p>
            Return shipping costs are the responsibility of the customer, unless
            the item was received defective or incorrect.
          </p>

          <div className="text-neutral-400">/</div>

          {/* DEFECTIVE */}
          <h2 className="font-medium">Defective or Incorrect Items</h2>

          <p>
            If you receive an item that is defective or incorrect, please
            contact us within{" "}
            <span className="font-medium">48 hours of delivery</span>. Each case
            will be reviewed individually.
          </p>

          <p>If approved, return shipping costs will be reimbursed.</p>

          <div className="text-neutral-400">/</div>

          {/* REFUNDS */}
          <h2 className="font-medium">Refunds</h2>

          <p>
            Refunds are issued to the original payment method used for the
            purchase. Once your return is received and approved, processing may
            take up to <span className="font-medium">7 business days</span>.
          </p>

          <p>Shipping costs are non-refundable.</p>

          <div className="text-neutral-400">/</div>

          {/* CLOSING */}
          <p className="text-right font-medium tracking-wide">
            Designed For Motion – Made To Last
          </p>
        </div>
      </section>
    </main>
  );
}
