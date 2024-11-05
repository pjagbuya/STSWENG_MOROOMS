'use client';

import { Button } from './ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HeaderNavLink({ children, link }) {
  const pathname = usePathname();

  const isCurrent = pathname === link;
  const bgClass = isCurrent
    ? 'bg-gradient-to-r from-[#203A5F] to-[#4278C5]'
    : 'bg-[#0F172A]';

  return (
    <Button
      asChild
      className={`px-6 py-1 hover:bg-[#1a2747] active:brightness-75 ${bgClass}`}
    >
      <Link href={link}>{children}</Link>
    </Button>
  );
}
//test
