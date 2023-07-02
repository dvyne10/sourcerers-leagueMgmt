import { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import { Button, MenuItem } from '@mui/material';

const AdminRequests = () => {

  const [requestsList, setRequestsList] = useState([])
  const requestTypeOptions = [ 
    {label: "Approval request for match details update", value: "id1"},
    {label: "Approval request from team admin to player to join team", value: "id2"},
    {label: "Approval request from player to team admin to join team", value: "id3"},
    {label: "Approval request from league admin to team to join league", value: "id4"},
    {label: "Approval request from team admin to league admins to join league", value: "id5"},
    {label: "Approval request from league admin to remove another team from the league", value: "id6"},
    {label: "Approval request to start league", value: "id7"}, 
  ]

  useEffect(() => {
    setRequestsList([ 
      { requestId: "648d3815252cbe610b0970d9", username: "sMcdowell", reqType: "id1", requestLabel: requestTypeOptions[0].label, reqStatus: "PEND", reqExp: "2023-07-07 14:03:16"}, 
      { requestId: "648d3815252cbe610b0970da", username: "uWatts", reqType: "id2", requestLabel: requestTypeOptions[1].label, reqStatus: "APRV", reqExp: "2023-07-08 14:03:16"},
      { requestId: "648d3815252cbe610b0970db", username: "pRodriguez", reqType: "id3", requestLabel: requestTypeOptions[2].label, reqStatus: "APRV", reqExp: "2023-07-09 14:03:16" },
      { requestId: "648d3815252cbe610b0970dc", username: "zHickman",reqType: "id4", requestLabel: requestTypeOptions[3].label, reqStatus: "PEND", reqExp: "2023-07-10 14:03:16"},
      { requestId: "648d3815252cbe610b0970dd", username: "kBall", reqType: "id5", requestLabel: requestTypeOptions[4].label, reqStatus: "RJCT", reqExp: "2023-07-07 14:03:16" },
      { requestId: "648d3815252cbe610b0970de", username: "zHickman", reqType: "id6", requestLabel: requestTypeOptions[5].label, reqStatus: "PEND", reqExp: "2023-07-08 14:03:16" },
      { requestId: "648d3815252cbe610b0970df", username: "sMcdowell", reqType: "id7", requestLabel: requestTypeOptions[6].label, reqStatus: "EXP", reqExp: "2023-07-01 14:03:16" },
      { requestId: "648d3815252cbe610b0970e0", username: "mHodge", reqType: "id1", requestLabel: requestTypeOptions[0].label, reqStatus: "APRV", reqExp: "2023-07-09 14:03:16" },
      { requestId: "648d3815252cbe610b0970e1", username: "oBurt", reqType: "id2", requestLabel: requestTypeOptions[1].label, reqStatus: "RJCT", reqExp: "2023-07-10 14:03:16" },
      { requestId: "648d3815252cbe610b0970e2", username: "uWatts", reqType: "id3", requestLabel: requestTypeOptions[2].label, reqStatus: "PEND", reqExp: "2023-07-17 14:03:16" },
    ])
  }, [])

  const navigate = useNavigate();
  const columns = useMemo(() => [
      { accessorKey: 'reqStatus', header: 'Status', filterVariant: 'select', size: 20 },
      { accessorKey: 'requestId', header: 'Request Id', filterVariant: 'text', size: 100 },
      { accessorKey: 'username', header: 'Requestor', filterVariant: 'text', size: 30 },
      { accessorKey: 'requestLabel', header: 'Request Type', filterVariant: 'select', size: 100 },
      { accessorKey: 'reqExp', header: 'Request Expiry', filterVariant: 'text', size: 100 },
    ], [], );

  const handleDeleteRequest = (requestId) => {
    let newList = [...requestsList]
    let index = newList.findIndex (i => i.requestId === requestId);
    if (confirm(`Delete ${newList[index].requestId}?\nPlease click on OK if you wish to proceed.`)) {
      newList.splice(index, 1)
      requestsList(newList)
    } else {
      console.log("Deletion cancelled")
    } 
  }

  const handleGotoMntPage = (action, requestId) => {
    if (action === "CREATION") {
      navigate('/adminrequestcreation')
    } else {
      navigate('/adminrequestupdate/' + requestId)
    }
  }

  return (
    <div>
      <MaterialReactTable
        columns={columns} data={requestsList} enableFacetedValues initialState={{ showColumnFilters: true }}
        enableRowActions
        renderRowActionMenuItems={({ row }) => [
          <MenuItem key="edit" onClick={() => handleGotoMntPage("EDIT",  row.original.requestId)}>
            Edit
          </MenuItem>,
          <MenuItem key="delete" onClick={() => handleDeleteRequest(row.original.requestId)}>
            Delete
          </MenuItem>,
        ]}
        renderTopToolbarCustomActions={({ table }) => (
          <Button color="success" onClick={() => handleGotoMntPage("CREATION",  "")} variant="contained" size="sm" >
            CREATE REQUEST
          </Button>
        )}
      />
    </div>
  );
}

export default AdminRequests;