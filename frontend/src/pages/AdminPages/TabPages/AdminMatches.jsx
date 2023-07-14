import { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import { Button, MenuItem } from '@mui/material';

const AdminMatches = () => {

  const [matchesList, setMatchesList] = useState([])

  useEffect(() => {
    setMatchesList([ 
      { matchId: "648d3815252cbe610b0970d9", leagueName: "York Soccer League 2023", teamName1: "Vikings", teamName2: "Dodgers", dateOfMatch: "2023-07-01", locationOfMatch: "Toronto"}, 
      { matchId: "648d3815252cbe610b0970da", leagueName: "York Soccer League 2023", teamName1: "Warriors", teamName2: "Tigers", dateOfMatch: "2023-07-02", locationOfMatch: "Toronto"}, 
      { matchId: "648d3815252cbe610b0970db", leagueName: "York Soccer League 2023", teamName1: "Giants", teamName2: "Rockets", dateOfMatch: "2023-07-03", locationOfMatch: "Toronto"}, 
      { matchId: "648d3815252cbe610b0970dc", leagueName: "York Soccer League 2023", teamName1: "Hawks", teamName2: "Dragons", dateOfMatch: "2023-07-04", locationOfMatch: "Toronto"}, 
      { matchId: "648d3815252cbe610b0970dd", leagueName: "York Soccer League 2023", teamName1: "Falcons", teamName2: "Bulls", dateOfMatch: "2023-07-05", locationOfMatch: "Toronto"}, 
      { matchId: "648d3815252cbe610b0970de", leagueName: "Mississauga Basketball League 2023", teamName1: "Eagles", teamName2: "Scorpions", dateOfMatch: "2023-07-06", locationOfMatch: "Mississauga"}, 
      { matchId: "648d3815252cbe610b0970df", leagueName: "Mississauga Basketball League 2023", teamName1: "Bulldogs", teamName2: "Spartans", dateOfMatch: "2023-07-07", locationOfMatch: "Mississauga"}, 
      { matchId: "648d3815252cbe610b0970e0", leagueName: "Mississauga Basketball League 2023", teamName1: "Wildcats", teamName2: "Hyenas", dateOfMatch: "2023-07-08", locationOfMatch: "Mississauga"}, 
      { matchId: "648d3815252cbe610b0970e1", leagueName: "Mississauga Basketball League 2023", teamName1: "Eagles", teamName2: "Bulldogs", dateOfMatch: "2023-07-09", locationOfMatch: "Mississauga"}, 
      { matchId: "648d3815252cbe610b0970e2", leagueName: "Mississauga Basketball League 2023", teamName1: "Spartans", teamName2: "Wildcats", dateOfMatch: "2023-07-10", locationOfMatch: "Mississauga"}, 
    ])
  }, [])

  const navigate = useNavigate();
  const columns = useMemo(() => [
      { accessorKey: 'matchId', header: 'Match Id', filterVariant: 'text', size: 50 },
      { accessorKey: 'leagueName', header: 'League Name', filterVariant: 'text', size: 100 },
      { accessorKey: 'teamName1', header: 'Team 1 Name', filterVariant: 'text', size: 100 },
      { accessorKey: 'teamName2', header: 'Team 2 Name', filterVariant: 'text', size: 100 },
      { accessorKey: 'dateOfMatch', header: 'Date of Match', filterVariant: 'text', size: 50 },
      { accessorKey: 'locationOfMatch', header: 'Location of Match', filterVariant: 'text', size: 100 },
    ], [], );

  const handleGotoMntPage = (action, matchId) => {
    navigate('/adminmatchupdate/' + matchId)
  }

  const validateInput = () => {
      let errResp = false; 
      let errMsgs = []; 
      let focusON = false;
      
      return errResp; 
  }
  return (
    <div>
      <MaterialReactTable
        columns={columns} data={matchesList} enableFacetedValues initialState={{ showColumnFilters: true }}
        enableRowActions
        renderRowActionMenuItems={({ row }) => [
          <MenuItem key="edit" onClick={() => handleGotoMntPage("EDIT",  row.original.matchId)}>
            Edit
          </MenuItem>,
        ]}
      />
    </div>
  );
}

export default AdminMatches;