import Image from "next/image";
import Link from "next/link";
import React from "react";
import { signOut } from "@/auth";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="my-10 flex justify-between gap-5">
      <Link href={"/"}>
        <Image
          src={"/icons/logo.svg"}
          alt="Logo"
          width={40}
          height={40}
        ></Image>
      </Link>
      <ul className="flex flex-row items-center gap-8">
        <li>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
            className="mb-10"
          >
            <Button>Log Out</Button>
          </form>
          {/* <Link href="/my-profile" className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>V</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-white">Vincent</span>
          </Link> */}
        </li>
      </ul>
    </header>
  );
};

export default Header;
