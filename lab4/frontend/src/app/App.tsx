import RootRoutes from "./router/RootRoutes";

import AuthProvider from "./providers/AuthProvider";
import QueryProvider from "./providers/QueryProvider";
import SocketProvider from "./providers/SocketProvider";
import ThemeProvider from "./providers/ThemeProvider";
import NotificationProvider from "./providers/NotificationProvider";
import I18nProvider from "./providers/I18nProvider";

export default function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <NotificationProvider>
          <QueryProvider>
            <AuthProvider>
              <SocketProvider>
                <RootRoutes />
              </SocketProvider>
            </AuthProvider>
          </QueryProvider>
        </NotificationProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
