"use client";

import { useEffect, useState } from "react";

export default function YearsServing({ since }: { since: string }) {
  const calculateYears = () => new Date().getFullYear() - Number(since);
  const [years, setYears] = useState(calculateYears);

  useEffect(() => {
    setYears(calculateYears());
  }, [since]);

  return <span suppressHydrationWarning>{years}</span>;
}
