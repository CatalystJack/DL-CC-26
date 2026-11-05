import { useEffect, useState, type FormEvent } from "react";
import { Link } from "wouter";
import { Loader2, UserRoundPlus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AccountManager = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  brokerage: string;
  status: string;
  inviteDraftedAt: string | null;
  userId: string | null;
};
type ManagerSaveResult = {
  accountManager: AccountManager;
  setPasswordUrl?: string | null;
  emailSent?: false;
};
type ManagedProfile = {
  id: string;
  companyName: string;
  accountManagerUserId: string | null;
  isDemoAccount: boolean;
};

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data as T;
}

export default function AdminAccountManagers() {
  const [rows, setRows] = useState<AccountManager[]>([]);
  const [accounts, setAccounts] = useState<ManagedProfile[]>([]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [brokerage, setBrokerage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draftingId, setDraftingId] = useState("");
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [setPasswordUrl, setSetPasswordUrl] = useState("");

  const reload = async () => {
    setLoading(true);
    try {
      const result = await api<{ accountManagers: AccountManager[]; accounts: ManagedProfile[] }>("/api/admin/account-managers");
      setRows(result.accountManagers);
      setAccounts(result.accounts || []);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load account managers");
    } finally {
      setLoading(false);
    }
  };

  const provision = async (row: AccountManager) => {
    setError("");
    setNotice("");
    try {
      const result = await api<{ setPasswordUrl?: string | null; alreadyProvisioned: boolean; emailSent: false }>(
        `/api/admin/account-managers/${encodeURIComponent(row.id)}/provision`,
        { method: "POST" },
      );
      setSetPasswordUrl(result.setPasswordUrl || "");
      setNotice(result.alreadyProvisioned
        ? "Password reset link prepared. No email was sent."
        : "Account activated and set-password link prepared. No email was sent.");
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not provision manager login");
    }
  };

  const assignAccount = async (profileId: string, accountManagerUserId: string) => {
    try {
      await api(`/api/admin/account-managers/${encodeURIComponent(accountManagerUserId || "unassigned")}/accounts/${encodeURIComponent(profileId)}`, {
        method: "PUT",
        body: JSON.stringify({ accountManagerUserId: accountManagerUserId || null }),
      });
      setAccounts((current) => current.map((account) => account.id === profileId
        ? { ...account, accountManagerUserId: accountManagerUserId || null }
        : account));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not assign account");
    }
  };

  useEffect(() => { void reload(); }, []);

  const create = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    setSetPasswordUrl("");
    try {
      const result = await api<ManagerSaveResult>(
        editingId ? `/api/admin/account-managers/${encodeURIComponent(editingId)}` : "/api/admin/account-managers",
        {
        method: editingId ? "PATCH" : "POST",
        body: JSON.stringify({ firstName, lastName, email, brokerage }),
      });
      setRows((existing) => editingId
        ? existing.map((row) => row.id === editingId ? result.accountManager : row)
        : [...existing, result.accountManager]);
      if (!editingId && result.setPasswordUrl) setSetPasswordUrl(result.setPasswordUrl);
      setFirstName("");
      setLastName("");
      setEmail("");
      setBrokerage("");
      setEditingId("");
      setNotice(editingId
        ? "Manager profile updated."
        : "Login created. No email or invite was sent. Copy the set-password link now.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save manager profile");
    } finally {
      setSaving(false);
    }
  };

  const draftInvite = async (id: string) => {
    setDraftingId(id);
    setError("");
    setNotice("");
    try {
      const result = await api<{ accountManager: { id: string; inviteDraftedAt: string } }>(
        `/api/admin/account-managers/${encodeURIComponent(id)}/invite-draft`,
        { method: "POST" },
      );
      setRows((existing) => existing.map((row) => row.id === id
        ? { ...row, inviteDraftedAt: result.accountManager.inviteDraftedAt }
        : row));
      setNotice("Login invite draft recorded. Nothing was sent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not draft login invite");
    } finally {
      setDraftingId("");
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F8FB] px-4 py-7 font-sans text-[#000914] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4A90E2]">Development only</p>
            <h1 className="mt-1 text-2xl font-semibold">Account managers</h1>
            <p className="mt-1 text-sm text-slate-600">Create managers from any brokerage. Accounts are provisioned without email and require a password reset at first sign-in.</p>
          </div>
          <Link href="/admin/investment-companies"><Button variant="outline">Investment Companies</Button></Link>
        </div>
        {error && <p role="alert" className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p>}
        {notice && <p role="status" className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
        {setPasswordUrl && <Card className="mb-5 border-amber-300 bg-amber-50">
          <CardContent className="space-y-2 p-4">
            <p className="font-semibold text-amber-950">Set-password link</p>
            <p className="text-sm text-amber-900">This link expires after 60 minutes. It is not emailed. Share it only through Jack's approved channel.</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input readOnly value={setPasswordUrl} aria-label="Set-password link" autoComplete="off" />
              <Button type="button" variant="outline" onClick={() => void navigator.clipboard.writeText(setPasswordUrl)}>Copy link</Button>
              <Button type="button" variant="outline" onClick={() => setSetPasswordUrl("")}>Hide</Button>
            </div>
          </CardContent>
        </Card>}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,.85fr)]">
          <section className="space-y-3">
            <h2 className="font-semibold">Manager directory</h2>
            {loading ? (
              <Card><CardContent className="flex items-center gap-2 py-10 text-slate-500"><Loader2 className="h-4 w-4 animate-spin" />Loading</CardContent></Card>
            ) : rows.length === 0 ? (
              <Card><CardContent className="py-10 text-center text-slate-500">No manager profiles yet.</CardContent></Card>
            ) : rows.map((row) => (
              <Card key={row.id}>
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <h3 className="font-semibold">{row.firstName} {row.lastName}</h3>
                    <p className="break-all text-sm text-slate-600">{row.email}</p>
                    <p className="text-sm text-slate-500">{row.brokerage} · {row.status}</p>
                    {row.inviteDraftedAt && <p className="mt-1 text-xs text-sky-700">Draft recorded {new Date(row.inviteDraftedAt).toLocaleString()} · not sent</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="min-h-10" onClick={() => void provision(row)}>
                      {row.userId ? "Prepare set-password link" : "Create DEV login"}
                    </Button>
                    <Button variant="outline" className="min-h-10" disabled={!!row.userId} onClick={() => {
                      setEditingId(row.id);
                      setFirstName(row.firstName);
                      setLastName(row.lastName);
                      setEmail(row.email);
                      setBrokerage(row.brokerage);
                    }}>Edit</Button>
                    <Button
                      variant="outline"
                      className="min-h-10"
                      disabled={draftingId === row.id || !!row.userId}
                      onClick={() => void draftInvite(row.id)}
                    >
                      {draftingId === row.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                      Draft login invite
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          <section className="lg:col-span-2">
            <Card>
              <CardHeader><CardTitle>Acquisition account assignments</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {accounts.map((account) => (
                  <div key={account.id} className="grid gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-[minmax(0,1fr)_minmax(220px,.7fr)] sm:items-center">
                    <div className="min-w-0">
                      <p className="font-medium">{account.companyName}{account.isDemoAccount ? " · Demo" : ""}</p>
                    </div>
                    <select
                      aria-label={`Account manager for ${account.companyName}`}
                      className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm"
      value={account.accountManagerUserId || ""}
                      onChange={(event) => void assignAccount(account.id, event.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {rows.filter((manager) => manager.userId && manager.status === "active").map((manager) => (
                      <option key={manager.id} value={manager.userId || ""}>{manager.firstName} {manager.lastName}</option>
                      ))}
                    </select>
                  </div>
                ))}
                {!accounts.length && <p className="text-sm text-slate-500">No acquisition accounts are available.</p>}
              </CardContent>
            </Card>
          </section>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><UserRoundPlus className="h-5 w-5 text-[#4A90E2]" />{editingId ? "Edit manager profile" : "New manager profile"}</CardTitle></CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={create}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2"><Label htmlFor="manager-first">First name</Label><Input id="manager-first" required maxLength={80} value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
                  <div className="space-y-2"><Label htmlFor="manager-last">Last name</Label><Input id="manager-last" required maxLength={80} value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
                </div>
                <div className="space-y-2"><Label htmlFor="manager-email">Work email</Label><Input id="manager-email" type="email" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
                <div className="space-y-2"><Label htmlFor="manager-brokerage">Brokerage</Label><Input id="manager-brokerage" required maxLength={120} value={brokerage} onChange={(e) => setBrokerage(e.target.value)} /></div>
                <Button className="w-full bg-[#0A2B4A] text-white hover:bg-white hover:text-[#4A90E2]" disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserRoundPlus className="mr-2 h-4 w-4" />}
                  {editingId ? "Update draft profile" : "Save draft profile"}
                </Button>
                {editingId && <Button type="button" variant="outline" className="w-full" onClick={() => {
                  setEditingId("");
                  setFirstName("");
                  setLastName("");
                  setEmail("");
                  setBrokerage("");
                }}>Cancel edit</Button>}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
