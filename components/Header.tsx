"use client";

import { Search, UserCircle2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSearchStore } from "@/store/searchStore";

function Header() {
  const [searchString, setSearchString] = useSearchStore((state) => [
    state.searchString,
    state.setSearchString,
  ]);

  return (
    <header>
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-400/10 rounder-b-2xl">
        {/*Gradient Effect Div*/}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-[#DCCCA3] to-[#A5D8FF] rounded-md filter blur-3xl opacity-50 -z-50" />
        <Image
          src="/logo.svg"
          alt="Synch Logo"
          width={300}
          height={100}
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
        />
        <div className="flex items-center space-x-5 flex-1 w-full justify-end">
          {/* Search */}
          <form className="flex items-center space-x-5 bg-white rounded-md shadow-md flex-1 md:flex-initial">
            <Search className="text-gray-400 ml-2" />
            <input
              type="text"
              placeholder="Search...."
              className="flex-1 outline-none p-3"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>
          {/* Avatar */}

          <Avatar>
            <AvatarImage
              src="https://github.com/nemesisLW.png"
              alt="@nemesislw"
            />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Summary*/}
      <div className="flex items-center justify-center px-5 py-2 md:py-5">
        <p className="flex items-center text-sm font-light pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl ">
          <UserCircle2 className="inline-block h-10 w-10 mr-1 px-1" />
          Summarized text here
        </p>
      </div>
    </header>
  );
}

export default Header;
