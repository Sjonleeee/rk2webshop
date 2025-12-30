export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen flex justify-center px-6 py-32 text-black">
      <section className="w-full max-w-2xl text-[13px] leading-relaxed">
        <div className="space-y-8">
          <h1 className="font-medium tracking-wide">Privacy Policy</h1>

          <p>
            This Privacy Policy explains how{" "}
            <span className="font-medium">R/K2©</span> collects, uses, and
            protects your personal data when you visit or make a purchase
            through our website.
          </p>

          <p className="tracking-wide text-neutral-400">/</p>

          <h2 className="font-medium">1. Who we are</h2>
          <p>R/K2© is an independent fashion label based in Belgium.</p>
          <p>
            Owner: Sjonlee Ha
            <br />
            Contact:{" "}
            <a
              href="mailto:rinfo@rk2archive.com"
              className="underline underline-offset-2"
            >
              info@rk2archive.com
            </a>
          </p>

          <p className="tracking-wide text-neutral-400">/</p>

          <h2 className="font-medium">2. What personal data we collect</h2>
          <p>
            When you interact with our website, we may collect the following
            data:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Name and surname</li>
            <li>Email address</li>
            <li>Billing and shipping address</li>
            <li>Order history</li>
            <li>IP address and device information</li>
            <li>Communication via email or contact forms</li>
          </ul>

          <p className="tracking-wide text-neutral-400">/</p>

          <h2 className="font-medium">3. Why we collect your data</h2>
          <p>Your data is used only when necessary, including to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Process and fulfill orders</li>
            <li>Handle payments and shipping</li>
            <li>Provide customer support</li>
            <li>Comply with legal and accounting obligations</li>
            <li>Improve our website and user experience</li>
            <li>Send updates or newsletters (only with your consent)</li>
          </ul>

          <p className="tracking-wide text-neutral-400">/</p>

          <h2 className="font-medium">4. Your rights</h2>
          <p>Under GDPR, you have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access your personal data</li>
            <li>Correct or update your data</li>
            <li>Request deletion of your data</li>
            <li>Restrict or object to data processing</li>
            <li>Request data portability</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <p className="tracking-wide text-neutral-400">/</p>

          <h2 className="font-medium">Contact</h2>
          <p>
            For questions about this policy or your data, contact us at:{" "}
            <a
              href="mailto:rk2.archive@gmail.com"
              className="underline underline-offset-2"
            >
              rk2.archive@gmail.com
            </a>
          </p>

          <p className="text-neutral-400">
            Last updated: {new Date().toLocaleDateString("en-GB")}
          </p>
        </div>
      </section>
    </main>
  );
}
