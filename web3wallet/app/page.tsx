import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div>
      <Button asChild>
        <Link href="/wallet">Create Wallet</Link>
      </Button>
    </div>
  );
};

export default page;
