import React, { useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw, Download } from "lucide-react";

interface SchematicProps {
  projectId: string;
}

export default function CircularSchematic({ projectId }: SchematicProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleDownloadSVG = () => {
    const svgElement = document.getElementById(`svg-${projectId}`);
    if (!svgElement) return;
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `ECE_Hub_${projectId}_Schematic.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const renderSchematic = () => {
    switch (projectId) {
      case "vlsi_fpga":
        return (
          <svg
            id="svg-vlsi_fpga"
            width="100%"
            height="100%"
            viewBox="0 0 800 450"
            className="text-slate-100"
          >
            {/* Background Grid */}
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            <text x="30" y="35" fill="#f8fafc" fontSize="16" fontWeight="bold">32-bit Pipelined RISC Core - Bus & Hardware Interconnects</text>

            {/* Stages */}
            {/* IF Stage */}
            <g transform="translate(40, 100)">
              <rect x="0" y="0" width="100" height="180" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
              <text x="12" y="25" fill="#3b82f6" fontSize="12" fontWeight="bold">STAGE 1: IF</text>
              <rect x="10" y="45" width="80" height="40" rx="4" fill="#0f172a" stroke="#475569" />
              <text x="18" y="69" fill="#94a3b8" fontSize="11">Prog Counter</text>
              <rect x="10" y="105" width="80" height="50" rx="4" fill="#0f172a" stroke="#475569" />
              <text x="15" y="128" fill="#94a3b8" fontSize="10">Instr Memory</text>
              <text x="25" y="143" fill="#94a3b8" fontSize="10">(ROM - 1KB)</text>
            </g>

            {/* IF_ID Buffer */}
            <rect x="155" y="80" width="15" height="220" fill="#3b82f6" rx="2" />
            <text x="160" y="70" fill="#3b82f6" fontSize="10" fontWeight="bold" transform="rotate(90,160,70)">IF/ID Register</text>

            {/* ID Stage */}
            <g transform="translate(185, 100)">
              <rect x="0" y="0" width="100" height="180" rx="6" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
              <text x="12" y="25" fill="#10b981" fontSize="12" fontWeight="bold">STAGE 2: ID</text>
              <rect x="10" y="45" width="80" height="45" rx="4" fill="#0f172a" stroke="#475569" />
              <text x="20" y="72" fill="#94a3b8" fontSize="11">Register File</text>
              <rect x="10" y="105" width="80" height="45" rx="4" fill="#0f172a" stroke="#475569" />
              <text x="18" y="132" fill="#94a3b8" fontSize="11">Control Unit</text>
            </g>

            {/* ID_EX Buffer */}
            <rect x="300" y="80" width="15" height="220" fill="#10b981" rx="2" />
            <text x="305" y="70" fill="#10b981" fontSize="10" fontWeight="bold" transform="rotate(90,305,70)">ID/EX Register</text>

            {/* EX Stage */}
            <g transform="translate(330, 100)">
              <rect x="0" y="0" width="110" height="180" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
              <text x="12" y="25" fill="#f59e0b" fontSize="12" fontWeight="bold">STAGE 3: EX</text>
              <path d="M 15,60 L 95,60 L 80,100 L 95,140 L 15,140 L 30,100 Z" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
              <text x="40" y="105" fill="#94a3b8" fontSize="13" fontWeight="bold">ALU</text>
            </g>

            {/* EX_MEM Buffer */}
            <rect x="455" y="80" width="15" height="220" fill="#f59e0b" rx="2" />

            {/* MEM Stage */}
            <g transform="translate(485, 100)">
              <rect x="0" y="0" width="100" height="180" rx="6" fill="#1e293b" stroke="#a855f7" strokeWidth="2" />
              <text x="12" y="25" fill="#a855f7" fontSize="12" fontWeight="bold">STAGE 4: MEM</text>
              <rect x="10" y="60" width="80" height="70" rx="4" fill="#0f172a" stroke="#475569" />
              <text x="18" y="95" fill="#94a3b8" fontSize="11">Data Memory</text>
              <text x="25" y="112" fill="#94a3b8" fontSize="10">(SRAM - 4KB)</text>
            </g>

            {/* MEM_WB Buffer */}
            <rect x="600" y="80" width="15" height="220" fill="#a855f7" rx="2" />

            {/* WB Stage */}
            <g transform="translate(630, 100)">
              <rect x="0" y="0" width="100" height="180" rx="6" fill="#1e293b" stroke="#ec4899" strokeWidth="2" />
              <text x="12" y="25" fill="#ec4899" fontSize="12" fontWeight="bold">STAGE 5: WB</text>
              <rect x="10" y="70" width="80" height="40" rx="4" fill="#0f172a" stroke="#475569" />
              <text x="18" y="95" fill="#94a3b8" fontSize="11">Mux Select</text>
            </g>

            {/* Connection buses / feedback routes */}
            <path d="M 680,110 L 680,350 L 235,350 L 235,145" fill="none" stroke="#ec4899" strokeWidth="2" strokeDasharray="4 2" />
            <polygon points="235,145 231,152 239,152" fill="#ec4899" />
            <text x="420" y="342" fill="#ec4899" fontSize="10">Write-Back Bus Data Feed</text>

            <path d="M 140,190 L 185,190" fill="none" stroke="#3b82f6" strokeWidth="2" />
            <polygon points="185,190 178,186 178,194" fill="#3b82f6" />

            <path d="M 285,145 L 330,145" fill="none" stroke="#10b981" strokeWidth="2" />
            <polygon points="330,145 323,141 323,149" fill="#10b981" />

            <path d="M 440,165 L 485,165" fill="none" stroke="#f59e0b" strokeWidth="2" />
            <polygon points="485,165 478,161 478,169" fill="#f59e0b" />

            <path d="M 585,190 L 630,190" fill="none" stroke="#a855f7" strokeWidth="2" />
            <polygon points="630,190 623,186 623,194" fill="#a855f7" />
          </svg>
        );

      case "embedded_iot":
        return (
          <svg
            id="svg-embedded_iot"
            width="100%"
            height="100%"
            viewBox="0 0 800 450"
            className="text-slate-100"
          >
            <rect width="100%" height="100%" fill="url(#grid)" />
            <text x="30" y="35" fill="#f8fafc" fontSize="16" fontWeight="bold">ESP32 Core Smart Industrial Interconnect Schematic</text>

            {/* Central ESP32 */}
            <g transform="translate(300, 120)">
              <rect x="0" y="0" width="200" height="180" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
              <text x="32" y="25" fill="#f59e0b" fontSize="14" fontWeight="bold">ESP32 DevKit V1</text>
              <text x="50" y="45" fill="#64748b" fontSize="10">802.11 b/g/n & BLE</text>
              
              {/* Pins representation */}
              <circle cx="0" cy="50" r="3" fill="#ef4444" /><text x="8" y="53" fill="#94a3b8" fontSize="10">EN</text>
              <circle cx="0" cy="80" r="3" fill="#3b82f6" /><text x="8" y="83" fill="#94a3b8" fontSize="10">D23 (DHT22)</text>
              <circle cx="0" cy="110" r="3" fill="#3b82f6" /><text x="8" y="113" fill="#94a3b8" fontSize="10">D34 (MQ-2)</text>
              <circle cx="0" cy="140" r="3" fill="#10b981" /><text x="8" y="143" fill="#94a3b8" fontSize="10">D21 (SDA)</text>

              <circle cx="200" cy="50" r="3" fill="#10b981" /><text x="145" y="53" fill="#94a3b8" fontSize="10">D22 (SCL)</text>
              <circle cx="200" cy="80" r="3" fill="#ec4899" /><text x="145" y="83" fill="#94a3b8" fontSize="10">D18 (Relay1)</text>
              <circle cx="200" cy="110" r="3" fill="#ec4899" /><text x="145" y="113" fill="#94a3b8" fontSize="10">D19 (Relay2)</text>
              <circle cx="200" cy="140" r="3" fill="#a855f7" /><text x="165" y="143" fill="#94a3b8" fontSize="10">GND</text>
            </g>

            {/* DHT22 */}
            <g transform="translate(60, 50)">
              <rect x="0" y="0" width="140" height="80" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
              <text x="10" y="24" fill="#3b82f6" fontSize="12" fontWeight="bold">DHT22 Temp / Hum</text>
              <rect x="10" y="35" width="120" height="8" fill="#334155" />
              <text x="15" y="65" fill="#f8fafc" fontSize="10">VCC, DATA, NC, GND</text>
            </g>

            {/* MQ-2 */}
            <g transform="translate(60, 240)">
              <rect x="0" y="0" width="140" height="90" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
              <text x="10" y="24" fill="#10b981" fontSize="12" fontWeight="bold">MQ-2 Smoke Sensor</text>
              <circle cx="70" cy="55" r="15" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              <text x="65" y="58" fill="#94a3b8" fontSize="10">Sn</text>
            </g>

            {/* Dual Channel Relay */}
            <g transform="translate(580, 140)">
              <rect x="0" y="0" width="160" height="120" rx="4" fill="#0f172a" stroke="#ef4444" strokeWidth="2" />
              <text x="10" y="24" fill="#ef4444" fontSize="12" fontWeight="bold">Relay Switch Core</text>
              <rect x="15" y="45" width="55" height="50" fill="#1e293b" rx="2" stroke="#475569" />
              <text x="25" y="75" fill="#f8fafc" fontSize="10">Ch 1</text>
              <rect x="90" y="45" width="55" height="50" fill="#1e293b" rx="2" stroke="#475569" />
              <text x="100" y="75" fill="#f8fafc" fontSize="10">Ch 2</text>
            </g>

            {/* Connections */}
            {/* DHT22 to ESP32 */}
            <path d="M 200,90 L 250,90 L 250,200 L 300,200" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
            
            {/* MQ2 to ESP32 */}
            <path d="M 200,285 L 270,285 L 270,230 L 300,230" fill="none" stroke="#10b981" strokeWidth="1.5" />

            {/* ESP32 Relays to Switches */}
            <path d="M 500,200 L 580,200" fill="none" stroke="#ec4899" strokeWidth="1.5" />
            <path d="M 500,230 L 540,230 L 540,245 L 580,245" fill="none" stroke="#ec4899" strokeWidth="1.5" />

            {/* Visual labels */}
            <text x="210" y="180" fill="#3b82f6" fontSize="9">DHT_SDA_Pin</text>
            <text x="210" y="310" fill="#10b981" fontSize="9">Analog MQ ADC (GPIO34)</text>
          </svg>
        );

      case "comms_mimo_ofdm":
        return (
          <svg
            id="svg-comms_mimo_ofdm"
            width="100%"
            height="100%"
            viewBox="0 0 800 450"
            className="text-slate-100"
          >
            <rect width="100%" height="100%" fill="url(#grid)" />
            <text x="30" y="35" fill="#f8fafc" fontSize="16" fontWeight="bold">2x2 MIMO-OFDM 5G Link Processing Chain</text>

            {/* TX blocks */}
            <g transform="translate(10, 80)">
              <rect x="0" y="0" width="80" height="50" rx="4" fill="#1e293b" stroke="#3b82f6" />
              <text x="8" y="30" fill="#f8fafc" fontSize="11">Data Stream</text>
            </g>

            <g transform="translate(110, 80)">
              <rect x="0" y="0" width="100" height="50" rx="4" fill="#1e293b" stroke="#3b82f6" />
              <text x="12" y="30" fill="#3b82f6" fontSize="11">16-QAM Mapper</text>
            </g>

            <g transform="translate(240, 80)">
              <rect x="0" y="0" width="110" height="120" rx="4" fill="#1e293b" stroke="#10b981" />
              <text x="12" y="24" fill="#10b981" fontSize="11" fontWeight="bold">MIMO Space-Time</text>
              <text x="18" y="55" fill="#94a3b8" fontSize="11">Alamouti Encoder</text>
              <rect x="10" y="75" width="40" height="30" fill="#0f172a" />
              <text x="18" y="94" fill="#10b981" fontSize="10">TX1</text>
              <rect x="60" y="75" width="40" height="30" fill="#0f172a" />
              <text x="68" y="94" fill="#10b981" fontSize="10">TX2</text>
            </g>

            {/* IFFT Core Block */}
            <g transform="translate(370, 70)">
              <rect x="0" y="0" width="80" height="60" rx="4" fill="#1e293b" stroke="#f59e0b" />
              <text x="12" y="35" fill="#f59e0b" fontSize="12" fontWeight="bold">IFFT 64p</text>
              <text x="15" y="50" fill="#94a3b8" fontSize="9">Frequency-Time</text>
            </g>
            <g transform="translate(370, 150)">
              <rect x="0" y="0" width="80" height="60" rx="4" fill="#1e293b" stroke="#f59e0b" />
              <text x="12" y="35" fill="#f59e0b" fontSize="12" fontWeight="bold">IFFT 64p</text>
              <text x="15" y="50" fill="#94a3b8" fontSize="9">Frequency-Time</text>
            </g>

            {/* Rayliegh channel representation */}
            <g transform="translate(480, 110)">
              <rect x="0" y="0" width="100" height="80" rx="4" fill="#0f172a" stroke="#ef4444" strokeWidth="2" strokeDasharray="3" />
              <text x="15" y="35" fill="#ef4444" fontSize="11" fontWeight="bold">Rayleigh Fading</text>
              <text x="32" y="55" fill="#94a3b8" fontSize="10">& AWGN</text>
            </g>

            {/* Antennas */}
            {/* TX Antennas */}
            <line x1="460" y1="100" x2="480" y2="120" stroke="#f59e0b" strokeWidth="2" />
            <line x1="460" y1="180" x2="480" y2="160" stroke="#f59e0b" strokeWidth="2" />

            {/* RX Antennas */}
            <line x1="600" y1="120" x2="580" y2="140" stroke="#a855f7" strokeWidth="2" />
            <line x1="600" y1="180" x2="580" y2="160" stroke="#a855f7" strokeWidth="2" />

            {/* Receivers */}
            <g transform="translate(615, 110)">
              <rect x="0" y="0" width="110" height="90" rx="4" fill="#1e293b" stroke="#a855f7" />
              <text x="10" y="25" fill="#a855f7" fontSize="11" fontWeight="bold">MIMO Receiver</text>
              <text x="12" y="50" fill="#94a3b8" fontSize="10">FFT + MMSE</text>
              <text x="12" y="70" fill="#94a3b8" fontSize="10">Equalizer</text>
            </g>

            {/* Paths */}
            <path d="M 90,105 L 110,105" fill="none" stroke="#2563eb" strokeWidth="1.5" />
            <path d="M 210,105 L 240,105" fill="none" stroke="#2563eb" strokeWidth="1.5" />
            <path d="M 350,100 L 370,100" fill="none" stroke="#2563eb" strokeWidth="1.5" />
            <path d="M 350,170 L 370,170" fill="none" stroke="#2563eb" strokeWidth="1.5" />
          </svg>
        );

      case "ai_electronics":
        return (
          <svg
            id="svg-ai_electronics"
            width="100%"
            height="100%"
            viewBox="0 0 800 450"
            className="text-slate-100"
          >
            <rect width="100%" height="100%" fill="url(#grid)" />
            <text x="30" y="35" fill="#f8fafc" fontSize="16" fontWeight="bold">AI Edge Vision & ESP32 Traffic Timing Schematic</text>

            {/* Camera */}
            <g transform="translate(40, 120)">
              <rect x="0" y="0" width="120" height="90" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
              <text x="15" y="25" fill="#3b82f6" fontSize="12" fontWeight="bold">IP CCTV Camera</text>
              <circle cx="60" cy="55" r="15" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
              <circle cx="60" cy="55" r="6" fill="#ef4444" />
            </g>

            {/* Edge AI Processor */}
            <g transform="translate(230, 80)">
              <rect x="0" y="0" width="180" height="180" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
              <text x="15" y="30" fill="#10b981" fontSize="14" fontWeight="bold">SBC Edge Computer</text>
              <text x="15" y="50" fill="#64748b" fontSize="10">Broadcom BCM2711 SOC</text>
              
              <rect x="15" y="70" width="150" height="40" rx="4" fill="#0f172a" stroke="#475569" />
              <text x="25" y="94" fill="#10b981" fontSize="12" fontWeight="bold">YOLOv8 Engine</text>
              
              <rect x="15" y="125" width="150" height="40" rx="4" fill="#0f172a" stroke="#475569" />
              <text x="25" y="149" fill="#94a3b8" fontSize="11">Adaptive Control Loop</text>
            </g>

            {/* ESP32 Controller */}
            <g transform="translate(490, 100)">
              <rect x="0" y="0" width="130" height="140" rx="6" fill="#1e293b" stroke="#a855f7" strokeWidth="2" />
              <text x="15" y="25" fill="#a855f7" fontSize="13" fontWeight="bold">ESP32 Signaling</text>
              <text x="15" y="45" fill="#64748b" fontSize="9">Timer Interrupters</text>
              
              {/* GPIO representations */}
              <circle cx="0" cy="70" r="3" fill="#a855f7" /><text x="8" y="73" fill="#94a3b8" fontSize="10">RX2</text>
              <circle cx="130" cy="70" r="3" fill="#ec4899" /><text x="100" y="73" fill="#94a3b8" fontSize="10">G12</text>
              <circle cx="130" cy="95" r="3" fill="#ec4899" /><text x="100" y="98" fill="#94a3b8" fontSize="10">G13</text>
              <circle cx="130" cy="120" r="3" fill="#ec4899" /><text x="100" y="123" fill="#94a3b8" fontSize="10">G14</text>
            </g>

            {/* Physical Traffic signals output */}
            <g transform="translate(680, 110)">
              <rect x="0" y="0" width="50" height="120" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="3" />
              <circle cx="25" cy="30" r="12" fill="#ef4444" /> {/* RED */}
              <circle cx="25" cy="60" r="12" fill="#eab308" opacity="0.3" /> {/* YELLOW */}
              <circle cx="25" cy="90" r="12" fill="#22c55e" opacity="0.3" /> {/* GREEN */}
            </g>

            {/* Links and labels */}
            <path d="M 160,165 L 230,165" fill="none" stroke="#3b82f6" strokeWidth="2" />
            <text x="170" y="155" fill="#3b82f6" fontSize="10">RTSP Stream</text>

            <path d="M 410,170 L 490,170" fill="none" stroke="#10b981" strokeWidth="2" />
            <text x="424" y="157" fill="#10b981" fontSize="10">Serial commands</text>

            <path d="M 620,170 L 680,170" fill="none" stroke="#ec4899" strokeWidth="2" strokeDasharray="3" />
          </svg>
        );

      case "power_ev_bms":
        return (
          <svg
            id="svg-power_ev_bms"
            width="100%"
            height="100%"
            viewBox="0 0 800 450"
            className="text-slate-100"
          >
            <rect width="100%" height="100%" fill="url(#grid)" />
            <text x="30" y="35" fill="#f8fafc" fontSize="16" fontWeight="bold">Active-Balancing 4S Li-Ion BMS Topology</text>

            {/* 4 Cells series */}
            <g transform="translate(40, 100)">
              <text x="0" y="-10" fill="#94a3b8" fontSize="11" fontWeight="bold">4S Series Packs</text>
              
              {/* Cell 4 */}
              <rect x="0" y="0" width="50" height="30" rx="2" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
              <text x="12" y="18" fill="#f8fafc" fontSize="10">Cell 4</text>
              <line x1="50" y1="15" x2="70" y2="15" stroke="#94a3b8" strokeWidth="2" />

              {/* Cell 3 */}
              <rect x="70" y="0" width="50" height="30" rx="2" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
              <text x="82" y="18" fill="#f8fafc" fontSize="10">Cell 3</text>
              <line x1="120" y1="15" x2="140" y2="15" stroke="#94a3b8" strokeWidth="2" />

              {/* Cell 2 */}
              <rect x="140" y="0" width="50" height="30" rx="2" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
              <text x="152" y="18" fill="#f8fafc" fontSize="10">Cell 2</text>
              <line x1="190" y1="15" x2="210" y2="15" stroke="#94a3b8" strokeWidth="2" />

              {/* Cell 1 */}
              <rect x="210" y="0" width="50" height="30" rx="2" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
              <text x="222" y="18" fill="#f8fafc" fontSize="10">Cell 1</text>
            </g>

            {/* ADC Dividers mapping */}
            <g transform="translate(60, 220)">
              <rect x="0" y="0" width="180" height="100" rx="4" fill="#1e293b" stroke="#3b82f6" />
              <text x="15" y="24" fill="#3b82f6" fontSize="11" fontWeight="bold">Low-Noise Resistor Dividers</text>
              <text x="15" y="50" fill="#94a3b8" fontSize="10">Divides 16.8V max output</text>
              <text x="15" y="70" fill="#94a3b8" fontSize="10">down to 0-3.3V safe ranges</text>
            </g>

            {/* ESP32 Controller */}
            <g transform="translate(340, 150)">
              <rect x="0" y="0" width="180" height="180" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
              <text x="32" y="28" fill="#f59e0b" fontSize="14" fontWeight="bold">Main ESP32 Core</text>
              <text x="32" y="48" fill="#64748b" fontSize="10">12-bit Active ADCs</text>
              
              <rect x="15" y="65" width="150" height="40" rx="4" fill="#0f172a" />
              <text x="22" y="90" fill="#f59e0b" fontSize="11">Coulomb Counter (SoC)</text>

              <rect x="15" y="120" width="150" height="40" rx="4" fill="#0f172a" />
              <text x="22" y="145" fill="#10b981" fontSize="11">Active Switch Controls</text>
            </g>

            {/* Active MOSFET Balancers */}
            <g transform="translate(580, 100)">
              <rect x="0" y="0" width="170" height="110" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
              <text x="15" y="25" fill="#10b981" fontSize="11" fontWeight="bold">IRFZ44N Shunt MOSFETs</text>
              <rect x="20" y="50" width="30" height="40" fill="#1e293b" />
              <text x="26" y="72" fill="#f8fafc" fontSize="10">Q1</text>
              <rect x="70" y="50" width="30" height="40" fill="#1e293b" />
              <text x="76" y="72" fill="#f8fafc" fontSize="10">Q2</text>
              <rect x="120" y="50" width="30" height="40" fill="#1e293b" />
              <text x="126" y="72" fill="#f8fafc" fontSize="10">Q3</text>
            </g>

            {/* Hall-Effect Current Sensor */}
            <g transform="translate(20, 310)">
              <rect x="0" y="0" width="120" height="60" rx="4" fill="#1e293b" stroke="#ec4899" />
              <text x="10" y="24" fill="#ec4899" fontSize="11" fontWeight="bold">ACS712 Sensor</text>
              <text x="10" y="45" fill="#94a3b8" fontSize="10">Monitors current flow</text>
            </g>

            {/* Paths */}
            <path d="M 300,115 L 320,115 L 320,190 L 340,190" fill="none" stroke="#22c55e" strokeWidth="1.5" />
            <path d="M 150,220 L 150,180 L 340,180" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
            <path d="M 520,290 L 580,180" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
          </svg>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full text-slate-400">
            No schematic defined for this project.
          </div>
        );
    }
  };

  return (
    <div id="schematic-container" className="relative border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-2 select-none h-[480px] shadow-sm">
      {/* Schematic overlay header buttons */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10 bg-white/95 p-1.5 rounded-lg border border-slate-200 backdrop-blur-sm shadow-sm">
        <button
          onClick={handleZoomIn}
          className="p-1 px-2.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs flex items-center gap-1 transition"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1 px-2.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs flex items-center gap-1 transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleReset}
          className="p-1 px-2.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs flex items-center gap-1 transition"
          title="Reset Zoom"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-4 bg-slate-200" />
        <button
          onClick={handleDownloadSVG}
          className="p-1 px-2.5 rounded-md text-emerald-600 hover:text-emerald-700 hover:bg-slate-100 text-xs flex items-center gap-1 transition"
          title="Download SVG file"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Save SVG</span>
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-10 bg-white/95 p-1.5 px-3 rounded-md border border-slate-200 text-[10px] text-slate-500 backdrop-blur-sm pointer-events-none shadow-sm">
        ℹ️ Drag within this box to pan, or use tool buttons to zoom.
      </div>

      {/* Map Drag Container */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
          className="w-full h-full flex items-center justify-center p-4"
        >
          {renderSchematic()}
        </div>
      </div>
    </div>
  );
}
