import React from "react";

interface LoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export function Loader({ isLoading, children }: LoaderProps) {
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-md">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#00629B]/20 border-t-[#00629B]"></div>
          <div className="absolute text-[10px] font-extrabold text-[#00629B] tracking-wider">
            IEEE
          </div>
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-[#002855]">
          Loading IEEE PEC SB...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
