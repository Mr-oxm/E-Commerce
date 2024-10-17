import { useThemeContext } from "./context/themeContext"

const AuthPage = ({children}) => {

    return (
        <div className='w-full h-screen bg-base-200 flex flex-col' data-theme={useThemeContext().theme}>
            <div className='grid grid-cols-2 gap-4 q-full h-full items-center p-4'>
                <div className='col-span-1 bg-base-100 card p-4 flex flex-col gap-4 items-center'>
                    {children}
                </div>
                <div className='col-span-1 flex flex-col gap-1 items-center'>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/EBay_logo.svg" alt="logo" height={512} width={512}/>
                    <p className='text-2xl font-bold'>Welcome to eBay</p>
                    <p className='text-sm'>The world's online marketplace</p>
                </div>
            </div>
        </div>
    )
}

export default AuthPage