function Login() {
    return (
        <div className="flex justify-center mt-20">

            <form className="w-96 p-6 shadow-lg rounded-lg">

                <h2 className="text-3xl font-bold mb-5">
                    Login
                </h2>

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
                    className="bg-blue-500 text-white w-full p-3 rounded"
                >
                    Login
                </button>

            </form>

        </div>
    )
}

const handleLogin = async (e) => {
  e.preventDefault();

  const response = await axios.post(
    "http://localhost:5000/api/auth/login",
    {
      email,
      password,
    }
  );

  localStorage.setItem(
    "token",
    response.data.token
  );
};

export default Login