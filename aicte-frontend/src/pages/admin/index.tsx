import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, formatDistanceToNow } from 'date-fns'

// Shadcn UI components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Mock data
const admin = {
  name: 'Sarah Connor',
  email: 'sarah.connor@example.com',
  username: '@sconnor'
}

const currentDate = new Date()
const evaluators = [
  { name: 'John Doe', approved: 15, rejected: 5, status: 'active', statusSince: new Date(currentDate.setHours(8, 0, 0, 0)) },
  { name: 'Jane Smith', approved: 12, rejected: 8, status: 'inactive', statusSince: new Date(currentDate.setHours(14, 30, 0, 0)) },
  { name: 'Bob Johnson', approved: 20, rejected: 3, status: 'active', statusSince: new Date(currentDate.setHours(9, 15, 0, 0)) },
  { name: 'Alice Brown', approved: 18, rejected: 6, status: 'active', statusSince: new Date(currentDate.setHours(7, 45, 0, 0)) },
  { name: 'Charlie Davis', approved: 10, rejected: 10, status: 'inactive', statusSince: new Date(currentDate.setHours(13, 20, 0, 0)) },
]

const recentUniversities = [
  { name: "Future Bright Academy", appliedAt: "2024-11-26 10:30", nocType: "Creation of New Password" },
  { name: "Mumbai University", appliedAt: "2023-06-15 15:45", nocType: "Introduction of New Course" },
  { name: "University of Delhi", appliedAt: "2023-06-15 14:30", nocType: "Introduction of New Branch" },
  { name: "University of Calcutta", appliedAt: "2023-06-15 16:20", nocType: "Creation of New Password" },
  { name: "Bangalore University", appliedAt: "2023-06-15 17:10", nocType: "Changing University Name" },
]

const bannedUniversities = [
  { name: "Amity University, Noida", reason: "Fraudulent activities and document forgery", banDate: "2023-05-15" },
  { name: "Lovely Professional University, Punjab", reason: "Failure to maintain academic standards", banDate: "2023-06-22" },
  { name: "Manipal Academy of Higher Education, Karnataka", reason: "Operating without proper accreditation", banDate: "2023-07-10" },
]

// Utility functions
const getNOCTypeColor = (nocType: string) => {
  switch (nocType) {
    case "Creation of New Password":
      return "bg-yellow-100 text-yellow-800"
    case "Introduction of New Course":
      return "bg-green-100 text-green-800"
    case "Introduction of New Branch":
      return "bg-blue-100 text-blue-800"
    case "Changing University Name":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Components
const EvaluatorTable = ({ evaluators, onSelectEvaluator }) => {
  const [displayCount, setDisplayCount] = useState<number>(5)

  const handleDisplayCountChange = (value: string) => {
    setDisplayCount(value === 'all' ? evaluators.length : parseInt(value, 10))
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Select onValueChange={handleDisplayCountChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Number of evaluators" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">Show 5 Evaluators</SelectItem>
            <SelectItem value="10">Show 10 Evaluators</SelectItem>
            <SelectItem value="all">Show All Evaluators</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>NOCs Approved Today</TableHead>
            <TableHead>NOCs Rejected Today</TableHead>
            <TableHead>Current Working Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {evaluators.slice(0, displayCount).map((evaluator, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{evaluator.name}</TableCell>
              <TableCell>{evaluator.approved}</TableCell>
              <TableCell>{evaluator.rejected}</TableCell>
              <TableCell>
                <Popover>
                  <PopoverTrigger asChild>
                    <Badge 
                      variant={evaluator.status === 'active' ? 'default' : 'secondary'}
                      className="cursor-pointer"
                    >
                      {evaluator.status}
                    </Badge>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Status Information</h4>
                        <p className="text-sm text-muted-foreground">
                          {evaluator.status.charAt(0).toUpperCase() + evaluator.status.slice(1)} since{' '}
                          {format(evaluator.statusSince, 'h:mm a')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ({formatDistanceToNow(evaluator.statusSince, { addSuffix: true })})
                        </p>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
              <TableCell>
                <Button onClick={() => onSelectEvaluator(evaluator)}>View Details</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

const NocturnalApplicationsGraph = ({ evaluators }) => {
  const data = evaluators.map(evaluator => ({
    name: evaluator.name,
    applications: evaluator.approved + evaluator.rejected
  }))

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="applications" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

const RecentUniversitiesTable = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recently Applied Universities for NOC</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>University Name</TableHead>
              <TableHead>Date and Time of Application</TableHead>
              <TableHead>NOC Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentUniversities.map((university, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{university.name}</TableCell>
                <TableCell>{university.appliedAt}</TableCell>
                <TableCell>
                  <Badge className={`${getNOCTypeColor(university.nocType)} font-medium`}>
                    {university.nocType}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

const BannedUniversitiesTable = () => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Banned Universities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bannedUniversities.map((university, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{university.name}</CardTitle>
                <Badge variant="destructive">Banned on {university.banDate}</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{university.reason}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

const EvaluatorModal = ({ evaluator, onClose }) => {
  const mockData = [
    {
      university: 'University of Delhi',
      dateTime: '2023-06-15 14:30',
      status: 'Approved',
      attempts: 2,
      feedback: 'All requirements met.',
    },
    {
      university: 'Mumbai University',
      dateTime: '2023-06-15 16:45',
      status: 'Rejected',
      attempts: 1,
      feedback: 'Incomplete documentation.',
    },
  ]

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{evaluator.name}&apos;s Evaluation Details</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>University</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Attempts</TableHead>
              <TableHead>Feedback</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.university}</TableCell>
                <TableCell>{row.dateTime}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{row.attempts}</TableCell>
                <TableCell>{row.feedback}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  )
}

// Main Dashboard Component
export default function AdminDashboard() {
  const [selectedEvaluator, setSelectedEvaluator] = useState(null)

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="text-right">
          <p className="font-semibold">{admin.name}</p>
          <p className="text-sm text-gray-600">{admin.email}</p>
          <p className="text-sm text-gray-600">{admin.username}</p>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Evaluators</CardTitle>
          </CardHeader>
          <CardContent>
            <EvaluatorTable 
              evaluators={evaluators} 
              onSelectEvaluator={(evaluator) => setSelectedEvaluator(evaluator)}
            />
          </CardContent>
        </Card>
        <RecentUniversitiesTable />
        <Card>
          <CardHeader>
            <CardTitle>Nocturnal Applications Handled Today</CardTitle>
          </CardHeader>
          <CardContent>
            <NocturnalApplicationsGraph evaluators={evaluators} />
          </CardContent>
        </Card>
        <BannedUniversitiesTable />
      </div>
      {selectedEvaluator && (
        <EvaluatorModal
          evaluator={selectedEvaluator}
          onClose={() => setSelectedEvaluator(null)}
        />
      )}
    </div>
  )
}

