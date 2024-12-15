"use client";

import Link from "next/link";
import { titleFont } from "@/config/fonts";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import { useCartStore, useUIStore } from "@/store";
import { useEffect, useState } from "react";

export const TopMenu = () => {

  const openMenu = useUIStore(state => state.openSideMenu);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const totalItemsInCart = useCartStore((state) => state.getTotalItems() );

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true)
  }, []);

  return (
    <nav className="flex px-5 justify-between items-center w-full">
      {/* Logo */}
      <div>
        <Link href={"/"}>
          <span className={`${titleFont.className} antialiased font-bold`}>
            Letschu
          </span>
          <span> | Shop</span>
        </Link>
      </div>

      {/* Center Menu */}
      <div className="hidden sm:flex items-center">
        <div
          className="relative"
          onMouseEnter={() => setIsDropdownOpen(true)}
          onMouseLeave={() => setIsDropdownOpen(false)}
        >
          <Link
            className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
            href={"/category/arnes"}
          >
            Arnes
          </Link>
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
              <Link className="block px-4 py-2 hover:bg-gray-100" href={"/category/arnes/superior"}>
                Superior
              </Link>
              <Link className="block px-4 py-2 hover:bg-gray-100" href={"/category/arnes/inferior"}>
                Inferior
              </Link>
              <Link className="block px-4 py-2 hover:bg-gray-100" href={"/category/arnes/body"}>
                Body
              </Link>
              <Link className="block px-4 py-2 hover:bg-gray-100" href={"/category/arnes/conjunto"}>
                Conjunto
              </Link>
            </div>
          )}

        </div>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href={"/category/tiradores"}
        >
          Tiradores
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href={"/category/chokers"}
        >
          Chokers
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href={"/category/ligas"}
        >
          Ligas
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href={"/category/extras"}
        >
          Extras
        </Link>
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href={"/category/envios"}
        >
          Envios
        </Link>
      </div>

      {/* Search, Cart, Menu */}
      <div className="flex items-center">
        {/* <Link className="mx-2" href="/search">
          <IoSearchOutline className="w-5 h-5" />
        </Link> */}
        <Link className="mx-2" href={
          (totalItemsInCart === 0) && loaded ? "/empty" : "/cart"
        }>
          <div className="relative">
            {
              (loaded && totalItemsInCart > 0) && (
                <span className="fade-in absolute text-xs px-1 rounded-full font-bold -top-2 -right-2 bg-blue-700 text-white">
                  {totalItemsInCart}
                </span>
              )
            }
            <IoCartOutline className="w-5 h-5" />
          </div>
        </Link>

        <button 
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          onClick={() => openMenu()}
        >
          Menú
        </button>
      </div>
    </nav>
  );
};
