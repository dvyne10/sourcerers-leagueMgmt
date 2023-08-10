import { useState, useEffect, useRef } from "react";
import Card from "react-bootstrap/Card";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { MultiSelect } from "react-multi-select-component";
import validator from "validator";
import useAuth, {checkIfSignedIn, getToken} from "../hooks/auth";

const backend = import.meta.env.MODE === "development" ? "http://localhost:8000" : "https://panicky-robe-mite.cyclic.app";

const AccountMaintenance = () => {
  //hooks
  let { isSignedIn, registerUser, registrationError } = useAuth()
  const token = `Bearer ${getToken()}`
  const location = useLocation();
  const routeParams = useParams();
  const inputFile = useRef();
  const [action, handleAction] = useState({
    type: "Register",
    title: "REGISTER",
  });
  const [currValues, setCurrentValues] = useState({
    userName: "",
    password: "",
    email: "",
    phoneNumber: "",
    firstName: "",
    lastName: "",
    country: "",
    province: "",
    city: "",
  });
  const [sportsSelected, setSportsSelected] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [oldValues, setOldValues] = useState(null);
  const [sportsOptions, setSportsOptions] = useState([{ label: "Soccer", value: "648ba153251b78d7946df311" }, { label: "Basketball", value: "648ba153251b78d7946df322" }]);
  const [countries, setCountries] = useState([{ name: null, states: [] }]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [prevCountry, setPrevCountry] = useState("");
  const [prevState, setPrevState] = useState("");
  const [formError, setFormError] = useState(false);
  const [formErrorArray, setFormErrorArray] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true)
    fetch(`${backend}/getsportslist`)
    .then(response => response.json())
    .then(resp => {
      if (resp.requestStatus === 'ACTC') {
        let newSportsList = resp.data.map(sport => {
          return {label: sport.sportsName, value: sport.sportsId}
        })
        setSportsOptions(newSportsList.sort((a,b) => a.label > b.label ? 1 : -1))
      }
    })
    const url = location.pathname.substring(1, 4).toLowerCase();
    if (url === "reg") {
      handleAction({
        type: "Register",
        title: "REGISTER",
        button1: "Create Account",
        button2: "Login",
      });
      getCountries().then((data) => {
        setCurrentValues({
          ...currValues,
          country: data[0].name,
          province: data[0].states[0].name,
        });
        setIsLoading(false)
      });
    } else {
      handleAction({
        type: "Update",
        title: "UPDATE ACCOUNT",
        button1: "Update Account",
        button2: "Cancel",
        protect: true,
      });
      getCountries()
      fetch(`${backend}/getaccountdetailsupdate`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "Application/JSON",
          "Authorization": token
        }
      })
      .then(response => response.json())
      .then(data=>{
        if (data.requestStatus === 'RJCT') {
            setFormError(true);
            setFormErrorArray(data.errMsg);
            if (data.errField !== "") {
                document.getElementById(data.errField).focus()
            }
        } else if (data.requestStatus === 'ACTC') {
            setPrevCountry(data.details.country);
            setPrevState(data.details.province);
            setCurrentValues({ userName: data.details.userName, password: "**********", email: data.details.email, phoneNumber: data.details.phoneNumber ? data.details.phoneNumber : "",
              firstName: data.details.firstName, lastName: data.details.lastName, country: data.details.country, province: data.details.province, city: data.details.city,
            });
            let sportsSelectedValues = "";
            let sportsInDb = data.details.sportsOfInterest.map(sport => {
              sportsSelectedValues = sportsSelectedValues + sport
              let index = sportsOptions.findIndex(option => option.value ===  sport)
              return {label: sportsOptions[index].label, value: sport}
            })
            setSportsSelected(sportsInDb);
            fetch(`${backend}/profilepictures/${data.details._id}.jpeg`)
            .then(res=>{
                if (res.ok) {
                  setImageURL(`${backend}/profilepictures/${data.details._id}.jpeg`)
                  setSelectedImage("x")
                }
            })
            setOldValues({ userName: data.details.userName, phoneNumber: data.details.phoneNumber ? data.details.phoneNumber : "", firstName: data.details.firstName, lastName: data.details.lastName, 
              country: data.details.country, city: data.details.city, province: data.details.province, sports: sportsSelectedValues, image: "x",
            });
        }
        setIsLoading(false)
    }).catch((error) => {
        console.log(error)
        setIsLoading(false)
    })
    }
  }, [location.pathname]);

  useEffect(() => {
    getStates(currValues.country);
  }, [currValues.country]);

  useEffect(() => {
    getCities(currValues.country, currValues.province);
  }, [currValues.province]);

  const checkIfUserIsSignedIn = () => {
    checkIfSignedIn()
    .then((user) => {
      if (!user.isSignedIn && action.type === "Update") {
        navigate("/signin");
      } else if (user.isSignedIn && action.type === "Register") {
        navigate("/");
      }
    })
  }

  const handlePhotoChange = (event) => {
    if (event.target.files.length > 0) {
      setSelectedImage(event.target.files[0]);
      setImageURL(URL.createObjectURL(event.target.files[0]));
    }
  };

  const handleUploadClick = (e) => {
    inputFile.current.click();
  };

  const handleAccountDetails = (e) => {
    const field = e.target.name;
    const fieldValue = e.target.value.trim();
    setCurrentValues({ ...currValues, [field]: fieldValue });
  };

  function getCountries() {
    const url = "https://countriesnow.space/api/v0.1/countries/states";
    return new Promise(function (resolve, reject) {
      fetch(url)
        .then((response) => response.json())
        .then((responseData) => {
          setCountries(responseData.data);
          resolve(responseData.data);
        });
    });
  }

  const getStates = (country) => {
    let newList = [...countries];
    let index = newList.findIndex((i) => i.name === country);
    let statesFetched = [];
    if (index != -1) {
      statesFetched = [...newList[index].states];
    }
    statesFetched.push({ name: "N/A" });
    setStates(statesFetched);
    if (country !== prevCountry) {
      setCurrentValues({ ...currValues, province: statesFetched[0].name });
      setPrevCountry(country);
    }
  };

  const getCities = (country, state) => {
    if (country !== "" && state !== "") {
      let url = `https://countriesnow.space/api/v0.1/countries/state/cities/q?country=${country}&state=${state}`;
      if (state === "N/A") {
        url = `https://countriesnow.space/api/v0.1/countries/cities/q?country=${country}`;
      }
      try {
        fetch(url)
          .then((response) => response.json())
          .then((responseData) => {
            let citiesFetched = [...responseData.data];
            citiesFetched.push("N/A");
            setCities(citiesFetched);
            if (state !== prevState) {
              setCurrentValues({ ...currValues, city: citiesFetched[0] });
              setPrevState(state);
            }
          })
          .catch(() => {
            setCities(["N/A"]);
            setCurrentValues({ ...currValues, city: "N/A" });
            setPrevState(state);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const navigate = useNavigate();
  const navigateCreateUpdate = (e) => {
    e.preventDefault();
    setFormError(false);
    if (sportsSelected.length < 1) {
      setFormError(true);
      setFormErrorArray("Select at least one sport of interest.");
      return;
    }

    if (!validator.isEmail(currValues.email)) {
      setFormError(true);
      setFormErrorArray([]);

      setFormErrorArray("Enter a valid email");
      return;
    }
    setFormError(false);
    setFormErrorArray("");
    currValues.sportsOfInterest = []
    sportsSelected.map((i) => (currValues.sportsOfInterest.push(i.value)));
    if (action.type === "Register") {
      setIsLoading(true)
      registerUser(currValues, navigate);
      setIsLoading(false)
    } else {
      let sportsSelectedValues = "";
      sportsSelected.map(
        (i) => (sportsSelectedValues = sportsSelectedValues + i.value)
      );
      if (
        oldValues.userName == currValues.userName &&
        oldValues.phoneNumber == currValues.phoneNumber &&
        oldValues.firstName == currValues.firstName &&
        oldValues.lastName == currValues.lastName &&
        oldValues.country == currValues.country &&
        oldValues.city == currValues.city &&
        oldValues.province == currValues.province &&
        oldValues.sports == sportsSelectedValues &&
        oldValues.image == selectedImage
      ) {
        alert("NO CHANGES FOUND!");
      } else {
        setIsLoading(true)
        let data = {...currValues}
        fetch(`${backend}/updateaccount`, {
          method: "POST",
          credentials: 'include',
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "Application/JSON",
            "Authorization": token
          }
        })
        .then(response => response.json())
        .then(data=>{
          if (data.requestStatus === 'RJCT') {
            setFormError(true);
            setFormErrorArray(data.errMsg);
            if (data.errField !== "") {
                document.getElementById(data.errField).focus()
            }
          } else {
              navigate(-1)
          }
          setIsLoading(false)
        }).catch((error) => {
          console.log(error)
          setIsLoading(false)
        })
      }
    }
  };
  const navigateSigninOrCancel = () => {
    if (action.type === "Register") {
      navigate("/signin");
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="d-flex container mt-5 justify-content-center">
      <Card style={{ width: "60rem", padding: 20 }}>
        { !isSignedIn && action.type === "Update" && (
            <div>
                {checkIfUserIsSignedIn()}
            </div>
        )}
        { isSignedIn && action.type === "Register" && (
            <div>
                {checkIfUserIsSignedIn()}
            </div>
        )}
        {isLoading ? (
          <div className="loading-overlay">
            <div style={{color: 'black'}}>Loading...</div>
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
        <h2 className="mb-4 center-text">{action.title}</h2>
        {formError && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {formErrorArray}
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
            ></button>
          </div>
        )}
        {registrationError && registrationError !== "" &&(
          <div className="alert alert-danger mb-3 p-1">
            <p className="mb-0">{registrationError}</p>
          </div>
        )}
        
        <form
          onSubmit={(e) => {
            navigateCreateUpdate(e)
          }}
          encType="multipart/form-data"
        >
          <div className="row">
            <div className="col-9 mb-3">
              <div className="row ">
                <div className="col-5 mb-3">
                  <label htmlFor="userName" className="form-label">
                    Username*
                  </label>
                  <input
                    id="userName"
                    name="userName"
                    type="text"
                    className="form-control"
                    value={currValues.userName}
                    onChange={handleAccountDetails}
                    required
                  />
                </div>
                <div className="col-5 mb-3">
                  <label htmlFor="password" className="form-label">
                    Password*
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="form-control"
                    value={currValues.password}
                    onChange={handleAccountDetails}
                    disabled={action.protect}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-5 mb-3">
                  <label htmlFor="email" className="form-label">
                    Email*
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    value={currValues.email}
                    onChange={handleAccountDetails}
                    disabled={action.protect}
                    required={true}
                  />
                </div>
                <div className="col-5 mb-3">
                  <label htmlFor="sports" className="form-label">
                    Sports of Interest*
                  </label>
                  <MultiSelect
                    id="sports"
                    name="sports"
                    options={sportsOptions}
                    value={sportsSelected}
                    onChange={setSportsSelected}
                    labelledBy="sports"
                    className="form-control"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-5 mb-3">
                  <label htmlFor="firstName" className="form-label">
                    First Name*
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    className="form-control"
                    value={currValues.firstName}
                    onChange={handleAccountDetails}
                    required
                  />
                </div>
                <div className="col-5 mb-3">
                  <label htmlFor="lastName" className="form-label">
                    Last Name*
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="form-control"
                    value={currValues.lastName}
                    onChange={handleAccountDetails}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-5 mb-3">
                  <label htmlFor="country" className="form-label">
                    Country*
                  </label>
                  <select
                    id="country"
                    name="country"
                    className="form-control"
                    value={currValues.country}
                    onChange={handleAccountDetails}
                    required
                  >
                    {countries.map((country, index) => (
                      <option value={country.name} key={index}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-5 mb-3">
                  <label htmlFor="phoneNumber" className="form-label">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    className="form-control"
                    value={currValues.phoneNumber}
                    onChange={handleAccountDetails}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-5 mb-3">
                  <label htmlFor="province" className="form-label">
                    Province/State*
                  </label>
                  <select
                    id="province"
                    name="province"
                    className="form-control"
                    value={currValues.province}
                    onChange={handleAccountDetails}
                    required
                  >
                    {states.map((state, index) => (
                      <option value={state.name} key={index}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-5 mb-3">
                  <label htmlFor="city" className="form-label">
                    City*
                  </label>
                  <select
                    id="city"
                    name="city"
                    className="form-control"
                    value={currValues.city}
                    onChange={handleAccountDetails}
                    required
                  >
                    {cities.map((city, index) => (
                      <option value={city} key={index}>
                        {city}
                      </option>
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
                  <img
                    src={imageURL}
                    alt="profile picture"
                    className="rounded mw-100 mb-2 border border-secondary"
                    style={{ width: "100rem", height: "13rem" }}
                  />
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      inputFile.current.value = null;
                    }}
                    className="btn btn-secondary mb-3 mx-1 btn-sm"
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary mb-3 btn-sm"
                    onClick={(e) => handleUploadClick(e)}
                  >
                    Replace
                  </button>
                </div>
              )}
              {!selectedImage && (
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="rounded mw-100 mb-3 border border-secondary"
                    style={{ width: "100rem", height: "13rem" }}
                    viewBox="0 0 16 16"
                  >
                    <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1h-3zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5zM.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5z" />
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  </svg>
                  <button
                    type="button"
                    className="btn btn-secondary mb-3 btn-sm"
                    onClick={(e) => handleUploadClick(e)}
                  >
                    Upload
                  </button>
                </div>
              )}
              <input
                type="file"
                id="upload"
                name="upload"
                value={""}
                className="d-none"
                onChange={handlePhotoChange}
                accept="image/*"
                ref={inputFile}
              />
            </div>
          </div>
          <div className="row justify-content-center">
            <button
              className="btn btn-dark col-2 mx-5"
              type="submit"
            >
              {action.button1}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary col-2"
              onClick={navigateSigninOrCancel}
            >
              {action.button2}
            </button>
          </div>
        </form>
        </>
        )}
      </Card>
    </div>
  );
};
export default AccountMaintenance;
