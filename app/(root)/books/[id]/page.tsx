import { auth } from "@/auth";
import BookCard from "@/components/BookCard";
import BookOverview from "@/components/BookOverview";
import BookVideo from "@/components/BookVideo";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  //   Fetch data based on id
  const [bookdDetails] = await db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1);
  if (!bookdDetails) redirect("/404");
  return (
    <>
      <BookOverview
        {...bookdDetails}
        userId={session?.user?.id as string}
      ></BookOverview>
      <div className="book-details">
        <div className="flex-[1.5]">
          <section className="flex flex-col gap-7">
            <h3>Video</h3>
            <BookVideo videoUrl={bookdDetails.videoUrl}></BookVideo>
          </section>
          <section className="mt-10 flex flex-col gap-7">
            <h3>Summary</h3>
            <div className="space-y-5 text-xl text-light-100">
              {bookdDetails.summary.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>
        </div>
        {/* SIMILAR */}
      </div>
    </>
  );
};

export default page;
