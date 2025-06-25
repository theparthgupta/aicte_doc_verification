'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PersonStanding as MdPerson, School as MdSchool, Octagon as MdAssignment, Star as MdStar } from "lucide-react"

export default function ApaarDashboard() {
  const [studentName, setStudentName] = useState("John Doe")
  const [apaarId, setApaarId] = useState("123456789")

  const studentInfo = [
    { title: "APAAR ID", value: apaarId, icon: <MdPerson className="w-6 h-6" /> },
    { title: "Institution", value: "XYZ University", icon: <MdSchool className="w-6 h-6" /> },
    { title: "Total Credits", value: "120", icon: <MdAssignment className="w-6 h-6" /> },
    { title: "GPA", value: "3.8", icon: <MdStar className="w-6 h-6" /> },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {studentName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {studentInfo.map((info, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {info.title}
              </CardTitle>
              {info.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{info.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y divide-gray-200">
              {[
                "Completed Introduction to Computer Science",
                "Submitted assignment for Data Structures",
                "Attended workshop on Machine Learning",
                "Received certificate for Web Development course",
              ].map((activity, index) => (
                <li key={index} className="p-4 hover:bg-muted/50">
                  {activity}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <Button>View Full Transcript</Button>
      </div>
    </div>
  )
}

