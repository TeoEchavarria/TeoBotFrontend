"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"

interface ThemeProviderProps extends React.PropsWithChildren {
  storageKey?: string
  forceHydrate?: boolean
}

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <NextThemesProvider {...props} attribute="class" defaultTheme="system" enableSystem={true}>
      {children}
    </NextThemesProvider>
  );
}
