import BookList from "@/components/BookList";
import { sampleBooks } from "@/constants";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc } from "drizzle-orm";
import React from "react";

const page = async () => {
  const latestBooks = (await db
    .select()
    .from(books)
    .limit(10)
    .orderBy(desc(books.createdAt))) as Book[];
  return (
    <>
      <BookList title="Borrowed Books" books={latestBooks}></BookList>
    </>
  );
};

export default page;
