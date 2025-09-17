"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Phone, MapPin, Users } from "lucide-react"

export function ProfileSection() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    emergencyContact: "",
    emergencyPhone: "",
    relationship: "",
    notes: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log("Saving profile:", profile)
    alert("Profile saved successfully!")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">My Profile</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profile.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profile.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={profile.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter street address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={profile.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Enter city"
              />
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Contact Name</Label>
              <Input
                id="emergencyContact"
                value={profile.emergencyContact}
                onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                placeholder="Enter emergency contact name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Contact Phone</Label>
              <Input
                id="emergencyPhone"
                type="tel"
                value={profile.emergencyPhone}
                onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                placeholder="Enter emergency contact phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Select value={profile.relationship} onValueChange={(value) => handleInputChange("relationship", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Additional Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={profile.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional information or special notes..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end pt-6">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          Save Profile
        </Button>
      </div>
    </div>
  )
}
