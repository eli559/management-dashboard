import { Badge } from "./Badge";
import { getEventLabel } from "@/lib/event-labels";

interface EventBadgeProps {
  eventName: string;
}

export function EventBadge({ eventName }: EventBadgeProps) {
  return <Badge>{getEventLabel(eventName)}</Badge>;
}
