
import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const historicalImages = [
  "/lovable-uploads/b96cb3ad-9476-4b00-aeae-1f6ab402dffd.png",
  "/lovable-uploads/ea9eb8c8-9f74-48a5-a629-6e2988a116bb.png",
  "/lovable-uploads/2907c98f-58a5-4db2-a8cf-59f931e7fa8e.png",
  "/lovable-uploads/62ebb1b5-4636-4feb-926c-93d548eb264e.png",
  "/lovable-uploads/1498a28d-5b99-44af-91bf-2c5b3e622e88.png",
  "/lovable-uploads/8ef4d298-8e82-4082-9f5f-98ca316f901e.png",
  "/lovable-uploads/646bfd5b-f5d7-48be-90d5-50ee177b07ab.png",
  "/lovable-uploads/2ddb495b-b255-4739-84ec-2ae07c32a5d8.png",
  "/lovable-uploads/74fac6ae-6ea3-4c98-aec8-3239e0be9d5d.png",
  "/lovable-uploads/335eb62a-c898-4bf8-8e1f-75111944a98c.png",
  "/lovable-uploads/d8ae2f1b-6fa6-4fcf-a1a5-fd9ce528d395.png",
  "/lovable-uploads/b7c158fa-cc6f-4b9f-888d-5ed6f723b61b.png",
  "/lovable-uploads/6b7fc652-7ab0-443d-ac58-98457372d7e6.png",
  "/lovable-uploads/e7783734-ebee-4339-8d4c-80d623e895cd.png",
  "/lovable-uploads/686d2ab6-3ef2-44cd-8c38-eaf9e99550af.png",
  "/lovable-uploads/af34b27d-eaee-4ff0-810a-f6dbbab97894.png",
  "/lovable-uploads/5882ccf8-d358-4869-94e7-77c6d49302a4.png",
  "/lovable-uploads/d104cf0d-b47e-490c-9fa4-5d50e82041ba.png",
  "/lovable-uploads/27f3520f-4b21-4f87-bb22-0fe72573fa6f.png",
  "/lovable-uploads/e63fb5a8-2bd0-4248-8639-7cd6073e2970.png"
];

const HistoricalImagesCarousel = () => {
  const [api, setApi] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    
    // Auto-slide every 4 seconds
    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);
    
    // Cleanup on unmount
    return () => clearInterval(interval);
  }, [api]);

  useEffect(() => {
    if (!api) return;

    // Update current index when slide changes
    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  return (
    <section className="py-16 bg-coffee-50/50 dark:bg-coffee-900/60">
      <div className="container-content">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-coffee-800 dark:text-coffee-200 mb-8 text-center">
          Tarihten Kareler
        </h2>
        
        <Carousel className="max-w-3xl mx-auto" setApi={setApi}>
          <CarouselContent>
            {historicalImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative">
                  <img
                    src={image}
                    alt="Tarihten Bir Kare"
                    className="w-full h-[500px] object-cover rounded-lg shadow-lg"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default HistoricalImagesCarousel;
