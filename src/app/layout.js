import './globals.css';

import Providers from './Provider/Provider';
import { SocketProvider } from './socketcontext/SocketContext';
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers><SocketProvider>{children}</SocketProvider></Providers>
      </body>
    </html>
  );
}
