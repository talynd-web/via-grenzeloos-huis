import { Link, Outlet } from "react-router-dom";
import { CalendarDays, LogOut, Mail, MapPin, Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { NavLink } from "@/components/NavLink";
import { PLAN_GESPREK_URL } from "@/lib/links";

const navItems = [
  { to: "/spanje", label: "Spanje" },
  { to: "/dubai", label: "Dubai" },
  { to: "/quiz", label: "Oriëntatie" },
  { to: "/login", label: "Login" },
];

const SiteLayout = () => {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3" aria-label="VIA Vastgoed home">
            <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-primary text-sm font-semibold tracking-wide text-primary-foreground">
              VIA
            </span>
            <span className="hidden text-sm font-semibold uppercase tracking-[0.18em] text-primary sm:inline">
              Vastgoed
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" aria-label="Hoofdnavigatie">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
                activeClassName="text-primary"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button asChild variant="ghost" className="hidden sm:inline-flex">
                  <Link to="/profiel">Profiel</Link>
                </Button>
                <Button variant="outline" size="icon" onClick={signOut} aria-label="Uitloggen">
                  <LogOut />
                </Button>
              </>
            ) : (
              <Button asChild className="hidden sm:inline-flex">
                <a href={PLAN_GESPREK_URL} target="_blank" rel="noreferrer">
                  Plan gesprek
                </a>
              </Button>
            )}
            <Button asChild size="icon" variant="outline" className="md:hidden" aria-label="Open navigatie">
              <Link to="/plan-gesprek">
                <Menu />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div>
            <div className="mb-4 text-xl font-semibold">VIA Vastgoed</div>
            <p className="max-w-xs text-sm leading-6 text-primary-foreground/75">
              Rustige begeleiding bij vastgoedoriëntatie buiten Nederland.
            </p>
          </div>
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-accent">Adres</h2>
            <p className="flex gap-3 text-sm leading-6 text-primary-foreground/80">
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-accent" />
              <span>Eerste Jan van der Heijdenstraat 106-O<br />1072 VB Amsterdam</span>
            </p>
          </div>
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-accent">Openingstijden</h2>
            <p className="flex gap-3 text-sm leading-6 text-primary-foreground/80">
              <CalendarDays className="mt-1 h-4 w-4 shrink-0 text-accent" />
              <span>Maandag t/m vrijdag<br />09:00 – 18:00<br />Zaterdag<br />09:00 – 12:00<br />Zondag<br />Alleen op afspraak</span>
            </p>
          </div>
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-accent">Contact</h2>
            <div className="space-y-3 text-sm text-primary-foreground/80">
              <a className="flex items-center gap-3 transition-colors hover:text-accent" href="mailto:info@viavastgoed.com">
                <Mail className="h-4 w-4" /> info@viavastgoed.com
              </a>
              <a className="flex items-center gap-3 transition-colors hover:text-accent" href="tel:+31853035281">
                <Phone className="h-4 w-4" /> +31 85 303 52 81
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SiteLayout;
