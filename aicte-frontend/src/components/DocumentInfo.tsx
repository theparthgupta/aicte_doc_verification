"use client"

import React, { useState, useEffect } from "react"
import { Search, Bell, BarChart2, Users, FileText, Settings, HelpCircle, ChevronRight, Plus, Loader2 } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useInstituteStore } from "@/hooks/useInstituteData"
import { useApplicationGet } from "@/hooks/useApplication"
import ApplicationModal from "@/components/ApplicationModal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type ApplicationDocument = {
  document_id: string
  document_name: string
  errors?: Record<string, any>[]
  user_document_uri?: string
  format_uri: string
  timestamp: Date
  status: "approved" | "not approved"
}

type Application = {
  application_id: string
  application_name: string
  application_description: string
  application_type: string
  documents: ApplicationDocument[]
}

const getApplicationStatus = (documents: ApplicationDocument[]): string => {
  const approvedCount = documents.filter((doc) => doc.status === "approved").length
  if (approvedCount === documents.length) return "Approved"
  if (approvedCount > 0) return "In Progress"
  return "Not Started"
}

const SidebarIcon: React.FC<{ icon: React.ElementType, active?: boolean }> = ({ icon: Icon, active }) => (
  <div className={`p-3 rounded-lg ${active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}>
    <Icon className="h-5 w-5" />
  </div>
)

const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)
  const { instituteId } = useInstituteStore()
  const { mutateAsync: getApplication, isPending } = useApplicationGet()

  useEffect(() => {
    const fetchApplications = async () => {
      const data = await getApplication(instituteId as string)
      setApplications(data.data)
    }
    fetchApplications()
  }, [getApplication, instituteId])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredApplications = applications.filter((app) =>
    app.application_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalApplications = applications.length
  const approvedApplications = applications.filter(app => getApplicationStatus(app.documents) === "Approved").length
  const inProgressApplications = applications.filter(app => getApplicationStatus(app.documents) === "In Progress").length

  const chartData = [
    { name: 'Mon', applications: 4 },
    { name: 'Tue', applications: 3 },
    { name: 'Wed', applications: 2 },
    { name: 'Thu', applications: 6 },
    { name: 'Fri', applications: 5 },
    { name: 'Sat', applications: 3 },
    { name: 'Sun', applications: 1 },
  ]

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-16 bg-card border-r flex flex-col items-center py-4 space-y-4">
        <SidebarIcon icon={BarChart2} active />
        <SidebarIcon icon={FileText} />
        <SidebarIcon icon={Users} />
        <SidebarIcon icon={Settings} />
        <div className="mt-auto">
          <SidebarIcon icon={HelpCircle} />
        </div>
      </aside>
      <main className="flex-1 overflow-hidden">
        <header className="bg-background border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Hello, Admin!</h1>
            <p className="text-muted-foreground">Explore information and activity about your applications</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search Anything..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 w-64"
              />
            </div>
            <Button size="icon" variant="ghost">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <div className="p-6 space-y-6 overflow-auto h-[calc(100vh-5rem)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalApplications}</div>
                <p className="text-xs text-muted-foreground">
                  +20% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{approvedApplications}</div>
                <p className="text-xs text-muted-foreground">
                  +15% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressApplications}</div>
                <p className="text-xs text-muted-foreground">
                  +5% from last month
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Application Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="applications" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[200px]">
                  {filteredApplications.slice(0, 5).map((app) => (
                    <div key={app.application_id} className="flex items-center space-x-4 mb-4">
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">{app.application_name}</p>
                        <p className="text-sm text-muted-foreground">{app.application_type}</p>
                      </div>
                      <Badge variant={getApplicationStatus(app.documents) === "Approved" ? "success" : "warning"}>
                        {getApplicationStatus(app.documents)}
                      </Badge>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Applications</CardTitle>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Application
              </Button>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-4">
                  {filteredApplications.map((app) => (
                    <div key={app.application_id} className="flex items-center justify-between p-4 bg-accent rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{app.application_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{app.application_name}</p>
                          <p className="text-sm text-muted-foreground">{app.application_type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={getApplicationStatus(app.documents) === "Approved" ? "success" : "warning"}>
                          {getApplicationStatus(app.documents)}
                        </Badge>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedApplication(app)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </main>
      {selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  )
}

export default ApplicationsPage
