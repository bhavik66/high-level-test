import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Maximize2, MoreHorizontal, ReplyIcon, Star } from 'lucide-react';

const EmailMessage = () => {
  return (
    <Card className="w-full mx-auto shadow-sm p-0 rounded-lg">
      <CardContent className="p-0">
        {/* Header with subject and expand icon */}
        <div className="flex items-center justify-between px-3 pt-2">
          <h3 className="text-base font-medium text-gray-900 flex-1">
            Set up a new time to follow up on the mail chain issue that we
            talked about the...
          </h3>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Thread count badge */}
        <div className="flex justify-center relative">
          <div className="absolute top-[50%] right-0 border-b border-gray-200 w-full"></div>
          <Badge
            variant="outline"
            className="rounded-full w-5 h-5 flex items-center justify-center text-gray-600 border-gray-600 bg-background z-10"
          >
            3
          </Badge>
        </div>

        {/* Message content */}
        <div className="p-4">
          {/* Sender info and actions */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src="https://avatar.iran.liara.run/public"
                  alt="Olivia John"
                />
                <AvatarFallback>OJ</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-gray-900">Olivia John</div>
                <div className="text-sm text-gray-500">To: Me</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>5 min ago</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Star className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ReplyIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Email body */}
          <div className="space-y-4 mb-6">
            <p className="text-gray-900">Hey John,</p>

            <div className="space-y-2">
              <p className="text-gray-900 font-medium">
                You Order has reached.
              </p>
              <p className="text-gray-700">
                Your Urban Wellness LLP order has arrived in your city, Click
                the button below to track your order in real-time. Arriving on
                Tuesday, November 19th.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="link"
                className="p-0 h-auto text-blue-600 hover:text-blue-700"
              >
                Track Your Order
              </Button>
            </div>
          </div>

          {/* Reply button */}
          <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            <ReplyIcon className="w-4 h-4 ml-1" />
            Reply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailMessage;
