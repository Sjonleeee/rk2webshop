// import Image from "next/image";
// import Link from "next/link";

// export default function ArchiveItem({
//   handle,
//   image,
//   title,
// }: {
//   handle: string;
//   image: string;
//   title: string;
// }) {
//   return (
//     <Link
//       href={`/product/${handle}`}
//       className="min-w-[60vw] md:min-w-[40vw] lg:min-w-[30vw]"
//     >
//       <div className="relative aspect-3/4">
//         <Image
//           src={image}
//           alt={title}
//           fill
//           className="object-contain"
//           sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 60vw"
//         />
//       </div>

//       <div className="mt-3 text-xs tracking-wide opacity-60">
//         {title}
//       </div>
//     </Link>
//   );
// }
