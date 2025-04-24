"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { navLinks } from '@/constants';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';

const Sidebar = () => {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  return (
    <aside className="w-72 bg-white p-5 shadow-md shadow-purple-200/50 hidden lg:flex">
      <div className="flex flex-col justify-between min-h-screen h-auto w-full">
        {/* Üst kısım: logo + nav */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="sidebar-logo">
            <Image src="/assets/images/logo-text.svg" alt="logo" width={180} height={28} />
          </Link>

          <nav className="sidebar-nav">
            <SignedIn>
              <ul className="sidebar-nav_elements flex flex-col gap-2">
                {currentPath && navLinks.map((link) => {
                  const isActive = link.route === currentPath;

                  return (
                    <li
                      key={link.route}
                      className={`sidebar-nav_element group ${
                        isActive ? 'bg-purple-gradient text-white' : 'text-gray-700'
                      }`}
                    >
                      <Link className="sidebar-link" href={link.route}>
                        <Image
                          src={link.icon}
                          alt={link.label}
                          width={28}
                          height={28}
                          className={`${isActive ? 'brightness-200' : ''}`}
                        />
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </SignedIn>
          </nav>
        </div>

        {/* Alt kısım: kullanıcı butonu ya da login */}
        <div className="pt-6">
          <SignedIn>
            <div className="flex cursor-pointer gap-2">
              <UserButton afterSignOutUrl='/' showName />
            </div>
          </SignedIn>
          <SignedOut>
            <Button asChild className="button bg-purple-gradient bg-cover w-full mt-2">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

