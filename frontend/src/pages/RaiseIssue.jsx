import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, Camera, Users, Clock, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react"
// import Link from "react-router-dom"


const mockIssues = [
  {
    id: "1",
    title: "Food shortage in Dharavi slums",
    description: "Over 200 families have been without proper meals for 3 days due to supply chain disruption.",
    location: "Dharavi, Mumbai",
    severity: "critical",
    status: "verified",
    reportedBy: "Priya Sharma",
    reportedAt: "2024-01-15T10:30:00Z",
    verifications: 5,
    requiredVerifications: 3,
    category: "Community Shortage",
    peopleAffected: 200,
  },
  {
    id: "2",
    title: "School meal program suspended",
    description: "Local school unable to provide mid-day meals to 150 children due to funding issues.",
    location: "Sector 15, Noida",
    severity: "high",
    status: "in-progress",
    reportedBy: "Rajesh Kumar",
    reportedAt: "2024-01-14T14:20:00Z",
    verifications: 3,
    requiredVerifications: 3,
    category: "Educational Institution",
    peopleAffected: 150,
  },
  {
    id: "3",
    title: "Elderly care home needs support",
    description: "Care home running low on nutritious food supplies for 45 elderly residents.",
    location: "Lajpat Nagar, Delhi",
    severity: "medium",
    status: "pending",
    reportedBy: "Anita Gupta",
    reportedAt: "2024-01-13T09:15:00Z",
    verifications: 1,
    requiredVerifications: 3,
    category: "Care Facility",
    peopleAffected: 45,
  },
]

const RaiseIssue = () => {
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    phone: "",
    email: "",
    location: "",
    category: "",
    severity: "",
    peopleAffected: "",
    description: "",
    urgency: "",
  })

  const [setCurrentLocation] = useState("")

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setCurrentLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
          setFormData((prev) => ({ ...prev, location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }))
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "verified":
        return "bg-purple-100 text-purple-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d6efd9] to-white">
      {/* Background Image */}
      <div className="fixed inset-0 opacity-10 bg-cover bg-center" style={{ backgroundImage: "url(/issue-bg.png)" }} />

      {/* Header */}
      <div className="relative z-10 bg-white/90 backdrop-blur-sm border-b border-[#80af81]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* <Link to="/" className="flex items-center space-x-2 text-[#518d4f] hover:text-[#195319]">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link> */}
            </div>
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="अन्न Seva Logo" width={32} height={32} />
              <span className="text-lg font-bold text-[#195319]">अन्न Seva</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Report Form */}
          <div>
            <Card className="border-[#80af81]">
              <CardHeader className="bg-[#518d4f] text-white">
                <CardTitle className="text-2xl flex items-center space-x-2">
                  <AlertTriangle className="w-6 h-6" />
                  <span>Report Food Shortage</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Issue Title *</Label>
                    <Input
                      id="title"
                      placeholder="Brief description of the issue"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="community">Community Shortage</SelectItem>
                        <SelectItem value="school">Educational Institution</SelectItem>
                        <SelectItem value="care-facility">Care Facility</SelectItem>
                        <SelectItem value="individual">Individual/Family</SelectItem>
                        <SelectItem value="disaster">Disaster Relief</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="location"
                      placeholder="Address or coordinates"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={getCurrentLocation}
                      className="border-[#80af81] text-[#518d4f] bg-transparent"
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="severity">Severity Level *</Label>
                    <Select onValueChange={(value) => handleInputChange("severity", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Can wait 1-2 days</SelectItem>
                        <SelectItem value="medium">Medium - Need help within 24 hours</SelectItem>
                        <SelectItem value="high">High - Urgent, need help today</SelectItem>
                        <SelectItem value="critical">Critical - Emergency situation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="peopleAffected">People Affected *</Label>
                    <Input
                      id="peopleAffected"
                      type="number"
                      placeholder="Number of people"
                      value={formData.peopleAffected}
                      onChange={(e) => handleInputChange("peopleAffected", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Detailed Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about the food shortage situation, including duration, specific needs, and any other relevant details..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="images">Upload Images (Optional)</Label>
                  <div className="mt-2">
                  </div>
                </div>

                <Button className="w-full bg-[#518d4f] hover:bg-[#195319] text-white py-3">Submit Report</Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Issues & Community Verification */}
          <div className="space-y-6">
            <Card className="border-[#80af81]">
              <CardHeader className="bg-[#80af81] text-white">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Recent Community Reports</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {mockIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="border border-[#d6efd9] rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-[#195319] text-sm">{issue.title}</h3>
                        <div className={`w-3 h-3 rounded-full ${getSeverityColor(issue.severity)}`} />
                      </div>

                      <p className="text-sm text-[#518d4f] mb-3 line-clamp-2">{issue.description}</p>

                      <div className="flex items-center justify-between text-xs text-[#518d4f] mb-2">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{issue.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{issue.peopleAffected} affected</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(issue.status)}>{issue.status.replace("-", " ")}</Badge>

                        <div className="flex items-center space-x-2">
                          <div className="flex items-center space-x-1 text-xs text-[#518d4f]">
                            <CheckCircle className="w-3 h-3" />
                            <span>
                              {issue.verifications}/{issue.requiredVerifications} verified
                            </span>
                          </div>
                          {issue.verifications < issue.requiredVerifications && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs border-[#80af81] text-[#518d4f] bg-transparent"
                            >
                              Verify
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#80af81]">
              <CardHeader className="bg-[#d6efd9]">
                <CardTitle className="text-[#195319] flex items-center space-x-2">
                  <Clock className="w-5 h-5" />
                  <span>How Community Verification Works</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 text-sm text-[#518d4f]">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#518d4f] text-white rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-[#195319]">Report Submitted</p>
                      <p>Your report is immediately visible to the community</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#518d4f] text-white rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-[#195319]">Community Verification</p>
                      <p>Local community members verify the authenticity (3 verifications needed)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#518d4f] text-white rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-[#195319]">NGO Response</p>
                      <p>Verified reports are forwarded to nearby NGOs and suppliers</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#518d4f] text-white rounded-full flex items-center justify-center text-xs font-bold">
                      4
                    </div>
                    <div>
                      <p className="font-medium text-[#195319]">Help Delivered</p>
                      <p>Food assistance is coordinated and delivered to the location</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


export default RaiseIssue