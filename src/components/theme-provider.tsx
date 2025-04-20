"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface ThemeProviderProps extends React.PropsWithChildren {
  storageKey?: string
  forceHydrate?: boolean
}

export function ThemeProvider({
  children,
  storageKey,
  forceHydrate,
}: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      storageKey={storageKey}
      forceHydrate={forceHydrate}
    >
      {children}
    </NextThemesProvider>
  );
}

