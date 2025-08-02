import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, Phone, Plus, X } from 'lucide-react';

const ContactCard = () => {
  return (
    <Card className="w-full mx-auto shadow-none rounded-lg mb-3 py-4">
      <CardContent className="px-4">
        {/* Header with profile info and call button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage
                src="https://avatar.iran.liara.run/public"
                alt="Olivia John"
              />
              <AvatarFallback>OJ</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold text-gray-900">Olivia John</h2>
          </div>
          <Button
            size="icon"
            className="bg-green-100 hover:bg-green-200 text-gray-700 rounded-lg w-12 h-12"
          >
            <Phone className="w-6 h-6" />
          </Button>
        </div>

        {/* Owner and Followers section */}
        <div className="grid grid-cols-2 gap-6 mb-4">
          {/* Owner */}
          <div>
            <h3 className="text-base font-medium text-gray-500 mb-2">Owner</h3>
            <div className="flex items-center gap-2 rounded-full px-1 py-1 border">
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src="https://avatar.iran.liara.run/public"
                  alt="Devon Lane"
                />
                <AvatarFallback>DL</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700">
                Devon Lane
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
            </div>
          </div>

          {/* Followers */}
          <div>
            <h3 className="text-base font-medium text-gray-500 mb-2">
              Followers
            </h3>
            <div className="flex items-center gap-1 rounded-full px-1 py-1 border w-fit">
              <div className="flex -space-x-2">
                <Avatar className="w-6 h-6 border-2 border-white">
                  <AvatarImage
                    src="https://avatar.iran.liara.run/public"
                    alt="Follower 1"
                  />
                  <AvatarFallback>F1</AvatarFallback>
                </Avatar>
                <Avatar className="w-6 h-6 border-2 border-white">
                  <AvatarImage
                    src="https://avatar.iran.liara.run/public"
                    alt="Follower 2"
                  />
                  <AvatarFallback>F2</AvatarFallback>
                </Avatar>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
            </div>
          </div>
        </div>

        {/* Tags section */}
        <div>
          <h3 className="text-base font-medium text-gray-500 mb-1">Tags</h3>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              variant="secondary"
              className="bg-sky-50 text-sky-700 hover:bg-sky-200 px-3 py-1"
            >
              Shared Contact
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0 hover:bg-blue-200"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
            <Badge
              variant="secondary"
              className="bg-sky-50 text-sky-700 hover:bg-sky-200 px-3 py-1"
            >
              VIP
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0 hover:bg-sky-200"
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
            <Badge
              variant="secondary"
              className="bg-sky-50 text-sky-700 hover:bg-sky-200 px-3 py-1"
            >
              +15
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 border-gray-300 hover:bg-gray-50 bg-sky-50 border-0"
            >
              <Plus className="w-4 h-4 text-sky-700" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
