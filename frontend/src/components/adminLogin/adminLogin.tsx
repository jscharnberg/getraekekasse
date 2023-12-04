// AdminLoginPage.tsx
import LoginButton from './loginButton';

export const AdminLoginPage = () => {
    return (
        <div className="container mx-auto py-[7%]">
            <div className="grid grid-cols-12 mx-auto  bg-white rounded-2xl  w-[600px] border h-[500px]">
                <div className="col-span-6 self-center p-4">
                    <img className="rounded-2xl" src="../src/assets/soda.jpg" alt="" />
                </div>
                <div className="col-span-6 border-l p-4 flex flex-col justify-center">
                    <div className="space-y-4 mb-5">
                        <p className="">Login</p>
                    </div>
                    <div className="text-xl">
                        <LoginButton />
                    </div>
                </div>
            </div>
        </div>
    );
};
