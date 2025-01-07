'use client';
import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import { redirect } from 'next/navigation';

export default function Layout({children} : {children: React.ReactNode}) {
    const userSession = sessionStorage.getItem('user');
    if (!userSession) {
        redirect('/auth/login')
    }
    return (
        <div className='flex h-screen'>
          {/* Sidebar */}
          <Sidebar></Sidebar>

           {/* Main Content */}
           <div className="flex-1 flex flex-col bg-gray-100">
            {/* Header */}
            <Header />

            {/* Page Content */}
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
    )
}
