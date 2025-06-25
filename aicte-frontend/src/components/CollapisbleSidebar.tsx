"use client"

import * as React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { FileText, GraduationCap, Home, Settings, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import AicteLogo from '@/assets/aicte-logo.webp'
interface SidebarItemProps {
  icon: React.ElementType
  label: string
  href: string
  isCollapsed: boolean
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  href,
  isCollapsed
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = location.pathname === href

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start h-10 transition-colors',
                isActive ? 'bg-primary/10 text-primary hover:bg-primary/15' : 'hover:bg-muted/50',
                isCollapsed ? 'px-2' : 'px-4'
              )}
              onClick={() => navigate(href)}
            >
              <Icon className={cn('h-5 w-5 shrink-0', isCollapsed ? 'mr-0' : 'mr-3')} />
              {!isCollapsed && <span className="truncate">{label}</span>}
            </Button>
          </motion.div>
        </TooltipTrigger>
        {isCollapsed && (
          <TooltipContent side="right" className="flex items-center gap-4">
            {label}
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

interface CollapsibleSidebarProps {
  onCollapse: (collapsed: boolean) => void;
}

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({ onCollapse }) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    onCollapse(!isCollapsed);
  }

  return (
    <motion.div
      className={cn(
        'bg-background h-screen fixed left-0 top-0 border-r transition-all duration-300 ease-in-out flex flex-col z-50',
        isCollapsed ? 'w-16' : 'w-64'
      )}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex items-center p-4 border-b">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <img src={AicteLogo} alt="AICTE Logo" className="w-8 h-8" />
              <h1 className="font-semibold text-lg">AICTE Portal</h1>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className={cn("ml-auto")}
          animate={{ marginLeft: isCollapsed ? "auto" : "0" }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className={`h-8 w-8 ${!isCollapsed?"ml-2":"ml-0"}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isCollapsed ? "collapsed" : "expanded"}
                initial={{ rotate: isCollapsed ? -180 : 0, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: isCollapsed ? 180 : -180, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </motion.div>
            </AnimatePresence>
          </Button>
        </motion.div>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="p-4 border-b"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-8 h-9 bg-muted/50 border-muted-foreground/20"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollArea className="flex-1">
        <div className="space-y-6 py-6">
          <div>
            <div className="text-xs font-semibold text-muted-foreground/70 px-4 py-2">
              {!isCollapsed && "MAIN MENU"}
            </div>
            <div className="space-y-1 px-3">
              <SidebarItem
                href="/institute"
                icon={Home}
                label="Dashboard"
                isCollapsed={isCollapsed}
              />
              <SidebarItem
                href="/institute/applications"
                icon={FileText}
                label="Applications"
                isCollapsed={isCollapsed}
              />
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-muted-foreground/70 px-4 py-2">
              {!isCollapsed && "SETTINGS"}
            </div>
            <div className="space-y-1 px-3">
              <SidebarItem
                href="/institute/settings"
                icon={Settings}
                label="Settings"
                isCollapsed={isCollapsed}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
    </motion.div>
  )
}

