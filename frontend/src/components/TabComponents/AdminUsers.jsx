import React, { useMemo } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { useNavigate } from 'react-router-dom';

const data = [
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
];

function AdminUsers() {
  const navigate = useNavigate();
  const columns = useMemo(
    () => [
      {
        accessorKey: 'status',
        header: 'Status',
        filterVariant: 'select',
      },
      {
        accessorKey: 'username',
        header: 'Username',
        filterVariant: 'text',
        size: 100,
      },
      {
        accessorKey: 'fullName',
        header: 'Full Name',
        filterVariant: 'text',
        size: 100,
      },
      {
        accessorKey: 'email',
        header: 'Email Address',
        filterVariant: 'text',
        size: 100,
      },
      {
        accessorKey: 'userType',
        header: 'Role',
        filterVariant: 'select',
      },
    ],
    [],
  );

  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableFacetedValues
      initialState={{ showColumnFilters: true }}
      muiTableBodyRowProps={({ row }) => ({
        onDoubleClick: () => {
          console.log(row.original.userId);
          navigate('/updateaccount/' + row.original.userId)
        },
        sx: {
          cursor: 'pointer', //you might want to change the cursor too when adding an onClick
        },
      })}
    />
  );
};

export default AdminUsers;