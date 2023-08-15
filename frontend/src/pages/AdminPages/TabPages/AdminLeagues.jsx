import { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import { Button, MenuItem } from '@mui/material';
import {getToken} from "../../../hooks/auth";

const backend = import.meta.env.MODE === "development" ? "http://localhost:8000" : "https://panicky-robe-mite.cyclic.app";

const AdminLeagues = () => {
  const token = `Bearer ${getToken()}`
  const [leaguesList, setLeaguesList] = useState([])
  const [errorMessage, setErrorMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true)
    fetch(`${backend}/admingetleagues`, {
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
        setLeaguesList(data.details)
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
      { accessorKey: 'leagueName', header: 'League Name', filterVariant: 'text', size: 100 },
      { accessorKey: 'location', header: 'Team Location', filterVariant: 'text', size: 100 },
      { accessorKey: 'division', header: 'Division', filterVariant: 'select', size: 50 },
      { accessorKey: 'sportsName', header: 'Sport', filterVariant: 'select', size: 50 },
    ], [], );

  const handleDeleteLeague = (leagueId) => {
    let newList = [...leaguesList]
    let index = newList.findIndex (i => i.leagueId === leagueId);
    if (confirm(`Delete ${newList[index].leagueName}?\nPlease click on OK if you wish to proceed.`)) {
      fetch(`${backend}/admindeleteleague/${newList[index].leagueId}`, {
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
        }
        setIsLoading(false)
      }).catch((error) => {
        console.log(error)
        setIsLoading(false)
      })
      newList.splice(index, 1)
      setLeaguesList(newList)
    } else {
      console.log("Deletion cancelled")
    } 
  }

  const handleGotoMntPage = (action, leagueId) => {
    if (action === "CREATION") {
      navigate('/adminleaguecreation')
    } else {
      navigate('/adminleagueupdate/' + leagueId)
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
        columns={columns} data={leaguesList} enableFacetedValues initialState={{ showColumnFilters: true }}
        enableRowActions
        renderRowActionMenuItems={({ row }) => [
          <MenuItem key="edit" onClick={() => handleGotoMntPage("EDIT",  row.original.leagueId)}>
            Edit
          </MenuItem>,
          <MenuItem key="delete" onClick={() => handleDeleteLeague(row.original.leagueId)}>
            Delete
          </MenuItem>,
        ]}
        renderTopToolbarCustomActions={({ table }) => (
          <Button color="success" onClick={() => handleGotoMntPage("CREATION",  "")} variant="contained" size="sm" >
            CREATE LEAGUE
          </Button>
        )}
      />
      </>
        )}
    </div>
  );
}

export default AdminLeagues;