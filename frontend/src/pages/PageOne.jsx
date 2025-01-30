import { Link } from "react-router-dom";

const PageOne = () => {
  return (
    <>
      <h1>PageOne</h1>
      <Link to='/dashboard'>Back to Dashboard</Link>
    </>
  )
}

export default PageOne;