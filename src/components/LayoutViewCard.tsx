import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

function LayoutViewCard({ children }: { children: React.ReactNode }) {
  return <Card className="w-full h-full py-3 gap-0">{children}</Card>;
}

function LayoutViewCardHeader({ children }: { children: React.ReactNode }) {
  return <CardHeader className="gap-0 px-2">{children}</CardHeader>;
}

function LayoutViewCardContent({ children }: { children: React.ReactNode }) {
  return (
    <CardContent className="px-0 h-full overflow-y-auto">
      <ScrollArea className="h-full px-4">{children}</ScrollArea>
    </CardContent>
  );
}

function LayoutViewCardFooter({ children }: { children: React.ReactNode }) {
  return <CardFooter className="gap-0 px-4 py-2">{children}</CardFooter>;
}

export {
  LayoutViewCard,
  LayoutViewCardContent,
  LayoutViewCardFooter,
  LayoutViewCardHeader,
};
