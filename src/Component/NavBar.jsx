import React, { useState, useRef, useEffect } from "react";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Mail as MailIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  MoreVert as MoreIcon,
} from "@mui/icons-material";
import { Drawer, List, ListItem, ListItemText } from "@mui/material";

const NavBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerList = ['Home', 'Notification', 'Profile' , 'Settings'];

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);
  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handleMobileMenuOpen = (event) => setMobileMoreAnchorEl(event.currentTarget);

  // Search bar state
  const [searchBarWidth, setSearchBarWidth] = useState(60);
  const searchRef = useRef(null);

  // Outside click listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchBarWidth(60); // shrink back on outside click
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Drawer toggle function
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <div className="w-full flex justify-between bg-cyan-700 text-white">
      {/* Navbar */}
      <div className="flex items-center gap-5 px-4 py-2">
        {/* Left section */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDrawer(true)}
            className="p-2 rounded-full hover:bg-cyan-800 cursor-pointer"
          >
            <MenuIcon />
          </button>

          {/* Drawer */}
          <Drawer
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            PaperProps={{
                sx: {
                backgroundColor: "#0e7490", // Tailwind bg-cyan-700 hex
                color: "white",             // text-white
                width: 260                 // fixed width
                }
            }}
            >
            <div className="flex flex-col justify-between h-screen p-4">
                <List>
                    {drawerList.map((item, idx) => (
                    <ListItem 
                        key={idx} 
                        button 
                        className="hover:bg-cyan-800 cursor-pointer rounded-lg"
                    >
                        <ListItemText primary={item} />
                    </ListItem>
                    ))}
                </List>
                <List>
                    <ListItem className="hover:bg-cyan-800 cursor-pointer rounded-lg">
                        <ListItemText primary='Logout'/>
                    </ListItem>
                </List>
            </div>

            </Drawer>

          <span className="hidden sm:block font-semibold text-lg">Nutrio Track</span>
        </div>

        {/* Search */}
        <div ref={searchRef} className="relative flex-1 sm:flex-initial">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search…"
            onFocus={() => setSearchBarWidth(100)}
            className={`w-full sm:w-${searchBarWidth} pl-10 pr-3 py-1.5 rounded-md bg-white/20 text-white placeholder-gray-200 focus:outline-none focus:bg-white/30 transition-all duration-300`}
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center justify-center mr-5">
        <div className="hidden md:flex items-center gap-2">
          <button className="relative p-2 rounded-full hover:bg-cyan-800 cursor-pointer">
            <MailIcon />
            <span className="absolute -top-1 -right-1 bg-red-600 text-xs w-5 h-5 flex items-center justify-center rounded-full">
              4
            </span>
          </button>
          <button className="relative p-2 rounded-full hover:bg-cyan-800 cursor-pointer">
            <NotificationsIcon />
            <span className="absolute -top-1 -right-1 bg-red-600 text-xs w-5 h-5 flex items-center justify-center rounded-full">
              17
            </span>
          </button>
          <button
            onClick={handleProfileMenuOpen}
            className="p-2 rounded-full hover:bg-cyan-800 cursor-pointer"
          >
            <AccountCircle />
          </button>
        </div>
        <div className="md:hidden">
          <button
            onClick={handleMobileMenuOpen}
            className="p-2 rounded-full hover:bg-cyan-800"
          >
            <MoreIcon />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-700 px-4 py-2 space-y-2">
          <button className="flex items-center gap-2 w-full p-2 rounded hover:bg-blue-600">
            <MailIcon />
            <span>Messages</span>
            <span className="ml-auto bg-red-600 text-xs w-5 h-5 flex items-center justify-center rounded-full">
              4
            </span>
          </button>
          <button className="flex items-center gap-2 w-full p-2 rounded hover:bg-blue-600">
            <NotificationsIcon />
            <span>Notifications</span>
            <span className="ml-auto bg-red-600 text-xs w-5 h-5 flex items-center justify-center rounded-full">
              17
            </span>
          </button>
          <button
            onClick={handleProfileMenuOpen}
            className="flex items-center gap-2 w-full p-2 rounded hover:bg-blue-600"
          >
            <AccountCircle />
            <span>Profile</span>
          </button>
        </div>
      )}

      {/* Desktop Profile Menu */}
      {isMenuOpen && (
        <div className="absolute right-4 mt-2 w-40 bg-white text-black rounded-md shadow-lg">
          <button
            onClick={handleMenuClose}
            className="block px-4 py-2 w-full text-left hover:rounded-md hover:bg-gray-200"
          >
            Profile
          </button>
          <button
            onClick={handleMenuClose}
            className="block px-4 py-2 w-full text-left hover:rounded-md hover:bg-gray-200"
          >
            My account
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBar;
