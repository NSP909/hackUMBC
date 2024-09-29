import React, { useContext, createContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLast, ChevronFirst } from "lucide-react";
import { TbMessageChatbot } from "react-icons/tb";
import { IoBookOutline } from "react-icons/io5";
import { PiExam } from "react-icons/pi";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { CiPen } from "react-icons/ci";
import { IoCalendarOutline } from "react-icons/io5";

const SidebarContext = createContext();

export default function SideNavigationBar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  return (
    <SidebarContext.Provider value={{ expanded }}>
      <aside className={`h-screen transition-width duration-300 ${expanded ? 'w-64' : 'w-16'} bg-gray-800`}>
        <nav className="h-full flex flex-col text-white border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            <Link
              to="/"
              className={`text-lg transition-opacity duration-300 ${expanded ? 'opacity-100' : 'opacity-0'}`}
            >
              LMS
            </Link>
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className={`p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-transform duration-300 ${expanded ? 'transform-none' : 'transform translate-x-8'}`}
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>

          <ul className="flex-1 px-3">
            <SidebarItem
              to="/dashboard"
              active={location.pathname === "/dashboard"}
            >
              <div className={`flex items-center ${!expanded && 'justify-center w-full'}`}>
                <IoBookOutline className="icon" />
                {expanded && (
                  <span className="ml-2">Course Selector</span>
                )}
              </div>
            </SidebarItem>

            {location.pathname.includes("/course/") && (
              <>
                <SidebarItem
                  to={`${location.pathname}/grades`}
                  active={location.pathname.endsWith("/grades")}
                >
                  <div className={`flex items-center ${!expanded && 'justify-center w-full'}`}>
                    <PiExam className="icon" />
                    {expanded && (
                      <span className="ml-2">Grades</span>
                    )}
                  </div>
                </SidebarItem>

                <SidebarItem
                  to={`${location.pathname}/assignments`}
                  active={location.pathname.endsWith("/assignments")}
                >
                  <div className={`flex items-center ${!expanded && 'justify-center w-full'}`}>
                    <MdOutlineAssignmentTurnedIn className="icon" />
                    {expanded && (
                      <span className="ml-2">Assignments</span>
                    )}
                  </div>
                </SidebarItem>

                <SidebarItem
                  to={`${location.pathname}/exams`}
                  active={location.pathname.endsWith("/exams")}
                >
                  <div className={`flex items-center ${!expanded && 'justify-center w-full'}`}>
                    <CiPen className="icon" />
                    {expanded && (
                      <span className="ml-2">Exams</span>
                    )}
                  </div>
                </SidebarItem>

                <SidebarItem
                  to={`${location.pathname}/events`}
                  active={location.pathname.endsWith("/events")}
                >
                  <div className={`flex items-center ${!expanded && 'justify-center w-full'}`}>
                    <IoCalendarOutline className="icon" />
                    {expanded && (
                      <span className="ml-2">Upcoming Events</span>
                    )}
                  </div>
                </SidebarItem>
              </>
            )}

            <SidebarItem
              to="/chatbot"
              active={location.pathname === "/chatbot"}
            >
              <div className={`flex items-center ${!expanded && 'justify-center w-full'}`}>
                <TbMessageChatbot className="icon" />
                {expanded && (
                  <span className="ml-2">Chatbot</span>
                )}
              </div>
            </SidebarItem>
          </ul>
        </nav>
      </aside>
    </SidebarContext.Provider>
  );
}

function SidebarItem({ to, active, children }) {
  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active
          ? "bg-indigo-500 text-white"
          : "hover:bg-indigo-600 text-gray-300"
      }`}
    >
      <Link to={to} className="flex w-full items-center">
        {children}
      </Link>
    </li>
  );
}