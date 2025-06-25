'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { UserCheck, Building, Search, CheckCircle, XCircle, BarChart, Users, School, Bell, Menu } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
// Mock data for evaluators and institutes
const evaluators = [
  { id: 1, name: "Dr. John Doe", email: "john.doe@example.com", status: "Pending", specialization: "Computer Science", experience: "10 years" },
  { id: 2, name: "Prof. Jane Smith", email: "jane.smith@example.com", status: "Pending", specialization: "Electrical Engineering", experience: "15 years" },
  { id: 3, name: "Dr. Robert Johnson", email: "robert.johnson@example.com", status: "Pending", specialization: "Mechanical Engineering", experience: "12 years" },
]

const institutes = [
  { id: 1, name: "Tech University", email: "admin@techuniversity.edu", type: "University", status: "Pending", address: "123 Tech Street, Tech City", phone: "+1234567890" },
  { id: 2, name: "Engineering College", email: "info@engcollege.edu", type: "Affiliated College", status: "Pending", address: "456 Engineering Avenue, Eng Town", phone: "+9876543210" },
  { id: 3, name: "Polytechnic Institute", email: "contact@polytech.edu", type: "Polytechnic", status: "Pending", address: "789 Poly Road, Poly Village", phone: "+1122334455" },
]

export default function AdminPortal() {
  const [activeView, setActiveView] = useState('evaluators')
  const [selectedItem, setSelectedItem] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredData, setFilteredData] = useState(evaluators)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    const data = activeView === 'evaluators' ? evaluators : institutes
    setFilteredData(data.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  }, [activeView, searchTerm])

  const handleViewDetails = (item) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  const handleApprove = () => {
    console.log(`Approved: ${selectedItem.name}`)
    setIsDialogOpen(false)
  }

  const handleReject = () => {
    console.log(`Rejected: ${selectedItem.name}`)
    setIsDialogOpen(false)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-50 text-gray-900 w-screen">
        <motion.div
          initial={{ x: -250 }}
          animate={{ x: isSidebarOpen ? 0 : -250 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-white shadow-lg"
        >
          <Sidebar className="w-64 bg-white">
            <SidebarHeader>
              <div className="p-4 flex items-center space-x-2">
                <School className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-800">AICTE Admin</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveView('evaluators')}
                    className={`${activeView === 'evaluators' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'} transition-colors duration-200`}
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    <span>Evaluator Requests</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setActiveView('institutes')}
                    className={`${activeView === 'institutes' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'} transition-colors duration-200`}
                  >
                    <Building className="mr-2 h-4 w-4" />
                    <span>Institute Requests</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </motion.div>

        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
              <div className="flex items-center">
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-4">
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {activeView === 'evaluators' ? 'Evaluator Requests' : 'Institute Requests'}
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            <div className="container mx-auto px-6 py-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4"
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{evaluators.length + institutes.length}</div>
                    <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{evaluators.filter(e => e.status === 'Pending').length + institutes.filter(i => i.status === 'Pending').length}</div>
                    <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+12</div>
                    <p className="text-xs text-muted-foreground">+19% from yesterday</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rejected Today</CardTitle>
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">+3</div>
                    <p className="text-xs text-muted-foreground">+7% from yesterday</p>
                  </CardContent>
                </Card>
              </motion.div>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Recent Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-4">
                    <div className="w-full max-w-md flex items-center">
                      <Input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="mr-2"
                      />
                      <Button>
                        <Search className="mr-2 h-4 w-4" />
                        Search
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          {activeView === 'institutes' && <TableHead>Type</TableHead>}
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence>
                          {filteredData.map((item) => (
                            <motion.tr
                              key={item.id}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.email}</TableCell>
                              {activeView === 'institutes' && <TableCell>{item.type}</TableCell>}
                              <TableCell>
                                <Badge variant={item.status === 'Pending' ? 'default' : 'success'}>
                                  {item.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="outline" onClick={() => handleViewDetails(item)}>View Details</Button>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{selectedItem?.name}</DialogTitle>
              <DialogDescription>
                Review the details and approve or reject the request.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p><strong>Email:</strong> {selectedItem?.email}</p>
              {activeView === 'evaluators' && (
                <>
                  <p><strong>Specialization:</strong> {selectedItem?.specialization}</p>
                  <p><strong>Experience:</strong> {selectedItem?.experience}</p>
                </>
              )}
              {activeView === 'institutes' && (
                <>
                  <p><strong>Type:</strong> {selectedItem?.type}</p>
                  <p><strong>Address:</strong> {selectedItem?.address}</p>
                  <p><strong>Phone:</strong> {selectedItem?.phone}</p>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="destructive" onClick={handleReject}>
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button onClick={handleApprove}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>
  )
}