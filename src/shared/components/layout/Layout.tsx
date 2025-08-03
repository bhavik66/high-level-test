interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const Layout = ({ children, className }: LayoutProps) => {
  return (
    <div className={`w-full h-full overflow-y-auto ${className}`}>
      {children}
    </div>
  );
};

export default Layout;
