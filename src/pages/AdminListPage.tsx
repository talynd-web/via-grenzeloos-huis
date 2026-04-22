import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type AdminUser = {
  user_id: string;
  full_name: string | null;
  email: string | null;
  role: "prospect" | "client" | "admin";
  created_at: string;
  has_quiz: boolean;
};

const formatDate = (value: string) => new Intl.DateTimeFormat("nl-NL", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));

const RoleBadge = ({ role }: { role: AdminUser["role"] }) => (
  <Badge className={cn(role === "prospect" && "bg-muted text-muted-foreground hover:bg-muted", role === "client" && "bg-accent text-accent-foreground hover:bg-accent", role === "admin" && "bg-primary text-primary-foreground hover:bg-primary")}>{role}</Badge>
);

const AdminListPage = () => {
  const [query, setQuery] = useState("");
  const [clientsOnly, setClientsOnly] = useState(false);

  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await (supabase as any).rpc("get_admin_user_list");
      if (error) throw error;
      return (data ?? []) as AdminUser[];
    },
  });

  const filteredUsers = useMemo(() => {
    const term = query.toLowerCase().trim();
    return (usersQuery.data ?? []).filter((user) => {
      const matchesRole = !clientsOnly || user.role === "client";
      const matchesSearch = !term || user.full_name?.toLowerCase().includes(term) || user.email?.toLowerCase().includes(term);
      return matchesRole && matchesSearch;
    });
  }, [clientsOnly, query, usersQuery.data]);

  return (
    <section className="bg-background px-5 py-12 sm:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-accent">Admin</p>
          <h1 className="text-4xl font-semibold text-primary sm:text-5xl">Accountbeheer</h1>
          <p className="mt-4 text-muted-foreground">Beheer prospects, klanten, rollen en trajectinformatie vanuit de app.</p>
        </header>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Zoek op naam of e-mail" value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <Button type="button" variant={clientsOnly ? "default" : "outline"} onClick={() => setClientsOnly((current) => !current)}>
            Alleen klanten
          </Button>
        </div>

        <div className="border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Naam</TableHead><TableHead>E-mail</TableHead><TableHead>Rol</TableHead><TableHead>Quiz ingevuld</TableHead><TableHead>Aangemaakt</TableHead><TableHead>Actie</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell className="font-medium text-primary">{user.full_name || "Naam onbekend"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell><RoleBadge role={user.role} /></TableCell>
                  <TableCell>{user.has_quiz ? "Ja" : "Nee"}</TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell><Button asChild size="sm" variant="outline"><Link to={`/admin/klanten/${user.user_id}`}>Beheer</Link></Button></TableCell>
                </TableRow>
              ))}
              {!filteredUsers.length && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Geen accounts gevonden.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
};

export default AdminListPage;