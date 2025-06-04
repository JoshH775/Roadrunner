import { PersonStanding } from "lucide-react";
import Button from "./UI/Button";

export default function Header() {
  return (
    <header className="w-full border-b flex items-center justify-center border-gray-300 py-5 shadow-lg">
      <div className="container flex gap-2 items-center justify-between lg:p-0 px-6">
        <p className="lg:text-4xl text-2xl font-bold italic">Roadrunner</p>
        <Button>
          <PersonStanding />
          Manage Friends
        </Button>
      </div>
    </header>
  );
}
