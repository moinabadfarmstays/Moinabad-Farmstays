// app/(app)/detail/[id]/_components/ResortGallery.jsx
"use client";
import Image from "next/image";

export default function ResortGallery({ images, currentIndex, onIndexChange, onOpen }) {
  return (
    <>
      {/* Desktop grid */}
      <div className="hidden lg:grid grid-cols-4 grid-rows-2 gap-2 h-[450px] rounded-3xl overflow-hidden shadow-xl">
        {images.length === 0 && (
          <div className="col-span-4 row-span-2 bg-gray-200 flex items-center justify-center text-gray-500">
            No images available
          </div>
        )}
        {images.length === 1 && (
          <div className="col-span-4 row-span-2 relative cursor-pointer" onClick={() => onOpen(0)}>
            <Image src={images[0]} alt="main" fill sizes="100vw" className="object-cover hover:scale-105 transition-transform duration-500" />
          </div>
        )}
        {images.length === 2 && (
          <>
            <div className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden" onClick={() => onOpen(0)}>
              <Image src={images[0]} alt="main" fill sizes="50vw" className="object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden" onClick={() => onOpen(1)}>
              <Image src={images[1]} alt="main" fill sizes="50vw" className="object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </>
        )}
        {images.length >= 3 && (
          <>
            <div className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden group" onClick={() => onOpen(0)}>
              <Image src={images[0]} alt="main" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            {images.slice(1, 5).map((img, idx) => {
              const total = images.length;
              const isLastShown = idx === 3 || (total === 3 && idx === 1) || (total === 4 && idx === 2);
              let cls = "relative cursor-pointer overflow-hidden group";
              if (total === 3) cls += " col-span-2 row-span-1";
              else if (total === 4) cls += idx === 0 ? " col-span-2 row-span-1" : " col-span-1 row-span-1";
              else cls += " col-span-1 row-span-1";
              return (
                <div key={idx} className={cls} onClick={() => onOpen(idx + 1)}>
                  <Image src={img} alt={`grid-${idx}`} fill sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  {isLastShown && images.length > 5 && (
                    <div className="absolute inset-0 bg-black/60 hover:bg-black/70 flex items-center justify-center text-white text-xl font-bold transition-colors">
                      +{images.length - 5}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Mobile carousel */}
      <div className="lg:hidden relative rounded-2xl overflow-hidden shadow-lg group">
        <div
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar h-[350px] relative scroll-smooth"
          onScroll={(e) => {
            const w = e.currentTarget.clientWidth;
            const newIdx = Math.round(e.currentTarget.scrollLeft / w);
            if (currentIndex !== newIdx) onIndexChange(newIdx);
          }}
        >
          {images.map((img, idx) => (
            <div key={idx} className="min-w-full h-full snap-start relative cursor-pointer" onClick={() => onOpen(idx)}>
              <Image src={img} alt={`mobile-${idx}`} fill sizes="100vw" className="object-cover" />
            </div>
          ))}
          {images.length === 0 && (
            <div className="min-w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
              No images available
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
    </>
  );
}
