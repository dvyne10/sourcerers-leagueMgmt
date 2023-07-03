import { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import { Button, MenuItem } from '@mui/material';

const AdminNotifications = () => {

  const [notifsList, setNotifsList] = useState([])
  const notifTypeOptions = [ 
    {label: "Match details update is rejected", value: "id1", actionType: "INFO", actionLabel: "Information only"},
    {label: "Match details update is approved", value: "id2", actionType: "INFO", actionLabel: "Information only"},
    {label: "Invite to join team was accepted", value: "id3", actionType: "INFO", actionLabel: "Information only"},
    {label: "Invite to join team was rejected", value: "id4", actionType: "INFO", actionLabel: "Information only"},
    {label: "Request to join team was accepted", value: "id5", actionType: "INFO", actionLabel: "Information only"},
    {label: "Request to join team was rejected", value: "id6", actionType: "INFO", actionLabel: "Information only"},
    {label: "Invite to join league was accepted", value: "id7", actionType: "INFO", actionLabel: "Information only"}, 
    {label: "Invite to join league was rejected", value: "id8", actionType: "INFO", actionLabel: "Information only"}, 
    {label: "Request to join league was accepted", value: "id9", actionType: "INFO", actionLabel: "Information only"}, 
    {label: "Request to join league was rejected", value: "id10", actionType: "INFO", actionLabel: "Information only"}, 
    {label: "A team joined the league", value: "id11", actionType: "INFO", actionLabel: "Information only"}, 
    {label: "A team left the league", value: "id12", actionType: "INFO", actionLabel: "Information only"}, 
    {label: "A team has been removed from the league", value: "id13", actionType: "INFO", actionLabel: "Information only"}, 
    {label: "A player left the team", value: "id14", actionType: "INFO", actionLabel: "Information only"}, 
    {label: "Player was removed from the team", value: "id15", actionType: "INFO", actionLabel: "Information only"}, 
    {label: "League has started", value: "id16", actionType: "INFO", actionLabel: "Information only"}, 
    {label: "League has ended", value: "id17", actionType: "INFO", actionLabel: "Information only"}, 
    {label: "Contact us", value: "id18", actionType: "INFO", actionLabel: "Information only"}, 
    {label: "Approval request for match details update", value: "id19", actionType: "APRVREJ", actionLabel: "For approval or rejection"},
    {label: "Approval request from team admin to player to join team", value: "id20", actionType: "APRVREJ", actionLabel: "For approval or rejection"},
    {label: "Approval request from player to team admin to join team", value: "id21", actionType: "APRVREJ", actionLabel: "For approval or rejection"},
    {label: "Approval request from league admin to team to join league", value: "id22", actionType: "APRVREJ", actionLabel: "For approval or rejection"},
    {label: "Approval request from team admin to league admins to join league", value: "id23", actionType: "APRVREJ", actionLabel: "For approval or rejection"},
    {label: "Approval request from league admin to remove another team from the league", value: "id24", actionType: "APRV", actionLabel: "For approval"},
    {label: "Approval request to start league", value: "id25", actionType: "APRV", actionLabel: "For approval"}, 
  ]

  useEffect(() => {
    setNotifsList([ 
      { notifId: "648d3815252cbe610b0970d9", receiverUsername: "sMcdowell", notifType: "id19", notifLabel: notifTypeOptions[18].label, actionLabel: notifTypeOptions[18].actionLabel }, 
      { notifId: "648d3815252cbe610b0970da", receiverUsername: "uWatts", notifType: "id20", notifLabel: notifTypeOptions[19].label, actionLabel: notifTypeOptions[19].actionLabel},
      { notifId: "648d3815252cbe610b0970db", receiverUsername: "pRodriguez", notifType: "id21", notifLabel: notifTypeOptions[20].label,  actionLabel: notifTypeOptions[20].actionLabel},
      { notifId: "648d3815252cbe610b0970dc", receiverUsername: "zHickman",notifType: "id22", notifLabel: notifTypeOptions[21].label, actionLabel: notifTypeOptions[21].actionLabel},
      { notifId: "648d3815252cbe610b0970dd", receiverUsername: "kBall", notifType: "id23", notifLabel: notifTypeOptions[22].label, actionLabel: notifTypeOptions[22].actionLabel },
      { notifId: "648d3815252cbe610b0970de", receiverUsername: "zHickman", notifType: "id24", notifLabel: notifTypeOptions[23].label, actionLabel: notifTypeOptions[23].actionLabel },
      { notifId: "648d3815252cbe610b0970df", receiverUsername: "sMcdowell", notifType: "id25", notifLabel: notifTypeOptions[24].label, actionLabel: notifTypeOptions[24].actionLabel },
      { notifId: "648d3815252cbe610b0970e0", receiverUsername: "mHodge", notifType: "id1", notifLabel: notifTypeOptions[0].label, actionLabel: notifTypeOptions[0].actionLabel },
      { notifId: "648d3815252cbe610b0970e1", receiverUsername: "oBurt", notifType: "id2", notifLabel: notifTypeOptions[1].label, actionLabel: notifTypeOptions[1].actionLabel },
      { notifId: "648d3815252cbe610b0970e2", receiverUsername: "uWatts", notifType: "id3", notifLabel: notifTypeOptions[2].label, actionLabel: notifTypeOptions[2].actionLabel },
    ])
  }, [])

  const navigate = useNavigate();
  const columns = useMemo(() => [
      { accessorKey: 'notifId', header: 'Notification Id', filterVariant: 'text', size: 100 },
      { accessorKey: 'receiverUsername', header: 'Receiver', filterVariant: 'text', size: 30 },
      { accessorKey: 'notifLabel', header: 'Notification Type', filterVariant: 'select', size: 100 },
      { accessorKey: 'actionLabel', header: 'Action Type', filterVariant: 'select', size: 100 },
    ], [], );

  const handleDeleteNotif = (notifId) => {
    let newList = [...notifsList]
    let index = newList.findIndex (i => i.notifId === notifId);
    if (confirm(`Delete ${newList[index].notifId}?\nPlease click on OK if you wish to proceed.`)) {
      newList.splice(index, 1)
      notifsList(newList)
    } else {
      console.log("Deletion cancelled")
    } 
  }

  const handleGotoMntPage = (action, notifId) => {
    if (action === "CREATION") {
      navigate('/adminnotifcreation')
    } else {
      navigate('/adminnotifupdate/' + notifId)
    }
  }

  return (
    <div>
      <MaterialReactTable
        columns={columns} data={notifsList} enableFacetedValues initialState={{ showColumnFilters: true }}
        enableRowActions
        renderRowActionMenuItems={({ row }) => [
          <MenuItem key="edit" onClick={() => handleGotoMntPage("EDIT",  row.original.notifId)}>
            Edit
          </MenuItem>,
          <MenuItem key="delete" onClick={() => handleDeleteNotif(row.original.notifId)}>
            Delete
          </MenuItem>,
        ]}
        renderTopToolbarCustomActions={({ table }) => (
          <Button color="success" onClick={() => handleGotoMntPage("CREATION",  "")} variant="contained" size="sm" >
            CREATE NOTIFICATION
          </Button>
        )}
      />
    </div>
  );
}

export default AdminNotifications;