import { Button, Col, Container, Row } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";
import { MaterialReactTable } from "material-react-table";
import { useMemo, useState } from "react";
import {
  Delete as DeleteIcon,
  Email as EmailIcon,
  DraftsOutlined as OpenEmailIcon,
} from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";

const notifications = [
  {
    read: true,
    title: "notification",
    content: "this is is a new notification",
  },
  {
    read: false,
    title: "notification",
    content: "this is is a new notification",
  },
  {
    read: true,
    title: "notification",
    content: "this is is a new notification",
  },
  {
    read: false,
    title: "notification",
    content: "this is is a new notification",
  },
  {
    read: false,
    title: "notification",
    content: "this is is a new notification",
  },
];

const Notification = () => {
  const [notificationData, setNotificationData] = useState(notifications);
  const columns = useMemo(
    () => [
      {
        header: "Title",
        accessorKey: "title",
      },
      {
        header: "Content",
        accessorKey: "content",
      },
      {
        header: "Status",
        accessorKey: "status",
      },
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
            <Col className="text-start">
              <Button size="sm" variant="outline-secondary">
                <FaFilter></FaFilter>Filter
              </Button>
            </Col>
            <Col>
              <h1 className="center-header">NOTIFICATION</h1>
            </Col>
            <Col></Col>
          </Row>
        </Container>
        <div style={{ width: "100%", justifyContent: "center" }}>
          <MaterialReactTable
            data={notificationData}
            columns={columns}
            // enableRowSelection
            enableColumnOrdering
            enableRowActions
            renderRowActions={({ row, table }) => (
              <Box>
                <IconButton
                  color="error"
                  onClick={() => {
                    notificationData.splice(row.index, 1);
                    setNotificationData([...notificationData]);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  color="primary"
                  onClick={() => {
                    notificationData.map(() => {
                      notificationData[row.index].read =
                        !notificationData[row.index].read;
                      setNotificationData([...notificationData]);
                    });
                  }}
                >
                  {notificationData[row.index].read ? (
                    <OpenEmailIcon />
                  ) : (
                    <EmailIcon />
                  )}
                </IconButton>
              </Box>
            )}
          />
        </div>
      </div>
    </>
  );
};

export default Notification;
