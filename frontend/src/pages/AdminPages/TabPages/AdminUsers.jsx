import { useState, useEffect, useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';
import { Button, MenuItem } from '@mui/material';

const AdminUsers = () => {

  const [usersList, setUsersList] = useState([])

  useEffect(() => {
    setUsersList([ 
      { status: "ACTV", userId: "648d3815252cbe610b0970d9", username: "sMcdowell", fullName: "Scarlet Mcdowell", email: "eros.non@google.ca", userType: "USER" },
      { status: "ACTV", userId: "648d3815252cbe610b0970da", username: "uWatts", fullName: "Ursa Watts", email: "consequat.lectus.sit@outlook.ca", userType: "USER"  },
      { status: "ACTV", userId: "648d3815252cbe610b0970db", username: "pRodriguez", fullName: "Phoebe Rodriguez", email: "sodales.nisi@hotmail.org", userType: "USER"  },
      { status: "ACTV", userId: "648d3815252cbe610b0970dc", username: "zHickman", fullName: "Zachary Hickman", email: "sed.dictum.proin@yahoo.org", userType: "USER"  },
      { status: "ACTV", userId: "648d3815252cbe610b0970dd", username: "kBall", fullName: "Kylynn Ball", email: "mollis.lectus@hotmail.net", userType: "USER"  },
      { status: "ACTV", userId: "648d3815252cbe610b0970de", username: "aHorn", fullName: "Athena Horn", email: "donec.non.justo@outlook.org", userType: "USER"  },
      { status: "ACTV", userId: "648d3815252cbe610b0970df", username: "bChristian", fullName: "Bruno Christian", email: "vulputate@google.edu", userType: "USER"  },
      { status: "ACTV", userId: "648d3815252cbe610b0970e0", username: "mHodge", fullName: "Meghan Hodge", email: "morbi@yahoo.ca", userType: "USER"  },
      { status: "ACTV", userId: "648d3815252cbe610b0970e1", username: "oBurt", fullName: "Olivia Burt", email: "posuere@aol.edu", userType: "USER"  },
      { status: "ACTV", userId: "648d3815252cbe610b0970e2", username: "kJustice", fullName: "Katelyn Justice", email: "ut@protonmail.ca", userType: "USER"  },
    ])
  }, [])

  const navigate = useNavigate();
  const columns = useMemo(() => [
      { accessorKey: 'status', header: 'Status', filterVariant: 'select', size: 50 },
      { accessorKey: 'username', header: 'Username', filterVariant: 'text', size: 50 },
      { accessorKey: 'fullName', header: 'Full Name', filterVariant: 'text', size: 100 },
      { accessorKey: 'email', header: 'Email Address', filterVariant: 'text', size: 100 },
      { accessorKey: 'userType', header: 'Role', filterVariant: 'select', size: 50 },
    ], [], );

  const handleDeleteUser = (userId) => {
    let newList = [...usersList]
    let index = newList.findIndex (i => i.userId === userId);
    if (confirm(`Delete ${newList[index].fullName}?\nPlease click on OK if you wish to proceed.`)) {
      newList.splice(index, 1)
      setUsersList(newList)
    } else {
      console.log("Deletion cancelled")
    } 
  }

  const handleGotoMntPage = (action, userId) => {
    if (action === "CREATION") {
      navigate('/adminusercreation')
    } else {
      navigate('/adminuserupdate/' + userId)
    }
  }

  return (
    <div>
      <MaterialReactTable
        columns={columns} data={usersList} enableFacetedValues initialState={{ showColumnFilters: true }}
        enableRowActions
        renderRowActionMenuItems={({ row }) => [
          <MenuItem key="edit" onClick={() => handleGotoMntPage("EDIT",  row.original.userId)}>
            Edit
          </MenuItem>,
          <MenuItem key="delete" onClick={() => handleDeleteUser(row.original.userId)}>
            Delete
          </MenuItem>,
        ]}
        renderTopToolbarCustomActions={({ table }) => (
          <Button color="success" onClick={() => handleGotoMntPage("CREATION",  "")} variant="contained" size="sm" >
            CREATE USER ACCOUNT
          </Button>
        )}
      />
    </div>
  );
}

export default AdminUsers;