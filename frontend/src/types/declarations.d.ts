/// <reference types="react" />

declare module 'react-router' {
  export function BrowserRouter(props: {
    children?: React.ReactNode;
    [key: string]: any;
  }): JSX.Element;
  export function Routes(props: {
    children?: React.ReactNode;
    [key: string]: any;
  }): JSX.Element;
  export function Route(props: {
    path?: string;
    element?: React.ReactNode;
    [key: string]: any;
  }): JSX.Element;
  export function Link(props: {
    to: string;
    [key: string]: any;
  }): JSX.Element;
  export function Navigate(props: {
    to: string;
    replace?: boolean;
    [key: string]: any;
  }): JSX.Element;
  export function Outlet(props?: {
    [key: string]: any;
  }): JSX.Element | null;
  export function useLocation(): {
    pathname: string;
    [key: string]: any;
  };
  export function useNavigate(): (
    to: string,
    options?: { replace?: boolean }
  ) => void;
  export function useParams(): { [key: string]: string | undefined };
  export function useMatch(): {
    pathname: string;
    params: { [key: string]: string };
    [key: string]: any;
  } | null;
}

declare module '@mui/icons-material' {
  export const Visibility: React.ComponentType<any>;
  export const VisibilityOff: React.ComponentType<any>;
}

declare module '@mui/icons-material/Menu' {
  const Menu: React.ComponentType<any>;
  export default Menu;
}
declare module '@mui/icons-material/Dashboard' {
  const Dashboard: React.ComponentType<any>;
  export default Dashboard;
}
declare module '@mui/icons-material/ShowChart' {
  const ShowChart: React.ComponentType<any>;
  export default ShowChart;
}
declare module '@mui/icons-material/TrendingUp' {
  const TrendingUp: React.ComponentType<any>;
  export default TrendingUp;
}
declare module '@mui/icons-material/AccountBalanceWallet' {
  const AccountBalanceWallet: React.ComponentType<any>;
  export default AccountBalanceWallet;
}
declare module '@mui/icons-material/MoneyOff' {
  const MoneyOff: React.ComponentType<any>;
  export default MoneyOff;
}
declare module '@mui/icons-material/CheckCircleOutline' {
  const CheckCircleOutline: React.ComponentType<any>;
  export default CheckCircleOutline;
}
declare module '@mui/icons-material/SignalCellularAlt' {
  const SignalCellularAlt: React.ComponentType<any>;
  export default SignalCellularAlt;
}
declare module '@mui/icons-material/ContentCopy' {
  const ContentCopy: React.ComponentType<any>;
  export default ContentCopy;
}
declare module '@mui/icons-material/ShoppingCart' {
  const ShoppingCart: React.ComponentType<any>;
  export default ShoppingCart;
}
declare module '@mui/icons-material/History' {
  const History: React.ComponentType<any>;
  export default History;
}
declare module '@mui/icons-material/Person' {
  const Person: React.ComponentType<any>;
  export default Person;
}
declare module '@mui/icons-material/LockReset' {
  const LockReset: React.ComponentType<any>;
  export default LockReset;
}
declare module '@mui/icons-material/SupportAgent' {
  const SupportAgent: React.ComponentType<any>;
  export default SupportAgent;
}
declare module '@mui/icons-material/Logout' {
  const Logout: React.ComponentType<any>;
  export default Logout;
}
