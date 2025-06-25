'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {School as MdSchool, Octagon as MdAssignment, BarChart as MdBarChart, Verified as MdVerified, Lock as MdSecurity } from "lucide-react"
import { useNavigate } from 'react-router-dom'

export default function Apaar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const navigate = useNavigate()
  const handleLogin = (apaarId: string, password: string) => {
    if (apaarId === '123456789' && password === '12345') {
        navigate("/apaar-dash")
    } else {
      alert('Invalid credentials. Please try again.')
    }
  }

  return (
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <Header onLoginClick={() => setIsLoginModalOpen(true)} />
        <main className="flex-grow">
          <Hero />
          <Features />
          <Statistics />
          <Testimonials />
        </main>
        <Footer />
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)}
          onLogin={handleLogin}
        />
      </div>
  )
}

function Header({ onLoginClick }: { onLoginClick: () => void }) {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MdSchool className="w-8 h-8" />
          <span className="text-2xl font-bold">APAAR</span>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#features" className="hover:underline">Features</a></li>
            <li><a href="#statistics" className="hover:underline">Statistics</a></li>
            <li><a href="#testimonials" className="hover:underline">Testimonials</a></li>
            <li>
              <Button onClick={onLoginClick} variant="secondary">Login</Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="bg-secondary text-secondary-foreground py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to APAAR</h1>
        <p className="text-xl mb-8">Automated Permanent Academic Account Registry</p>
        <Button size="lg">Learn More</Button>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    {
      title: "Credit Tracking",
      description: "Easily track and manage your academic credits across semesters.",
      icon: <MdAssignment className="w-6 h-6" />,
    },
    {
      title: "Performance Analytics",
      description: "Visualize your academic performance with intuitive charts and graphs.",
      icon: <MdBarChart className="w-6 h-6" />,
    },
    {
      title: "Achievement Verification",
      description: "Get your extracurricular achievements verified and showcased.",
      icon: <MdVerified className="w-6 h-6" />,
    },
    {
      title: "Secure Data Management",
      description: "Your academic data is stored securely and accessible only to authorized personnel.",
      icon: <MdSecurity className="w-6 h-6" />,
    },
  ]

  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {feature.icon}
                  <span>{feature.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function Statistics() {
  const stats = [
    { title: "Registered Students", value: "1M+" },
    { title: "Participating Institutions", value: "5,000+" },
    { title: "Credits Tracked", value: "50M+" },
    { title: "Verified Achievements", value: "2M+" },
  ]

  return (
    <section id="statistics" className="bg-secondary text-secondary-foreground py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">APAAR in Numbers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Computer Science Student",
      content: "APAAR has made tracking my academic progress so much easier. I love how I can see all my achievements in one place!",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Rahul Patel",
      role: "Engineering Graduate",
      content: "The credit transfer process was seamless thanks to APAAR. It saved me a lot of time and hassle during my semester abroad.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Dr. Anjali Desai",
      role: "University Professor",
      content: "APAAR has revolutionized how we manage student records. It's an invaluable tool for both students and educators.",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <section id="testimonials" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What People Say About APAAR</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>"{testimonial.content}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <MdSchool className="w-8 h-8" />
            <span className="text-2xl font-bold">APAAR</span>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms of Service</a></li>
              <li><a href="#" className="hover:underline">Contact Us</a></li>
            </ul>
          </nav>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2023 APAAR. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

function LoginModal({ isOpen, onClose, onLogin }: { isOpen: boolean, onClose: () => void, onLogin: (apaarId: string, password: string) => void }) {
  const [apaarId, setApaarId] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(apaarId, password)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login to APAAR</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="apaarId">APAAR ID</Label>
            <Input
              id="apaarId"
              value={apaarId}
              onChange={(e) => setApaarId(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

