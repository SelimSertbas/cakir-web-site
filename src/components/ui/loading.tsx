interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

export const Loading = ({ text = "Yükleniyor...", fullScreen = false }: LoadingProps) => {
  return (
    <div className={`flex flex-col items-center justify-center ${fullScreen ? 'min-h-screen' : 'min-h-[200px]'}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}; 