import { Link } from "react-router-dom"
import ErrorMessage from "../errorMessage/ErrorMessage"

import './404.scss'

const Page404 = () => {
    return(
        <div>
            <ErrorMessage/>
            <p className="page404__errMessage">Page doesn't exist</p>
            <Link className="page404__backHome"
            to="/">Back to main page</Link>
        </div>
    )
}

export default Page404;