// Aurora, Astro, Atlas Build Information
export interface BuildInfo {
  name: string;
  version: string;
  type: 'server' | 'proxy' | 'regionised';
  patches: number;
  releaseDate: string;
  downloadUrl: string;
  size: string;
  features: string[];
  performanceGains: {
    ping?: string;
    throughput?: string;
    cpu?: string;
    memory?: string;
  };
}

export const builds: BuildInfo[] = [
  {
    name: 'Aurora',
    version: '26.2-optimized',
    type: 'regionised',
    patches: 64,
    releaseDate: '2026-09-12',
    downloadUrl: 'https://github.com/AtlasStudioMC/Aurora/releases',
    size: '62 MB',
    features: [
      'Region threading (Folia)',
      'Multi-threaded world processing',
      '64 optimization patches',
      'Dynamic bandwidth throttling',
      'Advanced packet prioritization',
      'Object pooling (40% GC reduction)',
      'L2/L3 cache layers',
      'Adaptive TPS management',
      'Crash prevention (40+ scenarios)',
      'Production-ready stability'
    ],
    performanceGains: {
      ping: '35-50ms ↓',
      throughput: '35-50% ↑',
      cpu: '20-25% ↓',
      memory: '15-20% ↓'
    }
  },
  {
    name: 'Atlas',
    version: '26.2',
    type: 'server',
    patches: 38,
    releaseDate: '2026-09-01',
    downloadUrl: 'https://github.com/AtlasStudioMC/Atlas/releases',
    size: '45 MB',
    features: [
      'Paper-based Spigot fork',
      'Plugin compatibility',
      'Performance optimization',
      'Multi-version support (1.8.8 - 26.2)',
      'Stability patches',
      'Crash prevention',
      'Memory optimization'
    ],
    performanceGains: {
      ping: '20-30ms ↓',
      throughput: '25-35% ↑',
      cpu: '10-15% ↓',
      memory: '10-15% ↓'
    }
  },
  {
    name: 'Astro',
    version: 'build-1',
    type: 'proxy',
    patches: 0,
    releaseDate: '2026-08-15',
    downloadUrl: 'https://github.com/AtlasStudioMC/Astro/releases',
    size: '20 MB',
    features: [
      'Velocity proxy fork',
      'Multi-server support',
      'Player load balancing',
      'Low latency proxy',
      'Plugin compatibility',
      'Server failover'
    ],
    performanceGains: {
      ping: '5-10ms ↓',
      throughput: '15-20% ↑'
    }
  }
];

export const optimizationLayers = {
  core: {
    name: 'Core Infrastructure',
    patches: 5,
    description: 'Rebrand, region threading, executor optimization'
  },
  stability: {
    name: 'Stability & Safety',
    patches: 22,
    description: 'Plugin thread-safety, network safety, crash prevention'
  },
  performance: {
    name: 'Performance',
    patches: 18,
    description: 'Caching, memory, tick optimization, hopper/lighting/particle optimization'
  },
  crashPrevention: {
    name: 'Crash Prevention',
    patches: 10,
    description: 'Null safety, deadlock prevention, memory leak detection, error recovery'
  },
  pingOptimization: {
    name: 'Ping Optimization',
    patches: 5,
    description: 'Packet batching, chunk loading, entity updates, movement, compression'
  },
  advancedOptimization: {
    name: 'Advanced Optimization',
    patches: 10,
    description: 'Prioritization, bandwidth throttling, pooling, caching, load balancing'
  }
};

export const performanceComparison = [
  {
    metric: 'Average Ping',
    before: '80-120ms',
    after: '45-70ms',
    improvement: '-35-50ms'
  },
  {
    metric: 'Throughput',
    before: '100%',
    after: '135-150%',
    improvement: '+35-50%'
  },
  {
    metric: 'Server CPU',
    before: '100%',
    after: '75-80%',
    improvement: '-20-25%'
  },
  {
    metric: 'Memory Usage',
    before: '100%',
    after: '80-85%',
    improvement: '-15-20%'
  },
  {
    metric: 'GC Pauses',
    before: '200ms',
    after: '50ms',
    improvement: '-75%'
  },
  {
    metric: 'TPS Consistency',
    before: '95%',
    after: '99.5%+',
    improvement: '+4.5%'
  }
];

export const recommendedSettings = {
  jvmFlags: [
    '-Xmx6G -Xms6G',
    '-XX:+UseG1GC',
    '-XX:MaxGCPauseMillis=45',
    '-XX:InitiatingHeapOccupancyPercent=25',
    '-Daurora.ping.optimization=true'
  ],
  serverProperties: {
    'network-compression-threshold': '256',
    'view-distance': '10',
    'simulation-distance': '8',
    'max-players': '100'
  }
};
