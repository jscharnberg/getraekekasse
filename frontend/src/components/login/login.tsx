import LoginButton from "./loginButton.tsx";


export const Login = () => {
    return (
        <div className="container mx-auto py-[7%]">
            <div className="grid grid-cols-12 mx-auto  bg-white rounded-2xl  w-[600px] border h-[500px]">
                <div className="col-span-6 self-center p-4">
                    <img className="rounded-2xl" src="./src/assets/soda.jpg" alt="" />
                </div>
                <div className="col-span-6  border-l p-4">
                    <div className="space-y-4 mb-5">
                        <p className="">Login</p>
                        <p className="text-sm">Sign into your account</p>
                    </div>

                    <form className="text-xl flex  mb-5" action="">
                        <label className="flex space-x-1">
                            <LoginButton />
                        </label>


                    </form>

                    <button
                        className="py-2 px-4 bg-gray-700 text-white mb-5 mt-5"
                        onClick={() => window.location.href = '/admin/login'}>
                        Administrator Anmeldung
                    </button>
                </div>
            </div>


        </div>
    )
}