import { ReactNode } from 'react';

function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className='h-full flex items-center justify-center'>{children}</div>
  );
}

export default AuthLayout;
