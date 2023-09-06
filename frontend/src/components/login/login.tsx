

export const Login = () => {
    return (
        <div className="container py-52 px-16 mx-20 ">

            <div className="grid grid-cols-12 bg-white rounded-2xl  w-[600px] border h-[500px]">
                <div className="col-span-6 self-center p-4">
                    {/*Image to come*/}
                    Image
                </div>
                <div className="col-span-6  border-l p-4">
                    <div className="space-y-4 mb-5">
                        <p className="">Login</p>
                        <p className="text-sm">Sign into your account</p>
                    </div>

                    <form className="text-xl flex  mb-5" action="">
                        <label className="flex space-x-1">
                            <p>ID: </p>
                            <input className='mb-4 border' type='number' />
                        </label>

                    </form>
                    <button className="py-2 px-4 bg-gray-700 text-white mb-5">LOGIN</button>

                    <p className="text-sm">terms of use. Privacy policy</p>
                </div>
            </div>


        </div>
    )
}