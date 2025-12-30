// import ArchiveCanvas from "@/components/archive/ArchiveCanvas";
// import ArchiveItem from "@/components/archive/ArchiveItem";
// import { Key } from "react";

// export default async function ArchivePage() {
//   const products = await getAllProducts();

//   return (
//     <main className="h-screen w-screen overflow-hidden bg-background px-12 py-20">
//       <ArchiveCanvas>
//         {products.map(
//           (p: {
//             id: Key | null | undefined;
//             handle: string;
//             title: string;
//             images: { edges: { node: { url: string } }[] };
//           }) => (
//             <ArchiveItem
//               key={p.id}
//               handle={p.handle}
//               title={p.title}
//               image={p.images.edges[0]?.node.url}
//             />
//           )
//         )}
//       </ArchiveCanvas>
//     </main>
//   );
// }

"use client";

import { motion } from "framer-motion";

export default function ArchivePage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center"
    >
      <h1 className="text-xl font-mono">Archive</h1>
    </motion.main>
  );
}
