import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { AccountNav } from "@/components/AccountPage";
import { ClubMember } from "@/components/club/ClubMember";
import { ClubPublic } from "@/components/club/ClubPublic";

export const metadata: Metadata = {
  title: "Members only",
  description: "The Vis Naturæ membership: free to join, points on every order, three rooms and rewards. Members Only, the subscription, goes entirely to the wild.",
};

/**
 * Signed in, the member's own page; otherwise what the club is and how to join. The server reads the sign-in flag in
 * the same response, so a member never sees the public page first. If the sign-in has lapsed, the member page's first
 * call clears it and refreshes into the public page.
 */
async function Club() {
  const signedIn = (await cookies()).get("vn_signed_in")?.value === "1";
  return signedIn ? (
    <>
      <AccountNav current="/members" />
      <ClubMember />
    </>
  ) : (
    <ClubPublic />
  );
}

export default function MembersPage() {
  return (
    <Suspense fallback={<section className="min-h-[100svh]" aria-busy="true" />}>
      <Club />
    </Suspense>
  );
}
