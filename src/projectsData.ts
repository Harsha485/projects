import { ProjectData } from "./types";

export const projectsData: ProjectData[] = [
  {
    id: "vlsi_fpga",
    overview: {
      title: "Design and Implementation of a 32-bit Five-Stage Pipelined RISC Processor using Verilog HDL",
      domain: "VLSI / FPGA",
      difficulty: "Advanced",
      estimatedTime: "8-10 Weeks",
      industryRelevance: "Critical for Semiconductor, Processor Design (Intel, AMD, Qualcomm, NVIDIA, Apple Silicon) & ASIC verification.",
      placementOpportunities: [
        "ASIC Design Engineer",
        "FPGA Prototyping Engineer",
        "RTL Verification Analyst",
        "Physical Design Trainee"
      ],
      requiredSkills: ["Verilog HDL", "Computer Architecture", "FPGA Synthesis (Vivado)", "Digital Logic Design"]
    },
    abstract: {
      background: "Modern compute requirements demand highly optimized microprocessors. RISC architectures leverage reduced instruction sets to maximize pipeline throughput and clock frequencies.",
      problemStatement: "Non-pipelined processors display poor instruction-level parallelism (ILP) and low resource utilization. Pipelined processors resolve this but introduce data, control, and structural hazards that must be programmatically resolved.",
      existingSystems: "Single-cycle processors require long clock periods based on the maximum latency path (usually Memory to Register file), leading to low clock frequencies (Hz).",
      proposedSolution: "A 32-bit RISC-V baseline architecture split into 5 distinct pipeline stages: Instruction Fetch (IF), Instruction Decode (ID), Execute (EX), Memory Access (MEM), and Write-Back (WB). It includes a dedicated Hazard Detection Unit and Forwarding Unit.",
      benefits: [
        "Up to 4.5x cycle throughput speedup over single-cycle configurations.",
        "Modular Verilog architecture adaptable to FPGA prototyping.",
        "Hardware-efficient forwarding to avoid pipeline stalls on data dependencies."
      ],
      applications: [
        "Edge computing digital signal controllers",
        "Custom SoC system-on-chip controllers",
        "Academic computer architecture teaching blueprints"
      ]
    },
    objectives: [
      { id: "obj1", text: "Design five baseline processor stages (IF, ID, EX, MEM, WB)", completed: false },
      { id: "obj2", text: "Implement 32-bit ALU supporting Arithmetic, Logical, and Shift operations", completed: false },
      { id: "obj3", text: "Construct dual-port Register File with synchronous write and asynchronous read", completed: false },
      { id: "obj4", text: "Integrate pipeline registers (IF/ID, ID/EX, EX/MEM, MEM/WB)", completed: false },
      { id: "obj5", text: "Develop Hazard Detection and Forwarding Units to resolve stalls and data hazards", completed: false },
      { id: "obj6", text: "Verify entire pipeline with standard MIPS/RISC-V-like verification code testbenches", completed: false }
    ],
    hardware: [
      { component: "Xilinx Artix-7 FPGA Development Board (XC7A35T)", quantity: "1", purpose: "Hardware synthesis, verification, and on-board physical testing", estimatedCost: "$120.00" },
      { component: "USB-to-JTAG Programming Cable", quantity: "1", purpose: "Programming FPGA bitstream file and debugging using Integrated Logic Analyzer (ILA)", estimatedCost: "$15.00" },
      { component: "Logic Analyzer / Oscilloscope (Optional)", quantity: "1", purpose: "External probing of GPIO and external bus interfaces of the controller", estimatedCost: "Optional" }
    ],
    software: [
      { software: "Xilinx Vivado Design Suite", purpose: "Logic Synthesis, Simulation, Implementation, and Bitstream Generation", version: "2022.2 or later" },
      { software: "ModelSim (Optional)", purpose: "Advanced RTL functional verification and waveform simulation", version: "Starter/Premium Version" },
      { software: "Git & VS Code", purpose: "Version control and RTL development workspace editing", version: "Latest" }
    ],
    concepts: [
      {
        id: "con_pipe",
        name: "Instruction Pipelining",
        definition: "Pipelining is an implementation technique where multiple instructions are overlapped in execution.",
        explanation: "Analogous to an assembly line. An instruction is split into steps, each handled by separate hardware circuits. While one instruction is accessing memory, the next instruction executes in the ALU, and the one after that decodes.",
        whyNeeded: "It decreases average clock cycle time and improves Instruction-Level Parallelism (ILP) leading to higher clock rates and aggregate instructions-per-second (MIPS).",
        applications: ["All modern CPUs (x86, ARM, RISC-V)", "GPU compute cores"],
        difficulty: "Advanced",
        prerequisites: ["Digital Registers", "Synchronous Logic", "State Machines"]
      },
      {
        id: "con_hazards",
        name: "Pipeline Hazards",
        definition: "Hazards are situations in pipelining which prevent the next instruction in the instruction stream from executing in its designated clock cycle.",
        explanation: "Stalls occur due to: 1) Structural hazards (resource conflicts), 2) Data hazards (instruction depends on results of a prior instruction still in the pipeline), and 3) Control hazards (caused by branch instructions).",
        whyNeeded: "Understanding hazards is critical to avoid computing invalid data or executing incorrect branches. They must be resolved via bubble insertion (stalling) or data forwarding (bypassing).",
        applications: ["Hazard Detection Logic", "Compiler Optimization"],
        difficulty: "Advanced",
        prerequisites: ["Pipelining Fundamentals"]
      }
    ],
    roadmap: [
      "Fundamentals of Computer Architecture",
      "Instruction Set Architecture (ISA) Definition",
      "Vivado Tool Setup & Flow Testing",
      "Individual Stage Design (IF, ID, ALU, RAM)",
      "Pipeline Register Integration",
      "Forwarding Logic & Stall Unit Design",
      "Top Module Assembly",
      "Testbench Development with Hex Loader",
      "Vivado Synthesis & Timing Validation",
      "FPGA Bitstream Deployment"
    ],
    circuit: {
      description: "Baseline Data Path showing IF, ID, EX, MEM, WB and feedback bypassing logic.",
      wiringDescription: "The Program Counter feeds Instruction Memory. Register File reads feed ID/EX register. EX stage contains the ALU interfacing with Forwarding multiplexers. EX/MEM connects to Data Memory, and MEM/WB feeds back to register file write port.",
      connectionTable: [
        { fromPin: "PC_Out[31:0]", toPin: "InstrMem_Addr[31:0]", signalType: "Address Bus", description: "Provides address to fetch next instruction" },
        { fromPin: "RegFile_Out1[31:0]", toPin: "ForwardMUX_A[31:0]", signalType: "Data Bus", description: "Register source data 1 routed through forwarding MUX" },
        { fromPin: "ALU_Result[31:0]", toPin: "DataMem_Addr[31:0]", signalType: "Address Bus", description: "ALU outcome directly addresses Data Memory" },
        { fromPin: "Mem_WriteData[31:0]", toPin: "DataMem_In[31:0]", signalType: "Data Bus", description: "Register data to write into RAM" }
      ],
      pinConfiguration: [
        { pinName: "clk", direction: "Input", function: "System Clock (50MHz development board source)" },
        { pinName: "rst", direction: "Input", function: "Active-high synchronous system reset" },
        { pinName: "proc_status[7:0]", direction: "Output", function: "Diagnostic status word for displaying major stage triggers on board LEDs" }
      ],
      signalFlow: [
        "CLK Rising Edge: PC incremented or replaced with target branch address.",
        "Instruction fetched from Instruction Memory and cached in IF/ID pipeline register.",
        "Instruction decoded, register registers read, control word generated and buffered in ID/EX.",
        "ALU processes operands (forwarded from MEM or WB if hazard detected). Result buffered in EX/MEM.",
        "Memory read/write performed for load/store commands. Result cached in MEM/WB.",
        "WB stage writes final computed contents back to Destination Register in Register File."
      ]
    },
    modules: [
      { name: "Program Counter (PC)", description: "32-bit register containing physical memory address of current instruction.", subcomponents: ["Adder (+4)", "Branch ALU Select Multiplexer"] },
      { name: "ALU (Arithmetic Logic Unit)", description: "Core execution block implementing arithmetic and bitwise digital operations.", subcomponents: ["32-bit Adder", "Logical AND/OR/XOR Shifter", "Barrel Shifter"] },
      { name: "Register File (RF)", description: "Array of 32 dual-ported 32-bit registers with high-speed access.", subcomponents: ["Read Port Index Decoders", "Synchronous Write Control Enablers"] },
      { name: "Hazard Unit", description: "Inspects source register indices against pipeline destination registers to trigger stalls or inject bypass routes.", subcomponents: ["Forwarding MUX Controllers", "Stall Clock Gate Drivers"] }
    ],
    implementation: [
      { stepNumber: 1, title: "RTL Module Drafting", description: "Create distinct verilog files for ALU, PC, and Register File blocks.", expectedOutput: "Synthesizable standalone RTL files with no syntax compiler errors.", requiredResources: "VS Code with Verilog IDE Plugins", estimatedTime: "2 Weeks" },
      { stepNumber: 2, title: "Assemble Stages & Pipeline Registers", description: "Introduce pipeline buffering blocks (IF_ID, ID_EX, EX_MEM, MEM_WB) to segregate computing partitions.", expectedOutput: "Staged processor top module with intermediate debug signals.", requiredResources: "Vivado IDE Simulator", estimatedTime: "3 Weeks" },
      { stepNumber: 3, title: "Hazard and Forwarding Engine Code Integration", description: "Write hazard control module logic to feed forwarding MUXes.", expectedOutput: "Elimination of read-after-write (RAW) bugs in pipeline simulation tests.", requiredResources: "RTL Test Suite Patterns", estimatedTime: "2 Weeks" },
      { stepNumber: 4, title: "Bitstream Prototyping", description: "Define pin constraints and run hardware implementation synthesis for Artix-7 board.", expectedOutput: "Artix-7 bitstream file flashing successfully without timing violations.", requiredResources: "Xilinx Vivado Hardware Manager", estimatedTime: "1 Week" }
    ],
    codeStructure: {
      name: "risc_processor",
      type: "folder",
      children: [
        {
          name: "processor_top.v",
          type: "file",
          content: `// 32-bit 5-Stage Pipelined Processor Top Level Module
module processor_top (
    input wire clk,
    input wire rst,
    output wire [31:0] debug_pc,
    output wire [31:0] debug_alu_out
);
    // Pipeline Intermediate Interconnections
    wire [31:0] pc_out, pc_next, instr;
    wire [31:0] reg_data1, reg_data2, alu_out, mem_data;
    wire [31:0] ex_alu_out, mem_alu_out, wb_write_data;
    
    // IF Stage
    pc_register pc_unit(
        .clk(clk), .rst(rst), .pc_next(pc_next), .pc_val(pc_out)
    );
    
    instruction_memory imem(
        .addr(pc_out), .instr(instr)
    );
    
    // Add pipeline registers, forwarding unit, and decode stages
    // Full implementation available in complete repository templates.
    assign debug_pc = pc_out;
    assign debug_alu_out = alu_out;
endmodule`
        },
        {
          name: "alu.v",
          type: "file",
          content: `// Comprehensive 32-Bit ALU supporting 8 core arithmetic operations
module alu (
    input wire [31:0] a,
    input wire [31:0] b,
    input wire [3:0] alu_control,
    output reg [31:0] result,
    output reg zero
);
    always @(*) begin
        case (alu_control)
            4'b0000: result = a + b;       // ADD
            4'b0001: result = a - b;       // SUB
            4'b0010: result = a & b;       // AND
            4'b0011: result = a | b;       // OR
            4'b0100: result = a ^ b;       // XOR
            4'b0101: result = a << b[4:0]; // SLL (Shift Left Logical)
            4'b0110: result = a >> b[4:0]; // SRL (Shift Right Logical)
            4'b0111: result = (a < b) ? 32'h1 : 32'h0; // SLT (Set Less Than)
            default: result = 32'h0;
        endcase
        zero = (result == 32'h0) ? 1'b1 : 1'b0;
    end
endmodule`
        },
        {
          name: "register_file.v",
          type: "file",
          content: `// 32x32 Dual Port Synchronous Register File
module register_file (
    input wire clk,
    input wire rst,
    input wire reg_write,
    input wire [4:0] raddr1,
    input wire [4:0] raddr2,
    input wire [4:0] waddr,
    input wire [31:0] wdata,
    output wire [31:0] rdata1,
    output wire [31:0] rdata2
);
    reg [31:0] registers [31:0];
    integer i;

    // Asynchronous Read
    assign rdata1 = (raddr1 == 5'b0) ? 32'b0 : registers[raddr1];
    assign rdata2 = (raddr2 == 5'b0) ? 32'b0 : registers[raddr2];

    // Synchronous Write
    always @(posedge clk) begin
        if (rst) begin
            for (i = 0; i < 32; i = i + 1)
                registers[i] <= 32'b0;
        end else if (reg_write && (waddr != 5'b0)) begin
            registers[waddr] <= wdata;
        end
    end
endmodule`
        }
      ]
    },
    testingProcedure: [
      "Simulate individual blocks (ALU, Register File) with dedicated behavioral test arrays.",
      "Load short compiled program instructions (hex codes) into Memory module.",
      "Check pipeline register signals on cycles 1 to 10 via simulator waveform timing viewer.",
      "Confirm hazard bubbles/stalls are inserted when executing sequential RAW instructions."
    ],
    verificationMethods: [
      "Assert equivalence checks in Vivado against a gold-standard behavioral model.",
      "Timing boundary checks to prevent setup/hold time violations during physical synthesis."
    ],
    analysisData: [
      { param: "Max Operating Frequency", value: "85 MHz", benchmark: "25 MHz (Non-pipelined)" },
      { param: "LUT Count (Utilization)", value: "1,450", benchmark: "Xilinx Artix-7 maximum limit 20,800" },
      { param: "Average CPI", value: "1.18", benchmark: "1.00 (Perfect scenario)" },
      { param: "Power Dissipation", value: "0.145 W", benchmark: "0.380 W" }
    ],
    chartData: [
      { clockCycles: 1, instructionsCompleted: 0, pipelineStalls: 0 },
      { clockCycles: 5, instructionsCompleted: 1, pipelineStalls: 1 },
      { clockCycles: 10, instructionsCompleted: 5, pipelineStalls: 2 },
      { clockCycles: 15, instructionsCompleted: 10, pipelineStalls: 2 },
      { clockCycles: 20, instructionsCompleted: 15, pipelineStalls: 3 },
      { clockCycles: 25, instructionsCompleted: 20, pipelineStalls: 4 }
    ],
    viva: {
      basic: [
        { question: "What are the five classical stages of a pipelined RISC architecture?", answer: "Instruction Fetch (IF), Instruction Decode (ID), Execute (EX), Memory Access (MEM), and Write-Back (WB).", explanation: "Each stage represents a fundamental step in instruction processing, isolated from other steps by pipeline master registers." },
        { question: "Explain the purpose of the PC (Program Counter).", answer: "The PC stores the memory address of the next instruction waiting to be fetched.", explanation: "It increments by 4 in a standard byte-addressable system, or changes based on branch target offsets." }
      ],
      intermediate: [
        { question: "What is the difference between a Data Hazard and a Control Hazard?", answer: "Data hazards occur when instructions depend on execution outputs of unresolved prior instructions. Control hazards occur due to branches that modify the instruction stream target.", explanation: "Data hazards are solved by forwarding/stalling, whereas control hazards are resolved via branch prediction or flushing pipeline slots." }
      ],
      advanced: [
        { question: "How does the Operand Forwarding Unit operate?", answer: "By monitoring the destination write-register index of current executing MEM and WB instructions against the source operand registers in the ID stage.", explanation: "If there is a match, the multiplexers bypass the default Register File output, routing the computed ALU result directly from EX/MEM or MEM/WB back to the ALU inputs." }
      ]
    },
    documentation: [
      {
        title: "Pipelined RISC Core Implementation IEEE Draft",
        type: "IEEE Paper",
        sections: [
          { heading: "Abstract", content: "This research paper maps the optimal RTL architecture of a general-purpose instruction processor using Artix-7 FPGA target logic. It resolves pipeline hazards." },
          { heading: "Introduction", content: "Microprocessors are critical in real-time embedded logic. Pipelined designs boost instruction execution speed (MIPS) by overlapping operations." }
        ]
      }
    ],
    futureEnhancements: {
      research: ["Implementing Branch Prediction Units (Gshare, Bimodal Algorithms)", "Superscalar multiple-issue architecture scaling"],
      industry: ["Floating Point Unit (FPU) coprocessor integration", "L1 Cache inclusion with cache coherency protocols"],
      commercial: ["Conversion to open-source RISC-V baseline RV32I specification", "Securing instruction stream against side-channel hardware attacks"],
      advanced: ["Dynamic Clock Gating for ultra-low sleep states", "Multicore topology with AMBA AXI Interconnects"]
    },
    conclusion: {
      learningOutcomes: [
        "In-depth mastery of VLSI design methodologies from abstract RTL design to physical hardware testing.",
        "Comprehensive grasp of custom pipeline hazard detection, stalling techniques, and bypassed operand routing logic."
      ],
      skillsAcquired: ["Synthesizable Verilog RTL", "Vivado Synthesis, Implementation & Simulation Tools", "FPGA HW Debugging using ILA"],
      careerPaths: ["ASIC Design Specialist", "Verification Lead", "FPGA Engineer", "Hardware Systems Architect"]
    }
  },
  {
    id: "embedded_iot",
    overview: {
      title: "IoT-Based Smart Industrial Monitoring System using ESP32",
      domain: "Embedded Systems & IoT",
      difficulty: "Intermediate",
      estimatedTime: "6-8 Weeks",
      industryRelevance: "Essential for Industrial IoT (IIoT), automation, machine health tracking, and smart factories.",
      placementOpportunities: [
        "IoT Firmware Developer",
        "Embedded Hardware Engineer",
        "IIoT Solutions Architect",
        "Automation Control Specialist"
      ],
      requiredSkills: ["ESP32 Programming (C++/Arduino)", "MQTT Protocol", "Sensor Interfacing", "Blynk/ThingsBoard Cloud Config"]
    },
    abstract: {
      background: "Industrial machines require strict environmental parameters (temperature, toxicity, gas leakage) to prevent hazardous breakdowns.",
      problemStatement: "Manual factory floor monitoring is error-prone, dangerous to personnel, and lacks predictive diagnostic tracking, risking catastrophic machinery downtime.",
      existingSystems: "Traditional SCADA systems are expensive, heavily hardwired, and localized, making global, multi-factory remote data aggregation difficult.",
      proposedSolution: "An ESP32-powered micro-controller node connecting DHT22 (temperature/humidity), MQ-2 (gas/smoke), and vibration sensors. High-speed telemetry is broadcast via MQTT to a live web dashboard.",
      benefits: [
        "Real-time sensor reads uploaded every 1 second over low-bandwidth MQTT protocols.",
        "Automatic relay-controlled physical ventilation system triggered by dangerous gas leaks.",
        "Scalable client nodes with automated Over-The-Air (OTA) firmware firmware upgrades."
      ],
      applications: [
        "Chemical processing facility tracking dashboards",
        "Automotive assembly floor environment safety hubs",
        "Server room thermal monitors"
      ]
    },
    objectives: [
      { id: "obj1", text: "Interface DHT22 and MQ-2 Gas Sensors with ESP32 GPIOs", completed: false },
      { id: "obj2", text: "Configure Wi-Fi Client with automatic reconnection algorithms", completed: false },
      { id: "obj3", text: "Establish lightweight connection to MQTT broker (Node-RED/Mosquitto/HiveMQ)", completed: false },
      { id: "obj4", text: "Program local safety loop: fire relay to active exhaust fan if critical thresholds are broken", completed: false },
      { id: "obj5", text: "Build live plotting IoT web interface for monitoring and relay commands", completed: false }
    ],
    hardware: [
      { component: "ESP32 Development Board", quantity: "1", purpose: "Main dual-core Wi-Fi/Bluetooth MCU executing device firmware", estimatedCost: "$8.00" },
      { component: "DHT22 Sensor (AM2302)", quantity: "1", purpose: "Industrial precision temperature and humidity sensory readings", estimatedCost: "$4.50" },
      { component: "MQ-2 Gas / Combustible Smoke Sensor", quantity: "1", purpose: "Air quality sensing for dangerous gas leakages", estimatedCost: "$3.00" },
      { component: "OLED Display 128x64 I2C Module", quantity: "1", purpose: "On-site local dashboard of real-time statuses and IP configurations", estimatedCost: "$5.00" },
      { component: "5V Dual-Channel Relay Module", quantity: "2", purpose: "Physical actuator switching for safety fans and sirens", estimatedCost: "$3.50" }
    ],
    software: [
      { software: "Arduino IDE / PlatformIO", purpose: "Firmware coding, library compilation, and micro-controller memory flashing", version: "Latest Stable" },
      { software: "Mosquitto MQTT Broker", purpose: "Lightweight message bus managing publish/subscribe telemetry protocols", version: "v2.0 or HiveMQ Cloud" },
      { software: "ThingsBoard / Node-RED", purpose: "Industrial-grade sensor data visualization and diagnostic flow management", version: "Latest LTS" }
    ],
    concepts: [
      {
        id: "con_mqtt",
        name: "MQTT Telemetry Protocol",
        definition: "Message Queuing Telemetry Transport is a lightweight publish-subscribe network protocol.",
        explanation: "Unlike HTTP polling, MQTT relies on a centralized broker. Nodes 'publish' on topics (e.g. 'factory/temp') and clients 'subscribe' to topics. It uses minimal package overhead (header size 2 bytes) ideal for battery-constrained modules.",
        whyNeeded: "Provides high-frequency telemetry without clogging local industrial Wi-Fi bandwidth networks.",
        applications: ["Home Automation (Home Assistant)", "IIoT Smart grids"],
        difficulty: "Intermediate",
        prerequisites: ["TCP/IP Network routing", "Client-Server model"]
      }
    ],
    roadmap: [
      "Introduction to Dual-Core ESP32 Architecture",
      "GPIO Interfacing & Sensor Reading Loops",
      "I2C Display Screen Mapping",
      "Wi-Fi Client Integration (Station/AP Mode)",
      "MQTT Protocol and Publish/Subscribe Commands",
      "JSON Parsing for Device Status Payload Payload Config",
      "Relay Actuation Interlocking Circuits",
      "Developing Web IoT Dashboard Integration",
      "Stress-Testing Router Reliability & Reconnections",
      "Power Profiling & Sleep Settings Configuration"
    ],
    circuit: {
      description: "ESP32 wiring configuration integrating sensors, display screen, and multi-channel relay controls.",
      wiringDescription: "DHT22 data pin connects to ESP32 GPIO 23 (with pull-up resistor). MQ-2 analog output connects to ADC pin GPIO 34. OLED Display connects using I2C bus (SDA to GPIO 21, SCL to GPIO 22). Master relay drivers connect to digital outputs GPIO 18 and GPIO 19.",
      connectionTable: [
        { fromPin: "DHT22 VCC/GND", toPin: "ESP32 3V3/GND", signalType: "Power Supply", description: "Provides operation power to temperature hardware" },
        { fromPin: "DHT22 SDA", toPin: "ESP32 GPIO 23", signalType: "Digital Bidirectional", description: "Serial data read for heat index values" },
        { fromPin: "MQ-2 Analog", toPin: "ESP32 GPIO 34", signalType: "Analog Input", description: "Continuous analog diagnostic voltage indicating smoke concentration" },
        { fromPin: "OLED SDA/SCL", toPin: "ESP32 GPIO 21/GPIO 22", signalType: "I2C Bus Data/Clock", description: "I2C communication lines for screen rendering updates" }
      ],
      pinConfiguration: [
        { pinName: "GPIO 23", direction: "Input/Output", function: "One-Wire Bus interface for DHT22 sensor readings" },
        { pinName: "GPIO 34", direction: "Input (Analog)", function: "12-bit Analog-to-Digital Converter mapping MQ-2 sensing voltage" },
        { pinName: "GPIO 18", direction: "Output", function: "Switches Relay Channel 1 (Exhaust fan logic active)" }
      ],
      signalFlow: [
        "ESP32 initializes Wi-Fi socket, synchronizes internal time with NTP server, and establishes MQTT handshake.",
        "Timer triggers sensor sampling sequence: reads analog gas concentration and temperature bytes.",
        "Updates local OLED screen displaying telemetry and current connection broker statuses.",
        "If gas exceeds safe threshold (e.g. > 400 PPM), pulls GPIO 18 HIGH to start the ventilating fan immediately.",
        "Formats formatted JSON data payload containing all parameters, sending it over MQTT to MQTT broker."
      ]
    },
    modules: [
      { name: "Sensor Core Pack", description: "Dedicated sensor package capturing continuous industrial variables.", subcomponents: ["DHT22 Temp-Hum Module", "MQ-2 Electrochemical Gas Sniffer", "Vibration Piezo Detector"] },
      { name: "ESP32 Controller", description: "Runs the firmware program, loops, and security interlocks.", subcomponents: ["FreeRTOS Multi-task Scheduler", "Wi-Fi TCP/IP Stack Core", "GPIO Direct Registers"] },
      { name: "Relay Safety Actuators", description: "Switches external AC equipment when signals are modified by ESP32.", subcomponents: ["Optocoupler Protective Isolation Stage", "5V Electromagnetic Coil Relays"] }
    ],
    implementation: [
      { stepNumber: 1, title: "Sensor Driving Firmware", description: "Write firmware to parse sensor reads and serial print.", expectedOutput: "Readable temperature, humidity, and gas PPM values on serial monitor.", requiredResources: "Arduino IDE, ESP32 Dev Kit", estimatedTime: "1.5 Weeks" },
      { stepNumber: 2, title: "I2C Screen Mapping", description: "Implement SSD1306 OLED interface displaying live sensor data.", expectedOutput: "Real-time readings updated on local 0.96 inch screen.", requiredResources: "Adafruit GFX and SSD1306 Libraries", estimatedTime: "1 Week" },
      { stepNumber: 3, title: "MQTT Telemetry Client Setup", description: "Setup PubSubClient libraries, connect to WiFi and publish JSON metrics.", expectedOutput: "Mosquitto console logs receiving printed JSON objects from device.", requiredResources: "MQTT Broker Access, PubSubClient Utility", estimatedTime: "2 Weeks" },
      { stepNumber: 4, title: "Safety Action Relay Control & Thresholds", description: "Create local safety limits. Switch pin 18/19 outputs when limit is exceeded.", expectedOutput: "Coil relay clicks and LED illuminates on high gas/heat readings.", requiredResources: "Relay components, external LED load", estimatedTime: "1 Week" }
    ],
    codeStructure: {
      name: "esp32_iot_monitoring",
      type: "folder",
      children: [
        {
          name: "esp32_iot_monitoring.ino",
          type: "file",
          content: `#include <WiFi.h>
#include <PubSubClient.h>
#include <DHT.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>

#define DHTPIN 23
#define DHTTYPE DHT22
#define MQ_PIN 34
#define RELAY_PIN 18

const char* ssid = "FACTORY_WIFI_SSID";
const char* password = "FACTORY_WIFI_PASS";
const char* mqtt_server = "broker.hivemq.com";

WiFiClient espClient;
PubSubClient client(espClient);
DHT dht(DHTPIN, DHTTYPE);

void setup() {
    Serial.begin(115200);
    pinMode(RELAY_PIN, OUTPUT);
    digitalWrite(RELAY_PIN, LOW); // Fan Off
    
    dht.begin();
    setup_wifi();
    client.setServer(mqtt_server, 1883);
}

void loop() {
    if (!client.connected()) {
        reconnect();
    }
    client.loop();
    
    float t = dht.readTemperature();
    float h = dht.readHumidity();
    int gasVal = analogRead(MQ_PIN);
    
    // Safety check
    if (gasVal > 1500) {
        digitalWrite(RELAY_PIN, HIGH); // Alarm active
    } else {
        digitalWrite(RELAY_PIN, LOW);
    }
    
    // Publish payload
    String payload = "{\\"temp\\":" + String(t) + ",\\"humidity\\":" + String(h) + ",\\"gas\\":" + String(gasVal) + "}";
    client.publish("factory/node1/telemetry", payload.c_str());
    
    delay(2000);
}`
        }
      ]
    },
    testingProcedure: [
      "Deploy code to ESP32 board and track stability on router connectivity.",
      "Apply localized heat (using soldering iron tip nearby) or smoke (using extinguished matches) to trigger MQ-2.",
      "Assess responsiveness of safety ventilation relay during custom trigger experiments.",
      "Inspect Wi-Fi reconnection handling by turning off router and restarting it."
    ],
    verificationMethods: [
      "Wireshark network sniffing to capture MQTT payload packets.",
      "Heat chamber verification for sensor reading accuracy adjustments."
    ],
    analysisData: [
      { param: "MQTT Packet Latency", value: "24 ms", benchmark: "150 ms (Max tolerance limit)" },
      { param: "Active Power Usage", value: "120 mA", benchmark: "450 mA during multi-radio use" },
      { param: "Gas Sensor Threshold Accuracy", value: "98.4%", benchmark: "90% target precision" },
      { param: "Reconnection Recovery Time", value: "3.2 sec", benchmark: "5.0 sec standard target" }
    ],
    chartData: [
      { seconds: 10, temperature: 24, smokePPM: 120, relayOn: 0 },
      { seconds: 20, temperature: 25, smokePPM: 180, relayOn: 0 },
      { seconds: 30, temperature: 28, smokePPM: 450, relayOn: 1 },
      { seconds: 40, temperature: 30, smokePPM: 820, relayOn: 1 },
      { seconds: 50, temperature: 27, smokePPM: 310, relayOn: 0 },
      { seconds: 60, temperature: 25, smokePPM: 150, relayOn: 0 }
    ],
    viva: {
      basic: [
        { question: "Why is the ESP32 favored over the Arduino Uno for IoT projects?", answer: "The ESP32 features onboard Wi-Fi and Bluetooth radios, a dual-core 240MHz processor, and abundant hardware ADC/I2C/SPI interfaces.", explanation: "The Uno lacks native wireless, requiring extra hardware shields that boost size and hardware costs." }
      ],
      intermediate: [
        { question: "What is an optocoupler/opto-isolator and why is it used on the relay module?", answer: "It isolates the ESP32 micro-controller's sensitive digital lines from the noisy relay coil circuit using an internal LED and phototransistor.", explanation: "This prevents high-voltage back-EMF spikes from damaging the ESP32 GPIO channels." }
      ],
      advanced: [
        { question: "How would you implement over-the-air (OTA) updates on this ESP32 securely?", answer: "By hosting the compiled firmware binary on a secure HTTPS server, downloading it incrementally over the ESP32 standard OTA library, verifying SHA256 checksum signatures, and booting custom partitions.", explanation: "It ensures malicious firmware blocks cannot hijack the industrial nodes over internet vectors." }
      ]
    },
    documentation: [
      {
        title: "Industrial Telemetry System using ESP32 & MQTT Report",
        type: "Project Report",
        sections: [
          { heading: "Executive Summary", content: "Details a low-cost, high-reliability industrial automation device developed for standard modern smart factory scenarios." },
          { heading: "Network Topology", content: "Explains standard MQTT publish-subscribe client brokers connected to central dashboards monitoring machine health." }
        ]
      }
    ],
    futureEnhancements: {
      research: ["AI Edge anomaly detection directly compiling on raw ESP32 memory registers", "Modbus / RS485 connectivity for parsing vintage machine registers"],
      industry: ["Inclusion of IP67 robust industrial enclosures against water/chemical ingress", "Power-Over-Ethernet (PoE) hardware connection modules"],
      commercial: ["Productization as customizable industrial monitoring sensor node boxes", "Integrations with AWS IoT Core and Azure IoT Central dashboards"],
      advanced: ["Lithium Iron Phosphate (LiFePO4) solar charging circuits", "ESP-NOW local ad-hoc secure mesh networking topology"]
    },
    conclusion: {
      learningOutcomes: [
        "In-depth skills interfacing analog & digital sensors with wireless microcontrollers.",
        "Mastery of asynchronous network brokers, JSON protocols, and dynamic remote automation relays."
      ],
      skillsAcquired: ["Firmware Programming (C/C++ & FreeRTOS)", "MQTT & TCP/IP Networking Protocols", "Safe Actuator Relay Design"],
      careerPaths: ["Embedded firmware engineer", "IIoT Solution Architect", "Automation Tech Lead"]
    }
  },
  {
    id: "comms_mimo_ofdm",
    overview: {
      title: "Design and Performance Analysis of a MIMO-OFDM Based 5G Wireless Communication System using MATLAB",
      domain: "Communication Systems",
      difficulty: "Advanced",
      estimatedTime: "8-10 Weeks",
      industryRelevance: "Forms the core physical tier (PHY) for modern 5G, Wi-Fi 6, and next-generation 6G base stations.",
      placementOpportunities: [
        "RF Systems Engineer",
        "Wireless Telecom Specialist",
        "DSP Engineer (Qorvo, Nokia, Ericsson, Qualcomm)",
        "PHY Layer Research Associate"
      ],
      requiredSkills: ["MATLAB / Simulink Programming", "Information Theory", "MIMO Antenna Array Logic", "Signal Processing"]
    },
    abstract: {
      background: "Modern cellular infrastructure demands ultra-fast speeds and support for dense data traffic, which single-antenna legacy systems cannot provide due to bandwidth constraints.",
      problemStatement: "Fading networks produce severe multi-path distortion. Selecting standard single-carrier signals causes fading, dropouts, and unacceptable high Bit Error Rates (BER).",
      existingSystems: "Single-Input Single-Output (SISO) architectures are highly vulnerable to localized deep signal fades, yielding low spectral throughput efficiency.",
      proposedSolution: "Combining MIMO (Multiple-Input Multiple-Output) antenna spatial multiplexing with OFDM (Orthogonal Frequency Division Multiplexing). OFDM divides a broad signal into multiple narrow orthogonal subcarriers, while MIMO scales the capacity linearly with the antenna count.",
      benefits: [
        "Near-zero Inter-Symbol Interference (ISI) secured by inserting a Cyclic Prefix.",
        "Significantly increased channel capacity without requiring extra system spectrum.",
        "LS (Least Squares) and MMSE (Minimum Mean Square Error) channel estimators."
      ],
      applications: [
        "5G cellular base stations and dynamic user equipment",
        "Wi-Fi 6/7 consumer access points",
        "High-definition military satellite links"
      ]
    },
    objectives: [
      { id: "obj1", text: "Create BPSK, QPSK, and 16-QAM constellation mapping modules in MATLAB", completed: false },
      { id: "obj2", text: "Implement OFDM block: IFFT computation, Cyclic Prefix (CP) padding, and FFT recovery", completed: false },
      { id: "obj3", text: "Model Rayleigh flat/selective fading communications channel with AWGN noise", completed: false },
      { id: "obj4", text: "Integrate 2x2 MIMO spatial multiplexing using Alamouti space-time block coding", completed: false },
      { id: "obj5", text: "Write LS and MMSE channel estimation subroutines directly", completed: false },
      { id: "obj6", text: "Plot BER vs SNR curves demonstrating fading mitigation", completed: false }
    ],
    hardware: [
      { component: "SDR - USRP (Universal Software Radio Peripheral) B210 (Optional)", quantity: "1", purpose: "Allows over-the-air physical RF testing of the MATLAB algorithms", estimatedCost: "Optional / Lab Grade" },
      { component: "Multi-band omnidirectional RF Antennas", quantity: "4", purpose: "Physical electromagnetic waves broadcasting and capturing in real space", estimatedCost: "Optional" }
    ],
    software: [
      { software: "MATLAB", purpose: "Numerical computing, matrix arithmetic, and DSP filtering", version: "R2021b or later" },
      { software: "Communications Toolbox", purpose: "Simulating wireless networks, modulating signals, and generating BER charts", version: "Compatible version" },
      { software: "Signal Processing Toolbox", purpose: "Access to IFFT/FFT and signal spectral analyzers", version: "Compatible version" }
    ],
    concepts: [
      {
        id: "con_ofdm",
        name: "OFDM (Orthogonal Frequency Division Multiplexing)",
        definition: "A digital multi-carrier modulation scheme that maps data symbols across orthogonal sub-carriers.",
        explanation: "By making sub-carriers orthogonal, they can overlap in frequency without causing Inter-Carrier Interference (ICI). A long symbol period is achieved, making it highly resistant to time dispersion and multipath fading.",
        whyNeeded: "Eliminates complex equalizer structures on receivers and protects high speed packet formats.",
        applications: ["LTE & 5G PHY Layer", "DVB-T Digital Television"],
        difficulty: "Advanced",
        prerequisites: ["Fourier Transforms (FFT)", "Quadrature Amplitude Modulation (QAM)"]
      },
      {
        id: "con_mimo",
        name: "MIMO Spatial Multiplexing",
        definition: "Leveraging multiple transmitter and receiver antennas to send separate parallel streams simultaneously.",
        explanation: "By broadcasting different messages from antenna 1 and antenna 2 in the same frequency band, the receiver exploits spatial path differences to decode both, multiplying throughput.",
        whyNeeded: "Provides massive capability boosts without requiring expensive radio spectrum purchases.",
        applications: ["Massive MIMO base towers", "Wi-Fi routers"],
        difficulty: "Advanced",
        prerequisites: ["Linear Algebra (Matrices)", "Multipath Channels"]
      }
    ],
    roadmap: [
      "Baseband Digital Modulations (PSK, QAM)",
      "Multi-path Fading Channels Modeling",
      "Fourier Analysis (IFFT and FFT) in Coding",
      "Cyclic Prefix Mathematics",
      "2x2 Antenna Configuration Setups",
      "Alamouti Space-Time Block Coding (STBC)",
      "Least Squares (LS) Estimation Loops",
      "Simulating Rayleigh and AWGN Channels",
      "Gathering Bit Error Rates (BER)",
      "Generating Performance Analysis Curves"
    ],
    circuit: {
      description: "Functional DSP path showing block modulators, spatial encoders, channel modeling, and MIMO receivers.",
      wiringDescription: "The logic streams input bits to QAM Mapper. Output complex symbols are divided into parallel streams, mapped to IFFT blocks, CP added, and output to TX1/TX2 antennas. Rayleigh channel convolves signals. RX antennas pass to FFT blocks, channel block estimator, MIMO decoders, and QAM Demapper.",
      connectionTable: [
        { fromPin: "Data_In", toPin: "QAM_Mapper", signalType: "Bit Stream", description: "Payload source bits to convert into carrier signals" },
        { fromPin: "IFFT_Out", toPin: "CP_Adder", signalType: "Digital Time-Domain", description: "Feeds raw IDFT coefficients for guard interval padding" },
        { fromPin: "RF_TX_Channel", toPin: "Rayleigh_Model", signalType: "Simulated Space", description: "Convolves output with fading vectors and injects AWGN noise" },
        { fromPin: "FFT_Out", toPin: "MIMO_Decoder", signalType: "Frequency Symbols", description: "Decoded subcarrier symbols enter space-time decoder matrices" }
      ],
      pinConfiguration: [
        { pinName: "tx_antennas", direction: "Configuration", function: "Number of transmitting ports (Set to 2)" },
        { pinName: "rx_antennas", direction: "Configuration", function: "Number of receiving antennas (Set to 2)" },
        { pinName: "subcarriers", direction: "Variable", function: "Size of FFT block (Typically 64 or 512 channels)" }
      ],
      signalFlow: [
        "Binary generation generates source packets.",
        "QAM modulation alters phase and amplitude creating high-density symbol constellations.",
        "Symbol vectors are framed, pilots are matched, and inverted Fast Fourier Transforms (IFFT) synthesize sub-channel carriers.",
        "Guard Interval (Cyclic Prefix) offsets are applied to secure against Inter-Symbol Interferences.",
        "Signals pass over Rayleigh fading space path. Matrix equations apply LS channel estimations.",
        "Receiver performs FFT operations, extracts signals, equalizes offsets, and outputs recovered packet stream."
      ]
    },
    modules: [
      { name: "Simulation Modulation Core", description: "Encodes binary arrays into high-density complex multi-phase states.", subcomponents: ["16-QAM Gray Code Modulator", "Demodulation Constellation Map Analyzer"] },
      { name: "OFDM Digital Processor", description: "Transforms serial frequency vectors into time signals and handles guard periods.", subcomponents: ["N-Point IFFT Module", "Cyclic Prefix Pad Register"] },
      { name: "MIMO Signal Controller", description: "Implements space-time mathematics to route signals safely over multiple ports.", subcomponents: ["Alamouti Encoder Matrix", "MMSE Linear Interference Suppressors"] }
    ],
    implementation: [
      { stepNumber: 1, title: "Base Modulator Architecture", description: "Write MATLAB scripts translating bits to QAM, graphing static constellations.", expectedOutput: "Perfect star-like constellation plots under zero noise.", requiredResources: "MATLAB", estimatedTime: "1.5 Weeks" },
      { stepNumber: 2, title: "OFDM Multi-carrier Design", description: "Build IFFT/FFT loops with adjustable Cyclic Prefix parameters.", expectedOutput: "Spectral charts showing orthogonal subcarriers in close proximity.", requiredResources: "Signal Processing Toolbox", estimatedTime: "2 Weeks" },
      { stepNumber: 3, title: "Rayleigh and MIMO Matrix Assembly", description: "Code multipath vectors and Alamouti encoder block.", expectedOutput: "System handles multi-antenna paths mathematically.", requiredResources: "Wireless Channels model code", estimatedTime: "2.5 Weeks" },
      { stepNumber: 4, title: "Simulate BER and Verify Curves", description: "Run nested simulation loops, tracking BER results on SNR increments from 0 to 30dB.", expectedOutput: "Clean logarithmic BER curves demonstrating standard MMSE advantages.", requiredResources: "MATLAB Script Engine", estimatedTime: "2 Weeks" }
    ],
    codeStructure: {
      name: "mimo_ofdm_simulator",
      type: "folder",
      children: [
        {
          name: "mimo_ofdm_baseline.m",
          type: "file",
          content: `% 5G PHY MIMO-OFDM Baseline Performance Link Simulator
clc; clear; close all;

% System Parameters
numSubcarriers = 64;
cpLength = 16;
numTx = 2;
numRx = 2;
modulationOrder = 16; % 16-QAM
snrDbRange = 0:2:20;
berResults = zeros(length(snrDbRange), 1);

% Generate Signal Bits
bitsPerSubcarrier = log2(modulationOrder);
totalBits = numSubcarriers * bitsPerSubcarrier * numTx;
txBits = randi([0 1], totalBits, 1);

% Run QAM Modulation
qamSymbols = qammod(txBits, modulationOrder, 'InputType', 'bit', 'UnitAveragePower', true);

% Run OFDM IFFT
ofdmIn = reshape(qamSymbols, [numSubcarriers, numTx]);
ofdmTime = ifft(ofdmIn, numSubcarriers);

% Add Guard Interval (Cyclic Prefix)
ofdmTimeCp = [ofdmTime(end-cpLength+1:end, :); ofdmTime];

% Simulate Channel & Recover
% Full mathematical equalization loops available in master scripts.
disp('RF Link simulation completed successfully.');`
        }
      ]
    },
    testingProcedure: [
      "Initialize baseline simulation in non-noisy AWGN channel.",
      "Check constellation diagrams at receiver on different SNR configurations (0dB, 10dB, 25dB).",
      "Measure BER values under different channel configurations.",
      "Verify LS vs MMSE speed accuracy trade-offs in channel estimation subroutines."
    ],
    verificationMethods: [
      "Monte Carlo simulation verification running 100,000 independent testing iterations.",
      "Compare resulting curves against classical theoretical Shannon capacity models."
    ],
    analysisData: [
      { param: "Max Spectral Efficiency", value: "8.2 bps/Hz", benchmark: "3.5 bps/Hz (SISO baseline)" },
      { param: "BER at 18dB SNR (MMSE)", value: "1.2 x 10^-5", benchmark: "3.4 x 10^-2 (LS estimator)" },
      { param: "Throughput Multiplier", value: "1.95x", benchmark: "Logarithmic limit 2.0x for 2x2 MIMO" }
    ],
    chartData: [
      { snr: 0, berSISO: 0.35, berMIMO_LS: 0.18, berMIMO_MMSE: 0.12 },
      { snr: 4, berSISO: 0.28, berMIMO_LS: 0.11, berMIMO_MMSE: 0.06 },
      { snr: 8, berSISO: 0.21, berMIMO_LS: 0.06, berMIMO_MMSE: 0.02 },
      { snr: 12, berSISO: 0.14, berMIMO_LS: 0.02, berMIMO_MMSE: 0.005 },
      { snr: 16, berSISO: 0.09, berMIMO_LS: 0.006, berMIMO_MMSE: 0.0008 },
      { snr: 20, berSISO: 0.05, berMIMO_LS: 0.001, berMIMO_MMSE: 0.00008 }
    ],
    viva: {
      basic: [
        { question: "What does OFDM stand for and what is its core concept?", answer: "Orthogonal Frequency Division Multiplexing. It divides a high-rate data stream into many low-rate orthogonal subcarriers.", explanation: "Because adjacent carriers are orthogonal, they are easily filtered with no crosstalk, optimizing spectrum usage." }
      ],
      intermediate: [
        { question: "Why is a Cyclic Prefix (CP) added to an OFDM symbol?", answer: "CP replicates the trailing part of the symbol and prepends it to the beginning.", explanation: "It creates a guard band that allows time-delayed multipath echoes to clear, preventing Inter-Symbol Interference (ISI)." }
      ],
      advanced: [
        { question: "Contrast LS (Least Squares) and MMSE (Minimum Mean Square Error) channel estimation techniques.", answer: "LS assumes no noise statistics and solves equations directly. MMSE utilizes noise variance parameters to optimize data recovery.", explanation: "MMSE performs better in low SNR environments by filtering noise, but demands high DSP matrix inversion computations." }
      ]
    },
    documentation: [
      {
        title: "2x2 MIMO-OFDM Link Capacity Performance Analysis Research Draft",
        type: "Research Paper",
        sections: [
          { heading: "Mathematical Framework", content: "Demonstrates Alamouti space matrix formulations convolving Rayleigh flat channel parameters." },
          { heading: "Analytical Results", content: "Details the performance improvements of 16-QAM streams when CP guard frames are customized." }
        ]
      }
    ],
    futureEnhancements: {
      research: ["Implementing Massive MIMO arrays supporting up to 128 physical antennas", "Non-Orthogonal Multiple Access (NOMA) candidate evaluations"],
      industry: ["Inclusion of Spatial Division Multiple Access (SDMA) beamforming paths", "LDPC forward error correcting logic blocks in MATLAB"],
      commercial: ["Exporting FPGA-compatible VHDL modules via MATLAB HDL Coder", "Physical USRP software radio base station setups"],
      advanced: ["6G Terahertz band channel multi-layer modeling algorithms", "Deep learning-based receiver signal recovery decoders"]
    },
    conclusion: {
      learningOutcomes: [
        "In-depth command of information theory concepts, wireless channels, and DSP signal reconstruction.",
        "Ability to mathematically model complex RF fading anomalies and verify cellular performance standards."
      ],
      skillsAcquired: ["MATLAB SimLink Programming", "Baseband Digital Modulator Coding", "Advanced Channel Estimation Logic"],
      careerPaths: ["Telecommunications RF Engineer", "Wireless Protocol designer", "DSP Hardware Specialist"]
    }
  },
  {
    id: "ai_electronics",
    overview: {
      title: "AI-Based Smart Traffic Monitoring and Adaptive Signal Control System using Computer Vision and IoT",
      domain: "AI + Electronics (Edge Computing)",
      difficulty: "Intermediate",
      estimatedTime: "6-8 Weeks",
      industryRelevance: "Critical for Smart Cities, Autonomous Driving, and modern intelligent urban traffic hubs.",
      placementOpportunities: [
        "Computer Vision Engineer",
        "Edge AI Firmware Developer",
        "Smart City Systems Specialist",
        "Robotics Algorithm Designer"
      ],
      requiredSkills: ["Python Programming", "OpenCV Library", "YOLOv8 Model Training", "ESP32 Actuator Relay Control"]
    },
    abstract: {
      background: "Traditional urban traffic management systems depend on hardcoded timer patterns that do not react to actual traffic levels on individual road segments.",
      problemStatement: "Fixed-timer networks cause unnecessary congestion, increase carbon emissions, and delay emergency response vehicles.",
      existingSystems: "Magnetic induction loops and basic ultrasonic sensors are expensive to install, demand physical road destruction, and do not scale easily.",
      proposedSolution: "A feed-forward edge platform. An IP camera stream is parsed by an Edge processor (Raspberry Pi/PC) executing a YOLOv8 object detector. Real-time vehicle counts on active lanes determine optimal green-light duration. Directions are updated dynamically via ESP32 remote controllers.",
      benefits: [
        "Up to 40% reduction in average vehicular intersection waiting delays.",
        "Computer vision detects vehicle classes (Ambulances, busses, cars) to prioritize public safety links.",
        "Telemetry is logged to a secure administrative cloud portal."
      ],
      applications: [
        "Metropolitan smart intersection retrofits",
        "Expressway entry and toll-booth adaptive gate controllers",
        "Commercial warehouse loading dock traffic management"
      ]
    },
    objectives: [
      { id: "obj1", text: "Integrate video feed parsing loops using Python and OpenCV", completed: false },
      { id: "obj2", text: "Deploy pre-trained YOLOv8/v5 weights optimized for vehicle classification", completed: false },
      { id: "obj3", text: "Write density calculations linking vehicle counts to custom green-light duration intervals", completed: false },
      { id: "obj4", text: "Program ESP32-controlled traffic lights that update via serial/WiFi commands", completed: false },
      { id: "obj5", text: "Establish priority logic when sirens/emergency vehicle patterns are detected", completed: false },
      { id: "obj6", text: "Build live monitoring dashboard displaying traffic density and queue lengths", completed: false }
    ],
    hardware: [
      { component: "Raspberry Pi 4 Model B (or Jetson Nano / PC)", quantity: "1", purpose: "Edge computer hosting Python, OpenCV, and YOLO neural networks", estimatedCost: "$75.00" },
      { component: "ESP32 MCU / NodeMCU", quantity: "1", purpose: "Performs low-level signaling relay conversions to control traffic light arrays", estimatedCost: "$8.00" },
      { component: "USB Video Camera / IP Camera Module", quantity: "1", purpose: "Provides high-definition live video feeds to CV processing logic", estimatedCost: "$25.00" },
      { component: "High-Brightness LED Traffic Light Signal Board Modules (Red, Yellow, Green)", quantity: "4", purpose: "Physical indicator lights showing intersection statuses", estimatedCost: "$12.00" }
    ],
    software: [
      { software: "Python", purpose: "Language for core logic, CV pipelines, and web dashboards", version: "v3.9 or higher" },
      { software: "Ultralytics YOLOv8", purpose: "Real-time object detection framework optimized for vehicle classification", version: "Latest" },
      { software: "OpenCV Library", purpose: "Image resizing, perspective transforms, and drawing vehicular boxes", version: "v4.5 or higher" },
      { software: "Flask / FastAPI", purpose: "Hosts local telemetry dashboards and API endpoints for remote commands", version: "Latest Stable" }
    ],
    concepts: [
      {
        id: "con_yolo",
        name: "YOLO (You Only Look Once)",
        definition: "A single-stage deep learning model that frames object detection as a regression task.",
        explanation: "Unlike sliding-window techniques, YOLO processes the entire image in a single pass of the neural network. It maps bounding boxes and class probabilities simultaneously, achieving high framerates (FPS) essential for edge cameras.",
        whyNeeded: "Provides high-accuracy object classification directly on the edge.",
        applications: ["Intelligent Surveillance", "ADAS Systems (Tesla Autopilot)"],
        difficulty: "Intermediate",
        prerequisites: ["Neural Networks", "Image Filtering Basics"]
      },
      {
        id: "con_adaptive",
        name: "Adaptive Control Theory",
        definition: "A control approach where parameters adapt to varying process behaviors.",
        explanation: "Rather than using a fixed 30-second loop, the controller maps: `T_green = baseline + (count_lane / total_count) * dynamic_factor`. This dynamically shifts time allocations to busy lanes and reduces idle times.",
        whyNeeded: "Minimizes intersection gridlocks during peak commute shifts.",
        applications: ["Automated HVAC", "Active Smart Traffic Grids"],
        difficulty: "Intermediate",
        prerequisites: ["Control Loops", "Mathematical Optimization"]
      }
    ],
    roadmap: [
      "Introduction to Digital Image Processing & Python",
      "Setting up OpenCV Streams & Camera Inputs",
      "Understanding Object Detection & YOLO Frameworks",
      "Training/Deploying YOLOv8 on Custom Vehicle Datasets",
      "Developing Region of Interest (ROI) Virtual Slicing",
      "Adaptive Traffic Signal Timing Mathematical Formulas",
      "GPIO Control and ESP32 Firmware Development",
      "Serial / Socket Communication Protocols Setup",
      "Constructing Dashboard for Flow Analytics",
      "Field Testing System Under Simulated Model Intersections"
    ],
    circuit: {
      description: "Interconnection schematic between Raspberry Pi (CV engine), ESP32 (signaling MCU), and multi-lane LED traffic lights.",
      wiringDescription: "The USB Camera feeds video to Raspberry Pi. Raspberry Pi is connected to ESP32 via Serial (TX to RX, RX to TX with logic level shifting). ESP32 digital outputs route through resistor arrays to address Red, Yellow, and Green LEDs for 4 virtual lane targets.",
      connectionTable: [
        { fromPin: "USB 3.0 Port", toPin: "USB Web Camera", signalType: "High-Speed Video Interface", description: "Feeds uncompressed physical road video frames into processing loops" },
        { fromPin: "Pi GPIO 14/15 (UART TX/RX)", toPin: "ESP32 RX2/TX2 (GPIO 16/17)", signalType: "Serial Bus", description: "Transmits real-time vehicle densities and dynamic timing parameters" },
        { fromPin: "ESP32 GPIO 12/13/14", toPin: "Lane 1 (Red/Yellow/Green LEDs)", signalType: "Digital Output", description: "Direct control lines for lane 1 traffic light array" },
        { fromPin: "ESP32 GPIO 25/26/27", toPin: "Lane 2 (Red/Yellow/Green LEDs)", signalType: "Digital Output", description: "Direct control lines for lane 2 traffic light array" }
      ],
      pinConfiguration: [
        { pinName: "GPIO 12", direction: "Output", function: "Switches LED Lane 1 Red light on and off" },
        { pinName: "GPIO 13", direction: "Output", function: "Switches LED Lane 1 Yellow light on and off" },
        { pinName: "GPIO 14", direction: "Output", function: "Switches LED Lane 1 Green light on and off" }
      ],
      signalFlow: [
        "Edge camera captures video blocks of 4 lanes and feeds frames to YOLOv8 core.",
        "Slicing rules filter individual lane coordinates. Bounding box detections filter 'car', 'bus', 'truck' and 'motorcycle' tags.",
        "Densities are calculated and compared against adaptive control algorithms.",
        "Pi formats serial packets: e.g. `<LANE_1_GREEN_15>` signaling 15 seconds to ESP32.",
        "ESP32 schedules physical relay commands, shifting lights dynamically."
      ]
    },
    modules: [
      { name: "Camera Capture Pipeline", description: "Streams raw camera feeds, buffers frames, and performs preprocessing.", subcomponents: ["OpenCV Frame Loader", "Image Resize & Normalizer"] },
      { name: "YOLO Detector Engine", description: "Performs neural inferencing on incoming frames to locate and count vehicles.", subcomponents: ["Deep Neural Net (DNN) Run Block", "Non-Maximum Suppression (NMS) Filters"] },
      { name: "Dynamic Signal Controller", description: "Processes vehicle counts and controls physical traffic lights.", subcomponents: ["Adaptive Allocation Algorithm", "Serial Signal Transmitter"] }
    ],
    implementation: [
      { stepNumber: 1, title: "Deploy YOLOv8 Vehicle Detector", description: "Setup virtual Python environment, install Ultralytics, and test parsing static car frames.", expectedOutput: "Overlay bounding frames marking targets with 'car' or 'truck' labels.", requiredResources: "Python v3.9 environment, laptop/PC", estimatedTime: "1.5 Weeks" },
      { stepNumber: 2, title: "Region of Interest (ROI) Virtual Parsing", description: "Draw coordinate polygons over individual road lanes to segregate vehicle counts.", expectedOutput: "Separate count integers tracked for North, South, East, and West lanes.", requiredResources: "OpenCV Draw Polygons Utils", estimatedTime: "1.5 Weeks" },
      { stepNumber: 3, title: "ESP32 Signalling Control Firmware", description: "Write ESP32 C++ firmware parsing custom Serial codes and switching GPIOs.", expectedOutput: "LED blocks switch states on receipt of serial commands.", requiredResources: "Arduino IDE, ESP32 board, discrete red/green/yellow LEDs", estimatedTime: "2 Weeks" },
      { stepNumber: 4, title: "Integrate Systems & Dynamic Testing", description: "Physically host Python script to live stream video of simulated toy vehicles.", expectedOutput: "Green light intervals expand/contract dynamically based on counts.", requiredResources: "High definition webcam, toy intersection setups", estimatedTime: "2 Weeks" }
    ],
    codeStructure: {
      name: "smart_traffic_cv",
      type: "folder",
      children: [
        {
          name: "traffic_detector.py",
          type: "file",
          content: `import cv2
from ultralytics import YOLO
import serial
import time

# Initialize Object Detection
model = YOLO('yolov8n.pt') # Lightweight model for edge deployment

# Setup Serial Communication to ESP32
try:
    ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)
except Exception as e:
    print("Serial port not connected, simulation mode active:", e)
    ser = None

cap = cv2.VideoCapture("traffic_sample_mp4.mp4")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
        
    # Run Inference
    results = model(frame)
    
    vehicle_count = 0
    for r in results:
        for box in r.boxes:
            class_id = int(box.cls[0])
            label = model.names[class_id]
            
            # Count only vehicles
            if label in ['car', 'truck', 'bus', 'motorcycle']:
                vehicle_count += 1
                
    # Calculate adaptive timing: Base 10 sec + 3 sec per vehicle
    green_duration = 10 + (vehicle_count * 3)
    green_duration = min(green_duration, 45) # Max ceiling 45 seconds
    
    print(f"Detected Vehicles: {vehicle_count} | Suggested Green: {green_duration}s")
    
    # Send Command
    if ser:
        command = f"LANE1:{green_duration}\\n"
        ser.write(command.encode('utf-8'))
        
    time.sleep(5) # Evaluate every 5 seconds
    
cap.release()
cv2.destroyAllWindows()`
        }
      ]
    },
    testingProcedure: [
      "Run inference script on a recorded multi-lane traffic dataset to verify accuracy.",
      "Check YOLO FPS rates to ensure low processing latency on edge hardware.",
      "Verify that priority logic overrides standard timing when an emergency vehicle is detected.",
      "Test serial communication robustness under high-speed data transmission."
    ],
    verificationMethods: [
      "Confusion matrix analysis of vehicle detection model accuracy.",
      "Hardware-In-The-Loop (HIL) physical testing on small toy track designs."
    ],
    analysisData: [
      { param: "Vehicle Detection Accuracy", value: "94.2%", benchmark: "85% target threshold" },
      { param: "Edge Inference Rate", value: "28 FPS", benchmark: "12 FPS minimum standard" },
      { param: "Intersection Delay Savings", value: "35.2%", benchmark: "15% minimal optimization target" },
      { param: "Model Footprint (Memory)", value: "12 MB", benchmark: "Max available edge RAM capacity" }
    ],
    chartData: [
      { hour: "08:00", vehicleCount: 45, waitingDelayMinutes: 12, baselineDelayMinutes: 25 },
      { hour: "10:00", vehicleCount: 22, waitingDelayMinutes: 5, baselineDelayMinutes: 12 },
      { hour: "12:00", vehicleCount: 30, waitingDelayMinutes: 7, baselineDelayMinutes: 15 },
      { hour: "14:00", vehicleCount: 28, waitingDelayMinutes: 6, baselineDelayMinutes: 14 },
      { hour: "17:00", vehicleCount: 52, waitingDelayMinutes: 15, baselineDelayMinutes: 32 },
      { hour: "20:00", vehicleCount: 18, waitingDelayMinutes: 4, baselineDelayMinutes: 9 }
    ],
    viva: {
      basic: [
        { question: "What is YOLO and why is it preferred over sliding-window detectors?", answer: "YOLO (You Only Look Once) is a single-stage detector that predicts bounding boxes and classes across the entire image in a single forward pass.", explanation: "Sliding-window architectures run classification loops thousands of times on small image crops, which is extremely slow." }
      ],
      intermediate: [
        { question: "Explain Region of Interest (ROI) and why it is useful here.", answer: "ROI is a user-defined coordinate polygon bounding a specific section of the camera feed (such as a single lane).", explanation: "By filtering detections to only count vehicles within the ROI, we prevent counting parked cars or traffic on adjacent streets." }
      ],
      advanced: [
        { question: "How would you handle occlusion (vehicles blocking other vehicles from camera view)?", answer: "By optimizing camera mounting height and angle, using deep association trackers (like DeepSORT), or training models on multi-angle feeds.", explanation: "Higher angles prevent taller trucks from blocking smaller passenger cars, while tracking filters maintain vehicle counts even when they are temporarily obscured." }
      ]
    },
    documentation: [
      {
        title: "Adaptive Intelligent Intersection System via Edge YOLOv8",
        type: "IEEE Paper",
        sections: [
          { heading: "Edge Deployment Methodology", content: "Details the conversion of PyTorch models into high-speed TensorRT engines for low-power operation on small embedded accelerators." },
          { heading: "Performance Metrics", content: "Details improvements in vehicle throughput and reduced idle fuel combustion in smart cities." }
        ]
      }
    ],
    futureEnhancements: {
      research: ["Multimodal detection combining cameras with radar feeds", "Multi-intersection cooperative traffic optimization models"],
      industry: ["Inclusion of IP-rated camera systems with adaptive defoggers", "Integration with municipal emergency vehicle transponders"],
      commercial: ["Productization as local highway lane monitoring boxes", "Live data streaming API monetization models"],
      advanced: ["Solar-powered standalone edge computing setups", "V2X (Vehicle-to-Everything) telemetry communication antennas"]
    },
    conclusion: {
      learningOutcomes: [
        "In-depth command of computer vision tools (OpenCV), model training, and deep learning inferencing.",
        "Mastery of combining software AI models with physical hardware controls."
      ],
      skillsAcquired: ["Python OpenCV & YOLO Library", "Deep Learning Classifiers Optimization", "Asynchronous MCU communication"],
      careerPaths: ["Computer Vision Specialist", "AI Developer", "Smart Infrastructure Engineer"]
    }
  },
  {
    id: "power_ev_bms",
    overview: {
      title: "IoT-Enabled Smart Battery Management System (BMS) for Electric Vehicles",
      domain: "Power Electronics & EV Systems",
      difficulty: "Advanced",
      estimatedTime: "8-10 Weeks",
      industryRelevance: "Crucial for Electric Vehicle range optimization, lithium chemistry safety (LiFePO4/NMC), and smart grid storage solutions.",
      placementOpportunities: [
        "EV Battery Pack Designer",
        "Power Electronics Firmware Engineer",
        "BMS hardware architect (Tesla, Rivian, Ather, Bosch)",
        "Energy Storage Systems Specialist"
      ],
      requiredSkills: ["Analog Circuit Design", "State-of-Charge (SoC) Algorithms", "Thermal Management", "IoT Telemetry Protocols"]
    },
    abstract: {
      background: "Lithium-ion batteries have a narrow safe operating window. Overcharging, over-discharging, or thermal escalation can trigger catastrophic failure.",
      problemStatement: "Poor battery cell balancing can reduce pack life by up to 50% and create safety hazards, while lacks of remote tracking limits predictive diagnostics.",
      existingSystems: "Basic analog protection circuits cut off the pack under fault conditions, but they do not balance cells, estimate health, or connect to the cloud.",
      proposedSolution: "An advanced, smart telemetry system implementing active balancing, thermal regulation, and high-resolution cell monitoring. An ESP32 reads cell voltage and temperature sensors, estimates State of Charge (SoC), and streams metrics via Wi-Fi to a remote web dashboard.",
      benefits: [
        "Active cell balancing increases overall pack longevity by up to 30%.",
        "Automatic thermal regulation triggers cooling fans before heat limits are reached.",
        "Accurate State-of-Charge parameter estimation helps prevent vehicle range anxiety."
      ],
      applications: [
        "Electric vehicle battery packs (Lithium Iron Phosphate/LCO/NMC chemistries)",
        "Residential solar energy storage units",
        "Telecom backup battery backup arrays"
      ]
    },
    objectives: [
      { id: "obj1", text: "Design high-accuracy multi-cell series voltage divider circuits", completed: false },
      { id: "obj2", text: "Program ESP32 logic to read cell voltages and pack temperatures", completed: false },
      { id: "obj3", text: "Implement Coulomb Counting algorithms for precise State of Charge (SoC) estimation", completed: false },
      { id: "obj4", text: "Develop active balancing circuits with MOSFET switches", completed: false },
      { id: "obj5", text: "Configure physical high-current cutoff solid-state relays for overcurrent protection", completed: false },
      { id: "obj6", text: "Create cloud database connections for battery analytics tracking", completed: false }
    ],
    hardware: [
      { component: "ESP32 micro-controller board", quantity: "1", purpose: "Main processor managing ADC reads, balancing switches, and communications", estimatedCost: "$8.00" },
      { component: "Lithium-Ion Cells (18650 format - 3.7V baseline)", quantity: "4", purpose: "Constructs a simulated 4S multi-cell battery pack", estimatedCost: "$20.00" },
      { component: "LTC6811 Battery Stack Monitor IC (Optional)", quantity: "1", purpose: "Industrial specialized ADC chip for series lithium battery monitoring", estimatedCost: "$15.00" },
      { component: "IRFZ44N Power MOSFET switches", quantity: "4", purpose: "Switches cell shunts during active cell balancing", estimatedCost: "$4.00" }
    ],
    software: [
      { software: "Arduino IDE", purpose: "Writing firmware, timing loops, and communications code", version: "Latest Stable" },
      { software: "MATLAB & Simulink", purpose: "Battery modeling, SoC validation, and thermal simulation", version: "R2021b or later" },
      { software: "Altium Designer / KiCAD", purpose: "Designing schematics and layouts for high-current balancing PCBs", version: "Latest" }
    ],
    concepts: [
      {
        id: "con_soc",
        name: "State of Charge (SoC) Estimation",
        definition: "The percentage of current battery capacity relative to its maximum capacity.",
        explanation: "SoC is analogous to a fuel gauge. Since simple voltage reads fluctuate under heavy loads, SoC is calculated using Coulomb Counting: `SoC(t) = SoC(0) - (Integral(I(t) dt) / Capacity)`. This parses both voltage and continuous current trends.",
        whyNeeded: "Keeps battery packs from over-discharging (which degrades chemistry) and helps prevent vehicle range anxiety.",
        applications: ["EV Dashboard displays", "Solar storage trackers"],
        difficulty: "Advanced",
        prerequisites: ["Integral Calculus", "Analog-to-Digital Conversion"]
      },
      {
        id: "con_balancing",
        name: "Active vs. Passive Cell Balancing",
        definition: "Techniques used to equalize cell voltages in a series battery pack configuration.",
        explanation: "Passive balancing burns off excess charge as heat through bypass resistors. Active balancing transfers charge from higher-voltage cells to lower-voltage cells using capacitive or inductive storage circuits, minimizing heat.",
        whyNeeded: "Prevents a single weak cell from bottlenecking the total usable capacity of the entire series pack.",
        applications: ["Electric Cars", "Laptops"],
        difficulty: "Advanced",
        prerequisites: ["MOSFET Switches", "Power Distribution Circuits"]
      }
    ],
    roadmap: [
      "Lithium-Ion Chemistry & Safe Envelope Basics",
      "Low-Noise ADC Circuit Design",
      "ESP32 Multi-Channel Data Logging Setup",
      "Current Shunt Sensor Interfacing",
      "State-of-Charge (SoC) Numerical Formulations",
      "Active MOSFET Balancing Circuits Layout",
      "Temperature Sensor Bus (DS18B20) Calibration",
      "IoT Cloud Server Connection (Wi-Fi/MQTT)",
      "High-Current Cutoff Relay Interlocking Tests",
      "Pack Assembly & Extended Lifecycle Evaluation"
    ],
    circuit: {
      description: "Smart 4S Battery Management layout showing ADC division rails, MOSFET active-balancing shunts, current sensors, and safety cutting logic.",
      wiringDescription: "The 4 cells are in series. Analog dividers map voltage steps to ESP32 ADCs. Bypass shunts with 10-ohm power resistors and IRFZ44N MOSFETs connect across each cell. Current sensor ACS712 sits inline on the negative pack lead. Relays cut the positive output rail.",
      connectionTable: [
        { fromPin: "Cell 1 (+) Terminal", toPin: "Bypass Resistor 1 & ESP32 ADC1", signalType: "Analog Voltage Rail", description: "Feeds Cell 1 potential for voltage tracking and balancing shunts" },
        { fromPin: "ACS712 Output Pin", toPin: "ESP32 ADC2", signalType: "Analog Voltage", description: "Main pack current indicator signal to track charge/discharge flow" },
        { fromPin: "ESP32 GPIO 4/5/12/13", toPin: "MOSFET Gates 1-4", signalType: "Digital Output", description: "Switches bypass MOSFETs on/off to perform cell balancing" },
        { fromPin: "ESP32 GPIO 18", toPin: "High-Current Control Relay", signalType: "Digital Output", description: "Cuts off main power path if overcurrent/overtemperature faults trigger" }
      ],
      pinConfiguration: [
        { pinName: "GPIO 32", direction: "Input (Analog)", function: "Monitors Pack Current from ACS712 sensor" },
        { pinName: "GPIO 33", direction: "Input (Analog)", function: "Monitors Cell 1 Voltage level" },
        { pinName: "GPIO 4", direction: "Output", function: "Drives Gate of MOSFET 1 to balance Cell 1" }
      ],
      signalFlow: [
        "In loop, ESP32 samples 4 series cell voltage dividers sequentially.",
        "Reads high-speed ACS712 current sensor to calculate real-time charge outflow.",
        "Runs Coulomb Counting algorithms to update State-of-Charge (SoC) % metrics.",
        "If a cell is 150mV higher than another, pulls its corresponding MOSFET Gate high to balance charges.",
        "Streams total pack statistics (SoC, Cell Voltages, Temp, Relays) to IoT dashboard."
      ]
    },
    modules: [
      { name: "Voltage Tracking Array", description: "Brings high series battery rail voltages down to safe micro-controller ADC levels.", subcomponents: ["Precision Metal Film Decoupling Dividers", "Noise Filtration Caps"] },
      { name: "Current Detection Node", description: "Measures high-current battery pack output to track energy consumption.", subcomponents: ["ACS712 Hall-Effect Sensor", "Overcurrent Comparator Interlock"] },
      { name: "Thermal / Actuation Block", description: "Keeps cell temperatures regulated and isolates the pack under critical faults.", subcomponents: ["DS18B20 Waterproof Temp Bus", "High-Amperage Solid-State Safety Switch"] }
    ],
    implementation: [
      { stepNumber: 1, title: "Precision Voltage Dividers", description: "Construct series resistor dividers on a breadboard, verify values with a digital multimeter.", expectedOutput: "Accurate voltage divisions matching actual cells.", requiredResources: "Resistors, Multimeter, Breadboard", estimatedTime: "1.5 Weeks" },
      { stepNumber: 2, title: "Current Sensor Calibration", description: "Calibrate current sensor offset values with loaded batteries.", expectedOutput: "Clean current readings matching different load currents.", requiredResources: "ACS712 Sensor, load resistors", estimatedTime: "1.5 Weeks" },
      { stepNumber: 3, title: "Developing Balancing Logic", description: "Write firmware to compare cell voltages. Engage bypass MOSFETs if imbalance triggers.", expectedOutput: "Selected bypass indicator LEDs light up when cell voltages are unbalanced.", requiredResources: "MOSFET switches, LEDs", estimatedTime: "2 Weeks" },
      { stepNumber: 4, title: "Integrating IoT Real-time Dashboard", description: "Create an online dashboard to display real-time charge states and cell voltages.", expectedOutput: "Live charts showing discharging curves and balancing status updates.", requiredResources: "ESP32, router connection, Cloud Dashboard account", estimatedTime: "2 Weeks" }
    ],
    codeStructure: {
      name: "smart_ev_bms",
      type: "folder",
      children: [
        {
          name: "ev_bms_active.ino",
          type: "file",
          content: `#include <WiFi.h>
#include <PubSubClient.h>

#define CELL1_PIN 33
#define CELL2_PIN 32
#define CURRENT_PIN 35
#define BALY_PIN 4 // MOSFET Drive Cell 1

float cell1_voltage = 0.0;
float cell2_voltage = 0.0;
float pack_current = 0.0;
float state_of_charge = 100.0; // SoC percentage

unsigned long lastTime = 0;

void setup() {
    Serial.begin(115200);
    pinMode(BALY_PIN, OUTPUT);
    digitalWrite(BALY_PIN, LOW);
}

void loop() {
    // Read high-resolution ADC divisions
    int v1_raw = analogRead(CELL1_PIN);
    int v2_raw = analogRead(CELL2_PIN);
    
    // Convert ADC to voltage (calibration coefficients applied)
    cell1_voltage = (v1_raw / 4095.0) * 3.3 * 2.0; // 1:2 Divider multiplier
    cell2_voltage = (v2_raw / 4095.0) * 3.3 * 4.0; // 1:4 Divider multiplier
    
    // Read Current and run Coulomb Counting updates
    int curr_raw = analogRead(CURRENT_PIN);
    pack_current = (curr_raw - 2048) * (50.0 / 2048.0); // Offset adjusted
    
    unsigned long now = millis();
    float dt = (now - lastTime) / 3600000.0; // hours
    lastTime = now;
    
    // Update SoC: current in Amps, capacity baseline 2.5Ah
    state_of_charge -= (pack_current * dt) / 2.5 * 100.0;
    state_of_charge = constrain(state_of_charge, 0.0, 100.0);
    
    // Cell Balancing Logic: If Cell 1 is 100mV higher than Cell 2, engage shunt
    if ((cell1_voltage - cell2_voltage) > 0.10) {
        digitalWrite(BALY_PIN, HIGH); // Drain cell 1
    } else {
        digitalWrite(BALY_PIN, LOW); // Balance matching
    }
    
    Serial.print("Cell1: "); Serial.print(cell1_voltage);
    Serial.print("V | Cell2: "); Serial.print(cell2_voltage);
    Serial.print("V | SoC: "); Serial.print(state_of_charge);
    Serial.println("%");
    
    delay(1000);
}`
        }
      ]
    },
    testingProcedure: [
      "Charge cell series pack up to max, monitoring individual voltage balances.",
      "Apply high current load and track voltage sag on individual series points.",
      "Verify over-voltage/under-voltage cutoffs by driving levels past limits.",
      "Monitor Coulomb Counting tracking reliability over a full charge cycle."
    ],
    verificationMethods: [
      "Dynamic load sweeps using programmable DC electronic load blocks.",
      "Thermal mapping using diagnostic infrared cameras."
    ],
    analysisData: [
      { param: "Voltage Measurement Precision", value: "±8 mV", benchmark: "±25 mV (Minimum EV specification)" },
      { param: "Balancing Current Capacity", value: "350 mA", benchmark: "50 mA standard target" },
      { param: "SoC Estimation Error", value: "1.8%", benchmark: "5.0% threshold maximum" },
      { param: "Cutoff Relay Response Time", value: "12 ms", benchmark: "50 ms maximum requirement" }
    ],
    chartData: [
      { dischargeMinutes: 0, cell1: 4.2, cell2: 4.18, currentAmps: 5.0, tempC: 25 },
      { dischargeMinutes: 10, cell1: 3.95, cell2: 3.91, currentAmps: 5.0, tempC: 28 },
      { dischargeMinutes: 20, cell1: 3.78, cell2: 3.73, currentAmps: 5.0, tempC: 32 },
      { dischargeMinutes: 30, cell1: 3.61, cell2: 3.52, currentAmps: 5.0, tempC: 36 },
      { dischargeMinutes: 40, cell1: 3.42, cell2: 3.25, currentAmps: 5.0, tempC: 41 },
      { dischargeMinutes: 50, cell1: 3.2, cell2: 3.12, currentAmps: 5.0, tempC: 44 }
    ],
    viva: {
      basic: [
        { question: "What is the primary role of a Battery Management System (BMS)?", answer: "A BMS protects the battery pack by ensuring cells operate within safe ranges and balances cells to maximize usable capacity.", explanation: "It guards against damage from overcharging, deep discharge, overcurrent, and thermal issues." }
      ],
      intermediate: [
        { question: "Explain the differences between Active and Passive cell balancing.", answer: "Passive balancing burns off excess energy from higher-voltage cells as heat, while active balancing transfers charge between cells, minimizing heat.", explanation: "Passive balancing is inexpensive but produces heat, making active balancing better for high-density EV packs." }
      ],
      advanced: [
        { question: "How does the Coulomb Counting method calculate battery SoC, and what is its main limitation?", answer: "It integrates current drawn over time: SoC(t) = SoC(0) - Integral(I(dt))/Capacity.", explanation: "Its main limitation is drift, where sensor inaccuracies accumulate over time. Re-calibrations are required when the pack completes a full charge." }
      ]
    },
    documentation: [
      {
        title: "Micro-Controlled EV BMS Active Balancing and Telemetry System Draft",
        type: "Project Report",
        sections: [
          { heading: "Power Balancing Architecture", content: "Details the design of MOSFET bypass networks and precision cell monitoring." },
          { heading: "Thermal Management Results", content: "Details fan activation parameters during cell charging cycles." }
        ]
      }
    ],
    futureEnhancements: {
      research: ["Implementing Extended Kalman Filter (EKF) algorithms for high-precision SoC tracking", "On-chip aging/health degradation model evaluations"],
      industry: ["ISO 26262 functional safety certification testing workflows", "CAN bus protocol stack integrations for EV drivelines"],
      commercial: ["Productizing the custom balancing board as an aftermarket electric bike kit", "Developing fleet battery health analytics APIs"],
      advanced: ["Solid-State Battery charging profiles", "Liquid cooling thermal plate systems integration"]
    },
    conclusion: {
      learningOutcomes: [
        "In-depth skills in analog board design, high-current switching, and battery chemistry monitoring.",
        "Mastery of calculating multi-axis battery metrics (SoC) and managing remote telemetry."
      ],
      skillsAcquired: ["High-Current System Design", "Analog Filtering & ADC Calibration", "Coulomb Counting Algorithms"],
      careerPaths: ["BMS Developer", "EV Powertrain Specialist", "Battery Research Scientist"]
    }
  }
];
