import { useState, useCallback, useEffect } from 'react';
import { Button, App } from 'antd';

/**
 * Login Component
 * Faithful, pixel-perfect translation of Main.dc.html
 * Inherits global Ant Design ConfigProvider from main.jsx
 */
const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');
    return name ? { name } : null;
  });
  const { message } = App.useApp();

  // URL parameters check on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const userName = params.get('name');

    if (userName) {
      message.success({ content: `Welcome, ${userName}!`, key: 'auth_msg' });
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (error === 'access_denied') {
      message.warning({
        content: 'Sign-in was cancelled by user.',
        key: 'auth_error',
        duration: 3,
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [message]);

  const handleGoogleLogin = useCallback(async () => {
    setIsLoading(true);
    try {
      message.loading({ content: 'Redirecting to Google authentication...', key: 'login_msg', duration: 1.5 });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      window.location.href = 'http://localhost:8081/oauth/google';
    } catch (err) {
      console.error('Authentication error:', err);
      message.error({ content: 'Failed to initiate Google sign-in. Please try again.', key: 'login_msg' });
    } finally {
      setIsLoading(false);
    }
  }, [message]);

  const handleSignOut = useCallback(() => {
    setUser(null);
    message.info({ content: 'Signed out successfully.', key: 'auth_msg' });
  }, [message]);

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#fafaf8] p-4 font-sans text-[#1c1c1a]">
      <div className="w-full max-w-[400px] bg-white border border-[#e6e6e1] rounded-[12px] p-10 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        {/* Brand Logo with Certificate Badge Icon */}
        <div className="text-[20px] font-semibold text-[#1f5f5b] tracking-tight select-none inline-flex items-center justify-center gap-1.5">
          <i className="bi bi-patch-check-fill text-[#1f5f5b] text-[18px]" aria-hidden="true" />
          <span>Certify</span>
        </div>

        {/* Heading */}
        <h1 className="text-[24px] font-semibold text-[#1c1c1a] mt-6 mb-2 tracking-tight">
          {user ? 'Welcome back' : 'Sign in'}
        </h1>

        {/* Subtitle */}
        <p className="text-[13px] text-[#6b6b66] leading-relaxed m-0 mb-7">
          {user ? `Logged in as ${user.name}` : 'Issue and verify certificates for your institute.'}
        </p>

        {/* Conditional Action: User card when logged in, Google button when signed out */}
        <div className="w-full">
          {user ? (
            <div className="flex flex-col gap-3">
              <div className="p-3 bg-[#eef3f2] text-[#1f5f5b] rounded-[8px] text-[14px] font-medium flex items-center justify-center gap-2">
                <i className="bi bi-person-circle text-[18px]" />
                <span>{user.name}</span>
              </div>
              <Button
                danger
                block
                onClick={handleSignOut}
                className="h-10! rounded-[8px]!"
              >
                Sign out
              </Button>
            </div>
          ) : (
            <Button
              type="primary"
              size="large"
              block
              loading={isLoading}
              icon={!isLoading ? <i className="bi bi-google text-[15px] leading-none" aria-hidden="true" /> : undefined}
              onClick={handleGoogleLogin}
              className="h-10! rounded-[8px]! text-[14px]! font-medium! bg-[#1f5f5b]! hover:bg-[#174744]! active:bg-[#113533]! border-[#1f5f5b]! hover:border-[#174744]! transition-colors duration-150 flex items-center justify-center shadow-none!"
              aria-label="Continue with Google"
            >
              Continue with Google
            </Button>
          )}
        </div>

        {/* Footer Assistance */}
        {!user && (
          <p className="text-[13px] text-[#6b6b66] leading-relaxed mt-6 mb-0">
            Received a certificate? Use the link in your email.
          </p>
        )}
      </div>
    </main>
  );
};

export default Login;
