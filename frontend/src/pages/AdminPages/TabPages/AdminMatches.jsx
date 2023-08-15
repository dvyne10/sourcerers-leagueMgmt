import { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import { Button, MenuItem } from '@mui/material';
import {getToken} from "../../../hooks/auth";

const backend = import.meta.env.MODE === "development" ? "http://localhost:8000" : "https://panicky-robe-mite.cyclic.app";

const AdminMatches = () => {
  const token = `Bearer ${getToken()}`
  const [matchesList, setMatchesList] = useState([])
  const [errorMessage, setErrorMessage] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true)
    fetch(`${backend}/admingetmatches`, {
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
        setMatchesList(data.details)
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
      { accessorKey: 'matchId', header: 'Match Id', filterVariant: 'text', size: 50 },
      { accessorKey: 'leagueName', header: 'League Name', filterVariant: 'text', size: 100 },
      { accessorKey: 'teamId1', header: 'Team 1 ID', filterVariant: 'text', size: 100 },
      { accessorKey: 'teamId2', header: 'Team 2 ID', filterVariant: 'text', size: 100 },
      { accessorKey: 'dateOfMatch', header: 'Date of Match', filterVariant: 'text', size: 50 },
      { accessorKey: 'locationOfMatch', header: 'Location of Match', filterVariant: 'text', size: 100 },
    ], [], );

  const handleGotoMntPage = (action, matchId) => {
    navigate('/adminmatchupdate/' + matchId)
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
        columns={columns} data={matchesList} enableFacetedValues initialState={{ showColumnFilters: true }}
        enableRowActions
        renderRowActionMenuItems={({ row }) => [
          <MenuItem key="edit" onClick={() => handleGotoMntPage("EDIT",  row.original.matchId)}>
            Edit
          </MenuItem>,
        ]}
      />
      </>
        )}
    </div>
  );
}

export default AdminMatches;