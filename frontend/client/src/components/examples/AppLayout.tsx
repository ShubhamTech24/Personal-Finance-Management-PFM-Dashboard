import AppLayout from '../AppLayout';

export default function AppLayoutExample() {
  return (
    <AppLayout
      onLogout={() => console.log('Logout clicked')}
      onLinkBank={() => console.log('Link bank clicked')}
    >
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Dashboard Content</h1>
        <p className="text-muted-foreground">Main content area goes here</p>
      </div>
    </AppLayout>
  );
}
