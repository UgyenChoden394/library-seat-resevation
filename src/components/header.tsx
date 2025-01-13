export default function Header({userData}: {userData: { student_id: string; role: string, name: string }}) {
    const sessionUser = JSON.parse(sessionStorage.getItem('user') as string);
    const capitalizeFirstLetter = (str: string) => {
        if (!str) return str; // Check if the string is empty or null
        return str.charAt(0).toUpperCase() + str.slice(1);
      };
    
    return (
        <header className="flex items-center justify-between px-16 h-[75px] bg-white shadow">
      {/* Search */}
      <div className="flex items-center space-x-2 border-2 rounded-full bg-gray-200 w-[20%]">
        {/* <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" /> */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-gray-500 ml-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input type="text" placeholder="Search anything" className="bg-transparent focus:ring-0 outline-none w-[80%]"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center">
        <div className='mr-6'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
        </div>
        {/* <BellIcon className="w-6 h-6 text-gray-600" /> */}
        <div className="flex items-center mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-12">
                <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
            </svg>
        </div>
        <div className='flex flex-col'>
              <span className="text-gray-600 text-lg font-bold">{userData?.role === 'admin' ? sessionUser?.email : userData?.name}</span>
              <span className="text-gray-600">{capitalizeFirstLetter(userData?.role)}</span>
            </div>
      </div>
    </header>
    )
}

