import React, { useContext, createContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLast, ChevronFirst } from "lucide-react";
import { TbMessageChatbot } from "react-icons/tb";
import { IoBookOutline } from "react-icons/io5";
import { PiExam } from "react-icons/pi";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { CiPen } from "react-icons/ci";
import { IoCalendarOutline } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

const SidebarContext = createContext();

export default function SideNavigationBar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  return (
    <SidebarContext.Provider value={{ expanded }}>
      <motion.aside
        initial={false}
        animate={{ width: expanded ? "16rem" : "4rem" }}
        className="h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-indigo-900 overflow-hidden"
      >
        <nav className="h-full flex flex-col text-white border-r border-indigo-800 shadow-lg">
          <div className="p-4 pb-2 flex justify-between items-center">
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link to="/" className="text-xl font-bold text-blue-300">
                    LMS
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-indigo-800 hover:bg-indigo-700 transition-colors duration-200"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </motion.button>
          </div>

          <ul className="flex-1 px-3">
            <SidebarItem
              to="/dashboard"
              icon={<IoBookOutline />}
              text="Course Selector"
              active={location.pathname === "/dashboard"}
              expanded={expanded}
            />

            {location.pathname.includes("/course/") && (
              <>
                <SidebarItem
                  to={`${location.pathname}/grades`}
                  icon={<PiExam />}
                  text="Grades"
                  active={location.pathname.endsWith("/grades")}
                  expanded={expanded}
                />
                <SidebarItem
                  to={`${location.pathname}/assignments`}
                  icon={<MdOutlineAssignmentTurnedIn />}
                  text="Assignments"
                  active={location.pathname.endsWith("/assignments")}
                  expanded={expanded}
                />
                <SidebarItem
                  to={`${location.pathname}/exams`}
                  icon={<CiPen />}
                  text="Exams"
                  active={location.pathname.endsWith("/exams")}
                  expanded={expanded}
                />
                <SidebarItem
                  to={`${location.pathname}/events`}
                  icon={<IoCalendarOutline />}
                  text="Upcoming Events"
                  active={location.pathname.endsWith("/events")}
                  expanded={expanded}
                />
              </>
            )}

            <SidebarItem
              to="/chatbot"
              icon={<TbMessageChatbot />}
              text="Chatbot"
              active={location.pathname === "/chatbot"}
              expanded={expanded}
            />
          </ul>
        </nav>
      </motion.aside>
    </SidebarContext.Provider>
  );
}

function SidebarItem({ to, icon, text, active, expanded }) {
  return (
    <li>
      <Link to={to}>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${
            active
              ? "bg-indigo-600 text-white"
              : "text-blue-300 hover:bg-indigo-800 hover:text-white"
          }`}
        >
          <div className={`text-xl ${!expanded && 'mx-auto'}`}>{icon}</div>
          <AnimatePresence>
            {expanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-2 whitespace-nowrap"
              >
                {text}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </Link>
    </li>
  );
}