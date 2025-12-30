export default function AboutPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 text-black">
      <section className="w-full max-w-xl text-[12px] leading-relaxed">
        <div className="space-y-6">
          {/* INTRO */}
          <p>
            <span className="font-medium">R/K2©</span> is a{" "}
            <span className="font-medium">
              independent fashion label built on evolution
            </span>
            , a continuous process of{" "}
            <span className="italic">
              reflecting, learning, and becoming more
            </span>
            .
          </p>

          <p>
            <span className="font-medium">
              Established in 2022 by Sjonlee Ha
            </span>
            , the brand represents the shift from where we started to where we
            are going:{" "}
            <span className="italic">
              forward, consciously, and with intention
            </span>
            .
          </p>

          <div className="h-px w-12 bg-black/30" />

          {/* MOTION */}
          <p>
            Our pieces are{" "}
            <span className="font-medium">
              designed for those who choose movement over stillness.. <br />{" "}
              Individuals who choose to{" "}
              <span className="italic">evolve rather than stay the same</span>
              ...
            </span>
          </p>

          <p></p>

          <div className="h-px w-12 bg-black/30" />

          {/* PHILOSOPHY */}
          <p className="italic">
            Reflection Becomes Knowledge, Knowledge becomes 2volution.
          </p>

          <p>
            <span className="font-medium">
              Timeless silhouettes, luxury construction, and functional details
            </span>{" "}
            work together to create clothing that feels{" "}
            <span className="italic">
              lived-in, intentional, and connected to purpose
            </span>
            .
          </p>

          <p>
            <span className="font-medium">R/K2©</span> exists not to follow
            trends, but to build identity.
          </p>

          <p className="font-medium">
            To inspire growth. <br /> To turn motion into meaning.
          </p>

          <div className="h-px w-12 bg-black/30" />

          {/* CLOSING */}
          <p className="text-right font-medium tracking-wide">
            Designed For Motion – Made To Last
          </p>
        </div>
      </section>
    </main>
  );
}
