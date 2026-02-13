/** Logo minimalista AMC: edificio en líneas (icono) */
type LogoAMCProps = {
  size?: number;
  className?: string;
};

export default function LogoAMC({ size = 28, className }: LogoAMCProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Edificio: contorno y líneas minimalistas */}
      <path
        d="M6 28V12l10-8 10 8v16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 28V16h4v12M18 28V16h4v12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14 10h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M14 6h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
