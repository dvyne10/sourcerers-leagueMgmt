

export default function Leagues() {

  return (
    <>
    <div className="App" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "50px"}}>
      <h6>Top 10 ongoing</h6>
      <h1>LEAGUES</h1>
      <div style={{ border: "1px solid black", width: "1500px", height: "500px" }}></div>
      <h1 style={{paddingTop: "50px"}}>ANNOUNCEMENTS</h1>

      <div style={{ border: "1px solid black", width: "1500px", height: "500px", display: "flex", flexDirection: "column" }}>
          <span style={{ backgroundColor: "lightgrey", flex: "0 0 8%", width: "100%" }}></span>
          <span style={{ backgroundColor: "white", flex: "1 0 auto", width: "100%" }}></span>
          <span style={{ backgroundColor: "lightgrey", flex: "0 0 8%", width: "100%" }}></span>
      </div>

    </div>
    </>
  );
}