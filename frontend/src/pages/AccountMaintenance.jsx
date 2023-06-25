import { useState, useEffect }  from 'react';
import Card from "react-bootstrap/Card";
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { MultiSelect } from "react-multi-select-component";

const AccountMaintenance = () => {
  
    const [action, handleAction] = useState({type: "Register", title: "REGISTER"});
    const [currValues, setCurrentValues] = useState({userName: null, password: null, email: null, phone: null,
      firstName: null, lastName: null, country: null, city: null, province: null
    })
    const [sportsSelected, setSportsSelected] = useState([])
    const location = useLocation();
    const routeParams = useParams();
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const sportsOptions = [ {label: "Soccer", value: "soccerId"}, {label: "Basketball", value: "basketId"} ]

    useEffect(() => {
        const url = location.pathname.substring(1,4).toLowerCase()
        if (url === "reg") {
            handleAction({type: "Register", title: "REGISTER", button1: "Create Account", button2: "Login"})
        } else {
            handleAction({type: "Update", title: "UPDATE ACCOUNT", button1: "Update Account", button2: "Cancel", protect: true})
            setCurrentValues({userName: "hpotter", password: "**********", email: "hpotter@gmail.com", 
              firstName: "Harry", lastName: "Potter", country: "United Kingdom", city: "London", province: "N/A"
            })
            setSportsSelected([{label: "Basketball", value: "basketId"}])
            setImageURL("https://images.lifestyleasia.com/wp-content/uploads/sites/3/2022/12/31011513/harry-potter-films.jpeg")
            setSelectedImage("x")
        }
    }, [location.pathname]);

    const handlePhotoChange = event => {
      setSelectedImage(event.target.files[0])
      setImageURL(URL.createObjectURL(event.target.files[0]))
    };

    const navigate = useNavigate(); 
    const navigateCreateUpdate = () => { 
      if (action.type === "Register") {
        navigate('/inputotp', { state: {fromPage: 'Register'}}) 
      } else {
        navigate('/')  // TEMP ONLY. Change to user profile once available
        //navigate('/account/' + routeParams.userid)
      }
    }
    const navigateSigninOrCancel = () => {
      if (action.type === "Register") {
        navigate('/signin') 
      } else {
        navigate(-1) 
      }
    }

  return (
    <div className="d-flex container mt-5 justify-content-center" >
      <Card style={{ width: "60rem", padding: 20 }}>
        <h2 className="mb-4 center-text">{action.title}</h2>
        <form action="" encType="multipart/form-data">
        <div className="row">
            <div className="col-9 mb-3">
          <div className="row ">
            <div className="col-5 mb-3">
                <label htmlFor="userName" className="form-label">
                    Username*
                </label>
                <input id="userName" type="text" className="form-control" defaultValue={currValues.userName} />
            </div>
            <div className="col-5 mb-3">
                <label htmlFor="password" className="form-label" >
                    Password*
                </label>
                <input id="password" type="password" className="form-control" defaultValue={currValues.password} disabled={action.protect} />
            </div>
            
          </div>
          <div className="row">
            <div className="col-5 mb-3">
                <label htmlFor="email" className="form-label">
                    Email*
                </label>
                <input id="email" type="email" className="form-control" defaultValue={currValues.email} disabled={action.protect} />
            </div>
            <div className="col-5 mb-3">
                <label htmlFor="sports" className="form-label">
                    Sports of interest*
                </label>
                <MultiSelect options={sportsOptions} value={sportsSelected} onChange={setSportsSelected} labelledBy="Sports" className="form-control"/>
            </div>
          </div>
          <div className="row">
            <div className="col-5 mb-3">
                <label htmlFor="firstName" className="form-label">
                    First Name*
                </label>
                <input id="firstName" type="text" className="form-control" defaultValue={currValues.firstName} />
            </div>
            <div className="col-5 mb-3">
                <label htmlFor="lastName" className="form-label">
                    Last Name*
                </label>
                <input id="lastName" type="text" className="form-control" defaultValue={currValues.lastName} />
            </div>
          </div>
          <div className="row">
            <div className="col-5 mb-3">
                <label htmlFor="country" className="form-label">
                    Country*
                </label>
                <input id="country" type="text" className="form-control" defaultValue={currValues.country} />
            </div>
            <div className="col-5 mb-3">
                <label htmlFor="phone" className="form-label">
                    Phone Number
                </label>
                <input id="phone" type="number" className="form-control" defaultValue={currValues.phone} />
            </div>
          </div>
          <div className="row">
            <div className="col-5 mb-3">
                <label htmlFor="city" className="form-label">
                    City*
                </label>
                <input id="city" type="text" className="form-control" defaultValue={currValues.city} />
            </div>
            <div className="col-5 mb-3">
                <label htmlFor="province" className="form-label">
                    Province/State*
                </label>
                <input id="province" type="text" className="form-control" defaultValue={currValues.province} />
            </div>
          </div>
          </div>
          <div className="col-3 mb-3 text-center">
            <label htmlFor="upload" className="form-label ">
              Profile picture
            </label>
            {selectedImage && (
              <div>
                {/* <img src={imageURL} alt="not found" className="img-thumbnail mb-2"/> */}
                <img src={imageURL} alt="profile picture" className="rounded mw-100 mb-2 border border-secondary" style={{ width: "100rem", height: "13rem"}}/>
                <button onClick={() => setSelectedImage(null)} className="btn btn-secondary mb-3" >Remove</button>
              </div>
            ) }
            {!selectedImage && (
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="rounded mw-100 mb-3 border border-secondary" style={{ width: "100rem", height: "13rem"}} viewBox="0 0 16 16">
                <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
              </svg> 
            )}
            <input type="file" id="upload" name="upload" className="form-control" onChange={handlePhotoChange} />
          </div>
        </div>
        <div className="row justify-content-center">
          <button className="btn btn-dark col-2 mx-5" type="button" onClick={navigateCreateUpdate}>
            {action.button1}
          </button>
          <button type="button" className="btn btn-outline-secondary col-2" onClick={navigateSigninOrCancel}>
            {action.button2}
          </button>
        </div>
        </form>
      </Card>
    </div>
  );
};

export default AccountMaintenance;
