import Image from 'next/image';

function Logo() {
  return (
    <Image height={130} width={130} alt='logo' src='/AppliedMinds-logo.svg' />
  );
}

export default Logo;
