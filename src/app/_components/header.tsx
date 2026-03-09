import Image from "next/image";
import Link from "next/link";

const originalLogoSize = {
  width: 370,
  height: 140,
};

function calculateLogoSize(
  originalSize: { width: number; height: number },
  newHeight: number,
) {
  return {
    width: (newHeight / originalSize.height) * originalSize.width,
    height: newHeight,
  };
}

export function MainHeader() {
  const logoSize = calculateLogoSize(originalLogoSize, 40);
  return (
    <header className="px-4 py-2">
      <Link href="/">
        <Image
          src="/oska-logo.png"
          alt="Oska Health Logo"
          width={logoSize.width}
          height={logoSize.height}
        />
      </Link>
    </header>
  );
}
