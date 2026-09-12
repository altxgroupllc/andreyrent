export function RouteBackground() {
  return (
    <div className="route-map-background" aria-hidden="true">
      <svg
        viewBox="0 0 1600 1000"
        preserveAspectRatio="xMidYMid slice"
        className="route-map-svg"
        role="presentation"
      >
        <g className="route-map-layer route-map-layer-a">
          <path className="route-map-road route-map-road-major" d="M-90 130 C190 210 370 205 610 120 S1070 20 1690 165" />
          <path className="route-map-road" d="M40 -80 C180 180 290 280 560 360 S980 420 1170 655 S1420 900 1660 860" />
          <path className="route-map-road" d="M-120 490 C180 430 405 470 645 610 S1080 820 1700 720" />
          <path className="route-map-road route-map-road-major" d="M190 -90 C260 130 330 335 260 560 S170 885 290 1090" />
          <path className="route-map-road" d="M770 -120 C705 160 740 290 875 485 S1080 740 1040 1120" />
        </g>

        <g className="route-map-layer route-map-layer-b">
          <path className="route-map-road route-map-road-minor" d="M-120 285 C170 350 345 310 505 205 S835 25 1010 120 S1280 390 1690 315" />
          <path className="route-map-road route-map-road-minor" d="M-60 760 C240 690 460 680 650 790 S1020 980 1260 845 S1490 700 1690 770" />
          <path className="route-map-road route-map-road-minor" d="M470 -90 C500 110 445 260 535 430 S710 700 640 1090" />
          <path className="route-map-road route-map-road-minor" d="M1260 -100 C1170 140 1210 335 1335 500 S1510 800 1460 1100" />
          <path className="route-map-road route-map-road-minor" d="M-90 600 C170 565 295 590 430 690 S680 845 920 800 S1320 540 1710 585" />
        </g>

        <g className="route-map-accent-layer">
          <path className="route-map-accent route-map-accent-a" d="M-90 130 C190 210 370 205 610 120 S1070 20 1690 165" />
          <path className="route-map-accent route-map-accent-b" d="M40 -80 C180 180 290 280 560 360 S980 420 1170 655 S1420 900 1660 860" />
          <path className="route-map-accent route-map-accent-c" d="M-120 490 C180 430 405 470 645 610 S1080 820 1700 720" />
        </g>
      </svg>
    </div>
  );
}
