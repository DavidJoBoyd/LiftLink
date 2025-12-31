import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function ModalScreen() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if this route is opened — effectively disables modal.
    router.replace('/');
  }, [router]);

  return null;
}
