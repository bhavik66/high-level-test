import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

function LayoutViewCard({ children }: { children: React.ReactNode }) {
  return <Card className="w-full h-full py-2 gap-0">{children}</Card>;
}

function LayoutViewCardHeader({ children }: { children: React.ReactNode }) {
  return <CardHeader className="gap-0 pl-4 pr-2 py-1">{children}</CardHeader>;
}

function LayoutViewCardContent({ children }: { children: React.ReactNode }) {
  return (
    <CardContent className="px-0 h-full overflow-y-auto">
      <ScrollArea className="h-full px-4">{children}</ScrollArea>
    </CardContent>
  );
}

export { LayoutViewCard, LayoutViewCardContent, LayoutViewCardHeader };
