// src/chartSetup.js
import {
    Chart as ChartJS,
    LineElement,
    BarElement,
    ArcElement,
    PointElement,
    LineController,
    BarController,
    DoughnutController,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
  } from 'chart.js';
  
  ChartJS.register(
    LineElement,
    BarElement,
    ArcElement,
    PointElement,
    LineController,
    BarController,
    DoughnutController,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    Filler
  );
  