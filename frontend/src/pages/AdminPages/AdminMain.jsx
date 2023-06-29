import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import AdminUsers from "./TabPages/AdminUsers";
import AdminTeams from "./TabPages/AdminTeams";
import AdminLeagues from "./TabPages/AdminLeagues";
import AdminMatches from "./TabPages/AdminMatches";
import AdminRequests from "./TabPages/AdminRequests";
import AdminNotifications from "./TabPages/AdminNotifications";
import AdminSystemParameters from "./TabPages/AdminSystemParameters";
import useAuth from "../../hooks/auth";

const AdminPage = () => {

    const [activeTab, setActiveTab] = useState("");
    const {isSignedIn, isAdmin} = useAuth()
    const navigate = useNavigate(); 
    const location = useLocation();

    useEffect(() => {
      const url = window.location.pathname
      if (url === "/adminusers") {
        setActiveTab("tab1")
      } else if (url === "/adminteams") {
        setActiveTab("tab2")
      } else if (url === "/adminleagues") {
        setActiveTab("tab3")
      } else if (url === "/adminmatches") {
        setActiveTab("tab4")
      } else if (url === "/adminrequests") {
        setActiveTab("tab5")
      } else if (url === "/adminnotifications") {
        setActiveTab("tab6")
      } else if (url === "/adminsystemparameters") {
        setActiveTab("tab7")
      }
    }, [location.pathname]);

    const navigateTabs = (tabNum) => {
      if (tabNum === "tab1") {
          navigate('/adminusers')
      } else if (tabNum === "tab2") {
          navigate('/adminteams')
      } else if (tabNum === "tab3") {
        navigate('/adminleagues')
      } else if (tabNum === "tab4") {
        navigate('/adminmatches')
      } else if (tabNum === "tab5") {
        navigate('/adminrequests')
      } else if (tabNum === "tab6") {
        navigate('/adminnotifications')
      } else if (tabNum === "tab7") {
        navigate('/adminsystemparameters')
      } 
  }
    
    return (
      <div>
      { !isSignedIn || !isAdmin ? (
          <div>
            <h1>NOT AUTHORIZED TO ACCESS THIS PAGE !!!</h1>
          </div>
        ) : (
          <div >
          <ul className="nav nav-tabs mt-2">
            <li className={activeTab === "tab1" ? "nav-link active fw-bold text-primary" : "nav-link text-secondary"} onClick={() => navigateTabs("tab1")}>Users</li>
            <li className={activeTab === "tab2" ? "nav-link active fw-bold text-primary" : "nav-link text-secondary"} onClick={() => navigateTabs("tab2")}>Teams</li>
            <li className={activeTab === "tab3" ? "nav-link active fw-bold text-primary" : "nav-link text-secondary"} onClick={() => navigateTabs("tab3")}>Leagues</li>
            <li className={activeTab === "tab4" ? "nav-link active fw-bold text-primary" : "nav-link text-secondary"} onClick={() => navigateTabs("tab4")}>Matches</li>
            <li className={activeTab === "tab5" ? "nav-link active fw-bold text-primary" : "nav-link text-secondary"} onClick={() => navigateTabs("tab5")}>Requests</li>
            <li className={activeTab === "tab6" ? "nav-link active fw-bold text-primary" : "nav-link text-secondary"} onClick={() => navigateTabs("tab6")}>Notifications</li>
            <li className={activeTab === "tab7" ? "nav-link active fw-bold text-primary" : "nav-link text-secondary"} onClick={() => navigateTabs("tab7")}>SysParms</li>
          </ul>
          <div className="outlet">
            {activeTab === "tab1" ? <AdminUsers /> 
                : (activeTab === "tab2" ? <AdminTeams /> 
                : (activeTab === "tab3" ? <AdminLeagues /> 
                : (activeTab === "tab4" ? <AdminMatches />
                : (activeTab === "tab5" ? <AdminRequests />
                : (activeTab === "tab6" ? <AdminNotifications />
                : <AdminSystemParameters />
                )))))
            }
          </div>
        </div>
        )}
        </div>
    );
};

export default AdminPage;