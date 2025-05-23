import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface HistoricalImage {
  src: string;
  alt: string;
  caption: string;
}

interface HistoricalImagesCarouselProps {
  images: HistoricalImage[];
}

export const HistoricalImagesCarousel = ({ images }: HistoricalImagesCarouselProps) => {
  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    if (!api) {
      return;
    }

    // Update current index when slide changes
    const onSelect = () => {
      // setCurrentIndex(api.selectedScrollSnap()); // Functionality removed as currentIndex is not used
    };

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className="my-8">
      <h2 className="text-2xl font-semibold text-center mb-6">Tarihi Görüntüler</h2>
      <Carousel className="max-w-3xl mx-auto" setApi={setApi}>
        <CarouselContent>
          {images.map((image: HistoricalImage, index: number) => (
            <CarouselItem key={index}>
              <div className="relative">
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-auto object-cover rounded-lg shadow-lg"
                  style={{ maxHeight: '500px' }} 
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
                  <p className="text-center">{image.caption}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default HistoricalImagesCarousel;
