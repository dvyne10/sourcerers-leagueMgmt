import { MaterialReactTable } from 'material-react-table';
import {Container,Row,Col, Image, Button, CardGroup, Card} from 'react-bootstrap';






export default function Teams(){
    const teamListing = [
        { id: 1, logoimgurl: 'https://content.sportslogos.net/logos/31/661/full/drake_bulldogs_logo_secondary_20118658.png', bgimgurl: 'https://png.pngtree.com/background/20220716/original/pngtree-colorful-sports-theme-background-material-picture-image_1636814.jpg', nameOfTeam: "Real Madrid", numberOfMembers: "24" },
        { id: 2, logoimgurl: 'https://static.vecteezy.com/system/resources/previews/004/599/108/original/gamer-mascot-logo-design-gamer-illustration-for-sport-team-modern-illustrator-concept-style-for-badge-free-vector.jpg', bgimgurl: 'https://media.istockphoto.com/id/540383298/tr/vekt%C3%B6r/football-championship-background.jpg?s=612x612&w=0&k=20&c=LCGaxDgwTjwW_zjdCPso6ZsNEB-GgjDMNDW_j8M11oU=', nameOfTeam: 'Barcelona', numberOfMembers: "23"},
        { id: 3, logoimgurl: 'https://logos-world.net/wp-content/uploads/2021/10/Omaha-Mammoths-Logo.png', bgimgurl: 'https://t4.ftcdn.net/jpg/02/86/76/77/360_F_286767786_boXM75PDLYIsYWzabZ3fKcM3esv50TNS.jpg', body: "Arsenal", numberOfMembers: "12" },
        { id: 4, logoimgurl: 'https://media.istockphoto.com/id/517747677/vector/college-league-sport-team-logo-apparel-concept.jpg?s=612x612&w=0&k=20&c=tveFmguLfXICRt6Nc8oijlkqWpzaQPk6nKY2Vy_pGug=', bgimgurl: 'https://st3.depositphotos.com/4327059/13950/v/1600/depositphotos_139502720-stock-illustration-people-engaging-in-different-sports.jpg', nameOfTeam: 'Chelsea', numberOfMembers: "8" }
    ];

      return (
            <>
            
            <div className='bg-light container justify-content-center text-center border' style={{ width: "50%", height: "5em"}}>
            <h1 className='center-header'>TEAMS</h1>
        
            {teamListing.map((team)=>{
               
return(
    
    <div className='team-individual border-bottom p-2' key={team.id}>
    <div className="bg-image mt-2 d-flex p-2 text-center shadow-1-strong rounded text-white border" >
    <Container className='border' style={{'backgroundImage':`url(${team.bgimgurl})`}}>
  <Row className='text-center align-items-center mx-auto border border-success border border-danger'>
    <Col lg="2" className='text-center justify-content-center align-items-center mx-auto border border-success'>
    <p className=''>Team description here.</p>
    <Button className='mt-2 mb-2 btn-success rounded-pill'>Open</Button>
 
    </Col>
    <Col lg="8" className='border'><h1>Team name here</h1>
   
    </Col>
    <Col className='text-center align-items-center mx-auto border border-success'> <Image src={team.logoimgurl}  className='border border-info shadow object-fit-cover align-self-end ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em"}}/></Col>
  </Row>
  <Row>
    <Col lg="2" ></Col>

  </Row>
  </Container>
  </div>
  </div>
            
)})
}


       



      <div className='team-individual border-bottom p-2 '>
        <div className="bg-image mt-2 d-flex p-2 text-center shadow-1-strong rounded text-white"
  style={{"backgroundImage": "url('https://mdbcdn.b-cdn.net/img/new/slides/003.webp')", backgroundPosition:'center'}} >
        <Container className='border' style={{background:'https://i.p1inimg.com/600x315/0f/4c/91/0f4c91bfaa06b9e5907fca20e3e37d0d.jpg'}}>
      <Row className='text-center align-items-center mx-auto border'>
        <Col lg="2" className='text-center justify-content-center align-items-center mx-auto border border-success'>
        <p className=''>Team description here.</p>
        <Button className='mt-2 mb-2 btn-success rounded-pill'>Open</Button>
     
        </Col>
        <Col lg="8" className='border'><h1>Team name here</h1>
       
        </Col>
        <Col className='text-center align-items-center mx-auto border'> <Image src="https://i.ytimg.com/vi/ghMKmANLr4E/maxresdefault.jpg"  className='border border-info shadow object-fit-cover align-self-end ml-auto' roundedCircle fluid style={{ width: "5em", height: "5em"}}/></Col>
      </Row>
      <Row>
        <Col lg="2" ></Col>

      </Row>
      </Container>
      </div>
      </div>






      </div>
            
            
            </>
      );
}