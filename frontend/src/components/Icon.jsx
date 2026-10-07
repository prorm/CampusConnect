const paths = {
  arrow: "M5 12h14m-6-6 6 6-6 6",
  chevron: "m9 5 7 7-7 7",
  close: "m6 6 12 12M6 18 18 6",
  spark: "m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6L12 3Z",
  compass: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-6-3-2 4-4 2 2-4 4-2Z",
  calendar: "M5 5h14v15H5V5Zm3-2v4m8-4v4M5 10h14m-10 4h2m2 0h2m-6 3h2",
  clock: "M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2",
  pin: "M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0ZM14 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z",
  check: "m5 12 4 4L19 6",
  users:
    "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.9M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm4-3a4 4 0 0 1 0 8",
  poster: "M6 3h12v18H6V3Zm3 4h6m-6 4h6m-6 4h3m-3 3h6",
  passport:
    "M5 3h14v18H5V3Zm10 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM9 17h6M12 7v6m-3-3h6",
  grid: "M3 3h7v7H3V3Zm11 0h7v7h-7V3ZM3 14h7v7H3v-7Zm11 0h7v7h-7v-7Z",
  search: "M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-2 5 6 6",
  upload: "M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6",
  download: "M12 3v13m-5-5 5 5 5-5M4 17v4h16v-4",
  bolt: "m13 2-9 12h7l-1 8 10-12h-7l1-8Z",
  heart:
    "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z",
  chat: "M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5a9.5 9.5 0 0 1 19 0ZM7 10h10m-10 4h6",
  logout: "M9 4H4v16h5m5-13 5 5-5 5m-6-5h11",
  menu: "M4 6h16M4 12h16M4 18h16",
  plus: "M12 5v14M5 12h14",
  shield: "m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-6",
  sun: "M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5",
  warning: "m12 3 10 18H2L12 3Zm0 6v5m0 3v1",
  play: "m8 4 12 8-12 8V4Z",
  book: "M3 4h7l2 2 2-2h7v16h-7l-2 2-2-2H3V4Zm9 2v16",
  trash: "M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3",
  refresh: "M20 11a8 8 0 0 0-14.9-4M4 4v4h4m-4 5a8 8 0 0 0 14.9 4M20 20v-4h-4",
  lock: "M6 11h12v10H6V11Zm2 0V8a4 4 0 1 1 8 0v3m-4 4v2",
  mail: "M3 6h18v12H3V6Zm0 0 9 7 9-7",
  user: "M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21a8 8 0 0 1 16 0",
  chart: "M4 20V10m6 10V4m6 16v-7m4 7H2",
  image: "M4 5h16v14H4V5Zm0 11 5-5 4 4 3-3 4 4M15 9h.01",
  offline: "M2 8.8a15 15 0 0 1 4.2-2.8M10 5.1A15 15 0 0 1 22 8.8M5 12.9a10 10 0 0 1 5.3-2.8M16.8 11.4a10 10 0 0 1 2.2 1.5M8.5 16.4a5 5 0 0 1 7 0M12 20h.01M3 3l18 18",
  eye: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Zm13 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
};
export default function Icon({ name = "spark", size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name] || paths.spark} />
    </svg>
  );
}
