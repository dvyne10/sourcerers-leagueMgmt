import { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import { Button, MenuItem } from '@mui/material';
import {getToken} from "../../../hooks/auth";

const backend = import.meta.env.MODE === "development" ? "http://localhost:8000" : "https://panicky-robe-mite.cyclic.app";

const AdminTeams = () => {
  const token = `Bearer ${getToken()}`
  const [teamsList, setTeamsList] = useState([])
  const [errorMessage, setErrorMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true)
    fetch(`${backend}/admingetteams`, {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "Application/JSON",
        "Authorization": token
      }
    })
    .then(response => response.json())
    .then(data=>{
      if (data.requestStatus === 'ACTC') {
        setTeamsList(data.details)
      } else {
        setErrorMessage([data.errMsg])
      }
      setIsLoading(false)
    }).catch((error) => {
      console.log(error)
      setIsLoading(false)
    })
  }, [])

  const navigate = useNavigate();
  const columns = useMemo(() => [
      { accessorKey: 'teamName', header: 'Team Name', filterVariant: 'text', size: 100 },
      { accessorKey: 'location', header: 'Team Location', filterVariant: 'text', size: 100 },
      { accessorKey: 'division', header: 'Division', filterVariant: 'select', size: 50 },
      { accessorKey: 'sport', header: 'Sport', filterVariant: 'select', size: 50 },
    ], [], );

  const handleDeleteTeam = (teamId) => {
    let newList = [...teamsList]
    let index = newList.findIndex (i => i.teamId === teamId);
    if (confirm(`Delete ${newList[index].teamName}?\nPlease click on OK if you wish to proceed.`)) {
      fetch(`${backend}/admindeleteteam/${newList[index].teamId}`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
            "Content-Type": "Application/JSON",
            "Authorization": token
        }
      })
      .then(response => response.json())
      .then(data=>{
        if (data.requestStatus === 'RJCT') {
            setErrorMessage([data.errMsg])
        } else {
            navigate('/adminteams')
        }
        setIsLoading(false)
      }).catch((error) => {
        console.log(error)
        setIsLoading(false)
      })
      newList.splice(index, 1)
      setTeamsList(newList)
    } else {
      console.log("Deletion cancelled")
    } 
  }

  const handleGotoMntPage = (action, teamId) => {
    if (action === "CREATION") {
      navigate('/adminteamcreation')
    } else {
      navigate('/adminteamupdate/' + teamId)
    }
  }

  return (
    <div>
      {isLoading ? (
          <div className="loading-overlay">
            <div style={{color: 'black'}}>Loading...</div>
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
          {errorMessage.length > 0 && (
            <div className="alert alert-danger mb-3 p-1">
                {errorMessage.map((err, index) => (
                    <p className="mb-0" key={index}>{err}</p>
                ))}
            </div>
        )}
      <MaterialReactTable
        columns={columns} data={teamsList} enableFacetedValues initialState={{ showColumnFilters: true }}
        enableRowActions
        renderRowActionMenuItems={({ row }) => [
          <MenuItem key="edit" onClick={() => handleGotoMntPage("EDIT",  row.original.teamId)}>
            Edit
          </MenuItem>,
          <MenuItem key="delete" onClick={() => handleDeleteTeam(row.original.teamId)}>
            Delete
          </MenuItem>,
        ]}
        renderTopToolbarCustomActions={({ table }) => (
          <Button color="success" onClick={() => handleGotoMntPage("CREATION",  "")} variant="contained" size="sm" >
            CREATE TEAM
          </Button>
        )}
      />
      </>
        )}
    </div>
  );
}

export default AdminTeams;