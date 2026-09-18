"use client";

import React, { JSX } from "react";

interface IconProps {
  className?: string;
  color?: string;
  onClick?: React.MouseEventHandler;
}

export const Home = ({ className, color }: IconProps): JSX.Element => (
  <svg width="19" height="20" viewBox="0 0 19 20" fill="none" className={className}>
    <path
      d="M6.644 18.782V15.715C6.644 14.938 7.276 14.307 8.058 14.302H10.933C11.719 14.302 12.356 14.935 12.356 15.715V18.773C12.356 19.447 12.904 19.995 13.583 20H15.544C16.46 20.002 17.339 19.643 17.987 19.001C18.636 18.359 19 17.487 19 16.578V7.866C19 7.131 18.672 6.435 18.105 5.964L11.443 0.674C10.279 -0.251 8.615 -0.221 7.485 0.745L0.967 5.964C0.373 6.421 0.018 7.12 0 7.866V16.569C0 18.464 1.547 20 3.456 20H5.372C5.699 20.002 6.013 19.875 6.245 19.646C6.477 19.418 6.608 19.107 6.608 18.782H6.644Z"
      fill={color || "currentColor"}
    />
  </svg>
);

export const Chat = ({ className, color }: IconProps): JSX.Element => (
  <svg width="25" height="23" viewBox="0 0 25 23" fill="none" className={className}>
    <path
      d="M4.886 7.407C3.587 8.019 2.486 8.999 1.709 10.23C0.932 11.462 0.513 12.896 0.5 14.363C0.499 16.047 1.048 17.681 2.061 19.005L0.765 22.148C0.754 22.194 0.754 22.243 0.766 22.29C0.778 22.337 0.802 22.379 0.834 22.414C0.867 22.449 0.908 22.474 0.953 22.488C0.998 22.502 1.046 22.504 1.092 22.493L4.621 21.215C5.775 21.827 7.055 22.146 8.354 22.148C10.061 22.149 11.725 21.595 13.107 20.566M24.5 10.424C24.486 12.58 23.768 14.668 22.46 16.354L24.123 20.335C24.14 20.396 24.142 20.461 24.127 20.523C24.113 20.584 24.083 20.641 24.041 20.688C23.999 20.734 23.946 20.769 23.887 20.788C23.828 20.807 23.765 20.81 23.704 20.796L19.186 19.151C17.71 19.934 16.073 20.34 14.413 20.335C11.801 20.389 9.276 19.374 7.392 17.516C5.508 15.657 4.419 13.107 4.366 10.424C4.419 7.741 5.507 5.189 7.391 3.329C9.275 1.469 11.8 0.452 14.413 0.503C15.708 0.472 16.996 0.704 18.204 1.185C19.412 1.666 20.516 2.387 21.453 3.306C22.39 4.226 23.141 5.326 23.664 6.543C24.187 7.761 24.471 9.073 24.5 10.403V10.424Z"
      stroke={color || "currentColor"}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Financial = ({ className, color }: IconProps): JSX.Element => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3.35996 2.87988C2.04019 2.87988 0.959961 3.96012 0.959961 5.27988V8.15988V11.0399V11.9999V14.3633V18.7199C0.959961 20.0452 2.03468 21.1199 3.35996 21.1199H20.64C21.9652 21.1199 23.04 20.0452 23.04 18.7199V14.3633V11.9999V11.0399V8.15988V5.27988C23.04 3.96012 21.9597 2.87988 20.64 2.87988H3.35996ZM3.35996 3.83988H20.64C21.4408 3.83988 22.08 4.47901 22.08 5.27988V6.25395C21.6772 5.9484 21.1814 5.75988 20.64 5.75988H3.35996C2.81855 5.75988 2.32271 5.9484 1.91996 6.25395V5.27988C1.91996 4.47901 2.55909 3.83988 3.35996 3.83988ZM3.35996 6.71988H20.64C21.4408 6.71988 22.08 7.35901 22.08 8.15988V9.13394C21.6772 8.8284 21.1814 8.63988 20.64 8.63988H3.35996C2.81855 8.63988 2.32271 8.8284 1.91996 9.13394V8.15988C1.91996 7.35901 2.55909 6.71988 3.35996 6.71988ZM3.35996 9.59988H20.64C21.4408 9.59988 22.08 10.239 22.08 11.0399V11.9999H17.0953C16.0546 11.9999 15.1027 12.5879 14.6371 13.5186L14.4581 13.8777C13.9925 14.8084 13.0411 15.3599 12 15.3599C10.9588 15.3599 10.0079 14.8084 9.54277 13.8777L9.36371 13.5186C8.89811 12.5874 7.94577 11.9999 6.90465 11.9999H1.91996V11.0399C1.91996 10.239 2.55909 9.59988 3.35996 9.59988ZM1.91996 12.9599H6.90465C7.58625 12.9599 8.19922 13.3389 8.50402 13.9489L8.68309 14.3071C9.30421 15.5484 10.5753 16.3199 12 16.3199C13.4241 16.3199 14.6948 15.5488 15.3168 14.3071L15.4968 13.948C15.8012 13.3389 16.4142 12.9599 17.0953 12.9599H22.08V14.3633V18.7199C22.08 19.5138 21.4339 20.1599 20.64 20.1599H3.35996C2.56604 20.1599 1.91996 19.5138 1.91996 18.7199V14.3633V12.9599Z"
      fill={color || "currentColor"}
    />
  </svg>
);

export const UserProfile = ({ className, color }: IconProps): JSX.Element => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className}>
    <circle cx="10" cy="6" r="4" stroke={color || "currentColor"} strokeWidth="1.5" />
    <path
      d="M3 18c0-3.314 3.134-6 7-6s7 2.686 7 6"
      stroke={color || "currentColor"}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const Menu = ({ className, color }: IconProps): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M3 12H21M3 6H21M3 18H21"
      stroke={color || "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const CaseSummary = ({
  className,
  color = "#0D50FF",
}: IconProps): JSX.Element => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M15 4H7M18 22L21 19L18 16M21 19H5C4.46957 19 3.96086 18.7893 3.58579 18.4142C3.21071 18.0391 3 17.5304 3 17V4M7 14H14M7 9H19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Rollcall = ({
  className,
  color = "#0D50FF",
}: IconProps): JSX.Element => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M14 2H6C5.46957 2 4.96086 2.21072 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8M14 2C14.3166 1.99949 14.6301 2.06161 14.9225 2.18277C15.215 2.30394 15.4806 2.48176 15.704 2.706L19.292 6.294C19.5168 6.51751 19.6952 6.78335 19.8167 7.07616C19.9382 7.36898 20.0005 7.68297 20 8M14 2V7C14 7.26522 14.1054 7.51957 14.2929 7.70711C14.4804 7.89465 14.7348 8 15 8L20 8M8 18V16M12 18V14M16 18V12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Schedule = ({
  className,
  color = "#0D50FF",
}: IconProps): JSX.Element => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8 2V5M16 2V5M3 9H21M8 13H8.01M12 13H12.01M16 13H16.01M8 17H8.01M12 17H12.01M16 17H16.01M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PreviousPatients = ({
  className,
  color = "#0D50FF",
}: IconProps): JSX.Element => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M21.375 11.9998C21.3752 14.4646 20.4048 16.8303 18.6737 18.5849C16.9426 20.3395 14.5902 21.3417 12.1256 21.3748H12C9.60663 21.3798 7.30309 20.4637 5.56687 18.8163C5.34994 18.6115 5.22327 18.3288 5.21474 18.0305C5.20622 17.7322 5.31653 17.4428 5.52141 17.2259C5.72629 17.0089 6.00895 16.8823 6.30722 16.8737C6.60549 16.8652 6.89494 16.9755 7.11188 17.1804C8.13023 18.1418 9.40933 18.7818 10.7893 19.0204C12.1694 19.2589 13.5891 19.0855 14.8711 18.5218C16.1531 17.9581 17.2406 17.029 17.9976 15.8507C18.7546 14.6725 19.1475 13.2972 19.1274 11.8969C19.1072 10.4966 18.6748 9.13321 17.8842 7.97723C17.0935 6.82125 15.9798 5.92391 14.6821 5.39733C13.3843 4.87075 11.9602 4.7383 10.5876 5.01652C9.21507 5.29474 7.95493 5.9713 6.96469 6.96165C6.9525 6.97383 6.94125 6.98508 6.92813 6.99633L5.14594 8.62477H6.75C7.04837 8.62477 7.33452 8.7433 7.5455 8.95427C7.75647 9.16525 7.875 9.4514 7.875 9.74977C7.875 10.0481 7.75647 10.3343 7.5455 10.5453C7.33452 10.7562 7.04837 10.8748 6.75 10.8748H2.25C1.95163 10.8748 1.66548 10.7562 1.4545 10.5453C1.24353 10.3343 1.125 10.0481 1.125 9.74977V5.24977C1.125 4.9514 1.24353 4.66525 1.4545 4.45427C1.66548 4.2433 1.95163 4.12477 2.25 4.12477C2.54837 4.12477 2.83452 4.2433 3.0455 4.45427C3.25647 4.66525 3.375 4.9514 3.375 5.24977V7.19227L5.38875 5.34914C6.70209 4.04286 8.37297 3.15491 10.1905 2.79738C12.008 2.43985 13.8907 2.62876 15.601 3.34027C17.3113 4.05178 18.7724 5.25399 19.8001 6.79517C20.8277 8.33634 21.3757 10.1474 21.375 11.9998Z"
      fill={color}
    />
  </svg>
);

export const Microscope = ({ className, color = "#0D50FF" }: IconProps): JSX.Element => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className={className}>
    <path d="M7 18h8M11 2v4M6 10h10M8 14h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="11" cy="10" r="3" stroke={color} strokeWidth="1.5" />
    <path d="M4 20h14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const Star = ({ className, color = "#EAB308" }: IconProps): JSX.Element => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
    <path
      d="M7 1l1.545 4.755H13l-3.773 2.745L10.773 13 7 10.255 3.227 13l1.545-4.5L1 5.755h4.455L7 1Z"
      fill={color}
    />
  </svg>
);

export const Emergency = ({ className }: IconProps): JSX.Element => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
    <circle cx="8" cy="8" r="7" fill="#EF4444" />
    <path d="M8 4v5M8 11v1" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const CheckApprove = ({ className, color = "white" }: IconProps): JSX.Element => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
    <path
      d="M3 8.5l3 3 7-7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const FlagEn = ({ className, onClick }: IconProps): JSX.Element => (
  <svg
    width="512"
    height="512"
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    onClick={onClick}
    aria-hidden
  >
    <path
      d="M503.202 322.783C508.939 301.492 512 279.104 512 256L503.202 189.218C496.784 165.404 487.018 142.965 474.438 122.435L415.379 55.652C371.675 20.8387 316.323 0.0256442 256.111 0H255.889C195.677 0.0256336 140.325 20.8387 96.6209 55.652L37.5621 122.435C24.9824 142.965 15.2155 165.404 8.79798 189.218L0 256L2.41187e-05 256.112C0.00992806 279.176 3.0698 301.527 8.7982 322.783L37.5622 389.565C53.2303 415.135 73.262 437.741 96.621 456.348L256 512L415.379 456.348C438.738 437.741 458.77 415.135 474.438 389.565L503.202 322.783Z"
      fill="#EEEEEE"
    />
    <path
      d="M503.202 189.217C508.939 210.508 512 232.896 512 256H0C0 232.896 3.06051 210.508 8.79822 189.217H503.202Z"
      fill="#D80027"
    />
    <path
      d="M415.379 55.6519C438.738 74.2588 458.77 96.8653 474.438 122.435H37.5622C53.2303 96.8653 73.262 74.2588 96.621 55.6519H415.379Z"
      fill="#D80027"
    />
    <path
      d="M474.438 389.565C487.018 369.035 496.784 346.596 503.202 322.782H8.79796C15.2155 346.596 24.9823 369.035 37.5621 389.565H474.438Z"
      fill="#D80027"
    />
    <path
      d="M415.379 456.348H96.6208C140.299 491.141 195.611 511.95 255.781 512H256.219C316.389 511.95 371.701 491.141 415.379 456.348Z"
      fill="#D80027"
    />
    <path
      d="M0 245.585C5.46421 109.029 117.896 0 255.792 0C255.861 0 255.931 2.75698e-05 256 8.2699e-05V256H0V245.585Z"
      fill="#0052B4"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M109.506 46.0312C117.873 40.1825 126.606 34.8212 135.664 29.9885L136.621 32.9341H164.521L141.95 49.3329L150.571 75.8666L128 59.4679L105.429 75.8666L114.05 49.3329L109.506 46.0312ZM29.5876 136.419C35.4945 125.258 42.2025 114.586 49.635 104.48L53.4214 116.133H81.3206L58.7496 132.532L67.371 159.066L44.8 142.667L22.2291 159.066L29.5876 136.419ZM211.2 6.40039L219.821 32.9341H247.721L225.15 49.3329L233.771 75.8666L211.2 59.4679L188.629 75.8666L197.25 49.3329L174.679 32.9341H202.579L211.2 6.40039ZM128 89.5996L136.621 116.133H164.521L141.95 132.532L150.571 159.066L128 142.667L105.429 159.066L114.05 132.532L91.4794 116.133H119.379L128 89.5996ZM219.821 116.133L211.2 89.5996L202.579 116.133H174.679L197.25 132.532L188.629 159.066L211.2 142.667L233.771 159.066L225.15 132.532L247.721 116.133H219.821ZM44.8 172.8L53.4214 199.334H81.3206L58.7496 215.732L67.371 242.266L44.8 225.867L22.2291 242.266L30.8504 215.732L8.27945 199.334H36.1787L44.8 172.8ZM136.621 199.334L128 172.8L119.379 199.334H91.4794L114.05 215.732L105.429 242.266L128 225.867L150.571 242.266L141.95 215.732L164.521 199.334H136.621ZM211.2 172.8L219.821 199.334H247.721L225.15 215.732L233.771 242.266L211.2 225.867L188.629 242.266L197.25 215.732L174.679 199.334H202.579L211.2 172.8Z"
      fill="#EEEEEE"
    />
  </svg>
);

export const FlagAr = ({ className, onClick }: IconProps): JSX.Element => (
  <svg
    width="512"
    height="512"
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    onClick={onClick}
    aria-hidden
  >
    <circle cx="256" cy="256" r="256" fill="#496E2D" />
    <path
      d="M144.696 306.087C144.696 324.528 159.646 339.478 178.087 339.478H278.261C278.261 354.846 290.719 367.304 306.087 367.304H339.478C354.846 367.304 367.304 354.846 367.304 339.478V306.087H144.696Z"
      fill="#EEEEEE"
    />
    <path
      d="M370.087 144.696V222.609C370.087 234.884 360.101 244.87 347.826 244.87V278.261C378.513 278.261 403.478 253.295 403.478 222.609V144.696H370.087Z"
      fill="#EEEEEE"
    />
    <path
      d="M130.783 222.609C130.783 234.884 120.797 244.87 108.522 244.87V278.261C139.209 278.261 164.174 253.295 164.174 222.609V144.696H130.783V222.609Z"
      fill="#EEEEEE"
    />
    <path d="M320 144.696H353.391V222.609H320V144.696Z" fill="#EEEEEE" />
    <path
      d="M269.913 189.217C269.913 192.286 267.416 194.782 264.348 194.782C261.28 194.782 258.783 192.285 258.783 189.217V144.695H225.392V189.217C225.392 192.286 222.895 194.782 219.827 194.782C216.759 194.782 214.262 192.285 214.262 189.217V144.695H180.87V189.217C180.87 210.698 198.346 228.174 219.827 228.174C228.1 228.174 235.772 225.574 242.088 221.158C248.403 225.573 256.076 228.174 264.349 228.174C266.015 228.174 267.653 228.057 269.264 227.852C266.898 237.601 258.118 244.869 247.653 244.869V278.26C278.34 278.26 303.305 253.294 303.305 222.608V189.217V144.695H269.914V189.217H269.913Z"
      fill="#EEEEEE"
    />
    <path d="M180.87 244.87H230.957V278.261H180.87V244.87Z" fill="#EEEEEE" />
  </svg>
);

export const FlagFa = ({ className, onClick }: IconProps): JSX.Element => {
  const clipId = React.useId().replace(/:/g, "");

  const emblemHalf = (
    <>
      <path d="M 1.015679,-0.01556 A 0.77528237,0.7752862 0 0 1 0.60199011,0.67052066 1.0040699,1.0040749 0 0 0 0.44435035,-0.74067818 q -0.0221518,-0.0177005 -0.0452767,-0.0341288 A 0.77575926,0.7757631 0 0 1 1.015679,-0.01556 Z" />
      <path d="m 0.65590144,-0.04683837 a 0.92689013,0.92689472 0 0 1 -1.21301321,0.88105983 q 0.0245198,0.00118 0.0492749,0.001178 a 1.0158759,1.0158809 0 0 0 0.84183925,-1.58419413 0.92423346,0.92423804 0 0 1 0.32189906,0.7019563 z" />
      <path d="M 0.26154437,-0.94393072 A 0.14154065,0.14154135 0 0 1 1.7299476e-6,-0.86887791 L -0.01707249,-0.88602911 1.7299476e-6,-0.96931462 A 0.1321491,0.13214975 0 0 0 0.24983482,-1.0002001 a 0.14021999,0.14022068 0 0 1 0.0117096,0.0562694 z" />
      <path d="M 0.11992727,-0.71445117 A 0.31475286,0.31475442 0 0 1 1.2855032e-6,-0.81025163 L -0.0506876,-0.01642556 1.2855032e-6,1.0001998 0.07882572,0.89166862 0.0891995,0.64144186 0.09996594,0.3809197 l 0.0014156,-0.0334002 4.7111e-4,-0.0124172 0.002279,-0.0541474 0.006758,-0.1640148 0.005501,-0.13242286 0.001571,-0.03827263 0.002042,-0.04872535 V -0.71445117 Z M 1.2855032e-6,-0.54965037 9.0174383e-5,-0.54949481 1.2855032e-6,-0.54933925 Z m 0,0.86447753 V 0.3145916 L 3.946188e-4,0.31468049 Z" />
    </>
  );

  return (
    <svg
      width="512"
      height="512"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      aria-hidden
    >
      <defs>
        <clipPath id={`${clipId}-clip`}>
          <circle cx="256" cy="256" r="256" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId}-clip)`}>
        <rect width="512" height="170.667" fill="#239F40" />
        <rect y="170.667" width="512" height="170.666" fill="#FFFFFF" />
        <rect y="341.333" width="512" height="170.667" fill="#DA0000" />
        <g transform="translate(256, 256) scale(50)" fill="#DA0000">
          {emblemHalf}
          <g transform="scale(-1, 1)">{emblemHalf}</g>
        </g>
      </g>
    </svg>
  );
};

export const Arrow = ({ className, color = "black" }: IconProps): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M18.2929 15.2893C18.6834 14.8988 18.6834 14.2656 18.2929 13.8751L13.4007 8.98766C12.6195 8.20726 11.3537 8.20757 10.5729 8.98835L5.68257 13.8787C5.29205 14.2692 5.29205 14.9024 5.68257 15.2929C6.0731 15.6835 6.70626 15.6835 7.09679 15.2929L11.2824 11.1073C11.673 10.7168 12.3061 10.7168 12.6966 11.1073L16.8787 15.2893C17.2692 15.6798 17.9024 15.6798 18.2929 15.2893Z"
      fill={color}
    />
  </svg>
);

export const Pen = ({ className, color = "black" }: IconProps): JSX.Element => (
  <svg width="12" height="17" viewBox="0 0 12 17" fill="none" className={className}>
    <path
      d="M6.33352 14.0042L10.8388 11.4525M3.86499 4.31845L8.74729 12.6371M5.8966 2.83721C5.97066 2.96537 5.92255 3.13164 5.78914 3.20859L1.74308 5.54239C1.60968 5.61934 1.44149 5.57783 1.36743 5.44967C-0.302322 2.5603 0.784099 1.4546 1.75464 0.894789C2.72517 0.334976 4.22406 -0.0569767 5.8966 2.83721ZM6.0307 3.06926L10.7699 11.27C10.8276 11.3699 10.8556 11.4843 10.8494 11.5994C10.7713 13.0528 10.5716 14.3263 10.4392 15.0496C10.3763 15.3931 10.0301 15.5946 9.70015 15.4795C9.00359 15.2364 7.79274 14.7773 6.48668 14.116C6.38363 14.0638 6.29836 13.9823 6.2406 13.8823L1.50153 5.68172L6.0307 3.06926Z"
      stroke={color}
      strokeLinecap="round"
    />
  </svg>
);

export const Bell = ({ className, color = "black" }: IconProps): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
      fill={color}
    />
  </svg>
);

export const Lock = ({ className, color = "#1C274C" }: IconProps): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.75736 10 5.17157 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16Z"
      stroke={color}
      strokeWidth="1.5"
    />
    <path
      d="M6 10V8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8V10"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const Help = ({ className, color = "#2068FE" }: IconProps): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" fill="none" />
    <path
      d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="17" r="1" fill={color} />
  </svg>
);

export const Phone = ({ className, color = "#2068FE" }: IconProps): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export const LogoutOutline = ({ className, color = "#2068FE" }: IconProps): JSX.Element => (
  <svg width="22" height="19" viewBox="0 0 22 19" fill="none" className={className}>
    <path
      d="M7.35 9.82H20.05M15.61 6.54L20.67 9.6L15.61 12.67M12.54 17.1H1.87V1.86H12.54"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const OnlineMode = ({ className, color = "black" }: IconProps): JSX.Element => (
  <svg width="21" height="17" viewBox="0 0 21 17" fill="none" className={className}>
    <path
      d="M4.45 0C4.27.002 4.1.065 3.96.178C1.55 2.082 0 5.03 0 8.34c0 3.3 1.55 6.25 3.96 8.15.17.13.34.19.55.17.21-.02.4-.13.53-.3.13-.17.19-.38.17-.59-.02-.21-.13-.4-.3-.53C2.91 13.62 1.6 11.14 1.6 8.34c0-2.8 1.31-5.29 3.35-7.1.13-.11.22-.24.23-.38 0-.14-.05-.28-.15-.4C5.17.13 4.99.05 4.78.04c-.08 0-.16 0-.33-.04Zm11.87 0c-.17.003-.33.057-.47.156-1.44 1.15-2.4 3.3-2.4 5.33 0 2.03.96 4.18 2.4 5.33.14.1.3.15.47.16.17 0 .33-.05.47-.16 1.44-1.15 2.4-3.3 2.4-5.33 0-2.03-.96-4.18-2.4-5.33a.72.72 0 0 0-.47-.156ZM6.93 3.14c-.18.012-.35.076-.49.18-1.48 1.17-2.44 3.32-2.44 5.35 0 2.03.96 4.18 2.44 5.35.12.09.26.14.41.15.15 0 .29-.05.41-.15 1.48-1.17 2.44-3.32 2.44-5.35 0-2.03-.96-4.18-2.44-5.35a.72.72 0 0 0-.41-.18Zm7.91 0c-.17.003-.33.057-.47.156-1.44 1.15-2.4 3.3-2.4 5.33 0 2.03.96 4.18 2.4 5.33.14.1.3.15.47.16.17 0 .33-.05.47-.16 1.44-1.15 2.4-3.3 2.4-5.33 0-2.03-.96-4.18-2.4-5.33a.72.72 0 0 0-.47-.156ZM10.4 5.94c-.64 0-1.25.25-1.7.7-.45.45-.7 1.06-.7 1.7 0 .64.25 1.25.7 1.7.45.45 1.06.7 1.7.7.64 0 1.25-.25 1.7-.7.45-.45.7-1.06.7-1.7 0-.64-.25-1.25-.7-1.7-.45-.45-1.06-.7-1.7-.7Z"
      fill={color}
    />
  </svg>
);

export const AllHourSupport = ({ className, color = "black" }: IconProps): JSX.Element => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={className}>
    <path
      d="M9.6 0C4.31 0 0 4.31 0 9.6c0 5.29 4.31 9.6 9.6 9.6 5.29 0 9.6-4.31 9.6-9.6C19.2 6.29 17.52 3.36 14.96 1.63L15.88.46 12 .32l1.12 3.68.85-1.09C15.94 4.2 17.31 6.33 17.56 8.8c-.2.01-.4.1-.54.25a.6.6 0 0 0-.16.45c0 .21.08.4.22.55.17.15.4.2.62.2-.37 3.79-3.37 6.79-7.16 7.16-.01-.22-.06-.45-.21-.62a.85.85 0 0 0-.62-.26c-.22 0-.43.07-.6.22-.15.14-.24.34-.25.55-3.79-.37-6.79-3.37-7.16-7.16.2-.01.4-.1.54-.25.14-.15.22-.34.22-.55 0-.21-.08-.4-.22-.55a.85.85 0 0 0-.62-.26c-.22 0-.43.07-.6.22C2.02 5.04 5.04 2.14 8.81 1.76 8.85 1.95 8.96 2.13 9.12 2.25c.16.12.36.19.58.19.22 0 .42-.07.58-.19.16-.12.27-.3.31-.49C5.01 2.02 8.81 0 9.6 0ZM7.01 7H6.23v.71h1.18v-.68c0-.42.3-.77.74-.77.44 0 .66.22.66.59 0 .3-.2.55-1.28 1.34l-1.6 1.34v.59h3.86v-1H6.84v-.13l1.56-1.3c1.2-1 1.53-1.5 1.53-2 0-.9-.74-1.5-1.99-1.5-.9 0-1.83.68-1.83 1.69Zm4.72.14c-.88 1.33-1.46 2.29-1.81 3.17v1.07h2.49v1.02h1.22v-1.02h.63v-1.01h-.63V7.13h-1.9Z"
      fill={color}
    />
  </svg>
);

export const Sun = ({ className, color }: IconProps): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="4" stroke={color || "currentColor"} strokeWidth="2" />
    <path
      d="M12 2V4M12 20V22M4 12H2M22 12H20M19.07 4.93L17.66 6.34M6.34 17.66L4.93 19.07M19.07 19.07L17.66 17.66M6.34 6.34L4.93 4.93"
      stroke={color || "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export const Moon = ({ className, color }: IconProps): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
      stroke={color || "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Camera = ({
  className,
  color = "white",
  size = 16,
}: IconProps & { size?: number }): JSX.Element => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden
  >
    <path
      d="M9 4.5L7.8 6H5.25C4.007 6 3 7.007 3 8.25V17.25C3 18.493 4.007 19.5 5.25 19.5H18.75C19.993 19.5 21 18.493 21 17.25V8.25C21 7.007 19.993 6 18.75 6H16.2L15 4.5H9Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12.75" r="3.25" stroke={color} strokeWidth="1.8" />
  </svg>
);

export const ChevronRight = ({
  className,
  color = "#CBD5E1",
  size = 20,
}: IconProps & { size?: number }): JSX.Element => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    aria-hidden
  >
    <path
      d="M9 5L16 12L9 19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PersonalInformation = ({
  className,
  color = "#0D50FF",
}: IconProps): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8" r="3.5" stroke={color} strokeWidth="1.8" />
    <path
      d="M5 19.5c0-3.3 3.1-6 7-6s7 2.7 7 6"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export const ProfessionalInformation = ({
  className,
  color = "#0D50FF",
}: IconProps): JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
    <rect
      x="3"
      y="7"
      width="18"
      height="13"
      rx="2"
      stroke={color}
      strokeWidth="1.8"
    />
    <path
      d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7"
      stroke={color}
      strokeWidth="1.8"
    />
    <path d="M3 12h18" stroke={color} strokeWidth="1.8" />
  </svg>
);
