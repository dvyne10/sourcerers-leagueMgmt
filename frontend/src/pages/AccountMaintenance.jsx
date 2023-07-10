import { useState, useEffect, useRef }  from 'react';
import Card from "react-bootstrap/Card";
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { MultiSelect } from "react-multi-select-component";

const AccountMaintenance = () => {
  
  const location = useLocation();
  const routeParams = useParams();
  const inputFile = useRef(null);
  const [action, handleAction] = useState({type: "Register", title: "REGISTER"});
  const [currValues, setCurrentValues] = useState({userName: null, password: null, email: null, phone: null,
    firstName: null, lastName: null, country: "", province: "", city: ""
  })
  const [sportsSelected, setSportsSelected] = useState([])
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [oldValues, setOldValues] = useState(null)
  const sportsOptions = [ {label: "Soccer", value: "soccerId"}, {label: "Basketball", value: "basketId"} ]
  const [countries, setCountries] = useState([ {name: null, states: []} ])
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [prevCountry, setPrevCountry] = useState("")
  const [prevState, setPrevState] = useState("")

    useEffect(() => {
        const url = location.pathname.substring(1,4).toLowerCase()
        if (url === "reg") {
            handleAction({type: "Register", title: "REGISTER", button1: "Create Account", button2: "Login"})
            getCountries()
            .then((data) => {
              setCurrentValues({ ...currValues, country : data[0].name, province: data[0].states[0].name})
            })
        } else {
            handleAction({type: "Update", title: "UPDATE ACCOUNT", button1: "Update Account", button2: "Cancel", protect: true})
            getCountries()
            .then((data) => {
              setPrevCountry("United Kingdom")
              setPrevState("City of London")
              setCurrentValues({userName: "hpotter", password: "**********", email: "hpotter@gmail.com", phone: "", 
                firstName: "Harry", lastName: "Potter", country: "United Kingdom", province: "City of London", city: "N/A", 
              })
            })
            setSportsSelected([{label: "Basketball", value: "basketId"}])
            setImageURL("https://images.lifestyleasia.com/wp-content/uploads/sites/3/2022/12/31011513/harry-potter-films.jpeg")
            setSelectedImage("x")
            setOldValues({ userName: "hpotter", phone: "", firstName: "Harry", lastName: "Potter", country: "United Kingdom", city: "London", province: "N/A",
              sports: "basketId", image: "x"
            })
        }
    }, [location.pathname]);

    useEffect(()=> {
      getStates(currValues.country)
    }, [currValues.country])

    useEffect(()=> {
      getCities(currValues.country, currValues.province)
    }, [currValues.province])

    const handlePhotoChange = event => {
      if (event.target.files.length > 0) {
        setSelectedImage(event.target.files[0])
        setImageURL(URL.createObjectURL(event.target.files[0]))
      }
    };

    const handleAccountDetails = (e) => {
      const field = e.target.name
      setCurrentValues({ ...currValues, [field] : e.target.value })
    }

    function getCountries() {
      const url = 'https://countriesnow.space/api/v0.1/countries/states';
      return new Promise(function (resolve, reject) {
        fetch(url)
        .then(response => response.json())
        .then(responseData => {
          setCountries(responseData.data)
          resolve(responseData.data)
        })
      })
    }

    const getStates = (country) => {
      let newList = [...countries]
      let index = newList.findIndex(i => i.name === country);
      let statesFetched = []
      if (index != -1) {
        statesFetched = [...newList[index].states]
      }
      statesFetched.push({name: "N/A"})
      setStates(statesFetched)
      if (country !== prevCountry) {
        setCurrentValues({ ...currValues, province : statesFetched[0].name})
        setPrevCountry(country)
      }
    }

    const getCities = (country, state) => {
      if (country !== "" && state !== "") {
        let url = `https://countriesnow.space/api/v0.1/countries/state/cities/q?country=${country}&state=${state}`;
        if (state === "N/A") {
          url = `https://countriesnow.space/api/v0.1/countries/cities/q?country=${country}`;
        }
        try {
          fetch(url)
          .then(response => response.json())
          .then(responseData => {
            let citiesFetched = [...responseData.data]
            citiesFetched.push("N/A")
            setCities(citiesFetched)
            if (state !== prevState) {
              setCurrentValues({ ...currValues, city : citiesFetched[0]})
              setPrevState(state)
            }
          })
          .catch(()=> {
            setCities(["N/A"])
            setCurrentValues({ ...currValues, city : "N/A"})
            setPrevState(state)
          })
        } catch(error) {
          console.log(error);
        }
      }
    }

    const navigate = useNavigate(); 
    const navigateCreateUpdate = () => { 
      if (action.type === "Register") {
        navigate('/inputotp', { state: {fromPage: 'Register'}}) 
      } else {
        let sportsSelectedValues = ""
        sportsSelected.map(i => sportsSelectedValues = sportsSelectedValues + i.value)
          if ( oldValues.userName == currValues.userName 
            && oldValues.phone == currValues.phone 
            && oldValues.firstName == currValues.firstName 
            && oldValues.lastName == currValues.lastName 
            && oldValues.country == currValues.country
            && oldValues.city == currValues.city
            && oldValues.province == currValues.province
            && oldValues.sports == sportsSelectedValues
            && oldValues.image == selectedImage
          ) {
            alert("NO CHANGES FOUND!")
          } else {
            navigate(-1)   // Validate changes. Once all okay, navigate to user's previous page.
          } 
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
                <input id="userName" name="userName" type="text" className="form-control" defaultValue={currValues.userName} onChange={handleAccountDetails} />
            </div>
            <div className="col-5 mb-3">
                <label htmlFor="password" className="form-label" >
                    Password*
                </label>
                <input id="password" name="password" type="password" className="form-control" defaultValue={currValues.password} onChange={handleAccountDetails} disabled={action.protect} />
            </div>
            
          </div>
          <div className="row">
            <div className="col-5 mb-3">
                <label htmlFor="email" className="form-label">
                    Email*
                </label>
                <input id="email" name="email" type="email" className="form-control" defaultValue={currValues.email} onChange={handleAccountDetails} disabled={action.protect} />
            </div>
            <div className="col-5 mb-3">
                <label htmlFor="sports" className="form-label">
                    Sports of Interest*
                </label>
                <MultiSelect id="sports" name="sports" options={sportsOptions} value={sportsSelected} onChange={setSportsSelected} labelledBy="sports" className="form-control"/>
            </div>
          </div>
          <div className="row">
            <div className="col-5 mb-3">
                <label htmlFor="firstName" className="form-label">
                    First Name*
                </label>
                <input id="firstName" name="firstName" type="text" className="form-control" defaultValue={currValues.firstName} onChange={handleAccountDetails} />
            </div>
            <div className="col-5 mb-3">
                <label htmlFor="lastName" className="form-label">
                    Last Name*
                </label>
                <input id="lastName" name="lastName" type="text" className="form-control" defaultValue={currValues.lastName} onChange={handleAccountDetails} />
            </div>
          </div>
          <div className="row">
            <div className="col-5 mb-3">
                <label htmlFor="country" className="form-label">
                    Country*
                </label>
                <select id="country" name="country" className="form-control" value={currValues.country} onChange={handleAccountDetails}>
                    {countries.map((country) => (
                        <option value={country.name} key={country.iso3}>{country.name}</option>
                    ))}
                </select>
            </div>
            <div className="col-5 mb-3">
                <label htmlFor="phone" className="form-label">
                    Phone Number
                </label>
                <input id="phone" name="phone" type="text" className="form-control" defaultValue={currValues.phone} onChange={handleAccountDetails} />
            </div>
          </div>
          <div className="row">
            <div className="col-5 mb-3">
                <label htmlFor="province" className="form-label">
                    Province/State*
                </label>
                <select id="province" name="province" className="form-control" value={currValues.province} onChange={handleAccountDetails}>
                    {states.map((state) => (
                        <option value={state.name} key={state.name}>{state.name}</option>
                    ))}
                </select>
            </div>
            <div className="col-5 mb-3">
                <label htmlFor="city" className="form-label">
                    City*
                </label>
                <select id="city" name="city" className="form-control" value={currValues.city} onChange={handleAccountDetails}>
                    {cities.map((city) => (
                        <option value={city} key={city}>{city}</option>
                    ))}
                </select>
            </div>
          </div>
          </div>
          <div className="col-3 mb-3 text-center">
            <label htmlFor="upload" className="form-label ">
              Profile Picture
            </label>
            {selectedImage && (
              <div>
                <img src={imageURL} alt="profile picture" className="rounded mw-100 mb-2 border border-secondary" style={{ width: "100rem", height: "13rem"}}/>
                <button onClick={() => setSelectedImage(null)} className="btn btn-secondary mb-3 mx-1 btn-sm" >Remove</button>
                <button type="button" className="btn btn-secondary mb-3 btn-sm" onClick={() => inputFile.current.click()}>Replace</button>
              </div>
            ) }
            {!selectedImage && (
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="rounded mw-100 mb-3 border border-secondary" style={{ width: "100rem", height: "13rem"}} viewBox="0 0 16 16">
                  <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z"/>
                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                </svg>
                <button type="button" className="btn btn-secondary mb-3 btn-sm" onClick={() => inputFile.current.click()}>Upload</button>
              </div>
            )}
            <input type="file" id="upload" name="upload" className="d-none" onChange={handlePhotoChange} accept="image/*" ref={inputFile}/>
          </div>
        </div>
        <div className="row justify-content-center">
          <button className="btn btn-dark col-2 mx-5" type="submit" onClick={navigateCreateUpdate}>
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
