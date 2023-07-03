import useAuth from "../../hooks/auth";
import MatchUpdate from '../../pages/MatchUpdate';

const AdminMatchMnt = () => {
  
    const {isSignedIn, isAdmin} = useAuth()
    return (
        <div className="d-flex container mt-2 justify-content-center" >
            { !isSignedIn || !isAdmin ? (
                <div>
                    <h1>NOT AUTHORIZED TO ACCESS THIS PAGE !!!</h1>
                </div>
            ) : (
                <div>
                    <MatchUpdate />
                </div>
            )}
        </div>
    );
};

export default AdminMatchMnt;
