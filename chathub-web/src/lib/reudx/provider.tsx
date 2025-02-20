"use client";

import { useEffect, useState } from "react";
import { store } from "./store";
import { Provider } from "react-redux";
import { setUser } from "./authSlice";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const response = await fetch("/api/auth", { credentials: "include" });
        if (response.ok) {
          const data = await response.json();
          if (data.token) {
            store.dispatch(setUser({ userId: data.userId ? Number(data.userId) : null, token: data.token }));
          }
        }
      } catch (error) {
        console.error("Error fetching auth data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return <Provider store={store}>{children}</Provider>;
}
