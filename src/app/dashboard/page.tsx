"use client"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { signOut } from "@/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { LogOut } from "lucide-react"

export default async function Dashboard() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const handleSignOut = async () => {
    
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-500 p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-white">Votre Profil</h1>
              <form action={handleSignOut}>
                <Button 
                //   variant="ghost" 
                  className="text-white hover:bg-blue-700 hover:text-white"
                  type="submit"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </form>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage 
                    src={session.user.image || ""} 
                    alt={session.user.name || "User"}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-800 text-2xl">
                    {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold text-center">
                  {session.user.name || "Utilisateur"}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  {session.user.email}
                </p>
              </div>

              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard 
                    title="Rôle" 
                    value={session.user.id || "Utilisateur standard"}
                    icon={<UserIcon />}
                  />
                  <InfoCard 
                    title="Compte créé le" 
                    value={new Date(session.user.email || Date.now()).toLocaleDateString()}
                    icon={<CalendarIcon />}
                  />
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                  <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Informations de session
                  </h3>
                  <div className="space-y-2">
                    {/* <InfoRow label="ID de session" value={session.e?.slice(0, 8) + "..."} /> */}
                    <InfoRow label="Expire le" value={new Date(session.expires).toLocaleString()} />
                    <InfoRow label="Fournisseur" value={session.user.id || "Email"} />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InfoCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-start gap-3">
      <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h4>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

// Icônes simples (vous pouvez remplacer par lucide-react ou autre)
function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  )
}