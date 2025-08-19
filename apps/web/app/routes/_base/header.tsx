import { Link } from "react-router";

import { Logo } from "~/primitives/brand";
import { Button } from "~/ui/button";

export function Header() {
  return (
    <header className="bg-card border-b-2 sticky top-0">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-gray-900">
          <Logo className="h-8" />
          <span className="sr-only">Rec Sports</span>
        </Link>
        <nav>
          <Button asChild>
            <Link to="#waitlist">Join the Waitlist</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
