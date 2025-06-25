import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/hooks/useAuth";
import { CollapsibleSidebar } from "@/components/CollapisbleSidebar";
import { motion } from "framer-motion";
import { Chatbot } from "@/components/Chatbot";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

const Institute: React.FC = () => {
  const navigate = useNavigate();
  const { token, mode } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    if (!token || mode !== "institute") {
      navigate("/institute/login");
    }
  }, [token, mode, navigate]);

  return (
    <div className="flex bg-background min-h-screen">
      {pathname !== "/institute/login" && (
        <CollapsibleSidebar onCollapse={setIsCollapsed} />
      )}
      <motion.main
        className="flex-1 p-8"
        animate={{
          marginLeft:
            pathname == "/institute/login" ? 0 : isCollapsed ? "2rem" : "16rem",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </motion.main>
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="fixed bottom-12 right-[40px]"
      >
        <Button
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>
      <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Institute;
