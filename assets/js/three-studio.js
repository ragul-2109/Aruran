/**
 * ==============================================================================
 * ARURAN AGRO SOLUTION - 3D INTERACTIVE MACHINERY & SILAGE STUDIO
 * High-Precision Procedural WebGL 3D Engine with Three.js, OrbitControls & GSAP
 * ==============================================================================
 */

(function () {
  'use strict';

  // Global State
  const StudioState = {
    currentModel: 'cutter',
    isAutoRotating: true,
    isExploded: false,
    isWireframe: false,
    isActionRunning: false,
    showHotspots: true,
    lightingMode: 'studio', // 'studio', 'cyber', 'sunset'
    models: {},
    activeGroup: null,
    hotspotElements: [],
    cutterSpeed: 0,
    pulseTimer: 0,
    particleSystems: []
  };

  // Model Metadata & Specs
  const ModelSpecs = {
    cutter: {
      tag: "HEAVY-DUTY MECHANIZATION",
      title: "Commercial 3HP Grass & Chaff Cutter",
      desc: "High-efficiency motor with dual-drive belt and 4 high-carbon reversible blades. Chops green grass, dry straw, Co-4, Co-5, and sugarcane tops to optimal 12mm-18mm digestable size.",
      primaryActionLabel: "Run Blades (Spin)",
      primaryActionStopLabel: "Stop Blades",
      whatsappText: "Hello Aruran Agro, I inspected the 3HP Chaff Cutter in your 3D Studio and want to know the price with delivery to my location.",
      specs: [
        { label: "Motor Power", val: "3 HP (100% Copper Winding)" },
        { label: "Blade Mechanism", val: "4-Blade Reversible Carbon Steel" },
        { label: "Cutting Capacity", val: "800 - 1,200 kg / Hour" },
        { label: "Safety Gearbox", val: "Forward / Reverse / Neutral" },
        { label: "Frame & Wheels", val: "Heavy Tubular with Rubber Tyres" },
        { label: "Warranty", val: "1 Year Full Manufacturer Warranty" }
      ],
      hotspots: [
        {
          id: "motor",
          pos: [0.75, 0.25, 0.45],
          tag: "HEAVY DUTY MOTOR",
          title: "3HP High-Torque Copper Motor",
          desc: "Heavy-duty induction motor with continuous thermal overload protection. Operates effortlessly on single or 3-phase rural power supply."
        },
        {
          id: "blades",
          pos: [0, 0.85, 0],
          tag: "CUTTING UNIT",
          title: "4-Carbon Steel Reversible Blades",
          desc: "Laser-balanced heat-treated blades. Double-sided edge retains cutting sharpness through 500+ hours of wet and dry fodder."
        },
        {
          id: "hopper",
          pos: [-0.95, 0.65, 0],
          tag: "FEED INLET",
          title: "Wide-Mouth Ergonomic Hopper",
          desc: "Angled safety feeding funnel with spring-tensioned infeed roller that prevents hands slipping and pulls stalks smoothly."
        },
        {
          id: "chute",
          pos: [0.45, 1.3, -0.35],
          tag: "DISCHARGE",
          title: "Adjustable 360° Discharge Hood",
          desc: "Directs finely chopped fodder directly into silage bags, transport trollies, or feeding troughs without fodder scatter."
        },
        {
          id: "wheels",
          pos: [0, -0.65, 0.55],
          tag: "MOBILITY",
          title: "Vibration-Damped Frame & Wheels",
          desc: "Tubular structural steel chassis with solid rubber transport tyres allows a single farm worker to relocate the machine easily."
        }
      ]
    },
    silage: {
      tag: "OPTIMAL CATTLE NUTRITION",
      title: "50kg High-Protein Fermented Silage Bale",
      desc: "Prime whole-plant corn fermented with lactic-acid bacteria. Preserves vital starches, digestible fibers, and vitamins in heavy-duty 7-layer UV hermetic bags.",
      primaryActionLabel: "Slice Cross-Section",
      primaryActionStopLabel: "Close Bale",
      whatsappText: "Hello Aruran Agro, I inspected your 50kg Fermented Corn Silage Bale in 3D and would like a quote per bag with freight charges.",
      specs: [
        { label: "Packaging", val: "50 kg Hermetic 7-Layer Bags" },
        { label: "Moisture Content", val: "65% - 68% (Optimal Rumen Intake)" },
        { label: "Crude Protein", val: "7.8% - 9.0% High Digestibility" },
        { label: "Fermentation pH", val: "3.8 - 4.2 Lactic Acid Preserved" },
        { label: "Shelf Life", val: "12 to 18 Months (Unopened)" },
        { label: "Daily Feed Guide", val: "10kg to 15kg per Dairy Cow" }
      ],
      hotspots: [
        {
          id: "seal",
          pos: [0, 1.05, 0],
          tag: "VACUUM BARRIER",
          title: "7-Layer Airtight UV Vacuum Film",
          desc: "German co-extruded UV-stabilized stretch film prevents oxygen and moisture ingress, keeping silage green and fresh for over a year."
        },
        {
          id: "core",
          pos: [0, 0.05, 0.65],
          tag: "NUTRITION CORE",
          title: "Lactic-Acid Fermented Maize Core",
          desc: "Sweet-aroma chopped corn with intact grain kernels. Drastically improves rumen microbial health, cow digestion, and milk solids (SNF & Fat)."
        },
        {
          id: "straps",
          pos: [0, -0.55, 0.75],
          tag: "HIGH TENSION",
          title: "Heavy-Duty Compression Strapping",
          desc: "High-density compression packaging withstands rough transport across Salem, Namakkal, and Kallakurichi farm roads."
        }
      ]
    },
    milking: {
      tag: "HYGIENIC DAIRY AUTOMATION",
      title: "Trolley Automatic Milking Machine",
      desc: "Mobile single & double bucket milking unit with oil-lubricated vacuum pump and SS 304 food-grade can. Delivers 60:40 calf-like pulsation for gentle udder care.",
      primaryActionLabel: "Simulate Vacuum Pulse",
      primaryActionStopLabel: "Stop Vacuum",
      whatsappText: "Hello Aruran Agro, I inspected the Automatic Milking Machine in your 3D Studio and want technical details and pricing.",
      specs: [
        { label: "Can Material", val: "Food-Grade SS 304 (25 Liters)" },
        { label: "Milking Speed", val: "10 - 12 Cows / Hour (Single Can)" },
        { label: "Vacuum Pump", val: "Oil-Lubricated Rotary Vane 350L/min" },
        { label: "Pulsator Ratio", val: "60:40 Pneumatic (Calf-Suckle Action)" },
        { label: "Teat Liners", val: "100% Medical-Grade Food Silicone" },
        { label: "Motor", val: "1 HP Sealed Heavy-Duty Induction" }
      ],
      hotspots: [
        {
          id: "can",
          pos: [0, 0.25, 0.45],
          tag: "FOOD GRADE",
          title: "SS 304 Seamless 25L Can",
          desc: "Mirror-polished stainless steel container with airtight locking lid and observation glass. Completely hygienic and corrosion-free."
        },
        {
          id: "gauge",
          pos: [0.45, 0.95, -0.05],
          tag: "VACUUM REGULATOR",
          title: "Precision Vacuum Gauge & Valve",
          desc: "Monitors and stabilizes suction pressure between 48-50 kPa, preventing teat congestion and maintaining maximum cow comfort."
        },
        {
          id: "pulsator",
          pos: [0, 0.85, 0.45],
          tag: "PULSATION",
          title: "Pneumatic 60:40 Pulsator Unit",
          desc: "Replicates natural suckling rhythm (60 pulses per minute) for calm, stress-free milk let-down without risk of mastitis."
        },
        {
          id: "teatcups",
          pos: [-0.65, 0.45, 0.25],
          tag: "TEAT CLUSTER",
          title: "Silicone Teat Cups & Claw",
          desc: "Gentle transparent silicone liners with stainless steel shells. Suitable for native cross-bred, HF, Jersey, and Murrah buffaloes."
        }
      ]
    },
    silo: {
      tag: "FEED STORAGE & DISPENSING",
      title: "Commercial Feed Storage Silo Tower",
      desc: "Corrugated galvanized steel storage tank with conical bottom hopper and spiral auger discharge for safe, pest-free grain and feed preservation.",
      primaryActionLabel: "Dispense Feed Flow",
      primaryActionStopLabel: "Stop Dispenser",
      whatsappText: "Hello Aruran Agro, I am interested in your Bulk Feed Storage Silos for my dairy farm. Please share capacities and pricing.",
      specs: [
        { label: "Structure", val: "High-Tensile Galvanized Corrugated Steel" },
        { label: "Capacity Options", val: "3 Tons to 25 Tons Available" },
        { label: "Hopper Cone", val: "60° Steep Angle for Free Grain Flow" },
        { label: "Protection", val: "100% Weatherproof, Pest & Rodent Proof" },
        { label: "Discharge", val: "Bottom Rotary Valve / Spiral Auger" },
        { label: "Foundation", val: "Heavy Reinforced I-Beam Leg Stands" }
      ],
      hotspots: [
        {
          id: "roof",
          pos: [0, 1.45, 0],
          tag: "VENTILATION",
          title: "Airtight Weather Hood & Hatch",
          desc: "Rainproof inspection hatch with safety ladder access cage and condensation vent."
        },
        {
          id: "body",
          pos: [0, 0.35, 0.75],
          tag: "CORRUGATED STEEL",
          title: "Galvanized Corrugated Wall Panels",
          desc: "Heat-reflective zinc coating keeps internal feed cool, preventing mold development and nutrient breakdown in hot Tamil Nadu weather."
        },
        {
          id: "cone",
          pos: [0, -0.65, 0.45],
          tag: "DISCHARGE AUGER",
          title: "60° Bottom Funnel & Discharge Auger",
          desc: "Ensures smooth gravity feed drop into wheelbarrows or automatic feeding troughs with zero grain bridging."
        }
      ]
    }
  };

  let scene, camera, renderer, controls;
  let keyLight, fillLight, rimLight, ambientLight;
  let container, width, height;
  let animationFrameId;

  /**
   * Initializes the 3D Studio Canvas & Environment
   */
  function initStudio() {
    container = document.getElementById('threeJsContainer');
    if (!container) return;

    width = container.clientWidth;
    height = container.clientHeight;

    // 1. Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x041a10);
    scene.fog = new THREE.FogExp2(0x041a10, 0.04);

    // 2. Camera
    camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(3.8, 2.4, 5.2);

    // 3. Renderer
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Orbit Controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.5;
    controls.maxDistance = 12.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.02; // Don't go below floor
    controls.target.set(0, 0.2, 0);
    controls.autoRotate = StudioState.isAutoRotating;
    controls.autoRotateSpeed = 1.4;

    // Stop auto-rotate on user manual interaction, resume gently after timeout
    let userInteractTimer;
    controls.addEventListener('start', () => {
      clearTimeout(userInteractTimer);
      controls.autoRotate = false;
      const hint = document.getElementById('gestureHint');
      if (hint) hint.style.opacity = '0';
    });
    controls.addEventListener('end', () => {
      userInteractTimer = setTimeout(() => {
        if (StudioState.isAutoRotating) controls.autoRotate = true;
      }, 5000);
    });

    // 5. Lighting Setup
    setupLighting();

    // 6. Ground Studio Platform & Grid
    setupGround();

    // 7. Build All 3D Models
    buildAllModels();

    // 8. Display Default Model
    switchModel('cutter', false);

    // 9. Event Listeners
    setupEventListeners();

    // 10. Start Animation Loop
    animate();

    // 11. Handle Resizing
    window.addEventListener('resize', onWindowResize);
  }

  /**
   * Studio Lighting Rig with 3 configurable presets
   */
  function setupLighting() {
    ambientLight = new THREE.HemisphereLight(0xd4eed8, 0x03180e, 0.85);
    scene.add(ambientLight);

    // Key Light
    keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(5, 8, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Emerald Fill Light
    fillLight = new THREE.DirectionalLight(0x4ec489, 0.7);
    fillLight.position.set(-6, 3, -2);
    scene.add(fillLight);

    // Amber Rim / Back Light
    rimLight = new THREE.DirectionalLight(0xf4cf65, 0.9);
    rimLight.position.set(0, 5, -6);
    scene.add(rimLight);
  }

  /**
   * Reflective ground podium & grid circular guide
   */
  function setupGround() {
    // Floor Disc
    const floorGeo = new THREE.CircleGeometry(6, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x062819,
      roughness: 0.65,
      metalness: 0.25
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.15;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Subtle Concentric Glowing Rings
    const ringGeo1 = new THREE.RingGeometry(2.2, 2.22, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x2bb36e, side: THREE.DoubleSide, opacity: 0.25, transparent: true });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = -Math.PI / 2;
    ring1.position.y = -1.14;
    scene.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(3.8, 3.82, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xf4cf65, side: THREE.DoubleSide, opacity: 0.15, transparent: true });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = -1.14;
    scene.add(ring2);
  }

  /**
   * PBR Material Factory
   */
  function createMat(params) {
    return new THREE.MeshStandardMaterial({
      roughness: 0.35,
      metalness: 0.5,
      ...params
    });
  }

  /**
   * Builds All 4 Procedural 3D Machinery Models
   */
  function buildAllModels() {
    StudioState.models.cutter = buildChaffCutterModel();
    StudioState.models.silage = buildSilageBaleModel();
    StudioState.models.milking = buildMilkingMachineModel();
    StudioState.models.silo = buildSiloTowerModel();
  }

  /**
   * MODEL 1: Commercial Heavy-Duty 3HP Chaff Cutter Machine
   */
  function buildChaffCutterModel() {
    const group = new THREE.Group();
    group.name = 'cutter';

    // Sub-groups for exploded view animation
    const sub = {
      frame: new THREE.Group(),
      motor: new THREE.Group(),
      hopper: new THREE.Group(),
      cutterDrum: new THREE.Group(),
      chute: new THREE.Group(),
      beltGuard: new THREE.Group()
    };

    // Materials
    const greenPaint = createMat({ color: 0x16824b, roughness: 0.3, metalness: 0.4 });
    const darkSteel = createMat({ color: 0x263238, roughness: 0.5, metalness: 0.8 });
    const mirrorBlade = createMat({ color: 0xeeeeee, roughness: 0.1, metalness: 0.95 });
    const yellowSafety = createMat({ color: 0xf1b82d, roughness: 0.3, metalness: 0.3 });
    const rubberTire = createMat({ color: 0x1a1a1a, roughness: 0.9, metalness: 0.05 });
    const motorCopper = createMat({ color: 0xb87333, roughness: 0.3, metalness: 0.7 });

    // 1. FRAME & CHASSIS
    // 4 Tubular legs
    const legGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.3, 16);
    const legPositions = [
      [-0.45, -0.45, -0.4],
      [0.45, -0.45, -0.4],
      [-0.45, -0.45, 0.4],
      [0.45, -0.45, 0.4]
    ];
    legPositions.forEach(p => {
      const leg = new THREE.Mesh(legGeo, greenPaint);
      leg.position.set(...p);
      leg.castShadow = true;
      sub.frame.add(leg);
    });

    // Cross brace tubes
    const braceGeo = new THREE.BoxGeometry(0.95, 0.05, 0.05);
    const b1 = new THREE.Mesh(braceGeo, greenPaint);
    b1.position.set(0, -0.8, -0.4);
    sub.frame.add(b1);
    const b2 = new THREE.Mesh(braceGeo, greenPaint);
    b2.position.set(0, -0.8, 0.4);
    sub.frame.add(b2);

    // Axle & Rubber Wheels
    const axleGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.25, 16);
    const axle = new THREE.Mesh(axleGeo, darkSteel);
    axle.rotation.z = Math.PI / 2;
    axle.position.set(0, -0.9, 0.4);
    sub.frame.add(axle);

    const tireGeo = new THREE.TorusGeometry(0.18, 0.07, 16, 32);
    const rimGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.08, 16);
    [-0.6, 0.6].forEach(x => {
      const tire = new THREE.Mesh(tireGeo, rubberTire);
      tire.rotation.y = Math.PI / 2;
      tire.position.set(x, -0.9, 0.4);
      tire.castShadow = true;
      sub.frame.add(tire);

      const rim = new THREE.Mesh(rimGeo, darkSteel);
      rim.rotation.z = Math.PI / 2;
      rim.position.set(x, -0.9, 0.4);
      sub.frame.add(rim);
    });

    // Front rubber rest feet
    [-0.45, 0.45].forEach(x => {
      const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.12, 16), rubberTire);
      foot.position.set(x, -1.05, -0.4);
      sub.frame.add(foot);
    });

    // Main machine table bed
    const bedMesh = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.08, 0.95), darkSteel);
    bedMesh.position.set(0, 0.2, 0);
    bedMesh.castShadow = true;
    sub.frame.add(bedMesh);

    // 2. MOTOR (3HP Copper Induction)
    const motorBody = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.55, 32), darkSteel);
    motorBody.rotation.z = Math.PI / 2;
    motorBody.position.set(0, 0, 0);
    motorBody.castShadow = true;
    sub.motor.add(motorBody);

    // Cooling ribs on motor
    for (let i = -0.22; i <= 0.22; i += 0.07) {
      const fin = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.015, 8, 32), darkSteel);
      fin.rotation.y = Math.PI / 2;
      fin.position.x = i;
      sub.motor.add(fin);
    }

    // Terminal box on motor top
    const termBox = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.12, 0.16), yellowSafety);
    termBox.position.set(0, 0.25, 0);
    sub.motor.add(termBox);

    // Motor Shaft & Pulley
    const motorPulley = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.06, 24), yellowSafety);
    motorPulley.rotation.z = Math.PI / 2;
    motorPulley.position.set(0.32, 0, 0);
    sub.motor.add(motorPulley);

    sub.motor.position.set(0.25, -0.25, -0.15);

    // 3. CUTTER DRUM & BLADES (Rotates on Action)
    const drumHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.48, 32), greenPaint);
    drumHousing.rotation.z = Math.PI / 2;
    drumHousing.position.set(0, 0.65, 0);
    drumHousing.castShadow = true;
    sub.cutterDrum.add(drumHousing);

    // Rotating Shaft with Blades Group
    const rotatingBladeAssembly = new THREE.Group();
    rotatingBladeAssembly.position.set(0, 0.65, 0);

    const shaftCore = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.52, 24), darkSteel);
    shaftCore.rotation.z = Math.PI / 2;
    rotatingBladeAssembly.add(shaftCore);

    // 4 High-Carbon Steel Blades
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const bladeArm = new THREE.Group();
      bladeArm.rotation.x = angle;

      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.012), mirrorBlade);
      blade.position.set(0, 0.26, 0);
      blade.castShadow = true;
      bladeArm.add(blade);

      const supportBar = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.03, 0.03), darkSteel);
      supportBar.position.set(0, 0.18, 0);
      bladeArm.add(supportBar);

      rotatingBladeAssembly.add(bladeArm);
    }
    sub.cutterDrum.add(rotatingBladeAssembly);
    group.userData.rotatingDrum = rotatingBladeAssembly;

    // 4. FEED HOPPER (Inlet Funnel)
    const hopperShape = new THREE.Group();
    const hopperTop = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.35, 0.45), greenPaint);
    hopperTop.rotation.z = 0.28;
    hopperTop.position.set(-0.68, 0.75, 0);
    hopperShape.add(hopperTop);

    // Safety edge strip
    const safetyStrip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.37, 0.47), yellowSafety);
    safetyStrip.rotation.z = 0.28;
    safetyStrip.position.set(-0.98, 0.83, 0);
    hopperShape.add(safetyStrip);

    // Safety infeed roller
    const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 16), darkSteel);
    roller.rotation.x = Math.PI / 2;
    roller.position.set(-0.38, 0.62, 0);
    hopperShape.add(roller);

    sub.hopper.add(hopperShape);

    // 5. DISCHARGE CHUTE (Curved Hood)
    const chuteGroup = new THREE.Group();
    const chuteBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.45, 24), greenPaint);
    chuteBase.position.set(0.15, 1.05, -0.15);
    chuteBase.rotation.x = -0.3;
    chuteGroup.add(chuteBase);

    // Curved hood deflector
    const hood = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.22, 0.25), greenPaint);
    hood.position.set(0.28, 1.25, -0.28);
    hood.rotation.x = -0.55;
    chuteGroup.add(hood);

    // Deflector flap adjustment knob
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.06, 16), yellowSafety);
    knob.position.set(0.38, 1.35, -0.25);
    chuteGroup.add(knob);

    sub.chute.add(chuteGroup);

    // 6. BELT DRIVE & GUARD
    const guardMesh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.85, 0.32), darkSteel);
    guardMesh.position.set(0.58, 0.25, -0.05);
    sub.beltGuard.add(guardMesh);

    // Assemble all sub-groups
    Object.keys(sub).forEach(key => {
      sub[key].userData.originPos = sub[key].position.clone();
      group.add(sub[key]);
    });

    group.userData.subGroups = sub;
    group.position.y = 0.15;
    return group;
  }

  /**
   * MODEL 2: 50kg Fermented Corn Silage Bale (with Slice Open Animation)
   */
  function buildSilageBaleModel() {
    const group = new THREE.Group();
    group.name = 'silage';

    const sub = {
      halfBack: new THREE.Group(),
      halfFront: new THREE.Group(),
      coreNutrients: new THREE.Group()
    };

    // Materials
    const greenWrapMat = createMat({ color: 0x1b5e39, roughness: 0.38, metalness: 0.15 });
    const blackStrapMat = createMat({ color: 0x111827, roughness: 0.8, metalness: 0.1 });
    const silageCoreMat = createMat({ color: 0xd4a017, roughness: 0.9, metalness: 0.05 });
    const cornKernelMat = createMat({ color: 0xf59e0b, roughness: 0.4, metalness: 0.1 });

    // Rear Half Cylinder (Fixed)
    const backGeo = new THREE.CylinderGeometry(0.85, 0.85, 1.35, 48, 1, false, Math.PI, Math.PI);
    const backMesh = new THREE.Mesh(backGeo, greenWrapMat);
    backMesh.castShadow = true;
    sub.halfBack.add(backMesh);

    // Front Half Cylinder (Slices open)
    const frontGeo = new THREE.CylinderGeometry(0.85, 0.85, 1.35, 48, 1, false, 0, Math.PI);
    const frontMesh = new THREE.Mesh(frontGeo, greenWrapMat);
    frontMesh.castShadow = true;
    sub.halfFront.add(frontMesh);

    // 3 High-Tension Compression Straps
    [-0.45, 0, 0.45].forEach(y => {
      const strapBack = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.86, 0.06, 48, 1, true, Math.PI, Math.PI), blackStrapMat);
      strapBack.position.y = y;
      sub.halfBack.add(strapBack);

      const strapFront = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.86, 0.06, 48, 1, true, 0, Math.PI), blackStrapMat);
      strapFront.position.y = y;
      sub.halfFront.add(strapFront);
    });

    // End Caps (Top & Bottom)
    const capGeo = new THREE.CircleGeometry(0.85, 48);
    const topCapBack = new THREE.Mesh(capGeo, greenWrapMat);
    topCapBack.rotation.x = -Math.PI / 2;
    topCapBack.position.y = 0.675;
    sub.halfBack.add(topCapBack);

    const bottomCapBack = new THREE.Mesh(capGeo, greenWrapMat);
    bottomCapBack.rotation.x = Math.PI / 2;
    bottomCapBack.position.y = -0.675;
    sub.halfBack.add(bottomCapBack);

    // Brand Badge Decal (On front)
    const badgeGeo = new THREE.PlaneGeometry(0.65, 0.45);
    const badgeMat = createMat({ color: 0xffffff, roughness: 0.5, metalness: 0.1 });
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.position.set(0, 0.1, 0.86);
    sub.halfFront.add(badgeMesh);

    // Internal Fermented Silage Core Face (Visible when opened)
    const coreSliceFace = new THREE.Mesh(new THREE.PlaneGeometry(1.68, 1.34), silageCoreMat);
    coreSliceFace.rotation.y = 0;
    coreSliceFace.position.set(0, 0, 0.01);
    sub.halfBack.add(coreSliceFace);

    // Golden Corn kernel particles inside core
    for (let i = 0; i < 65; i++) {
      const k = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), cornKernelMat);
      k.position.set((Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 1.2, 0.03 + Math.random() * 0.04);
      sub.halfBack.add(k);
    }

    // Floating 3D Nutrient Energy Nodes (Cloud)
    const nutrientGroup = new THREE.Group();
    const pGeo = new THREE.SphereGeometry(0.035, 12, 12);
    const pMatEmerald = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const pMatGold = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });

    for (let i = 0; i < 40; i++) {
      const p = new THREE.Mesh(pGeo, i % 2 === 0 ? pMatEmerald : pMatGold);
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.3 + Math.random() * 0.8;
      p.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 1.4, Math.sin(angle) * radius);
      p.userData = { angle, radius, speed: 0.01 + Math.random() * 0.02, yBase: p.position.y };
      nutrientGroup.add(p);
    }
    nutrientGroup.visible = false;
    sub.coreNutrients.add(nutrientGroup);
    group.userData.nutrientCloud = nutrientGroup;

    // Origins
    Object.keys(sub).forEach(key => {
      sub[key].userData.originPos = sub[key].position.clone();
      group.add(sub[key]);
    });

    group.userData.subGroups = sub;
    group.position.y = 0.2;
    return group;
  }

  /**
   * MODEL 3: Trolley Automatic Milking Machine
   */
  function buildMilkingMachineModel() {
    const group = new THREE.Group();
    group.name = 'milking';

    const sub = {
      trolley: new THREE.Group(),
      bucket: new THREE.Group(),
      vacuumPump: new THREE.Group(),
      cluster: new THREE.Group()
    };

    // Materials
    const steelPipe = createMat({ color: 0x374151, roughness: 0.4, metalness: 0.8 });
    const chromeSS304 = createMat({ color: 0xf8f9fa, roughness: 0.12, metalness: 0.96 });
    const rubberBlack = createMat({ color: 0x111827, roughness: 0.9, metalness: 0.05 });
    const siliconeTube = new THREE.MeshStandardMaterial({
      color: 0xe0f2fe,
      roughness: 0.2,
      metalness: 0.1,
      transparent: true,
      opacity: 0.75
    });
    const brassMat = createMat({ color: 0xd97706, roughness: 0.3, metalness: 0.8 });

    // 1. TROLLEY CART
    // U-shaped tubular handle
    const handleGeo = new THREE.CylinderGeometry(0.035, 0.035, 1.5, 16);
    const h1 = new THREE.Mesh(handleGeo, steelPipe);
    h1.rotation.x = -0.3;
    h1.position.set(-0.35, 0.4, -0.3);
    sub.trolley.add(h1);

    const h2 = new THREE.Mesh(handleGeo, steelPipe);
    h2.rotation.x = -0.3;
    h2.position.set(0.35, 0.4, -0.3);
    sub.trolley.add(h2);

    // Cross grip bar
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.75, 16), rubberBlack);
    bar.rotation.z = Math.PI / 2;
    bar.position.set(0, 1.05, -0.55);
    sub.trolley.add(bar);

    // Cart platform plate
    const basePlate = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.05, 0.95), steelPipe);
    basePlate.position.set(0, -0.45, 0.05);
    sub.trolley.add(basePlate);

    // Wheels
    const wheelGeo = new THREE.TorusGeometry(0.25, 0.075, 16, 32);
    [-0.5, 0.5].forEach(x => {
      const w = new THREE.Mesh(wheelGeo, rubberBlack);
      w.rotation.y = Math.PI / 2;
      w.position.set(x, -0.5, -0.2);
      w.castShadow = true;
      sub.trolley.add(w);

      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.06, 16), steelPipe);
      hub.rotation.z = Math.PI / 2;
      hub.position.set(x, -0.5, -0.2);
      sub.trolley.add(hub);
    });

    // Front stand peg
    const peg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.35, 16), rubberBlack);
    peg.position.set(0, -0.65, 0.45);
    sub.trolley.add(peg);

    // 2. SS 304 25L MILK BUCKET (Mirror Chrome)
    const canBody = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.34, 0.85, 36), chromeSS304);
    canBody.position.set(0, 0.05, 0.2);
    canBody.castShadow = true;
    sub.bucket.add(canBody);

    // Neck cone
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.38, 0.25, 36), chromeSS304);
    neck.position.set(0, 0.58, 0.2);
    sub.bucket.add(neck);

    // Domed clamping lid
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.06, 36), chromeSS304);
    lid.position.set(0, 0.72, 0.2);
    sub.bucket.add(lid);

    // Carry handle
    const canHandle = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.02, 16, 32, Math.PI), chromeSS304);
    canHandle.position.set(0, 0.75, 0.2);
    sub.bucket.add(canHandle);

    // 3. VACUUM PUMP & GAUGE
    const pumpMotor = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.45, 24), steelPipe);
    pumpMotor.rotation.z = Math.PI / 2;
    pumpMotor.position.set(0, -0.15, -0.25);
    sub.vacuumPump.add(pumpMotor);

    // Silencer canister
    const silencer = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.35, 16), steelPipe);
    silencer.position.set(-0.25, 0.1, -0.25);
    sub.vacuumPump.add(silencer);

    // Vacuum Gauge Dial
    const gaugeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.05, 32), chromeSS304);
    gaugeBody.rotation.x = Math.PI / 2;
    gaugeBody.position.set(0.35, 0.75, 0);
    sub.vacuumPump.add(gaugeBody);

    const gaugeGlass = new THREE.Mesh(new THREE.CircleGeometry(0.1, 32), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    gaugeGlass.position.set(0.35, 0.75, 0.03);
    sub.vacuumPump.add(gaugeGlass);

    // Animated Red Needle on Vacuum Gauge
    const needle = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.08, 0.005), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
    needle.position.set(0.35, 0.77, 0.035);
    needle.geometry.translate(0, 0.04, 0);
    sub.vacuumPump.add(needle);
    group.userData.vacuumNeedle = needle;

    // Brass regulator valve
    const brassValve = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 16), brassMat);
    brassValve.position.set(0.35, 0.6, 0);
    sub.vacuumPump.add(brassValve);

    // Pulsator unit on bucket lid
    const pulsatorBox = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.12), steelPipe);
    pulsatorBox.position.set(0, 0.8, 0.2);
    sub.vacuumPump.add(pulsatorBox);

    // 4. TEAT CLAW & 4 SILICONE CUPS
    const clawBase = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), chromeSS304);
    clawBase.position.set(-0.55, 0.35, 0.25);
    sub.cluster.add(clawBase);

    // 4 Teat Cups hanging
    const teatOffsets = [
      [-0.08, -0.25, -0.08],
      [0.08, -0.25, -0.08],
      [-0.08, -0.25, 0.08],
      [0.08, -0.25, 0.08]
    ];
    teatOffsets.forEach(pos => {
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.24, 16), chromeSS304);
      cup.position.set(-0.55 + pos[0], 0.35 + pos[1], 0.25 + pos[2]);
      sub.cluster.add(cup);

      const liner = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.05, 16), siliconeTube);
      liner.position.set(-0.55 + pos[0], 0.35 + pos[1] + 0.11, 0.25 + pos[2]);
      sub.cluster.add(liner);
    });

    // Flexible silicone milk tubes
    const tubeGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.75, 12);
    const tube1 = new THREE.Mesh(tubeGeo, siliconeTube);
    tube1.rotation.z = 0.85;
    tube1.position.set(-0.3, 0.58, 0.22);
    sub.cluster.add(tube1);

    Object.keys(sub).forEach(key => {
      sub[key].userData.originPos = sub[key].position.clone();
      group.add(sub[key]);
    });

    group.userData.subGroups = sub;
    group.position.y = 0.1;
    return group;
  }

  /**
   * MODEL 4: Feed Storage Silo Tower
   */
  function buildSiloTowerModel() {
    const group = new THREE.Group();
    group.name = 'silo';

    const sub = {
      legs: new THREE.Group(),
      cone: new THREE.Group(),
      cylinder: new THREE.Group(),
      roof: new THREE.Group(),
      ladder: new THREE.Group()
    };

    const galvSteel = createMat({ color: 0x9ca3af, roughness: 0.45, metalness: 0.75 });
    const darkBeam = createMat({ color: 0x1f2937, roughness: 0.6, metalness: 0.7 });
    const safetyYellow = createMat({ color: 0xf59e0b, roughness: 0.3, metalness: 0.2 });

    // 4 Support Legs (I-Beams)
    [-0.7, 0.7].forEach(x => {
      [-0.7, 0.7].forEach(z => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.09, 1.4, 0.09), darkBeam);
        leg.position.set(x, -0.65, z);
        sub.legs.add(leg);
      });
    });

    // Bottom Discharge Cone (60 degree hopper)
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.95, 0.95, 36, 1, true), galvSteel);
    cone.rotation.x = Math.PI;
    cone.position.set(0, -0.25, 0);
    sub.cone.add(cone);

    // Discharge Auger Spout
    const auger = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.55, 16), safetyYellow);
    auger.rotation.z = 0.6;
    auger.position.set(0.18, -0.85, 0);
    sub.cone.add(auger);

    // Corrugated Storage Cylinder
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 0.95, 1.45, 36), galvSteel);
    cyl.position.set(0, 0.72, 0);
    cyl.castShadow = true;
    sub.cylinder.add(cyl);

    // Corrugated Ring Bands
    for (let y = 0.15; y <= 1.35; y += 0.24) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.96, 0.015, 8, 36), galvSteel);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = y;
      sub.cylinder.add(ring);
    }

    // Conical Roof Hood
    const roof = new THREE.Mesh(new THREE.ConeGeometry(1.05, 0.55, 36), galvSteel);
    roof.position.set(0, 1.7, 0);
    sub.roof.add(roof);

    // Inspection Hatch
    const hatch = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16), safetyYellow);
    hatch.position.set(0.35, 1.75, 0.35);
    sub.roof.add(hatch);

    // Safety Cage Ladder
    const r1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.2, 12), safetyYellow);
    r1.position.set(1.05, 0.45, -0.12);
    sub.ladder.add(r1);
    const r2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 2.2, 12), safetyYellow);
    r2.position.set(1.05, 0.45, 0.12);
    sub.ladder.add(r2);

    for (let y = -0.5; y <= 1.4; y += 0.2) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.24), safetyYellow);
      step.position.set(1.05, y, 0);
      sub.ladder.add(step);
    }

    Object.keys(sub).forEach(key => {
      sub[key].userData.originPos = sub[key].position.clone();
      group.add(sub[key]);
    });

    group.userData.subGroups = sub;
    group.position.y = 0.25;
    return group;
  }

  /**
   * Switches the active 3D Model with smooth GSAP camera fly-in
   */
  function switchModel(modelKey, animateCamera = true) {
    if (!StudioState.models[modelKey]) return;

    StudioState.currentModel = modelKey;
    StudioState.isExploded = false;
    StudioState.isActionRunning = false;

    // Reset Explode button UI
    const explodeBtnText = document.getElementById('explodeBtnText');
    if (explodeBtnText) explodeBtnText.textContent = "Explode View";

    // Reset Primary Action button UI
    const spec = ModelSpecs[modelKey];
    const actionBtn = document.getElementById('primaryActionBtn');
    const actionText = document.getElementById('primaryActionText');
    if (actionText) actionText.textContent = spec.primaryActionLabel;
    if (actionBtn) {
      actionBtn.classList.remove('from-amber-600', 'to-orange-500');
      actionBtn.classList.add('from-emerald-600', 'to-green-500');
    }

    // Hide previous models
    Object.keys(StudioState.models).forEach(key => {
      const m = StudioState.models[key];
      if (m) {
        scene.remove(m);
        // Reset subGroup exploded positions
        if (m.userData.subGroups) {
          Object.values(m.userData.subGroups).forEach(sub => {
            if (sub.userData.originPos) sub.position.copy(sub.userData.originPos);
          });
        }
      }
    });

    // Add active model
    StudioState.activeGroup = StudioState.models[modelKey];
    scene.add(StudioState.activeGroup);

    // Apply Wireframe if active
    applyWireframe(StudioState.isWireframe);

    // Update Model Selector Tab UI
    document.querySelectorAll('.model-select-btn').forEach(btn => {
      if (btn.getAttribute('data-model') === modelKey) {
        btn.classList.add('active', 'bg-white/10', 'text-white', 'border-white/20');
        btn.classList.remove('bg-white/5', 'text-emerald-100/80', 'border-white/10');
      } else {
        btn.classList.remove('active', 'bg-white/10', 'text-white', 'border-white/20');
        btn.classList.add('bg-white/5', 'text-emerald-100/80', 'border-white/10');
      }
    });

    // Update UI HUD Text & Sidebar Specs
    updateSidebarContent(modelKey);

    // Rebuild 3D Hotspot Pins
    renderHotspots(modelKey);

    // Camera fly-in animation
    if (animateCamera && window.gsap) {
      const targetPos = getCameraDefaultPosition(modelKey);
      gsap.to(camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.2,
        ease: "power2.out"
      });
      gsap.to(controls.target, {
        x: 0,
        y: 0.2,
        z: 0,
        duration: 1.2,
        ease: "power2.out"
      });
    }
  }

  function getCameraDefaultPosition(modelKey) {
    switch (modelKey) {
      case 'cutter': return { x: 3.4, y: 2.2, z: 4.8 };
      case 'silage': return { x: 2.8, y: 1.6, z: 4.2 };
      case 'milking': return { x: 3.0, y: 1.8, z: 4.4 };
      case 'silo': return { x: 4.2, y: 2.8, z: 5.5 };
      default: return { x: 3.5, y: 2.0, z: 5.0 };
    }
  }

  /**
   * Updates Sidebar Details & Specifications
   */
  function updateSidebarContent(key) {
    const spec = ModelSpecs[key];
    if (!spec) return;

    const label = document.getElementById('activeModelLabel');
    const subLabel = document.getElementById('activeModelSub');
    if (label) label.textContent = spec.title;
    if (subLabel) subLabel.textContent = spec.specs[0].val + " • " + spec.specs[1].val;

    const sidebarTag = document.getElementById('sidebarTag');
    const sidebarTitle = document.getElementById('sidebarTitle');
    const sidebarDesc = document.getElementById('sidebarDesc');
    const sidebarWhatsAppBtn = document.getElementById('sidebarWhatsAppBtn');
    const sidebarSpecsList = document.getElementById('sidebarSpecsList');

    if (sidebarTag) sidebarTag.textContent = spec.tag;
    if (sidebarTitle) sidebarTitle.textContent = spec.title;
    if (sidebarDesc) sidebarDesc.textContent = spec.desc;

    if (sidebarWhatsAppBtn) {
      sidebarWhatsAppBtn.href = `https://wa.me/917904893635?text=${encodeURIComponent(spec.whatsappText)}`;
    }

    if (sidebarSpecsList) {
      sidebarSpecsList.innerHTML = spec.specs.map(s => `
        <div class="flex items-center justify-between py-1.5 px-3 rounded-xl bg-white/5 border border-white/5 text-xs">
          <span class="text-gray-300 font-semibold">${s.label}</span>
          <span class="text-emerald-300 font-extrabold text-right">${s.val}</span>
        </div>
      `).join('');
    }

    // Hide any previous hotspot detail card
    closeHotspotCard();
  }

  /**
   * Interactive 3D Hotspot Beacon Pins
   */
  function renderHotspots(modelKey) {
    const container = document.getElementById('hotspotsContainer');
    if (!container) return;

    container.innerHTML = '';
    StudioState.hotspotElements = [];

    const spec = ModelSpecs[modelKey];
    if (!spec || !spec.hotspots || !StudioState.showHotspots) return;

    spec.hotspots.forEach((h, index) => {
      const pin = document.createElement('div');
      pin.className = 'hotspot-beacon';
      pin.setAttribute('data-id', h.id);
      pin.innerHTML = `
        <div class="relative group cursor-pointer pointer-events-auto">
          <span class="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-emerald-400 opacity-60"></span>
          <div class="relative w-7 h-7 rounded-full bg-emerald-500/90 text-white flex items-center justify-center font-black text-[11px] shadow-lg border border-white ring-2 ring-emerald-400/40 group-hover:scale-125 transition-transform">
            ${index + 1}
          </div>
          <!-- Hover Pill -->
          <div class="absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-bold text-white border border-white/20 opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-xl">
            ${h.title}
          </div>
        </div>
      `;

      pin.addEventListener('click', (e) => {
        e.stopPropagation();
        inspectHotspot(h);
      });

      container.appendChild(pin);
      StudioState.hotspotElements.push({
        el: pin,
        worldPos: new THREE.Vector3(...h.pos),
        data: h
      });
    });
  }

  /**
   * Focuses camera onto a specific component when a hotspot pin is clicked
   */
  function inspectHotspot(h) {
    const box = document.getElementById('hotspotDetailBox');
    const badge = document.getElementById('hotspotBadge');
    const title = document.getElementById('hotspotTitle');
    const desc = document.getElementById('hotspotDesc');

    if (box && badge && title && desc) {
      badge.textContent = h.tag || "COMPONENT DETAIL";
      title.textContent = h.title;
      desc.textContent = h.desc;
      box.classList.remove('hidden');

      // Scroll sidebar into view on mobile
      if (window.innerWidth < 1024) {
        box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    // Camera orbit smoothly toward the hotspot position
    if (window.gsap) {
      const targetPos = new THREE.Vector3(...h.pos);
      const camOffset = targetPos.clone().add(new THREE.Vector3(1.6, 1.2, 2.0));

      gsap.to(camera.position, {
        x: camOffset.x,
        y: camOffset.y,
        z: camOffset.z,
        duration: 1.0,
        ease: "power2.out"
      });
      gsap.to(controls.target, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.0,
        ease: "power2.out"
      });
    }
  }

  window.closeHotspotCard = function () {
    const box = document.getElementById('hotspotDetailBox');
    if (box) box.classList.add('hidden');
  };

  /**
   * Projects 3D Hotspot positions to 2D Screen Space
   */
  function updateHotspotsPosition() {
    if (!StudioState.showHotspots || StudioState.hotspotElements.length === 0) return;

    const tempV = new THREE.Vector3();
    StudioState.hotspotElements.forEach(item => {
      tempV.copy(item.worldPos);
      tempV.project(camera);

      // Check if pin is in front of camera
      const isBehind = tempV.z > 1;
      if (isBehind) {
        item.el.style.opacity = '0';
        item.el.style.pointerEvents = 'none';
        return;
      }

      const x = (tempV.x * 0.5 + 0.5) * width;
      const y = (-(tempV.y * 0.5) + 0.5) * height;

      item.el.style.left = `${x}px`;
      item.el.style.top = `${y}px`;
      item.el.style.opacity = '1';
      item.el.style.pointerEvents = 'auto';
    });
  }

  /**
   * Exploded View GSAP Animation Toggle
   */
  function toggleExplodeView() {
    const active = StudioState.activeGroup;
    if (!active || !active.userData.subGroups) return;

    StudioState.isExploded = !StudioState.isExploded;
    const isExp = StudioState.isExploded;
    const btnText = document.getElementById('explodeBtnText');
    if (btnText) btnText.textContent = isExp ? "Assemble View" : "Explode View";

    const sub = active.userData.subGroups;

    if (StudioState.currentModel === 'cutter') {
      gsap.to(sub.hopper.position, {
        x: isExp ? -1.1 : sub.hopper.userData.originPos.x,
        y: isExp ? 0.35 : sub.hopper.userData.originPos.y,
        duration: 0.9,
        ease: "back.out(1.4)"
      });
      gsap.to(sub.chute.position, {
        x: isExp ? 0.65 : sub.chute.userData.originPos.x,
        y: isExp ? 0.8 : sub.chute.userData.originPos.y,
        z: isExp ? -0.4 : sub.chute.userData.originPos.z,
        duration: 0.9,
        ease: "back.out(1.4)"
      });
      gsap.to(sub.motor.position, {
        z: isExp ? -1.1 : sub.motor.userData.originPos.z,
        y: isExp ? -0.2 : sub.motor.userData.originPos.y,
        duration: 0.9,
        ease: "back.out(1.4)"
      });
      gsap.to(sub.cutterDrum.position, {
        y: isExp ? 0.8 : sub.cutterDrum.userData.originPos.y,
        duration: 0.9,
        ease: "back.out(1.4)"
      });
      gsap.to(sub.beltGuard.position, {
        x: isExp ? 1.1 : sub.beltGuard.userData.originPos.x,
        duration: 0.9,
        ease: "back.out(1.4)"
      });
    } else if (StudioState.currentModel === 'silage') {
      gsap.to(sub.halfFront.position, {
        z: isExp ? 0.95 : sub.halfFront.userData.originPos.z,
        duration: 0.9,
        ease: "back.out(1.4)"
      });
      gsap.to(sub.halfBack.position, {
        z: isExp ? -0.65 : sub.halfBack.userData.originPos.z,
        duration: 0.9,
        ease: "back.out(1.4)"
      });
    } else if (StudioState.currentModel === 'milking') {
      gsap.to(sub.bucket.position, {
        y: isExp ? 0.65 : sub.bucket.userData.originPos.y,
        duration: 0.9,
        ease: "back.out(1.4)"
      });
      gsap.to(sub.cluster.position, {
        x: isExp ? -1.1 : sub.cluster.userData.originPos.x,
        y: isExp ? 0.4 : sub.cluster.userData.originPos.y,
        duration: 0.9,
        ease: "back.out(1.4)"
      });
      gsap.to(sub.vacuumPump.position, {
        z: isExp ? -0.85 : sub.vacuumPump.userData.originPos.z,
        duration: 0.9,
        ease: "back.out(1.4)"
      });
    } else if (StudioState.currentModel === 'silo') {
      gsap.to(sub.roof.position, {
        y: isExp ? 1.0 : sub.roof.userData.originPos.y,
        duration: 0.9,
        ease: "back.out(1.4)"
      });
      gsap.to(sub.cone.position, {
        y: isExp ? -0.85 : sub.cone.userData.originPos.y,
        duration: 0.9,
        ease: "back.out(1.4)"
      });
      gsap.to(sub.ladder.position, {
        x: isExp ? 0.65 : sub.ladder.userData.originPos.x,
        duration: 0.9,
        ease: "back.out(1.4)"
      });
    }
  }

  /**
   * Action Simulation (Run Blades, Vacuum Pulsation, Slice Bale)
   */
  function togglePrimaryAction() {
    StudioState.isActionRunning = !StudioState.isActionRunning;
    const isRunning = StudioState.isActionRunning;
    const spec = ModelSpecs[StudioState.currentModel];
    const actionBtn = document.getElementById('primaryActionBtn');
    const actionText = document.getElementById('primaryActionText');

    if (actionText && spec) {
      actionText.textContent = isRunning ? spec.primaryActionStopLabel : spec.primaryActionLabel;
    }

    if (actionBtn) {
      if (isRunning) {
        actionBtn.classList.remove('from-emerald-600', 'to-green-500');
        actionBtn.classList.add('from-amber-600', 'to-orange-500');
      } else {
        actionBtn.classList.remove('from-amber-600', 'to-orange-500');
        actionBtn.classList.add('from-emerald-600', 'to-green-500');
      }
    }

    // Specific Action triggers
    if (StudioState.currentModel === 'silage') {
      const sub = StudioState.activeGroup.userData.subGroups;
      const nutrients = StudioState.activeGroup.userData.nutrientCloud;
      gsap.to(sub.halfFront.position, {
        z: isRunning ? 0.85 : 0,
        duration: 0.8,
        ease: "power2.out",
        onComplete: () => {
          if (nutrients) nutrients.visible = isRunning;
        }
      });
    }
  }

  /**
   * Blueprint / Holographic Wireframe Toggle
   */
  function toggleWireframe() {
    StudioState.isWireframe = !StudioState.isWireframe;
    applyWireframe(StudioState.isWireframe);
    const wfText = document.getElementById('wireframeText');
    if (wfText) wfText.textContent = StudioState.isWireframe ? "Solid Mode" : "Blueprint Mode";
  }

  function applyWireframe(enable) {
    if (!StudioState.activeGroup) return;
    StudioState.activeGroup.traverse((child) => {
      if (child.isMesh && child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.wireframe = enable);
        } else {
          child.material.wireframe = enable;
        }
      }
    });
  }

  /**
   * Studio Lighting Switcher
   */
  function toggleLighting() {
    const modes = ['studio', 'cyber', 'sunset'];
    const curIdx = modes.indexOf(StudioState.lightingMode);
    StudioState.lightingMode = modes[(curIdx + 1) % modes.length];

    const label = document.getElementById('lightingLabel');

    if (StudioState.lightingMode === 'studio') {
      if (label) label.textContent = "Studio Light";
      scene.background.set(0x041a10);
      ambientLight.color.set(0xd4eed8);
      ambientLight.intensity = 0.85;
      keyLight.color.set(0xffffff);
      fillLight.color.set(0x4ec489);
      rimLight.color.set(0xf4cf65);
    } else if (StudioState.lightingMode === 'cyber') {
      if (label) label.textContent = "Cyber Agro";
      scene.background.set(0x020f08);
      ambientLight.color.set(0x052e16);
      ambientLight.intensity = 0.6;
      keyLight.color.set(0x10b981);
      fillLight.color.set(0x06b6d4);
      rimLight.color.set(0xa855f7);
    } else if (StudioState.lightingMode === 'sunset') {
      if (label) label.textContent = "Sunset Glow";
      scene.background.set(0x1c1204);
      ambientLight.color.set(0xfae8b4);
      ambientLight.intensity = 0.9;
      keyLight.color.set(0xf59e0b);
      fillLight.color.set(0xef4444);
      rimLight.color.set(0xfbbf24);
    }
  }

  /**
   * Camera Angle Presets
   */
  window.setCameraPreset = function (preset) {
    if (!window.gsap) return;

    let targetCam = { x: 3.8, y: 2.4, z: 5.2 };
    if (preset === 'front') {
      targetCam = { x: 0, y: 0.6, z: 5.4 };
    } else if (preset === 'top') {
      targetCam = { x: 0.05, y: 6.8, z: 0.1 };
    } else if (preset === 'isometric') {
      targetCam = { x: 4.2, y: 3.4, z: 4.5 };
    }

    gsap.to(camera.position, {
      ...targetCam,
      duration: 1.1,
      ease: "power2.out"
    });
    gsap.to(controls.target, {
      x: 0,
      y: 0.2,
      z: 0,
      duration: 1.1,
      ease: "power2.out"
    });
  };

  /**
   * Event Handlers Setup
   */
  function setupEventListeners() {
    // Model Select Tabs
    document.querySelectorAll('.model-select-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-model');
        switchModel(key, true);
      });
    });

    // Auto-Rotate Button
    const autoRotBtn = document.getElementById('toggleAutoRotateBtn');
    if (autoRotBtn) {
      autoRotBtn.addEventListener('click', () => {
        StudioState.isAutoRotating = !StudioState.isAutoRotating;
        controls.autoRotate = StudioState.isAutoRotating;
        autoRotBtn.classList.toggle('bg-emerald-600/80', StudioState.isAutoRotating);
        autoRotBtn.classList.toggle('bg-black/50', !StudioState.isAutoRotating);
      });
    }

    // Reset Camera Button
    const resetBtn = document.getElementById('resetCameraBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        setCameraPreset('isometric');
      });
    }

    // Primary Action Button
    const actionBtn = document.getElementById('primaryActionBtn');
    if (actionBtn) actionBtn.addEventListener('click', togglePrimaryAction);

    // Explode View Button
    const explodeBtn = document.getElementById('explodeViewBtn');
    if (explodeBtn) explodeBtn.addEventListener('click', toggleExplodeView);

    // Wireframe Mode Button
    const wfBtn = document.getElementById('wireframeBtn');
    if (wfBtn) wfBtn.addEventListener('click', toggleWireframe);

    // Lighting Button
    const lightBtn = document.getElementById('toggleLightingBtn');
    if (lightBtn) lightBtn.addEventListener('click', toggleLighting);

    // Toggle Hotspots Visibility
    const hotBtn = document.getElementById('toggleHotspotsBtn');
    if (hotBtn) {
      hotBtn.addEventListener('click', () => {
        StudioState.showHotspots = !StudioState.showHotspots;
        document.getElementById('hotspotsText').textContent = StudioState.showHotspots ? "Hotspots: ON" : "Hotspots: OFF";
        renderHotspots(StudioState.currentModel);
      });
    }
  }

  /**
   * Resize Handler
   */
  function onWindowResize() {
    if (!container || !renderer || !camera) return;
    width = container.clientWidth;
    height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  /**
   * Main Render Loop
   */
  function animate() {
    animationFrameId = requestAnimationFrame(animate);

    // Controls update for smooth damping & auto-rotate
    controls.update();

    // Model-Specific Dynamic Animations
    if (StudioState.currentModel === 'cutter') {
      const drum = StudioState.models.cutter?.userData.rotatingDrum;
      if (drum) {
        if (StudioState.isActionRunning) {
          drum.rotation.x += 0.35; // Fast cutter spin
        } else {
          drum.rotation.x += 0.005; // Gentle idle drift
        }
      }
    } else if (StudioState.currentModel === 'milking') {
      const needle = StudioState.models.milking?.userData.vacuumNeedle;
      if (needle) {
        if (StudioState.isActionRunning) {
          StudioState.pulseTimer += 0.15;
          needle.rotation.z = Math.sin(StudioState.pulseTimer) * 0.45 - 0.2;
        } else {
          needle.rotation.z = 0;
        }
      }
    } else if (StudioState.currentModel === 'silage') {
      const nutrients = StudioState.models.silage?.userData.nutrientCloud;
      if (nutrients && nutrients.visible) {
        nutrients.children.forEach(p => {
          p.userData.angle += p.userData.speed;
          p.position.x = Math.cos(p.userData.angle) * p.userData.radius;
          p.position.z = Math.sin(p.userData.angle) * p.userData.radius;
          p.position.y = p.userData.yBase + Math.sin(p.userData.angle * 2) * 0.12;
        });
      }
    }

    // Update 3D Hotspot Screen Coordinates
    updateHotspotsPosition();

    // Render Scene
    renderer.render(scene, camera);
  }

  /**
   * Global Hook: Seamlessly switch model from product cards & scroll to 3D studio
   */
  window.switchModelAndScroll = function (modelKey) {
    const studioSection = document.getElementById('studio-3d');
    if (studioSection) {
      studioSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setTimeout(() => {
      switchModel(modelKey, true);
    }, 450);
  };

  /**
   * Download Active 3D Specs as formatted text file
   */
  window.download3dConfig = function () {
    const spec = ModelSpecs[StudioState.currentModel];
    if (!spec) return;

    const content = `=====================================================
ARURAN AGRO SOLUTION - 3D MACHINERY SPECIFICATION
Model: ${spec.title}
Category: ${spec.tag}
=====================================================

Overview:
${spec.desc}

Technical Specifications:
${spec.specs.map(s => `- ${s.label}: ${s.val}`).join('\n')}

Contact for Pricing & Doorstep Dispatch:
Aruran Agro Solution
Thulukkanur, Attur, Salem District, Tamil Nadu
Phone: +91 79048 93635
WhatsApp: https://wa.me/917904893635
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${StudioState.currentModel}-specs-aruran-agro.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStudio);
  } else {
    initStudio();
  }

})();

/**
 * ==============================================================================
 * HERO SECTION 3D AGRI-PARTICLE CANVAS (Lightweight WebGL Constellation)
 * ==============================================================================
 */
(function initHero3dParticles() {
  const canvas = document.getElementById('hero3dCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.z = 400;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: false });
  renderer.setSize(canvas.parentElement.clientWidth, canvas.parentElement.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

  // Particle Geo
  const particleCount = 140;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const cEmerald = new THREE.Color(0x34d399);
  const cGold = new THREE.Color(0xfbbf24);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 900;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 500;

    const col = Math.random() > 0.4 ? cEmerald : cGold;
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 4.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  // Mouse reaction
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.15;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.15;
  });

  function renderHeroParticles() {
    requestAnimationFrame(renderHeroParticles);

    // Only render if hero is near viewport
    if (window.scrollY > window.innerHeight) return;

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    particleSystem.rotation.y += 0.0012;
    particleSystem.rotation.x = targetY * 0.0008;
    particleSystem.position.x = targetX * 0.4;

    renderer.render(scene, camera);
  }
  renderHeroParticles();

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();

/**
 * ==============================================================================
 * UNIVERSAL 3D CARD TILT & GLOSS ENGINE (Vanilla 60FPS)
 * ==============================================================================
 */
(function initCardTiltEngine() {
  function applyTiltToCards() {
    const cards = document.querySelectorAll('.tilt-card-3d, .lift-card');

    cards.forEach(card => {
      // Create glare overlay if not present
      let glare = card.querySelector('.tilt-glare');
      if (!glare) {
        glare = document.createElement('div');
        glare.className = 'tilt-glare';
        card.appendChild(glare);
      }

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'none';
        glare.style.opacity = '1';
      });

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const xNorm = (x / rect.width) - 0.5;
        const yNorm = (y / rect.height) - 0.5;

        const maxTilt = 10;
        const rotateX = -yNorm * maxTilt;
        const rotateY = xNorm * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.22) 0%, transparent 65%)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        glare.style.opacity = '0';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyTiltToCards);
  } else {
    applyTiltToCards();
  }
})();
