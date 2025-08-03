// app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/dep/1'); // ✅ 여기서 바로 리다이렉트
}
