import { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import { Button, MenuItem } from '@mui/material';

const AdminSystemParameters = () => {

  const [parametersList, setParametersList] = useState([])
  const canBeDeletedParms = ["sport", "statistic", "position", "notification_type" ]

  useEffect(() => {
    setParametersList([ 
      { sysParmId: "648d3815252cbe610b0970d9", parmType: "sport",     parmPreview: "sportsTypeId : SOCCER, sportsName : Soccer" }, 
      { sysParmId: "648d3815252cbe610b0970da", parmType: "statistic", parmPreview: "statisticsId : SC01, statShortDesc : Goals, statLongDesc : Goals" }, 
      { sysParmId: "648d3815252cbe610b0970db", parmType: "position",  parmPreview: "positionId : SCP01, positionDesc : Team Captain"}, 
      { sysParmId: "648d3815252cbe610b0970dc", parmType: "login",     parmPreview: "numberOfLoginDtlsToKeep : 10, defaultLoginTries : 5, maxAdditionalLoginTries : 5" }, 
      { sysParmId: "648d3815252cbe610b0970dd", parmType: "dfltAnnouncement", parmPreview: "defaultMsgTeamAncmt : Team &teamName is looking for players!, defaultMsgLeagueAncmt : League &league" }, 
      { sysParmId: "648d3815252cbe610b0970de", parmType: "maxParms",  parmPreview: "maxActiveLeaguesCreated : 5, startLeagueApprovalExp : 7, notifHousekeeping : 30" }, 
      { sysParmId: "648d3815252cbe610b0970df", parmType: "notification_type", parmPreview: "notifId : APMDU, infoOrApproval : APRVREJ, message : &teamName has updated score for &matchid " }, 
      { sysParmId: "648d3815252cbe610b0970e0", parmType: "sport",     parmPreview: "sportsTypeId : BASKET, sportsName : Basketball" }, 
      { sysParmId: "648d3815252cbe610b0970e1", parmType: "statistic", parmPreview: "statisticsId : BB01, statShortDesc : Points, statLongDesc : Points" }, 
      { sysParmId: "648d3815252cbe610b0970e2", parmType: "position",  parmPreview: "statisticsId : BBP02, positionDesc : Point Guard"}, 
    ])
  }, [])

  const navigate = useNavigate();
  const columns = useMemo(() => [
      { accessorKey: 'sysParmId', header: 'Parameter Id', filterVariant: 'text', size: 50 },
      { accessorKey: 'parmType', header: 'Parameter Type', filterVariant: 'select', size: 30 },
      { accessorKey: 'parmPreview', header: 'Parameter Value (Preview)', filterVariant: 'text', size: 150 },
    ], [], );

  const handleDeleteParameter = (sysParmId) => {
    let newList = [...parametersList]
    let index = newList.findIndex (i => i.sysParmId === sysParmId);
    let parmTypeDelete = newList[index].parmType
    if (!canBeDeletedParms.find(parm => parm === parmTypeDelete)) {
      alert('Cannot delete this type of parameter.')
    } else {
      if (confirm(`Delete ${newList[index].sysParmId}?\nPlease click on OK if you wish to proceed.`)) {
        newList.splice(index, 1)
        setParametersList(newList)
      } else {
        console.log("Deletion cancelled")
      } 
    }
  }

  const handleGotoMntPage = (action, sysParmId) => {
    if (action === "CREATION") {
      navigate('/adminparmcreation')
    } else {
      navigate('/adminparmupdate/' + sysParmId)
    }
  }

  return (
    <div>
      <MaterialReactTable
        columns={columns} data={parametersList} enableFacetedValues initialState={{ showColumnFilters: true }}
        enableRowActions
        renderRowActionMenuItems={({ row }) => [
          <MenuItem key="edit" onClick={() => handleGotoMntPage("EDIT",  row.original.sysParmId)}>
            Edit
          </MenuItem>,
          <MenuItem key="delete" onClick={() => handleDeleteParameter(row.original.sysParmId)}>
            Delete
          </MenuItem>,
        ]}
        renderTopToolbarCustomActions={({ table }) => (
          <Button color="success" onClick={() => handleGotoMntPage("CREATION",  "")} variant="contained" size="sm" >
            CREATE PARAMETER
          </Button>
        )}
      />
    </div>
  );
}

export default AdminSystemParameters;