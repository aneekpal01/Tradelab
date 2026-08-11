/**
 * TradeLab Community - Interactive Application Engine
 * Features:
 * - 3-Column Discord/Slack-style Layout
 * - Killer Feature: Educational Chart Analysis (Not a Trade Signal!) with Agree / Disagree peer consensus
 * - 🧵 Discord-Style Nested Discussion Threads (└── tree hierarchy)
 * - Channel Switching, Member Directory, Market Sentiment Barometer, LocalStorage Persistence.
 */

// ============================================================================
// 1. DATA DEFINITIONS & INITIAL SEED POSTS
// ============================================================================

const CHANNELS_CONFIG = {
  // COMMUNITY CATEGORY
  'welcome': {
    id: 'welcome',
    category: 'COMMUNITY',
    icon: '🏠',
    name: 'welcome',
    title: '#welcome',
    desc: 'Welcome to TradeLab! Community rules, philosophy, and getting started.'
  },
  'general': {
    id: 'general',
    category: 'COMMUNITY',
    icon: '💬',
    name: 'general',
    title: '#general',
    desc: 'General trading discussions, daily check-ins, and casual trader talk.'
  },
  'announcements': {
    id: 'announcements',
    category: 'COMMUNITY',
    icon: '📢',
    name: 'announcements',
    title: '#announcements',
    desc: 'Official platform news, feature upgrades, and educational live streams.'
  },

  // LEARNING CATEGORY
  'study-room': {
    id: 'study-room',
    category: 'LEARNING',
    icon: '📚',
    name: 'study-room',
    title: '#study-room',
    desc: 'Study notes, SMC cheat sheets, Liquidity sweeps, and chart patterns.'
  },
  'psychology': {
    id: 'psychology',
    category: 'LEARNING',
    icon: '🧠',
    name: 'psychology',
    title: '#psychology',
    desc: 'Trader mindset, 3-loss discipline rule, tilt control, and risk psychology.'
  },
  'questions': {
    id: 'questions',
    category: 'LEARNING',
    icon: '❓',
    name: 'questions',
    title: '#questions',
    desc: 'Ask anything! Get detailed answers from mentors and verified traders.'
  },

  // TRADING CATEGORY (KILLER FEATURE: CHART LAB)
  'chart-lab': {
    id: 'chart-lab',
    category: 'TRADING',
    icon: '📊',
    name: 'chart-lab',
    title: '#chart-lab',
    desc: 'TradeLab Killer Feature: Educational Chart Analysis (Not Signals!). Peer-reviewed setups with Agree/Disagree & Threads.'
  },
  'market-talk': {
    id: 'market-talk',
    category: 'TRADING',
    icon: '📈',
    name: 'market-talk',
    title: '#market-talk',
    desc: 'Daily market sentiment, macro news, CPI/FOMC, and session recaps.'
  },
  'strategy-lab': {
    id: 'strategy-lab',
    category: 'TRADING',
    icon: '💡',
    name: 'strategy-lab',
    title: '#strategy-lab',
    desc: '100-Trade backtest reports, system rules, and edge verification.'
  },

  // EVENTS CATEGORY
  'weekly-challenge': {
    id: 'weekly-challenge',
    category: 'EVENTS',
    icon: '🎯',
    name: 'weekly-challenge',
    title: '#weekly-challenge',
    desc: 'Weekly trading challenge: Post setups with 1:3+ R:R for badges!'
  }
};

const SEED_POSTS = [
  // POINT 2 & 3: KILLER FEATURE - EDUCATIONAL CHART ANALYSIS & THREAD TREE
  {
    id: 'post-btc-sweep',
    channel: 'chart-lab',
    pinned: false,
    author: {
      name: 'Aneek',
      avatar: '👤',
      avatarBg: '#0f172a',
      level: 'Level 1 Trader',
      levelClass: 'level-1'
    },
    time: '20 mins ago',
    timestamp: Date.now() - 1200000,
    content: `📊 **BTCUSDT — Possible liquidity sweep**

Taking a close look at the 15m structure. Price pushed above the London session high, took out buy-side liquidity, and formed a sharp rejection candle right into the 15m order block.`,
    tags: ['#BTCUSDT', '#15m', '#LiquiditySweep', '#SMC', '#EducationalAnalysis'],
    
    // TradeLab Differentiator: Educational Chart Analysis (Not a signal)
    isEducationalAnalysis: true,
    analysisType: 'Educational Chart Analysis',
    disclaimer: '⚠️ Educational discussion — not a trade signal.',
    analysis: {
      asset: 'BTCUSDT',
      timeframe: '15m',
      setup: 'Liquidity sweep + BOS',
      entry: '104,250',
      invalidation: '103,800',
      target: '105,200',
      rr: '1 : 2.1'
    },
    chartType: 'btc-sweep-15m',
    
    // Peer Consensus
    agreeCount: 18,
    disagreeCount: 3,
    userVote: null,

    reactions: { heart: 24, fire: 19, rocket: 15, brain: 22 },
    userReactions: {},

    // 🧵 Discord-Style Nested Discussion Tree (Point 3)
    thread: {
      rootQuestion: {
        id: 'node-root',
        author: 'Aneek',
        avatar: '👤',
        avatarBg: '#0f172a',
        level: 'Level 1 Trader',
        levelClass: 'level-1',
        time: '20m ago',
        text: 'Is this a valid liquidity sweep?'
      },
      replies: [
        {
          id: 'node-1',
          author: 'Rahul K.',
          avatar: 'RK',
          avatarBg: 'linear-gradient(135deg, #00ff9c, #10b981)',
          level: 'Level 4 Trader',
          levelClass: 'level-4',
          time: '16m ago',
          replyTo: 'Aneek',
          text: 'I think yes because the 15m candle swept the previous high liquidity pool and closed with a long wick rejection back inside the value area.'
        },
        {
          id: 'node-2',
          author: 'Priya S.',
          avatar: 'PS',
          avatarBg: 'linear-gradient(135deg, #00d4ff, #0284c7)',
          level: 'Level 2 Trader',
          levelClass: 'level-2',
          time: '12m ago',
          replyTo: 'Rahul K.',
          text: 'But HTF structure is bearish. Daily and 4H are still printing Lower Lows, so this might just be a retracement into premium pricing.'
        },
        {
          id: 'node-3',
          author: 'Arjun M.',
          avatar: 'AM',
          avatarBg: 'linear-gradient(135deg, #f59e0b, #ec4899)',
          level: 'Level 3 Trader',
          levelClass: 'level-3',
          time: '8m ago',
          replyTo: 'Priya S.',
          text: 'Look at 1H... There is a clean 1H Fair Value Gap (FVG) resting at 104,800. Price is likely attracted to that imbalance first.'
        },
        {
          id: 'node-4',
          author: 'Aneek',
          avatar: '👤',
          avatarBg: '#0f172a',
          level: 'Level 1 Trader',
          levelClass: 'level-1',
          time: '4m ago',
          replyTo: 'Arjun M.',
          text: 'Good point. I will wait for a 5m CHoCH confirmation before considering an entry to protect capital.'
        }
      ]
    }
  },

  // WELCOME POST
  {
    id: 'post-1',
    channel: 'welcome',
    pinned: true,
    author: {
      name: 'Alex Mentor',
      avatar: '👑',
      avatarBg: 'linear-gradient(135deg, #00ff9c, #00d4ff)',
      level: 'Mentor',
      levelClass: 'role-mentor'
    },
    time: '2 hours ago',
    timestamp: Date.now() - 7200000,
    content: `👋 **Welcome to the TradeLab Trading Community!**

We built this space for serious traders who want to master Price Action, Smart Money Concepts (SMC), and strict Risk Management.

📌 **Community Ground Rules:**
1. **Not Signals**: We share **Educational Chart Analysis** only — never financial advice or copy-trade calls.
2. **Always Include Invalidation**: Every analysis must have a clear invalidation level.
3. **Use Threads**: Keep discussions organized with peer reviews and nested replies.

Drop a hello in \`#general\` and tell us what you're learning today! 🚀`,
    tags: ['#Welcome', '#Rules', '#TradeLabPhilosophy'],
    isEducationalAnalysis: false,
    chartType: null,
    reactions: { heart: 32, fire: 21, rocket: 26, brain: 15 },
    userReactions: {},
    thread: {
      rootQuestion: {
        id: 'node-w1',
        author: 'Alex Mentor',
        avatar: '👑',
        avatarBg: 'linear-gradient(135deg, #00ff9c, #00d4ff)',
        level: 'Mentor',
        levelClass: 'role-mentor',
        time: '2h ago',
        text: 'Introduce yourself below and share your current trading focus!'
      },
      replies: [
        {
          id: 'node-w2',
          author: 'Aneek',
          avatar: '👤',
          avatarBg: '#0f172a',
          level: 'Level 1 Trader',
          levelClass: 'level-1',
          time: '1h ago',
          replyTo: 'Alex Mentor',
          text: 'Excited to be here! Focusing on multi-timeframe liquidity sweeps and the Risk Calculator.'
        }
      ]
    }
  },

  // GENERAL CHANNEL POST (Rahul K. Example)
  {
    id: 'post-2',
    channel: 'general',
    pinned: false,
    author: {
      name: 'Rahul K.',
      avatar: 'RK',
      avatarBg: 'linear-gradient(135deg, #00ff9c, #10b981)',
      level: 'Level 4 Trader',
      levelClass: 'level-4'
    },
    time: '45 mins ago',
    timestamp: Date.now() - 2700000,
    content: `🔥 **What are you learning today?**

I'm spending the morning reviewing 4H Order Blocks on BTC and EURUSD. Noticed that whenever we sweep London liquidity before the NY open, the rejection is almost 80% cleaner.

What asset or concept are you focusing on today?`,
    tags: ['#DailyCheckIn', '#OrderBlocks', '#Discipline'],
    isEducationalAnalysis: false,
    chartType: null,
    reactions: { heart: 18, fire: 15, rocket: 9, brain: 16 },
    userReactions: {},
    thread: {
      rootQuestion: {
        id: 'node-g1',
        author: 'Rahul K.',
        avatar: 'RK',
        avatarBg: 'linear-gradient(135deg, #00ff9c, #10b981)',
        level: 'Level 4 Trader',
        levelClass: 'level-4',
        time: '45m ago',
        text: 'What are you learning today?'
      },
      replies: [
        {
          id: 'node-g2',
          author: 'Priya S.',
          avatar: 'PS',
          avatarBg: 'linear-gradient(135deg, #00d4ff, #0284c7)',
          level: 'Level 2 Trader',
          levelClass: 'level-2',
          time: '35m ago',
          replyTo: 'Rahul K.',
          text: 'Studying the 15m ChoCH patterns after higher timeframe mitigation. Works like clockwork!'
        },
        {
          id: 'node-g3',
          author: 'Arjun M.',
          avatar: 'AM',
          avatarBg: 'linear-gradient(135deg, #f59e0b, #ec4899)',
          level: 'Level 3 Trader',
          levelClass: 'level-3',
          time: '20m ago',
          replyTo: 'Priya S.',
          text: 'Backtesting the 20/50 EMA strategy on 15m charts in the Strategy Lab.'
        }
      ]
    }
  },

  // STUDY ROOM POST (SMC Cheat Sheet)
  {
    id: 'post-3',
    channel: 'study-room',
    pinned: false,
    author: {
      name: 'Vikram S.',
      avatar: 'VS',
      avatarBg: 'linear-gradient(135deg, #f59e0b, #ef4444)',
      level: 'Level 5 Trader',
      levelClass: 'level-5'
    },
    time: '3 hours ago',
    timestamp: Date.now() - 10800000,
    content: `📚 **SMC Masterclass Note: Liquidity Sweep vs. Valid Break of Structure (BOS)**

Many beginners get trapped confusing a sweep with a trend continuation.

🔑 **How to identify:**
1. **Wick Sweep:** Only candle wicks push past the swing point and close back inside. This is institutional liquidity harvesting.
2. **Valid BOS:** Strong full body candle close beyond the key swing high/low with expansion volume.
3. **Action:** Never enter on the breakout candle itself. Always wait for the mitigation pullback into the newly created Order Block.`,
    tags: ['#StudyNotes', '#SMC', '#Liquidity', '#BreakOfStructure'],
    isEducationalAnalysis: false,
    chartType: 'smc-diagram',
    reactions: { heart: 38, fire: 29, rocket: 22, brain: 45 },
    userReactions: {},
    thread: {
      rootQuestion: {
        id: 'node-s1',
        author: 'Vikram S.',
        avatar: 'VS',
        avatarBg: 'linear-gradient(135deg, #f59e0b, #ef4444)',
        level: 'Level 5 Trader',
        levelClass: 'level-5',
        time: '3h ago',
        text: 'Do you wait for candle close or enter on limit orders at Order Blocks?'
      },
      replies: [
        {
          id: 'node-s2',
          author: 'Alex Mentor',
          avatar: '👑',
          avatarBg: 'linear-gradient(135deg, #00ff9c, #00d4ff)',
          level: 'Mentor',
          levelClass: 'role-mentor',
          time: '2h ago',
          replyTo: 'Vikram S.',
          text: 'Always recommend waiting for LTF confirmation (1m/5m ChoCH) inside the HTF Order Block to reduce stop loss distance.'
        }
      ]
    }
  },

  // PSYCHOLOGY POST (Sarah Lin)
  {
    id: 'post-4',
    channel: 'psychology',
    pinned: false,
    author: {
      name: 'Sarah Lin',
      avatar: 'SL',
      avatarBg: 'linear-gradient(135deg, #a855f7, #ec4899)',
      level: 'Mentor',
      levelClass: 'role-mentor'
    },
    time: '5 hours ago',
    timestamp: Date.now() - 18000000,
    content: `🧠 **The 3-Loss Rule: How to completely eliminate Revenge Trading**

When you take 2-3 consecutive losses in a single day, your brain enters fight-or-flight mode. You stop trading the chart and start trading your P&L.

💡 **My strict rule:**
• Maximum 2 losses per session.
• If hit, force close TradingView and step away for at least 3 hours.
• Do not look at the market until the next morning session.

Protecting your mental capital is 10x more important than protecting a single day's profit. Agree?`,
    tags: ['#TradingPsychology', '#Discipline', '#RiskFirst', '#Mindset'],
    isEducationalAnalysis: false,
    chartType: null,
    reactions: { heart: 52, fire: 34, rocket: 18, brain: 41 },
    userReactions: {},
    thread: {
      rootQuestion: {
        id: 'node-p1',
        author: 'Sarah Lin',
        avatar: 'SL',
        avatarBg: 'linear-gradient(135deg, #a855f7, #ec4899)',
        level: 'Mentor',
        levelClass: 'role-mentor',
        time: '5h ago',
        text: 'What is your personal rule when you hit your daily max loss?'
      },
      replies: [
        {
          id: 'node-p2',
          author: 'Arjun M.',
          avatar: 'AM',
          avatarBg: 'linear-gradient(135deg, #f59e0b, #ec4899)',
          level: 'Level 3 Trader',
          levelClass: 'level-3',
          time: '4h ago',
          replyTo: 'Sarah Lin',
          text: 'I log the mistakes into my trading journal immediately and go for a walk. Helps reset the dopamine level.'
        }
      ]
    }
  },

  // STRATEGY LAB POST
  {
    id: 'post-5',
    channel: 'strategy-lab',
    pinned: false,
    author: {
      name: 'Dev P.',
      avatar: 'DP',
      avatarBg: 'linear-gradient(135deg, #00d4ff, #6366f1)',
      level: 'Level 3 Trader',
      levelClass: 'level-3'
    },
    time: '6 hours ago',
    timestamp: Date.now() - 21600000,
    content: `💡 **100-Trade Backtest Results: 15m EMA Pullback + Pinbar Rejection**

Ran a full backtest using the TradeLab Backtesting module on NIFTY & EURUSD across 6 months of historical data.

📊 **Key Metrics:**
• Total Trades: 100
• Win Rate: **63.0%** (63 Wins / 37 Losses)
• Average R:R: **1 : 2.3**
• Max Drawdown: **4.8%**
• Profit Factor: **2.65**`,
    tags: ['#Backtest', '#StrategyLab', '#WinRate', '#EdgeVerified'],
    isEducationalAnalysis: false,
    chartType: null,
    reactions: { heart: 31, fire: 24, rocket: 28, brain: 19 },
    userReactions: {},
    thread: null
  },

  // WEEKLY CHALLENGE POST
  {
    id: 'post-6',
    channel: 'weekly-challenge',
    pinned: true,
    author: {
      name: 'TradeLab Bot',
      avatar: '🤖',
      avatarBg: 'linear-gradient(135deg, #a855f7, #6366f1)',
      level: 'Bot / Event',
      levelClass: 'level-4'
    },
    time: '1 day ago',
    timestamp: Date.now() - 86400000,
    content: `🎯 **Weekly Challenge #12: Spot a 1:3 R:R SMC Trade Setup**

🏆 **The Goal:**
Post an **Educational Chart Analysis** in \`#chart-lab\` with:
1. Clear Higher Timeframe Context (4H/1H)
2. Valid Liquidity Sweep or Order Block
3. Minimum 1:3 Risk to Reward Ratio with precise Invalidation level.

Top 3 most agreed-upon analyses will receive the **TradeLab Pro Master Badge**! 🌟`,
    tags: ['#WeeklyChallenge', '#TradingContest', '#RiskRewardChallenge'],
    isEducationalAnalysis: false,
    chartType: null,
    reactions: { heart: 35, fire: 44, rocket: 39, brain: 14 },
    userReactions: {},
    thread: null
  }
];

const COMMUNITY_MEMBERS = [
  {
    name: 'Alex Mentor',
    role: 'Mentor & Moderator',
    level: 'Mentor',
    avatar: '👑',
    avatarBg: 'linear-gradient(135deg, #00ff9c, #00d4ff)',
    status: 'online',
    statusText: '🟢 Online',
    winRate: '74%',
    tradesCount: '1,420+',
    bio: 'Chief Mentor at TradeLab. SMC price action & institutional order flow specialist. Advocate of strict risk management.',
    badge: '⭐ Pro Mentor'
  },
  {
    name: 'Sarah Lin',
    role: 'Psychology Mentor',
    level: 'Mentor',
    avatar: 'SL',
    avatarBg: 'linear-gradient(135deg, #a855f7, #ec4899)',
    status: 'online',
    statusText: '🟢 Online',
    winRate: '68%',
    tradesCount: '890+',
    bio: 'Specialist in trading psychology, emotional regulation, and funded account risk controls.',
    badge: '🧠 Mentor'
  },
  {
    name: 'Rahul K.',
    role: 'Level 4 Trader',
    level: 'Level 4',
    avatar: 'RK',
    avatarBg: 'linear-gradient(135deg, #00ff9c, #10b981)',
    status: 'in-trade',
    statusText: '🟡 In a Trade',
    winRate: '66%',
    tradesCount: '480+',
    bio: 'Crypto & Forex swing trader. 1:3 R:R fanatic. Day 48 streak on TradeLab.',
    badge: '🏆 Level 4'
  },
  {
    name: 'Vikram S.',
    role: 'Level 5 Trader',
    level: 'Level 5',
    avatar: 'VS',
    avatarBg: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    status: 'online',
    statusText: '🟢 Online',
    winRate: '71%',
    tradesCount: '620+',
    bio: 'Indices & SMC specialist. Backtesting master. 100% disciplined execution.',
    badge: '🔥 Level 5'
  },
  {
    name: 'Arjun M.',
    role: 'Level 3 Trader',
    level: 'Level 3',
    avatar: 'AM',
    avatarBg: 'linear-gradient(135deg, #f59e0b, #ec4899)',
    status: 'online',
    statusText: '🟢 Online',
    winRate: '61%',
    tradesCount: '240+',
    bio: 'Fair Value Gap (FVG) and liquidity sweep researcher on 15m and 1H timeframes.',
    badge: '⚡ Level 3'
  },
  {
    name: 'Dev P.',
    role: 'Level 3 Trader',
    level: 'Level 3',
    avatar: 'DP',
    avatarBg: 'linear-gradient(135deg, #00d4ff, #6366f1)',
    status: 'studying',
    statusText: '🟣 In Study Room',
    winRate: '59%',
    tradesCount: '210+',
    bio: 'Quantitative backtester & price action learner. Masterclass enthusiast.',
    badge: '⚡ Level 3'
  },
  {
    name: 'Priya S.',
    role: 'Level 2 Trader',
    level: 'Level 2',
    avatar: 'PS',
    avatarBg: 'linear-gradient(135deg, #00d4ff, #0284c7)',
    status: 'online',
    statusText: '🟢 Online',
    winRate: '54%',
    tradesCount: '130+',
    bio: 'Crypto price action enthusiast. Learning Order Blocks and liquidity sweeps.',
    badge: '🚀 Level 2'
  },
  {
    name: 'Aneek',
    role: 'Level 1 Trader (You)',
    level: 'Level 1',
    avatar: '👤',
    avatarBg: '#0f172a',
    status: 'online',
    statusText: '🟢 Online',
    winRate: '52%',
    tradesCount: '45',
    bio: 'TradeLab learner exploring Candlestick patterns, SMC, and Risk Calculator.',
    badge: '🌱 Level 1'
  }
];

// ============================================================================
// 2. STATE MANAGER & LOCALSTORAGE PERSISTENCE
// ============================================================================

class CommunityStore {
  constructor() {
    this.currentChannel = 'general';
    this.currentFilter = 'all';
    this.currentSort = 'hot';
    this.searchQuery = '';
    this.posts = [];
    this.savedPostIds = new Set();
    this.sentimentData = { bullish: 64, bearish: 36, userVote: null };
    this.activeReplyTo = null; // for nested thread composer
    this.loadState();
  }

  loadState() {
    const storedPosts = localStorage.getItem('tradelab_community_posts_v2');
    if (storedPosts) {
      try {
        this.posts = JSON.parse(storedPosts);
      } catch (e) {
        this.posts = [...SEED_POSTS];
      }
    } else {
      this.posts = [...SEED_POSTS];
      this.savePosts();
    }

    const storedSaved = localStorage.getItem('tradelab_saved_posts');
    if (storedSaved) {
      try {
        this.savedPostIds = new Set(JSON.parse(storedSaved));
      } catch (e) {
        this.savedPostIds = new Set();
      }
    }

    const storedSentiment = localStorage.getItem('tradelab_sentiment');
    if (storedSentiment) {
      try {
        this.sentimentData = JSON.parse(storedSentiment);
      } catch (e) {}
    }
  }

  savePosts() {
    localStorage.setItem('tradelab_community_posts_v2', JSON.stringify(this.posts));
  }

  saveSavedPosts() {
    localStorage.setItem('tradelab_saved_posts', JSON.stringify(Array.from(this.savedPostIds)));
  }

  saveSentiment() {
    localStorage.setItem('tradelab_sentiment', JSON.stringify(this.sentimentData));
  }

  getUserProfile() {
    const savedName = localStorage.getItem('profileName') || localStorage.getItem('tradelab_username') || 'Aneek';
    const savedStreak = localStorage.getItem('tradelab_streak') || '2';
    return {
      name: savedName,
      level: 'Level 1 Trader',
      levelClass: 'level-1',
      avatar: '👤',
      streak: savedStreak
    };
  }

  addPost(post) {
    this.posts.unshift(post);
    this.savePosts();
  }

  toggleReaction(postId, type) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    if (!post.reactions) post.reactions = { heart: 0, fire: 0, rocket: 0, brain: 0 };
    if (!post.userReactions) post.userReactions = {};

    const currentlyReacted = post.userReactions[type];
    if (currentlyReacted) {
      post.reactions[type] = Math.max(0, (post.reactions[type] || 1) - 1);
      delete post.userReactions[type];
    } else {
      post.reactions[type] = (post.reactions[type] || 0) + 1;
      post.userReactions[type] = true;
    }

    this.savePosts();
  }

  votePeerAnalysis(postId, voteType) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    if (post.userVote === voteType) {
      // Toggle off
      if (voteType === 'agree') post.agreeCount = Math.max(0, (post.agreeCount || 1) - 1);
      if (voteType === 'disagree') post.disagreeCount = Math.max(0, (post.disagreeCount || 1) - 1);
      post.userVote = null;
    } else {
      if (post.userVote === 'agree') post.agreeCount = Math.max(0, (post.agreeCount || 1) - 1);
      if (post.userVote === 'disagree') post.disagreeCount = Math.max(0, (post.disagreeCount || 1) - 1);

      if (voteType === 'agree') post.agreeCount = (post.agreeCount || 0) + 1;
      if (voteType === 'disagree') post.disagreeCount = (post.disagreeCount || 0) + 1;
      post.userVote = voteType;
    }

    this.savePosts();
  }

  addThreadReply(postId, replyText, replyToUser) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    const user = this.getUserProfile();

    if (!post.thread) {
      post.thread = {
        rootQuestion: {
          id: 'node-root-' + Date.now(),
          author: post.author.name,
          avatar: post.author.avatar,
          avatarBg: post.author.avatarBg || '#0f172a',
          level: post.author.level,
          levelClass: post.author.levelClass,
          time: 'Initial Analysis',
          text: post.content.substring(0, 80) + '...'
        },
        replies: []
      };
    }

    const newReply = {
      id: 'node-' + Date.now(),
      author: user.name,
      avatar: user.avatar,
      avatarBg: '#0f172a',
      level: user.level,
      levelClass: user.levelClass,
      time: 'Just now',
      replyTo: replyToUser || post.author.name,
      text: replyText
    };

    post.thread.replies.push(newReply);
    this.savePosts();
    return newReply;
  }

  toggleSavePost(postId) {
    if (this.savedPostIds.has(postId)) {
      this.savedPostIds.delete(postId);
    } else {
      this.savedPostIds.add(postId);
    }
    this.saveSavedPosts();
  }

  voteSentiment(type) {
    if (this.sentimentData.userVote === type) return;
    if (type === 'bull') {
      this.sentimentData.bullish += 1;
      if (this.sentimentData.userVote === 'bear') this.sentimentData.bearish -= 1;
    } else {
      this.sentimentData.bearish += 1;
      if (this.sentimentData.userVote === 'bull') this.sentimentData.bullish -= 1;
    }
    this.sentimentData.userVote = type;
    this.saveSentiment();
  }
}

// Global Store Instance
const store = new CommunityStore();

// ============================================================================
// 3. UI CONTROLLER & RENDERING ENGINE
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initUserProfile();
  renderChannelList();
  renderFeed();
  renderMembersList();
  renderSentimentBarometer();
  initEventListeners();
  initSetupBuilderPreview();
});

function initUserProfile() {
  const user = store.getUserProfile();
  const topUserName = document.getElementById('topUserName');
  const topUserLevel = document.getElementById('topUserLevel');
  const userVoiceStreak = document.getElementById('userVoiceStreak');

  if (topUserName) topUserName.textContent = user.name;
  if (topUserLevel) topUserLevel.textContent = user.level;
  if (userVoiceStreak) userVoiceStreak.textContent = `🔥 Day ${user.streak} Streak`;
}

function renderChannelList() {
  const container = document.getElementById('channelsContainer');
  if (!container) return;

  const categories = ['COMMUNITY', 'LEARNING', 'TRADING', 'EVENTS'];
  let html = '';

  categories.forEach(cat => {
    const catChannels = Object.values(CHANNELS_CONFIG).filter(ch => ch.category === cat);
    if (catChannels.length === 0) return;

    html += `
      <div class="channel-category">
        <div class="category-title">
          <span>${cat}</span>
          <span class="category-badge">${catChannels.length}</span>
        </div>
        <ul class="channel-list">
          ${catChannels.map(ch => {
            const isActive = ch.id === store.currentChannel;
            const channelPostsCount = store.posts.filter(p => p.channel === ch.id).length;
            const isKillerFeature = ch.id === 'chart-lab';
            return `
              <li>
                <a href="javascript:void(0)" class="channel-item ${isActive ? 'active' : ''}" onclick="switchChannel('${ch.id}')" id="channel-nav-${ch.id}">
                  <div class="channel-left">
                    <span class="channel-icon">${ch.icon}</span>
                    <span class="channel-hash">#</span>
                    <span>${ch.name}</span>
                    ${isKillerFeature ? `<span style="font-size: 9px; font-weight: 800; background: linear-gradient(135deg, #00ff9c, #00d4ff); color: #000; padding: 1px 5px; border-radius: 4px; margin-left: 4px;">CORE</span>` : ''}
                  </div>
                  ${channelPostsCount > 0 ? `<span class="channel-unread-pill">${channelPostsCount}</span>` : ''}
                </a>
              </li>
            `;
          }).join('')}
        </ul>
      </div>
    `;
  });

  container.innerHTML = html;
}

function switchChannel(channelId) {
  if (!CHANNELS_CONFIG[channelId]) return;
  store.currentChannel = channelId;
  store.currentFilter = 'all';
  store.searchQuery = '';

  const searchInput = document.getElementById('headerSearchInput');
  if (searchInput) searchInput.value = '';

  closeMobileDrawers();
  renderChannelList();
  renderFeedHeader();
  renderFeed();
}

function renderFeedHeader() {
  const ch = CHANNELS_CONFIG[store.currentChannel] || CHANNELS_CONFIG['general'];
  const titleEl = document.getElementById('feedChannelTitle');
  const descEl = document.getElementById('feedChannelDesc');
  const activeCountEl = document.getElementById('feedOnlineCount');

  if (titleEl) titleEl.innerHTML = `${ch.icon} <span class="hash">#</span> ${ch.name}`;
  if (descEl) descEl.textContent = ch.desc;
  if (activeCountEl) {
    const randomOnline = 120 + Math.floor(Math.random() * 45);
    activeCountEl.textContent = `${randomOnline} online`;
  }
}

function renderFeed() {
  renderFeedHeader();
  const postsListContainer = document.getElementById('postsList');
  if (!postsListContainer) return;

  let filtered = store.posts.filter(p => {
    if (store.currentChannel !== 'all' && p.channel !== store.currentChannel) {
      return false;
    }

    if (store.currentFilter === 'setups' && !p.isEducationalAnalysis && !p.analysis) return false;
    if (store.currentFilter === 'discussions' && (p.isEducationalAnalysis || p.tags.some(t => t.toLowerCase().includes('question')))) return false;
    if (store.currentFilter === 'questions' && !p.tags.some(t => t.toLowerCase().includes('question')) && !p.content.includes('?')) return false;
    if (store.currentFilter === 'saved' && !store.savedPostIds.has(p.id)) return false;

    if (store.searchQuery.trim() !== '') {
      const q = store.searchQuery.toLowerCase();
      const contentMatch = p.content.toLowerCase().includes(q);
      const authorMatch = p.author.name.toLowerCase().includes(q);
      const tagMatch = p.tags.some(t => t.toLowerCase().includes(q));
      const assetMatch = p.analysis && p.analysis.asset.toLowerCase().includes(q);
      if (!contentMatch && !authorMatch && !tagMatch && !assetMatch) return false;
    }

    return true;
  });

  // Sort
  if (store.currentSort === 'new') {
    filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
  } else if (store.currentSort === 'top') {
    filtered.sort((a, b) => {
      const reactionsA = Object.values(a.reactions || {}).reduce((sum, n) => sum + n, 0) + (a.agreeCount || 0);
      const reactionsB = Object.values(b.reactions || {}).reduce((sum, n) => sum + n, 0) + (b.agreeCount || 0);
      return reactionsB - reactionsA;
    });
  } else {
    // Hot
    filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return (b.timestamp || 0) - (a.timestamp || 0);
    });
  }

  if (filtered.length === 0) {
    postsListContainer.innerHTML = `
      <div style="text-align: center; padding: 60px 20px; color: var(--text-muted); background: var(--bg-card); border-radius: var(--radius-md); border: 1px dashed var(--border-subtle);">
        <div style="font-size: 38px; margin-bottom: 12px;">💬</div>
        <h4 style="color: var(--text-primary); font-size: 16px; margin-bottom: 6px;">No posts in this view yet</h4>
        <p style="font-size: 13px; max-width: 380px; margin: 0 auto 18px auto;">Be the first trader to share an Educational Chart Analysis, study note, or question!</p>
        <button class="btn-modal-submit" onclick="openCreatePostModal()">+ Create Post</button>
      </div>
    `;
    return;
  }

  postsListContainer.innerHTML = filtered.map(post => renderPostCardHtml(post)).join('');

  // Render Charts on canvas
  filtered.forEach(post => {
    if (post.chartType) {
      drawCandleChart(post.id, post.chartType, post.analysis);
    }
  });
}

// Generate Post Card HTML
function renderPostCardHtml(post) {
  const isSaved = store.savedPostIds.has(post.id);
  const threadRepliesCount = post.thread && post.thread.replies ? post.thread.replies.length : 0;

  return `
    <article class="post-card ${post.pinned ? 'pinned' : ''}" id="post-${post.id}">
      ${post.pinned ? `
        <div class="pin-indicator">
          <span>📌</span> <span>Pinned Announcement</span>
        </div>
      ` : ''}

      <div class="post-header">
        <div class="post-author-wrap">
          <div class="author-avatar" style="background: ${post.author.avatarBg || '#1e293b'};">
            ${post.author.avatar}
          </div>
          <div class="author-meta">
            <div class="author-name-row">
              <span class="author-name" onclick="openMemberModal('${post.author.name}')">${post.author.name}</span>
              <span class="trader-level-tag ${post.author.levelClass || 'level-1'}">${post.author.level}</span>
            </div>
            <span class="post-timestamp">${post.time || 'Recently'}</span>
          </div>
        </div>
        <a href="javascript:void(0)" class="post-channel-tag" onclick="switchChannel('${post.channel}')">#${post.channel}</a>
      </div>

      <div class="post-content">
        ${formatPostText(post.content)}
      </div>

      <!-- POINT 2: KILLER FEATURE - EDUCATIONAL CHART ANALYSIS CARD (NOT A SIGNAL) -->
      ${post.analysis ? renderEducationalAnalysisCardHtml(post) : ''}

      <!-- Chart Preview Canvas -->
      ${post.chartType ? `
        <div class="chart-preview-box">
          <span class="chart-overlay-label">${post.analysis ? post.analysis.asset + ' • ' + post.analysis.timeframe : 'Price Action Breakdown'} • 📷 Chart Analysis</span>
          <canvas id="chart-canvas-${post.id}" class="chart-canvas" width="600" height="220"></canvas>
        </div>
      ` : ''}

      ${post.tags && post.tags.length > 0 ? `
        <div class="post-tags-list">
          ${post.tags.map(t => `<span class="post-tag" onclick="filterByTag('${t}')">${t}</span>`).join('')}
        </div>
      ` : ''}

      <!-- Post Reactions & Thread Footer -->
      <div class="post-actions-footer">
        <div class="reactions-group">
          <button class="reaction-btn ${post.userReactions && post.userReactions.heart ? 'reacted' : ''}" onclick="handleReaction('${post.id}', 'heart')">
            <span>❤️</span> <span>${post.reactions ? post.reactions.heart || 0 : 0}</span>
          </button>
          <button class="reaction-btn ${post.userReactions && post.userReactions.fire ? 'reacted' : ''}" onclick="handleReaction('${post.id}', 'fire')">
            <span>🔥</span> <span>${post.reactions ? post.reactions.fire || 0 : 0}</span>
          </button>
          <button class="reaction-btn ${post.userReactions && post.userReactions.rocket ? 'reacted' : ''}" onclick="handleReaction('${post.id}', 'rocket')">
            <span>🚀</span> <span>${post.reactions ? post.reactions.rocket || 0 : 0}</span>
          </button>
          <button class="reaction-btn ${post.userReactions && post.userReactions.brain ? 'reacted' : ''}" onclick="handleReaction('${post.id}', 'brain')">
            <span>🧠</span> <span>${post.reactions ? post.reactions.brain || 0 : 0}</span>
          </button>
        </div>

        <div class="post-action-buttons">
          <button class="action-text-btn" onclick="toggleThread('${post.id}')">
            <span>🧵</span> <span>${threadRepliesCount} ${threadRepliesCount === 1 ? 'Thread Reply' : 'Thread Replies'}</span>
          </button>
          <button class="action-text-btn" onclick="sharePost('${post.id}')">
            <span>↗</span> <span>Share</span>
          </button>
          <button class="action-text-btn ${isSaved ? 'saved' : ''}" onclick="handleSavePost('${post.id}')" title="Save post">
            <span>${isSaved ? '★ Saved' : '☆ Save'}</span>
          </button>
        </div>
      </div>

      <!-- POINT 3: DISCORD-STYLE NESTED THREAD TREE (└──) -->
      <div class="discord-thread-wrapper ${post.id === 'post-btc-sweep' ? 'open' : ''}" id="thread-${post.id}">
        <div class="thread-top-banner">
          <div class="thread-title-pill">
            <span>🧵</span> <span>Discussion Thread (${threadRepliesCount + 1} messages)</span>
          </div>
          <span style="font-size: 11px; color: var(--text-muted);">TradeLab Peer Review</span>
        </div>

        <div class="thread-nodes-container" id="thread-nodes-${post.id}">
          ${renderThreadTreeHtml(post)}
        </div>

        <!-- Nested Thread Composer Input -->
        <div class="thread-composer-box">
          <input 
            type="text" 
            class="thread-input" 
            id="thread-input-${post.id}" 
            placeholder="Reply to thread or mention @Rahul, @Priya, @Aneek..."
            onkeydown="if(event.key==='Enter') submitThreadReply('${post.id}')"
          >
          <button class="thread-send-btn" onclick="submitThreadReply('${post.id}')">Reply ↗</button>
        </div>
      </div>
    </article>
  `;
}

// Render Point 2: Educational Chart Analysis Card (NOT A SIGNAL)
function renderEducationalAnalysisCardHtml(post) {
  const an = post.analysis;
  const agree = post.agreeCount || 0;
  const disagree = post.disagreeCount || 0;
  const total = agree + disagree;
  const agreePct = total > 0 ? Math.round((agree / total) * 100) : 85;

  return `
    <div class="educational-analysis-card">
      <div class="analysis-header-row">
        <div class="analysis-type-badge">
          <span>📘</span> <span>Educational Chart Analysis</span>
        </div>
        <div class="analysis-disclaimer-pill">
          <span>⚠️</span> <span>Educational discussion — not a trade signal.</span>
        </div>
      </div>

      <!-- Analysis Metrics Grid -->
      <div class="analysis-details-grid">
        <div class="analysis-item">
          <span class="analysis-label">Asset / Pair</span>
          <span class="analysis-val">${an.asset}</span>
        </div>
        <div class="analysis-item">
          <span class="analysis-label">Timeframe</span>
          <span class="analysis-val timeframe">${an.timeframe}</span>
        </div>
        <div class="analysis-item">
          <span class="analysis-label">Setup Model</span>
          <span class="analysis-val setup">${an.setup}</span>
        </div>
        <div class="analysis-item">
          <span class="analysis-label">Entry</span>
          <span class="analysis-val entry">${an.entry}</span>
        </div>
        <div class="analysis-item">
          <span class="analysis-label">Invalidation</span>
          <span class="analysis-val invalidation">${an.invalidation}</span>
        </div>
        <div class="analysis-item">
          <span class="analysis-label">Target</span>
          <span class="analysis-val target">${an.target}</span>
        </div>
      </div>

      <!-- Peer Consensus Agree / Disagree / Discuss Section -->
      <div class="peer-consensus-section">
        <div class="consensus-stats-header">
          <span style="color: var(--text-secondary);">Trader Consensus</span>
          <span style="color: var(--accent-green);">${agreePct}% Agree (${agree}/${total || 1} Traders)</span>
        </div>
        
        <div class="consensus-track">
          <div class="consensus-fill" style="width: ${agreePct}%;"></div>
        </div>

        <div class="agree-disagree-btns">
          <button class="btn-peer-vote agree ${post.userVote === 'agree' ? 'active' : ''}" onclick="handlePeerVote('${post.id}', 'agree')">
            <span>👍</span> <span>Agree (${agree})</span>
          </button>
          <button class="btn-peer-vote disagree ${post.userVote === 'disagree' ? 'active' : ''}" onclick="handlePeerVote('${post.id}', 'disagree')">
            <span>👎</span> <span>Disagree (${disagree})</span>
          </button>
          <button class="btn-peer-discuss" onclick="toggleThread('${post.id}')">
            <span>💬</span> <span>Discuss</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Render Point 3: Discord-Style Nested Thread Tree
function renderThreadTreeHtml(post) {
  if (!post.thread) {
    return `
      <div style="font-size: 12.5px; color: var(--text-muted); padding: 8px;">No discussion in this thread yet. Start the conversation!</div>
    `;
  }

  const root = post.thread.rootQuestion;
  const replies = post.thread.replies || [];

  let html = '';

  // 1. Root Question Node
  if (root) {
    html += `
      <div class="thread-root-node">
        <div class="thread-node-avatar" style="background: ${root.avatarBg || '#1e293b'};">${root.avatar}</div>
        <div class="thread-node-content">
          <div class="thread-node-header">
            <span class="thread-author-name" onclick="openMemberModal('${root.author}')">${root.author}</span>
            <span class="trader-level-tag ${root.levelClass || 'level-1'}">${root.level || 'Trader'}</span>
            <span class="thread-time-label">${root.time || 'Recently'}</span>
          </div>
          <div class="thread-text-body">"${formatPostText(root.text)}"</div>
        </div>
      </div>
    `;
  }

  // 2. Branch Tree Nodes (└──)
  replies.forEach(reply => {
    html += `
      <div class="thread-branch-node">
        <div class="thread-node-avatar" style="background: ${reply.avatarBg || '#1e293b'};">${reply.avatar}</div>
        <div class="thread-node-content">
          <div class="thread-node-header">
            <span class="thread-author-name" onclick="openMemberModal('${reply.author}')">${reply.author}</span>
            ${reply.replyTo ? `<span class="reply-mention-tag">↳ @${reply.replyTo}</span>` : ''}
            <span class="trader-level-tag ${reply.levelClass || 'level-1'}">${reply.level || 'Trader'}</span>
            <span class="thread-time-label">${reply.time || 'Recently'}</span>
          </div>
          <div class="thread-text-body">${formatPostText(reply.text)}</div>
          <button class="thread-reply-btn" onclick="presetThreadReply('${post.id}', '${reply.author}')">↳ Reply to ${reply.author}</button>
        </div>
      </div>
    `;
  });

  return html;
}

// Format Markdown Bold / Code
function formatPostText(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.*?)`/g, '<code style="background: rgba(255,255,255,0.08); padding: 2px 6px; border-radius: 4px; color: var(--accent-green); font-family: monospace; font-size: 12px;">$1</code>')
    .replace(/\n/g, '<br>');
}

// Draw Canvas Candlestick Chart Simulation
function drawCandleChart(postId, chartType, analysis) {
  const canvas = document.getElementById(`chart-canvas-${postId}`);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  // Clear background
  ctx.fillStyle = '#080c11';
  ctx.fillRect(0, 0, w, h);

  // Draw Grid Lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1;
  for (let x = 40; x < w; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 30; y < h; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Draw Liquidity Sweep shaded zone at top
  ctx.fillStyle = 'rgba(255, 183, 0, 0.08)';
  ctx.fillRect(60, 20, 500, 35);
  ctx.strokeStyle = 'rgba(255, 183, 0, 0.4)';
  ctx.setLineDash([3, 3]);
  ctx.strokeRect(60, 20, 500, 35);
  ctx.setLineDash([]);

  ctx.fillStyle = '#ffb700';
  ctx.font = '10px Inter, sans-serif';
  ctx.fillText('⚡ Buy-Side Liquidity Pool Sweep (Previous Asian High)', 70, 42);

  // Draw Demand / Order Block zone at bottom
  ctx.fillStyle = 'rgba(0, 255, 156, 0.08)';
  ctx.fillRect(180, 130, 380, 45);
  ctx.strokeStyle = 'rgba(0, 255, 156, 0.3)';
  ctx.strokeRect(180, 130, 380, 45);

  ctx.fillStyle = '#00ff9c';
  ctx.fillText('15m Demand Zone / Order Block Mitigation', 190, 158);

  // Generate Candlesticks
  const candleCount = 22;
  const spacing = (w - 60) / candleCount;
  let prevClose = 110;

  for (let i = 0; i < candleCount; i++) {
    const x = 30 + i * spacing;
    // Sweep candle at index 14
    let isBull = i < 14 ? (i % 2 === 0) : (i % 3 !== 0);
    if (i === 14) isBull = false; // rejection pinbar

    const bodyHeight = (i === 14) ? 8 : (10 + Math.floor(Math.sin(i) * 12) + (i > 15 ? 10 : 0));
    const open = prevClose;
    const close = isBull ? open - bodyHeight : open + bodyHeight;
    
    // High wick sweep on candle 14
    const high = (i === 14) ? 22 : Math.min(open, close) - (4 + Math.random() * 8);
    const low = Math.max(open, close) + (5 + Math.random() * 8);
    prevClose = close;

    const candleColor = isBull ? '#00ff9c' : '#ff4d4d';

    // Wick
    ctx.strokeStyle = candleColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, Math.max(15, high));
    ctx.lineTo(x, Math.min(h - 15, low));
    ctx.stroke();

    // Body
    ctx.fillStyle = candleColor;
    const top = Math.min(open, close);
    const height = Math.max(4, Math.abs(close - open));
    ctx.fillRect(x - 5, top, 10, height);
  }

  // Draw Invalidation & Target Lines
  if (analysis) {
    // Target Line (Green)
    ctx.strokeStyle = '#00ff9c';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(320, 70);
    ctx.lineTo(w - 20, 70);
    ctx.stroke();
    ctx.fillStyle = '#00ff9c';
    ctx.fillText(`Target: ${analysis.target}`, w - 100, 65);

    // Invalidation Line (Red)
    ctx.strokeStyle = '#ff4d4d';
    ctx.beginPath();
    ctx.moveTo(320, 185);
    ctx.lineTo(w - 20, 185);
    ctx.stroke();
    ctx.fillStyle = '#ff4d4d';
    ctx.fillText(`Invalidation: ${analysis.invalidation}`, w - 130, 180);

    ctx.setLineDash([]);
  }
}

// ============================================================================
// 4. INTERACTION HANDLERS (Reactions, Peer Votes, Threads)
// ============================================================================

function handleReaction(postId, type) {
  store.toggleReaction(postId, type);
  renderFeed();
}

function handlePeerVote(postId, voteType) {
  store.votePeerAnalysis(postId, voteType);
  renderFeed();
  showToast(voteType === 'agree' ? 'Marked as Agreed! 👍 Peer consensus updated.' : 'Marked as Disagreed! 👎 Discussion encouraged.');
}

function toggleThread(postId) {
  const thread = document.getElementById(`thread-${postId}`);
  if (thread) {
    thread.classList.toggle('open');
    if (thread.classList.contains('open')) {
      const input = document.getElementById(`thread-input-${postId}`);
      if (input) input.focus();
    }
  }
}

function presetThreadReply(postId, authorName) {
  const input = document.getElementById(`thread-input-${postId}`);
  if (input) {
    input.value = `@${authorName} `;
    input.focus();
  }
}

function submitThreadReply(postId) {
  const input = document.getElementById(`thread-input-${postId}`);
  if (!input || input.value.trim() === '') return;

  const text = input.value.trim();
  let replyToUser = null;
  if (text.startsWith('@')) {
    const spaceIdx = text.indexOf(' ');
    if (spaceIdx > 0) {
      replyToUser = text.substring(1, spaceIdx);
    }
  }

  store.addThreadReply(postId, text, replyToUser);
  input.value = '';
  renderFeed();

  // Ensure thread remains open
  const thread = document.getElementById(`thread-${postId}`);
  if (thread) thread.classList.add('open');

  showToast('Reply added to thread tree! 🧵');
}

function handleSavePost(postId) {
  store.toggleSavePost(postId);
  renderFeed();
  const isSaved = store.savedPostIds.has(postId);
  showToast(isSaved ? 'Analysis bookmarked to Saved! ⭐' : 'Post removed from Saved.');
}

function sharePost(postId) {
  const postUrl = window.location.origin + window.location.pathname + `#post-${postId}`;
  navigator.clipboard.writeText(postUrl).then(() => {
    showToast('Analysis link copied to clipboard! 📋');
  }).catch(() => {
    showToast('Analysis link shared! 📋');
  });
}

function filterByTag(tag) {
  const searchInput = document.getElementById('headerSearchInput');
  if (searchInput) {
    searchInput.value = tag;
    store.searchQuery = tag;
    renderFeed();
  }
}

function setFeedFilter(filterType, element) {
  store.currentFilter = filterType;
  document.querySelectorAll('.filter-pill').forEach(el => el.classList.remove('active'));
  if (element) element.classList.add('active');
  renderFeed();
}

function handleSortChange(sortType) {
  store.currentSort = sortType;
  renderFeed();
}

function handleSearch(query) {
  store.searchQuery = query;
  renderFeed();
}

// ============================================================================
// 5. MEMBERS DIRECTORY & MODAL
// ============================================================================

function renderMembersList() {
  const membersContainer = document.getElementById('membersListContainer');
  if (!membersContainer) return;

  const mentors = COMMUNITY_MEMBERS.filter(m => m.level === 'Mentor');
  const proTraders = COMMUNITY_MEMBERS.filter(m => m.level.includes('Level 4') || m.level.includes('Level 5'));
  const activeMembers = COMMUNITY_MEMBERS.filter(m => m.level.includes('Level 1') || m.level.includes('Level 2') || m.level.includes('Level 3'));

  let html = `
    <div class="members-category-group">
      <div class="members-role-header">⭐ Mentors & Mods (${mentors.length})</div>
      <ul class="members-list">
        ${mentors.map(m => renderMemberItemHtml(m)).join('')}
      </ul>
    </div>

    <div class="members-category-group">
      <div class="members-role-header">🏆 Pro Traders Level 4-5 (${proTraders.length})</div>
      <ul class="members-list">
        ${proTraders.map(m => renderMemberItemHtml(m)).join('')}
      </ul>
    </div>

    <div class="members-category-group">
      <div class="members-role-header">🟢 Active Traders (${activeMembers.length})</div>
      <ul class="members-list">
        ${activeMembers.map(m => renderMemberItemHtml(m)).join('')}
      </ul>
    </div>
  `;

  membersContainer.innerHTML = html;
}

function renderMemberItemHtml(member) {
  return `
    <li class="member-item" onclick="openMemberModal('${member.name}')">
      <div class="member-item-left">
        <div class="member-avatar-wrap">
          <div class="member-avatar" style="background: ${member.avatarBg};">${member.avatar}</div>
          <span class="status-dot ${member.status}"></span>
        </div>
        <div style="display: flex; flex-direction: column; line-height: 1.2;">
          <span class="member-name">${member.name}</span>
          <span class="member-status-label">${member.role}</span>
        </div>
      </div>
    </li>
  `;
}

function openMemberModal(memberName) {
  const member = COMMUNITY_MEMBERS.find(m => m.name.toLowerCase() === memberName.toLowerCase()) || {
    name: memberName,
    role: 'Trader',
    avatar: '👤',
    avatarBg: '#0f172a',
    winRate: '60%',
    tradesCount: '100+',
    bio: 'Dedicated trader on TradeLab mastering Price Action and Risk Management.',
    badge: 'Trader'
  };

  const modalBody = document.getElementById('memberModalBody');
  if (!modalBody) return;

  modalBody.innerHTML = `
    <div class="member-preview-card">
      <div class="preview-avatar-large" style="background: ${member.avatarBg};">${member.avatar}</div>
      <h3 class="preview-name">${member.name}</h3>
      <div class="preview-role">${member.role} • ${member.statusText || '🟢 Online'}</div>
      
      <div class="preview-stats-grid">
        <div class="preview-stat-item">
          <div class="preview-stat-val">${member.winRate || '64%'}</div>
          <div class="preview-stat-lbl">Win Rate</div>
        </div>
        <div class="preview-stat-item">
          <div class="preview-stat-val">${member.tradesCount || '150+'}</div>
          <div class="preview-stat-lbl">Analyses Logged</div>
        </div>
        <div class="preview-stat-item">
          <div class="preview-stat-val">1:2.8</div>
          <div class="preview-stat-lbl">Avg R:R</div>
        </div>
      </div>

      <p class="preview-bio">${member.bio}</p>

      <div style="display: flex; gap: 10px; justify-content: center;">
        <button class="btn-modal-submit" onclick="closeModal('memberModal'); filterByAuthor('${member.name}');">View Analyses</button>
        <button class="btn-modal-cancel" onclick="closeModal('memberModal'); showToast('Direct messaging coming in TradeLab Alpha 2.0!');">Direct Message</button>
      </div>
    </div>
  `;

  openModal('memberModal');
}

function filterByAuthor(name) {
  store.searchQuery = name;
  const searchInput = document.getElementById('headerSearchInput');
  if (searchInput) searchInput.value = name;
  renderFeed();
}

// ============================================================================
// 6. MARKET SENTIMENT BAROMETER
// ============================================================================

function renderSentimentBarometer() {
  const fill = document.getElementById('sentimentBarFill');
  const bullishPct = document.getElementById('sentimentBullishPct');
  const bearishPct = document.getElementById('sentimentBearishPct');

  if (!fill || !bullishPct || !bearishPct) return;

  const total = store.sentimentData.bullish + store.sentimentData.bearish;
  const bullPct = Math.round((store.sentimentData.bullish / total) * 100);
  const bearPct = 100 - bullPct;

  fill.style.width = `${bullPct}%`;
  bullishPct.textContent = `${bullPct}% Bullish`;
  bearishPct.textContent = `${bearPct}% Bearish`;
}

function voteBullish() {
  store.voteSentiment('bull');
  renderSentimentBarometer();
  showToast('Voted Bullish! 🐂 Community sentiment updated.');
}

function voteBearish() {
  store.voteSentiment('bear');
  renderSentimentBarometer();
  showToast('Voted Bearish! 🐻 Community sentiment updated.');
}

// ============================================================================
// 7. CREATE POST MODAL & EDUCATIONAL ANALYSIS BUILDER
// ============================================================================

function openCreatePostModal(presetChannel) {
  if (presetChannel) {
    const channelSelect = document.getElementById('postChannelSelect');
    if (channelSelect) channelSelect.value = presetChannel;
  }
  openModal('createPostModal');
}

function initSetupBuilderPreview() {
  const toggle = document.getElementById('includeSetupToggle');
  const setupFields = document.getElementById('setupFieldsArea');
  if (toggle && setupFields) {
    toggle.addEventListener('change', () => {
      setupFields.style.display = toggle.checked ? 'grid' : 'none';
    });
  }
}

function handleCreatePostSubmit(e) {
  if (e) e.preventDefault();

  const contentInput = document.getElementById('postContentInput');
  const channelSelect = document.getElementById('postChannelSelect');
  const tagsInput = document.getElementById('postTagsInput');
  const includeAnalysis = document.getElementById('includeSetupToggle')?.checked;
  const user = store.getUserProfile();

  if (!contentInput || contentInput.value.trim() === '') {
    alert('Please enter post text or question.');
    return;
  }

  const selectedChannel = channelSelect ? channelSelect.value : store.currentChannel;
  const rawTags = tagsInput ? tagsInput.value.trim() : '';
  const parsedTags = rawTags ? rawTags.split(',').map(t => t.trim().startsWith('#') ? t.trim() : '#' + t.trim()) : ['#EducationalAnalysis', '#TradeLab'];

  let analysisData = null;
  let chartType = null;

  if (includeAnalysis) {
    const asset = document.getElementById('setupAssetInput')?.value || 'BTCUSDT';
    const timeframe = document.getElementById('setupTimeframeInput')?.value || '15m';
    const setupModel = document.getElementById('setupModelInput')?.value || 'Liquidity sweep + BOS';
    const entry = document.getElementById('setupEntryInput')?.value || '104,250';
    const invalidation = document.getElementById('setupSlInput')?.value || '103,800';
    const target = document.getElementById('setupTpInput')?.value || '105,200';
    const rr = document.getElementById('setupRrInput')?.value || '1 : 2.1';

    analysisData = {
      asset: asset,
      timeframe: timeframe,
      setup: setupModel,
      entry: entry,
      invalidation: invalidation,
      target: target,
      rr: rr
    };
    chartType = 'user-custom';
  }

  const newPost = {
    id: 'post-' + Date.now(),
    channel: selectedChannel,
    pinned: false,
    author: {
      name: user.name,
      avatar: user.avatar,
      avatarBg: '#0f172a',
      level: user.level,
      levelClass: user.levelClass
    },
    time: 'Just now',
    timestamp: Date.now(),
    content: contentInput.value.trim(),
    tags: parsedTags,
    isEducationalAnalysis: !!analysisData,
    analysisType: 'Educational Chart Analysis',
    disclaimer: '⚠️ Educational discussion — not a trade signal.',
    analysis: analysisData,
    chartType: chartType,
    agreeCount: 1,
    disagreeCount: 0,
    userVote: 'agree',
    reactions: { heart: 1, fire: 1, rocket: 0, brain: 0 },
    userReactions: { heart: true },
    thread: {
      rootQuestion: {
        id: 'node-root-' + Date.now(),
        author: user.name,
        avatar: user.avatar,
        avatarBg: '#0f172a',
        level: user.level,
        levelClass: user.levelClass,
        time: 'Just now',
        text: contentInput.value.trim()
      },
      replies: []
    }
  };

  store.addPost(newPost);
  closeModal('createPostModal');

  // Reset form
  contentInput.value = '';
  if (tagsInput) tagsInput.value = '';

  store.currentChannel = selectedChannel;
  renderChannelList();
  renderFeed();

  showToast('Educational Analysis published to #' + selectedChannel + '! 🎉');
}

// ============================================================================
// 8. MODAL & DRAWER HELPERS
// ============================================================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

function toggleMobileChannels() {
  const sidebar = document.getElementById('sidebarChannels');
  if (sidebar) sidebar.classList.toggle('open');
}

function closeMobileDrawers() {
  const sidebar = document.getElementById('sidebarChannels');
  if (sidebar) sidebar.classList.remove('open');
}

function showToast(message) {
  const existingToast = document.querySelector('.toast-notice');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notice';
  toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function toggleNotificationsDropdown() {
  showToast('🔔 No new unread notifications. You are all caught up!');
}

function openWeeklyChallengeSubmit() {
  openCreatePostModal('chart-lab');
  const contentInput = document.getElementById('postContentInput');
  const tagsInput = document.getElementById('postTagsInput');
  const includeSetup = document.getElementById('includeSetupToggle');

  if (contentInput) contentInput.value = `📊 **BTCUSDT — Possible liquidity sweep**\nLooking at 15m chart after higher timeframe liquidity sweep. Invalidation is clearly defined.`;
  if (tagsInput) tagsInput.value = '#WeeklyChallenge, #EducationalAnalysis, #LiquiditySweep';
  if (includeSetup) {
    includeSetup.checked = true;
    const setupFields = document.getElementById('setupFieldsArea');
    if (setupFields) setupFields.style.display = 'grid';
  }
}

function initEventListeners() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    }
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
}
