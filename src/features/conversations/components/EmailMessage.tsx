import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Maximize2, MoreHorizontal, ReplyIcon, Star } from 'lucide-react';
import type { EmailMessage as EmailMessageType } from '../types';

interface EmailMessageProps {
  message: EmailMessageType;
}

const EmailMessage = ({ message }: EmailMessageProps) => {
  return (
    <Card className="w-full mx-auto shadow-sm p-0 rounded-lg">
      <CardContent className="p-0">
        {/* Header with subject and expand icon */}
        <div className="flex items-center justify-between px-3 pt-2">
          <h3 className="text-base font-medium text-gray-900 flex-1">
            {message.subject}
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
            {message.threadCount}
          </Badge>
        </div>

        {/* Message content */}
        <div className="p-4">
          {/* Sender info and actions */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={message.sender.avatar}
                  alt={message.sender.name}
                />
                <AvatarFallback>{message.sender.initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-gray-900">
                  {message.sender.name}
                </div>
                <div className="text-sm text-gray-500">
                  To: {message.recipient}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{message.timestamp}</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Star
                  className={`h-4 w-4 ${message.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`}
                />
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
            <p className="text-gray-900">{message.content.greeting}</p>

            <div className="space-y-2">
              <p className="text-gray-900 font-medium">
                {message.content.title}
              </p>
              <p className="text-gray-700">{message.content.body}</p>
            </div>

            <div className="pt-2">
              <Button
                variant="link"
                className="p-0 h-auto text-blue-600 hover:text-blue-700"
              >
                {message.content.actionText}
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
