import { Col, Container, Row } from "react-bootstrap";
import { MaterialReactTable } from "material-react-table";
import { useMemo } from "react";
import {
  Email as EmailIcon,
  DraftsOutlined as OpenEmailIcon,
} from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import useNotification from "../hooks/notification";

const Notification = () => {
  const { notifications, setNotifications } = useNotification();

  const columns = useMemo(
    () => [
      // {
      //   header: "Title",
      //   accessorKey: "title",
      // },
      {
        header: "Content",
        accessorKey: "content",
      },
      // {
      //   header: "Status",
      //   accessorKey: "status",
      // },
    ],
    []
  );
  return (
    <>
      <div
        style={{
          width: "100%",
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container>
          <Row className="align-items-end">
            <Col></Col>
            <Col>
              <h1 className="center-header">NOTIFICATION</h1>
            </Col>
            <Col></Col>
          </Row>
        </Container>
        <div
          style={{
            marginInline: "20%",
          }}
        >
          <MaterialReactTable
            data={notifications}
            // muiTableContainerProps={{ sx: { maxHeight: "450px",width:"800px"} }}
            // muiTableProps={{}}
            columns={columns}
            enableExpanding
            // onExpandedChange={()=>{
            //   // console.log(e)
            //   // setExpandedObject({})
            // }}
            expandRowsFn={() => {
              console.log("kkkll");
            }}
            enableColumnOrdering
            enableRowActions
            renderRowActions={({ row }) => (
              <Box>
                <IconButton
                  color="primary"
                  onClick={() => {
                    notifications.map(() => {
                      notifications[row.index].read =
                        !notifications[row.index].read;
                      setNotifications([...notifications]);
                    });
                  }}
                >
                  {notifications[row.index].read ? (
                    <OpenEmailIcon />
                  ) : (
                    <EmailIcon />
                  )}
                </IconButton>
              </Box>
            )}
            renderDetailPanel={() => (
              <div
                style={{
                  display: "flex",
                  padding: 0,
                  margin: 0,
                }}
              >
                <div style={{ width: "21%" }}></div>
                <div style={{ width: "25%" }}></div>
                <div style={{ width: "50%" }}>
                  this is a continuation of the notification
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </>
  );
};

export default Notification;
