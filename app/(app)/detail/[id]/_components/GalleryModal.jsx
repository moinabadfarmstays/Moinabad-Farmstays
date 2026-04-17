// app/(app)/detail/[id]/_components/GalleryModal.jsx
"use client";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function GalleryModal({ images, index, onClose, onIndex }) {
  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col">
      <div className="absolute top-16 right-6 z-[200] flex gap-4">
        <button
          onClick={onClose}
          className="bg-white hover:bg-white/10 text-luxury-gold-dark rounded-full w-10 h-10 flex items-center justify-center transition-colors"
          aria-label="Close Gallery"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 relative flex items-center justify-center p-4">
        {images.length > 0 && (
          <div className="relative w-full max-w-5xl aspect-video">
            <Image
              src={images[index]}
              alt={`Gallery image ${index + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={() => onIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
              className="absolute left-4 md:left-10 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={() => onIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
              className="absolute right-4 md:right-10 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="h-24 md:h-32 bg-black/50 overflow-x-auto flex items-center gap-2 p-4 snap-x hide-scrollbar">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => onIndex(idx)}
            className={`relative h-full aspect-video flex-shrink-0 rounded overflow-hidden opacity-50 transition-all ${
              index === idx ? "opacity-100 ring-2 ring-white scale-105" : "hover:opacity-75"
            }`}
          >
            <Image src={img} alt={`Thumb ${idx}`} fill sizes="128px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
