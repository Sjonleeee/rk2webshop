export const metadata = {
  title: "Contact — R/K2©",
  description: "Contact R/K2© for orders, returns, or general inquiries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen flex justify-center px-6 py-32 text-black">
      <section className="w-full max-w-2xl text-[13px] leading-relaxed">
        <div className="space-y-10">
          {/* TITLE */}
          <h1 className="font-medium tracking-wide">Contact</h1>

          {/* INTRO */}
          <p>
            For questions regarding orders, shipping, returns, or general
            inquiries, feel free to reach out. We aim to respond as clearly and
            thoughtfully as possible.
          </p>

          <p className="text-neutral-500">
            Please allow up to <span className="font-medium">48 hours</span> for
            a response during business days.
          </p>

          {/* FORM */}
          <form
            action="mailto:rk2.archive@gmail.com"
            method="POST"
            encType="text/plain"
            className="space-y-6"
          >
            {/* NAME */}
            <div className="space-y-1">
              <label className="text-neutral-500">Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full border-b border-neutral-300 bg-transparent py-2 outline-none focus:border-black"
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-1">
              <label className="text-neutral-500">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full border-b border-neutral-300 bg-transparent py-2 outline-none focus:border-black"
              />
            </div>

            {/* SUBJECT */}
            <div className="space-y-1">
              <label className="text-neutral-500">Subject</label>
              <select
                name="subject"
                required
                className="w-full border-b border-neutral-300 bg-transparent py-2 outline-none focus:border-black"
              >
                <option value="">Select a subject</option>
                <option value="Order inquiry">Order inquiry</option>
                <option value="Shipping & returns">Shipping & returns</option>
                <option value="Product question">Product question</option>
                <option value="General inquiry">General inquiry</option>
              </select>
            </div>

            {/* MESSAGE */}
            <div className="space-y-1">
              <label className="text-neutral-500">Message</label>
              <textarea
                name="message"
                rows={4}
                required
                className="w-full border-b border-neutral-300 bg-transparent py-2 outline-none resize-none focus:border-black"
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="border border-neutral-300 px-4 py-2 rounded-md font-medium tracking-wide"
            >
              Send message
            </button>
          </form>

          {/* CONTACT DETAILS */}
          <div className="space-y-2">
            <p>
              Email:{" "}
              <a
                href="mailto:info@rk2archive.com"
                className="underline underline-offset-2"
              >
                info@rk2archive.com
              </a>
            </p>

            <p>Location: Belgium</p>
          </div>

          {/* CLOSING */}
          <p className="text-right font-medium tracking-wide">
            Designed For Motion – Made To Last
          </p>
        </div>
      </section>
    </main>
  );
}
