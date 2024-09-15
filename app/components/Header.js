import { Home, Settings, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <div className="w-64 border-r bg-card text-card-foreground">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-primary" style={{ fontFamily: "'Inter', sans-serif" }}>StudyLink</h1>
      </div>
      <nav className="mt-6">
        <a href="#" className="flex items-center px-6 py-3 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
          <Home className="h-5 w-5 mr-3" />
          Dashboard
        </a>
        <a href="#" className="flex items-center px-6 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
          <Settings className="h-5 w-5 mr-3" />
          Settings
        </a>
        <a href="#" className="flex items-center px-6 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
          <HelpCircle className="h-5 w-5 mr-3" />
          Help
        </a>
      </nav>
    </div>
  )
}