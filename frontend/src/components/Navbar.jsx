import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="flex justify-between p-5 shadow">

            <h1 className="text-2xl font-bold">
                StudyMatch AI
            </h1>

            <div className="space-x-5">

                <Link to="/">
                    Home
                </Link>

                <Link to="/login">
                    Login
                </Link>

                <Link to="/register">
                    Register
                </Link>

            </div>

        </nav>
    )
}

export default Navbar