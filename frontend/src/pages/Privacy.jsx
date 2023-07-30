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
            PlayPal are committed to a voluntary privacy policy for our registrants. The objective of this policy is to ensure that information that could be used to identify you (Personal Information) be managed in a responsible and transparent manner.
This Privacy Policy relates to your privacy as a user of our websites at https://playpal.netlify.app/. The privacy of our members is important to us. We may request Personal Information from time to time in order to enable you to participate in and enjoy various benefits. We are committed to advising you on how we use your Personal Information. Unless you authorize us to do otherwise, we will ensure that the Personal Information that you provide to us will be protected and not disclosed to any third parties in accordance with this Privacy Policy.

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
            We will keep your Personal Information and safeguard it from unauthorized access. We will keep your Personal Information only as long as necessary or relevant for the identified purposes or as required by law. Where your Personal Information is kept electronically, it will reside in secure data storage and be protected by the passwords.

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
            The PlayPal requires personal information from its members (players, team admin, league admin and volunteers) in order to offer its various services. This information is collected via appropriate electrical forms, historical participation, and website activity logs.

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
<li>A limited set of your Personal Information can be shared with our insurer in connection with insurance coverage.</li>
<li>A much more limited set of your Personal Information -typically your name, date of birth, registration number and jersey number and position- is provided when member teams register for outside of PlayPal tournaments.</li>
<li>We share your Personal Information with our professional advisors including but not limited to the lawyers.</li>
<li>We use your Personal Information to organize and select teams for the game and game development programmes.</li>
<li>We may disclose your Personal Information to staff and directors of the PlayPal management as well as coaches, managers, conveners, game officials and other Club volunteers.</li>
<li>We uses historical participation information, interests and collected preferences and various website activity in order to determine which features and services members like and do not like so that we can improve what we do.</li>
<li>We prepare aggregated user statistics or information summaries in order to describe our services to third parties such as prospective sponsors and advertisers and for other lawful purposes. An advertiser or vendor on our Sites will never have direct access to your Personal Information unless you provide such information to them directly.</li>
<li>Whenever we share your personal Information, we endeavour to limit what is shared to only the minimum information required to complete the service.</li>
</ul>
We will not disclose Personal Information about you to any third party without first obtaining your consent to do so. However, we may have to disclose Personal Information when legally obligated to do so -such as under law, regulation, search warrant, subpoena or court order-, or where the personal safety of our players are at risk, or if the rights or property of the PlayPal are at risk.

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
            Files are maintained on any information in your file including applications, enquiries, complaints, compliments, insurance and other correspondence made by you and our response if any.
The PlayPal maintains all players, team admins, league admins and volunteer registration files for several years as required.
<br/><br/>
You control the Personal Information you provide. When you do opt to supply Personal Information in order to take advantage of PlayPal service, that information represents the Personal Information in your personal file. 
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
