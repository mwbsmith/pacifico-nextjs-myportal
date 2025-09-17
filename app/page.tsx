"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff } from "lucide-react"
import { GallerySection } from "@/components/gallery-section"
import { CalendarSection } from "@/components/calendar-section"
import { DownloadsSection } from "@/components/downloads-section"
import { ProfileSection } from "@/components/profile-section"
import Image from "next/image"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === "parent" && password === "pacifico2024") {
      setIsAuthenticated(true)
      setError("")
    } else {
      setError("Invalid username or password. Please try again.")
    }
  }

  if (isAuthenticated) {
    return <ParentPortal />
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image src="/pacifico-logo.png" alt="Pacifico Logo" width={120} height={120} className="rounded-full" />
          </div>
          <CardTitle className="text-2xl font-bold text-balance text-white">My Pacifico</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-200">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="border-slate-600 bg-slate-800 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-200">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="border-slate-600 bg-slate-800 text-white placeholder:text-slate-400"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-slate-700 text-slate-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Access Portal
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function ParentPortal() {
  const [activeSection, setActiveSection] = useState("gallery")
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image src="/pacifico-logo.png" alt="Pacifico Logo" width={32} height={32} className="rounded-full" />
              <h1 className="text-xl font-bold text-white">My Pacifico</h1>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors ${
                  activeSection === "profile" || showProfileDropdown
                    ? "border-blue-400 bg-blue-400/20"
                    : "border-slate-400 bg-slate-600 hover:bg-slate-500"
                }`}
                title="Profile Menu"
              >
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveSection("profile")
                        setShowProfileDropdown(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Profile
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      {showProfileDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowProfileDropdown(false)} />}
      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "gallery", label: "Gallery" },
              { id: "calendar", label: "Calendar" },
              { id: "downloads", label: "Downloads" },
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === section.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === "gallery" && <GallerySection />}
        {activeSection === "calendar" && <CalendarSection />}
        {activeSection === "downloads" && <DownloadsSection />}
        {activeSection === "profile" && <ProfileSection />}
      </main>
    </div>
  )
}
