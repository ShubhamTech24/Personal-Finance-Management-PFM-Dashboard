interface PlaidLinkHandler {
  open: () => void;
  exit: () => void;
}

interface PlaidLinkOptions {
  token: string;
  onSuccess: (public_token: string, metadata: any) => void;
  onExit?: (err: any, metadata: any) => void;
  onEvent?: (eventName: string, metadata: any) => void;
}

interface PlaidLinkStatic {
  create: (options: PlaidLinkOptions) => PlaidLinkHandler;
}

interface Window {
  Plaid: PlaidLinkStatic;
}
