"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { routes, protectedRoutes } from "@/app/resources";
import { Flex, Spinner, Button, Heading, Column, PasswordInput } from "@/once-ui/components";
import NotFound from "@/app/not-found";

interface RouteGuardProps {
  children: React.ReactNode;
}

function isRouteEnabled(pathname: string | null) {
  if (!pathname) return false;

  if (pathname in routes) {
    return routes[pathname as keyof typeof routes];
  }

  const dynamicRoutes = ["/blog", "/work"] as const;
  return dynamicRoutes.some((route) => pathname.startsWith(route) && routes[route]);
}

// Route checks are synchronous so pages render on the server (SEO + fast LCP).
// Only password-protected routes wait for a client-side auth check.
const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const isProtected = Boolean(protectedRoutes[pathname as keyof typeof protectedRoutes]);

  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(isProtected);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isProtected) return;
    let cancelled = false;
    setCheckingAuth(true);
    fetch("/api/check-auth")
      .then((response) => {
        if (!cancelled) setIsAuthenticated(response.ok);
      })
      .finally(() => {
        if (!cancelled) setCheckingAuth(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isProtected, pathname]);

  const handlePasswordSubmit = async () => {
    const response = await fetch("/api/authenticate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      setIsAuthenticated(true);
      setError(undefined);
    } else {
      setError("Incorrect password");
    }
  };

  if (!isRouteEnabled(pathname)) {
    return <NotFound />;
  }

  if (isProtected && checkingAuth) {
    return (
      <Flex fillWidth paddingY="128" horizontal="center">
        <Spinner />
      </Flex>
    );
  }

  if (isProtected && !isAuthenticated) {
    return (
      <Column paddingY="128" maxWidth={24} gap="24" center>
        <Heading align="center" wrap="balance">
          This page is password protected
        </Heading>
        <Column fillWidth gap="8" horizontal="center">
          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorMessage={error}
          />
          <Button onClick={handlePasswordSubmit}>Submit</Button>
        </Column>
      </Column>
    );
  }

  return <>{children}</>;
};

export { RouteGuard };
