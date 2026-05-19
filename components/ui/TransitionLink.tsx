"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function TransitionLink({ href, children, className, style }: Props) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (!document.startViewTransition) return;
    e.preventDefault();
    document.startViewTransition(() => {
      router.push(href);
    });
  };

  return (
    <Link href={href} className={className} style={style} onClick={handleClick}>
      {children}
    </Link>
  );
}
