import React, { useContext, createContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MoreVertical, ChevronLast, ChevronFirst } from 'lucide-react';

const SidebarContext = createContext();

export default function SideNavigationBar({ children }) {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  return (
    <SidebarContext.Provider value={{ expanded }}>
      <aside className="h-screen">
        <nav className="h-full flex flex-col bg-gray-800 text-white border-r shadow-sm">
          <div className="p-4 pb-2 flex justify-between items-center">
            <h1 className={`overflow-hidden transition-all ${expanded ? 'w-32' : 'w-0'}`}>LMS</h1>
            <button
              onClick={() => setExpanded((curr) => !curr)}
              className="p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600"
            >
              {expanded ? <ChevronFirst /> : <ChevronLast />}
            </button>
          </div>
          <ul className="flex-1 px-3">
            <SidebarItem to="/" active={location.pathname === '/'} text="Course Selector" />
            {location.pathname.includes('/course/') && (
              <>
                <SidebarItem
                  to={`${location.pathname}/grades`}
                  active={location.pathname.endsWith('/grades')}
                  text="Grades"
                />
                <SidebarItem
                  to={`${location.pathname}/assignments`}
                  active={location.pathname.endsWith('/assignments')}
                  text="Assignments"
                />
                <SidebarItem
                  to={`${location.pathname}/exams`}
                  active={location.pathname.endsWith('/exams')}
                  text="Exams"
                />
                <SidebarItem
                  to={`${location.pathname}/events`}
                  active={location.pathname.endsWith('/events')}
                  text="Upcoming Events"
                />
              </>
            )}
            <SidebarItem to="/chatbot" active={location.pathname === '/chatbot'} text="Chatbot" />
          </ul>
        </nav>
      </aside>
    </SidebarContext.Provider>
  );
}

export function SidebarItem({ to, active, text }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${
        active ? 'bg-indigo-500 text-white' : 'hover:bg-indigo-600 text-gray-300'
      }`}
    >
      <Link to={to} className="flex w-full items-center">
        <span
          className={`overflow-hidden transition-all ${expanded ? 'w-52 ml-3' : 'w-0'}`}
        >
          {text}
        </span>
      </Link>
    </li>
  );
}
