import Button from 'react-bootstrap/Button';

export default function Leagues() {

  return (
    <>
    <div className="App">
      <h1>leagues page</h1>
      <Button variant="primary" onClick={()=>console.log('clicked')}>Primary</Button>
    </div>
    </>
  );
}