import Card from "react-bootstrap/Card";

const Privacy = () => {
  return (
    <>
      <div
        // className="App"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F8F9FA",
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        {" "}
        <h1 style={{ align: "center" }}>Privacy Policy</h1>
      </div>
      <br />
      <br />
      <div className="d-flex justify-content-center" >
        <Card style={{ width: "60rem", padding: 20}}>
          <Card.Header as="h5">
            ABOUT YOUR PRIVACY POLICY WITH PLAYPAL
          </Card.Header>
          <Card.Body>

            <Card.Text className="text-dark">
            PlayPal is committed to a voluntary privacy policy for our users. This Privacy Policy relates to your privacy as a member of our website at https://playpal.netlify.app/. The privacy of our users is important to us. Unless you authorize us to do otherwise, the Personal Information that you provide to us will be protected and not disclosed to any third parties.

            </Card.Text>
          </Card.Body>
        </Card>
      </div>
      <br />
      <div className="d-flex justify-content-center">
        <Card style={{ width: "60rem", padding: 20 }}>
          <Card.Header as="h5">
            PROTECTING YOUR PERSONAL INFORMATION
          </Card.Header>
          <Card.Body>

            <Card.Text className="text-dark">
            We will keep your Personal Information and protect it from any unauthorized access. Where your Personal Information is kept electronically, it will reside in secure data storage and be protected by passwords.

            </Card.Text>
          </Card.Body>
        </Card>
      </div>
      <br />
      <div className="d-flex justify-content-center">
        <Card style={{ width: "60rem", padding: 20 }}>
          <Card.Header as="h5">
            COLLECTION OF YOUR PERSONAL INFORMATION
          </Card.Header>

          <Card.Body >
            <Card.Text className="text-dark">
            The PlayPal requires personal information from its members in order to offer its services. This information is collected via specific website registration forms.

            </Card.Text>
          </Card.Body>
        </Card>
      </div>
      <br />
      <div className="d-flex justify-content-center">
        <Card style={{ width: "60rem", padding: 20 }}>
          <Card.Header as="h5">
            HOW YOUR PERSONAL INFORMATION IS USED
          </Card.Header>

          <Card.Body >
            <Card.Text className="text-dark">
            Part of our commitment to you is to tell you how we use and will not use the Personal Information that we collect:<br/><br/>
<ul>
<li>A very limited set of your Personal Information (name, email address, and an optional phone number) is provided when users register for the website.</li>
<li>Your details will be made available for coaches, team admins, league organizers, or other interested players to contact you.</li>
<li>Whenever we share your personal Information, we ensure to limit it to the minimum information required to complete the service.</li>
</ul>
We will not disclose any other Personal Information about you to any third party without first obtaining your consent to do so. 

            </Card.Text>
          </Card.Body>
        </Card>
      </div>
      <br />
      <div className="d-flex justify-content-center">
        <Card style={{ width: "60rem", padding: 20 }}>
          <Card.Header as="h5">
            CONTROL OF YOUR PERSONAL INFORMATION
          </Card.Header>

          <Card.Body >
            <Card.Text className="text-dark">
You control the Personal Information you provide. When you do opt to supply other Personal Information in order to be contacted privately, that information will only be made available to the intended recipient. 
<br/><br/>
When requested to provide any Personal Information, you may decline to do so.


            </Card.Text>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default Privacy;
