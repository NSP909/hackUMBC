import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Typography, Box } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AssignmentIcon from '@mui/icons-material/Assignment';
import EventIcon from '@mui/icons-material/Event';
import ChatIcon from '@mui/icons-material/Chat';
import GradeIcon from '@mui/icons-material/Grade';

export default function SideNavigationBar({ isExpanded, toggleSidebar }) {
  const location = useLocation();
  const isCourseDetail = location.pathname.includes('/course/');
  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Toggle Button */}
      <IconButton 
        onClick={toggleSidebar} 
        sx={{
          position: 'absolute',
          top: 8,
          left: isExpanded ? `${drawerWidth - 40}px` : '8px',
          zIndex: 1300,
          transition: 'left 0.3s',
        }}
      >
        {isExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </IconButton>

      <Drawer
        variant="persistent"
        anchor="left"
        open={isExpanded}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            transition: 'width 0.3s',
          },
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
          <Typography variant="h6" noWrap>
            LMS
          </Typography>
        </div>
        <List>
          <ListItem button component={Link} to="/" selected={location.pathname === '/'}>
            <ListItemText primary="Course Selector" />
          </ListItem>
          {isCourseDetail && (
            <>
              <ListItem button component={Link} to={`${location.pathname}/grades`} selected={location.pathname.endsWith('/grades')}>
                <ListItemIcon>
                  <GradeIcon />
                </ListItemIcon>
                <ListItemText primary="Grades" />
              </ListItem>
              <ListItem button component={Link} to={`${location.pathname}/assignments`} selected={location.pathname.endsWith('/assignments')}>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Assignments" />
              </ListItem>
              <ListItem button component={Link} to={`${location.pathname}/exams`} selected={location.pathname.endsWith('/exams')}>
                <ListItemIcon>
                  <AssignmentIcon />
                </ListItemIcon>
                <ListItemText primary="Exams" />
              </ListItem>
              <ListItem button component={Link} to={`${location.pathname}/events`} selected={location.pathname.endsWith('/events')}>
                <ListItemIcon>
                  <EventIcon />
                </ListItemIcon>
                <ListItemText primary="Upcoming Events" />
              </ListItem>
            </>
          )}
          <ListItem button component={Link} to="/chatbot" selected={location.pathname === '/chatbot'}>
            <ListItemIcon>
              <ChatIcon />
            </ListItemIcon>
            <ListItemText primary="Chatbot" />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}