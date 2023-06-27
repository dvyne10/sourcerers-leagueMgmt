import React, { useState } from "react";
import AdminUsers from "../components/TabComponents/AdminUsers";
import AdminTeams from "../components/TabComponents/AdminTeams";
import AdminLeagues from "../components/TabComponents/AdminLeagues";
import AdminMatches from "../components/TabComponents/AdminMatches";
import AdminRequests from "../components/TabComponents/AdminRequests";
import AdminNotifications from "../components/TabComponents/AdminNotifications";
import AdminSystemParameters from "../components/TabComponents/AdminSystemParameters";
import useAuth from "../hooks/auth";

const AdminPage = () => {

    const [activeTab, setActiveTab] = useState("tab1");
    const {isSignedIn, isAdmin} = useAuth()
    
    return (
      <div>
      { !isSignedIn || !isAdmin ? (
          <div>
            <h1>NOT AUTHORIZED TO ACCESS THIS PAGE !!!</h1>
          </div>
        ) : (
          <div >
          <ul className="nav nav-tabs">
            <li className={activeTab === "tab1" ? "nav-link active" : "nav-link"} onClick={() => setActiveTab("tab1")}>Users</li>
            <li className={activeTab === "tab2" ? "nav-link active" : "nav-link"} onClick={() => setActiveTab("tab2")}>Teams</li>
            <li className={activeTab === "tab3" ? "nav-link active" : "nav-link"} onClick={() => setActiveTab("tab3")}>Leagues</li>
            <li className={activeTab === "tab4" ? "nav-link active" : "nav-link"} onClick={() => setActiveTab("tab4")}>Matches</li>
            <li className={activeTab === "tab5" ? "nav-link active" : "nav-link"} onClick={() => setActiveTab("tab5")}>Requests</li>
            <li className={activeTab === "tab6" ? "nav-link active" : "nav-link"} onClick={() => setActiveTab("tab6")}>Notifications</li>
            <li className={activeTab === "tab7" ? "nav-link active" : "nav-link"} onClick={() => setActiveTab("tab7")}>SysParms</li>
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