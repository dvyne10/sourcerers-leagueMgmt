
const LiveCard = () => {
  return (
    <div className="card card-body m-2">
      <div className="d-flex justify-content-between">
        <div
          style={{ width: 80, height: 80, borderRadius: 40, marginRight: 20 }}
        >
          <img
            src="/src/assets/images/manu.png"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
            alt=""
          />
        </div>
        <div className="d-flex align-items-center">
          <p>vs</p>
        </div>
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            marginLeft: 20,
          }}
        >
          <img
            src="/src/assets/images/madrid.png"
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              borderRadius: 40,
            }}
            alt=""
          />
        </div>
      </div>
      <div>
        <hr />
      </div>
      <div className="d-flex p-0 m-0 justify-content-center">
        <p className="p-0 m-0">11 July</p>
        <div
          style={{
            width: 1,
            marginInline: 5,
            backgroundColor: "#666869",
          }}
        ></div>
        <p className="p-0 m-0">10:00pm</p>
      </div>
    </div>
  );
};

export default LiveCard;
