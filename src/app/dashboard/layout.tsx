'use client';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchCurrentUserData } from '../firebase/authConfig';
import Loader from '@/components/loader';

export default function Layout({children} : {children: React.ReactNode}) {
    const userSession = sessionStorage.getItem('user');
    const [userData, setUserData] = useState({ student_id: '', role: '', name: ''});
    const [loading, setLoading] = useState(true);
    if (!userSession) {
        redirect('/auth/login')
    }

    useEffect(() => {
      const fetchUserData = async () => { 
          try {
            const currentUser = await fetchCurrentUserData();
            if(currentUser) { 
              setUserData(currentUser);
              console.log('current User', currentUser)
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          } finally {
            setLoading(false);
          }
      };
      fetchUserData();
    }, []);

    if (loading) {
      return <Loader></Loader>;
    }
    
    return (
        <div className='flex h-screen'>

          {/* Sidebar */}
          <Sidebar userData={userData} ></Sidebar>

           {/* Main Content */}
           <div className="flex-1 flex flex-col bg-gray-100">
            {/* Header */}
            <Header userData={userData}/>

            {/* Page Content */}
            <main className="flex-1 p-6 overflow-y-scroll h-[calc(100vh-30px)]">{children}</main>
          </div>
        </div>
    )
}
