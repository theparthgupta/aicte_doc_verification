'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, GraduationCap, Building, Users, LogIn, X } from 'lucide-react'
import {Link, useNavigate, useNavigation} from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AICTEPortal() {
  const [loginType, setLoginType] = useState("")
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [showAboutInfo, setShowAboutInfo] = useState(false)
  const [showInitiatives, setShowInitiatives] = useState(false)
  const [showContact, setShowContact] = useState(false)
  const navigate = useNavigate()
  const handleLogin = (type: string) => {
    if(type === "University"){
      navigate("/institute")
    }
    if(type === "Evaluator"){
      navigate("/evaluator")
    }
    if(type === "Admin"){
      navigate("/admin")
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 py-4 flex flex-col sm:flex-row items-center justify-between">
        <Link className="flex items-center mb-4 sm:mb-0" href="#" aria-label="AICTE Home">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-09-25%20at%207.22.28%E2%80%AFPM-0Ir4wvA8bwC3c08CyM4NVgTIa5Ky8V.png"
            className="mr-4 h-18 w-24"
          />
          <div className="flex flex-col">
            <span className="font-bold text-sm sm:text-base md:text-lg">All India Council for Technical Education</span>
            <span className="text-xs sm:text-sm md:text-base">अखिल भारतीय तकनीकी शिक्षा परिषद</span>
          </div>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Button variant="ghost" onClick={() => setShowAboutInfo(true)}>
            About
          </Button>
          <Button variant="ghost" onClick={() => setShowInitiatives(true)}>
            Initiatives
          </Button>
          <Button variant="ghost" onClick={() => setShowContact(true)}>
            Contact
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Login
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onSelect={() => handleLogin("University")}>University</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleLogin("Evaluator")}>Evaluator</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleLogin("Admin")}>Admin</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  AICTE Document Verification Portal
                </h1>
                <p className="mx-auto max-w-[700px] text-xl text-gray-500 md:text-2xl dark:text-gray-400">
                  All India Council for Technical Education
                </p>
                <p className="mx-auto max-w-[700px] text-lg text-gray-500 md:text-xl dark:text-gray-400">
                  अखिल भारतीय तकनीकी शिक्षा परिषद
                </p>
                <p className="mx-auto max-w-[700px] mt-4 text-gray-500 md:text-xl dark:text-gray-400">
                  Shaping the future of technical education in India
                </p>
              </div>
              <div className="space-x-4">
                <Button>Learn More</Button>
                <Button variant="outline">Explore Programs</Button>
                <Button onClick={()=>navigate("/apaar")} variant="outline">Apaar</Button>
              </div>
              <div className="mt-8 w-full max-w-3xl">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202024-09-25%20at%207.36.03%E2%80%AFPM-uRB1fdmWrUoSrQTjkvTvjgliDPxCK2.png"
                  alt="AICTE Headquarters building"
                  className="rounded-lg shadow-lg w-128"
                />
                <p className="mt-2 text-sm text-gray-500">AICTE Headquarters</p>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 max-w-[700px] mx-auto">
                  All India Council for Technical Education (AICTE) was set up in November 1945 as a national-level Apex Advisory Body to conduct a survey on the facilities available for technical education and to promote development in the country in a coordinated and integrated manner.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Key Features
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <Book className="h-6 w-6 mb-2" aria-hidden="true" />
                  <CardTitle>Quality Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Ensuring high standards in technical education across India</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <GraduationCap className="h-6 w-6 mb-2" aria-hidden="true" />
                  <CardTitle>Skill Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Promoting skill-based learning and industry-relevant curricula</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Building className="h-6 w-6 mb-2" aria-hidden="true" />
                  <CardTitle>Institution Approval</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Regulating and approving technical institutions across the country</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-6 w-6 mb-2" aria-hidden="true" />
                  <CardTitle>Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Fostering industry-academia partnerships for better outcomes</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 AICTE. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>

      {/* Login Form Dialog */}
      <Dialog open={showLoginForm} onOpenChange={setShowLoginForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{loginType} Login</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required />
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* About Info Dialog */}
      <Dialog open={showAboutInfo} onOpenChange={setShowAboutInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About AICTE</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            The All India Council for Technical Education (AICTE) is the statutory body and a national-level council for technical education, under the Department of Higher Education, Ministry of Education, Government of India. Established in November 1945, AICTE is responsible for proper planning and coordinated development of the technical education and management education system in India.
          </DialogDescription>
        </DialogContent>
      </Dialog>

      {/* Initiatives Dialog */}
      <Dialog open={showInitiatives} onOpenChange={setShowInitiatives}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>AICTE Initiatives</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            <div className="space-y-4">
              <h3 className="font-bold">One Student One Tree 2023</h3>
              <p>A campaign aimed at combating climate change by promoting tree plantation. The goal is to plant one crore trees, with each student, faculty, and staff member encouraged to plant at least one tree.</p>
              
              <h3 className="font-bold">MeriLiFE Movement</h3>
              <p>This movement focuses on combating climate change and promoting environmental sustainability.</p>
              
              <h3 className="font-bold">AICTE Yoga Campaign 2023</h3>
              <p>Launched on International Yoga Day, this campaign promotes yoga among students and faculty to enhance physical and mental well-being.</p>
              
              <h3 className="font-bold">Jal Shakti Abhiyan</h3>
              <p>A scheme aimed at water conservation and management, with the theme "Sanchay Jal Behtar Kal" (Save Water for a Better Tomorrow).</p>
              
              <h3 className="font-bold">Smart India Hackathon</h3>
              <p>An initiative to encourage students to solve real-world problems through innovative solutions using technology.</p>
              
              <h3 className="font-bold">SWAYAM</h3>
              <p>A platform for providing online courses and study material for students and teachers.</p>
              
              <h3 className="font-bold">National Education Alliance for Technology (NEAT)</h3>
              <p>Aims to improve the quality of technical education through collaboration and innovation.</p>
              
              <h3 className="font-bold">Student Learning Assessment (PARAKH)</h3>
              <p>A framework to assess and improve the learning outcomes of students in technical education.</p>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={showContact} onOpenChange={setShowContact}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact AICTE</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p><strong>Helpline Numbers:</strong></p>
            <p>011-2958 1000</p>
            <p>1800-572-3575 (Toll Free)</p>
            <p><strong>Email:</strong> helpdesk1@aicte-india.org</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}