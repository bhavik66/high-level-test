import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/shared/components/ui/card';
import { ScrollArea } from '@/shared/components/ui/scroll-area';

function LayoutViewCard({ children }: { children: React.ReactNode }) {
  return (
    <Card className="w-full h-full pt-1 pb-4 gap-0 rounded-2xl shadow-none">
      {children}
    </Card>
  );
}

function LayoutViewCardHeader({ children }: { children: React.ReactNode }) {
  return <CardHeader className="gap-0 py-2 px-4">{children}</CardHeader>;
}

function LayoutViewCardContent({ children }: { children: React.ReactNode }) {
  return (
    <CardContent className="px-0 h-full overflow-y-auto">
      <ScrollArea className="h-full px-4">{children}</ScrollArea>
    </CardContent>
  );
}

function LayoutViewCardFooter({ children }: { children: React.ReactNode }) {
  return <CardFooter className="gap-0 px-4">{children}</CardFooter>;
}

export {
  LayoutViewCard,
  LayoutViewCardContent,
  LayoutViewCardFooter,
  LayoutViewCardHeader,
};
