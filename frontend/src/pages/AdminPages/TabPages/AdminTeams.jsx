import { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import { Button, MenuItem } from '@mui/material';

const AdminTeams = () => {

  const [teamsList, setTeamsList] = useState([])

  useEffect(() => {
    setTeamsList([ 
      { teamId: "648e224f91a1a82229a6c11f", teamName: "Vikings", location: "Toronto, ON", division: "Mixed", sport: "Soccer", sportId: "648ba153251b78d7946df311" },
      { teamId: "648e24201b1bedfb32de974c", teamName: "Dodgers", location: "Toronto, ON", division: "Mixed", sport: "Soccer", sportId: "648ba153251b78d7946df311" },
      { teamId: "648e6ddb2b6cc0ba74f41d32", teamName: "Warriors", location: "Toronto, ON", division: "Mixed", sport: "Soccer", sportId: "648ba153251b78d7946df311" },
      { teamId: "648e7042be708eef6f20f756", teamName: "Tigers", location: "Toronto, ON", division: "Mixed", sport: "Soccer", sportId: "648ba153251b78d7946df311" },
      { teamId: "648e7195202d60616b612716", teamName: "Giants", location: "Toronto, ON", division: "Mixed", sport: "Soccer", sportId: "648ba153251b78d7946df311" },
      { teamId: "648e80bb453c973512704aea", teamName: "Eagles", location: "Toronto, ON", division: "Men's", sport: "Basketball", sportId: "648ba153251b78d7946df322" },
      { teamId: "648e8201e8dd079400e51425", teamName: "Scorpions", location: "Toronto, ON", division: "Men's", sport: "Basketball", sportId: "648ba153251b78d7946df322" },
      { teamId: "648e82d4840d5022bf9bcd18", teamName: "Bulldogs", location: "Toronto, ON", division: "Men's", sport: "Basketball", sportId: "648ba153251b78d7946df322" },
      { teamId: "648e83dce8189cfa6d33369c", teamName: "Spartans", location: "Toronto, ON", division: "Men's", sport: "Basketball", sportId: "648ba153251b78d7946df322" },
      { teamId: "648e8434367885750f1dcd28", teamName: "Wildcats", location: "Toronto, ON", division: "Men's", sport: "Basketball", sportId: "648ba153251b78d7946df322" },
      { teamId: "648e84813a40bcb73584b67b", teamName: "Hyenas", location: "Toronto, ON", division: "Men's", sport: "Basketball", sportId: "648ba153251b78d7946df322" },
    ])
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
    </div>
  );
}

export default AdminTeams;