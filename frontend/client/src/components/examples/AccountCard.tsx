import AccountCard from '../AccountCard';

// todo: remove mock functionality
const mockAccount = {
  account_id: '1',
  name: 'Chase Checking',
  subtype: 'checking',
  mask: '1234',
  balances: {
    current: 5420.50,
    available: 5420.50,
    iso_currency_code: 'USD'
  }
};

export default function AccountCardExample() {
  return <AccountCard account={mockAccount} />;
}
