import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

function FeatureCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="w-full h-full pt-1 pb-4 gap-0 rounded-2xl shadow-none">
      {children}
    </Card>
  );
}

function FeatureCardHeader({ children }: { children: React.ReactNode }) {
  return <CardHeader className="gap-0 py-2 px-4">{children}</CardHeader>;
}

function FeatureCardContent({
  children,
  scrollable = true,
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <CardContent className="px-0 h-full overflow-y-auto">
      {scrollable ? (
        <ScrollArea className="h-full px-4">{children}</ScrollArea>
      ) : (
        <div className="h-full px-4">{children}</div>
      )}
    </CardContent>
  );
}

function FeatureCardFooter({ children }: { children: React.ReactNode }) {
  return <CardFooter className="gap-0 px-4">{children}</CardFooter>;
}

export {
  FeatureCard,
  FeatureCardContent,
  FeatureCardFooter,
  FeatureCardHeader,
};
