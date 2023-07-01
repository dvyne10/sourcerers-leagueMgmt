import { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import { Button, MenuItem } from '@mui/material';

const AdminLeagues = () => {

  const [leaguesList, setLeaguesList] = useState([])

  useEffect(() => {
    setLeaguesList([ 
      { leagueId: "648ba154251b78d7946df35d", leagueName: "Hogsmeade League 2023", location: "Toronto, ON", division: "Boys", sport: "Soccer", sportId: "648ba153251b78d7946df311" },
      { leagueId: "648e9013466c1c995745907c", leagueName: "York Soccer League 2023", location: "North York, Toronto, ON", division: "Mixed", sport: "Soccer", sportId: "648ba153251b78d7946df311" },
      { leagueId: "648e9018466c1c9957459258", leagueName: "Mississauga League 2023", location: "Mississauga, ON", division: "Men's", sport: "Basketball", sportId: "648ba153251b78d7946df322" },
    ])
  }, [])

  const navigate = useNavigate();
  const columns = useMemo(() => [
      { accessorKey: 'leagueName', header: 'League Name', filterVariant: 'text', size: 100 },
      { accessorKey: 'location', header: 'Team Location', filterVariant: 'text', size: 100 },
      { accessorKey: 'division', header: 'Division', filterVariant: 'select', size: 50 },
      { accessorKey: 'sport', header: 'Sport', filterVariant: 'select', size: 50 },
    ], [], );

  const handleDeleteLeague = (leagueId) => {
    let newList = [...leaguesList]
    let index = newList.findIndex (i => i.leagueId === leagueId);
    if (confirm(`Delete ${newList[index].leagueName}?\nPlease click on OK if you wish to proceed.`)) {
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
            CREATE TEAM
          </Button>
        )}
      />
    </div>
  );
}

export default AdminLeagues;