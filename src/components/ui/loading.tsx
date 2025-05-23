import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Loading = ({ className, size = "md" }: LoadingProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm z-50">
      <div
        className={cn(
          "animate-spin rounded-full border-4 border-primary border-t-transparent",
          sizeClasses[size],
          className
        )}
      />
      <p className="mt-4 text-lg font-medium text-primary">Yükleniyor...</p>
    </div>
  );
}; 