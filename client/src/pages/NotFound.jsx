import {Link} from 'react-router-dom'
import '../styling/NotFound.css'

const NotFound = () => {
    return(
        <>
        <div className="NFContainer">
        <div className="NFtext">
        <h1>PAGE NOT FOUND</h1>
        <p>sorry about that but take a look at our feed!</p>
        <Link to="/Fyp">Feed</Link>
        </div>
        </div>
        </>
    )
}

export default NotFound