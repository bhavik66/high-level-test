interface LayoutContainerProps {
  children: React.ReactNode;
  className?: string;
}

const LayoutContainer = ({ children, className }: LayoutContainerProps) => {
  return (
    <div
      className={`w-full h-full flex flex-col bg-white rounded-lg py-2 px-4 ${className}`}
    >
      {children}
    </div>
  );
};

export default LayoutContainer;
