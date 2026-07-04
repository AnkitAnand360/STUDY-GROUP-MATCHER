function Register() {
    return (
        <div className="flex justify-center mt-20">

            <form className="w-96 p-6 shadow-lg rounded-lg">

                <h2 className="text-3xl font-bold mb-5">
                    Register
                </h2>

                <input
                    type="text"
                    placeholder="Name"
                    className="w-full border p-3 mb-4 rounded"
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-3 mb-4 rounded"
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border p-3 mb-4 rounded"
                />

                <button
                    className="bg-green-500 text-white w-full p-3 rounded"
                >
                    Register
                </button>

            </form>

        </div>
    )
}

export default Register