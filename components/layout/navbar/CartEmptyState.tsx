"use client";

export default function CartEmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
      <p className="text-base font-medium">Your cart is empty</p>
      <p className="text-sm mt-1">Add items to get started.</p>
    </div>
  );
}
