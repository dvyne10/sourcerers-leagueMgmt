import { FaFilter } from "react-icons/fa";
import {Container,Row,Col, Image, Button,} from 'react-bootstrap';




export default function Players(){

  
    const playerListing = [
        { id: 1, wins:5, footballTeamId : 1, basketballTeamId : 6, logoImgFootballUrl: 'https://1000logos.net/wp-content/uploads/2021/02/Tennessee-Titans-FC-Logo.png', logoImgBasketballUrl: 'https://img.freepik.com/free-vector/gradient-basketball-logo_52683-84313.jpg?w=2000', nameOfFootballTeam: "Real Madrid", nameOfBasketballTeam: "Raptors", footballPosition:"Forward", basketballPosition:"Center"},
        { id: 2, wins:3,footballTeamId : 2, basketballTeamId : 7,logoImgFootballUrl: 'https://logodownload.org/wp-content/uploads/2021/10/canada-soccer-team-logo-0.png', logoImgBasketballUrl: 'https://wp.usatodaysports.com/wp-content/uploads/sites/90/2016/05/logo-golden-state-warriors1.png',nameOfFootballTeam: "Barcelona", nameOfBasketballTeam: "Chicago", footballPosition:"Right Wing", basketballPosition:"Point Guard"},  
        { id: 3, wins:6,footballTeamId : 3, basketballTeamId : 8,logoImgFootballUrl: 'https://images-platform.99static.com//1rfZxacWCr7-UWhvoY4p8MsPA4A=/363x355:1437x1429/fit-in/590x590/99designs-contests-attachments/108/108786/attachment_108786598', logoImgBasketballUrl: 'https://ftw.usatoday.com/wp-content/uploads/sites/90/2020/03/1920px-los_angeles_lakers_logo.svg_.png?w=1000',nameOfFootballTeam: "Arsenal", nameOfBasketballTeam: "Lakers", footballPosition:"Forward", basketballPosition:"Center"},
        { id: 4, wins:15,basketballTeamId : 4,logoBasketballUrl: 'https://content.sportslogos.net/logos/31/661/full/drake_bulldogs_logo_secondary_20118658.png', nameOfFootballTeam: "Arsenal", footballPosition:"Forward", basketballPosition:"Center"},
        { id: 5, wins:111,footballTeamId : 9, logoImgFootballUrl: 'https://ftw.usatoday.com/wp-content/uploads/sites/90/2020/03/1920px-los_angeles_lakers_logo.svg_.png?w=1000',nameOfFootballTeam: "Arsenal", footballPosition:"Forward", basketballPosition:"Center"},
      
      ];

      return (
            <>
            
            <div className='container justify-content-center text-center rounded' style={{ width: "100%"}}>
            <Container>
      <Row className='align-items-end'>
        <Col className='text-start'><Button size='sm'  variant="outline-secondary"><FaFilter></FaFilter>Filter</Button></Col>
        <Col><h1 className='center-header'>PLAYERS</h1></Col>
        <Col></Col>
      </Row>
    </Container>
   
    <Container className='rounded align-items-end mt-4'>

  <Row className='text-center align-items-end border-bottom' >
  <Col lg="1" className='text-center'> <h6>Football Team</h6></Col>
  <Col lg="1" className='text-center'> <h6>Basketball Team</h6></Col>
    <Col lg="2" className='text-center'> <h6>Name</h6>
 
    </Col>
    <Col lg="3" className="text-center"><h6>Football Position</h6>
    
   
    </Col>
    <Col lg="3" className="text-center">
    <h6>Basketball Position</h6>
   
    </Col>
    <Col lg="2">
    <h6>Wins</h6>
   
    </Col>
    </Row>
    </Container>
        
            {playerListing.map((player)=>{
               
return(
    
    <div className='team-individual border-bottom p-2' key={player.id}>
    <a href={'/player/'+player.id} className="general-link-no-dec">
    <div className="mt-2 text-center shadow-1-strong rounded text-white" >
    
   

  <Row className='text-center align-items-center mx-auto rounded player-list-container'>
  
  <Col lg="1" className='text-center rounded-start p-2' style={{backgroundColor:"#1c1b22"}}> 
  <a href={'/team/'+`${player.footballTeamId}`} className="link-general-style"> <Image src={player.logoImgFootballUrl}  className='border border-white object-fit-cover ml-auto zoom-in-style' roundedCircle fluid style={{ width: "4em", height: "4em"}}/>
  </a>
  </Col>
  <Col lg="1" className='text-center p-2' style={{backgroundColor:"#1c1b22"}}> 
  <a href={'/team/'+`${player.basketballTeamId}`} className="link-general-style"><Image src={player.logoImgBasketballUrl}  className='border border-white object-fit-cover ml-auto zoom-in-style' roundedCircle fluid style={{ width: "4em", height: "4em"}}/>
  </a>
  </Col>
    <Col lg="2" className='text-center justify-content-center align-items-center mx-auto p-2' > Baris Berber
    
    </Col>
    <Col lg="3" className="text-center"><h1></h1>
    <h6>{player.footballPosition}</h6>
   
    </Col>
    <Col lg="3" className="text-center"><h1></h1>
    <h6>{player.basketballPosition}</h6>
    </Col>
    <Col lg="2">
    <h6>{player.wins}</h6>
   
    </Col>
    
    
    
  </Row>
  


  
  </div>
  </a> 
  </div>
  
)})
}




      </div>
            
            
            </>
      );
}