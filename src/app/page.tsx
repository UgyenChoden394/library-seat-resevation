'use client';
import { redirect, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchCurrentUserData } from './firebase/authConfig';
import Loader from '@/components/loader';

export default function Home() {
  const userSession = sessionStorage.getItem('user');

  const [userData, setUserData] = useState<{ student_id: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await fetchCurrentUserData();
        if (!currentUser) {
          // Redirect to login if user is not authenticated
          router.push('/auth/login');
        } else {
          setUserData(currentUser);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.push('/auth/login'); // Redirect to login on error
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    if (loading) return;
    if (userData || userSession) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  }, [loading, userData, router]);

  if (loading) {
    return <Loader />;
  }

  return null;
}
