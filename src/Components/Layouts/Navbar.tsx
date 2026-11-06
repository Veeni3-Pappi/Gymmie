import { Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../UI/Button";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/80 bakdrop ">
      <div className=" max-w-6xl mx-auto px-6 h-16 text-[var(--color-foreground)] flex  items-center  justify-between" >
        <Link to="/"
        className="flex items-center gap-2  text-[var(--color-foreground)]"
        >
        <Dumbbell className="w-6 h-6 text-[var(--color-accent)]"/>
        <span className="font-semibold text-lg"> Gymmie</span>
         </Link>

         <nav>
                {user ? (
                  <>
                    <Link to="/profile">
                      <Button>Profile</Button>
                    </Link>
                    <Link to="/Account/profile">
                      <Button>Account</Button>
                    </Link>
                  </>
                ) : (
                  <div className="flex items-center gap-4">
                    <Link to="/auth/sign-in">
                      <Button>Sign in</Button>
                    </Link>
                    <Link to="/auth/sign-up">
                      <Button>Sign up</Button>
                    </Link>
                  </div>
                )}
         </nav>
      </div>
    </header>
  );
}
 